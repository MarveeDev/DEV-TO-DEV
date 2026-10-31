import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, ScoreEventType } from '@prisma/client';
import {
  SCORE_POINTS,
  STREAK_BONUS_POINTS,
  MAX_REWARDED_POSTS_PER_DAY,
  utcDay,
  addUtcDays,
} from './score-rules';

@Injectable()
export class ScoreService {
  constructor(private prisma: PrismaService) {}

  /**
   * Awards points for a genuine, deduplicated activity event.
   *
   * Idempotency: the unique (developerProfileId, type, referenceId) constraint
   * on DeveloperScoreEvent makes repeated/retried awards a no-op.
   *
   * Concurrency: a per-profile Postgres advisory lock serializes concurrent
   * awards for the same developer, so the 3-post daily cap and the once-per-day
   * streak bonus cannot be exceeded by racing requests.
   *
   * Streak (UTC): a "qualifying day" is a UTC day in which the developer earned
   * at least one rewarded post. `lastActivityDate` stores that last qualifying
   * day. The first qualifying day starts the streak at 1 and awards the 15-point
   * bonus; a consecutive qualifying day extends it; a missed day resets it.
   * Connections and other activities award fixed points but do not qualify a
   * streak day.
   */
  async award(
    userId: string,
    type: ScoreEventType,
    referenceId: string,
  ): Promise<void> {
    const points = SCORE_POINTS[type];
    if (points === undefined) {
      // Unknown/unapproved event type: never award.
      return;
    }

    const profile = await this.prisma.developerProfile.findUnique({
      where: { userId },
      select: { id: true },
    });
    if (!profile) return;

    const today = utcDay(new Date());

    await this.prisma.$transaction(async (tx) => {
      // Serialize awards for this developer. hashtext() is deterministic within
      // the running database and is used only as an advisory-lock key.
      await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${profile.id})::bigint)`;

      const score = await this.loadOrCreateScore(tx, profile.id);

      const prevDay = score.lastActivityDate
        ? utcDay(score.lastActivityDate)
        : null;
      const isNewDay = !prevDay || prevDay.getTime() < today.getTime();

      const dailyPostCount = isNewDay ? 0 : score.dailyPostCount;
      const dailyConnectionCount = isNewDay ? 0 : score.dailyConnectionCount;

      let awardedPoints = points;
      let eventPoints = points;
      let postsIncrement = 0;
      let connectionsIncrement = 0;
      let projectsIncrement = 0;
      let streak = score.streak;
      let lastActivityDate = score.lastActivityDate;
      let newDailyPostCount = dailyPostCount;
      let newDailyConnectionCount = dailyConnectionCount;

      if (type === 'POST_CREATED') {
        // postsCount tracks every created post (used for display), while the
        // daily cap only limits the rewarded points and dailyPostCount.
        postsIncrement = 1;
        if (dailyPostCount >= MAX_REWARDED_POSTS_PER_DAY) {
          // Daily cap reached: the post still creates an event record for
          // idempotency, but earns no points and does not count toward streak.
          awardedPoints = 0;
          eventPoints = 0;
        } else {
          newDailyPostCount = dailyPostCount + 1;
          if (isNewDay) {
            const yesterday = addUtcDays(today, -1);
            streak =
              prevDay && prevDay.getTime() === yesterday.getTime()
                ? streak + 1
                : 1;
            awardedPoints += STREAK_BONUS_POINTS;
          }
          lastActivityDate = today;
        }
      } else if (type === 'CONNECTION_ACCEPTED') {
        newDailyConnectionCount = dailyConnectionCount + 1;
        connectionsIncrement = 1;
        // Connections do not qualify a streak day.
      } else {
        // Other activities award fixed points; they never reset/extend a streak.
        if (type === 'PROJECT_CREATED') {
          projectsIncrement = 1;
        }
      }

      // Idempotency gate: a duplicate event aborts the award.
      try {
        await tx.developerScoreEvent.create({
          data: {
            developerProfileId: profile.id,
            type,
            points: eventPoints,
            referenceId,
          },
        });
      } catch (e) {
        if (this.isUniqueViolation(e)) return;
        throw e;
      }

      await tx.developerScore.update({
        where: { developerProfileId: profile.id },
        data: {
          score: { increment: awardedPoints },
          postsCount: { increment: postsIncrement },
          connectionsCount: { increment: connectionsIncrement },
          projectsCount: { increment: projectsIncrement },
          dailyPostCount: newDailyPostCount,
          dailyConnectionCount: newDailyConnectionCount,
          streak,
          lastActivityDate,
        },
      });
    });
  }

  private async loadOrCreateScore(
    tx: Prisma.TransactionClient,
    developerProfileId: string,
  ): Promise<{
    score: number;
    streak: number;
    postsCount: number;
    connectionsCount: number;
    projectsCount: number;
    lastActivityDate: Date | null;
    dailyPostCount: number;
    dailyConnectionCount: number;
  }> {
    const existing = await tx.developerScore.findUnique({
      where: { developerProfileId },
    });
    if (existing) return existing;
    return tx.developerScore.create({ data: { developerProfileId } });
  }

  private isUniqueViolation(e: unknown): boolean {
    return (
      typeof e === 'object' &&
      e !== null &&
      'code' in e &&
      (e as { code?: string }).code === 'P2002'
    );
  }

  async getMyScore(userId: string) {
    const profile = await this.prisma.developerProfile.findUnique({
      where: { userId },
      include: { score: true },
    });

    if (!profile) throw new NotFoundException('Profile not found');

    if (!profile.score) {
      return this.prisma.developerScore.create({
        data: { developerProfileId: profile.id },
      });
    }

    return profile.score;
  }

  async getPublicScore(username: string) {
    const profile = await this.prisma.developerProfile.findUnique({
      where: { username },
      include: { score: true },
    });

    if (!profile || !profile.score) return null;

    return {
      score: profile.score.score,
      streak: profile.score.streak,
      postsCount: profile.score.postsCount,
      connectionsCount: profile.score.connectionsCount,
      projectsCount: profile.score.projectsCount,
    };
  }
}
