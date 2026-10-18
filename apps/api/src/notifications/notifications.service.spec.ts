import { NotificationsService } from './notifications.service';
import { PrismaService } from '../prisma/prisma.service';
import { MAX_LIMIT } from '../common/pagination';

describe('NotificationsService pagination', () => {
  const prisma = { notification: { findMany: jest.fn() } };
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
});
