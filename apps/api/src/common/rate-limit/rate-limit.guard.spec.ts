import { HttpException } from '@nestjs/common';
import { RateLimitGuard } from './rate-limit.guard';
import { RateLimitService } from './rate-limit.service';
import { SessionsService } from '../../sessions/sessions.service';
import { RATE_LIMIT_KEY, SKIP_RATE_LIMIT_KEY } from './rate-limit.decorator';

interface ContextOptions {
  method?: string;
  path?: string;
  routePath?: string;
  cookies?: Record<string, string>;
  ip?: string;
}

function makeContext({
  method = 'GET',
  path = '/posts',
  routePath = '/posts',
  cookies = {},
  ip = '1.2.3.4',
}: ContextOptions = {}) {
  const req = { method, path, route: { path: routePath }, cookies, ip };
  const res = { setHeader: jest.fn() };
  const ctx = {
    getHandler: jest.fn(),
    getClass: jest.fn(),
    switchToHttp: () => ({
      getRequest: () => req,
      getResponse: () => res,
    }),
  };
  return { ctx, req, res };
}

describe('RateLimitGuard', () => {
  let guard: RateLimitGuard;
  let reflector: { getAllAndOverride: jest.Mock };
  let rateLimitService: { consume: jest.Mock };
  let sessionsService: { validateSession: jest.Mock };

  beforeEach(() => {
    reflector = { getAllAndOverride: jest.fn() };
    rateLimitService = { consume: jest.fn() };
    sessionsService = { validateSession: jest.fn() };

    reflector.getAllAndOverride.mockImplementation((key: string) => {
      if (key === SKIP_RATE_LIMIT_KEY) return false;
      if (key === RATE_LIMIT_KEY) return undefined;
      return undefined;
    });
    rateLimitService.consume.mockResolvedValue({
      allowed: true,
      retryAfterSeconds: 0,
    });

    guard = new RateLimitGuard(
      reflector as never,
      rateLimitService as unknown as RateLimitService,
      sessionsService as unknown as SessionsService,
    );
  });

  it('allows a request below the limit', async () => {
    const { ctx } = makeContext();
    await expect(guard.canActivate(ctx as never)).resolves.toBe(true);
  });

  it('keys authenticated requests by user id', async () => {
    sessionsService.validateSession.mockResolvedValue('u1');
    const { ctx } = makeContext({ cookies: { session_id: 'token' } });
    await guard.canActivate(ctx as never);
    expect(rateLimitService.consume).toHaveBeenCalledWith(
      expect.stringContaining('u:u1'),
      120,
      60_000,
      false,
    );
  });

  it('keys anonymous requests by IP', async () => {
    sessionsService.validateSession.mockResolvedValue(null);
    const { ctx } = makeContext();
    await guard.canActivate(ctx as never);
    expect(rateLimitService.consume).toHaveBeenCalledWith(
      expect.stringContaining('ip:1.2.3.4'),
      120,
      60_000,
      false,
    );
  });

  it('normalizes dynamic resource ids into the route pattern', async () => {
    sessionsService.validateSession.mockResolvedValue(null);
    const { ctx } = makeContext({
      method: 'POST',
      path: '/posts/123/comments',
      routePath: '/posts/:id/comments',
    });
    await guard.canActivate(ctx as never);
    expect(rateLimitService.consume).toHaveBeenCalledWith(
      expect.stringContaining('POST /posts/:id/comments'),
      120,
      60_000,
      false,
    );
  });

  it('skips entirely when @SkipRateLimit is present', async () => {
    reflector.getAllAndOverride.mockImplementation((key: string) =>
      key === SKIP_RATE_LIMIT_KEY ? true : undefined,
    );
    const { ctx } = makeContext();
    await expect(guard.canActivate(ctx as never)).resolves.toBe(true);
    expect(rateLimitService.consume).not.toHaveBeenCalled();
  });

  it('returns 429 with a Retry-After header when over the limit', async () => {
    sessionsService.validateSession.mockResolvedValue(null);
    rateLimitService.consume.mockResolvedValue({
      allowed: false,
      retryAfterSeconds: 42,
    });
    const { ctx, res } = makeContext();

    await expect(guard.canActivate(ctx as never)).rejects.toBeInstanceOf(
      HttpException,
    );

    try {
      await guard.canActivate(ctx as never);
    } catch (err) {
      expect((err as HttpException).getStatus()).toBe(429);
      expect((err as HttpException).getResponse()).toEqual({
        statusCode: 429,
        message: 'Too many requests. Please try again later.',
        retryAfter: 42,
      });
    }

    expect(res.setHeader).toHaveBeenCalledWith('Retry-After', '42');
  });
});
