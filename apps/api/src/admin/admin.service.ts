import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, UserRole, MarketplaceListingReportStatus, ViolationStatus } from '@prisma/client';
import { CreateViolationDto } from './dto/create-violation.dto';

const DEFAULT_LIMIT = 20;

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  private async audit(
    actorId: string,
    action: string,
    entityType: string,
    entityId?: string,
    metadata?: Record<string, unknown>,
  ): Promise<void> {
    await this.prisma.adminAuditLog.create({
      data: {
        actorId,
        action,
        entityType,
        entityId: entityId ?? null,
        metadata: metadata ? (metadata as Prisma.InputJsonValue) : undefined,
      },
    });
  }

  private paginate(query: { page?: string; limit?: string }) {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(query.limit) || DEFAULT_LIMIT));
    return { page, limit, skip: (page - 1) * limit };
  }

  private meta(total: number, page: number, limit: number) {
    return { total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  // ---- Overview ----
  async getOverview() {
    const [
      totalUsers,
      totalListings,
      totalPosts,
      totalQuestions,
      totalProjects,
      pendingReports,
      recentUsers,
      recentListings,
      recentReports,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.marketplaceListing.count(),
      this.prisma.post.count(),
      this.prisma.question.count(),
      this.prisma.project.count(),
      this.prisma.marketplaceListingReport.count({ where: { status: 'PENDING' } }),
      this.prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          role: true,
          status: true,
          createdAt: true,
          developerProfile: { select: { username: true, displayName: true, avatarUrl: true } },
        },
      }),
      this.prisma.marketplaceListing.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          title: true,
          price: true,
          currency: true,
          createdAt: true,
          seller: { select: { displayName: true, username: true } },
        },
      }),
      this.prisma.marketplaceListingReport.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          reason: true,
          status: true,
          createdAt: true,
          listing: { select: { id: true, title: true } },
          reporter: { select: { id: true, email: true } },
        },
      }),
    ]);

    return {
      stats: { totalUsers, totalListings, totalPosts, totalQuestions, totalProjects, pendingReports },
      recentUsers,
      recentListings,
      recentReports,
    };
  }

  // ---- Users ----
  async getUsers(query: { page?: string; limit?: string; search?: string; role?: string }) {
    const { page, limit, skip } = this.paginate(query);
    const where: Prisma.UserWhereInput = {};

    if (query.role) {
      where.role = query.role as UserRole;
    }
    if (query.search) {
      where.OR = [
        { email: { contains: query.search, mode: 'insensitive' } },
        { developerProfile: { is: { displayName: { contains: query.search, mode: 'insensitive' } } } },
        { developerProfile: { is: { username: { contains: query.search, mode: 'insensitive' } } } },
      ];
    }

    const [total, users] = await Promise.all([
      this.prisma.user.count({ where }),
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          role: true,
          status: true,
          createdAt: true,
          developerProfile: {
            select: { username: true, displayName: true, avatarUrl: true, experienceLevel: true },
          },
          _count: { select: { posts: true } },
        },
      }),
    ]);

    return { items: users, meta: this.meta(total, page, limit) };
  }

  async getUser(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        developerProfile: {
          select: {
            username: true,
            displayName: true,
            bio: true,
            avatarUrl: true,
            location: true,
            websiteUrl: true,
            githubUrl: true,
            experienceLevel: true,
            createdAt: true,
          },
        },
        authIdentities: { select: { provider: true, createdAt: true } },
        _count: {
          select: { posts: true, postComments: true, listingReports: true, sentMessages: true },
        },
      },
    });

    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async changeUserRole(actorId: string, userId: string, role: UserRole) {
    const target = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!target) throw new NotFoundException('User not found');

    if (target.role === 'ADMIN' && role !== 'ADMIN') {
      const adminCount = await this.prisma.user.count({ where: { role: 'ADMIN' } });
      if (adminCount <= 1) {
        throw new BadRequestException('Cannot remove the last admin');
      }
    }

    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: { role },
      select: { id: true, email: true, role: true, status: true },
    });

    await this.audit(actorId, 'USER_ROLE_CHANGED', 'User', userId, { from: target.role, to: role });
    return updated;
  }

  // ---- Marketplace listings ----
  async getListings(query: { page?: string; limit?: string; search?: string }) {
    const { page, limit, skip } = this.paginate(query);
    const where: Prisma.MarketplaceListingWhereInput = {};

    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
        { seller: { is: { displayName: { contains: query.search, mode: 'insensitive' } } } },
      ];
    }

    const [total, items] = await Promise.all([
      this.prisma.marketplaceListing.count({ where }),
      this.prisma.marketplaceListing.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          seller: { select: { id: true, username: true, displayName: true, avatarUrl: true } },
          _count: { select: { reports: true } },
        },
      }),
    ]);

    return { items, meta: this.meta(total, page, limit) };
  }

  // ---- Reports ----
  async getReports(query: { page?: string; limit?: string; status?: string }) {
    const { page, limit, skip } = this.paginate(query);
    const where: Prisma.MarketplaceListingReportWhereInput = {};
    if (query.status) {
      where.status = query.status as MarketplaceListingReportStatus;
    }

    const [total, items] = await Promise.all([
      this.prisma.marketplaceListingReport.count({ where }),
      this.prisma.marketplaceListingReport.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          reporter: { select: { id: true, email: true, developerProfile: { select: { username: true, displayName: true, avatarUrl: true } } } },
          listing: {
            select: {
              id: true,
              title: true,
              price: true,
              currency: true,
              seller: { select: { id: true, username: true, displayName: true } },
            },
          },
        },
      }),
    ]);

    return { items, meta: this.meta(total, page, limit) };
  }

  async getReport(id: string) {
    const report = await this.prisma.marketplaceListingReport.findUnique({
      where: { id },
      include: {
        reporter: { select: { id: true, email: true, developerProfile: { select: { username: true, displayName: true, avatarUrl: true } } } },
        listing: {
          select: {
            id: true,
            title: true,
            description: true,
            price: true,
            currency: true,
            category: true,
            type: true,
            seller: { select: { id: true, username: true, displayName: true } },
          },
        },
      },
    });

    if (!report) throw new NotFoundException('Report not found');
    return report;
  }

  async updateReportStatus(actorId: string, id: string, status: MarketplaceListingReportStatus) {
    const report = await this.prisma.marketplaceListingReport.findUnique({ where: { id } });
    if (!report) throw new NotFoundException('Report not found');

    const updated = await this.prisma.marketplaceListingReport.update({
      where: { id },
      data: { status },
    });

    await this.audit(actorId, 'REPORT_STATUS_CHANGED', 'MarketplaceListingReport', id, {
      from: report.status,
      to: status,
    });
    return updated;
  }

  // ---- Content ----
  async getPosts(query: { page?: string; limit?: string; search?: string }) {
    const { page, limit, skip } = this.paginate(query);
    const where: Prisma.PostWhereInput = {};
    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: 'insensitive' } },
        { content: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [total, items] = await Promise.all([
      this.prisma.post.count({ where }),
      this.prisma.post.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          author: { select: { id: true, email: true, developerProfile: { select: { username: true, displayName: true, avatarUrl: true } } } },
          _count: { select: { comments: true, likes: true } },
        },
      }),
    ]);

    return { items, meta: this.meta(total, page, limit) };
  }

  async getQuestions(query: { page?: string; limit?: string; search?: string }) {
    const { page, limit, skip } = this.paginate(query);
    const where: Prisma.QuestionWhereInput = {};
    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [total, items] = await Promise.all([
      this.prisma.question.count({ where }),
      this.prisma.question.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          author: { select: { id: true, username: true, displayName: true, avatarUrl: true } },
          _count: { select: { answers: true, votes: true } },
        },
      }),
    ]);

    return { items, meta: this.meta(total, page, limit) };
  }

  async getProjects(query: { page?: string; limit?: string; search?: string }) {
    const { page, limit, skip } = this.paginate(query);
    const where: Prisma.ProjectWhereInput = {};
    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [total, items] = await Promise.all([
      this.prisma.project.count({ where }),
      this.prisma.project.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          owner: { select: { id: true, username: true, displayName: true, avatarUrl: true } },
          _count: { select: { contributors: true } },
        },
      }),
    ]);

    return { items, meta: this.meta(total, page, limit) };
  }

  // ---- Violations ----
  async getViolations(query: { page?: string; limit?: string; status?: string }) {
    const { page, limit, skip } = this.paginate(query);
    const where: Prisma.ViolationWhereInput = {};
    if (query.status) {
      where.status = query.status as ViolationStatus;
    }

    const [total, items] = await Promise.all([
      this.prisma.violation.count({ where }),
      this.prisma.violation.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { id: true, email: true, developerProfile: { select: { username: true, displayName: true } } } },
          report: { select: { id: true, reason: true, status: true } },
          resolvedBy: { select: { id: true, email: true } },
        },
      }),
    ]);

    return { items, meta: this.meta(total, page, limit) };
  }

  async createViolation(actorId: string, data: CreateViolationDto) {
    const user = await this.prisma.user.findUnique({ where: { id: data.userId } });
    if (!user) throw new NotFoundException('User not found');

    if (data.reportId) {
      const report = await this.prisma.marketplaceListingReport.findUnique({ where: { id: data.reportId } });
      if (!report) throw new NotFoundException('Report not found');
    }

    const violation = await this.prisma.violation.create({
      data: {
        userId: data.userId,
        reportId: data.reportId ?? null,
        type: data.type,
        severity: data.severity,
        description: data.description ?? null,
      },
    });

    await this.audit(actorId, 'VIOLATION_CREATED', 'Violation', violation.id, {
      userId: data.userId,
      type: data.type,
      severity: data.severity,
    });
    return violation;
  }

  async updateViolationStatus(actorId: string, id: string, status: ViolationStatus) {
    const violation = await this.prisma.violation.findUnique({ where: { id } });
    if (!violation) throw new NotFoundException('Violation not found');

    const updated = await this.prisma.violation.update({
      where: { id },
      data: {
        status,
        resolvedAt: status === 'OPEN' ? null : new Date(),
        resolvedById: status === 'OPEN' ? null : actorId,
      },
    });

    await this.audit(actorId, 'VIOLATION_STATUS_CHANGED', 'Violation', id, {
      from: violation.status,
      to: status,
    });
    return updated;
  }

  // ---- Audit logs ----
  async getAuditLogs(query: { page?: string; limit?: string; action?: string }) {
    const { page, limit, skip } = this.paginate(query);
    const where: Prisma.AdminAuditLogWhereInput = {};
    if (query.action) {
      where.action = query.action;
    }

    const [total, items] = await Promise.all([
      this.prisma.adminAuditLog.count({ where }),
      this.prisma.adminAuditLog.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { actor: { select: { id: true, email: true, role: true } } },
      }),
    ]);

    return { items, meta: this.meta(total, page, limit) };
  }
}
