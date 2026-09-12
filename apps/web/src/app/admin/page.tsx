'use client';

import { useEffect, useState } from 'react';
import { StatCard, Badge, Table, Td, EmptyState } from '../../components/admin/AdminUi';
import { formatPrice } from '../../lib/currency';

function formatDate(v: string) {
  if (!v) return '—';
  return new Date(v).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

export default function AdminOverviewPage() {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/v1/admin/overview')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load overview');
        return res.json();
      })
      .then(setData)
      .catch((e) => setError(e.message));
  }, []);

  if (error) return <EmptyState message={error} />;
  if (!data) return <EmptyState message="Loading..." />;

  const { stats, recentUsers, recentListings, recentReports } = data;

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        <StatCard label="Total Users" value={stats.totalUsers} />
        <StatCard label="Marketplace Listings" value={stats.totalListings} />
        <StatCard label="Pending Reports" value={stats.pendingReports} />
        <StatCard label="Posts" value={stats.totalPosts} />
        <StatCard label="Questions" value={stats.totalQuestions} />
        <StatCard label="Projects" value={stats.totalProjects} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
        <section>
          <h2 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--foreground)', marginBottom: '12px' }}>Recent Users</h2>
          <Table headers={['Name', 'Email', 'Role', 'Joined']}>
            {recentUsers.length === 0 ? (
              <tr><Td>No users yet.</Td></tr>
            ) : (
              recentUsers.map((u: any) => (
                <tr key={u.id}>
                  <Td>{u.developerProfile?.displayName || u.email || '—'}</Td>
                  <Td>{u.email}</Td>
                  <Td><Badge value={u.role} /></Td>
                  <Td>{formatDate(u.createdAt)}</Td>
                </tr>
              ))
            )}
          </Table>
        </section>

        <section>
          <h2 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--foreground)', marginBottom: '12px' }}>Recent Listings</h2>
          <Table headers={['Title', 'Seller', 'Price', 'Created']}>
            {recentListings.length === 0 ? (
              <tr><Td>No listings yet.</Td></tr>
            ) : (
              recentListings.map((l: any) => (
                <tr key={l.id}>
                  <Td>{l.title}</Td>
                  <Td>{l.seller?.displayName || '—'}</Td>
                  <Td>{formatPrice(l.price, l.currency)}</Td>
                  <Td>{formatDate(l.createdAt)}</Td>
                </tr>
              ))
            )}
          </Table>
        </section>

        <section>
          <h2 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--foreground)', marginBottom: '12px' }}>Recent Reports</h2>
          <Table headers={['Listing', 'Reason', 'Status', 'Reported']}>
            {recentReports.length === 0 ? (
              <tr><Td>No reports yet.</Td></tr>
            ) : (
              recentReports.map((r: any) => (
                <tr key={r.id}>
                  <Td>{r.listing?.title || '—'}</Td>
                  <Td>{r.reason}</Td>
                  <Td><Badge value={r.status} /></Td>
                  <Td>{formatDate(r.createdAt)}</Td>
                </tr>
              ))
            )}
          </Table>
        </section>
      </div>
    </div>
  );
}
