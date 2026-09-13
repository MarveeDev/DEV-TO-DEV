import { Injectable, Logger } from '@nestjs/common';
import { RedisService } from './redis.service';

/**
 * Lightweight, failure-tolerant cache for PUBLIC (non-user-specific) data.
 *
 * Every method swallows Redis errors so a Redis outage never breaks the API —
 * cache misses fall back to PostgreSQL and writes simply no-op.
 */
@Injectable()
export class PublicCacheService {
  private readonly logger = new Logger(PublicCacheService.name);

  constructor(private readonly redis: RedisService) {}

  async get<T>(key: string): Promise<T | null> {
    try {
      const raw = await this.redis.getClient().get(key);
      if (!raw) return null;
      return JSON.parse(raw) as T;
    } catch (e) {
      this.logger.warn(`Public cache get failed for ${key}: ${(e as Error)?.message}`);
      return null;
    }
  }

  async set(key: string, value: unknown, ttlSeconds: number): Promise<void> {
    try {
      await this.redis.getClient().setex(key, ttlSeconds, JSON.stringify(value));
    } catch (e) {
      this.logger.warn(`Public cache set failed for ${key}: ${(e as Error)?.message}`);
    }
  }

  /**
   * Deletes all keys matching the given prefix (e.g. `devtodev:public:projects:`).
   * Uses SCAN so it never blocks Redis.
   */
  async invalidateByPrefix(prefix: string): Promise<void> {
    try {
      const client = this.redis.getClient();
      const stream = client.scanStream({ match: `${prefix}*`, count: 100 });
      const keys: string[] = [];
      for await (const batch of stream) {
        for (const key of batch as string[]) {
          keys.push(key);
        }
      }
      if (keys.length > 0) {
        await client.del(...keys);
      }
    } catch (e) {
      this.logger.warn(
        `Public cache invalidation failed for prefix ${prefix}: ${(e as Error)?.message}`,
      );
    }
  }
}
