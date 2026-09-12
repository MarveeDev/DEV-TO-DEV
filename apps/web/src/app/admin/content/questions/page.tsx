'use client';

import { useEffect, useState } from 'react';
import { Badge, Table, Td, Pagination, EmptyState, SearchInput } from '../../../../components/admin/AdminUi';
import ContentTabs from '../../../../components/admin/ContentTabs';

function formatDate(v: string) {
  if (!v) return '—';
  return new Date(v).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

export default function AdminContentQuestionsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [meta, setMeta] = useState<any>({ page: 1, totalPages: 1 });
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: '20' });
    if (search) params.append('search', search);
    fetch(`/api/v1/admin/content/questions?${params.toString()}`)
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
      <ContentTabs />
      <div style={{ marginBottom: '20px' }}>
        <SearchInput value={search} onChange={setSearch} placeholder="Search questions..." />
      </div>

      {loading ? (
        <EmptyState message="Loading questions..." />
      ) : items.length === 0 ? (
        <EmptyState message="No questions found." />
      ) : (
        <>
          <Table headers={['Title', 'Author', 'Answers', 'Status', 'Created']}>
            {items.map((q) => (
              <tr key={q.id}>
                <Td style={{ maxWidth: '320px' }}>
                  <div style={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{q.title}</div>
                </Td>
                <Td>{q.author?.displayName || '—'}</Td>
                <Td>{q._count?.answers ?? 0}</Td>
                <Td><Badge value={q.status} /></Td>
                <Td>{formatDate(q.createdAt)}</Td>
              </tr>
            ))}
          </Table>
          <Pagination page={meta.page || 1} totalPages={meta.totalPages || 1} onChange={setPage} />
        </>
      )}
    </div>
  );
}
