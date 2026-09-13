import { io, type Socket } from 'socket.io-client';
import type { AppNotification } from './types';

export const NOTIFICATION_CREATED_EVENT = 'notification.created';

let socket: Socket | null = null;

/**
 * Returns a single shared Socket.IO connection for the current browser session.
 *
 * The socket connects to the same origin (e.g. `https://devtodev.online`) using
 * the default `/socket.io` path. The Next.js server rewrites `/socket.io/*` to
 * the NestJS API container, so no API URL is hardcoded here and the existing
 * `session_id` cookie is sent automatically with the handshake.
 */
export function connectNotificationSocket(): Socket {
  if (socket) {
    return socket;
  }

  socket = io({
    path: '/socket.io',
    withCredentials: true,
  });

  return socket;
}

export function getNotificationSocket(): Socket | null {
  return socket;
}

export function disconnectNotificationSocket(): void {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

export type NotificationCreatedListener = (notification: AppNotification) => void;
