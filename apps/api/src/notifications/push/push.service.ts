import { Injectable, Logger, ForbiddenException } from '@nestjs/common';
import { Notification, Prisma } from '@prisma/client';
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

  /**
   * Registers or updates a push subscription for the given user.
   *
   * The `userId` is always derived from the authenticated server-side session
   * (see the controller); it is never taken from the request body. Ownership is
   * enforced by only ever updating rows the caller already owns and only ever
   * creating rows that do not yet exist. An endpoint that belongs to a different
   * user is never reassigned.
   */
  async subscribe(userId: string, input: PushSubscriptionInput): Promise<void> {
    // Fast path: the caller already owns this endpoint, so just refresh the keys.
    const owned = await this.prisma.pushSubscription.updateMany({
      where: { endpoint: input.endpoint, userId },
      data: { p256dh: input.p256dh, auth: input.auth },
    });
    if (owned.count > 0) {
      return;
    }

    // The endpoint is either unregistered or owned by someone else. Only an
    // insert can claim a fresh endpoint; the unique index on `endpoint` is the
    // arbiter that makes concurrent competing claims race-safe.
    try {
      await this.prisma.pushSubscription.create({
        data: {
          userId,
          endpoint: input.endpoint,
          p256dh: input.p256dh,
          auth: input.auth,
        },
      });
    } catch (error) {
      if (
        !(error instanceof Prisma.PrismaClientKnownRequestError) ||
        error.code !== 'P2002'
      ) {
        throw error;
      }

      // The endpoint already exists. A concurrent request from the same user may
      // have won the insert race; refresh keys in that case. Otherwise the
      // endpoint belongs to another user and must not be reassigned.
      const claimed = await this.prisma.pushSubscription.updateMany({
        where: { endpoint: input.endpoint, userId },
        data: { p256dh: input.p256dh, auth: input.auth },
      });
      if (claimed.count > 0) {
        return;
      }
      throw new ForbiddenException(
        'This push subscription endpoint belongs to another user',
      );
    }
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
