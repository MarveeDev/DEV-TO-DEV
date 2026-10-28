import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';

describe('AuthService.applyPendingStaffInvite', () => {
  const redisClient = { setex: jest.fn(), get: jest.fn(), del: jest.fn() };
  const prisma = {
    adminInvite: { findUnique: jest.fn(), updateMany: jest.fn() },
    user: { updateMany: jest.fn() },
    adminAuditLog: { create: jest.fn() },
    $transaction: jest.fn(),
  };
  const redisService = { getClient: () => redisClient } as unknown as RedisService;

  let service: AuthService;

  beforeEach(() => {
    jest.clearAllMocks();
    (prisma.$transaction as jest.Mock).mockImplementation(async (arg: unknown) => {
      if (typeof arg === 'function') {
        const tx = { ...prisma, $queryRaw: jest.fn() };
        return (arg as (t: unknown) => unknown)(tx);
      }
      return Promise.resolve(undefined);
    });
    service = new AuthService(prisma as unknown as PrismaService, redisService);
  });

  function pendingInvite(overrides: Record<string, unknown> = {}) {
    return {
      id: 'inv1',
      email: 'staff@example.com',
      role: 'SUPPORT',
      status: 'PENDING',
      expiresAt: new Date(Date.now() + 60_000),
      ...overrides,
    };
  }

  it('grants the invited role and accepts the invite for a plain user', async () => {
    prisma.adminInvite.findUnique.mockResolvedValue(pendingInvite());
    prisma.adminInvite.updateMany.mockResolvedValue({ count: 1 });
    prisma.user.updateMany.mockResolvedValue({ count: 1 });

    await service.applyPendingStaffInvite('u1', 'staff@example.com');

    expect(prisma.user.updateMany).toHaveBeenCalledWith({
      where: { id: 'u1', role: 'USER' },
      data: { role: 'SUPPORT' },
    });
    expect(prisma.adminInvite.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ id: 'inv1', status: 'PENDING' }),
        data: expect.objectContaining({ status: 'ACCEPTED' }),
      }),
    );
    expect(prisma.adminAuditLog.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ action: 'STAFF_INVITE_ACCEPTED', entityId: 'inv1' }),
      }),
    );
  });

  it('does not grant for an expired invitation', async () => {
    prisma.adminInvite.findUnique.mockResolvedValue(
      pendingInvite({ expiresAt: new Date(Date.now() - 60_000) }),
    );

    await service.applyPendingStaffInvite('u1', 'staff@example.com');

    expect(prisma.$transaction).not.toHaveBeenCalled();
    expect(prisma.user.updateMany).not.toHaveBeenCalled();
  });

  it('does not grant for a revoked invitation', async () => {
    prisma.adminInvite.findUnique.mockResolvedValue(pendingInvite({ status: 'REVOKED' }));

    await service.applyPendingStaffInvite('u1', 'staff@example.com');

    expect(prisma.$transaction).not.toHaveBeenCalled();
  });

  it('does not grant for an already accepted invitation', async () => {
    prisma.adminInvite.findUnique.mockResolvedValue(pendingInvite({ status: 'ACCEPTED' }));

    await service.applyPendingStaffInvite('u1', 'staff@example.com');

    expect(prisma.$transaction).not.toHaveBeenCalled();
  });

  it('does nothing when the email is missing', async () => {
    await service.applyPendingStaffInvite('u1', null);

    expect(prisma.adminInvite.findUnique).not.toHaveBeenCalled();
  });

  it('does not grant the role when the invite was claimed concurrently', async () => {
    prisma.adminInvite.findUnique.mockResolvedValue(pendingInvite());
    prisma.adminInvite.updateMany.mockResolvedValue({ count: 0 });

    await service.applyPendingStaffInvite('u1', 'staff@example.com');

    expect(prisma.user.updateMany).not.toHaveBeenCalled();
    expect(prisma.adminAuditLog.create).not.toHaveBeenCalled();
  });

  it('does not overwrite a non-USER role when the user is no longer eligible', async () => {
    prisma.adminInvite.findUnique.mockResolvedValue(pendingInvite());
    prisma.adminInvite.updateMany.mockResolvedValue({ count: 1 });
    prisma.user.updateMany.mockResolvedValue({ count: 0 });

    await service.applyPendingStaffInvite('u1', 'staff@example.com');

    expect(prisma.adminAuditLog.create).not.toHaveBeenCalled();
  });
});
