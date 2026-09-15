'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useCurrentUser } from '../Auth/CurrentUserProvider';
import Avatar from '../Avatar';
import {
  LayoutDashboard,
  Users,
  Store,
  Flag,
  FileText,
  ShieldAlert,
  ScrollText,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  ChevronRight,
} from 'lucide-react';

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
  adminOnly?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Content', href: '/admin/content', icon: FileText },
  { name: 'Marketplace', href: '/admin/marketplace', icon: Store },
  { name: 'Reports', href: '/admin/reports', icon: Flag },
  { name: 'Moderation', href: '/admin/violations', icon: ShieldAlert },
  { name: 'Audit Logs', href: '/admin/audit-logs', icon: ScrollText, adminOnly: true },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

const ROLE_LABEL: Record<string, string> = {
  ADMIN: 'System Administrator',
  MODERATOR: 'Moderator',
};

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user: me, loading, logout } = useCurrentUser();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!me) {
      router.replace('/login');
    }
  }, [loading, me, router]);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  if (loading) {
    return (
      <div className="admin-root" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--foreground-muted)', background: 'var(--background)' }}>
        Loading admin dashboard...
      </div>
    );
  }

  if (!me) return null;

  if (me.role !== 'ADMIN' && me.role !== 'MODERATOR') {
    return (
      <div className="admin-root" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', textAlign: 'center', background: 'var(--background)' }}>
        <div style={{ fontSize: '48px', fontWeight: 800, color: 'var(--foreground)' }}>403</div>
        <p style={{ color: 'var(--foreground-muted)', margin: '8px 0 24px' }}>
          You do not have permission to access the admin dashboard.
        </p>
        <Link href="/" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>
          Back to DEV-TO-DEV
        </Link>
      </div>
    );
  }

  const isAdmin = me.role === 'ADMIN';
  const visibleItems = NAV_ITEMS.filter((item) => !item.adminOnly || isAdmin);
  const current = NAV_ITEMS.find((item) => pathname === item.href || pathname.startsWith(item.href + '/'));

  const displayName = me.developerProfile?.displayName || me.email || 'Administrator';
  const roleLabel = ROLE_LABEL[me.role] || me.role || 'Admin';
  const avatarName = me.developerProfile?.displayName || me.email || 'Admin';

  const sidebarContent = (
    <>
      <div style={{ padding: '20px 20px 16px', display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
        <img
          src="/logo.png"
          alt="DEV-TO-DEV"
          style={{ height: 30, width: 30, objectFit: 'contain', flexShrink: 0, borderRadius: 6 }}
        />
        <div style={{ minWidth: 0 }}>
          <div style={{ fontWeight: 800, fontSize: 15, color: 'var(--foreground)', letterSpacing: '-0.01em', lineHeight: 1.2 }}>
            DEV-TO-DEV
          </div>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--foreground-muted)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
            Admin Console
          </div>
        </div>
      </div>

      <div style={{ padding: '8px 16px 16px', flexShrink: 0 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--foreground-subtle)', padding: '0 8px 8px' }}>
          Management
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {visibleItems.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + '/');
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '9px 12px',
                  borderRadius: 10,
                  color: active ? '#ffffff' : 'var(--foreground-muted)',
                  background: active ? 'var(--primary)' : 'transparent',
                  fontWeight: active ? 600 : 500,
                  fontSize: '14px',
                  textDecoration: 'none',
                  transition: 'background 0.12s ease, color 0.12s ease',
                }}
              >
                <Icon size={18} strokeWidth={active ? 2.2 : 2} />
                <span style={{ flex: 1 }}>{item.name}</span>
                {active && <ChevronRight size={15} strokeWidth={2.2} />}
              </Link>
            );
          })}
        </nav>
      </div>

      <div style={{ marginTop: 'auto', padding: '16px', flexShrink: 0, borderTop: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Avatar src={me.developerProfile?.avatarUrl} name={avatarName} size={38} />
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--foreground)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {displayName}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--foreground-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {roleLabel}
            </div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          style={{
            marginTop: '14px',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '9px 12px',
            borderRadius: 10,
            border: '1px solid var(--border)',
            background: 'transparent',
            color: 'var(--foreground-muted)',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'background 0.12s ease, color 0.12s ease, border-color 0.12s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--danger-light)';
            e.currentTarget.style.color = 'var(--danger)';
            e.currentTarget.style.borderColor = 'var(--danger)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = 'var(--foreground-muted)';
            e.currentTarget.style.borderColor = 'var(--border)';
          }}
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </>
  );

  return (
    <div className="admin-root" style={{ position: 'fixed', inset: 0, display: 'flex', background: 'var(--background)', zIndex: 100, color: 'var(--foreground)' }}>
      {/* Desktop sidebar */}
      <aside
        className="admin-sidebar-desktop"
        style={{
          width: '252px',
          flexShrink: 0,
          background: 'var(--surface)',
          borderRight: '1px solid var(--border)',
          display: 'none',
          flexDirection: 'column',
        }}
      >
        {sidebarContent}
      </aside>

      {/* Mobile sidebar drawer */}
      {sidebarOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 130 }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(2, 6, 16, 0.6)' }} onClick={() => setSidebarOpen(false)} />
          <aside
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: '272px',
              maxWidth: '85vw',
              background: 'var(--surface)',
              borderRight: '1px solid var(--border)',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: 'var(--shadow-lg)',
            }}
          >
            <button
              onClick={() => setSidebarOpen(false)}
              aria-label="Close menu"
              style={{
                position: 'absolute',
                top: 18,
                right: 14,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--foreground-muted)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 32,
                height: 32,
                borderRadius: 8,
              }}
            >
              <X size={20} />
            </button>
            {sidebarContent}
          </aside>
        </div>
      )}

      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Top bar */}
        <header
          style={{
            height: '64px',
            flexShrink: 0,
            background: 'var(--surface)',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 20px',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
            <button
              onClick={() => setSidebarOpen(true)}
              className="admin-menu-button"
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--foreground)', display: 'flex', alignItems: 'center' }}
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--foreground)', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {current ? current.name : 'Admin'}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--foreground-subtle)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} className="admin-header-subtitle">
                Learn. Connect. Build. Grow.
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Link
              href="/notifications"
              aria-label="Notifications"
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--foreground-muted)',
                textDecoration: 'none',
                border: '1px solid transparent',
                transition: 'background 0.12s ease, color 0.12s ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--surface-hover)'; e.currentTarget.style.color = 'var(--foreground)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--foreground-muted)'; }}
            >
              <Bell size={18} />
            </Link>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingLeft: '8px', marginLeft: '4px', borderLeft: '1px solid var(--border)' }}>
              <Avatar src={me.developerProfile?.avatarUrl} name={avatarName} size={36} />
              <div style={{ display: 'none' }} className="admin-header-identity">
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--foreground)', lineHeight: 1.2 }}>{displayName}</div>
                <div style={{ fontSize: '11px', color: 'var(--foreground-muted)' }}>{roleLabel}</div>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main style={{ flex: 1, overflowY: 'auto', padding: '28px 20px 48px' }}>{children}</main>
      </div>

      <style jsx global>{`
        .admin-sidebar-desktop { display: none; }
        @media (min-width: 1024px) {
          .admin-sidebar-desktop { display: flex; }
          .admin-menu-button { display: none; }
          .admin-header-identity { display: block; }
        }
        @media (max-width: 640px) {
          .admin-header-subtitle { display: none; }
        }
      `}</style>
    </div>
  );
}
