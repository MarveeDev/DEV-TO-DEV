import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
const request = require('supertest');
import { AppModule } from './../src/app.module';
const cookieParser = require('cookie-parser');
import { PrismaService } from '../src/prisma/prisma.service';

describe('ConnectionsController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  
  let userAId: string;
  let userBId: string;
  let tokenA = 'token_a_123';
  let tokenB = 'token_b_456';
  let usernameA = 'user_a_conn';
  let usernameB = 'user_b_conn';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.use(cookieParser());
    app.setGlobalPrefix('api/v1');
    await app.init();
    
    prisma = app.get(PrismaService);
    
    // Clean up past test data
    await prisma.user.deleteMany({ where: { developerProfile: { username: { in: [usernameA, usernameB] } } } });

    // Seed User A
    const userA = await prisma.user.create({
      data: {
        email: 'usera@test.com',
        developerProfile: {
          create: {
            username: usernameA,
            displayName: 'User A',
          }
        },
        sessions: {
          create: {
            token: tokenA,
            expiresAt: new Date(Date.now() + 1000000),
          }
        }
      }
    });
    userAId = userA.id;

    // Seed User B
    const userB = await prisma.user.create({
      data: {
        email: 'userb@test.com',
        developerProfile: {
          create: {
            username: usernameB,
            displayName: 'User B',
          }
        },
        sessions: {
          create: {
            token: tokenB,
            expiresAt: new Date(Date.now() + 1000000),
          }
        }
      }
    });
    userBId = userB.id;
  });

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { id: { in: [userAId, userBId] } } });
    await app.close();
  });

  let connectionId: string;

  it('Test self-connection prevention', async () => {
    const res = await request(app.getHttpServer())
      .post(`/api/v1/connections/${usernameA}`)
      .set('Cookie', [`session_id=${tokenA}`]);
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('You cannot connect with yourself');
  });

  it('Test sending a request', async () => {
    const res = await request(app.getHttpServer())
      .post(`/api/v1/connections/${usernameB}`)
      .set('Cookie', [`session_id=${tokenA}`]);
    expect(res.status).toBe(201);
    expect(res.body.status).toBe('PENDING');
    connectionId = res.body.id;
  });

  it('Test duplicate prevention', async () => {
    const res = await request(app.getHttpServer())
      .post(`/api/v1/connections/${usernameB}`)
      .set('Cookie', [`session_id=${tokenA}`]);
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Connection request already pending');
  });

  it('Test rejecting a request', async () => {
    const res = await request(app.getHttpServer())
      .patch(`/api/v1/connections/${connectionId}/reject`)
      .set('Cookie', [`session_id=${tokenB}`]);
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('REJECTED');
  });

  it('Test sending a request again after rejection', async () => {
    const res = await request(app.getHttpServer())
      .post(`/api/v1/connections/${usernameB}`)
      .set('Cookie', [`session_id=${tokenA}`]);
    expect(res.status).toBe(201);
    expect(res.body.status).toBe('PENDING');
    // It should reuse the same connection row
    connectionId = res.body.id;
  });

  it('Test accepting a request', async () => {
    const res = await request(app.getHttpServer())
      .patch(`/api/v1/connections/${connectionId}/accept`)
      .set('Cookie', [`session_id=${tokenB}`]);
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ACCEPTED');
  });

  it('Test removing a connection', async () => {
    const res = await request(app.getHttpServer())
      .delete(`/api/v1/connections/${connectionId}`)
      .set('Cookie', [`session_id=${tokenA}`]);
    expect(res.status).toBe(200);
    
    // verify it's gone
    const check = await request(app.getHttpServer())
      .get(`/api/v1/connections`)
      .set('Cookie', [`session_id=${tokenA}`]);
    expect(check.body.length).toBe(0);
  });

  it('Verify notifications are created', async () => {
    // User B should have a CONNECTION_REQUEST notification
    const notificationsB = await prisma.notification.findMany({ where: { userId: userBId } });
    expect(notificationsB.some((n: any) => n.type === 'CONNECTION_REQUEST')).toBe(true);

    // User A should have a CONNECTION_ACCEPTED notification
    const notificationsA = await prisma.notification.findMany({ where: { userId: userAId } });
    expect(notificationsA.some((n: any) => n.type === 'CONNECTION_ACCEPTED')).toBe(true);
  });
});
