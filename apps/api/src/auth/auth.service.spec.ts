import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import axios from 'axios';

jest.mock('axios');

describe('AuthService OAuth email linking', () => {
  const redisClient = { setex: jest.fn(), get: jest.fn(), del: jest.fn() };
  const prisma = {
    authIdentity: { findUnique: jest.fn(), create: jest.fn() },
    user: { findUnique: jest.fn(), create: jest.fn() },
  };
  const redisService = {
    getClient: () => redisClient,
  } as unknown as RedisService;

  const axiosMock = axios as jest.Mocked<typeof axios>;

  function makeService() {
    return new AuthService(prisma as unknown as PrismaService, redisService);
  }

  const prevEnv = { ...process.env };

  beforeAll(() => {
    process.env.GOOGLE_CLIENT_ID = 'test-google-client';
    process.env.GOOGLE_CLIENT_SECRET = 'test-google-secret';
    process.env.GITHUB_CLIENT_ID = 'test-github-client';
    process.env.GITHUB_CLIENT_SECRET = 'test-github-secret';
    process.env.API_URL = 'http://localhost:3001';
  });

  afterAll(() => {
    process.env = prevEnv;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    (axiosMock.post as jest.Mock).mockResolvedValue({ data: { access_token: 'tok' } });
  });

  describe('processGoogleCallback', () => {
    beforeEach(() => {
      (axiosMock.get as jest.Mock).mockResolvedValue({
        data: { id: 'g1', email: 'admin@example.com', name: 'Admin', picture: 'http://img' },
      });
    });

    it('links to an existing user by verified email instead of creating a duplicate', async () => {
      const existingUser = { id: 'u1', email: 'admin@example.com', role: 'ADMIN' };
      prisma.authIdentity.findUnique.mockResolvedValue(null);
      prisma.user.findUnique.mockResolvedValue(existingUser);
      prisma.authIdentity.create.mockResolvedValue({});
      const service = makeService();

      const result = await service.processGoogleCallback('code', 'new_login');

      expect(result.user).toEqual(existingUser);
      expect(result.isNewUser).toBe(false);
      expect(prisma.user.create).not.toHaveBeenCalled();
      expect(prisma.authIdentity.create).toHaveBeenCalledWith({
        data: { userId: 'u1', provider: 'google', providerAccountId: 'g1' },
      });
    });

    it('returns the existing user (role preserved) when an identity already exists', async () => {
      const existingUser = { id: 'u1', email: 'admin@example.com', role: 'ADMIN' };
      prisma.authIdentity.findUnique.mockResolvedValue({ userId: 'u1', user: existingUser });
      const service = makeService();

      const result = await service.processGoogleCallback('code', 'new_login');

      expect(result.user).toEqual(existingUser);
      expect(result.isNewUser).toBe(false);
      expect(prisma.user.create).not.toHaveBeenCalled();
      expect(prisma.user.findUnique).not.toHaveBeenCalled();
    });

    it('creates a new user for a brand-new Google account', async () => {
      prisma.authIdentity.findUnique.mockResolvedValue(null);
      prisma.user.findUnique.mockResolvedValue(null);
      prisma.user.create.mockResolvedValue({ id: 'u2', email: 'admin@example.com' });
      const service = makeService();

      const result = await service.processGoogleCallback('code', 'new_login');

      expect(result.isNewUser).toBe(true);
      expect(prisma.user.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            email: 'admin@example.com',
            authIdentities: { create: { provider: 'google', providerAccountId: 'g1' } },
          }),
        }),
      );
    });
  });

  describe('processGitHubCallback', () => {
    beforeEach(() => {
      (axiosMock.get as jest.Mock).mockResolvedValue({
        data: {
          id: 123,
          email: 'admin@example.com',
          login: 'admin',
          name: 'Admin',
          avatar_url: 'http://avatar',
          location: null,
          blog: null,
        },
      });
    });

    it('links to an existing user by email instead of creating a duplicate', async () => {
      const existingUser = { id: 'u1', email: 'admin@example.com', role: 'ADMIN' };
      prisma.authIdentity.findUnique.mockResolvedValue(null);
      prisma.user.findUnique.mockResolvedValue(existingUser);
      prisma.authIdentity.create.mockResolvedValue({});
      const service = makeService();

      const result = await service.processGitHubCallback('code', 'new_login');

      expect(result.user).toEqual(existingUser);
      expect(result.isNewUser).toBe(false);
      expect(prisma.user.create).not.toHaveBeenCalled();
      expect(prisma.authIdentity.create).toHaveBeenCalledWith({
        data: { userId: 'u1', provider: 'github', providerAccountId: '123' },
      });
    });

    it('creates a new user for a brand-new GitHub account', async () => {
      prisma.authIdentity.findUnique.mockResolvedValue(null);
      prisma.user.findUnique.mockResolvedValue(null);
      prisma.user.create.mockResolvedValue({ id: 'u2', email: 'new@example.com' });
      const service = makeService();

      const result = await service.processGitHubCallback('code', 'new_login');

      expect(result.isNewUser).toBe(true);
      expect(prisma.user.create).toHaveBeenCalled();
    });
  });
});
