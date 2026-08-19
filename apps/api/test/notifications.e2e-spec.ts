import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
const request = require('supertest');
import { AppModule } from './../src/app.module';
const cookieParser = require('cookie-parser');
import { PrismaService } from '../src/prisma/prisma.service';

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
});
