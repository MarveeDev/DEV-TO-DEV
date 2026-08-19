'use client';

import React from 'react';
import Link from 'next/link';

interface DesktopHeaderProps {
  isAuthenticated: boolean;
  loading: boolean;
  onLogout: () => void;
}

export default function DesktopHeader({ isAuthenticated, loading, onLogout }: DesktopHeaderProps) {
  return (
    <header style={{
      position: 'fixed',
      top: 0,
      left: isAuthenticated ? 'var(--sidebar-width)' : 0,
      right: 0,
      height: '64px',
      background: 'var(--surface)',
      borderBottom: '1px solid var(--border)',
      boxShadow: 'var(--shadow-sm)',
      zIndex: 50,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      boxSizing: 'border-box'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
        <Link href={isAuthenticated ? '/dashboard' : '/'} style={{ fontWeight: 800, color: 'var(--primary)', letterSpacing: '0.5px', textDecoration: 'none', fontSize: '18px' }}>
          DEV-TO-DEV
        </Link>
        {isAuthenticated && (
          <div style={{
            background: 'var(--background)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: '8px 16px',
            display: 'flex',
            alignItems: 'center',
            width: '300px',
            color: 'var(--foreground-muted)'
          }}>
            <span style={{ fontSize: '14px' }}>Search developers, projects...</span>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        {!loading && (
          isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--border)' }}></div>
            </div>
          ) : (
            <Link href="/login" style={{ background: 'var(--primary)', color: '#ffffff', padding: '8px 16px', borderRadius: 'var(--radius-md)', textDecoration: 'none', fontWeight: 600, fontSize: '14px' }}>
              Login
            </Link>
          )
        )}
      </div>
    </header>
  );
}
