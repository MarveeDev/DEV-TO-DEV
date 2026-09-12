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
    <div style={{ display: 'flex', gap: '4px', borderBottom: '1px solid var(--border)', marginBottom: '20px', flexWrap: 'wrap' }}>
      {TABS.map((t) => {
        const active = pathname === t.href;
        return (
          <Link
            key={t.href}
            href={t.href}
            style={{
              padding: '10px 16px',
              color: active ? 'var(--primary)' : 'var(--foreground-muted)',
              borderBottom: `2px solid ${active ? 'var(--primary)' : 'transparent'}`,
              fontWeight: active ? 600 : 500,
              fontSize: '14px',
              textDecoration: 'none',
            }}
          >
            {t.name}
          </Link>
        );
      })}
    </div>
  );
}
