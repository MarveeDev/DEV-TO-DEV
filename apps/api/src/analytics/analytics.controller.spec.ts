import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { RolesGuard } from '../admin/roles.guard';
import { PrismaService } from '../prisma/prisma.service';
import { SessionsService } from '../sessions/sessions.service';

const request = require('supertest');
const cookieParser = require('cookie-parser');

describe('AnalyticsController (HTTP)', () => {
  let app: INestApplication;

  const sessions = { validateSession: jest.fn() };
  const prisma = {
    user: {
      findUnique: jest.fn(),
      count: jest.fn(),
      groupBy: jest.fn(),
    },
    post: { count: jest.fn() },
    postComment: { count: jest.fn() },
    postLike: { count: jest.fn() },
    question: { count: jest.fn() },
    answer: { count: jest.fn() },
    project: { count: jest.fn() },
    marketplaceListing: {
      count: jest.fn(),
      groupBy: jest.fn(),
    },
    connection: { count: jest.fn() },
    $queryRaw: jest.fn(),
  };

  function actorAs(role: string) {
    sessions.validateSession.mockResolvedValue('u-actor');
    prisma.user.findUnique.mockResolvedValue({ id: 'u-actor', role, status: 'ACTIVE' });
  }

  beforeEach(async () => {
    jest.clearAllMocks();

    prisma.user.count.mockResolvedValue(0);
    prisma.user.groupBy.mockResolvedValue([]);
    prisma.post.count.mockResolvedValue(0);
    prisma.postComment.count.mockResolvedValue(0);
    prisma.postLike.count.mockResolvedValue(0);
    prisma.question.count.mockResolvedValue(0);
    prisma.answer.count.mockResolvedValue(0);
    prisma.project.count.mockResolvedValue(0);
    prisma.marketplaceListing.count.mockResolvedValue(0);
    prisma.marketplaceListing.groupBy.mockResolvedValue([]);
    prisma.connection.count.mockResolvedValue(0);
    prisma.$queryRaw.mockResolvedValue([]);

    const moduleRef = await Test.createTestingModule({
      controllers: [AnalyticsController],
      providers: [
        AnalyticsService,
        { provide: SessionsService, useValue: sessions },
        { provide: PrismaService, useValue: prisma },
        RolesGuard,
        Reflector,
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    app.use(cookieParser());
    app.setGlobalPrefix('api/v1');
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  const get = (path: string) =>
    request(app.getHttpServer()).get(path).set('Cookie', 'session_id=valid');

  describe('authorization', () => {
    it('allows ANALYTICS_VIEWER to read the summary', async () => {
      actorAs('ANALYTICS_VIEWER');
      await get('/api/v1/admin/analytics/summary').expect(200);
    });

    it('allows ANALYTICS_VIEWER to read the timeseries', async () => {
      actorAs('ANALYTICS_VIEWER');
      await get('/api/v1/admin/analytics/timeseries?from=2024-01-01&to=2024-01-03').expect(200);
    });

    it('denies MODERATOR (no analytics.view)', async () => {
      actorAs('MODERATOR');
      await get('/api/v1/admin/analytics/summary').expect(403);
    });

    it('denies a plain USER', async () => {
      actorAs('USER');
      await get('/api/v1/admin/analytics/summary').expect(403);
    });

    it('rejects an unauthenticated request', async () => {
      sessions.validateSession.mockResolvedValue(null);
      await request(app.getHttpServer())
        .get('/api/v1/admin/analytics/summary')
        .set('Cookie', 'session_id=valid')
        .expect(401);
    });
  });

  describe('date-range validation (real service)', () => {
    it('rejects a reversed range with 400', async () => {
      actorAs('ANALYTICS_VIEWER');
      await get('/api/v1/admin/analytics/timeseries?from=2024-02-01&to=2024-01-01').expect(400);
    });

    it('rejects a malformed date with 400', async () => {
      actorAs('ANALYTICS_VIEWER');
      await get('/api/v1/admin/analytics/timeseries?from=not-a-date&to=2024-01-01').expect(400);
    });

    it('rejects a range longer than 366 days with 400', async () => {
      actorAs('ANALYTICS_VIEWER');
      await get('/api/v1/admin/analytics/timeseries?from=2023-01-01&to=2024-06-01').expect(400);
    });
  });
});
