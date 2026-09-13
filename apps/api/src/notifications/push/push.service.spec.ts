import { Notification } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { PushService } from './push.service';
import * as webPush from 'web-push';

jest.mock('web-push', () => ({
  setVapidDetails: jest.fn(),
  sendNotification: jest.fn(),
}));

function notification(overrides: Partial<Notification> = {}): Notification {
  return {
    id: 'n1',
    userId: 'u1',
    type: 'SYSTEM',
    title: 'Test',
    message: 'Message',
    read: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  } as Notification;
}

describe('PushService', () => {
  const prisma = {
    pushSubscription: {
      findMany: jest.fn(),
      delete: jest.fn(),
      upsert: jest.fn(),
      findUnique: jest.fn(),
    },
  };

  const prevEnv = { ...process.env };

  beforeAll(() => {
    process.env.VAPID_PUBLIC_KEY = 'test-public-key';
    process.env.VAPID_PRIVATE_KEY = 'test-private-key';
    process.env.VAPID_SUBJECT = 'mailto:test@devtodev.online';
  });

  afterAll(() => {
    process.env = prevEnv;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    prisma.pushSubscription.delete.mockResolvedValue(undefined);
  });

  it('removes only the invalid subscription when the provider returns 410', async () => {
    const service = new PushService(prisma as unknown as PrismaService);
    prisma.pushSubscription.findMany.mockResolvedValue([
      { id: 'sub1', userId: 'u1', endpoint: 'https://push.example/1', p256dh: 'p', auth: 'a' },
      { id: 'sub2', userId: 'u1', endpoint: 'https://push.example/2', p256dh: 'p', auth: 'a' },
    ]);
    (webPush.sendNotification as jest.Mock)
      .mockRejectedValueOnce({ statusCode: 410, message: 'Gone' })
      .mockResolvedValueOnce({ statusCode: 201, body: '', headers: {} });

    await service.sendForUser('u1', notification());

    expect(webPush.sendNotification).toHaveBeenCalledTimes(2);
    expect(prisma.pushSubscription.delete).toHaveBeenCalledTimes(1);
    expect(prisma.pushSubscription.delete).toHaveBeenCalledWith({ where: { id: 'sub1' } });
  });

  it('does not remove a subscription on a transient push failure', async () => {
    const service = new PushService(prisma as unknown as PrismaService);
    prisma.pushSubscription.findMany.mockResolvedValue([
      { id: 'sub1', userId: 'u1', endpoint: 'https://push.example/1', p256dh: 'p', auth: 'a' },
    ]);
    (webPush.sendNotification as jest.Mock).mockRejectedValue(new Error('network down'));

    await expect(service.sendForUser('u1', notification())).resolves.toBeUndefined();
    expect(prisma.pushSubscription.delete).not.toHaveBeenCalled();
  });

  it('is a no-op when VAPID is not configured', async () => {
    const saved = { ...process.env };
    delete process.env.VAPID_PUBLIC_KEY;
    delete process.env.VAPID_PRIVATE_KEY;
    delete process.env.VAPID_SUBJECT;

    const service = new PushService(prisma as unknown as PrismaService);
    await service.sendForUser('u1', notification());

    expect(webPush.sendNotification).not.toHaveBeenCalled();
    expect(prisma.pushSubscription.findMany).not.toHaveBeenCalled();

    process.env = saved;
  });
});
