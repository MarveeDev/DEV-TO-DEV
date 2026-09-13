import { Logger, OnModuleDestroy } from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SessionsService } from '../sessions/sessions.service';
import { NotificationEvents } from './notification-events';

const NOTIFICATION_CREATED_EVENT = 'notification.created';

function userRoom(userId: string): string {
  return `user:${userId}`;
}

function parseSessionId(cookieHeader: string | undefined): string | undefined {
  if (!cookieHeader) return undefined;
  for (const part of cookieHeader.split(';')) {
    const eq = part.indexOf('=');
    if (eq === -1) continue;
    const key = part.slice(0, eq).trim();
    const value = part.slice(eq + 1).trim();
    if (key === 'session_id' && value) return value;
  }
  return undefined;
}

/**
 * Real-time notification delivery (Phase 2).
 *
 * Authenticates each socket using the existing `session_id` cookie + session
 * validation, joins a per-user room, and pushes `notification.created` events to
 * the matching user only. PostgreSQL remains the source of truth; this gateway
 * is stateless with respect to persistence.
 */
@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  },
})
export class NotificationsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, OnModuleDestroy
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(NotificationsGateway.name);
  private unsubscribe: (() => void) | null = null;

  constructor(
    private readonly sessionsService: SessionsService,
    private readonly notificationEvents: NotificationEvents,
  ) {}

  afterInit(): void {
    this.unsubscribe = this.notificationEvents.onNotificationCreated(({ userId, notification }) => {
      this.server.to(userRoom(userId)).emit(NOTIFICATION_CREATED_EVENT, notification);
    });
  }

  async handleConnection(client: Socket): Promise<void> {
    const userId = await this.authenticate(client);
    if (!userId) {
      this.logger.warn('Rejecting unauthenticated notification socket');
      client.disconnect(true);
      return;
    }

    // Bind the authenticated identity to the socket; never trust client-supplied ids.
    client.data.userId = userId;
    client.join(userRoom(userId));
    this.logger.log(`Notification socket connected for user ${userId}`);
  }

  handleDisconnect(client: Socket): void {
    const userId: string | undefined = client.data?.userId;
    if (userId) {
      client.leave(userRoom(userId));
      this.logger.log(`Notification socket disconnected for user ${userId}`);
    }
  }

  onModuleDestroy(): void {
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
    }
  }

  private async authenticate(client: Socket): Promise<string | null> {
    const token = parseSessionId(client.handshake.headers.cookie);
    if (!token) return null;
    const userId = await this.sessionsService.validateSession(token);
    return userId ?? null;
  }
}
