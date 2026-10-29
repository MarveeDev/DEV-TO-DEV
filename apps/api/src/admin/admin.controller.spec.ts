import { Reflector } from '@nestjs/core';
import { ExecutionContext, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { RolesGuard } from './roles.guard';
import { PERMISSIONS_KEY } from './permissions.decorator';
import { PrismaService } from '../prisma/prisma.service';
import { SessionsService } from '../sessions/sessions.service';

describe('AdminController authorization', () => {
  const reflector = new Reflector();

  function handler(handlerName: string): Function {
    return (AdminController.prototype as unknown as Record<string, Function>)[handlerName];
  }

  function requiredPermissions(handlerName: string): string[] {
    return reflector.get<string[]>(PERMISSIONS_KEY, handler(handlerName)) ?? [];
  }

  it('protects staff listing with staff.manage (not users.view)', () => {
    expect(requiredPermissions('getStaff')).toContain('staff.manage');
    expect(requiredPermissions('getStaff')).not.toContain('users.view');
  });

  it('protects staff email lookup with staff.manage (not users.manage)', () => {
    expect(requiredPermissions('findStaffByEmail')).toContain('staff.manage');
    expect(requiredPermissions('findStaffByEmail')).not.toContain('users.manage');
  });

  it('protects staff status changes with staff.manage (not users.manage)', () => {
    expect(requiredPermissions('setStaffStatus')).toContain('staff.manage');
    expect(requiredPermissions('setStaffStatus')).not.toContain('users.manage');
  });

  it('protects all invitation endpoints with staff.manage', () => {
    expect(requiredPermissions('inviteStaff')).toContain('staff.manage');
    expect(requiredPermissions('listInvites')).toContain('staff.manage');
    expect(requiredPermissions('resendInvite')).toContain('staff.manage');
    expect(requiredPermissions('revokeInvite')).toContain('staff.manage');
  });

  it('keeps users.manage on the ordinary user role-change endpoint', () => {
    expect(requiredPermissions('changeUserRole')).toContain('users.manage');
    expect(requiredPermissions('changeUserRole')).not.toContain('staff.manage');
  });
});

describe('RolesGuard enforcement (real decorators + guard)', () => {
  const reflector = new Reflector();
  const sessions = { validateSession: jest.fn() };
  const prisma = { user: { findUnique: jest.fn() } };

  const guard = new RolesGuard(
    reflector,
    sessions as unknown as SessionsService,
    prisma as unknown as PrismaService,
  );

  function contextFor(handlerName: string, cookie?: string): ExecutionContext {
    const handler = (AdminController.prototype as unknown as Record<string, Function>)[handlerName];
    const req: Record<string, unknown> = { cookies: cookie ? { session_id: cookie } : {} };
    return {
      getHandler: () => handler,
      getClass: () => AdminController,
      switchToHttp: () => ({ getRequest: () => req }),
    } as unknown as ExecutionContext;
  }

  function actorIs(role: string) {
    sessions.validateSession.mockResolvedValue('u-actor');
    prisma.user.findUnique.mockResolvedValue({ id: 'u-actor', role, status: 'ACTIVE' });
  }

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it.each(['PLATFORM_ADMIN', 'ADMIN', 'MODERATOR', 'SUPPORT', 'MARKETING_MANAGER', 'ANALYTICS_VIEWER'])(
    'denies %s access to staff listing',
    async (role) => {
      actorIs(role);
      await expect(guard.canActivate(contextFor('getStaff', 'valid'))).rejects.toThrow(ForbiddenException);
    },
  );

  it.each(['PLATFORM_ADMIN', 'ADMIN', 'MODERATOR', 'SUPPORT', 'MARKETING_MANAGER', 'ANALYTICS_VIEWER'])(
    'denies %s access to staff email lookup',
    async (role) => {
      actorIs(role);
      await expect(guard.canActivate(contextFor('findStaffByEmail', 'valid'))).rejects.toThrow(ForbiddenException);
    },
  );

  it.each(['PLATFORM_ADMIN', 'ADMIN', 'MODERATOR', 'SUPPORT', 'MARKETING_MANAGER', 'ANALYTICS_VIEWER'])(
    'denies %s access to staff status changes',
    async (role) => {
      actorIs(role);
      await expect(guard.canActivate(contextFor('setStaffStatus', 'valid'))).rejects.toThrow(ForbiddenException);
    },
  );

  it.each(['SUPER_ADMIN', 'ADMIN', 'PLATFORM_ADMIN'])('allows %s to change a user role', async (role) => {
    actorIs(role);
    await expect(guard.canActivate(contextFor('changeUserRole', 'valid'))).resolves.toBe(true);
  });

  it.each(['MODERATOR', 'SUPPORT', 'MARKETING_MANAGER', 'ANALYTICS_VIEWER'])(
    'denies %s the user role-change endpoint',
    async (role) => {
      actorIs(role);
      await expect(guard.canActivate(contextFor('changeUserRole', 'valid'))).rejects.toThrow(ForbiddenException);
    },
  );

  it('allows SUPER_ADMIN every staff-management endpoint', async () => {
    actorIs('SUPER_ADMIN');
    for (const name of ['getStaff', 'findStaffByEmail', 'setStaffStatus', 'inviteStaff', 'listInvites', 'resendInvite', 'revokeInvite']) {
      await expect(guard.canActivate(contextFor(name, 'valid'))).resolves.toBe(true);
    }
  });

  it('rejects requests without a session token', async () => {
    await expect(guard.canActivate(contextFor('getStaff'))).rejects.toThrow(UnauthorizedException);
  });
});
