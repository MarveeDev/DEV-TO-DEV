'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Users, Store, Flag, FileText, HelpCircle, FolderKanban, ArrowUpRight, BellRing } from 'lucide-react';
import { StatCard, Badge, Table, Td, EmptyState, TableSkeleton } from '../../components/admin/AdminUi';
import Avatar from '../../components/Avatar';
import { useCurrentUser } from '../../components/Auth/CurrentUserProvider';
import { formatPrice } from '../../lib/currency';

function formatDate(v: string) {
  if (!v) return '—';
  return new Date(v).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function formatDateTime(v: string) {
  if (!v) return '—';
  return new Date(v).toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

const DONUT_COLORS: Record<string, string> = {
  Posts: '#3b82f6',
  Questions: '#8b7cf6',
  Projects: '#34d399',
  Listings: '#f59e0b',
};

function Donut({ segments }: { segments: { label: string; value: number }[] }) {
  const total = segments.reduce((s, x) => s + x.value, 0);
  const size = 168;
  const stroke = 18;
  const r = (size - stroke) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const C = 2 * Math.PI * r;

  let acc = 0;

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} style={{ overflow: 'visible' }}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--surface-muted)" strokeWidth={stroke} />
        {total > 0 &&
          segments.map((s) => {
            const frac = s.value / total;
            const dash = frac * C;
            const seg = (
              <circle
                key={s.label}
                cx={cx}
                cy={cy}
                r={r}
                fill="none"
                stroke={DONUT_COLORS[s.label] || '#94a3b8'}
                strokeWidth={stroke}
                strokeDasharray={`${dash} ${C}`}
                strokeDashoffset={-acc}
                transform={`rotate(-90 ${cx} ${cy})`}
              />
            );
            acc += dash;
            return seg;
          })}
        <text x={cx} y={cy - 2} textAnchor="middle" fill="var(--foreground)" fontSize="26" fontWeight={800}>
          {total.toLocaleString()}
        </text>
        <text x={cx} y={cy + 18} textAnchor="middle" fill="var(--foreground-muted)" fontSize="11" fontWeight={600} letterSpacing="0.04em">
          TOTAL
        </text>
      </svg>
    </div>
  );
}

