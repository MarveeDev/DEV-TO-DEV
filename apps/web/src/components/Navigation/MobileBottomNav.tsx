'use client';

import React from 'react';
import Link from 'next/link';
import { House, Compass, Plus, Clapperboard, UserRound } from 'lucide-react';

export default function MobileBottomNav({ currentPath }: { currentPath: string }) {
  const items = [
    { name: 'Home', path: '/dashboard', icon: House },
    { name: 'Discover', path: '/developers', icon: Compass },
    { name: 'Create', path: '/actions', icon: Plus, isCreate: true },
    { name: 'CODE', path: '/code', icon: Clapperboard },
    { name: 'Profile', path: '/profile', icon: UserRound },
  ];

  const isActive = (path: string) => currentPath === path || currentPath.startsWith(path + '/');

  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: 'var(--bottom-nav-height)',
        background: 'var(--surface)',
        borderTop: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'stretch',
        zIndex: 50,
        paddingBottom: 'env(safe-area-inset-bottom)',
        boxShadow: '0 -1px 8px rgba(16, 24, 40, 0.04)',
      }}
      aria-label="Primary"
    >
      {items.map((item) => {
        const active = isActive(item.path);
        const Icon = item.icon;

        if (item.isCreate) {
          return (
            <Link
              key={item.name}
              href={item.path}
              aria-label="Create"
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textDecoration: 'none',
              }}
            >
              <span
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--primary)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(37, 99, 235, 0.32)',
                  transform: 'translateY(-8px)',
                }}
              >
                <Icon size={24} strokeWidth={2.4} />
              </span>
            </Link>
          );
        }

        return (
          <Link
            key={item.name}
            href={item.path}
            aria-label={item.name}
            aria-current={active ? 'page' : undefined}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 3,
              textDecoration: 'none',
              color: active ? 'var(--primary)' : 'var(--foreground-subtle)',
            }}
          >
            <Icon size={22} strokeWidth={active ? 2.4 : 2} />
            <span style={{ fontSize: 11, fontWeight: active ? 700 : 500, lineHeight: 1 }}>
              {item.name}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
