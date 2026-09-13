'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  connectNotificationSocket,
  disconnectNotificationSocket,
  getNotificationSocket,
  NOTIFICATION_CREATED_EVENT,
} from '../../lib/notifications/socket';
import type { AppNotification } from '../../lib/notifications/types';

export type NotificationConnectionState =
  | 'idle'
  | 'connecting'
  | 'connected'
  | 'disconnected';

interface NotificationContextValue {
  notifications: AppNotification[];
  connectionState: NotificationConnectionState;
  connect: () => void;
  disconnect: () => void;
  markRead: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextValue>({
  notifications: [],
  connectionState: 'idle',
  connect: () => {},
  disconnect: () => {},
  markRead: () => {},
});

/**
 * Owns a single shared Socket.IO connection for the authenticated browser
 * session. Connects only when the user is authenticated (session_id cookie),
 * listens for `notification.created`, and exposes the accumulated notifications
 * plus connection lifecycle controls to the rest of the app.
 */
export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [connectionState, setConnectionState] =
    useState<NotificationConnectionState>('idle');
  const listeningRef = useRef(false);

  const stopListening = useCallback(() => {
    const socket = getNotificationSocket();
    if (socket) {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('connect_error');
      socket.off(NOTIFICATION_CREATED_EVENT);
    }
    listeningRef.current = false;
  }, []);

  const startListening = useCallback(() => {
    if (listeningRef.current) {
      return;
    }

    const socket = connectNotificationSocket();
    listeningRef.current = true;

    socket.on('connect', () => setConnectionState('connected'));
    socket.on('disconnect', () => setConnectionState('disconnected'));
    socket.on('connect_error', () => setConnectionState('disconnected'));
    socket.on(NOTIFICATION_CREATED_EVENT, (notification: AppNotification) => {
      setNotifications((prev) =>
        prev.some((n) => n.id === notification.id)
          ? prev
          : [notification, ...prev],
      );
    });

    if (socket.connected) {
      setConnectionState('connected');
    } else {
      setConnectionState('connecting');
      socket.connect();
    }
  }, []);

  const connect = useCallback(() => {
    startListening();
  }, [startListening]);

  const disconnect = useCallback(() => {
    stopListening();
    disconnectNotificationSocket();
    setNotifications([]);
    setConnectionState('disconnected');
  }, [stopListening]);

  const markRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  }, []);

  useEffect(() => {
    let cancelled = false;

    fetch('/api/v1/auth/me')
      .then((res) => {
        if (!cancelled && res.ok) {
          connect();
        }
      })
      .catch(() => {
        // Not authenticated or request failed; leave the socket disconnected.
      });

    return () => {
      cancelled = true;
      stopListening();
      disconnectNotificationSocket();
    };
  }, [connect, stopListening]);

  const value = useMemo(
    () => ({ notifications, connectionState, connect, disconnect, markRead }),
    [notifications, connectionState, connect, disconnect, markRead],
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  return useContext(NotificationContext);
}
