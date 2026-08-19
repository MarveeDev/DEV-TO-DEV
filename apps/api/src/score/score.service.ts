import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ScoreService {
  private readonly MAX_DAILY_POSTS = 3;
  private readonly MAX_DAILY_CONNECTIONS = 5;
  
  private readonly POINTS_PER_POST = 5;
  private readonly POINTS_PER_CONNECTION = 10;
  private readonly POINTS_PER_STREAK_DAY = 15;

  constructor(private prisma: PrismaService) {}

  private async getOrCreateScore(developerProfileId: string) {
    let score = await this.prisma.developerScore.findUnique({
      where: { developerProfileId },
    });
    
    if (!score) {
      score = await this.prisma.developerScore.create({
        data: { developerProfileId }
      });
    }
    
    return score;
  }

  private isSameDay(date1: Date, date2: Date) {
    return date1.getUTCFullYear() === date2.getUTCFullYear() &&
           date1.getUTCMonth() === date2.getUTCMonth() &&
           date1.getUTCDate() === date2.getUTCDate();
  }

  private isNextDay(lastDate: Date, today: Date) {
    const nextDay = new Date(lastDate);
    nextDay.setUTCDate(nextDay.getUTCDate() + 1);
    return this.isSameDay(nextDay, today);
  }

  private async processActivity(userId: string, type: 'POST' | 'CONNECTION') {
    return this.prisma.$transaction(async (tx) => {
      const profile = await tx.developerProfile.findUnique({ where: { userId } });
      if (!profile) return null;

      const scoreRecord = await tx.developerScore.findUnique({ where: { developerProfileId: profile.id } }) ||
                          await tx.developerScore.create({ data: { developerProfileId: profile.id } });

      const today = new Date();
      let { score, streak, lastActivityDate, dailyPostCount, dailyConnectionCount, postsCount, connectionsCount } = scoreRecord;

      let streakBonusApplied = false;

      // Handle day resets and streak
      if (!lastActivityDate) {
        streak = 1;
        streakBonusApplied = true;
        dailyPostCount = 0;
        dailyConnectionCount = 0;
      } else if (this.isNextDay(lastActivityDate, today)) {
        streak += 1;
        streakBonusApplied = true;
        dailyPostCount = 0;
        dailyConnectionCount = 0;
      } else if (!this.isSameDay(lastActivityDate, today)) {
        // More than 1 day passed or dates are weird, reset streak
        streak = 1;
        streakBonusApplied = true;
        dailyPostCount = 0;
        dailyConnectionCount = 0;
      }

      if (streakBonusApplied) {
        score += this.POINTS_PER_STREAK_DAY;
      }

      let pointsToAdd = 0;

      if (type === 'POST') {
        postsCount += 1; // Always track total posts
        if (dailyPostCount < this.MAX_DAILY_POSTS) {
          dailyPostCount += 1;
          pointsToAdd += this.POINTS_PER_POST;
        }
      } else if (type === 'CONNECTION') {
        connectionsCount += 1; // Always track total connections
        if (dailyConnectionCount < this.MAX_DAILY_CONNECTIONS) {
          dailyConnectionCount += 1;
          pointsToAdd += this.POINTS_PER_CONNECTION;
        }
      }

      score += pointsToAdd;

      return tx.developerScore.update({
        where: { id: scoreRecord.id },
        data: {
          score,
          streak,
          postsCount,
          connectionsCount,
          dailyPostCount,
          dailyConnectionCount,
          lastActivityDate: today,
        }
      });
    });
  }

  async recordPostActivity(userId: string) {
    return this.processActivity(userId, 'POST');
  }

  async recordConnectionActivity(userId: string) {
    return this.processActivity(userId, 'CONNECTION');
  }

  async getMyScore(userId: string) {
    const profile = await this.prisma.developerProfile.findUnique({
      where: { userId },
      include: { score: true }
    });
    
    if (!profile) throw new NotFoundException('Profile not found');
    
    if (!profile.score) {
      return this.prisma.developerScore.create({
        data: { developerProfileId: profile.id }
      });
    }

    return profile.score;
  }

  async getPublicScore(username: string) {
    const profile = await this.prisma.developerProfile.findUnique({
      where: { username },
      include: { score: true }
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
