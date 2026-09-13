import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationType } from '@prisma/client';
import { NotificationEvents } from './notification-events';
import { PushService } from './push/push.service';

export interface CreateNotificationInput {
  userId: string;
  type: NotificationType;
  title?: string;
  message: string;
}

@Injectable()
export class NotificationsService {
  constructor(
    private prisma: PrismaService,
    private events: NotificationEvents,
    private pushService: PushService,
  ) {}

  /**
   * Persists a notification and emits a `notification.created` event.
   *
   * Persistence always happens first, so notifications are never lost even if
   * the recipient is offline or real-time delivery is unavailable. The event is
   * emitted afterwards for future real-time delivery.
   */
  async create(input: CreateNotificationInput) {
    const notification = await this.prisma.notification.create({
      data: {
        userId: input.userId,
        type: input.type,
        title: input.title ?? null,
        message: input.message,
      },
    });

    this.events.emitNotificationCreated({
      userId: input.userId,
      notification,
    });

    // Trigger Web Push delivery for offline/backgrounded devices. Fire-and-
    // forget: the DB notification is the source of truth and a push failure
    // must never break notification creation.
    this.pushService.sendForUser(input.userId, notification).catch(() => undefined);

    return notification;
  }

  async getNotifications(userId: string) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async markAsRead(userId: string, notificationId: string) {
    const notification = await this.prisma.notification.findUnique({
      where: { id: notificationId },
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    if (notification.userId !== userId) {
      throw new ForbiddenException('You cannot modify this notification');
    }

    return this.prisma.notification.update({
      where: { id: notificationId },
      data: { read: true },
    });
  }
}
