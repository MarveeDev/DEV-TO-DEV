import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
const request = require('supertest');
import { AppModule } from './../src/app.module';
const cookieParser = require('cookie-parser');
import { PrismaService } from '../src/prisma/prisma.service';
import { provisionTestDb } from './test-db';

jest.setTimeout(180_000);

describe('PostsController (e2e)', () => {
  let teardown: () => Promise<void>;
  let app: INestApplication;
  let prisma: PrismaService;
  
  let userAId: string;
  let userBId: string;
  let tokenA = `post_token_a_${Date.now()}`;
  let tokenB = `post_token_b_${Date.now()}`;
  let usernameA = 'post_user_a';
  let usernameB = 'post_user_b';

  beforeAll(async () => {
    teardown = await provisionTestDb('posts');
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
        email: 'post_usera@test.com',
        developerProfile: { create: { username: usernameA, displayName: 'Author A' } },
        sessions: { create: { token: tokenA, expiresAt: new Date(Date.now() + 1000000) } }
      }
    });
    userAId = userA.id;

    const userB = await prisma.user.create({
      data: {
        email: 'post_userb@test.com',
        developerProfile: { create: { username: usernameB, displayName: 'Author B' } },
        sessions: { create: { token: tokenB, expiresAt: new Date(Date.now() + 1000000) } }
      }
    });
    userBId = userB.id;
  });

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { id: { in: [userAId, userBId] } } });
    await app.close();
    if (teardown) await teardown();
  });

  let postIdA: string;

  it('Account A creates a post', async () => {
    const res = await request(app.getHttpServer())
      .post(`/api/v1/posts`)
      .set('Cookie', [`session_id=${tokenA}`])
      .send({ title: 'Hello post', content: 'Hello world from A!', skills: ['JavaScript'] });
    expect(res.status).toBe(201);
    expect(res.body.content).toBe('Hello world from A!');
    postIdA = res.body.id;
  });

  it('Cannot create empty post', async () => {
    const res = await request(app.getHttpServer())
      .post(`/api/v1/posts`)
      .set('Cookie', [`session_id=${tokenA}`])
      .send({ title: 'Empty post', content: '   ', skills: ['JavaScript'] });
    expect(res.status).toBe(400);
  });

  it('Feed lists posts correctly', async () => {
    const res = await request(app.getHttpServer())
      .get(`/api/v1/posts`)
      .set('Cookie', [`session_id=${tokenB}`]);
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThan(0);
    expect(res.body.data[0].content).toBe('Hello world from A!');
    // Verify no private data is leaked
    expect(res.body.data[0].author).not.toHaveProperty('email');
    expect(res.body.data[0].author).not.toHaveProperty('sessions');
  });

  it('Developer profile feed only shows their posts', async () => {
    const res = await request(app.getHttpServer())
      .get(`/api/v1/posts?username=${usernameA}`);
    expect(res.status).toBe(200);
    expect(res.body.data.every((p: any) => p.author.profile.username === usernameA)).toBe(true);

    const resB = await request(app.getHttpServer())
      .get(`/api/v1/posts?username=${usernameB}`);
    expect(resB.status).toBe(200);
    expect(resB.body.data.length).toBe(0);
  });

  it('Account B cannot delete Account A post', async () => {
    const res = await request(app.getHttpServer())
      .delete(`/api/v1/posts/${postIdA}`)
      .set('Cookie', [`session_id=${tokenB}`]);
    expect(res.status).toBe(403);
  });

  it('Account A can delete own post', async () => {
    const res = await request(app.getHttpServer())
      .delete(`/api/v1/posts/${postIdA}`)
      .set('Cookie', [`session_id=${tokenA}`]);
    expect(res.status).toBe(200);

    const check = await request(app.getHttpServer())
      .get(`/api/v1/posts?username=${usernameA}`);
    expect(check.body.data.length).toBe(0);
  });
});
