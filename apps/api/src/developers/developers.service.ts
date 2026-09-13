import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class DevelopersService {
  constructor(private prisma: PrismaService) {}

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

    const searchConditions: Prisma.DeveloperProfileWhereInput[] = [];

    if (query.username) {
      searchConditions.push({ username: { contains: query.username, mode: 'insensitive' } });
    }
    if (query.name) {
      searchConditions.push({ displayName: { contains: query.name, mode: 'insensitive' } });
    }

    const where: Prisma.DeveloperProfileWhereInput = {
      user: {
        id: { not: currentUserId }, // Exclude self
      },
      ...(searchConditions.length > 0 ? { OR: searchConditions } : {}),
    };

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
        select: {
          userId: true,
          displayName: true,
          username: true,
          bio: true,
          avatarUrl: true,
          experienceLevel: true,
        },
      }),
    ]);

    const statuses = await this.fetchConnectionStatuses(
      currentUserId,
      developers.map((d) => d.userId),
    );

    return {
      data: developers.map((dev) => ({
        id: dev.userId,
        displayName: dev.displayName,
        username: dev.username,
        bio: dev.bio,
        avatarUrl: dev.avatarUrl,
        experienceLevel: dev.experienceLevel,
        publicConnectionStatus: statuses.get(dev.userId) ?? 'NONE',
      })),
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
      select: {
        userId: true,
        displayName: true,
        username: true,
        bio: true,
        avatarUrl: true,
        experienceLevel: true,
        skills: { include: { skill: true } },
        learningGoals: { include: { learningGoal: true } },
      },
    });

    if (!dev) throw new NotFoundException('Developer not found');

    const statuses = await this.fetchConnectionStatuses(currentUserId, [dev.userId]);

    return {
      id: dev.userId,
      displayName: dev.displayName,
      username: dev.username,
      bio: dev.bio,
      avatarUrl: dev.avatarUrl,
      experienceLevel: dev.experienceLevel,
      skills: dev.skills.map((s) => s.skill),
      learningGoals: dev.learningGoals.map((g) => g.learningGoal),
      publicConnectionStatus: statuses.get(dev.userId) ?? 'NONE',
    };
  }

  async getPublicDevelopers(options: { page?: number; limit?: number } = {}) {
    const page = Number(options.page) || 1;
    const limit = Number(options.limit) || 100;
    const skip = (page - 1) * limit;

    const [total, developers] = await Promise.all([
      this.prisma.developerProfile.count(),
      this.prisma.developerProfile.findMany({
        skip,
        take: limit,
        orderBy: { displayName: 'asc' },
        select: {
          username: true,
          displayName: true,
          bio: true,
          avatarUrl: true,
          experienceLevel: true,
          updatedAt: true,
        },
      }),
    ]);

    return {
      items: developers,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getPublicDeveloperByUsername(username: string) {
    const dev = await this.prisma.developerProfile.findUnique({
      where: { username },
      select: {
        displayName: true,
        username: true,
        bio: true,
        avatarUrl: true,
        location: true,
        websiteUrl: true,
        githubUrl: true,
        experienceLevel: true,
        skills: { include: { skill: true } },
        learningGoals: { include: { learningGoal: true } },
      },
    });

    if (!dev) throw new NotFoundException('Developer not found');

    return {
      displayName: dev.displayName,
      username: dev.username,
      bio: dev.bio,
      avatarUrl: dev.avatarUrl,
      location: dev.location,
      websiteUrl: dev.websiteUrl,
      githubUrl: dev.githubUrl,
      experienceLevel: dev.experienceLevel,
      skills: dev.skills.map((s) => s.skill),
      learningGoals: dev.learningGoals.map((g) => g.learningGoal),
    };
  }

  /**
   * Lightweight connection-status lookup for a set of developers.
   *
   * Replaces the previous approach of `include`-ing the `user` relation (with
   * filtered `receivedConnections`/`sentConnections`) per developer. Instead, a
   * single query selects only `requesterId`/`addresseeId`/`status` and derives
   * each developer's public connection status in memory.
   */
  private async fetchConnectionStatuses(
    currentUserId: string,
    developerUserIds: string[],
  ): Promise<Map<string, string>> {
    const statuses = new Map<string, string>();
    if (developerUserIds.length === 0) return statuses;

    const connections = await this.prisma.connection.findMany({
      where: {
        OR: [
          { requesterId: currentUserId, addresseeId: { in: developerUserIds } },
          { addresseeId: currentUserId, requesterId: { in: developerUserIds } },
        ],
      },
      select: { requesterId: true, addresseeId: true, status: true },
    });

    // Prefer "current user sent to them" (requester), matching the original
    // determineConnectionStatus precedence.
    for (const conn of connections) {
      if (conn.requesterId === currentUserId) {
        statuses.set(conn.addresseeId, conn.status);
      }
    }
    for (const conn of connections) {
      if (conn.addresseeId === currentUserId) {
        const other = conn.requesterId;
        if (!statuses.has(other)) {
          statuses.set(other, conn.status === 'PENDING' ? 'INCOMING_REQUEST' : conn.status);
        }
      }
    }

    return statuses;
  }
}
