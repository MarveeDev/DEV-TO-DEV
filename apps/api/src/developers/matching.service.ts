import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

export interface DeveloperProfileData {
  id: string;
  userId: string;
  experienceLevel: string | null;
  skills: { skill: { id: string; name: string } }[];
  learningGoals: { learningGoal: { id: string; name: string } }[];
}

@Injectable()
export class MatchingService {
  constructor(private prisma: PrismaService) {}

  public calculateSharedSkills(
    mySkills: string[],
    theirSkills: string[]
  ): string[] {
    return theirSkills.filter((s) => mySkills.includes(s));
  }

  public calculateSharedGoals(
    myGoals: string[],
    theirGoals: string[]
  ): string[] {
    return theirGoals.filter((g) => myGoals.includes(g));
  }

  public calculateExperienceCompatibility(
    myLevel: string | null,
    theirLevel: string | null
  ): { label: string; score: number } {
    const levels = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'];
    const myLevelIdx = levels.indexOf(myLevel || '');
    const theirLevelIdx = levels.indexOf(theirLevel || '');

    if (myLevelIdx !== -1 && theirLevelIdx !== -1) {
      const diff = Math.abs(myLevelIdx - theirLevelIdx);
      if (diff === 0) {
        return { label: 'High', score: 20 };
      } else if (diff === 1) {
        return { label: 'Medium', score: 10 };
      } else {
        return { label: 'Low', score: 0 };
      }
    }
    return { label: 'Neutral', score: 0 };
  }

  public calculateComplementarySkills(
    mySkills: string[],
    myGoals: string[],
    theirSkills: string[],
    theirGoals: string[]
  ): string[] {
    const complementary = new Set<string>();

    // Things I want to learn that they know
    const iCanLearn = theirSkills.filter((s) => myGoals.includes(s));
    iCanLearn.forEach((s) => complementary.add(s));

    // Things they want to learn that I know
    const theyCanLearn = mySkills.filter((s) => theirGoals.includes(s));
    theyCanLearn.forEach((s) => complementary.add(s));

    return Array.from(complementary);
  }

  public calculateCompatibility(
    currentUser: DeveloperProfileData,
    targetUser: DeveloperProfileData
  ) {
    const mySkillNames = currentUser.skills.map((s) => s.skill.name);
    const myGoalNames = currentUser.learningGoals.map((g) => g.learningGoal.name);

    const theirSkillNames = targetUser.skills.map((s) => s.skill.name);
    const theirGoalNames = targetUser.learningGoals.map((g) => g.learningGoal.name);

    const sharedSkills = this.calculateSharedSkills(mySkillNames, theirSkillNames);
    const sharedGoals = this.calculateSharedGoals(myGoalNames, theirGoalNames);
    const complementarySkills = this.calculateComplementarySkills(
      mySkillNames,
      myGoalNames,
      theirSkillNames,
      theirGoalNames
    );

    const exp = this.calculateExperienceCompatibility(
      currentUser.experienceLevel,
      targetUser.experienceLevel
    );

    let score = exp.score;
    score += sharedSkills.length * 10;
    score += sharedGoals.length * 15;
    score += complementarySkills.length * 15;

    // Cap at 100
    if (score > 100) score = 100;

    return {
      score,
      sharedSkills,
      sharedLearningGoals: sharedGoals,
      experienceCompatibility: exp.label !== 'Low' && exp.label !== 'Neutral',
      complementarySkills,
    };
  }

  async getMatches(currentUserId: string, query: { page?: number; limit?: number }) {
    const page = query.page || 1;
    const limit = query.limit || 20;

    const currentUserProfile = await this.prisma.developerProfile.findUnique({
      where: { userId: currentUserId },
      include: {
        skills: { include: { skill: true } },
        learningGoals: { include: { learningGoal: true } },
      },
    });

    if (!currentUserProfile) {
      return { data: [], meta: { total: 0, page, limit, totalPages: 0 } };
    }

    // Exclude users we are already connected with or have pending requests
    const existingConnections = await this.prisma.connection.findMany({
      where: {
        OR: [
          { requesterId: currentUserId },
          { addresseeId: currentUserId },
        ],
        status: { in: ['PENDING', 'ACCEPTED'] },
      },
      select: { requesterId: true, addresseeId: true },
    });

    const excludedIds = new Set<string>();
    excludedIds.add(currentUserId);
    existingConnections.forEach(c => {
      excludedIds.add(c.requesterId);
      excludedIds.add(c.addresseeId);
    });

    const where: Prisma.DeveloperProfileWhereInput = {
      user: {
        id: { notIn: Array.from(excludedIds) },
      },
    };

    const candidates = await this.prisma.developerProfile.findMany({
      where,
      include: {
        skills: { include: { skill: true } },
        learningGoals: { include: { learningGoal: true } },
      },
    });

    const enriched = candidates.map(dev => {
      const compatibility = this.calculateCompatibility(currentUserProfile, dev);
      return {
        developer: {
          id: dev.userId,
          username: dev.username,
          displayName: dev.displayName,
          bio: dev.bio,
          experienceLevel: dev.experienceLevel,
        },
        compatibility,
        connectionStatus: 'NONE', // By definition, since we excluded connected/pending
      };
    });

    // Sort by compatibility score
    enriched.sort((a, b) => b.compatibility.score - a.compatibility.score);

    // Filter out 0 matches, or maybe just return all but sorted
    const relevantMatches = enriched.filter(e => e.compatibility.score > 0);

    const total = relevantMatches.length;
    const skip = (page - 1) * limit;
    const paginated = relevantMatches.slice(skip, skip + limit);

    return {
      data: paginated,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
