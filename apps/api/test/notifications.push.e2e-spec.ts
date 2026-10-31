import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
const request = require('supertest');
import { AppModule } from './../src/app.module';
const cookieParser = require('cookie-parser');
import { PrismaService } from '../src/prisma/prisma.service';
import { provisionTestDb } from './test-db';

jest.setTimeout(180_000);
import { RedisService } from '../src/redis/redis.service';
import { NotificationsService } from '../src/notifications/notifications.service';
import { PushService } from '../src/notifications/push/push.service';

describe('PushNotifications (e2e)', () => {
  let teardown: () => Promise<void>;
  let app: INestApplication;
  let prisma: PrismaService;
  let pushService: PushService;
  let notificationsService: NotificationsService;

  let userAId: string;
  let userBId: string;
  const tokenA = 'push_token_a_123';
  const tokenB = 'push_token_b_456';
  const usernameA = 'push_user_a';
  const usernameB = 'push_user_b';

  const subA = {
    endpoint: 'https://push.example.com/a',
    keys: { p256dh: 'p256dh_a', auth: 'auth_a' },
  };
  const subB = {
    endpoint: 'https://push.example.com/b',
    keys: { p256dh: 'p256dh_b', auth: 'auth_b' },
  };
  const subC = {
    endpoint: 'https://push.example.com/c',
    keys: { p256dh: 'p256dh_c', auth: 'auth_c' },
  };

  beforeAll(async () => {
    teardown = await provisionTestDb('notifications.push');
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.use(cookieParser());
    app.setGlobalPrefix('api/v1');
    await app.init();

    prisma = app.get(PrismaService);
    pushService = app.get(PushService);
    notificationsService = app.get(NotificationsService);

    const redis = app.get(RedisService).getClient();
    await redis.del(`session:${tokenA}`, `session:${tokenB}`);

    await prisma.user.deleteMany({
      where: { developerProfile: { username: { in: [usernameA, usernameB] } } },
    });

    const userA = await prisma.user.create({
      data: {
        email: 'pusha@test.com',
        developerProfile: { create: { username: usernameA, displayName: 'Push A' } },
        sessions: { create: { token: tokenA, expiresAt: new Date(Date.now() + 1000000) } },
      },
    });
    userAId = userA.id;

    const userB = await prisma.user.create({
      data: {
        email: 'pushb@test.com',
        developerProfile: { create: { username: usernameB, displayName: 'Push B' } },
        sessions: { create: { token: tokenB, expiresAt: new Date(Date.now() + 1000000) } },
      },
    });
    userBId = userB.id;
  });

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { id: { in: [userAId, userBId] } } });
    await app.close();
    if (teardown) await teardown();
  });

  it('rejects unauthenticated subscription creation', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/v1/notifications/push/subscribe')
      .send(subA);
    expect(res.status).toBe(401);
  });

  it('creates a subscription for the authenticated user', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/v1/notifications/push/subscribe')
      .set('Cookie', [`session_id=${tokenA}`])
      .send(subA);
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);

    const stored = await prisma.pushSubscription.findUnique({
      where: { endpoint: subA.endpoint },
    });
    expect(stored).not.toBeNull();
    expect(stored?.userId).toBe(userAId);
  });

  it('handles a duplicate subscription safely (upsert)', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/v1/notifications/push/subscribe')
      .set('Cookie', [`session_id=${tokenA}`])
      .send(subA);
    expect(res.status).toBe(201);

    const count = await prisma.pushSubscription.count({
      where: { endpoint: subA.endpoint },
    });
    expect(count).toBe(1);
  });

  it('allows multiple subscriptions per user', async () => {
    await request(app.getHttpServer())
      .post('/api/v1/notifications/push/subscribe')
      .set('Cookie', [`session_id=${tokenA}`])
      .send(subB);
    await request(app.getHttpServer())
      .post('/api/v1/notifications/push/subscribe')
      .set('Cookie', [`session_id=${tokenA}`])
      .send(subC);

    const count = await prisma.pushSubscription.count({ where: { userId: userAId } });
    expect(count).toBe(3);
  });

  it('does not let a user delete another user\'s subscription', async () => {
    const res = await request(app.getHttpServer())
      .delete('/api/v1/notifications/push/subscribe')
      .set('Cookie', [`session_id=${tokenB}`])
      .send({ endpoint: subA.endpoint });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(false);

    const stored = await prisma.pushSubscription.findUnique({
      where: { endpoint: subA.endpoint },
    });
    expect(stored).not.toBeNull();
  });

  it('deletes the authenticated user\'s own subscription', async () => {
    const res = await request(app.getHttpServer())
      .delete('/api/v1/notifications/push/subscribe')
      .set('Cookie', [`session_id=${tokenA}`])
      .send({ endpoint: subC.endpoint });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    const stored = await prisma.pushSubscription.findUnique({
      where: { endpoint: subC.endpoint },
    });
    expect(stored).toBeNull();
  });

  it('rejects reassignment of an existing endpoint to a different user', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/v1/notifications/push/subscribe')
      .set('Cookie', [`session_id=${tokenB}`])
      .send({
        endpoint: subA.endpoint,
        keys: { p256dh: 'p256dh_hijack', auth: 'auth_hijack' },
      });
    expect(res.status).toBe(403);

    const stored = await prisma.pushSubscription.findUnique({
      where: { endpoint: subA.endpoint },
    });
    expect(stored?.userId).toBe(userAId);
    expect(stored?.p256dh).toBe('p256dh_a');
    expect(stored?.auth).toBe('auth_a');
  });

  it('lets the owner update their own subscription keys', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/v1/notifications/push/subscribe')
      .set('Cookie', [`session_id=${tokenA}`])
      .send({
        endpoint: subB.endpoint,
        keys: { p256dh: 'p256dh_b2', auth: 'auth_b2' },
      });
    expect(res.status).toBe(201);

    const stored = await prisma.pushSubscription.findUnique({
      where: { endpoint: subB.endpoint },
    });
    expect(stored?.userId).toBe(userAId);
    expect(stored?.p256dh).toBe('p256dh_b2');
    expect(stored?.auth).toBe('auth_b2');
  });

  it('grants a concurrently contested endpoint to exactly one user', async () => {
    const endpoint = 'https://push.example.com/race';

    const [resA, resB] = await Promise.all([
      request(app.getHttpServer())
        .post('/api/v1/notifications/push/subscribe')
        .set('Cookie', [`session_id=${tokenA}`])
        .send({ endpoint, keys: { p256dh: 'p256dh_a', auth: 'auth_a' } }),
      request(app.getHttpServer())
        .post('/api/v1/notifications/push/subscribe')
        .set('Cookie', [`session_id=${tokenB}`])
        .send({ endpoint, keys: { p256dh: 'p256dh_b', auth: 'auth_b' } }),
    ]);

    expect([resA.status, resB.status].sort()).toEqual([201, 403]);

    const stored = await prisma.pushSubscription.findUnique({
      where: { endpoint },
    });
    expect(stored).not.toBeNull();
    const winner = resA.status === 201 ? userAId : userBId;
    expect(stored?.userId).toBe(winner);

    await prisma.pushSubscription.delete({ where: { endpoint } });
  });

  it('triggers push delivery after notification persistence', async () => {
    const spy = jest.spyOn(pushService, 'sendForUser').mockResolvedValue(undefined);

    const created = await notificationsService.create({
      userId: userAId,
      type: 'SYSTEM',
      title: 'Push Test',
      message: 'Push triggered',
    });

    expect(spy).toHaveBeenCalledWith(userAId, expect.objectContaining({ id: created.id }));
    spy.mockRestore();
    await prisma.notification.delete({ where: { id: created.id } });
  });

  it('does not break notification creation when push delivery fails', async () => {
    const spy = jest.spyOn(pushService, 'sendForUser').mockRejectedValue(new Error('push down'));

    const created = await notificationsService.create({
      userId: userAId,
      type: 'SYSTEM',
      title: 'Push Failure Test',
      message: 'Should still persist',
    });

    expect(created).toBeDefined();
    expect(created.id).toBeTruthy();

    const stored = await prisma.notification.findUnique({ where: { id: created.id } });
    expect(stored).not.toBeNull();

    spy.mockRestore();
    await prisma.notification.delete({ where: { id: created.id } });
  });

  it('exposes the VAPID public key', async () => {
    const res = await request(app.getHttpServer()).get(
      '/api/v1/notifications/push/vapid-public-key',
    );
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('publicKey');
  });
});
