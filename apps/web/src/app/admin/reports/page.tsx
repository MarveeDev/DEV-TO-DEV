'use client';

import { useEffect, useState } from 'react';
import { Badge, Table, Td, Pagination, EmptyState, SelectInput } from '../../../components/admin/AdminUi';
import { formatPrice } from '../../../lib/currency';

const STATUSES = ['PENDING', 'REVIEWING', 'RESOLVED', 'DISMISSED'];

function formatDate(v: string) {
  if (!v) return '—';
  return new Date(v).toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function AdminReportsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [meta, setMeta] = useState<any>({ page: 1, totalPages: 1 });
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: '20' });
    if (status) params.append('status', status);
    fetch(`/api/v1/admin/marketplace/reports?${params.toString()}`)
      .then((res) => (res.ok ? res.json() : { items: [], meta: {} }))
      .then((data) => {
        setItems(data.items || []);
        setMeta(data.meta || {});
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [page, status]);

  const updateStatus = async (id: string, newStatus: string) => {
    const res = await fetch(`/api/v1/admin/marketplace/reports/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });
    if (res.ok) {
      setItems((prev) => prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r)));
    } else {
      const err = await res.json().catch(() => ({}));
      alert(err.message || 'Failed to update status');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <SelectInput
          value={status}
          onChange={setStatus}
          options={[
            { value: '', label: 'All statuses' },
            ...STATUSES.map((s) => ({ value: s, label: s })),
          ]}
        />
      </div>

      {loading ? (
        <EmptyState message="Loading reports..." />
      ) : items.length === 0 ? (
        <EmptyState message="No reports found." />
      ) : (
        <>
          <Table headers={['Listing', 'Reason', 'Reporter', 'Description', 'Status', 'Reported']}>
            {items.map((r) => (
              <tr key={r.id}>
                <Td>
                  <div style={{ fontWeight: 600 }}>{r.listing?.title || '—'}</div>
                  <div style={{ fontSize: '12px', color: 'var(--foreground-muted)' }}>
                    {r.listing ? formatPrice(r.listing.price, r.listing.currency) : ''}
                  </div>
                </Td>
                <Td>{r.reason}</Td>
                <Td>{r.reporter?.developerProfile?.displayName || r.reporter?.email || '—'}</Td>
                <Td style={{ maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {r.description || '—'}
                </Td>
                <Td>
                  <select
                    value={r.status}
                    onChange={(e) => updateStatus(r.id, e.target.value)}
                    style={{ padding: '4px 8px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--foreground)', fontSize: '13px' }}
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </Td>
                <Td>{formatDate(r.createdAt)}</Td>
              </tr>
            ))}
          </Table>
          <Pagination page={meta.page || 1} totalPages={meta.totalPages || 1} onChange={setPage} />
        </>
      )}
    </div>
  );
}
