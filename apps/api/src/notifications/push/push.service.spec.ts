import { ForbiddenException } from '@nestjs/common';
import { Notification, Prisma } from '@prisma/client';
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
    metadata: null,
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
      findUnique: jest.fn(),
      create: jest.fn(),
      updateMany: jest.fn(),
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

  describe('destination resolution', () => {
    function lastPayload(): { data: { url: string } } {
      const calls = (webPush.sendNotification as jest.Mock).mock.calls;
      return JSON.parse(calls[calls.length - 1][1]);
    }

    function withOneSubscription() {
      prisma.pushSubscription.findMany.mockResolvedValue([
        { id: 'sub1', userId: 'u1', endpoint: 'https://push.example/1', p256dh: 'p', auth: 'a' },
      ]);
      (webPush.sendNotification as jest.Mock).mockResolvedValue({ statusCode: 201, body: '', headers: {} });
    }

    it('deep-links SUPPORT notifications to the ticket id', async () => {
      const service = new PushService(prisma as unknown as PrismaService);
      withOneSubscription();

      await service.sendForUser('u1', notification({ type: 'SUPPORT', metadata: { ticketId: 'ticket-123' } }));

      expect(lastPayload().data.url).toBe('/support/ticket-123');
    });

    it('falls back to /support when the SUPPORT ticket id is missing', async () => {
      const service = new PushService(prisma as unknown as PrismaService);
      withOneSubscription();

      await service.sendForUser('u1', notification({ type: 'SUPPORT', metadata: null }));

      expect(lastPayload().data.url).toBe('/support');
    });

    it('falls back to /support when the SUPPORT ticket id is malformed', async () => {
      const service = new PushService(prisma as unknown as PrismaService);
      withOneSubscription();

      await service.sendForUser('u1', notification({ type: 'SUPPORT', metadata: { ticketId: 42 } }));

      expect(lastPayload().data.url).toBe('/support');
    });

    it('keeps existing static routes for other types', async () => {
      const service = new PushService(prisma as unknown as PrismaService);
      withOneSubscription();

      await service.sendForUser('u1', notification({ type: 'MESSAGE' }));

      expect(lastPayload().data.url).toBe('/messages');
    });
  });

  describe('subscribe ownership', () => {
    const endpoint = 'https://push.example.com/owned';
    const input = { endpoint, p256dh: 'p_new', auth: 'a_new' };

    function uniqueConstraintError() {
      return new Prisma.PrismaClientKnownRequestError(
        'Unique constraint failed on the field: `endpoint`',
        {
          code: 'P2002',
          clientVersion: 'test',
          meta: { target: ['endpoint'] },
        },
      );
    }

    it('registers a new endpoint for the caller', async () => {
      const service = new PushService(prisma as unknown as PrismaService);
      prisma.pushSubscription.updateMany.mockResolvedValue({ count: 0 });
      prisma.pushSubscription.create.mockResolvedValue({ id: 's1' });

      await service.subscribe('u1', input);

      expect(prisma.pushSubscription.updateMany).toHaveBeenCalledWith({
        where: { endpoint, userId: 'u1' },
        data: { p256dh: 'p_new', auth: 'a_new' },
      });
      expect(prisma.pushSubscription.create).toHaveBeenCalledWith({
        data: { userId: 'u1', endpoint, p256dh: 'p_new', auth: 'a_new' },
      });
    });

    it('updates keys when the caller already owns the endpoint', async () => {
      const service = new PushService(prisma as unknown as PrismaService);
      prisma.pushSubscription.updateMany.mockResolvedValue({ count: 1 });

      await service.subscribe('u1', input);

      expect(prisma.pushSubscription.create).not.toHaveBeenCalled();
    });

    it('throws 403 when another user owns the endpoint', async () => {
      const service = new PushService(prisma as unknown as PrismaService);
      prisma.pushSubscription.updateMany.mockResolvedValue({ count: 0 });
      prisma.pushSubscription.create.mockRejectedValue(uniqueConstraintError());

      await expect(service.subscribe('u2', input)).rejects.toBeInstanceOf(
        ForbiddenException,
      );
      // The only write attempted is scoped to the caller, never the owner.
      expect(prisma.pushSubscription.updateMany).toHaveBeenNthCalledWith(2, {
        where: { endpoint, userId: 'u2' },
        data: { p256dh: 'p_new', auth: 'a_new' },
      });
    });

    it('recovers when a concurrent request from the same user wins the insert race', async () => {
      const service = new PushService(prisma as unknown as PrismaService);
      prisma.pushSubscription.updateMany
        .mockResolvedValueOnce({ count: 0 })
        .mockResolvedValueOnce({ count: 1 });
      prisma.pushSubscription.create.mockRejectedValue(uniqueConstraintError());

      await expect(service.subscribe('u1', input)).resolves.toBeUndefined();
    });

    it('rethrows non-unique-constraint errors', async () => {
      const service = new PushService(prisma as unknown as PrismaService);
      prisma.pushSubscription.updateMany.mockResolvedValue({ count: 0 });
      const boom = new Error('boom');
      prisma.pushSubscription.create.mockRejectedValue(boom);

      await expect(service.subscribe('u1', input)).rejects.toBe(boom);
    });
  });
});
