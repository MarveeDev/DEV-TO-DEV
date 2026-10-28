import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SessionsService } from '../sessions/sessions.service';
import { MailService } from '../mail/mail.service';
import { Prisma, UserRole, UserStatus, AdminInvite, MarketplaceListingReportStatus, ViolationStatus } from '@prisma/client';
import { randomBytes, createHash } from 'crypto';
import { CreateViolationDto } from './dto/create-violation.dto';
import { STAFF_ROLES, hasPermission, canAssignRole, ADMIN_ROLE_LOCK_KEY } from './permissions';

const DEFAULT_LIMIT = 20;
const INVITE_TTL_MS = 7 * 24 * 60 * 60 * 1000;

@Injectable()
export class AdminService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly sessionsService: SessionsService,
    private readonly mailService: MailService,
  ) {}

  private generateActivationToken(): { token: string; tokenHash: string } {
    const token = randomBytes(32).toString('base64url');
    const tokenHash = createHash('sha256').update(token).digest('hex');
    return { token, tokenHash };
  }

  private activationUrl(token: string): string {
    const base = (process.env.FRONTEND_URL || 'http://localhost:3000').replace(/\/+$/, '');
    return `${base}/activate/${token}`;
  }

  private serializeInvite(invite: AdminInvite) {
    return {
      id: invite.id,
      email: invite.email,
      name: invite.name,
      role: invite.role,
      status: invite.status,
      createdAt: invite.createdAt,
      acceptedAt: invite.acceptedAt,
      expiresAt: invite.expiresAt,
    };
  }

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
  async getOverview(role?: UserRole) {
    const canSeeUserDetails = hasPermission(role ?? 'USER', 'users.view');

    const [totalUsers, totalListings, totalPosts, totalQuestions, totalProjects, pendingReports] =
      await Promise.all([
        this.prisma.user.count(),
        this.prisma.marketplaceListing.count(),
        this.prisma.post.count(),
        this.prisma.question.count(),
        this.prisma.project.count(),
        this.prisma.marketplaceListingReport.count({ where: { status: 'PENDING' } }),
      ]);

    if (!canSeeUserDetails) {
      return {
        stats: { totalUsers, totalListings, totalPosts, totalQuestions, totalProjects, pendingReports },
        recentUsers: [],
        recentListings: [],
        recentReports: [],
      };
    }

    const [recentUsers, recentListings, recentReports] = await Promise.all([
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
    return this.prisma.$transaction(async (tx) => {
      await tx.$executeRaw`SELECT pg_advisory_xact_lock(${ADMIN_ROLE_LOCK_KEY}::int, 0)`;

      const actor = await tx.user.findUnique({
        where: { id: actorId },
        select: { role: true },
      });
      if (!actor) throw new ForbiddenException('Actor not found');

      const target = await tx.user.findUnique({ where: { id: userId } });
      if (!target) throw new NotFoundException('User not found');

      if (target.id === actorId) {
        throw new BadRequestException('You cannot change your own role');
      }

      if (!canAssignRole(actor.role, role)) {
        throw new ForbiddenException('Insufficient permissions');
      }
      if (!canAssignRole(actor.role, target.role)) {
        throw new ForbiddenException('Insufficient permissions');
      }

      if (target.role === 'SUPER_ADMIN' && role !== 'SUPER_ADMIN') {
        const superCount = await tx.user.count({
          where: { role: 'SUPER_ADMIN', status: 'ACTIVE' },
        });
        if (superCount <= 1) {
          throw new BadRequestException('Cannot remove the last Super Admin');
        }
      }

      if (target.role === 'ADMIN' && role !== 'ADMIN' && role !== 'SUPER_ADMIN') {
        const adminCount = await tx.user.count({
          where: { role: { in: ['ADMIN', 'SUPER_ADMIN'] }, status: 'ACTIVE' },
        });
        if (adminCount <= 1) {
          throw new BadRequestException('Cannot remove the last admin');
        }
      }

      const updated = await tx.user.update({
        where: { id: userId },
        data: { role },
        select: { id: true, email: true, role: true, status: true },
      });

      await tx.adminAuditLog.create({
        data: {
          actorId,
          action: 'USER_ROLE_CHANGED',
          entityType: 'User',
          entityId: userId,
          metadata: { from: target.role, to: role } as Prisma.InputJsonValue,
        },
      });

      return updated;
    });
  }

  // ---- Staff management ----

  async listStaff(query: { page?: string; limit?: string; search?: string; role?: string }) {
    const { page, limit, skip } = this.paginate(query);
    const where: Prisma.UserWhereInput = { role: { not: 'USER' } };

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

    const [total, items] = await Promise.all([
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
          developerProfile: { select: { username: true, displayName: true, avatarUrl: true } },
        },
      }),
    ]);

    return { items, meta: this.meta(total, page, limit) };
  }

  async inviteStaff(actorId: string, email: string, name: string | undefined, role: UserRole) {
    const normalized = email.trim().toLowerCase();
    const fullName = (name ?? '').trim();
    if (!normalized) throw new BadRequestException('Email is required');
    if (!STAFF_ROLES.includes(role)) {
      throw new BadRequestException('Invalid staff role');
    }

    const actor = await this.prisma.user.findUnique({
      where: { id: actorId },
      select: { role: true },
    });
    if (!actor || !canAssignRole(actor.role, role)) {
      throw new ForbiddenException('You cannot assign this role');
    }

    const existingUser = await this.prisma.user.findFirst({
      where: { email: { equals: normalized, mode: 'insensitive' } },
      select: { id: true },
    });
    if (existingUser) {
      throw new BadRequestException('This email already belongs to an account; assign a role directly instead');
    }

    const existing = await this.prisma.adminInvite.findUnique({ where: { email: normalized } });
    if (existing && existing.status === 'ACCEPTED') {
      throw new BadRequestException('Invite already accepted');
    }

    const { token, tokenHash } = this.generateActivationToken();
    const expiresAt = new Date(Date.now() + INVITE_TTL_MS);

    const invite = existing
      ? await this.prisma.adminInvite.update({
          where: { id: existing.id },
          data: {
            role,
            name: fullName || null,
            status: 'PENDING',
            tokenHash,
            invitedById: actorId,
            acceptedAt: null,
            expiresAt,
          },
        })
      : await this.prisma.adminInvite.create({
          data: {
            email: normalized,
            name: fullName || null,
            role,
            tokenHash,
            invitedById: actorId,
            expiresAt,
          },
        });

    const emailSent = await this.mailService.sendStaffInvitation({
      to: normalized,
      name: fullName || null,
      role,
      activateUrl: this.activationUrl(token),
    });

    await this.audit(actorId, 'STAFF_INVITED', 'AdminInvite', invite.id, {
      email: normalized,
      role,
      emailSent,
    });
    return { invite: this.serializeInvite(invite), emailSent };
  }

  async listInvites() {
    const items = await this.prisma.adminInvite.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
        createdAt: true,
        acceptedAt: true,
        expiresAt: true,
        invitedBy: { select: { id: true, email: true } },
      },
    });
    return { items };
  }

  async resendInvite(actorId: string, id: string) {
    const invite = await this.prisma.adminInvite.findUnique({ where: { id } });
    if (!invite) throw new NotFoundException('Invite not found');
    if (invite.status !== 'PENDING') {
      throw new BadRequestException('Only pending invites can be resent');
    }

    const { token, tokenHash } = this.generateActivationToken();
    const expiresAt = new Date(Date.now() + INVITE_TTL_MS);

    await this.prisma.adminInvite.update({
      where: { id },
      data: { tokenHash, expiresAt },
    });

    const emailSent = await this.mailService.sendStaffInvitation({
      to: invite.email,
      name: invite.name,
      role: invite.role,
      activateUrl: this.activationUrl(token),
    });

    await this.audit(actorId, 'STAFF_INVITE_RESENT', 'AdminInvite', id, {
      email: invite.email,
      emailSent,
    });
    return { id, email: invite.email, emailSent };
  }

  async revokeInvite(actorId: string, id: string) {
    const invite = await this.prisma.adminInvite.findUnique({ where: { id } });
    if (!invite) throw new NotFoundException('Invite not found');

    const result = await this.prisma.adminInvite.updateMany({
      where: { id, status: 'PENDING' },
      data: { status: 'REVOKED', tokenHash: null },
    });
    if (result.count === 0) {
      throw new BadRequestException('Only pending invites can be revoked');
    }

    await this.audit(actorId, 'STAFF_INVITE_REVOKED', 'AdminInvite', id, { email: invite.email });
    return { id, email: invite.email, status: 'REVOKED' };
  }

  async setStaffStatus(actorId: string, userId: string, status: UserStatus) {
    const updated = await this.prisma.$transaction(async (tx) => {
      await tx.$executeRaw`SELECT pg_advisory_xact_lock(${ADMIN_ROLE_LOCK_KEY}::int, 0)`;

      const actor = await tx.user.findUnique({
        where: { id: actorId },
        select: { role: true },
      });
      if (!actor) throw new ForbiddenException('Actor not found');

      const target = await tx.user.findUnique({ where: { id: userId } });
      if (!target) throw new NotFoundException('User not found');

      if (target.id === actorId) {
        throw new BadRequestException('You cannot change your own account status');
      }

      if (!canAssignRole(actor.role, target.role)) {
        throw new ForbiddenException('Insufficient permissions');
      }

      if (target.role === 'SUPER_ADMIN' && status !== 'ACTIVE') {
        const superCount = await tx.user.count({
          where: { role: 'SUPER_ADMIN', status: 'ACTIVE' },
        });
        if (superCount <= 1) {
          throw new BadRequestException('Cannot deactivate the last Super Admin');
        }
      }

      const result = await tx.user.update({
        where: { id: userId },
        data: { status },
        select: { id: true, email: true, role: true, status: true },
      });

      if (status !== 'ACTIVE' && target.email) {
        await tx.adminInvite.updateMany({
          where: { email: target.email.trim().toLowerCase(), status: 'PENDING' },
          data: { status: 'REVOKED' },
        });
      }

      await tx.adminAuditLog.create({
        data: {
          actorId,
          action: status === 'ACTIVE' ? 'STAFF_REACTIVATED' : 'STAFF_DEACTIVATED',
          entityType: 'User',
          entityId: userId,
          metadata: { status } as Prisma.InputJsonValue,
        },
      });

      return result;
    });

    if (status !== 'ACTIVE') {
      await this.sessionsService.revokeAllForUser(userId).catch(() => undefined);
    }

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
