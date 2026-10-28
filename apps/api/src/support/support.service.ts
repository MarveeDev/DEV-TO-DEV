import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import {
  SupportTicketStatus,
  SupportTicketPriority,
  SupportMessageKind,
  UserStatus,
  NotificationType,
  Prisma,
} from '@prisma/client';
import { normalizePagination } from '../common/pagination';
import { hasPermission } from '../admin/permissions';

@Injectable()
export class SupportService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationsService,
  ) {}

  // ---- Developer-facing ----

  async createTicket(userId: string, dto: { subject: string; description: string; category?: string }) {
    const subject = (dto.subject ?? '').trim();
    const description = (dto.description ?? '').trim();
    const category = dto.category?.trim() || null;

    if (!subject) throw new BadRequestException('Subject cannot be empty');
    if (!description) throw new BadRequestException('Description cannot be empty');

    const ticket = await this.prisma.supportTicket.create({
      data: { subject, description, category, reporterId: userId },
    });

    return this.serializeDeveloperSummary(ticket);
  }

  async listDeveloperTickets(userId: string, page?: unknown, limit?: unknown) {
    const { page: p, limit: l, skip } = normalizePagination({ page, limit }, 20);
    const where = { reporterId: userId };

    const [total, items] = await Promise.all([
      this.prisma.supportTicket.count({ where }),
      this.prisma.supportTicket.findMany({
        where,
        skip,
        take: l,
        orderBy: { updatedAt: 'desc' },
      }),
    ]);

    return {
      data: items.map((t) => this.serializeDeveloperSummary(t)),
      meta: { total, page: p, limit: l, totalPages: Math.ceil(total / l) },
    };
  }

  async getDeveloperTicket(userId: string, id: string) {
    const ticket = await this.prisma.supportTicket.findFirst({
      where: { id, reporterId: userId },
      include: {
        messages: {
          where: { kind: SupportMessageKind.REPLY },
          orderBy: { createdAt: 'asc' },
          include: { author: { include: { developerProfile: true } } },
        },
      },
    });

    if (!ticket) throw new NotFoundException('Ticket not found');
    return this.serializeDeveloperTicket(ticket);
  }

  async addDeveloperMessage(userId: string, id: string, body: string) {
    const text = (body ?? '').trim();
    if (!text) throw new BadRequestException('Message cannot be empty');

    const ticket = await this.prisma.supportTicket.findFirst({
      where: { id, reporterId: userId },
    });
    if (!ticket) throw new NotFoundException('Ticket not found');

    const message = await this.prisma.$transaction(async (tx) => {
      const created = await tx.supportTicketMessage.create({
        data: { ticketId: id, authorId: userId, body: text, kind: SupportMessageKind.REPLY },
        include: { author: { include: { developerProfile: true } } },
      });
      await tx.supportTicket.update({ where: { id }, data: { updatedAt: new Date() } });
      return created;
    });

    if (ticket.assigneeId) {
      await this.notifications
        .create({
          userId: ticket.assigneeId,
          type: NotificationType.SUPPORT,
          title: 'New ticket reply',
          message: 'A developer replied to an assigned support ticket.',
        })
        .catch(() => undefined);
    }

    return this.serializeDeveloperMessage(message);
  }

  // ---- Staff-facing ----

  async listStaffTickets(query: {
    page?: unknown;
    limit?: unknown;
    search?: string;
    status?: string;
    priority?: string;
    assigneeId?: string;
    category?: string;
  }) {
    const { page, limit, skip } = normalizePagination({ page: query.page, limit: query.limit }, 20);
    const where: Prisma.SupportTicketWhereInput = {};

    if (query.status) where.status = query.status as SupportTicketStatus;
    if (query.priority) where.priority = query.priority as SupportTicketPriority;
    if (query.assigneeId) where.assigneeId = query.assigneeId;
    if (query.category) where.category = { contains: query.category, mode: 'insensitive' };
    if (query.search) {
      where.OR = [
        { subject: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [total, items] = await Promise.all([
      this.prisma.supportTicket.count({ where }),
      this.prisma.supportTicket.findMany({
        where,
        skip,
        take: limit,
        orderBy: { updatedAt: 'desc' },
        include: {
          reporter: { include: { developerProfile: true } },
          assignee: { include: { developerProfile: true } },
          _count: { select: { messages: true } },
        },
      }),
    ]);

    return {
      data: items.map((t) => this.serializeStaffSummary(t)),
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async getStaffTicket(id: string) {
    const ticket = await this.prisma.supportTicket.findUnique({
      where: { id },
      include: {
        reporter: { include: { developerProfile: true } },
        assignee: { include: { developerProfile: true } },
        messages: {
          orderBy: { createdAt: 'asc' },
          include: { author: { include: { developerProfile: true } } },
        },
      },
    });

    if (!ticket) throw new NotFoundException('Ticket not found');
    return this.serializeStaffTicket(ticket);
  }

  async updateStaffTicket(
    actorId: string,
    id: string,
    dto: { status?: SupportTicketStatus; priority?: SupportTicketPriority; assigneeId?: string },
  ) {
    const ticket = await this.prisma.supportTicket.findUnique({ where: { id } });
    if (!ticket) throw new NotFoundException('Ticket not found');

    const data: Prisma.SupportTicketUpdateInput = {};
    const audits: Array<{ action: string; entityId: string; metadata: Record<string, unknown> }> = [];

    if (dto.status && dto.status !== ticket.status) {
      data.status = dto.status;
      data.closedAt =
        dto.status === SupportTicketStatus.RESOLVED || dto.status === SupportTicketStatus.CLOSED
          ? new Date()
          : null;
      audits.push({
        action: 'SUPPORT_TICKET_STATUS_CHANGED',
        entityId: id,
        metadata: { from: ticket.status, to: dto.status },
      });
    }

    if (dto.priority && dto.priority !== ticket.priority) {
      data.priority = dto.priority;
      audits.push({
        action: 'SUPPORT_TICKET_PRIORITY_CHANGED',
        entityId: id,
        metadata: { from: ticket.priority, to: dto.priority },
      });
    }

    if (dto.assigneeId !== undefined) {
      const nextAssigneeId = dto.assigneeId === '' ? null : dto.assigneeId;
      if (nextAssigneeId && nextAssigneeId !== ticket.assigneeId) {
        const assignee = await this.prisma.user.findUnique({
          where: { id: nextAssigneeId },
          select: { id: true, role: true, status: true },
        });
        if (
          !assignee ||
          assignee.status !== UserStatus.ACTIVE ||
          !hasPermission(assignee.role, 'support.manage')
        ) {
          throw new BadRequestException('Assignee must be an active support staff member');
        }
        data.assignee = { connect: { id: nextAssigneeId } };
      } else if (!nextAssigneeId && ticket.assigneeId) {
        data.assignee = { disconnect: true };
      }
      if ((nextAssigneeId ?? null) !== ticket.assigneeId) {
        audits.push({
          action: 'SUPPORT_TICKET_ASSIGNED',
          entityId: id,
          metadata: { from: ticket.assigneeId, to: nextAssigneeId },
        });
      }
    }

    if (Object.keys(data).length === 0) {
      return this.getStaffTicket(id);
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.supportTicket.update({ where: { id }, data });
      for (const a of audits) {
        await this.audit(tx, actorId, a.action, 'SupportTicket', a.entityId, a.metadata);
      }
    });

    return this.getStaffTicket(id);
  }

  async addStaffMessage(
    actorId: string,
    id: string,
    dto: { body: string; kind?: SupportMessageKind },
  ) {
    const text = (dto.body ?? '').trim();
    if (!text) throw new BadRequestException('Message cannot be empty');

    const ticket = await this.prisma.supportTicket.findUnique({
      where: { id },
      select: { id: true, reporterId: true, assigneeId: true },
    });
    if (!ticket) throw new NotFoundException('Ticket not found');

    const kind = dto.kind ?? SupportMessageKind.REPLY;

    const message = await this.prisma.$transaction(async (tx) => {
      const created = await tx.supportTicketMessage.create({
        data: { ticketId: id, authorId: actorId, body: text, kind },
        include: { author: { include: { developerProfile: true } } },
      });
      await tx.supportTicket.update({ where: { id }, data: { updatedAt: new Date() } });
      if (kind === SupportMessageKind.NOTE) {
        await this.audit(tx, actorId, 'SUPPORT_TICKET_NOTE_CREATED', 'SupportTicket', id, {
          messageId: created.id,
        });
      }
      return created;
    });

    if (kind === SupportMessageKind.REPLY) {
      await this.notifications
        .create({
          userId: ticket.reporterId,
          type: NotificationType.SUPPORT,
          title: 'Support reply',
          message: 'A support agent replied to your ticket.',
        })
        .catch(() => undefined);
    }

    return this.serializeStaffMessage(message);
  }

  // ---- Helpers ----

  private async audit(
    client: Prisma.TransactionClient | PrismaService,
    actorId: string,
    action: string,
    entityType: string,
    entityId: string,
    metadata?: Record<string, unknown>,
  ) {
    await client.adminAuditLog.create({
      data: {
        actorId,
        action,
        entityType,
        entityId,
        metadata: metadata ? (metadata as Prisma.InputJsonValue) : undefined,
      },
    });
  }

  private serializeDeveloperSummary(t: { id: string; subject: string; status: SupportTicketStatus; priority: SupportTicketPriority; category: string | null; createdAt: Date; updatedAt: Date; closedAt: Date | null }) {
    return {
      id: t.id,
      subject: t.subject,
      status: t.status,
      priority: t.priority,
      category: t.category,
      createdAt: t.createdAt,
      updatedAt: t.updatedAt,
      closedAt: t.closedAt,
    };
  }

  private serializeDeveloperMessage(m: any) {
    return {
      id: m.id,
      body: m.body,
      createdAt: m.createdAt,
      authorId: m.authorId,
      author: { displayName: m.author?.developerProfile?.displayName ?? null },
      isStaff: hasPermission(m.author?.role, 'support.manage'),
    };
  }

  private serializeDeveloperTicket(t: any) {
    return {
      id: t.id,
      subject: t.subject,
      description: t.description,
      status: t.status,
      priority: t.priority,
      category: t.category,
      createdAt: t.createdAt,
      updatedAt: t.updatedAt,
      closedAt: t.closedAt,
      messages: (t.messages ?? []).map((m: any) => this.serializeDeveloperMessage(m)),
    };
  }

  private serializeStaffSummary(t: any) {
    return {
      id: t.id,
      subject: t.subject,
      status: t.status,
      priority: t.priority,
      category: t.category,
      createdAt: t.createdAt,
      updatedAt: t.updatedAt,
      closedAt: t.closedAt,
      reporter: t.reporter
        ? { id: t.reporter.id, displayName: t.reporter.developerProfile?.displayName ?? null }
        : null,
      assignee: t.assignee
        ? { id: t.assignee.id, displayName: t.assignee.developerProfile?.displayName ?? null }
        : null,
      messageCount: t._count?.messages ?? 0,
    };
  }

  private serializeStaffMessage(m: any) {
    return {
      id: m.id,
      body: m.body,
      kind: m.kind,
      createdAt: m.createdAt,
      authorId: m.authorId,
      author: { displayName: m.author?.developerProfile?.displayName ?? null },
    };
  }

  private serializeStaffTicket(t: any) {
    return {
      id: t.id,
      subject: t.subject,
      description: t.description,
      status: t.status,
      priority: t.priority,
      category: t.category,
      createdAt: t.createdAt,
      updatedAt: t.updatedAt,
      closedAt: t.closedAt,
      reporter: t.reporter
        ? { id: t.reporter.id, displayName: t.reporter.developerProfile?.displayName ?? null }
        : null,
      assignee: t.assignee
        ? { id: t.assignee.id, displayName: t.assignee.developerProfile?.displayName ?? null }
        : null,
      messages: (t.messages ?? []).map((m: any) => this.serializeStaffMessage(m)),
    };
  }
}