export default function AdminOverviewPage() {
  const { user } = useCurrentUser();
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState('');
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    fetch('/api/v1/admin/overview')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load overview');
        return res.json();
      })
      .then(setData)
      .catch((e) => setError(e.message));
  }, []);

  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(t);
  }, []);

  const segments = useMemo(() => {
    if (!data) return [];
    const s = data.stats;
    return [
      { label: 'Posts', value: s.totalPosts || 0 },
      { label: 'Questions', value: s.totalQuestions || 0 },
      { label: 'Projects', value: s.totalProjects || 0 },
      { label: 'Listings', value: s.totalListings || 0 },
    ];
  }, [data]);

  if (error) return <EmptyState message={error} icon={BellRing} />;
  if (!data) {
    return (
      <div style={{ display: 'grid', gap: '20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px' }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: 18, height: 110 }} />
          ))}
        </div>
        <TableSkeleton rows={5} columns={4} />
      </div>
    );
  }

  const { stats, recentUsers, recentListings, recentReports } = data;
  const firstName = (user?.developerProfile?.displayName || user?.email || 'Admin').split(' ')[0];

  return (
    <div>
      {/* Welcome header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          gap: '16px',
          flexWrap: 'wrap',
          padding: '24px',
          marginBottom: '24px',
          borderRadius: 16,
          background: 'linear-gradient(135deg, var(--surface) 0%, var(--surface-muted) 100%)',
          border: '1px solid var(--border)',
        }}
      >
        <div style={{ minWidth: 0 }}>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--foreground)', letterSpacing: '-0.02em', margin: 0 }}>
            Welcome back, {firstName}
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--foreground-muted)', margin: '6px 0 0' }}>
            Here&apos;s what&apos;s happening on DEV-TO-DEV today.
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' }}>
          {now && (
            <span style={{ fontSize: '13px', color: 'var(--foreground-muted)', fontVariantNumeric: 'tabular-nums' }}>
              {now.toLocaleString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
          <Link
            href="/admin/reports"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '9px 16px',
              borderRadius: 10,
              background: 'var(--primary)',
              color: '#ffffff',
              fontSize: '13px',
              fontWeight: 700,
              textDecoration: 'none',
              transition: 'background 0.12s ease',
            }}
          >
            Review Reports
            <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <StatCard label="Total Users" value={stats.totalUsers} icon={Users} tone="blue" />
        <StatCard label="Marketplace Listings" value={stats.totalListings} icon={Store} tone="purple" />
        <StatCard label="Pending Reports" value={stats.pendingReports} icon={Flag} tone="amber" />
        <StatCard label="Posts" value={stats.totalPosts} icon={FileText} tone="green" />
        <StatCard label="Questions" value={stats.totalQuestions} icon={HelpCircle} tone="slate" />
        <StatCard label="Projects" value={stats.totalProjects} icon={FolderKanban} tone="purple" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px', marginBottom: '24px' }}>
        {/* Recent Users */}
        <section>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', gap: '12px' }}>
            <h2 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--foreground)', margin: 0 }}>Recent Users</h2>
            <Link href="/admin/users" style={{ fontSize: '13px', fontWeight: 600, color: 'var(--primary)', textDecoration: 'none' }}>
              View all
            </Link>
          </div>
          <Table headers={['User', 'Role', 'Status', 'Joined']}>
            {recentUsers.length === 0 ? (
              <tr>
                <Td colSpan={4}>No users yet.</Td>
              </tr>
            ) : (
              recentUsers.map((u: any) => (
                <tr key={u.id}>
                  <Td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <Avatar src={u.developerProfile?.avatarUrl} name={u.developerProfile?.displayName || u.email} size={36} />
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontWeight: 600, color: 'var(--foreground)' }}>{u.developerProfile?.displayName || '—'}</div>
                        <div style={{ fontSize: '12px', color: 'var(--foreground-muted)' }}>
                          {u.developerProfile?.username ? `@${u.developerProfile.username}` : u.email}
                        </div>
                      </div>
                    </div>
                  </Td>
                  <Td>
                    <Badge value={u.role} />
                  </Td>
                  <Td>
                    <Badge value={u.status} />
                  </Td>
                  <Td>{formatDate(u.createdAt)}</Td>
                </tr>
              ))
            )}
          </Table>
        </section>

        {/* Platform breakdown */}
        <section>
          <h2 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--foreground)', margin: '0 0 12px' }}>Platform Content</h2>
          <div
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 14,
              padding: '24px',
              boxShadow: 'var(--shadow-sm)',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
            }}
          >
            {segments.every((s) => s.value === 0) ? (
              <EmptyState message="No content data available yet." />
            ) : (
              <>
                <Donut segments={segments} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {segments.map((s) => (
                    <div key={s.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ width: 10, height: 10, borderRadius: 3, background: DONUT_COLORS[s.label], flexShrink: 0 }} />
                        <span style={{ fontSize: '13px', color: 'var(--foreground-muted)' }}>{s.label}</span>
                      </div>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--foreground)', fontVariantNumeric: 'tabular-nums' }}>
                        {s.value.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </section>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
        {/* Recent Reports */}
        <section>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', gap: '12px' }}>
            <h2 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--foreground)', margin: 0 }}>Recent Reports</h2>
            <Link href="/admin/reports" style={{ fontSize: '13px', fontWeight: 600, color: 'var(--primary)', textDecoration: 'none' }}>
              View all
            </Link>
          </div>
          <Table headers={['Reason', 'Subject', 'Reported By', 'Status', 'Date']}>
            {recentReports.length === 0 ? (
              <tr>
                <Td colSpan={5}>No reports yet.</Td>
              </tr>
            ) : (
              recentReports.map((r: any) => (
                <tr key={r.id}>
                  <Td style={{ fontSize: '13px' }}>{r.reason}</Td>
                  <Td>
                    <div style={{ fontWeight: 600 }}>{r.listing?.title || '—'}</div>
                  </Td>
                  <Td style={{ fontSize: '13px', color: 'var(--foreground-muted)' }}>{r.reporter?.email || '—'}</Td>
                  <Td>
                    <Badge value={r.status} />
                  </Td>
                  <Td style={{ fontSize: '13px', color: 'var(--foreground-muted)' }}>{formatDateTime(r.createdAt)}</Td>
                </tr>
              ))
            )}
          </Table>
        </section>

        {/* Recent Listings */}
        <section>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', gap: '12px' }}>
            <h2 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--foreground)', margin: 0 }}>Recent Listings</h2>
            <Link href="/admin/marketplace" style={{ fontSize: '13px', fontWeight: 600, color: 'var(--primary)', textDecoration: 'none' }}>
              View all
            </Link>
          </div>
          <Table headers={['Title', 'Seller', 'Price', 'Created']}>
            {recentListings.length === 0 ? (
              <tr>
                <Td colSpan={4}>No listings yet.</Td>
              </tr>
            ) : (
              recentListings.map((l: any) => (
                <tr key={l.id}>
                  <Td>
                    <div style={{ fontWeight: 600 }}>{l.title}</div>
                  </Td>
                  <Td style={{ fontSize: '13px', color: 'var(--foreground-muted)' }}>{l.seller?.displayName || '—'}</Td>
                  <Td>{formatPrice(l.price, l.currency)}</Td>
                  <Td style={{ fontSize: '13px', color: 'var(--foreground-muted)' }}>{formatDate(l.createdAt)}</Td>
                </tr>
              ))
            )}
          </Table>
        </section>
      </div>
    </div>
  );
}
