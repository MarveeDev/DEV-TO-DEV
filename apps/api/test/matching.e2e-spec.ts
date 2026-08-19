import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
const request = require('supertest');
const cookieParser = require('cookie-parser');
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Matching (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  let currentUserId: string;
  let currentToken = `matching_token_me_${Date.now()}`;
  
  let targetUser1Id: string;
  let targetUser2Id: string;
  
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.use(cookieParser());
    app.setGlobalPrefix('api/v1');
    prisma = app.get(PrismaService);
    await app.init();

    // Setup test users
    const skillA = await prisma.skill.create({ data: { name: 'MATCH_SKILL_A', slug: 'match-skill-a' } });
    const skillB = await prisma.skill.create({ data: { name: 'MATCH_SKILL_B', slug: 'match-skill-b' } });
    const skillC = await prisma.skill.create({ data: { name: 'MATCH_SKILL_C', slug: 'match-skill-c' } });

    const goalX = await prisma.learningGoal.create({ data: { name: 'MATCH_GOAL_X', slug: 'match-goal-x' } });
    const goalY = await prisma.learningGoal.create({ data: { name: 'MATCH_GOAL_Y', slug: 'match-goal-y' } });

    // Current User
    const currentUser = await prisma.user.create({
      data: {
        email: `match_me_${Date.now()}@test.com`,
        sessions: { create: { token: currentToken, expiresAt: new Date(Date.now() + 1000000) } },
        developerProfile: {
          create: {
            username: `match_me_${Date.now()}`,
            displayName: 'Match Me',
            experienceLevel: 'INTERMEDIATE',
            skills: { create: [{ skillId: skillA.id }, { skillId: skillB.id }] },
            learningGoals: { create: [{ learningGoalId: goalX.id }] },
          }
        }
      }
    });
    currentUserId = currentUser.id;

    // Target User 1 (Good Match)
    const t1 = await prisma.user.create({
      data: {
        email: `match_t1_${Date.now()}@test.com`,
        developerProfile: {
          create: {
            username: `match_t1_${Date.now()}`,
            displayName: 'Target 1',
            experienceLevel: 'INTERMEDIATE',
            skills: { create: [{ skillId: skillA.id }, { skillId: skillC.id }] },
            learningGoals: { create: [{ learningGoalId: goalX.id }] },
          }
        }
      }
    });
    targetUser1Id = t1.id;

    // Target User 2 (Connected User)
    const t2 = await prisma.user.create({
      data: {
        email: `match_t2_${Date.now()}@test.com`,
        developerProfile: {
          create: {
            username: `match_t2_${Date.now()}`,
            displayName: 'Target 2',
            experienceLevel: 'BEGINNER',
            skills: { create: [{ skillId: skillC.id }] },
            learningGoals: { create: [{ learningGoalId: goalY.id }] },
          }
        }
      }
    });
    targetUser2Id = t2.id;

    // Connect Current and Target User 2
    await prisma.connection.create({
      data: {
        requesterId: currentUserId,
        addresseeId: targetUser2Id,
        status: 'ACCEPTED',
      }
    });
  });

  afterAll(async () => {
    // Teardown
    await prisma.connection.deleteMany({ where: { OR: [{ requesterId: currentUserId }, { addresseeId: currentUserId }] } });
    const ids = [currentUserId, targetUser1Id, targetUser2Id].filter(Boolean);
    if (ids.length > 0) {
      await prisma.user.deleteMany({ where: { id: { in: ids } } });
    }
    await prisma.skill.deleteMany({ where: { name: { startsWith: 'MATCH_SKILL' } } });
    await prisma.learningGoal.deleteMany({ where: { name: { startsWith: 'MATCH_GOAL' } } });
    await app.close();
  });

  it('1. Rejects unauthenticated requests to matches', async () => {
    const res = await request(app.getHttpServer()).get('/api/v1/developers/matches');
    expect(res.status).toBe(401);
  });

  it('2. Returns matches excluding current user and connected users', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/v1/developers/matches')
      .set('Cookie', [`session_id=${currentToken}`]);

    expect(res.status).toBe(200);
    const data = res.body.data;
    
    // Check exclusion
    expect(data.some((d: any) => d.developer.id === currentUserId)).toBe(false);
    expect(data.some((d: any) => d.developer.id === targetUser2Id)).toBe(false); // Connected

    // Target User 1 should be there
    const match1 = data.find((d: any) => d.developer.id === targetUser1Id);
    expect(match1).toBeDefined();

    // Check match scoring
    expect(match1.compatibility.sharedSkills).toContain('MATCH_SKILL_A');
    expect(match1.compatibility.sharedLearningGoals).toContain('MATCH_GOAL_X');
    expect(match1.compatibility.score).toBeGreaterThan(0);
    expect(match1.connectionStatus).toBe('NONE');
  });

  it('3. Respects pagination', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/v1/developers/matches?page=1&limit=1')
      .set('Cookie', [`session_id=${currentToken}`]);

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeLessThanOrEqual(1);
    expect(res.body.meta.limit).toBe(1);
  });
});
