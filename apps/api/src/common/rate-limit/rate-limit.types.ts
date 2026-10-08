/**
 * Identity used to build the rate-limit bucket key.
 *
 * - `auto`: use the authenticated user id when a valid session exists,
 *   otherwise the client IP. This is the default for most routes.
 * - `user`: always key by user id (falls back to IP for anonymous callers so
 *   an unauthenticated request cannot bypass the limiter).
 * - `ip`: always key by client IP, even for authenticated requests. Used as a
 *   *secondary* defense (e.g. OTP) where cross-account abuse from a single IP
 *   must also be throttled.
 */
export type RateLimitIdentity = 'auto' | 'user' | 'ip';

export interface RateLimitOptions {
  /** Maximum number of requests allowed within `windowMs`. */
  limit: number;
  /** Sliding-window length in milliseconds. */
  windowMs: number;
  /**
   * Namespace tier used in the Redis key (e.g. `t1`..`t5`). Defaults to `t1`.
   * Purely organizational; does not change behavior by itself.
   */
  tier?: string;
  /** Which identity to key the bucket on. Defaults to `auto`. */
  identity?: RateLimitIdentity;
  /**
   * When true and Redis is unavailable, reject the request (fail closed)
   * rather than allowing it. Must be true for security/high-cost tiers (4/5).
   */
  failClosed?: boolean;
}

/** Baseline applied to every route without an explicit `@RateLimit`. */
export const GLOBAL_RATE_LIMIT: RateLimitOptions = {
  limit: 120,
  windowMs: 60_000,
  tier: 't1',
  identity: 'auto',
  failClosed: false,
};
