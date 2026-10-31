import { AppController } from './app.controller';
import { PrismaService } from './prisma/prisma.service';
import { RedisService } from './redis/redis.service';

describe('AppController health', () => {
  const prisma = { $queryRaw: jest.fn() };
  const redisClient = { ping: jest.fn() };
  const redis = { getClient: jest.fn().mockReturnValue(redisClient) };

  let controller: AppController;

  function mockRes() {
    return {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as any;
  }

  beforeEach(() => {
    jest.clearAllMocks();
    redis.getClient.mockReturnValue(redisClient);
    controller = new AppController(prisma as unknown as PrismaService, redis as unknown as RedisService);
  });

  describe('GET /health/ready', () => {
    it('returns 200 when both dependencies are healthy', async () => {
      prisma.$queryRaw.mockResolvedValue([{ '?column?': 1 }]);
      redisClient.ping.mockResolvedValue('PONG');
      const res = mockRes();

      await controller.healthReady(res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 'ok',
        database: 'up',
        redis: 'up',
      });
    });

    it('returns 503 when PostgreSQL is unavailable', async () => {
      prisma.$queryRaw.mockRejectedValue(new Error('connection refused'));
      redisClient.ping.mockResolvedValue('PONG');
      const res = mockRes();

      await controller.healthReady(res);

      expect(res.status).toHaveBeenCalledWith(503);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ status: 'unavailable', database: 'down', redis: 'up' }),
      );
    });

    it('returns 503 when Redis is unavailable', async () => {
      prisma.$queryRaw.mockResolvedValue([{ '?column?': 1 }]);
      redisClient.ping.mockRejectedValue(new Error('redis down'));
      const res = mockRes();

      await controller.healthReady(res);

      expect(res.status).toHaveBeenCalledWith(503);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ status: 'unavailable', database: 'up', redis: 'down' }),
      );
    });

    it('returns 503 when both dependencies are unavailable', async () => {
      prisma.$queryRaw.mockRejectedValue(new Error('db down'));
      redisClient.ping.mockRejectedValue(new Error('redis down'));
      const res = mockRes();

      await controller.healthReady(res);

      expect(res.status).toHaveBeenCalledWith(503);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ status: 'unavailable', database: 'down', redis: 'down' }),
      );
    });

    it('times out a hung dependency and returns 503', async () => {
      jest.useFakeTimers();
      try {
        prisma.$queryRaw.mockReturnValue(new Promise(() => {})); // never settles
        redisClient.ping.mockResolvedValue('PONG');
        const res = mockRes();

        const resultPromise = controller.healthReady(res);
        jest.advanceTimersByTime(3000);
        await resultPromise;

        expect(res.status).toHaveBeenCalledWith(503);
        expect(res.json).toHaveBeenCalledWith(
          expect.objectContaining({ database: 'down' }),
        );
      } finally {
        jest.useRealTimers();
      }
    });

    it('never leaks connection strings or internal details', async () => {
      prisma.$queryRaw.mockRejectedValue(new Error('postgresql://user:pass@host/db'));
      redisClient.ping.mockRejectedValue(new Error('redis://user:pass@host:6379'));
      const res = mockRes();

      await controller.healthReady(res);

      const body = res.json.mock.calls[0][0];
      expect(JSON.stringify(body)).not.toContain('postgresql://');
      expect(JSON.stringify(body)).not.toContain('redis://');
      expect(JSON.stringify(body)).not.toContain('pass');
      expect(body).toEqual({ status: 'unavailable', database: 'down', redis: 'down' });
    });
  });

  describe('GET /health (liveness)', () => {
    it('remains a simple liveness response', async () => {
      const result = await controller.healthCheck();
      expect(result.status).toBe('healthy');
      expect(result.api).toBe('connected');
      expect(result).toHaveProperty('devMind');
    });
  });
});
