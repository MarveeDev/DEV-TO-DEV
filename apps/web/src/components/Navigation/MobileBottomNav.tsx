'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { House, Compass, Plus, Store, UserRound } from 'lucide-react';

export default function MobileBottomNav({ currentPath }: { currentPath: string }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const navItems = [
    { name: 'Home', path: '/dashboard', icon: House, ariaLabel: 'Home' },
    { name: 'Discover', path: '/developers', icon: Compass, ariaLabel: 'Discover' },
  ];

  const trailingItems = [
    { name: 'Marketplace', path: '/marketplace', icon: Store, ariaLabel: 'Marketplace' },
    { name: 'Profile', path: '/profile', icon: UserRound, ariaLabel: 'Profile' },
  ];

  const getIconColor = (path: string) => {
    const isActive = currentPath === path || currentPath.startsWith(path + '/');
    return isActive ? 'var(--primary)' : 'var(--foreground-muted)';
  };

  // Liquid active-pill: 5 equal-width slots (Home, Discover, Create, Marketplace, Profile).
  const slotPaths = ['/dashboard', '/developers', '/actions', '/marketplace', '/profile'];
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
          </Link>
        ))}
      </nav>
    </>
  );
}
