import { resolveBootstrapArgs, requireDatabaseUrl, bootstrapSuperAdmin } from './bootstrap-super-admin';

describe('bootstrapSuperAdmin argument validation', () => {
  it('requires an explicit target user id', () => {
    expect(
      resolveBootstrapArgs({ SUPER_ADMIN_BOOTSTRAP_ENV: 'production', SUPER_ADMIN_BOOTSTRAP_CONFIRM: 'CONFIRM' }),
    ).toMatch(/USER_ID/);
  });

  it('requires an explicit environment acknowledgement', () => {
    expect(
      resolveBootstrapArgs({ SUPER_ADMIN_BOOTSTRAP_USER_ID: 'u1', SUPER_ADMIN_BOOTSTRAP_CONFIRM: 'CONFIRM' }),
    ).toMatch(/ENV/);
  });

  it('requires the confirmation token', () => {
    expect(
      resolveBootstrapArgs({
        SUPER_ADMIN_BOOTSTRAP_USER_ID: 'u1',
        SUPER_ADMIN_BOOTSTRAP_ENV: 'production',
        SUPER_ADMIN_BOOTSTRAP_CONFIRM: 'nope',
      }),
    ).toMatch(/CONFIRM/);
  });

  it('accepts valid inputs', () => {
    expect(
      resolveBootstrapArgs({
        SUPER_ADMIN_BOOTSTRAP_USER_ID: 'u1',
        SUPER_ADMIN_BOOTSTRAP_ENV: 'production',
        SUPER_ADMIN_BOOTSTRAP_CONFIRM: 'CONFIRM',
      }),
    ).toEqual({ userId: 'u1', environment: 'production' });
  });

  it('fails closed when DATABASE_URL is missing', () => {
    expect(requireDatabaseUrl({})).toMatch(/DATABASE_URL/);
    expect(requireDatabaseUrl({ DATABASE_URL: 'x' })).toBeUndefined();
  });
});

describe('bootstrapSuperAdmin transaction', () => {
  it('rejects (rolls back) when the audit insertion fails', async () => {
    const prisma = {
      $transaction: jest.fn(async (cb: (tx: unknown) => unknown) => {
        const tx = {
          $executeRaw: jest.fn().mockResolvedValue(undefined),
          user: {
            findUnique: jest.fn().mockResolvedValue({
              id: 'u1',
              role: 'USER',
              status: 'ACTIVE',
              _count: { authIdentities: 1 },
            }),
            count: jest.fn().mockResolvedValue(0),
            update: jest.fn().mockResolvedValue({ id: 'u1', role: 'SUPER_ADMIN' }),
          },
          adminAuditLog: { create: jest.fn().mockRejectedValue(new Error('audit insert failed')) },
        };
        return cb(tx);
      }),
    };

    await expect(bootstrapSuperAdmin(prisma as never, 'u1')).rejects.toThrow('audit insert failed');
  });
});
