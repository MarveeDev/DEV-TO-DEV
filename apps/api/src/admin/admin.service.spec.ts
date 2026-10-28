import { AdminService } from './admin.service';
import { PrismaService } from '../prisma/prisma.service';
import { SessionsService } from '../sessions/sessions.service';
import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';

describe('AdminService staff management', () => {
  const prisma = {
    $transaction: jest.fn(),
    user: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      count: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn(),
    },
    adminInvite: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn(),
      findMany: jest.fn(),
    },
    adminAuditLog: { create: jest.fn() },
  };
  const sessionsService = { revokeAllForUser: jest.fn().mockResolvedValue(undefined) };

  let service: AdminService;

  beforeEach(() => {
    jest.clearAllMocks();
    (prisma.$transaction as jest.Mock).mockImplementation(async (arg: unknown) => {
      if (typeof arg === 'function') {
        const tx = { ...prisma, $queryRaw: jest.fn(), $executeRaw: jest.fn() };
        return (arg as (t: unknown) => unknown)(tx);
      }
      return Promise.resolve(undefined);
    });
    service = new AdminService(
      prisma as unknown as PrismaService,
      sessionsService as unknown as SessionsService,
    );
  });

  function mockUsers(actor: { id: string; role: string }, target: { id: string; role: string; email?: string | null }) {
    (prisma.user.findUnique as jest.Mock).mockImplementation((args: { where: { id: string } }) => {
      if (args.where.id === actor.id) return Promise.resolve({ id: actor.id, role: actor.role });
      if (args.where.id === target.id) return Promise.resolve(target);
      return Promise.resolve(null);
    });
  }

  describe('changeUserRole authorization', () => {
    it('rejects changing your own role', async () => {
      mockUsers({ id: 'a1', role: 'SUPER_ADMIN' }, { id: 'a1', role: 'SUPER_ADMIN' });
      await expect(service.changeUserRole('a1', 'a1', 'ADMIN')).rejects.toThrow(BadRequestException);
    });

    it('rejects PLATFORM_ADMIN granting ADMIN', async () => {
      mockUsers({ id: 'a1', role: 'PLATFORM_ADMIN' }, { id: 'u1', role: 'USER' });
      await expect(service.changeUserRole('a1', 'u1', 'ADMIN')).rejects.toThrow(ForbiddenException);
    });

    it('rejects PLATFORM_ADMIN granting SUPER_ADMIN', async () => {
      mockUsers({ id: 'a1', role: 'PLATFORM_ADMIN' }, { id: 'u1', role: 'USER' });
      await expect(service.changeUserRole('a1', 'u1', 'SUPER_ADMIN')).rejects.toThrow(ForbiddenException);
    });

    it('rejects PLATFORM_ADMIN demoting a higher-privilege ADMIN', async () => {
      mockUsers({ id: 'a1', role: 'PLATFORM_ADMIN' }, { id: 'u1', role: 'ADMIN' });
      await expect(service.changeUserRole('a1', 'u1', 'MODERATOR')).rejects.toThrow(ForbiddenException);
    });

    it('rejects ADMIN granting ADMIN', async () => {
      mockUsers({ id: 'a1', role: 'ADMIN' }, { id: 'u1', role: 'USER' });
      await expect(service.changeUserRole('a1', 'u1', 'ADMIN')).rejects.toThrow(ForbiddenException);
    });

    it('rejects ADMIN modifying SUPER_ADMIN', async () => {
      mockUsers({ id: 'a1', role: 'ADMIN' }, { id: 'u1', role: 'SUPER_ADMIN' });
      await expect(service.changeUserRole('a1', 'u1', 'MODERATOR')).rejects.toThrow(ForbiddenException);
    });

    it('prevents removing the last active Super Admin', async () => {
      mockUsers({ id: 'a1', role: 'SUPER_ADMIN' }, { id: 'u1', role: 'SUPER_ADMIN' });
      prisma.user.count.mockResolvedValue(1);
      await expect(service.changeUserRole('a1', 'u1', 'MODERATOR')).rejects.toThrow(BadRequestException);
    });

    it('allows a Super Admin to change a lower staff role and audits it', async () => {
      mockUsers({ id: 'a1', role: 'SUPER_ADMIN' }, { id: 'u1', role: 'MODERATOR' });
      prisma.user.update.mockResolvedValue({ id: 'u1', email: 'u1@example.com', role: 'SUPPORT', status: 'ACTIVE' });

      const result = await service.changeUserRole('a1', 'u1', 'SUPPORT');

      expect(result.role).toBe('SUPPORT');
      expect(prisma.adminAuditLog.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ action: 'USER_ROLE_CHANGED', actorId: 'a1' }),
        }),
      );
    });
  });

  describe('setStaffStatus authorization', () => {
    it('rejects PLATFORM_ADMIN suspending a higher-privilege ADMIN', async () => {
      mockUsers({ id: 'a1', role: 'PLATFORM_ADMIN' }, { id: 'u1', role: 'ADMIN' });
      await expect(service.setStaffStatus('a1', 'u1', 'SUSPENDED')).rejects.toThrow(ForbiddenException);
    });

    it('prevents deactivating the last active Super Admin', async () => {
      mockUsers({ id: 'a1', role: 'SUPER_ADMIN' }, { id: 'u1', role: 'SUPER_ADMIN' });
      prisma.user.count.mockResolvedValue(1);
      await expect(service.setStaffStatus('a1', 'u1', 'SUSPENDED')).rejects.toThrow(BadRequestException);
    });

    it('revokes sessions and the matching pending invite when deactivating', async () => {
      mockUsers({ id: 'a1', role: 'ADMIN' }, { id: 'u1', role: 'MODERATOR', email: 'Staff@Example.com' });
      prisma.user.update.mockResolvedValue({ id: 'u1', email: 'Staff@Example.com', role: 'MODERATOR', status: 'SUSPENDED' });
      prisma.adminInvite.updateMany.mockResolvedValue({ count: 1 });

      await service.setStaffStatus('a1', 'u1', 'SUSPENDED');

      expect(sessionsService.revokeAllForUser).toHaveBeenCalledWith('u1');
      expect(prisma.adminInvite.updateMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { email: 'staff@example.com', status: 'PENDING' } }),
      );
      expect(prisma.adminAuditLog.create).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ action: 'STAFF_DEACTIVATED' }) }),
      );
    });

    it('does not revoke unrelated invites when the target has no email', async () => {
      mockUsers({ id: 'a1', role: 'ADMIN' }, { id: 'u1', role: 'MODERATOR', email: null });
      prisma.user.update.mockResolvedValue({ id: 'u1', email: null, role: 'MODERATOR', status: 'SUSPENDED' });

      await service.setStaffStatus('a1', 'u1', 'SUSPENDED');

      expect(prisma.adminInvite.updateMany).not.toHaveBeenCalled();
      expect(sessionsService.revokeAllForUser).toHaveBeenCalledWith('u1');
    });
  });

  describe('inviteStaff', () => {
    it('rejects non-staff roles', async () => {
      await expect(service.inviteStaff('a1', 'new@example.com', 'USER' as never)).rejects.toThrow(BadRequestException);
    });

    it('rejects an email that already belongs to a user (case-insensitive)', async () => {
      prisma.user.findFirst.mockResolvedValue({ id: 'u1' });
      await expect(service.inviteStaff('a1', 'New@Example.com', 'MODERATOR')).rejects.toThrow(BadRequestException);
    });

    it('creates a pending invite with an expiry and audits it', async () => {
      prisma.user.findFirst.mockResolvedValue(null);
      prisma.adminInvite.findUnique.mockResolvedValue(null);
      prisma.adminInvite.create.mockResolvedValue({ id: 'inv1', email: 'new@example.com', role: 'MODERATOR' });

      await service.inviteStaff('a1', 'New@Example.com ', 'MODERATOR');

      expect(prisma.adminInvite.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            email: 'new@example.com',
            role: 'MODERATOR',
            expiresAt: expect.any(Date),
          }),
        }),
      );
      expect(prisma.adminAuditLog.create).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ action: 'STAFF_INVITED' }) }),
      );
    });
  });

  describe('revokeInvite', () => {
    it('throws when the invite does not exist', async () => {
      prisma.adminInvite.findUnique.mockResolvedValue(null);
      await expect(service.revokeInvite('a1', 'missing')).rejects.toThrow(NotFoundException);
    });

    it('rejects revoking an invite that is no longer pending', async () => {
      prisma.adminInvite.findUnique.mockResolvedValue({ id: 'inv1', email: 'a@example.com', status: 'ACCEPTED' });
      prisma.adminInvite.updateMany.mockResolvedValue({ count: 0 });
      await expect(service.revokeInvite('a1', 'inv1')).rejects.toThrow(BadRequestException);
    });
  });
});
