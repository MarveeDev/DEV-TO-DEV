'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { House, Compass, Plus, Bell, UserRound } from 'lucide-react';
import MobileCreatePopover from './MobileCreatePopover';

export default function MobileBottomNav({ currentPath }: { currentPath: string }) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

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
        {navItems.map(item => (
          <Link key={item.name} href={item.path} aria-label={item.ariaLabel} style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '20%',
            height: '100%',
            textDecoration: 'none',
            color: getIconColor(item.path)
          }}>
            <item.icon size={26} strokeWidth={2} />
          </Link>
        ))}

        <button 
          onClick={() => setIsCreateOpen(!isCreateOpen)}
          aria-label="Create"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '20%',
            height: '100%',
            border: 'none',
            background: 'transparent',
            cursor: 'pointer'
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
        </button>

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
            position: 'relative'
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

      {isCreateOpen && (
        <MobileCreatePopover onClose={() => setIsCreateOpen(false)} />
      )}
    </>
  );
}
