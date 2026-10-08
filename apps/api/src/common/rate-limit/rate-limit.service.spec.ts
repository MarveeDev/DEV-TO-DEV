import { ServiceUnavailableException } from '@nestjs/common';
import { RateLimitService } from './rate-limit.service';
import { RedisService } from '../../redis/redis.service';

describe('RateLimitService', () => {
  let service: RateLimitService;
  let evalMock: jest.Mock;

  beforeEach(() => {
    evalMock = jest.fn();
    const redis = {
      getClient: () => ({ eval: evalMock }),
    } as unknown as RedisService;
    service = new RateLimitService(redis);
  });

  it('allows requests below the limit', async () => {
    evalMock.mockResolvedValue([1, 60_000]);
    const result = await service.consume('key', 10, 60_000, false);
    expect(result.allowed).toBe(true);
    expect(result.retryAfterSeconds).toBe(0);
    expect(evalMock).toHaveBeenCalledWith(expect.any(String), 1, 'key', 60_000);
  });

  it('rejects requests above the limit and reports Retry-After', async () => {
    evalMock.mockResolvedValue([11, 30_000]);
    const result = await service.consume('key', 10, 60_000, false);
    expect(result.allowed).toBe(false);
    expect(result.retryAfterSeconds).toBe(30);
  });

  it('fails closed when Redis is unavailable', async () => {
    evalMock.mockRejectedValue(new Error('redis down'));
    await expect(service.consume('key', 10, 60_000, true)).rejects.toBeInstanceOf(
      ServiceUnavailableException,
    );
  });

  it('falls back to a bounded in-memory limiter when not fail-closed', async () => {
    evalMock.mockRejectedValue(new Error('redis down'));

    await expect(
      service.consume('key', 1, 60_000, false),
    ).resolves.toMatchObject({ allowed: true });
    await expect(
      service.consume('key', 1, 60_000, false),
    ).resolves.toMatchObject({ allowed: false });
  });
});
