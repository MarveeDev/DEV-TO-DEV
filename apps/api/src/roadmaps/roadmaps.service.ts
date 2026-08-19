import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RoadmapsService {
  constructor(private prisma: PrismaService) {}

  async getRoadmaps(query: { category?: string; difficulty?: string; search?: string }) {
    const where: any = {};
    if (query.category) where.category = query.category;
    if (query.difficulty) where.difficulty = query.difficulty;
    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const roadmaps = await this.prisma.roadmap.findMany({
      where,
      orderBy: { title: 'asc' },
      include: {
        _count: {
          select: { nodes: true }
        }
      }
    });

    return roadmaps;
  }

  async getRoadmapBySlug(slug: string) {
    const roadmap = await this.prisma.roadmap.findUnique({
      where: { slug },
      include: {
        nodes: {
          orderBy: { order: 'asc' },
          include: {
            skills: {
              include: { skill: true }
            },
            prerequisites: true
          }
        }
      }
    });

    if (!roadmap) {
      throw new NotFoundException(`Roadmap with slug ${slug} not found`);
    }

    return roadmap;
  }

  async getNodeDetails(id: string) {
    const node = await this.prisma.roadmapNode.findUnique({
      where: { id },
      include: {
        roadmap: true,
        skills: {
          include: { skill: true }
        },
        prerequisites: true
      }
    });

    if (!node) {
      throw new NotFoundException('Roadmap node not found');
    }

    return node;
  }

  async getMyProgress(userId: string) {
    const profile = await this.prisma.developerProfile.findUnique({
      where: { userId }
    });
    
    if (!profile) return [];

    return this.prisma.roadmapProgress.findMany({
      where: { developerProfileId: profile.id },
      include: {
        roadmap: true,
      }
    });
  }

  async startRoadmap(userId: string, slug: string) {
    const profile = await this.prisma.developerProfile.findUnique({
      where: { userId }
    });
    if (!profile) throw new BadRequestException('Developer profile not found');

    const roadmap = await this.prisma.roadmap.findUnique({ where: { slug } });
    if (!roadmap) throw new NotFoundException('Roadmap not found');

    // Starting a roadmap technically just means they are interacting with it.
    // In our schema, we only track progress per node. We can just return success 
    // to acknowledge the start, or maybe track an overall 'started roadmaps' table.
    // Given the schema, we rely on progress records. So if they start, we just return the roadmap info.
    return { success: true, message: 'Roadmap started', roadmapId: roadmap.id };
  }

  async markNodeComplete(userId: string, nodeId: string) {
    const profile = await this.prisma.developerProfile.findUnique({
      where: { userId }
    });
    if (!profile) throw new BadRequestException('Developer profile not found');

    const node = await this.prisma.roadmapNode.findUnique({ 
      where: { id: nodeId },
      include: { prerequisites: true }
    });
    if (!node) throw new NotFoundException('Node not found');

    if (node.prerequisites && node.prerequisites.length > 0) {
      const completedPrereqs = await this.prisma.roadmapProgress.findMany({
        where: {
          developerProfileId: profile.id,
          nodeId: { in: node.prerequisites.map(p => p.prerequisiteId) }
        }
      });
      if (completedPrereqs.length < node.prerequisites.length) {
        throw new BadRequestException('Prerequisites not met');
      }
    }

    const progress = await this.prisma.roadmapProgress.upsert({
      where: {
        developerProfileId_nodeId: {
          developerProfileId: profile.id,
          nodeId: node.id
        }
      },
      update: {
        completedAt: new Date()
      },
      create: {
        developerProfileId: profile.id,
        roadmapId: node.roadmapId,
        nodeId: node.id
      }
    });

    return progress;
  }

  async markNodeIncomplete(userId: string, nodeId: string) {
    const profile = await this.prisma.developerProfile.findUnique({
      where: { userId }
    });
    if (!profile) throw new BadRequestException('Developer profile not found');

    await this.prisma.roadmapProgress.deleteMany({
      where: {
        developerProfileId: profile.id,
        nodeId
      }
    });

    return { success: true };
  }
}
