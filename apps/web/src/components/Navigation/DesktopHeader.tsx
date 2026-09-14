'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Bell, Settings } from 'lucide-react';
import Avatar from '../Avatar';
import SearchBar from '../SearchBar';
import { useCurrentUser } from '../Auth/CurrentUserProvider';

interface DesktopHeaderProps {
  isAuthenticated: boolean;
  loading: boolean;
  unreadCount?: number;
}

export default function DesktopHeader({ isAuthenticated, loading, unreadCount = 0 }: DesktopHeaderProps) {
  const router = useRouter();
  const { user } = useCurrentUser();
  const profile = user?.developerProfile;
  const [query, setQuery] = useState('');

  const handleSearch = (value: string) => {
    const q = value.trim();
    router.push(q ? `/search?q=${encodeURIComponent(q)}` : '/search');
  };

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: isAuthenticated ? 'var(--sidebar-width)' : 0,
        right: 0,
        height: 'var(--header-height)',
        background: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        boxSizing: 'border-box',
        gap: '16px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1, minWidth: 0 }}>
        {isAuthenticated && (
          <SearchBar
            value={query}
            onChange={setQuery}
            onSubmit={handleSearch}
            placeholder="Search developers, projects, questions..."
            style={{ width: 360, maxWidth: '100%' }}
            inputStyle={{ background: 'var(--background)', border: 'none' }}
          />
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {!loading && isAuthenticated ? (
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
              <Bell size={20} />
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
              <Settings size={20} />
            </Link>
            <Link href="/profile" aria-label="Profile" style={{ display: 'flex', marginLeft: 4 }}>
              <Avatar
                src={profile?.avatarUrl}
                name={profile?.displayName}
                size={36}
              />
            </Link>
          </>
        ) : (
          <Link
            href="/login"
            className="btn btn--primary btn--md"
          >
            Login
          </Link>
        )}
      </div>
    </header>
  );
}
