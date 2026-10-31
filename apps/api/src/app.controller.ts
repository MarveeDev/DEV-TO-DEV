import { Controller, Get, Res } from '@nestjs/common';
import type { Response } from 'express';
import axios from 'axios';
import { SkipRateLimit } from './common/rate-limit/rate-limit.decorator';
import { PrismaService } from './prisma/prisma.service';
import { RedisService } from './redis/redis.service';

const READINESS_TIMEOUT_MS = 2000;

async function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  let timer: NodeJS.Timeout | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error('dependency timeout')), ms);
  });
  try {
    return await Promise.race([promise, timeout]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

@Controller()
export class AppController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  @Get('health')
  @SkipRateLimit()
  async healthCheck() {
    let devMindStatus = 'unknown';
    try {
      const devMindUrl = process.env.DEV_MIND_URL || 'http://localhost:8000';
      const res = await axios.get(`${devMindUrl}/health`);
      const body = res.data as { status?: string };
      devMindStatus = body.status === 'healthy' ? 'connected' : 'error';
    } catch {
      devMindStatus = 'disconnected';
    }

    return {
      status: 'healthy',
      api: 'connected',
      devMind: devMindStatus,
      // Postgres and Redis are verified via nestjs lifecycle/config which we will wire later
    };
  }

  @Get('health/ready')
  @SkipRateLimit()
  async healthReady(@Res() res: Response) {
    const [database, redis] = await Promise.all([
      this.checkDatabase(),
      this.checkRedis(),
    ]);

    const ok = database === 'up' && redis === 'up';
    return res.status(ok ? 200 : 503).json({
      status: ok ? 'ok' : 'unavailable',
      database,
      redis,
    });
  }

  private async checkDatabase(): Promise<'up' | 'down'> {
    try {
      await withTimeout(this.prisma.$queryRaw`SELECT 1`, READINESS_TIMEOUT_MS);
      return 'up';
    } catch {
      return 'down';
    }
  }

  private async checkRedis(): Promise<'up' | 'down'> {
    try {
      const pong = await withTimeout(
        this.redis.getClient().ping(),
        READINESS_TIMEOUT_MS,
      );
      return pong === 'PONG' ? 'up' : 'down';
    } catch {
      return 'down';
    }
  }
}
