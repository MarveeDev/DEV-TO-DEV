'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Badge, Table, Td, Pagination, EmptyState, PageHeader, TableSkeleton } from '../../../components/admin/AdminUi';

function formatDate(v: string) {
  if (!v) return '—';
  return new Date(v).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

export default function AdminSmsCampaignsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [meta, setMeta] = useState<any>({ page: 1, totalPages: 1 });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: '20' });
    fetch(`/api/v1/admin/sms-campaigns?${params.toString()}`)
      .then((res) => (res.ok ? res.json() : { items: [], meta: {} }))
      .then((data) => {
        setItems(data.items || []);
        setMeta(data.meta || {});
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [page]);

  const deleteCampaign = async (id: string) => {
    if (!window.confirm('Delete this campaign? This cannot be undone.')) return;
    const res = await fetch(`/api/v1/admin/sms-campaigns/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setItems((prev) => prev.filter((c) => c.id !== id));
    } else {
      const err = await res.json().catch(() => ({}));
      alert(err.message || 'Failed to delete campaign');
    }
  };

  return (
    <div>
      <PageHeader
        title="SMS Campaigns"
        description="Create and manage permission-based SMS campaigns."
        actions={
          <Link
            href="/admin/sms-campaigns/new"
            style={{
              padding: '9px 16px',
              borderRadius: 10,
              background: 'var(--primary)',
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            Create Campaign
          </Link>
        }
      />

      {loading ? (
        <TableSkeleton rows={5} columns={7} />
      ) : items.length === 0 ? (
        <EmptyState message="No SMS campaigns yet. Create your first campaign." />
      ) : (
        <>
          <Table headers={['Name', 'Status', 'Recipients', 'Sent', 'Failed', 'Created', 'Actions']}>
            {items.map((c) => (
              <tr key={c.id}>
                <Td style={{ fontWeight: 600 }}>{c.name}</Td>
                <Td><Badge value={c.status} /></Td>
                <Td>{c.recipientCount ?? 0}</Td>
                <Td>{c.sentCount ?? 0}</Td>
                <Td>{c.failedCount ?? 0}</Td>
                <Td>{formatDate(c.createdAt)}</Td>
                <Td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Link href={`/admin/sms-campaigns/${c.id}`} style={{ color: 'var(--primary)', fontSize: '13px', fontWeight: 600, textDecoration: 'none' }}>
                      View
                    </Link>
                    <Link href={`/admin/sms-campaigns/${c.id}/edit`} style={{ color: 'var(--primary)', fontSize: '13px', fontWeight: 600, textDecoration: 'none' }}>
                      Edit
                    </Link>
                    <button
                      onClick={() => deleteCampaign(c.id)}
                      style={{ background: 'none', border: 'none', color: 'var(--danger)', fontSize: '13px', fontWeight: 600, cursor: 'pointer', padding: 0 }}
                    >
                      Delete
                    </button>
                  </div>
                </Td>
              </tr>
            ))}
          </Table>
          <Pagination page={meta.page || 1} totalPages={meta.totalPages || 1} onChange={setPage} />
        </>
      )}
    </div>
  );
}
