import { Injectable, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  private generateSlug(title: string): string {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Math.random().toString(36).substring(2, 6);
  }

  async getProjects(params: { page: number; limit: number; search?: string; status?: string }) {
    const { page, limit, search, status } = params;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (search) {
      where.title = { contains: search, mode: 'insensitive' };
    }
    if (status) {
      where.status = status;
    }

    const [items, total] = await Promise.all([
      this.prisma.project.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          owner: {
            select: { id: true, displayName: true, username: true, avatarUrl: true }
          },
          skills: {
            include: { skill: true }
          },
          _count: {
            select: { contributors: true }
          }
        }
      }),
      this.prisma.project.count({ where })
    ]);

    return {
      items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      }
    };
  }

  async getProjectBySlug(slug: string) {
    const project = await this.prisma.project.findUnique({
      where: { slug },
      include: {
        owner: {
          select: { id: true, userId: true, displayName: true, username: true, avatarUrl: true, bio: true }
        },
        skills: {
          include: { skill: true }
        },
        contributors: {
          include: {
            developerProfile: {
              select: { id: true, displayName: true, username: true, avatarUrl: true }
            }
          }
        }
      }
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return project;
  }

  async createProject(userId: string, data: any) {
    const profile = await this.prisma.developerProfile.findUnique({
      where: { userId }
    });

    if (!profile) {
      throw new NotFoundException('Developer profile not found');
    }

    const slug = this.generateSlug(data.title);

    // Create the project along with its skills if provided
    const project = await this.prisma.project.create({
      data: {
        title: data.title,
        slug,
        description: data.description,
        status: data.status || 'ACTIVE',
        githubUrl: data.githubUrl,
        demoUrl: data.demoUrl,
        ownerId: profile.id,
        skills: data.skills?.length > 0 ? {
          create: data.skills.map((skillId: string) => ({
            skill: { connect: { id: skillId } }
          }))
        } : undefined,
      },
      include: {
        owner: true,
        skills: { include: { skill: true } }
      }
    });

    return project;
  }

  async updateProject(userId: string, projectId: string, data: any) {
    const profile = await this.prisma.developerProfile.findUnique({
      where: { userId }
    });

    if (!profile) throw new NotFoundException('Profile not found');

    const project = await this.prisma.project.findUnique({
      where: { id: projectId }
    });

    if (!project) throw new NotFoundException('Project not found');
    if (project.ownerId !== profile.id) throw new ForbiddenException('You are not the owner of this project');

    // Update basic fields
    const updatedProject = await this.prisma.project.update({
      where: { id: projectId },
      data: {
        title: data.title,
        description: data.description,
        status: data.status,
        githubUrl: data.githubUrl,
        demoUrl: data.demoUrl,
      },
      include: {
        owner: true,
        skills: { include: { skill: true } },
        contributors: true
      }
    });

    return updatedProject;
  }

  async deleteProject(userId: string, projectId: string) {
    const profile = await this.prisma.developerProfile.findUnique({
      where: { userId }
    });

    if (!profile) throw new NotFoundException('Profile not found');

    const project = await this.prisma.project.findUnique({
      where: { id: projectId }
    });

    if (!project) throw new NotFoundException('Project not found');
    if (project.ownerId !== profile.id) throw new ForbiddenException('You are not the owner of this project');

    await this.prisma.project.delete({
      where: { id: projectId }
    });

    return { success: true };
  }

  // --- Collaboration Requests ---

  async joinProject(userId: string, projectId: string) {
    const profile = await this.prisma.developerProfile.findUnique({
      where: { userId }
    });
    if (!profile) throw new NotFoundException('Developer profile not found');

    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      include: { contributors: true }
    });
    if (!project) throw new NotFoundException('Project not found');

    // Cannot join if already owner
    if (project.ownerId === profile.id) {
      throw new ConflictException('You already own this project');
    }

    // Cannot join if already a contributor
    const isContributor = project.contributors.some(c => c.developerProfileId === profile.id);
    if (isContributor) {
      throw new ConflictException('You are already a contributor to this project');
    }

    // Check if a request already exists
    const existingReq = await this.prisma.projectJoinRequest.findUnique({
      where: { projectId_developerProfileId: { projectId, developerProfileId: profile.id } }
    });

    if (existingReq) {
      if (existingReq.status === 'PENDING') throw new ConflictException('You already have a pending request');
      if (existingReq.status === 'ACCEPTED') throw new ConflictException('You are already a contributor');
      // If rejected, we might allow re-applying or not. For now, allow replacing it or just reject.
      // Let's just update to PENDING.
      return this.prisma.projectJoinRequest.update({
        where: { id: existingReq.id },
        data: { status: 'PENDING' }
      });
    }

    return this.prisma.projectJoinRequest.create({
      data: {
        projectId,
        developerProfileId: profile.id,
        status: 'PENDING'
      }
    });
  }

  async getProjectRequests(userId: string, projectId: string) {
    const profile = await this.prisma.developerProfile.findUnique({
      where: { userId }
    });
    if (!profile) throw new NotFoundException('Developer profile not found');

    const project = await this.prisma.project.findUnique({
      where: { id: projectId }
    });
    if (!project) throw new NotFoundException('Project not found');

    if (project.ownerId !== profile.id) {
      throw new ForbiddenException('Only the owner can view requests');
    }

    return this.prisma.projectJoinRequest.findMany({
      where: { projectId, status: 'PENDING' },
      include: {
        developerProfile: {
          select: { id: true, displayName: true, username: true, avatarUrl: true, bio: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async updateProjectRequest(userId: string, projectId: string, requestId: string, status: 'ACCEPTED' | 'REJECTED') {
    const profile = await this.prisma.developerProfile.findUnique({
      where: { userId }
    });
    if (!profile) throw new NotFoundException('Developer profile not found');

    const project = await this.prisma.project.findUnique({
      where: { id: projectId }
    });
    if (!project) throw new NotFoundException('Project not found');

    if (project.ownerId !== profile.id) {
      throw new ForbiddenException('Only the owner can update requests');
    }

    const request = await this.prisma.projectJoinRequest.findUnique({
      where: { id: requestId }
    });

    if (!request || request.projectId !== projectId) {
      throw new NotFoundException('Request not found');
    }

    if (request.status !== 'PENDING') {
      throw new ConflictException('Request is no longer pending');
    }

    const updatedRequest = await this.prisma.projectJoinRequest.update({
      where: { id: requestId },
      data: { status }
    });

    if (status === 'ACCEPTED') {
      await this.prisma.projectContributor.upsert({
        where: {
          projectId_developerProfileId: {
            projectId,
            developerProfileId: request.developerProfileId
          }
        },
        create: {
          projectId,
          developerProfileId: request.developerProfileId
        },
        update: {}
      });
    }

    return updatedRequest;
  }
}
