'use client';

import { useEffect, useState } from 'react';
import { Badge, Table, Td, Pagination, EmptyState, SearchInput } from '../../../components/admin/AdminUi';
import { formatPrice } from '../../../lib/currency';

function formatDate(v: string) {
  if (!v) return '—';
  return new Date(v).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

export default function AdminMarketplacePage() {
  const [items, setItems] = useState<any[]>([]);
  const [meta, setMeta] = useState<any>({ page: 1, totalPages: 1 });
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: '20' });
    if (search) params.append('search', search);
    fetch(`/api/v1/admin/marketplace/listings?${params.toString()}`)
      .then((res) => (res.ok ? res.json() : { items: [], meta: {} }))
      .then((data) => {
        setItems(data.items || []);
        setMeta(data.meta || {});
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [page, search]);

  return (
    <div>
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <SearchInput value={search} onChange={setSearch} placeholder="Search listings..." />
      </div>

      {loading ? (
        <EmptyState message="Loading listings..." />
      ) : items.length === 0 ? (
        <EmptyState message="No listings found." />
      ) : (
        <>
          <Table headers={['Listing', 'Seller', 'Type', 'Price', 'Reports', 'Created']}>
            {items.map((l) => (
              <tr key={l.id}>
                <Td>
                  <div style={{ fontWeight: 600 }}>{l.title}</div>
                  <div style={{ fontSize: '12px', color: 'var(--foreground-muted)' }}>{l.category}</div>
                </Td>
                <Td>{l.seller?.displayName || '—'}</Td>
                <Td><Badge value={l.type} /></Td>
                <Td>{formatPrice(l.price, l.currency)}</Td>
                <Td>{l._count?.reports ?? 0}</Td>
                <Td>{formatDate(l.createdAt)}</Td>
              </tr>
            ))}
          </Table>
          <Pagination page={meta.page || 1} totalPages={meta.totalPages || 1} onChange={setPage} />
        </>
      )}
    </div>
  );
}
