'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function DiscoverTabs() {
  const pathname = usePathname();

  const getStyle = (path: string) => {
    const isActive = pathname === path || (pathname.startsWith(path) && path !== '/developers' && path !== '/projects' && path !== '/network' && path !== '/questions');
    // strict match for these base routes
    const isStrictActive = pathname === path;
    
    if (isStrictActive) {
      return { textDecoration: 'none', padding: '8px 16px', background: 'var(--foreground)', color: 'var(--surface)', borderRadius: 'var(--radius-sm)', fontWeight: 600, fontSize: '14px', whiteSpace: 'nowrap' as any };
    }
    return { textDecoration: 'none', padding: '8px 16px', background: 'transparent', border: '1px solid var(--border)', color: 'var(--foreground-muted)', borderRadius: 'var(--radius-sm)', fontWeight: 600, fontSize: '14px', whiteSpace: 'nowrap' as any };
  };

  return (
    <div style={{ display: 'flex', gap: '8px', marginBottom: '32px', overflowX: 'auto', paddingBottom: '4px', WebkitOverflowScrolling: 'touch' }}>
      <Link href="/developers" style={getStyle('/developers')}>Developers</Link>
      <Link href="/projects" style={getStyle('/projects')}>Projects</Link>
      <Link href="/network" style={getStyle('/network')}>Network</Link>
      <Link href="/questions" style={getStyle('/questions')}>Questions</Link>
      <Link href="/roadmaps" style={getStyle('/roadmaps')}>Roadmaps</Link>
    </div>
  );
}
