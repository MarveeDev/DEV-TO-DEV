import { EventEmitter } from 'events';
import { Injectable } from '@nestjs/common';
import type { Notification } from '@prisma/client';

export const NOTIFICATION_CREATED_EVENT = 'notification.created';

export interface NotificationCreatedEvent {
  userId: string;
  notification: Notification;
}

/**
 * In-process notification event bus.
 *
 * Phase 1 (foundation): the notification service persists a notification and
 * then emits a `notification.created` event here. A future WebSocket gateway
 * (Phase 2) will subscribe via `onNotificationCreated` to push notifications to
 * connected users in real time.
 *
 * This is intentionally a plain in-process EventEmitter for now. Redis-backed
 * pub/sub (for horizontal scaling) is deferred to Phase 6.
 */
@Injectable()
export class NotificationEvents extends EventEmitter {
  emitNotificationCreated(event: NotificationCreatedEvent): void {
    this.emit(NOTIFICATION_CREATED_EVENT, event);
  }

  onNotificationCreated(
    listener: (event: NotificationCreatedEvent) => void,
  ): () => void {
    this.on(NOTIFICATION_CREATED_EVENT, listener);
    return () => this.off(NOTIFICATION_CREATED_EVENT, listener);
  }
}
