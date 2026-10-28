import { NotificationsService } from './notifications.service';
import { PrismaService } from '../prisma/prisma.service';
import { MAX_LIMIT } from '../common/pagination';

describe('NotificationsService pagination', () => {
  const prisma = { notification: { findMany: jest.fn(), create: jest.fn() } };
  const events = { emitNotificationCreated: jest.fn() };
  const pushService = { sendForUser: jest.fn() };

  let service: NotificationsService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new NotificationsService(
      prisma as unknown as PrismaService,
      events as never,
      pushService as never,
    );
  });

  it('bounds notifications with take', async () => {
    prisma.notification.findMany.mockResolvedValue([]);

    await service.getNotifications('u1');

    expect(prisma.notification.findMany).toHaveBeenCalledWith({
      where: { userId: 'u1' },
      orderBy: { createdAt: 'desc' },
      take: MAX_LIMIT,
    });
  });

  it('propagates database errors', async () => {
    const boom = new Error('db down');
    prisma.notification.findMany.mockRejectedValue(boom);

    await expect(service.getNotifications('u1')).rejects.toBe(boom);
  });

  describe('create', () => {
    beforeEach(() => {
      pushService.sendForUser.mockResolvedValue(undefined);
    });

    it('persists metadata when provided', async () => {
      const created = { id: 'n1' };
      prisma.notification.create.mockResolvedValue(created);

      await service.create({
        userId: 'u1',
        type: 'SUPPORT',
        title: 'Support reply',
        message: 'A support agent replied to your ticket.',
        metadata: { ticketId: 't1' },
      });

      expect(prisma.notification.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          userId: 'u1',
          type: 'SUPPORT',
          metadata: { ticketId: 't1' },
        }),
      });
      expect(events.emitNotificationCreated).toHaveBeenCalledWith({
        userId: 'u1',
        notification: created,
      });
    });

    it('omits metadata when not provided', async () => {
      prisma.notification.create.mockResolvedValue({ id: 'n1' });

      await service.create({ userId: 'u1', type: 'SYSTEM', message: 'hi' });

      expect(prisma.notification.create).toHaveBeenCalledWith({
        data: expect.objectContaining({ type: 'SYSTEM', metadata: undefined }),
      });
    });
  });
});
