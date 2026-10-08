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
import { RateLimitService } from '../common/rate-limit/rate-limit.service';

const NOTIFICATION_CREATED_EVENT = 'notification.created';

/** Maximum simultaneous notification sockets allowed per user. */
const MAX_SOCKETS_PER_USER = 10;

/** Connection/reconnection throttle: 30 new connections per user per minute. */
const CONNECTION_THROTTLE = { limit: 30, windowMs: 60_000 } as const;

function userRoom(userId: string): string {
  return `user:${userId}`;
}

function connectionKey(userId: string): string {
  return `devtodev:ws:conn:u:${userId}:60`;
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
  // Next.js rewrites proxy `/socket.io/` to the API without the trailing slash,
  // so engine.io must accept `/socket.io` (no trailing slash) as well.
  addTrailingSlash: false,
})
export class NotificationsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, OnModuleDestroy
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(NotificationsGateway.name);
  private unsubscribe: (() => void) | null = null;

  /** Tracks active socket ids per user to enforce the concurrency cap. */
  private readonly activeSockets = new Map<string, Set<string>>();

  constructor(
    private readonly sessionsService: SessionsService,
    private readonly notificationEvents: NotificationEvents,
    private readonly rateLimitService: RateLimitService,
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

    // Reconnect/connection throttle. Fails open on Redis outage so legitimate
    // reconnects are never blocked by an infrastructure issue.
    const throttle = await this.rateLimitService.consume(
      connectionKey(userId),
      CONNECTION_THROTTLE.limit,
      CONNECTION_THROTTLE.windowMs,
      false,
    );
    if (!throttle.allowed) {
      this.logger.warn(
        `Rejecting notification socket: connection throttle exceeded for user ${userId}`,
      );
      client.disconnect(true);
      return;
    }

    // Per-user concurrent socket cap.
    const sockets = this.activeSockets.get(userId) ?? new Set<string>();
    if (sockets.size >= MAX_SOCKETS_PER_USER) {
      this.logger.warn(
        `Rejecting notification socket: concurrency cap reached for user ${userId}`,
      );
      client.disconnect(true);
      return;
    }
    sockets.add(client.id);
    this.activeSockets.set(userId, sockets);

    // Bind the authenticated identity to the socket; never trust client-supplied ids.
    client.data.userId = userId;
    client.join(userRoom(userId));
    this.logger.log(`Notification socket connected for user ${userId}`);
  }

  handleDisconnect(client: Socket): void {
    const userId: string | undefined = client.data?.userId;
    if (userId) {
      const sockets = this.activeSockets.get(userId);
      if (sockets) {
        sockets.delete(client.id);
        if (sockets.size === 0) {
          this.activeSockets.delete(userId);
        }
      }
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
