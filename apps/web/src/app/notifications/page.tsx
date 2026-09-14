'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Card from '../../components/Card';
import Button from '../../components/Button';
import BackButton from '../../components/Navigation/BackButton';
import { useNotifications } from '../../components/Notifications/NotificationProvider';
import PushNotificationToggle from '../../components/Notifications/PushNotificationToggle';
import type { AppNotification } from '../../lib/notifications/types';
import { Bell, MessageSquare, UserPlus, UserCheck } from 'lucide-react';
import { NotificationListSkeleton } from '../../components/skeletons';
import EmptyState from '../../components/EmptyState';

const TYPE_ICON = {
  CONNECTION_REQUEST: UserPlus,
  CONNECTION_ACCEPTED: UserCheck,
  CONNECTION_REJECTED: UserCheck,
  MESSAGE: MessageSquare,
  SYSTEM: Bell,
} as const;

const TYPE_LABEL: Record<string, string> = {
  CONNECTION_REQUEST: 'Connection request',
  CONNECTION_ACCEPTED: 'Connection accepted',
  CONNECTION_REJECTED: 'Connection update',
  MESSAGE: 'New message',
  SYSTEM: 'System',
};

function formatTime(iso?: string) {
  if (!iso) return '';
  try {
    const d = new Date(iso);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const minutes = Math.floor(diffMs / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
  } catch {
    return '';
  }
}

export default function NotificationsPage() {
  const router = useRouter();
  const { notifications: liveNotifications, markRead } = useNotifications();

  const [history, setHistory] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/v1/notifications')
      .then(res => {
        if (res.status === 401) {
          router.push('/login');
          throw new Error('Unauthenticated');
        }
        if (!res.ok) throw new Error('Failed to fetch notifications');
        return res.json();
      })
      .then(data => {
        setHistory(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [router]);

  const notifications = useMemo(() => {
    const seen = new Set(history.map(n => n.id));
    const additions = liveNotifications.filter(n => !seen.has(n.id));
    if (additions.length === 0) return history;
    return [...additions, ...history];
  }, [history, liveNotifications]);

  const markAsRead = async (id: string) => {
    try {
      const res = await fetch(`/api/v1/notifications/${id}/read`, { method: 'PATCH' });
      if (res.ok) {
        setHistory(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
        markRead(id);
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <NotificationListSkeleton />
    </div>
  );
  if (error) return <div style={{ padding: '60px', textAlign: 'center', color: 'var(--danger)' }}>{error}</div>;

  return (
    <div>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <div className="page-header" style={{ marginBottom: 32 }}>
          <BackButton fallback="/dashboard" />
          <div className="page-header-content">
            <h1 className="text-wrap-safe" style={{ color: 'var(--foreground)', margin: '0 0 8px 0' }}>Notifications</h1>
            <p style={{ color: 'var(--foreground-muted)', margin: 0 }}>Stay updated with your network.</p>
          </div>
        </div>

        <Card padding="md" style={{ marginBottom: 24 }}>
          <PushNotificationToggle />
        </Card>

        {notifications.length === 0 ? (
          <EmptyState icon={Bell} title="No notifications yet" description="You're all caught up." />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {notifications.map(notification => {
              const Icon = TYPE_ICON[notification.type] ?? Bell;
              const title = notification.title || TYPE_LABEL[notification.type] || 'Notification';
              return (
                <Card
                  key={notification.id}
                  padding="md"
                  style={{
                    backgroundColor: notification.read ? 'var(--surface)' : 'var(--primary-light)',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 14,
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      background: notification.read ? 'var(--surface-muted)' : 'var(--surface)',
                      color: 'var(--primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={20} />
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                      <span style={{ fontSize: 14, fontWeight: notification.read ? 600 : 700, color: 'var(--foreground)' }}>{title}</span>
                      <span style={{ fontSize: 12, color: 'var(--foreground-subtle)', flexShrink: 0 }}>{formatTime(notification.createdAt)}</span>
                    </div>
                    <p style={{ fontSize: 14, color: 'var(--foreground-muted)', margin: '4px 0 0 0', lineHeight: 1.5 }}>
                      {notification.message}
                    </p>

                    <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                      {notification.type === 'CONNECTION_REQUEST' && (
                        <Button onClick={() => router.push('/network')} variant="outline" size="sm">Review Request</Button>
                      )}
                      {notification.type === 'CONNECTION_ACCEPTED' && (
                        <Button onClick={() => router.push('/network')} variant="outline" size="sm">View Network</Button>
                      )}
                      {notification.type === 'MESSAGE' && (
                        <Button onClick={() => router.push('/messages')} variant="outline" size="sm">View Messages</Button>
                      )}
                      {!notification.read && (
                        <Button onClick={() => markAsRead(notification.id)} variant="ghost" size="sm">Mark as read</Button>
                      )}
                    </div>
                  </div>

                  {!notification.read && (
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--primary)', flexShrink: 0, marginTop: 6 }} />
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
