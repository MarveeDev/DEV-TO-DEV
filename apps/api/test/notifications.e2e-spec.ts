import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
const request = require('supertest');
import { AppModule } from './../src/app.module';
const cookieParser = require('cookie-parser');
import { PrismaService } from '../src/prisma/prisma.service';
import { RedisService } from '../src/redis/redis.service';
import { NotificationsService } from '../src/notifications/notifications.service';
import { NotificationEvents } from '../src/notifications/notification-events';

describe('NotificationsController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  
  let userAId: string;
  let userBId: string;
  let tokenA = 'notif_token_a_123';
  let tokenB = 'notif_token_b_456';
  let usernameA = 'user_a_notif';
  let usernameB = 'user_b_notif';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.use(cookieParser());
    app.setGlobalPrefix('api/v1');
    await app.init();
    
    prisma = app.get(PrismaService);

    // Clear stale Redis session cache for the fixed tokens. validateSession
    // re-warms these keys on a previous run and they would otherwise map to
    // users deleted by afterAll, causing a foreign-key violation here.
    const redis = app.get(RedisService).getClient();
    await redis.del(`session:${tokenA}`, `session:${tokenB}`);

    await prisma.user.deleteMany({ where: { developerProfile: { username: { in: [usernameA, usernameB] } } } });

    const userA = await prisma.user.create({
      data: {
        email: 'usera_n@test.com',
        developerProfile: { create: { username: usernameA, displayName: 'John' } },
        sessions: { create: { token: tokenA, expiresAt: new Date(Date.now() + 1000000) } }
      }
    });
    userAId = userA.id;

    const userB = await prisma.user.create({
      data: {
        email: 'userb_n@test.com',
        developerProfile: { create: { username: usernameB, displayName: 'Ama' } },
        sessions: { create: { token: tokenB, expiresAt: new Date(Date.now() + 1000000) } }
      }
    });
    userBId = userB.id;
  });

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { id: { in: [userAId, userBId] } } });
    await app.close();
  });

  let notifId: string;
  let connectionId: string;

  it('Account A sends connection request to B', async () => {
    const res = await request(app.getHttpServer())
      .post(`/api/v1/connections/${usernameB}`)
      .set('Cookie', [`session_id=${tokenA}`]);
    expect(res.status).toBe(201);
    connectionId = res.body.id;
  });

  it('Account B receives connection request notification', async () => {
    const res = await request(app.getHttpServer())
      .get(`/api/v1/notifications`)
      .set('Cookie', [`session_id=${tokenB}`]);
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
    const notif = res.body.find((n: any) => n.type === 'CONNECTION_REQUEST');
    expect(notif).toBeDefined();
    expect(notif.message).toContain('John wants to connect with you.');
    expect(notif.read).toBe(false);
    notifId = notif.id;
  });

  it('Account A cannot read Account B notifications', async () => {
    const res = await request(app.getHttpServer())
      .get(`/api/v1/notifications`)
      .set('Cookie', [`session_id=${tokenA}`]);
    expect(res.status).toBe(200);
    const notif = res.body.find((n: any) => n.id === notifId);
    expect(notif).toBeUndefined();
  });

  it('Account B marks notification as read', async () => {
    const res = await request(app.getHttpServer())
      .patch(`/api/v1/notifications/${notifId}/read`)
      .set('Cookie', [`session_id=${tokenB}`]);
    expect(res.status).toBe(200);
    expect(res.body.read).toBe(true);
  });

  it('Account A cannot mark Account B notification as read', async () => {
    const res = await request(app.getHttpServer())
      .patch(`/api/v1/notifications/${notifId}/read`)
      .set('Cookie', [`session_id=${tokenA}`]);
    expect(res.status).toBe(403);
  });

  it('Account B accepts the connection', async () => {
    const res = await request(app.getHttpServer())
      .patch(`/api/v1/connections/${connectionId}/accept`)
      .set('Cookie', [`session_id=${tokenB}`]);
    expect(res.status).toBe(200);
  });

  it('Account A receives connection accepted notification', async () => {
    const res = await request(app.getHttpServer())
      .get(`/api/v1/notifications`)
      .set('Cookie', [`session_id=${tokenA}`]);
    expect(res.status).toBe(200);
    const notif = res.body.find((n: any) => n.type === 'CONNECTION_ACCEPTED');
    expect(notif).toBeDefined();
    expect(notif.message).toContain('Ama accepted your connection request.');
  });

  it('emits a notification.created event after the notification is persisted', async () => {
    const events = app.get(NotificationEvents);
    const notificationsService = app.get(NotificationsService);

    const received: any[] = [];
    const unsubscribe = events.onNotificationCreated((event) => {
      received.push(event);
    });

    const created = await notificationsService.create({
      userId: userAId,
      type: 'SYSTEM',
      title: 'Foundation Test',
      message: 'Event emission test',
    });

    // The event must fire exactly once with the persisted notification.
    expect(received.length).toBe(1);
    expect(received[0].userId).toBe(userAId);
    expect(received[0].notification.id).toBe(created.id);

    // Persistence must happen (notification is stored in the database).
    const stored = await prisma.notification.findUnique({ where: { id: created.id } });
    expect(stored).not.toBeNull();
    expect(stored?.message).toBe('Event emission test');

    unsubscribe();
    await prisma.notification.delete({ where: { id: created.id } });
  });
});
