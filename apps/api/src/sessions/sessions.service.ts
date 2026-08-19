import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { randomBytes } from 'crypto';

@Injectable()
export class SessionsService {
  // 14 days in seconds
  private readonly SESSION_EXPIRATION_SECONDS = 14 * 24 * 60 * 60;
  private readonly SESSION_EXPIRATION_MS = this.SESSION_EXPIRATION_SECONDS * 1000;

  constructor(
    private readonly prisma: PrismaService,
    private readonly redisService: RedisService,
  ) {}

  /**
   * Creates a new session for the given user, saving to Postgres and caching in Redis.
   */
  async createSession(userId: string): Promise<string> {
    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + this.SESSION_EXPIRATION_MS);

    // Persist to Postgres
    await this.prisma.session.create({
      data: {
        userId,
        token,
        expiresAt,
      },
    });

    // Cache in Redis
    const redis = this.redisService.getClient();
    await redis.setex(`session:${token}`, this.SESSION_EXPIRATION_SECONDS, userId);

    return token;
  }

  /**
   * Validates a session token, returning the userId if valid.
   * Uses Redis as primary, falls back to Postgres if evicted but still valid.
   */
  async validateSession(token: string): Promise<string | null> {
    const redis = this.redisService.getClient();
    let userId = await redis.get(`session:${token}`);

    if (userId) {
      return userId;
    }

    // Fallback to Postgres
    const session = await this.prisma.session.findUnique({
      where: { token },
    });

    if (!session) {
      return null;
    }

    if (session.expiresAt < new Date()) {
      // Clean up expired session
      await this.revokeSession(token);
      return null;
    }

    // Re-warm Redis cache
    const ttlMs = session.expiresAt.getTime() - Date.now();
    if (ttlMs > 0) {
      await redis.setex(`session:${token}`, Math.floor(ttlMs / 1000), session.userId);
    }

    return session.userId;
  }

  /**
   * Revokes a session completely from Redis and Postgres.
   */
  async revokeSession(token: string): Promise<void> {
    const redis = this.redisService.getClient();
    await redis.del(`session:${token}`);

    try {
      await this.prisma.session.delete({
        where: { token },
      });
    } catch (error) {
      // Ignore if it doesn't exist in DB
    }
  }
}
