import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { UnauthorizedException } from '@nestjs/common';
import { hashPassword } from './password.util';

describe('AuthService password + activation', () => {
  const prisma = {
    user: { findFirst: jest.fn(), findUnique: jest.fn(), create: jest.fn() },
    adminInvite: { findFirst: jest.fn(), updateMany: jest.fn() },
    adminAuditLog: { create: jest.fn() },
    $transaction: jest.fn(),
  };
  const redisService = {
    getClient: () => ({ setex: jest.fn(), get: jest.fn(), del: jest.fn() }),
  } as unknown as RedisService;

  function makeService() {
    return new AuthService(prisma as unknown as PrismaService, redisService);
  }

  beforeEach(() => {
    jest.clearAllMocks();
    (prisma.$transaction as jest.Mock).mockImplementation(
      async (fn: (tx: unknown) => Promise<unknown>) => fn(prisma),
    );
  });

  describe('loginWithPassword', () => {
    it('returns the user for a correct password', async () => {
      const stored = await hashPassword('s3cret-pass');
      prisma.user.findFirst.mockResolvedValue({ id: 'u1', email: 'a@example.com', passwordHash: stored });
      const service = makeService();

      await expect(service.loginWithPassword('a@example.com', 's3cret-pass')).resolves.toMatchObject({ id: 'u1' });
    });

    it('returns null for a wrong password', async () => {
      const stored = await hashPassword('s3cret-pass');
      prisma.user.findFirst.mockResolvedValue({ id: 'u1', email: 'a@example.com', passwordHash: stored });
      const service = makeService();

      await expect(service.loginWithPassword('a@example.com', 'wrong-pass')).resolves.toBeNull();
    });

    it('returns null for an unknown email', async () => {
      prisma.user.findFirst.mockResolvedValue(null);
      const service = makeService();

      await expect(service.loginWithPassword('a@example.com', 's3cret-pass')).resolves.toBeNull();
    });
  });

  describe('getUser', () => {
    it('never exposes the password hash', async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: 'u1',
        email: 'a@example.com',
        role: 'ADMIN',
        status: 'ACTIVE',
        passwordHash: 'scrypt$salt$hash',
        developerProfile: null,
      });
      const service = makeService();

      const result = await service.getUser('u1');

      expect(result).not.toHaveProperty('passwordHash');
      expect(result.id).toBe('u1');
      expect(result.email).toBe('a@example.com');
    });
  });

  describe('activateInvite', () => {
    function pendingInvite(overrides: Record<string, unknown> = {}) {
      return {
        id: 'inv1',
        email: 'staff@example.com',
        name: 'Jane',
        role: 'SUPPORT',
        status: 'PENDING',
        tokenHash: 'whatever',
        invitedById: 'a1',
        createdAt: new Date(),
        acceptedAt: null,
        expiresAt: new Date(Date.now() + 60_000),
        ...overrides,
      };
    }

    it('rejects an unknown token', async () => {
      prisma.adminInvite.findFirst.mockResolvedValue(null);
      const service = makeService();

      await expect(service.activateInvite('whatever', 'password123')).rejects.toThrow(UnauthorizedException);
    });

    it('rejects an expired invite', async () => {
      prisma.adminInvite.findFirst.mockResolvedValue(pendingInvite({ expiresAt: new Date(Date.now() - 1000) }));
      const service = makeService();

      await expect(service.activateInvite('whatever', 'password123')).rejects.toThrow(UnauthorizedException);
    });

    it('rejects a revoked invite', async () => {
      prisma.adminInvite.findFirst.mockResolvedValue(pendingInvite({ status: 'REVOKED' }));
      const service = makeService();

      await expect(service.activateInvite('whatever', 'password123')).rejects.toThrow(UnauthorizedException);
    });

    it('creates the account with the invited role and a hashed password', async () => {
      prisma.adminInvite.findFirst.mockResolvedValue(pendingInvite());
      prisma.user.findFirst.mockResolvedValue(null);
      prisma.adminInvite.updateMany.mockResolvedValue({ count: 1 });
      prisma.user.create.mockResolvedValue({ id: 'u1', email: 'staff@example.com', role: 'SUPPORT' });
      const service = makeService();

      const result = await service.activateInvite('whatever', 'password123');

      expect(result.user.id).toBe('u1');
      expect(prisma.adminInvite.updateMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'inv1', status: 'PENDING', tokenHash: expect.any(String) },
        }),
      );
      expect(prisma.user.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            email: 'staff@example.com',
            role: 'SUPPORT',
            passwordHash: expect.not.stringContaining('password123'),
          }),
        }),
      );
    });

    it('rejects double redemption when the token is already consumed', async () => {
      prisma.adminInvite.findFirst.mockResolvedValue(pendingInvite({ status: 'ACCEPTED', tokenHash: null }));
      const service = makeService();

      await expect(service.activateInvite('whatever', 'password123')).rejects.toThrow(UnauthorizedException);
    });

    it('rejects concurrent redemption when the claim loses the race', async () => {
      prisma.adminInvite.findFirst.mockResolvedValue(pendingInvite());
      prisma.user.findFirst.mockResolvedValue(null);
      prisma.adminInvite.updateMany.mockResolvedValue({ count: 0 });
      const service = makeService();

      await expect(service.activateInvite('whatever', 'password123')).rejects.toThrow(UnauthorizedException);
    });
  });
});
