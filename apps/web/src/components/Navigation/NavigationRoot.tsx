'use client';

import { useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Bell, Settings } from 'lucide-react';
import DesktopHeader from './DesktopHeader';
import DesktopSidebar from './DesktopSidebar';
import MobileBottomNav from './MobileBottomNav';
import { useNotifications } from '../Notifications/NotificationProvider';
import { useCurrentUser } from '../Auth/CurrentUserProvider';

export default function NavigationRoot() {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, loading, logout } = useCurrentUser();
  const { notifications, disconnect: disconnectNotifications } = useNotifications();
  const [history, setHistory] = useState<{ id: string; read: boolean }[]>([]);

  // Initial unread count from REST history.
  useEffect(() => {
    if (!isAuthenticated) return;
    let cancelled = false;
    fetch('/api/v1/notifications')
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (cancelled || !Array.isArray(data)) return;
        setHistory(data);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated]);

  // Merge REST history with live Socket.IO notifications to compute unread count.
  const unreadCount = useMemo(() => {
    const ids = new Set<string>();
    history.forEach((n) => {
      if (!n.read) ids.add(n.id);
    });
    notifications.forEach((n) => {
      if (n.read) ids.delete(n.id);
      else ids.add(n.id);
    });
    return ids.size;
  }, [history, notifications]);

  // Toggle the desktop sidebar layout offset. The sidebar only renders for
  // authenticated users, so the <body> padding-left must match that condition.
  useEffect(() => {
    document.body.classList.toggle('has-sidebar', isAuthenticated);
    return () => {
      document.body.classList.remove('has-sidebar');
    };
  }, [isAuthenticated]);

  const handleLogout = async () => {
    await logout();
    disconnectNotifications();
    router.push('/login');
  };

  return (
    <>
      <style>{`
        .desktop-nav-layer { display: none; }
        .mobile-nav-layer { display: block; }
        .mobile-header {
          position: sticky;
          top: 0;
          z-index: 50;
          background: var(--surface);
          border-bottom: 1px solid var(--border);
          height: 60px;
          padding: 0 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        @media (min-width: 1024px) {
          .desktop-nav-layer { display: block; }
          .mobile-nav-layer, .mobile-header { display: none !important; }
        }
      `}</style>

      {/* Desktop Navigation */}
      <div className="desktop-nav-layer">
        <DesktopHeader
          isAuthenticated={isAuthenticated}
          loading={loading}
          unreadCount={unreadCount}
        />
        {isAuthenticated && !loading && (
          <DesktopSidebar onLogout={handleLogout} currentPath={pathname} unreadCount={unreadCount} />
        )}
      </div>

      {/* Mobile Navigation */}
      {!loading && isAuthenticated && (
        <div className="mobile-nav-layer">
          <MobileBottomNav currentPath={pathname} />
        </div>
      )}

      {/* Mobile header */}
      {!loading && (
        <header className="mobile-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <img src="/logo.png" alt="DEV-TO-DEV Logo" style={{ height: 30, width: 'auto', objectFit: 'contain' }} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {isAuthenticated ? (
              <>
                <Link
                  href="/notifications"
                  aria-label="Notifications"
                  style={{
                    position: 'relative',
                    width: 40,
                    height: 40,
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--foreground-muted)',
                  }}
                >
                  <Bell size={22} />
                  {unreadCount > 0 && (
                    <span
                      style={{
                        position: 'absolute',
                        top: 6,
                        right: 6,
                        minWidth: 16,
                        height: 16,
                        padding: '0 4px',
                        borderRadius: 'var(--radius-full)',
                        background: 'var(--primary)',
                        color: '#fff',
                        fontSize: 10,
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '2px solid var(--surface)',
                      }}
                    >
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                </Link>
                <Link
                  href="/settings"
                  aria-label="Settings"
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--foreground-muted)',
                  }}
                >
                  <Settings size={22} />
                </Link>
              </>
            ) : (
              <Link href="/login" className="btn btn--primary btn--sm">
                Login
              </Link>
            )}
          </div>
        </header>
      )}
    </>
  );
}
