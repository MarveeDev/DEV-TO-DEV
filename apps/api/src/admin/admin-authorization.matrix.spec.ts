import { Reflector } from '@nestjs/core';
import { ExecutionContext, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { RolesGuard } from './roles.guard';
import { AdminController } from './admin.controller';
import { SmsCampaignsController } from '../sms-campaigns/sms-campaigns.controller';
import { AdminSupportController } from '../support/admin-support.controller';
import { AnalyticsController } from '../analytics/analytics.controller';
import { PrismaService } from '../prisma/prisma.service';
import { SessionsService } from '../sessions/sessions.service';

const ALL_ROLES = [
  'SUPER_ADMIN',
  'ADMIN',
  'PLATFORM_ADMIN',
  'MARKETING_MANAGER',
  'SUPPORT',
  'MODERATOR',
  'ANALYTICS_VIEWER',
  'USER',
] as const;

describe('Role-to-endpoint authorization matrix (real decorators + RolesGuard)', () => {
  const reflector = new Reflector();
  const sessions = { validateSession: jest.fn() };
  const prisma = { user: { findUnique: jest.fn() } };

  const guard = new RolesGuard(
    reflector,
    sessions as unknown as SessionsService,
    prisma as unknown as PrismaService,
  );

  function ctx(controller: unknown, handlerName: string, cookie?: string): ExecutionContext {
    const handler = (controller as { prototype: Record<string, Function> }).prototype[handlerName];
    const req: Record<string, unknown> = { cookies: cookie ? { session_id: cookie } : {} };
    return {
      getHandler: () => handler,
      getClass: () => controller,
      switchToHttp: () => ({ getRequest: () => req }),
    } as unknown as ExecutionContext;
  }

  function actorIs(role: string, status = 'ACTIVE') {
    sessions.validateSession.mockResolvedValue('u-actor');
    prisma.user.findUnique.mockResolvedValue({ id: 'u-actor', role, status });
  }

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const cases: Array<{ name: string; controller: unknown; handler: string; allowed: string[] }> = [
    // overview.view -> every staff role, never USER
    {
      name: 'admin overview',
      controller: AdminController,
      handler: 'getOverview',
      allowed: ['SUPER_ADMIN', 'ADMIN', 'PLATFORM_ADMIN', 'MARKETING_MANAGER', 'SUPPORT', 'MODERATOR', 'ANALYTICS_VIEWER'],
    },
    // @Roles('ADMIN','MODERATOR') -> SUPER_ADMIN/ADMIN directly, PLATFORM_ADMIN + MODERATOR via MODERATOR coverage
    {
      name: 'users listing',
      controller: AdminController,
      handler: 'getUsers',
      allowed: ['SUPER_ADMIN', 'ADMIN', 'PLATFORM_ADMIN', 'MODERATOR'],
    },
    {
      name: 'users detail',
      controller: AdminController,
      handler: 'getUser',
      allowed: ['SUPER_ADMIN', 'ADMIN', 'PLATFORM_ADMIN', 'MODERATOR'],
    },
    {
      name: 'moderation (violations list)',
      controller: AdminController,
      handler: 'getViolations',
      allowed: ['SUPER_ADMIN', 'ADMIN', 'PLATFORM_ADMIN', 'MODERATOR'],
    },
    {
      name: 'moderation mutation (create violation)',
      controller: AdminController,
      handler: 'createViolation',
      allowed: ['SUPER_ADMIN', 'ADMIN', 'PLATFORM_ADMIN', 'MODERATOR'],
    },
    // users.manage -> SUPER_ADMIN, ADMIN, PLATFORM_ADMIN
    {
      name: 'user role assignment',
      controller: AdminController,
      handler: 'changeUserRole',
      allowed: ['SUPER_ADMIN', 'ADMIN', 'PLATFORM_ADMIN'],
    },
    // @Roles('ADMIN') -> SUPER_ADMIN + ADMIN only
    {
      name: 'audit logs',
      controller: AdminController,
      handler: 'getAuditLogs',
      allowed: ['SUPER_ADMIN', 'ADMIN'],
    },
    // staff.manage -> SUPER_ADMIN only
    {
      name: 'staff listing',
      controller: AdminController,
      handler: 'getStaff',
      allowed: ['SUPER_ADMIN'],
    },
    {
      name: 'staff email lookup',
      controller: AdminController,
      handler: 'findStaffByEmail',
      allowed: ['SUPER_ADMIN'],
    },
    {
      name: 'staff status change',
      controller: AdminController,
      handler: 'setStaffStatus',
      allowed: ['SUPER_ADMIN'],
    },
    {
      name: 'staff invitation',
      controller: AdminController,
      handler: 'inviteStaff',
      allowed: ['SUPER_ADMIN'],
    },
    // marketing.manage -> SUPER_ADMIN, ADMIN, MARKETING_MANAGER
    {
      name: 'SMS campaigns',
      controller: SmsCampaignsController,
      handler: 'getCampaigns',
      allowed: ['SUPER_ADMIN', 'ADMIN', 'MARKETING_MANAGER'],
    },
    // support.manage -> SUPER_ADMIN, ADMIN, PLATFORM_ADMIN, SUPPORT
    {
      name: 'admin support tickets',
      controller: AdminSupportController,
      handler: 'listTickets',
      allowed: ['SUPER_ADMIN', 'ADMIN', 'PLATFORM_ADMIN', 'SUPPORT'],
    },
    // analytics.view -> every analytics-view holder, read-only GET endpoints
    {
      name: 'analytics summary',
      controller: AnalyticsController,
      handler: 'getSummary',
      allowed: ['SUPER_ADMIN', 'ADMIN', 'PLATFORM_ADMIN', 'MARKETING_MANAGER', 'SUPPORT', 'ANALYTICS_VIEWER'],
    },
    {
      name: 'analytics timeseries',
      controller: AnalyticsController,
      handler: 'getTimeseries',
      allowed: ['SUPER_ADMIN', 'ADMIN', 'PLATFORM_ADMIN', 'MARKETING_MANAGER', 'SUPPORT', 'ANALYTICS_VIEWER'],
    },
  ];

  for (const c of cases) {
    describe(c.name, () => {
      for (const role of ALL_ROLES) {
        const shouldAllow = c.allowed.includes(role);
        it(`${shouldAllow ? 'allows' : 'denies'} ${role}`, async () => {
          actorIs(role);
          if (shouldAllow) {
            await expect(guard.canActivate(ctx(c.controller, c.handler, 'valid'))).resolves.toBe(true);
          } else {
            await expect(guard.canActivate(ctx(c.controller, c.handler, 'valid'))).rejects.toThrow(ForbiddenException);
          }
        });
      }
    });
  }

  describe('account status restrictions', () => {
    it.each(['SUSPENDED', 'RESTRICTED'])('denies a %s account even with SUPER_ADMIN role', async (status) => {
      actorIs('SUPER_ADMIN', status);
      await expect(guard.canActivate(ctx(AdminController, 'getOverview', 'valid'))).rejects.toThrow(ForbiddenException);
    });

    it('denies a SUSPENDED account on a staff-management endpoint', async () => {
      actorIs('SUPER_ADMIN', 'SUSPENDED');
      await expect(guard.canActivate(ctx(AdminController, 'getStaff', 'valid'))).rejects.toThrow(ForbiddenException);
    });
  });

  describe('unauthenticated requests', () => {
    it('rejects a staff endpoint without a session token', async () => {
      await expect(guard.canActivate(ctx(AdminController, 'getStaff'))).rejects.toThrow(UnauthorizedException);
    });

    it('rejects an invalid session', async () => {
      sessions.validateSession.mockResolvedValue(null);
      await expect(guard.canActivate(ctx(AdminController, 'getStaff', 'valid'))).rejects.toThrow(UnauthorizedException);
    });
  });
});
