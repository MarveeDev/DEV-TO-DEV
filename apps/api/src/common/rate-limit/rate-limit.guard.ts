import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request, Response } from 'express';
import { SessionsService } from '../../sessions/sessions.service';
import { RateLimitService } from './rate-limit.service';
import {
  GLOBAL_RATE_LIMIT,
  RateLimitIdentity,
  RateLimitOptions,
} from './rate-limit.types';
import {
  RATE_LIMIT_KEY,
  SKIP_RATE_LIMIT_KEY,
} from './rate-limit.decorator';

interface Identity {
  prefix: 'u' | 'ip';
  value: string;
}

/**
 * Global HTTP rate-limiting guard.
 *
 * Resolves a stable identity for each request (authenticated user id when a
 * valid session cookie is present, otherwise the client IP), builds a
 * normalized Redis key from the Express route pattern (dynamic `:id` segments
 * are never part of the key), and delegates the counting to
 * {@link RateLimitService}. On breach it emits a 429 with a Retry-After header.
 */
@Injectable()
export class RateLimitGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly rateLimitService: RateLimitService,
    private readonly sessionsService: SessionsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const skip = this.reflector.getAllAndOverride<boolean>(SKIP_RATE_LIMIT_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (skip) {
      return true;
    }

    const options = this.reflector.getAllAndOverride<RateLimitOptions>(
      RATE_LIMIT_KEY,
      [context.getHandler(), context.getClass()],
    );

    const req = context.switchToHttp().getRequest<Request>();
    const res = context.switchToHttp().getResponse<Response>();

    const config = options ?? GLOBAL_RATE_LIMIT;
    const identity = await this.resolveIdentity(req, config.identity ?? 'auto');
    const key = this.buildKey(req, config, identity);

    const result = await this.rateLimitService.consume(
      key,
      config.limit,
      config.windowMs,
      config.failClosed ?? false,
    );

    if (!result.allowed) {
      res.setHeader('Retry-After', String(result.retryAfterSeconds));
      throw new HttpException(
        {
          statusCode: HttpStatus.TOO_MANY_REQUESTS,
          message: 'Too many requests. Please try again later.',
          retryAfter: result.retryAfterSeconds,
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    return true;
  }

  private async resolveIdentity(
    req: Request,
    mode: RateLimitIdentity,
  ): Promise<Identity> {
    if (mode === 'ip') {
      return { prefix: 'ip', value: this.clientIp(req) };
    }

    let userId: string | null = null;
    const token = req.cookies?.['session_id'] as string | undefined;
    if (token) {
      try {
        userId = await this.sessionsService.validateSession(token);
      } catch {
        // Session validation depends on Redis. If it is unavailable, treat the
        // request as anonymous (IP keyed) rather than throwing a 500 on top of
        // the Redis outage.
        userId = null;
      }
    }

    if (userId) {
      return { prefix: 'u', value: userId };
    }
    return { prefix: 'ip', value: this.clientIp(req) };
  }

  /**
   * Builds the Redis key from the normalized Express route pattern. `req.route.path`
   * yields the pattern (e.g. `/posts/:id/comments`) rather than the concrete URL,
   * so dynamic resource ids never produce unbounded distinct keys.
   */
  private buildKey(req: Request, config: RateLimitOptions, identity: Identity): string {
    const method = req.method.toUpperCase();
    const routePath: string =
      (req as Request & { route?: { path?: string } }).route?.path ?? req.path;
    const windowSec = Math.round(config.windowMs / 1000);
    const tier = config.tier ?? 't1';
    return `devtodev:rl:${tier}:${identity.prefix}:${identity.value}:${method} ${routePath}:${windowSec}`;
  }

  /**
   * Derives the client IP via Express's proxy-aware `req.ip` (which honors the
   * `trust proxy` setting) rather than trusting a raw `X-Forwarded-For` header.
   */
  private clientIp(req: Request): string {
    const ip = req.ip;
    if (!ip) return 'unknown';
    return ip.startsWith('::ffff:') ? ip.slice('::ffff:'.length) : ip;
  }
}
