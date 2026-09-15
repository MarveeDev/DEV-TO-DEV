'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const TABS = [
  { name: 'Posts', href: '/admin/content/posts' },
  { name: 'Questions', href: '/admin/content/questions' },
  { name: 'Projects', href: '/admin/content/projects' },
];

export default function ContentTabs() {
  const pathname = usePathname();
  return (
    <div
      style={{
        display: 'inline-flex',
        gap: '4px',
        padding: '4px',
        borderRadius: 12,
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        marginBottom: '24px',
        flexWrap: 'wrap',
      }}
    >
      {TABS.map((t) => {
        const active = pathname === t.href;
        return (
          <Link
            key={t.href}
            href={t.href}
            style={{
              padding: '8px 16px',
              borderRadius: 9,
              color: active ? '#ffffff' : 'var(--foreground-muted)',
              background: active ? 'var(--primary)' : 'transparent',
              fontWeight: 600,
              fontSize: '13px',
              textDecoration: 'none',
              transition: 'background 0.12s ease, color 0.12s ease',
            }}
          >
            {t.name}
          </Link>
        );
      })}
    </div>
  );
}
