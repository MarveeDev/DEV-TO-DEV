import { SupportService } from './support.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('SupportService', () => {
  const prisma = {
    supportTicket: {
      create: jest.fn(),
      count: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    supportTicketMessage: { create: jest.fn() },
    adminAuditLog: { create: jest.fn() },
    user: { findUnique: jest.fn() },
    $transaction: jest.fn(),
  };
  const notifications = { create: jest.fn() };

  let service: SupportService;

  beforeEach(() => {
    jest.clearAllMocks();
    prisma.$transaction.mockImplementation(async (fn: (tx: unknown) => Promise<unknown>) => fn(prisma));
    service = new SupportService(
      prisma as unknown as PrismaService,
      notifications as unknown as NotificationsService,
    );
  });

  describe('createTicket', () => {
    it('creates a ticket for the authenticated user', async () => {
      prisma.supportTicket.create.mockResolvedValue({
        id: 't1',
        subject: 'Help',
        description: 'desc',
        status: 'OPEN',
        priority: 'NORMAL',
        category: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        closedAt: null,
      });

      const result = await service.createTicket('u1', { subject: 'Help', description: 'desc' });

      expect(prisma.supportTicket.create).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ reporterId: 'u1' }) }),
      );
      expect(result.subject).toBe('Help');
    });

    it('rejects empty subject or description', async () => {
      await expect(service.createTicket('u1', { subject: '  ', description: 'd' })).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.createTicket('u1', { subject: 's', description: ' ' })).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('getDeveloperTicket', () => {
    it('queries with a REPLY-only message filter and owner scope', async () => {
      prisma.supportTicket.findFirst.mockResolvedValue({
        id: 't1',
        subject: 's',
        description: 'd',
        status: 'OPEN',
        priority: 'NORMAL',
        category: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        closedAt: null,
        messages: [
          { id: 'm1', body: 'reply', createdAt: new Date(), authorId: 'staff1', author: { role: 'SUPPORT', developerProfile: { displayName: 'Agent' } } },
        ],
      });

      await service.getDeveloperTicket('u1', 't1');

      expect(prisma.supportTicket.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 't1', reporterId: 'u1' },
          include: expect.objectContaining({
            messages: expect.objectContaining({ where: { kind: 'REPLY' } }),
          }),
        }),
      );
    });

    it('throws NotFound when the ticket belongs to another user', async () => {
      prisma.supportTicket.findFirst.mockResolvedValue(null);
      await expect(service.getDeveloperTicket('u1', 't2')).rejects.toThrow(NotFoundException);
    });

    it('never serializes kind or note metadata in developer responses', async () => {
      prisma.supportTicket.findFirst.mockResolvedValue({
        id: 't1',
        subject: 's',
        description: 'd',
        status: 'OPEN',
        priority: 'NORMAL',
        category: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        closedAt: null,
        messages: [
          { id: 'm1', body: 'reply', createdAt: new Date(), authorId: 'staff1', author: { role: 'SUPPORT', developerProfile: { displayName: 'Agent' } } },
        ],
      });

      const result = await service.getDeveloperTicket('u1', 't1');
      expect(result.messages[0]).not.toHaveProperty('kind');
      expect(result).not.toHaveProperty('assignee');
    });
  });

  describe('addDeveloperMessage', () => {
    it('replies on own ticket and notifies the assignee', async () => {
      prisma.supportTicket.findFirst.mockResolvedValue({ id: 't1', reporterId: 'u1', assigneeId: 'a1' });
      prisma.supportTicketMessage.create.mockResolvedValue({
        id: 'm1', body: 'thanks', kind: 'REPLY', createdAt: new Date(), authorId: 'u1',
        author: { role: 'USER', developerProfile: { displayName: null } },
      });
      prisma.supportTicket.update.mockResolvedValue({});
      notifications.create.mockResolvedValue(undefined);

      await service.addDeveloperMessage('u1', 't1', 'thanks');

      expect(prisma.supportTicket.findFirst).toHaveBeenCalledWith({ where: { id: 't1', reporterId: 'u1' } });
      expect(notifications.create).toHaveBeenCalledWith(
        expect.objectContaining({ userId: 'a1', type: 'SUPPORT' }),
      );
    });

    it('throws NotFound for a non-owned ticket', async () => {
      prisma.supportTicket.findFirst.mockResolvedValue(null);
      await expect(service.addDeveloperMessage('u1', 't2', 'hi')).rejects.toThrow(NotFoundException);
    });

    it('survives notification failures', async () => {
      prisma.supportTicket.findFirst.mockResolvedValue({ id: 't1', reporterId: 'u1', assigneeId: 'a1' });
      prisma.supportTicketMessage.create.mockResolvedValue({
        id: 'm1', body: 'hi', kind: 'REPLY', createdAt: new Date(), authorId: 'u1',
        author: { role: 'USER', developerProfile: { displayName: null } },
      });
      prisma.supportTicket.update.mockResolvedValue({});
      notifications.create.mockRejectedValue(new Error('notif down'));

      const result = await service.addDeveloperMessage('u1', 't1', 'hi');
      expect(result.id).toBe('m1');
    });
  });

  describe('listStaffTickets', () => {
    it('applies filters and pagination', async () => {
      prisma.supportTicket.count.mockResolvedValue(0);
      prisma.supportTicket.findMany.mockResolvedValue([]);

      await service.listStaffTickets({ status: 'OPEN', priority: 'HIGH', search: 'billing', assigneeId: 'a1' });

      expect(prisma.supportTicket.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            status: 'OPEN',
            priority: 'HIGH',
            assigneeId: 'a1',
            OR: [
              { subject: { contains: 'billing', mode: 'insensitive' } },
              { description: { contains: 'billing', mode: 'insensitive' } },
            ],
          }),
        }),
      );
    });
  });

  describe('updateStaffTicket', () => {
    it('rejects assigning to a non-support user', async () => {
      prisma.supportTicket.findUnique.mockResolvedValue({
        id: 't1', status: 'OPEN', priority: 'NORMAL', assigneeId: null,
      });
      prisma.user.findUnique.mockResolvedValue({ id: 'u9', role: 'USER' });

      await expect(
        service.updateStaffTicket('staff1', 't1', { assigneeId: 'u9' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('audits a status change', async () => {
      prisma.supportTicket.findUnique.mockResolvedValue({
        id: 't1', status: 'OPEN', priority: 'NORMAL', assigneeId: null, reporterId: 'u1', subject: 's', description: 'd',
        category: null, createdAt: new Date(), updatedAt: new Date(), closedAt: null,
      });
      prisma.supportTicket.update.mockResolvedValue({});
      prisma.adminAuditLog.create.mockResolvedValue({});

      await service.updateStaffTicket('staff1', 't1', { status: 'IN_PROGRESS' });

      expect(prisma.adminAuditLog.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ action: 'SUPPORT_TICKET_STATUS_CHANGED', actorId: 'staff1' }),
        }),
      );
    });

    it('clears closedAt when reopening a resolved ticket', async () => {
      prisma.supportTicket.findUnique.mockResolvedValue({
        id: 't1', status: 'RESOLVED', priority: 'NORMAL', assigneeId: null, reporterId: 'u1', subject: 's', description: 'd',
        category: null, createdAt: new Date(), updatedAt: new Date(), closedAt: new Date('2024-01-01'),
      });
      prisma.supportTicket.update.mockResolvedValue({});
      prisma.adminAuditLog.create.mockResolvedValue({});

      await service.updateStaffTicket('staff1', 't1', { status: 'OPEN' });

      expect(prisma.supportTicket.update).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ status: 'OPEN', closedAt: null }) }),
      );
    });
  });

  describe('addStaffMessage', () => {
    it('audits internal notes and does not notify the reporter', async () => {
      prisma.supportTicket.findUnique.mockResolvedValue({ id: 't1', reporterId: 'u1', assigneeId: 'a1' });
      prisma.supportTicketMessage.create.mockResolvedValue({
        id: 'm1', body: 'internal', kind: 'NOTE', createdAt: new Date(), authorId: 'staff1',
        author: { role: 'SUPPORT', developerProfile: { displayName: 'Agent' } },
      });
      prisma.supportTicket.update.mockResolvedValue({});
      prisma.adminAuditLog.create.mockResolvedValue({});

      await service.addStaffMessage('staff1', 't1', { body: 'internal', kind: 'NOTE' });

      expect(prisma.adminAuditLog.create).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ action: 'SUPPORT_TICKET_NOTE_CREATED' }) }),
      );
      expect(notifications.create).not.toHaveBeenCalled();
    });

    it('notifies the reporter on a public reply', async () => {
      prisma.supportTicket.findUnique.mockResolvedValue({ id: 't1', reporterId: 'u1', assigneeId: 'a1' });
      prisma.supportTicketMessage.create.mockResolvedValue({
        id: 'm1', body: 'we fixed it', kind: 'REPLY', createdAt: new Date(), authorId: 'staff1',
        author: { role: 'SUPPORT', developerProfile: { displayName: 'Agent' } },
      });
      prisma.supportTicket.update.mockResolvedValue({});
      notifications.create.mockResolvedValue(undefined);

      await service.addStaffMessage('staff1', 't1', { body: 'we fixed it' });

      expect(notifications.create).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: 'u1',
          type: 'SUPPORT',
          metadata: { ticketId: 't1' },
        }),
      );
      expect(prisma.adminAuditLog.create).not.toHaveBeenCalled();
    });
  });
});
