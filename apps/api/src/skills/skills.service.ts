import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SkillsService {
  constructor(private prisma: PrismaService) {}

  async getSkillBySlug(slug: string) {
    const skill = await this.prisma.skill.findUnique({
      where: { slug },
      include: {
        category: true,
        roadmaps: {
          include: {
            node: {
              include: {
                roadmap: true
              }
            }
          }
        },
        projects: {
          include: {
            project: {
              include: {
                owner: true
              }
            }
          }
        },
        questions: {
          include: {
            question: {
              include: {
                author: true,
                _count: {
                  select: { answers: true, votes: true }
                }
              }
            }
          }
        },
        posts: {
          include: {
            post: {
              include: {
                author: true
              }
            }
          }
        }
      }
    });

    if (!skill) {
      throw new NotFoundException(`Skill with slug ${slug} not found`);
    }

    return skill;
  }
}
