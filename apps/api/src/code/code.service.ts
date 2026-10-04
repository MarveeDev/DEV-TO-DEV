import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import type { Redis } from 'ioredis';
import { RedisService } from '../redis/redis.service';

const SANDBOX_URL = process.env.SANDBOX_URL || 'http://sandbox:9000';
const SANDBOX_TOKEN = process.env.SANDBOX_TOKEN || '';

const USER_MIN_LIMIT = Number(process.env.CODE_USER_MIN_LIMIT ?? 30);
const USER_DAY_LIMIT = Number(process.env.CODE_USER_DAY_LIMIT ?? 300);
const IP_MIN_LIMIT = Number(process.env.CODE_IP_MIN_LIMIT ?? 60);

const SANDBOX_TIMEOUT_MS = 8000;

@Injectable()
export class CodeService {
  private readonly logger = new Logger(CodeService.name);

  /** In-process per-user concurrency guard (one active run per user). */
  private readonly activeUsers = new Set<string>();

  constructor(private readonly redis: RedisService) {}

  async run(userId: string, ip: string, language: string, code: string) {
    if (this.activeUsers.has(userId)) {
      throw new HttpException(
        'A code run is already in progress for your account.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    this.activeUsers.add(userId);
    try {
      await this.assertRateLimits(userId, ip);
      return await this.execute(language, code);
    } finally {
      this.activeUsers.delete(userId);
    }
  }

  /**
   * Fail-closed rate limiting. If Redis is unavailable the run is rejected
   * rather than allowed to proceed unchecked.
   */
  private async assertRateLimits(userId: string, ip: string): Promise<void> {
    const client = this.redis.getClient();
    const today = new Date().toISOString().slice(0, 10);
    const keys = {
      userMin: `devtodev:code:rl:user:${userId}:min`,
      userDay: `devtodev:code:rl:user:${userId}:day:${today}`,
      ipMin: `devtodev:code:rl:ip:${ip}:min`,
    };

    try {
      const [userMin, userDay, ipMin] = await Promise.all([
        this.increment(client, keys.userMin, 60),
        this.increment(client, keys.userDay, 86400),
        this.increment(client, keys.ipMin, 60),
      ]);

      if (userMin > USER_MIN_LIMIT) {
        throw new HttpException(
          'Too many requests. Please wait a moment and try again.',
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }
      if (userDay > USER_DAY_LIMIT) {
        throw new HttpException(
          'Daily code run limit reached.',
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }
      if (ipMin > IP_MIN_LIMIT) {
        throw new HttpException(
          'Too many requests from this network.',
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }
    } catch (err) {
      if (err instanceof HttpException) throw err;
      this.logger.error(
        `Rate limiter unavailable: ${err instanceof Error ? err.message : String(err)}`,
      );
      throw new HttpException(
        'Code execution is temporarily unavailable.',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }

  private async increment(
    client: Redis,
    key: string,
    ttl: number,
  ): Promise<number> {
    const count = await client.incr(key);
    if (count === 1) {
      await client.expire(key, ttl);
    }
    return count;
  }

  private async execute(language: string, code: string) {
    try {
      const res = await fetch(`${SANDBOX_URL}/run`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(SANDBOX_TOKEN ? { 'x-sandbox-token': SANDBOX_TOKEN } : {}),
        },
        body: JSON.stringify({ language, code }),
        signal: AbortSignal.timeout(SANDBOX_TIMEOUT_MS),
      });

      if (!res.ok) {
        this.logger.warn(`Sandbox returned non-ok status ${res.status}`);
        throw new HttpException(
          'Code execution is temporarily unavailable.',
          HttpStatus.BAD_GATEWAY,
        );
      }

      return (await res.json()) as Record<string, unknown>;
    } catch (err) {
      if (err instanceof HttpException) throw err;
      this.logger.warn(
        `Sandbox request failed: ${err instanceof Error ? err.message : String(err)}`,
      );
      throw new HttpException(
        'Code execution is temporarily unavailable.',
        HttpStatus.BAD_GATEWAY,
      );
    }
  }
}
