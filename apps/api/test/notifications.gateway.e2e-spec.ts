import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { io, Socket } from 'socket.io-client';
import { AppModule } from './../src/app.module';
const cookieParser = require('cookie-parser');
import { PrismaService } from '../src/prisma/prisma.service';
import { RedisService } from '../src/redis/redis.service';
import { NotificationsService } from '../src/notifications/notifications.service';

describe('NotificationsGateway (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let notificationsService: NotificationsService;
  let port: number;

  let userAId: string;
  let userBId: string;
  const tokenA = 'gw_token_a_123';
  const tokenB = 'gw_token_b_456';
  const usernameA = 'gw_user_a';
  const usernameB = 'gw_user_b';

  function connect(token?: string): Socket {
    return io(`http://localhost:${port}`, {
      transports: ['websocket'],
      reconnection: false,
      timeout: 2000,
      extraHeaders: token ? { Cookie: `session_id=${token}` } : {},
    });
  }

  function waitForConnect(socket: Socket): Promise<void> {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('connect timeout')), 3000);
      socket.once('connect', () => {
        clearTimeout(timer);
        resolve();
      });
      socket.once('connect_error', (err) => {
        clearTimeout(timer);
        reject(err);
      });
    });
  }

  function waitForEvent(socket: Socket, event: string, timeoutMs = 2000): Promise<any> {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error(`timeout waiting for ${event}`)), timeoutMs);
      socket.once(event, (data) => {
        clearTimeout(timer);
        resolve(data);
      });
    });
  }

  function assertNoEvent(socket: Socket, event: string, timeoutMs = 700): Promise<void> {
    return new Promise((resolve, reject) => {
      const handler = () => {
        clearTimeout(timer);
        socket.off(event, handler);
        reject(new Error(`unexpected ${event}`));
      };
      const timer = setTimeout(() => {
        socket.off(event, handler);
        resolve();
      }, timeoutMs);
      socket.once(event, handler);
    });
  }

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.use(cookieParser());
    app.setGlobalPrefix('api/v1');
    app.useWebSocketAdapter(new IoAdapter(app));
    await app.init();

    prisma = app.get(PrismaService);
    notificationsService = app.get(NotificationsService);

    // Clear stale Redis session cache for the fixed tokens so authentication
    // resolves the freshly-created users instead of ids deleted by a prior run
    // (which would make the socket join a different room than the notification).
    const redis = app.get(RedisService).getClient();
    await redis.del(`session:${tokenA}`, `session:${tokenB}`);

    await prisma.user.deleteMany({
      where: { developerProfile: { username: { in: [usernameA, usernameB] } } },
    });

    const userA = await prisma.user.create({
      data: {
        email: 'gwa@test.com',
        developerProfile: { create: { username: usernameA, displayName: 'Gateway A' } },
        sessions: { create: { token: tokenA, expiresAt: new Date(Date.now() + 1000000) } },
      },
    });
    userAId = userA.id;

    const userB = await prisma.user.create({
      data: {
        email: 'gwb@test.com',
        developerProfile: { create: { username: usernameB, displayName: 'Gateway B' } },
        sessions: { create: { token: tokenB, expiresAt: new Date(Date.now() + 1000000) } },
      },
    });
    userBId = userB.id;

    await app.listen(0);
    const address = app.getHttpServer().address();
    port = typeof address === 'object' && address ? address.port : 0;
  });

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { id: { in: [userAId, userBId] } } });
    await app.close();
  });

  it('accepts an authenticated connection', async () => {
    const socket = connect(tokenA);
    await waitForConnect(socket);
    expect(socket.connected).toBe(true);
    socket.close();
  });

  it('rejects an unauthenticated connection', async () => {
    const socket = connect(); // no cookie
    const disconnected = new Promise<string>((resolve) => {
      socket.once('disconnect', (reason) => resolve(reason));
    });
    const reason = await Promise.race([
      disconnected,
      new Promise<string>((_, reject) => setTimeout(() => reject(new Error('disconnect timeout')), 3000)),
    ]);
    expect(reason).toBe('io server disconnect');
    socket.close();
  });

  it('delivers notification.created to the correct user', async () => {
    const socketA = connect(tokenA);
    await waitForConnect(socketA);

    const received = waitForEvent(socketA, 'notification.created');
    const created = await notificationsService.create({
      userId: userAId,
      type: 'SYSTEM',
      title: 'Delivery Test',
      message: 'Real-time payload',
    });

    const payload = await received;
    expect(payload.id).toBe(created.id);
    expect(payload.userId).toBe(userAId);
    expect(payload.message).toBe('Real-time payload');

    socketA.close();
    await prisma.notification.delete({ where: { id: created.id } });
  });

  it('does not deliver a notification to another user', async () => {
    const socketA = connect(tokenA);
    const socketB = connect(tokenB);
    await waitForConnect(socketA);
    await waitForConnect(socketB);

    const receivedA = waitForEvent(socketA, 'notification.created');
    const noEventB = assertNoEvent(socketB, 'notification.created');

    const created = await notificationsService.create({
      userId: userAId,
      type: 'SYSTEM',
      title: 'Private Test',
      message: 'Only A should see this',
    });

    const payloadA = await receivedA;
    expect(payloadA.userId).toBe(userAId);
    await noEventB;

    socketA.close();
    socketB.close();
    await prisma.notification.delete({ where: { id: created.id } });
  });

  it('delivers to multiple connections of the same user', async () => {
    const socketA1 = connect(tokenA);
    const socketA2 = connect(tokenA);
    await waitForConnect(socketA1);
    await waitForConnect(socketA2);

    const received1 = waitForEvent(socketA1, 'notification.created');
    const received2 = waitForEvent(socketA2, 'notification.created');

    const created = await notificationsService.create({
      userId: userAId,
      type: 'SYSTEM',
      title: 'Multi Test',
      message: 'Both sockets receive',
    });

    const [p1, p2] = await Promise.all([received1, received2]);
    expect(p1.id).toBe(created.id);
    expect(p2.id).toBe(created.id);

    socketA1.close();
    socketA2.close();
    await prisma.notification.delete({ where: { id: created.id } });
  });

  it('stops delivering after disconnect', async () => {
    const socketA = connect(tokenA);
    await waitForConnect(socketA);

    socketA.disconnect();
    await new Promise((r) => setTimeout(r, 100));

    const created = await notificationsService.create({
      userId: userAId,
      type: 'SYSTEM',
      title: 'Post-disconnect Test',
      message: 'Should not be received',
    });

    // The disconnected socket must not receive the event.
    await assertNoEvent(socketA, 'notification.created');
    socketA.close();
    await prisma.notification.delete({ where: { id: created.id } });
  });
});
