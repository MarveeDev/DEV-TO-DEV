import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ScoreEventType } from '@prisma/client';

@Injectable()
export class ScoreService {
  constructor(private prisma: PrismaService) {}

  // Award points for a genuine, deduplicated event. Each (profile, type,
  // referenceId) is awarded exactly once; duplicates are ignored. The event
  // write and the score increment happen in a single transaction so a partial
  // failure never leaves an inconsistent score.
  async award(userId: string, type: ScoreEventType, points: number, referenceId: string) {
    try {
      const profile = await this.prisma.developerProfile.findUnique({
        where: { userId },
        select: { id: true },
      });
      if (!profile) return;

      const posts = type === 'POST_CREATED' ? 1 : 0;
      const connections = type === 'CONNECTION_ACCEPTED' ? 1 : 0;
      const projects = type === 'PROJECT_CREATED' ? 1 : 0;

      await this.prisma.$transaction([
        this.prisma.developerScoreEvent.create({
          data: { developerProfileId: profile.id, type, points, referenceId },
        }),
        this.prisma.developerScore.upsert({
          where: { developerProfileId: profile.id },
          update: {
            score: { increment: points },
            postsCount: { increment: posts },
            connectionsCount: { increment: connections },
            projectsCount: { increment: projects },
          },
          create: {
            developerProfileId: profile.id,
            score: points,
            postsCount: posts,
            connectionsCount: connections,
            projectsCount: projects,
          },
        }),
      ]);
    } catch {
      // Duplicate event (unique constraint) or transient DB failure. Never let
      // score tracking break the primary user flow.
    }
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
