import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CloudinaryService } from '../media/cloudinary.service';
import { MediaType } from '@prisma/client';

@Injectable()
export class QuestionsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinaryService: CloudinaryService
  ) {}

  async getQuestions(params: { page: number; limit: number; search?: string; status?: string; skill?: string; filter?: string; sort?: string }) {
    const { page, limit, search, status, skill, filter, sort } = params;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (search) {
      where.title = { contains: search, mode: 'insensitive' };
    }
    if (status) {
      where.status = status;
    }
    if (skill) {
      where.skills = { some: { skill: { name: { equals: skill, mode: 'insensitive' } } } };
    }
    if (filter === 'unanswered') {
      where.answers = { none: {} };
    } else if (filter === 'answered') {
      where.answers = { some: {} };
    }

    let orderBy: any = { createdAt: 'desc' };
    if (sort === 'active') {
      orderBy = { answers: { _count: 'desc' } };
    }

    const [items, total] = await Promise.all([
      this.prisma.question.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          author: {
            select: { id: true, displayName: true, username: true, avatarUrl: true }
          },
          skills: {
            include: { skill: true }
          },
          _count: {
            select: { answers: true, votes: true }
          },
          attachments: true
        }
      }),
      this.prisma.question.count({ where })
    ]);

    // calculate total vote score for each
    const questionsWithVotes = await Promise.all(items.map(async (q) => {
      const votes = await this.prisma.questionVote.aggregate({
        where: { questionId: q.id },
        _sum: { value: true }
      });
      return {
        ...q,
        voteScore: votes._sum.value || 0
      };
    }));

    // If sorting by popular (highest vote score), we sort in memory for now due to Prisma limitations on computed fields
    if (sort === 'popular') {
      questionsWithVotes.sort((a, b) => b.voteScore - a.voteScore);
    }

    return {
      items: questionsWithVotes,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      }
    };
  }

  async getQuestionById(id: string) {
    const question = await this.prisma.question.findUnique({
      where: { id },
      include: {
        author: {
          select: { id: true, displayName: true, username: true, avatarUrl: true, experienceLevel: true }
        },
        skills: {
          include: { skill: true }
        },
        answers: {
          include: {
            author: { select: { id: true, displayName: true, username: true, avatarUrl: true } }
          },
          orderBy: { createdAt: 'asc' }
        },
        _count: {
          select: { answers: true }
        },
        attachments: true
      }
    });

    if (!question) throw new NotFoundException('Question not found');

    const questionScore = await this.prisma.questionVote.aggregate({
      where: { questionId: id },
      _sum: { value: true }
    });

    const answersWithScores = await Promise.all(question.answers.map(async (a) => {
      const aScore = await this.prisma.answerVote.aggregate({
        where: { answerId: a.id },
        _sum: { value: true }
      });
      return { ...a, voteScore: aScore._sum.value || 0 };
    }));

    return {
      ...question,
      voteScore: questionScore._sum.value || 0,
      answers: answersWithScores
    };
  }

  async createQuestion(userId: string, data: any) {
    const profile = await this.prisma.developerProfile.findUnique({ where: { userId } });
    if (!profile) throw new NotFoundException('Developer profile not found');

    const question = await this.prisma.question.create({
      data: {
        title: data.title,
        description: data.description,
        authorId: profile.id,
        skills: data.skills?.length > 0 ? {
          create: data.skills.map((skillId: string) => ({
            skill: { connect: { id: skillId } }
          }))
        } : undefined,
      },
      include: {
        skills: { include: { skill: true } },
        attachments: true
      }
    });

    if (data.mediaIds && Array.isArray(data.mediaIds) && data.mediaIds.length > 0) {
      const attachments = await this.prisma.mediaAttachment.findMany({
        where: { id: { in: data.mediaIds } }
      });
      for (const attachment of attachments) {
        if (attachment.uploaderId === userId && !attachment.questionId) {
          await this.prisma.mediaAttachment.update({
            where: { id: attachment.id },
            data: { questionId: question.id }
          });
        }
      }
      // Re-fetch question with attachments to return
      return this.prisma.question.findUnique({
        where: { id: question.id },
        include: {
          author: true,
          skills: { include: { skill: true } },
          attachments: true
        }
      });
    }

    return question;
  }

  async updateQuestion(userId: string, id: string, data: any) {
    const profile = await this.prisma.developerProfile.findUnique({ where: { userId } });
    if (!profile) throw new NotFoundException('Profile not found');

    const question = await this.prisma.question.findUnique({ where: { id } });
    if (!question) throw new NotFoundException('Question not found');
    if (question.authorId !== profile.id) throw new ForbiddenException('You are not the owner of this question');

    // Handle skills update if provided (simple version: delete old and recreate)
    if (data.skills) {
      await this.prisma.questionSkill.deleteMany({ where: { questionId: id } });
    }

    return this.prisma.question.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        status: data.status,
        skills: data.skills?.length > 0 ? {
          create: data.skills.map((skillId: string) => ({
            skill: { connect: { id: skillId } }
          }))
        } : undefined,
      },
      include: { author: true, skills: { include: { skill: true } }, attachments: true }
    });
  }

  async deleteQuestion(userId: string, id: string) {
    const profile = await this.prisma.developerProfile.findUnique({ where: { userId } });
    if (!profile) throw new NotFoundException('Profile not found');

    const question = await this.prisma.question.findUnique({ 
      where: { id },
      include: { attachments: true } 
    });
    if (!question) throw new NotFoundException('Question not found');
    if (question.authorId !== profile.id) throw new ForbiddenException('You are not the owner');

    for (const attachment of question.attachments) {
      try {
        await this.cloudinaryService.deleteFile(
          attachment.publicId, 
          attachment.type === MediaType.VIDEO ? 'video' : 'image'
        );
      } catch (e) {
        console.error('Failed to delete Cloudinary asset', e);
      }
    }

    await this.prisma.question.delete({ where: { id } });
    return { success: true };
  }

  async voteQuestion(userId: string, id: string, value: number) {
    const profile = await this.prisma.developerProfile.findUnique({ where: { userId } });
    if (!profile) throw new NotFoundException('Profile not found');

    const existingVote = await this.prisma.questionVote.findUnique({
      where: { questionId_developerProfileId: { questionId: id, developerProfileId: profile.id } }
    });

    if (existingVote) {
      if (existingVote.value === value) {
        // Toggle off
        await this.prisma.questionVote.delete({ where: { id: existingVote.id } });
      } else {
        // Change vote
        await this.prisma.questionVote.update({
          where: { id: existingVote.id },
          data: { value }
        });
      }
    } else {
      await this.prisma.questionVote.create({
        data: { questionId: id, developerProfileId: profile.id, value }
      });
    }

    const newScore = await this.prisma.questionVote.aggregate({
      where: { questionId: id },
      _sum: { value: true }
    });

    const userVote = await this.prisma.questionVote.findUnique({
      where: { questionId_developerProfileId: { questionId: id, developerProfileId: profile.id } }
    });

    return { voteScore: newScore._sum.value || 0, userVote: userVote?.value || 0 };
  }

  async createAnswer(userId: string, questionId: string, content: string) {
    const profile = await this.prisma.developerProfile.findUnique({ where: { userId } });
    if (!profile) throw new NotFoundException('Profile not found');

    return this.prisma.answer.create({
      data: {
        content,
        questionId,
        authorId: profile.id
      },
      include: { author: true }
    });
  }

  async updateAnswer(userId: string, id: string, content: string) {
    const profile = await this.prisma.developerProfile.findUnique({ where: { userId } });
    if (!profile) throw new NotFoundException('Profile not found');

    const answer = await this.prisma.answer.findUnique({ where: { id } });
    if (!answer) throw new NotFoundException('Answer not found');
    if (answer.authorId !== profile.id) throw new ForbiddenException('You are not the author');

    return this.prisma.answer.update({
      where: { id },
      data: { content },
      include: { author: true }
    });
  }

  async deleteAnswer(userId: string, id: string) {
    const profile = await this.prisma.developerProfile.findUnique({ where: { userId } });
    if (!profile) throw new NotFoundException('Profile not found');

    const answer = await this.prisma.answer.findUnique({ where: { id } });
    if (!answer) throw new NotFoundException('Answer not found');
    if (answer.authorId !== profile.id) throw new ForbiddenException('You are not the author');

    await this.prisma.answer.delete({ where: { id } });
    return { success: true };
  }

  async voteAnswer(userId: string, id: string, value: number) {
    const profile = await this.prisma.developerProfile.findUnique({ where: { userId } });
    if (!profile) throw new NotFoundException('Profile not found');

    const existingVote = await this.prisma.answerVote.findUnique({
      where: { answerId_developerProfileId: { answerId: id, developerProfileId: profile.id } }
    });

    if (existingVote) {
      if (existingVote.value === value) {
        await this.prisma.answerVote.delete({ where: { id: existingVote.id } });
      } else {
        await this.prisma.answerVote.update({
          where: { id: existingVote.id },
          data: { value }
        });
      }
    } else {
      await this.prisma.answerVote.create({
        data: { answerId: id, developerProfileId: profile.id, value }
      });
    }

    const newScore = await this.prisma.answerVote.aggregate({
      where: { answerId: id },
      _sum: { value: true }
    });

    const userVote = await this.prisma.answerVote.findUnique({
      where: { answerId_developerProfileId: { answerId: id, developerProfileId: profile.id } }
    });

    return { voteScore: newScore._sum.value || 0, userVote: userVote?.value || 0 };
  }

  async acceptAnswer(userId: string, questionId: string, answerId: string) {
    const profile = await this.prisma.developerProfile.findUnique({ where: { userId } });
    if (!profile) throw new NotFoundException('Profile not found');

    const question = await this.prisma.question.findUnique({ where: { id: questionId } });
    if (!question) throw new NotFoundException('Question not found');
    if (question.authorId !== profile.id) throw new ForbiddenException('Only the question owner can accept an answer');

    const answer = await this.prisma.answer.findUnique({ where: { id: answerId } });
    if (!answer || answer.questionId !== questionId) {
      throw new BadRequestException('Invalid answer for this question');
    }

    return this.prisma.question.update({
      where: { id: questionId },
      data: { acceptedAnswerId: answerId },
      include: { acceptedAnswer: true }
    });
  }

  async resolveQuestion(userId: string, id: string) {
    const profile = await this.prisma.developerProfile.findUnique({ where: { userId } });
    if (!profile) throw new NotFoundException('Profile not found');

    const question = await this.prisma.question.findUnique({ where: { id } });
    if (!question) throw new NotFoundException('Question not found');
    if (question.authorId !== profile.id) throw new ForbiddenException('Only the question owner can resolve it');

    return this.prisma.question.update({
      where: { id },
      data: {
        resolvedAt: new Date(),
        resolvedById: profile.id
      }
    });
  }
}
