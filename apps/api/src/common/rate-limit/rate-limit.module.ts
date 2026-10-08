import { Global, Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { RateLimitService } from './rate-limit.service';
import { RateLimitGuard } from './rate-limit.guard';

/**
 * Global rate-limiting module. Registers {@link RateLimitGuard} as a global
 * HTTP guard via the `APP_GUARD` token so dependency injection wires the
 * guard's Redis/session dependencies, and exports {@link RateLimitService} for
 * reuse by non-HTTP components (e.g. the WebSocket gateway).
 */
@Global()
@Module({
  providers: [
    RateLimitService,
    {
      provide: APP_GUARD,
      useClass: RateLimitGuard,
    },
  ],
  exports: [RateLimitService],
})
export class RateLimitModule {}
