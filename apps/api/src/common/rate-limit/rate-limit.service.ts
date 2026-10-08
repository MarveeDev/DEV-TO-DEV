import {
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { RedisService } from '../../redis/redis.service';

export interface RateLimitResult {
  allowed: boolean;
  /** Seconds to wait before the next request would be allowed (0 if allowed). */
  retryAfterSeconds: number;
}

/**
 * Atomic INCR + TTL. Increments the counter and, on first use, sets the
 * sliding-window expiry. Returns `{ count, ttl_ms }` so the caller can compute
 * both the limit decision and an accurate Retry-After value without a second
 * round-trip. INCR + PEXPIRE are performed inside a single Lua script so a
 * concurrent request can never observe (or reset) a half-initialized counter.
 */
const INCR_SCRIPT = `
local key = KEYS[1]
local window_ms = tonumber(ARGV[1])
local count = redis.call('INCR', key)
if count == 1 then
  redis.call('PEXPIRE', key, window_ms)
end
local ttl = redis.call('PTTL', key)
if ttl < 0 then ttl = window_ms end
return { count, ttl }
`;

/**
 * Centralized, Redis-backed rate limiter reused by the HTTP guard and the
 * WebSocket gateway. Counters live in Redis so limits hold across API
 * instances. On Redis failure the service either fails closed (high-risk
 * tiers) or degrades to a bounded in-memory counter (availability-oriented
 * tiers) so rate limiting is never silently dropped entirely.
 */
@Injectable()
export class RateLimitService {
  private readonly logger = new Logger(RateLimitService.name);

  /** Bounded in-memory fallback used only while Redis is unavailable. */
  private readonly memory = new Map<string, { count: number; resetAt: number }>();
  private readonly MEMORY_MAX_ENTRIES = 100_000;

  constructor(private readonly redis: RedisService) {}

  /**
   * Records a request against `key` and returns whether it is within the limit.
   *
   * @param key fully-qualified Redis key (namespace + identity + route + window).
   * @param limit max requests per window.
   * @param windowMs window length in milliseconds.
   * @param failClosed when true, a Redis outage throws instead of allowing.
   */
  async consume(
    key: string,
    limit: number,
    windowMs: number,
    failClosed: boolean,
  ): Promise<RateLimitResult> {
    try {
      const client = this.redis.getClient();
      const result = (await client.eval(
        INCR_SCRIPT,
        1,
        key,
        windowMs,
      )) as [number, number];

      const count = Number(result[0]);
      const ttlMs = Number(result[1]);

      if (count > limit) {
        return {
          allowed: false,
          retryAfterSeconds: Math.max(1, Math.ceil(ttlMs / 1000)),
        };
      }
      return { allowed: true, retryAfterSeconds: 0 };
    } catch (err) {
      if (failClosed) {
        this.logger.error(
          `Rate limiter unavailable (fail-closed): ${
            err instanceof Error ? err.message : String(err)
          }`,
        );
        throw new ServiceUnavailableException(
          'Rate limiter is temporarily unavailable. Please try again later.',
        );
      }
      this.logger.warn(
        `Redis rate limiter unavailable; using in-memory fallback: ${
          err instanceof Error ? err.message : String(err)
        }`,
      );
      return this.consumeInMemory(key, limit, windowMs);
    }
  }

  /**
   * Availability-oriented fallback. Never throws and is strictly bounded so a
   * Redis outage cannot exhaust process memory.
   */
  private consumeInMemory(
    key: string,
    limit: number,
    windowMs: number,
  ): RateLimitResult {
    const now = Date.now();
    const existing = this.memory.get(key);

    if (!existing || existing.resetAt <= now) {
      if (this.memory.size >= this.MEMORY_MAX_ENTRIES) {
        // Map is full: refuse to grow further and allow the request rather
        // than evicting arbitrary entries or growing unbounded.
        return { allowed: true, retryAfterSeconds: 0 };
      }
      this.memory.set(key, { count: 1, resetAt: now + windowMs });
      return { allowed: true, retryAfterSeconds: 0 };
    }

    existing.count += 1;
    if (existing.count > limit) {
      return {
        allowed: false,
        retryAfterSeconds: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
      };
    }
    return { allowed: true, retryAfterSeconds: 0 };
  }
}
