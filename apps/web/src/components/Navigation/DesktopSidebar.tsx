'use client';

import React from 'react';
import Link from 'next/link';
import {
  House,
  Compass,
  Folder,
  CircleHelp,
  MessageSquare,
  Bell,
  User,
  Settings,
  Store,
  LogOut,
  Map,
  Clapperboard,
} from 'lucide-react';

interface DesktopSidebarProps {
  currentPath: string;
  onLogout: () => void;
  unreadCount?: number;
}

export default function DesktopSidebar({ currentPath, onLogout, unreadCount = 0 }: DesktopSidebarProps) {
  const navItems = [
    { name: 'Home', path: '/dashboard', icon: House },
    { name: 'CODE', path: '/code', icon: Clapperboard },
    { name: 'Discover', path: '/developers', icon: Compass },
    { name: 'Marketplace', path: '/marketplace', icon: Store },
    { name: 'Roadmaps', path: '/roadmaps', icon: Map },
    { name: 'Projects', path: '/projects', icon: Folder },
    { name: 'Questions', path: '/questions', icon: CircleHelp },
    { name: 'Messages', path: '/messages', icon: MessageSquare },
    { name: 'Notifications', path: '/notifications', icon: Bell, badge: unreadCount },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  const isActive = (path: string) => currentPath === path || currentPath.startsWith(path + '/');

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        width: 'var(--sidebar-width)',
        background: 'var(--surface)',
        borderRight: '1px solid var(--border)',
        zIndex: 60,
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
        overflowY: 'auto',
      }}
    >
      {/* Brand */}
      <div
        style={{
          height: 'var(--header-height)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '0 20px',
          borderBottom: '1px solid var(--border)',
          flexShrink: 0,
        }}
      >
        <img src="/logo.png" alt="DEV-TO-DEV Logo" style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
        <span style={{ fontWeight: 800, fontSize: '16px', letterSpacing: '-0.02em', color: 'var(--foreground)' }}>
          DEV-TO-DEV
        </span>
      </div>

      {/* Navigation */}
      <div style={{ flex: 1, padding: '16px 12px' }}>
        {navItems.map((item) => {
          const active = isActive(item.path);
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.path}
              aria-current={active ? 'page' : undefined}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                marginBottom: '2px',
                color: active ? 'var(--primary)' : 'var(--foreground-muted)',
                background: active ? 'var(--primary-light)' : 'transparent',
                fontWeight: active ? 600 : 500,
                fontSize: '14px',
                transition: 'background 0.15s ease, color 0.15s ease',
                position: 'relative',
              }}
              onMouseEnter={(e) => {
                if (!active) e.currentTarget.style.background = 'var(--surface-hover)';
              }}
              onMouseLeave={(e) => {
                if (!active) e.currentTarget.style.background = 'transparent';
              }}
            >
              <Icon size={20} strokeWidth={active ? 2.2 : 2} />
              <span style={{ flex: 1 }}>{item.name}</span>
              {item.badge ? (
                <span
                  style={{
                    minWidth: 20,
                    height: 20,
                    padding: '0 6px',
                    borderRadius: 'var(--radius-full)',
                    background: 'var(--primary)',
                    color: '#fff',
                    fontSize: 12,
                    fontWeight: 700,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {item.badge > 99 ? '99+' : item.badge}
                </span>
              ) : null}
            </Link>
          );
        })}
      </div>

      {/* Footer */}
      <div style={{ padding: '12px', borderTop: '1px solid var(--border)', flexShrink: 0 }}>
        <Link
          href="/settings"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '10px 14px',
            borderRadius: 'var(--radius-md)',
            color: isActive('/settings') ? 'var(--primary)' : 'var(--foreground-muted)',
            background: isActive('/settings') ? 'var(--primary-light)' : 'transparent',
            fontWeight: isActive('/settings') ? 600 : 500,
            fontSize: '14px',
          }}
        >
          <Settings size={20} />
          <span>Settings</span>
        </Link>
        <button
          onClick={onLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            width: '100%',
            padding: '10px 14px',
            borderRadius: 'var(--radius-md)',
            color: 'var(--foreground-muted)',
            background: 'transparent',
            border: 'none',
            fontWeight: 500,
            fontSize: '14px',
            cursor: 'pointer',
            textAlign: 'left',
          }}
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </nav>
  );
}
