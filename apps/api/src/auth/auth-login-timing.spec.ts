import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { verifyPassword } from './password.util';

jest.mock('./password.util', () => ({
  hashPassword: jest.fn(async (p: string) => `hash:${p}`),
  verifyPassword: jest.fn(async () => false),
  DUMMY_PASSWORD_HASH: 'dummy-hash',
}));

const verifyPasswordMock = verifyPassword as jest.Mock;

describe('AuthService login timing mitigation', () => {
  const prisma = { user: { findFirst: jest.fn() } };
  const redisService = { getClient: () => ({}) } as unknown as RedisService;

  function makeService() {
    return new AuthService(prisma as unknown as PrismaService, redisService);
  }

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('runs the dummy verification for an unknown email', async () => {
    prisma.user.findFirst.mockResolvedValue(null);
    const service = makeService();

    await expect(service.loginWithPassword('a@example.com', 'password')).resolves.toBeNull();

    expect(verifyPasswordMock).toHaveBeenCalledTimes(1);
    expect(verifyPasswordMock).toHaveBeenCalledWith('password', 'dummy-hash');
  });

  it('runs the dummy verification for a password-less (OAuth-only) account', async () => {
    prisma.user.findFirst.mockResolvedValue({ id: 'u1', email: 'a@example.com', passwordHash: null });
    const service = makeService();

    await expect(service.loginWithPassword('a@example.com', 'password')).resolves.toBeNull();

    expect(verifyPasswordMock).toHaveBeenCalledTimes(1);
    expect(verifyPasswordMock).toHaveBeenCalledWith('password', 'dummy-hash');
  });

  it('verifies against the real stored hash for a password account', async () => {
    prisma.user.findFirst.mockResolvedValue({ id: 'u1', email: 'a@example.com', passwordHash: 'stored-hash' });
    const service = makeService();

    await service.loginWithPassword('a@example.com', 'password');

    expect(verifyPasswordMock).toHaveBeenCalledTimes(1);
    expect(verifyPasswordMock).toHaveBeenCalledWith('password', 'stored-hash');
  });
});
