import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { SmsCampaignsController } from './sms-campaigns.controller';
import { SmsCampaignsService } from './sms-campaigns.service';
import { RolesGuard } from '../admin/roles.guard';
import { PrismaService } from '../prisma/prisma.service';
import { SessionsService } from '../sessions/sessions.service';

const request = require('supertest');
const cookieParser = require('cookie-parser');

describe('SmsCampaignsController (HTTP)', () => {
  let app: INestApplication;

  const sessions = { validateSession: jest.fn() };
  const prisma = { user: { findUnique: jest.fn() } };

  const smsCampaignsService = {
    getCampaigns: jest.fn().mockResolvedValue({ items: [], meta: {} }),
    getCampaign: jest.fn(),
    createCampaign: jest.fn().mockResolvedValue({ id: 'c1', name: 'n', message: 'm' }),
    updateCampaign: jest.fn(),
    deleteCampaign: jest.fn(),
    importRecipients: jest.fn(),
    getRecipients: jest.fn(),
    removeRecipient: jest.fn(),
    clearInvalidRecipients: jest.fn(),
    clearAllRecipients: jest.fn(),
    markReady: jest.fn(),
    cancelCampaign: jest.fn(),
    getSendPreview: jest.fn(),
    sendTestSms: jest.fn(),
    sendCampaign: jest.fn(),
  };

  function actorAs(role: string) {
    sessions.validateSession.mockResolvedValue('u-actor');
    prisma.user.findUnique.mockResolvedValue({ id: 'u-actor', role, status: 'ACTIVE' });
  }

  beforeEach(async () => {
    jest.clearAllMocks();
    smsCampaignsService.getCampaigns.mockResolvedValue({ items: [], meta: {} });
    smsCampaignsService.createCampaign.mockResolvedValue({ id: 'c1', name: 'n', message: 'm' });

    const moduleRef = await Test.createTestingModule({
      controllers: [SmsCampaignsController],
      providers: [
        { provide: SmsCampaignsService, useValue: smsCampaignsService },
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
    it.each(['MARKETING_MANAGER', 'ADMIN', 'SUPER_ADMIN'])('allows %s to list campaigns', async (role) => {
      actorAs(role);
      await get('/api/v1/admin/sms-campaigns').expect(200);
    });

    it.each(['PLATFORM_ADMIN', 'SUPPORT', 'MODERATOR', 'ANALYTICS_VIEWER', 'USER'])(
      'denies %s campaign access (403)',
      async (role) => {
        actorAs(role);
        await get('/api/v1/admin/sms-campaigns').expect(403);
      },
    );

    it('allows MARKETING_MANAGER to create a campaign', async () => {
      actorAs('MARKETING_MANAGER');
      await request(app.getHttpServer())
        .post('/api/v1/admin/sms-campaigns')
        .set('Cookie', 'session_id=valid')
        .send({ name: 'Welcome', message: 'Hi' })
        .expect(201);
    });

    it('denies a non-marketing role creating a campaign (403)', async () => {
      actorAs('MODERATOR');
      await request(app.getHttpServer())
        .post('/api/v1/admin/sms-campaigns')
        .set('Cookie', 'session_id=valid')
        .send({ name: 'Welcome', message: 'Hi' })
        .expect(403);
    });

    it('rejects an unauthenticated request (401)', async () => {
      sessions.validateSession.mockResolvedValue(null);
      await get('/api/v1/admin/sms-campaigns').expect(401);
    });
  });
});
