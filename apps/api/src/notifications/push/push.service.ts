import { Injectable, Logger } from '@nestjs/common';
import { Notification } from '@prisma/client';
import * as webPush from 'web-push';
import { PrismaService } from '../../prisma/prisma.service';

const PUSH_TITLE = 'DEV-TO-DEV';

// Safe, public application routes per notification type. These never contain
// credentials or session tokens.
const NOTIFICATION_ROUTES: Record<string, string> = {
  CONNECTION_REQUEST: '/network',
  CONNECTION_ACCEPTED: '/network',
  CONNECTION_REJECTED: '/network',
  MESSAGE: '/messages',
  SYSTEM: '/notifications',
};

export interface PushSubscriptionInput {
  endpoint: string;
  p256dh: string;
  auth: string;
}

/**
 * Dedicated Web Push (VAPID) delivery service.
 *
 * Kept separate from NotificationsService so the database notification remains
 * the source of truth and a push failure can never break notification creation.
 */
@Injectable()
export class PushService {
  private readonly logger = new Logger(PushService.name);
  private readonly configured: boolean;

  constructor(private readonly prisma: PrismaService) {
    const publicKey = process.env.VAPID_PUBLIC_KEY;
    const privateKey = process.env.VAPID_PRIVATE_KEY;
    const subject = process.env.VAPID_SUBJECT;
    this.configured = Boolean(publicKey && privateKey && subject);
    if (this.configured) {
      webPush.setVapidDetails(subject!, publicKey!, privateKey!);
    } else {
      this.logger.warn(
        'VAPID_* environment variables are not configured; web push delivery is disabled.',
      );
    }
  }

  /** Public VAPID key (safe to expose to the frontend). */
  getVapidPublicKey(): string | null {
    return process.env.VAPID_PUBLIC_KEY ?? null;
  }

  /** Creates or updates a subscription for the given user (deduplicated by endpoint). */
  async subscribe(userId: string, input: PushSubscriptionInput) {
    return this.prisma.pushSubscription.upsert({
      where: { endpoint: input.endpoint },
      update: { userId, p256dh: input.p256dh, auth: input.auth },
      create: {
        userId,
        endpoint: input.endpoint,
        p256dh: input.p256dh,
        auth: input.auth,
      },
    });
  }

  /**
   * Removes a subscription, but only if it belongs to the given user.
   * Returns true if a subscription was removed.
   */
  async unsubscribe(userId: string, endpoint: string): Promise<boolean> {
    const existing = await this.prisma.pushSubscription.findUnique({
      where: { endpoint },
    });
    if (!existing || existing.userId !== userId) {
      return false;
    }
    await this.prisma.pushSubscription.delete({ where: { endpoint } });
    return true;
  }

  /**
   * Sends a push notification to every valid subscription for the user.
   * Never throws: per-subscription failures are handled internally, and
   * permanently-invalid subscriptions are removed.
   */
  async sendForUser(userId: string, notification: Notification): Promise<void> {
    if (!this.configured) {
      return;
    }

    const subscriptions = await this.prisma.pushSubscription.findMany({
      where: { userId },
    });
    if (subscriptions.length === 0) {
      return;
    }

    const payload = JSON.stringify({
      title: notification.title ?? PUSH_TITLE,
      body: notification.message,
      tag: notification.id,
      data: {
        url: NOTIFICATION_ROUTES[notification.type] ?? '/notifications',
        type: notification.type,
        notificationId: notification.id,
      },
    });

    await Promise.all(
      subscriptions.map((sub) => this.sendToSubscription(sub, payload)),
    );
  }

  private async sendToSubscription(
    subscription: {
      id: string;
      endpoint: string;
      p256dh: string;
      auth: string;
    },
    payload: string,
  ): Promise<void> {
    try {
      await webPush.sendNotification(
        {
          endpoint: subscription.endpoint,
          keys: { p256dh: subscription.p256dh, auth: subscription.auth },
        },
        payload,
      );
    } catch (error) {
      const statusCode = (error as { statusCode?: number })?.statusCode;
      if (statusCode === 404 || statusCode === 410) {
        // The push provider has permanently rejected this subscription.
        await this.prisma.pushSubscription
          .delete({ where: { id: subscription.id } })
          .catch(() => undefined);
        this.logger.log(`Removed invalid push subscription ${subscription.id}`);
        return;
      }
      this.logger.warn(
        `Push delivery failed for subscription ${subscription.id}: ${
          (error as Error)?.message ?? String(error)
        }`,
      );
    }
  }
}
