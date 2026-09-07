'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { House, Compass, Plus, Bell, UserRound } from 'lucide-react';

export default function MobileBottomNav({ currentPath }: { currentPath: string }) {
  const [unreadCount, setUnreadCount] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    fetch('/api/v1/notifications')
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        if (Array.isArray(data)) {
          const unread = data.filter(n => !n.read).length;
          setUnreadCount(unread);
        }
      })
      .catch(err => console.error(err));
  }, []);

  const navItems = [
    { name: 'Home', path: '/dashboard', icon: House, ariaLabel: 'Home' },
    { name: 'Discover', path: '/developers', icon: Compass, ariaLabel: 'Discover' },
  ];

  const trailingItems = [
    { name: 'Notifications', path: '/notifications', icon: Bell, ariaLabel: 'Notifications', hasBadge: unreadCount > 0 },
    { name: 'Profile', path: '/profile', icon: UserRound, ariaLabel: 'Profile', hasBadge: false },
  ];

  const getIconColor = (path: string) => {
    const isActive = currentPath === path || currentPath.startsWith(path + '/');
    return isActive ? 'var(--primary)' : 'var(--foreground-muted)';
  };

  // Liquid active-pill: 5 equal-width slots (Home, Discover, Create, Notifications, Profile).
  const slotPaths = ['/dashboard', '/developers', '/actions', '/notifications', '/profile'];
  const activeIndex = slotPaths.findIndex(p => currentPath === p || currentPath.startsWith(p + '/'));
  const showPill = activeIndex !== -1 && activeIndex !== 2; // no pill behind the center action button
  const pillIndex = activeIndex === -1 ? 0 : activeIndex;

  return (
    <>
      <nav style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '64px',
        background: 'var(--surface)',
        borderTop: '1px solid var(--border)',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        zIndex: 50,
        paddingBottom: 'env(safe-area-inset-bottom)'
      }}>
        <span
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: '50%',
            left: `${pillIndex * 20 + 10}%`,
            transform: 'translate(-50%, -50%)',
            width: '48px',
            height: '40px',
            background: 'var(--primary-light)',
            borderRadius: 'var(--radius-md)',
            opacity: showPill ? 1 : 0,
            transition: mounted
              ? 'left 0.45s cubic-bezier(0.34, 1.56, 0.64, 1), transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.25s ease'
              : 'none',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />
        {navItems.map(item => (
          <Link key={item.name} href={item.path} aria-label={item.ariaLabel} style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '20%',
            height: '100%',
            textDecoration: 'none',
            color: getIconColor(item.path),
            position: 'relative',
            zIndex: 1
          }}>
            <item.icon size={26} strokeWidth={2} />
          </Link>
        ))}

        <Link 
          href="/actions"
          aria-label="Create"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '20%',
            height: '100%',
            textDecoration: 'none',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <div style={{
            background: 'var(--primary)',
            color: '#fff',
            width: '40px',
            height: '32px',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Plus size={24} strokeWidth={2.5} />
          </div>
        </Link>

        {trailingItems.map(item => (
          <Link key={item.name} href={item.path} aria-label={item.ariaLabel} style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '20%',
            height: '100%',
            textDecoration: 'none',
            color: getIconColor(item.path),
            position: 'relative',
            zIndex: 1
          }}>
            <item.icon size={26} strokeWidth={2} />
            {item.hasBadge && (
              <span style={{
                position: 'absolute',
                top: '14px',
                right: 'calc(50% - 14px)',
                width: '10px',
                height: '10px',
                background: 'var(--primary)',
                border: '2px solid var(--surface)',
                borderRadius: '50%'
              }} />
            )}
          </Link>
        ))}
      </nav>
    </>
  );
}
