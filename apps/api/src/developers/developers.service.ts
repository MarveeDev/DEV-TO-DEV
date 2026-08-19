import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MatchingService } from './matching.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class DevelopersService {
  constructor(
    private prisma: PrismaService,
    private matchingService: MatchingService,
  ) {}

  async searchDevelopers(
    currentUserId: string,
    query: {
      username?: string;
      name?: string;
      skills?: string;
      goals?: string;
      experienceLevel?: string;
      page?: number;
      limit?: number;
    }
  ) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 20;
    const skip = (page - 1) * limit;

    const where: Prisma.DeveloperProfileWhereInput = {
      user: {
        id: { not: currentUserId }, // Exclude self
      },
    };

    if (query.username) {
      where.username = { contains: query.username, mode: 'insensitive' };
    }
    if (query.name) {
      where.displayName = { contains: query.name, mode: 'insensitive' };
    }
    if (query.experienceLevel) {
      where.experienceLevel = query.experienceLevel;
    }
    if (query.skills) {
      const skillsArr = query.skills.split(',').filter(Boolean);
      if (skillsArr.length > 0) {
        where.skills = { some: { skill: { id: { in: skillsArr } } } };
      }
    }
    if (query.goals) {
      const goalsArr = query.goals.split(',').filter(Boolean);
      if (goalsArr.length > 0) {
        where.learningGoals = { some: { learningGoal: { id: { in: goalsArr } } } };
      }
    }

    const [total, developers] = await Promise.all([
      this.prisma.developerProfile.count({ where }),
      this.prisma.developerProfile.findMany({
        where,
        skip,
        take: limit,
        include: {
          skills: { include: { skill: true } },
          learningGoals: { include: { learningGoal: true } },
          score: true,
          user: {
            include: {
              receivedConnections: { where: { requesterId: currentUserId } },
              sentConnections: { where: { addresseeId: currentUserId } },
            },
          },
        },
      }),
    ]);

    const currentUserProfile = await this.prisma.developerProfile.findUnique({
      where: { userId: currentUserId },
      include: {
        skills: { include: { skill: true } },
        learningGoals: { include: { learningGoal: true } },
      },
    });

    const enriched = developers.map((dev) => {
      let matchData = {
        sharedSkills: 0,
        sharedLearningGoals: 0,
        experienceCompatibility: 'Neutral',
        compatibilityScore: 0,
        complementarySkills: [] as string[],
      };

      if (currentUserProfile) {
        const compatibility = this.matchingService.calculateCompatibility(currentUserProfile, dev);
        matchData = {
          sharedSkills: compatibility.sharedSkills.length,
          sharedLearningGoals: compatibility.sharedLearningGoals.length,
          experienceCompatibility: compatibility.experienceCompatibility ? 'High' : 'Low',
          compatibilityScore: compatibility.score,
          complementarySkills: compatibility.complementarySkills,
        };
      }

      return {
        id: dev.userId,
        displayName: dev.displayName,
        username: dev.username,
        bio: dev.bio,
        experienceLevel: dev.experienceLevel,
        skills: dev.skills.map((s) => s.skill),
        learningGoals: dev.learningGoals.map((g) => g.learningGoal),
        publicConnectionStatus: this.determineConnectionStatus(dev.user),
        matchData,
      };
    });

    return {
      data: enriched,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getDeveloperByUsername(currentUserId: string, username: string) {
    const dev = await this.prisma.developerProfile.findUnique({
      where: { username },
      include: {
        skills: { include: { skill: true } },
        learningGoals: { include: { learningGoal: true } },
        score: true,
        user: {
          include: {
            receivedConnections: { where: { requesterId: currentUserId } },
            sentConnections: { where: { addresseeId: currentUserId } },
          },
        },
      },
    });

    if (!dev) throw new NotFoundException('Developer not found');

    return {
      id: dev.userId,
      displayName: dev.displayName,
      username: dev.username,
      bio: dev.bio,
      experienceLevel: dev.experienceLevel,
      skills: dev.skills.map((s) => s.skill),
      learningGoals: dev.learningGoals.map((g) => g.learningGoal),
      publicConnectionStatus: this.determineConnectionStatus(dev.user),
      score: dev.score,
    };
  }

  private determineConnectionStatus(user: any) {
    const sentToThem = user.receivedConnections?.[0]; // Current user sent to this dev
    const receivedFromThem = user.sentConnections?.[0]; // Current user received from this dev

    if (sentToThem) {
      return sentToThem.status;
    }
    if (receivedFromThem) {
      if (receivedFromThem.status === 'PENDING') return 'INCOMING_REQUEST';
      return receivedFromThem.status;
    }
    return 'NONE';
  }
}
