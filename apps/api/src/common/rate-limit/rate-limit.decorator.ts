import { SetMetadata } from '@nestjs/common';
import { RateLimitOptions } from './rate-limit.types';

export const RATE_LIMIT_KEY = 'rate_limit';
export const SKIP_RATE_LIMIT_KEY = 'skip_rate_limit';

/**
 * Applies a route-specific rate limit, overriding the global baseline for the
 * decorated handler (or the whole controller when placed on the class).
 */
export const RateLimit = (options: RateLimitOptions) =>
  SetMetadata(RATE_LIMIT_KEY, options);

/**
 * Excludes a handler/controller from the global rate-limit guard entirely.
 * Reserved for endpoints with their own specialized protection (e.g. the Code
 * Playground limiter) or endpoints that must never be throttled (health).
 */
export const SkipRateLimit = () => SetMetadata(SKIP_RATE_LIMIT_KEY, true);
