import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationType } from '@prisma/client';
import { NotificationEvents } from './notification-events';

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
