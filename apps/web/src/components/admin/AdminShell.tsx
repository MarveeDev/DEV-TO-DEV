'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Store,
  Flag,
  FileText,
  AlertTriangle,
  ScrollText,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react';

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
  adminOnly?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { name: 'Overview', href: '/admin', icon: LayoutDashboard },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Marketplace', href: '/admin/marketplace', icon: Store },
  { name: 'Reports', href: '/admin/reports', icon: Flag },
  { name: 'Content', href: '/admin/content', icon: FileText },
  { name: 'Violations', href: '/admin/violations', icon: AlertTriangle },
  { name: 'Audit Logs', href: '/admin/audit-logs', icon: ScrollText, adminOnly: true },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [me, setMe] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetch('/api/v1/auth/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        setMe(data);
        setLoading(false);
      })
      .catch(() => {
        setMe(null);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (loading) return;
    if (!me) {
      router.replace('/login');
    }
  }, [loading, me, router]);

  const handleLogout = async () => {
    await fetch('/api/v1/auth/logout', { method: 'POST' });
    router.replace('/login');
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--foreground-muted)' }}>
        Loading admin dashboard...
      </div>
    );
  }

  if (!me) return null;

  if (me.role !== 'ADMIN' && me.role !== 'MODERATOR') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', textAlign: 'center' }}>
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

  const sidebar = (
    <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', padding: '16px 12px', flex: 1, overflowY: 'auto' }}>
      {visibleItems.map((item) => {
        const active = pathname === item.href || pathname.startsWith(item.href + '/');
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setSidebarOpen(false)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '10px 12px',
              borderRadius: 'var(--radius-md)',
              color: active ? 'var(--primary)' : 'var(--foreground)',
              background: active ? 'var(--primary-light)' : 'transparent',
              fontWeight: active ? 600 : 500,
              fontSize: '14px',
              textDecoration: 'none',
            }}
          >
            <Icon size={18} strokeWidth={2} />
            {item.name}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div style={{ position: 'fixed', inset: 0, display: 'flex', background: 'var(--background)', zIndex: 100 }}>
      {/* Desktop sidebar */}
      <aside
        style={{
          width: '240px',
          flexShrink: 0,
          background: 'var(--surface)',
          borderRight: '1px solid var(--border)',
          display: 'none',
          flexDirection: 'column',
        }}
        className="admin-sidebar-desktop"
      >
        <div style={{ padding: '20px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src="/logo.png" alt="DEV-TO-DEV" style={{ height: '28px', width: 'auto', objectFit: 'contain' }} />
          <span style={{ fontWeight: 800, color: 'var(--foreground)', fontSize: '14px' }}>Admin</span>
        </div>
        {sidebar}
      </aside>

      {/* Mobile sidebar drawer */}
      {sidebarOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 130 }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)' }} onClick={() => setSidebarOpen(false)} />
          <aside
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: '260px',
              background: 'var(--surface)',
              borderRight: '1px solid var(--border)',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div style={{ padding: '16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <img src="/logo.png" alt="DEV-TO-DEV" style={{ height: '24px', width: 'auto' }} />
                <span style={{ fontWeight: 800, color: 'var(--foreground)', fontSize: '14px' }}>Admin</span>
              </div>
              <button onClick={() => setSidebarOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--foreground)' }}>
                <X size={20} />
              </button>
            </div>
            {sidebar}
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
            <h1 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--foreground)', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {current ? current.name : 'Admin'}
            </h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontSize: '13px', color: 'var(--foreground-muted)', display: 'none' }} className="admin-identity">
              {me.email}
            </span>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                padding: '4px 8px',
                borderRadius: '999px',
                background: isAdmin ? 'var(--primary-light)' : 'var(--border)',
                color: isAdmin ? 'var(--primary)' : 'var(--foreground-muted)',
              }}
            >
              {me.role}
            </span>
            <button
              onClick={handleLogout}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--foreground-muted)', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 600 }}
            >
              <LogOut size={16} />
              <span style={{ display: 'none' }} className="admin-logout-label">Logout</span>
            </button>
          </div>
        </header>

        {/* Content */}
        <main style={{ flex: 1, overflowY: 'auto', padding: '24px 20px 40px' }}>{children}</main>
      </div>

      <style jsx global>{`
        .admin-sidebar-desktop { display: none; }
        @media (min-width: 1024px) {
          .admin-sidebar-desktop { display: flex; }
          .admin-menu-button { display: none; }
          .admin-identity, .admin-logout-label { display: inline; }
        }
      `}</style>
    </div>
  );
}
