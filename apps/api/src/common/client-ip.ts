import type { Request } from 'express';

/**
 * Derives the client IP from Express's proxy-aware `req.ip`.
 *
 * This intentionally does NOT read `X-Forwarded-For`, `X-Real-IP`, or
 * `Forwarded` directly. Those headers are only honored indirectly by Express
 * when the application's `trust proxy` setting is configured for a known,
 * trusted proxy chain (see `main.ts`). Reading them directly would let a
 * client rotate the value to mint new rate-limit buckets.
 */
export function clientIp(req: Request): string {
  const ip = req.ip;
  if (!ip) {
    return 'unknown';
  }
  return ip.startsWith('::ffff:') ? ip.slice('::ffff:'.length) : ip;
}
