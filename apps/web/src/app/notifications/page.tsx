'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Link from 'next/link';
import BackButton from '../../components/Navigation/BackButton';

export default function NotificationsPage() {
  const router = useRouter();
  
  const [notifications, setNotifications] = useState<any[]>([]);
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
        setNotifications(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [router]);

  const markAsRead = async (id: string) => {
    try {
      const res = await fetch(`/api/v1/notifications/${id}/read`, { method: 'PATCH' });
      if (res.ok) {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return <div style={{ padding: '60px', textAlign: 'center', color: 'var(--foreground-muted)' }}>Loading...</div>;
  if (error) return <div style={{ padding: '60px', textAlign: 'center', color: '#ef4444' }}>{error}</div>;

  return (
    <div>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        <div className="page-header" style={{ marginBottom: '40px' }}>
          <BackButton fallback="/dashboard" />
          <div className="page-header-content">
            <h1 className="text-wrap-safe" style={{ fontSize: '32px', fontWeight: 800, color: 'var(--foreground)', margin: '0 0 8px 0' }}>Notifications</h1>
            <p style={{ color: 'var(--foreground-muted)', margin: 0 }}>Stay updated with your network.</p>
          </div>
        </div>

        {notifications.length === 0 ? (
          <Card padding="md" style={{ textAlign: 'center' }}>
            <p style={{ color: 'var(--foreground-muted)', margin: 0 }}>No notifications yet.</p>
          </Card>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {notifications.map(notification => (
              <Card 
                key={notification.id} 
                padding="md"
                style={{ 
                  borderLeft: notification.read ? '1px solid var(--border)' : '4px solid var(--primary)',
                  backgroundColor: notification.read ? 'var(--surface)' : 'var(--primary-light)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '16px',
                  opacity: notification.read ? 0.7 : 1
                }}
              >
                <div>
                  <p style={{ fontSize: '15px', color: 'var(--foreground)', margin: '0 0 12px 0', lineHeight: 1.5, fontWeight: notification.read ? 500 : 600 }}>
                    {notification.message}
                  </p>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    {notification.type === 'CONNECTION_REQUEST' && (
                      <Button onClick={() => router.push('/network')} variant="outline" size="sm">
                        Review Request
                      </Button>
                    )}
                    {notification.type === 'CONNECTION_ACCEPTED' && (
                      <Button onClick={() => router.push('/network')} variant="outline" size="sm">
                        View Network
                      </Button>
                    )}
                  </div>
                </div>

                {!notification.read && (
                  <Button 
                    onClick={() => markAsRead(notification.id)}
                    variant="ghost"
                    size="sm"
                  >
                    Mark as read
                  </Button>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
