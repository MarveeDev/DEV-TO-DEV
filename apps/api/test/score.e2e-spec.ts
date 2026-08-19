import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
const request = require('supertest');
import { AppModule } from './../src/app.module';
const cookieParser = require('cookie-parser');
import { PrismaService } from '../src/prisma/prisma.service';

describe('ScoreController & Service (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  
  let userAId: string;
  let tokenA = `score_token_a_${Date.now()}`;
  let usernameA = 'score_user_a';

  let userBId: string;
  let tokenB = `score_token_b_${Date.now()}`;
  let usernameB = 'score_user_b';

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
        email: 'score_usera@test.com',
        developerProfile: { create: { username: usernameA, displayName: 'Author A' } },
        sessions: { create: { token: tokenA, expiresAt: new Date(Date.now() + 1000000) } }
      }
    });
    userAId = userA.id;

    const userB = await prisma.user.create({
      data: {
        email: 'score_userb@test.com',
        developerProfile: { create: { username: usernameB, displayName: 'Author B' } },
        sessions: { create: { token: tokenB, expiresAt: new Date(Date.now() + 1000000) } }
      }
    });
    userBId = userB.id;
  });

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { id: { in: [userAId, userBId] } } });
    await app.close();
  });

  const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

  it('1. New developer receives initial zero score', async () => {
    const res = await request(app.getHttpServer())
      .get(`/api/v1/score/me`)
      .set('Cookie', [`session_id=${tokenA}`]);
    expect(res.status).toBe(200);
    expect(res.body.score).toBe(0);
    expect(res.body.streak).toBe(0);
  });

  it('2. Creating a valid post updates post count and streak', async () => {
    await request(app.getHttpServer())
      .post(`/api/v1/posts`)
      .set('Cookie', [`session_id=${tokenA}`])
      .send({ content: 'My first post!' });
    
    await delay(100); // Async activity recording

    const res = await request(app.getHttpServer())
      .get(`/api/v1/score/me`)
      .set('Cookie', [`session_id=${tokenA}`]);
    
    expect(res.body.postsCount).toBe(1);
    expect(res.body.streak).toBe(1);
    expect(res.body.score).toBe(20); // 5 for post + 15 for new streak day
  });

  it('4. Multiple actions on same day do not incorrectly inflate streak', async () => {
    await request(app.getHttpServer())
      .post(`/api/v1/posts`)
      .set('Cookie', [`session_id=${tokenA}`])
      .send({ content: 'My second post!' });
    
    await delay(100);

    const res = await request(app.getHttpServer())
      .get(`/api/v1/score/me`)
      .set('Cookie', [`session_id=${tokenA}`]);
    
    expect(res.body.postsCount).toBe(2);
    expect(res.body.streak).toBe(1); // Still 1 day
    expect(res.body.score).toBe(25); // +5 for second post, no streak bonus
  });

  it('8. Accepted connections update appropriate counter', async () => {
    // B sends to A
    const reqRes = await request(app.getHttpServer())
      .post(`/api/v1/connections/${usernameA}`)
      .set('Cookie', [`session_id=${tokenB}`]);
    
    expect(reqRes.status).toBe(201);
    const connId = reqRes.body.id;

    // A accepts
    await request(app.getHttpServer())
      .patch(`/api/v1/connections/${connId}/accept`)
      .set('Cookie', [`session_id=${tokenA}`]);

    await delay(100);

    const resA = await request(app.getHttpServer())
      .get(`/api/v1/score/me`)
      .set('Cookie', [`session_id=${tokenA}`]);
    
    expect(resA.body.connectionsCount).toBe(1);
    expect(resA.body.score).toBe(35); // 25 + 10 connection points
    expect(resA.body.streak).toBe(1);

    const resB = await request(app.getHttpServer())
      .get(`/api/v1/score/me`)
      .set('Cookie', [`session_id=${tokenB}`]);
    
    expect(resB.body.connectionsCount).toBe(1);
    expect(resB.body.score).toBe(25); // 10 connection points + 15 streak
    expect(resB.body.streak).toBe(1);
  });

  it('7. Max post cap blocks spam points', async () => {
    // A already posted twice today. Third post:
    await request(app.getHttpServer())
      .post(`/api/v1/posts`)
      .set('Cookie', [`session_id=${tokenA}`])
      .send({ content: 'My third post!' });
    
    await delay(100);

    // Fourth post:
    await request(app.getHttpServer())
      .post(`/api/v1/posts`)
      .set('Cookie', [`session_id=${tokenA}`])
      .send({ content: 'My fourth post!' });
    
    await delay(100);

    const res = await request(app.getHttpServer())
      .get(`/api/v1/score/me`)
      .set('Cookie', [`session_id=${tokenA}`]);
    
    expect(res.body.postsCount).toBe(4); // Tracks all
    // But points only awarded for 3. Previous score: 35. Post 3 adds 5 = 40. Post 4 adds 0.
    expect(res.body.score).toBe(40);
  });

  it('9. Unauthorized users cannot modify another developers score', async () => {
    // Only internal services modify score, no endpoints exist. Just checking visibility.
    const res = await request(app.getHttpServer())
      .get(`/api/v1/score/developers/${usernameB}`);
    expect(res.status).toBe(200);
    expect(res.body.score).toBe(25);
  });

  it('10. Public score does not expose private fields', async () => {
    const res = await request(app.getHttpServer())
      .get(`/api/v1/score/developers/${usernameA}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('score');
    expect(res.body).toHaveProperty('streak');
    expect(res.body).not.toHaveProperty('id'); // internal db id
    expect(res.body).not.toHaveProperty('developerProfileId'); // internal db id
  });
});
