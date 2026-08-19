import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
const request = require('supertest');
import { AppModule } from './../src/app.module';
const cookieParser = require('cookie-parser');
import { PrismaService } from '../src/prisma/prisma.service';

describe('DevelopersController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  
  let currentUserId: string;
  let currentToken = 'dev_token_123';
  let devAUsername = 'dev_a_discover';
  let devBUsername = 'dev_b_discover';
  let reactSkillId: string;
  let mlGoalId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.use(cookieParser());
    app.setGlobalPrefix('api/v1');
    await app.init();
    
    prisma = app.get(PrismaService);
    
    await prisma.user.deleteMany({ where: { developerProfile: { username: { in: ['current_discover', devAUsername, devBUsername] } } } });

    // Ensure we have some skills and goals to test
    const skill = await prisma.skill.upsert({ where: { slug: 'react' }, update: {}, create: { name: 'React', slug: 'react' } });
    const goal = await prisma.learningGoal.upsert({ where: { slug: 'machine-learning' }, update: {}, create: { name: 'Machine Learning', slug: 'machine-learning' } });
    reactSkillId = skill.id;
    mlGoalId = goal.id;

    const currentUser = await prisma.user.create({
      data: {
        email: 'current_discover@test.com',
        sessions: { create: { token: currentToken, expiresAt: new Date(Date.now() + 100000) } },
        developerProfile: {
          create: {
            username: 'current_discover',
            displayName: 'Current Searcher',
            experienceLevel: 'INTERMEDIATE',
            skills: { create: { skillId: reactSkillId } }
          }
        }
      }
    });
    currentUserId = currentUser.id;

    await prisma.user.create({
      data: {
        email: 'deva@test.com',
        developerProfile: {
          create: {
            username: devAUsername,
            displayName: 'Alice React Developer',
            experienceLevel: 'EXPERT',
            skills: { create: { skillId: reactSkillId } }
          }
        }
      }
    });

    await prisma.user.create({
      data: {
        email: 'devb@test.com',
        developerProfile: {
          create: {
            username: devBUsername,
            displayName: 'Bob ML Learner',
            experienceLevel: 'BEGINNER',
            learningGoals: { create: { learningGoalId: mlGoalId } }
          }
        }
      }
    });
  });

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { developerProfile: { username: { in: ['current_discover', devAUsername, devBUsername] } } } });
    await app.close();
  });

  it('Test developer search by name/username', async () => {
    const res = await request(app.getHttpServer())
      .get(`/api/v1/developers?username=${devAUsername}`)
      .set('Cookie', [`session_id=${currentToken}`]);
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0].username).toBe(devAUsername);
    expect(res.body.data[0]).not.toHaveProperty('user'); // Verify private fields not exposed
    expect(res.body.data[0]).not.toHaveProperty('email');
  });

  it('Test skill filtering', async () => {
    const res = await request(app.getHttpServer())
      .get(`/api/v1/developers?skills=${reactSkillId}`)
      .set('Cookie', [`session_id=${currentToken}`]);
    expect(res.status).toBe(200);
    // DevA has React, Bob doesn't.
    expect(res.body.data.some((d: any) => d.username === devAUsername)).toBe(true);
    expect(res.body.data.some((d: any) => d.username === devBUsername)).toBe(false);
  });

  it('Test learning-goal filtering', async () => {
    const res = await request(app.getHttpServer())
      .get(`/api/v1/developers?goals=${mlGoalId}`)
      .set('Cookie', [`session_id=${currentToken}`]);
    expect(res.status).toBe(200);
    expect(res.body.data.some((d: any) => d.username === devBUsername)).toBe(true);
    expect(res.body.data.some((d: any) => d.username === devAUsername)).toBe(false);
  });

  it('Test pagination', async () => {
    const res = await request(app.getHttpServer())
      .get(`/api/v1/developers?page=1&limit=1`)
      .set('Cookie', [`session_id=${currentToken}`]);
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(1);
    expect(res.body.meta.limit).toBe(1);
    expect(res.body.meta.page).toBe(1);
  });

  it('Test public profile access', async () => {
    const res = await request(app.getHttpServer())
      .get(`/api/v1/developers/${devBUsername}`)
      .set('Cookie', [`session_id=${currentToken}`]);
    expect(res.status).toBe(200);
    expect(res.body.username).toBe(devBUsername);
    expect(res.body.displayName).toBe('Bob ML Learner');
    expect(res.body).not.toHaveProperty('email');
    expect(res.body).not.toHaveProperty('sessions');
  });
});
