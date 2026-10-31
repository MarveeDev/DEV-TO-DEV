import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { RolesGuard } from './roles.guard';
import { PrismaService } from '../prisma/prisma.service';
import { SessionsService } from '../sessions/sessions.service';

const request = require('supertest');
const cookieParser = require('cookie-parser');

describe('AdminController moderation (HTTP)', () => {
  let app: INestApplication;

  const sessions = { validateSession: jest.fn() };
  const prisma = { user: { findUnique: jest.fn() } };

  const adminService = {
    getOverview: jest.fn(),
    getUsers: jest.fn(),
    getUser: jest.fn(),
    changeUserRole: jest.fn(),
    getListings: jest.fn().mockResolvedValue({ items: [], meta: {} }),
    getReports: jest.fn().mockResolvedValue({ items: [], meta: {} }),
    getReport: jest.fn(),
    updateReportStatus: jest.fn().mockResolvedValue({ id: 'r1', status: 'RESOLVED' }),
    getPosts: jest.fn(),
    getQuestions: jest.fn(),
    getProjects: jest.fn(),
    getViolations: jest.fn().mockResolvedValue({ items: [], meta: {} }),
    createViolation: jest.fn().mockResolvedValue({ id: 'v1', status: 'OPEN' }),
    updateViolationStatus: jest.fn().mockResolvedValue({ id: 'v1', status: 'RESOLVED' }),
    getAuditLogs: jest.fn(),
    listStaff: jest.fn(),
    findUserByEmail: jest.fn(),
    inviteStaff: jest.fn(),
    listInvites: jest.fn(),
    resendInvite: jest.fn(),
    revokeInvite: jest.fn(),
    setStaffStatus: jest.fn(),
  };

  function actorAs(role: string) {
    sessions.validateSession.mockResolvedValue('u-actor');
    prisma.user.findUnique.mockResolvedValue({ id: 'u-actor', role, status: 'ACTIVE' });
  }

  beforeEach(async () => {
    jest.clearAllMocks();
    adminService.getViolations.mockResolvedValue({ items: [], meta: {} });
    adminService.getReports.mockResolvedValue({ items: [], meta: {} });
    adminService.createViolation.mockResolvedValue({ id: 'v1', status: 'OPEN' });
    adminService.updateReportStatus.mockResolvedValue({ id: 'r1', status: 'RESOLVED' });
    adminService.updateViolationStatus.mockResolvedValue({ id: 'v1', status: 'RESOLVED' });

    const moduleRef = await Test.createTestingModule({
      controllers: [AdminController],
      providers: [
        { provide: AdminService, useValue: adminService },
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
    it.each(['MODERATOR', 'PLATFORM_ADMIN', 'ADMIN', 'SUPER_ADMIN'])(
      'allows %s to list violations',
      async (role) => {
        actorAs(role);
        await get('/api/v1/admin/violations').expect(200);
      },
    );

    it.each(['USER', 'SUPPORT', 'MARKETING_MANAGER', 'ANALYTICS_VIEWER'])(
      'denies %s violations access (403)',
      async (role) => {
        actorAs(role);
        await get('/api/v1/admin/violations').expect(403);
      },
    );

    it.each(['MODERATOR', 'PLATFORM_ADMIN', 'ADMIN', 'SUPER_ADMIN'])(
      'allows %s to list reports',
      async (role) => {
        actorAs(role);
        await get('/api/v1/admin/marketplace/reports').expect(200);
      },
    );

    it('denies an unauthenticated request (401)', async () => {
      sessions.validateSession.mockResolvedValue(null);
      await get('/api/v1/admin/violations').expect(401);
    });
  });

  describe('mutation endpoints are staff-guarded', () => {
    it('allows MODERATOR to create a violation', async () => {
      actorAs('MODERATOR');
      await request(app.getHttpServer())
        .post('/api/v1/admin/violations')
        .set('Cookie', 'session_id=valid')
        .send({ userId: 'u1', type: 'SPAM', severity: 'HIGH' })
        .expect(201);
    });

    it('denies a plain USER creating a violation (403)', async () => {
      actorAs('USER');
      await request(app.getHttpServer())
        .post('/api/v1/admin/violations')
        .set('Cookie', 'session_id=valid')
        .send({ userId: 'u1', type: 'SPAM', severity: 'HIGH' })
        .expect(403);
    });

    it('allows MODERATOR to update a report status', async () => {
      actorAs('MODERATOR');
      await request(app.getHttpServer())
        .patch('/api/v1/admin/marketplace/reports/r1/status')
        .set('Cookie', 'session_id=valid')
        .send({ status: 'RESOLVED' })
        .expect(200);
    });

    it('denies a non-staff role updating a report status (403)', async () => {
      actorAs('ANALYTICS_VIEWER');
      await request(app.getHttpServer())
        .patch('/api/v1/admin/marketplace/reports/r1/status')
        .set('Cookie', 'session_id=valid')
        .send({ status: 'RESOLVED' })
        .expect(403);
    });
  });
});
