import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class ProfileService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redisService: RedisService,
  ) {}

  async createProfile(userId: string, data: any) {
    // Basic validation
    if (!data.username || !data.displayName) {
      throw new BadRequestException('Username and display name are required');
    }

    const { username, displayName, bio, experienceLevel, skills, goals } = data;

    const oauthProfile = await this.consumeOAuthProfile(userId);

    // Check username uniqueness
    const existing = await this.prisma.developerProfile.findUnique({ where: { username } });
    if (existing && existing.userId !== userId) {
      throw new BadRequestException('Username is already taken');
    }

    const oauthFields = oauthProfile
      ? {
          avatarUrl: oauthProfile.avatarUrl ?? undefined,
          location: oauthProfile.location ?? undefined,
          websiteUrl: oauthProfile.websiteUrl ?? undefined,
        }
      : {};

    // Upsert Profile
    const profile = await this.prisma.developerProfile.upsert({
      where: { userId },
      update: {
        username,
        displayName,
        bio,
        experienceLevel,
        ...oauthFields,
      },
      create: {
        userId,
        username,
        displayName,
        bio,
        experienceLevel,
        ...oauthFields,
      },
    });

    // Handle skills if provided
    if (skills && Array.isArray(skills)) {
      // Clear existing
      await this.prisma.developerSkill.deleteMany({
        where: { developerProfileId: profile.id },
      });

      const validSkills = await this.prisma.skill.findMany({
        where: { id: { in: skills } },
      });

      if (validSkills.length > 0) {
        await this.prisma.developerSkill.createMany({
          data: validSkills.map(s => ({
            developerProfileId: profile.id,
            skillId: s.id,
          })),
        });
      }
    }

    // Handle goals if provided
    if (goals && Array.isArray(goals)) {
      // Clear existing
      await this.prisma.developerLearningGoal.deleteMany({
        where: { developerProfileId: profile.id },
      });

      const validGoals = await this.prisma.learningGoal.findMany({
        where: { id: { in: goals } },
      });

      if (validGoals.length > 0) {
        await this.prisma.developerLearningGoal.createMany({
          data: validGoals.map(g => ({
            developerProfileId: profile.id,
            learningGoalId: g.id,
          })),
        });
      }
    }

    return this.prisma.developerProfile.findUnique({
      where: { id: profile.id },
      include: { skills: { include: { skill: true } }, learningGoals: { include: { learningGoal: true } } },
    });
  }

  private async consumeOAuthProfile(userId: string) {
    const redis = this.redisService.getClient();
    const key = `oauth:profile:${userId}`;
    const raw = await redis.get(key);
    if (!raw) return null;
    await redis.del(key);
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  async getAllSkills() {
    return this.prisma.skillCategory.findMany({
      include: {
        skills: {
          orderBy: { name: 'asc' },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  async getAllGoals() {
    return this.prisma.learningGoal.findMany({ orderBy: { name: 'asc' } });
  }

  async getProfile(userId: string) {
    const profile = await this.prisma.developerProfile.findUnique({
      where: { userId },
    });
    if (!profile) throw new BadRequestException('Profile not found');
    return profile;
  }

  async updateProfile(userId: string, data: any) {
    const profile = await this.prisma.developerProfile.findUnique({
      where: { userId },
    });
    
    if (!profile) {
      throw new BadRequestException('Profile not found');
    }

    return this.prisma.developerProfile.update({
      where: { userId },
      data: {
        displayName: data.displayName,
        bio: data.bio,
        location: data.location,
        websiteUrl: data.websiteUrl,
        githubUrl: data.githubUrl,
        experienceLevel: data.experienceLevel,
      },
    });
  }
}
