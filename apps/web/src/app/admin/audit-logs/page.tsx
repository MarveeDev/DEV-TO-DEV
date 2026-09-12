'use client';

import { useEffect, useState } from 'react';
import { Table, Td, Pagination, EmptyState, SelectInput } from '../../../components/admin/AdminUi';

const ACTIONS = ['USER_ROLE_CHANGED', 'REPORT_STATUS_CHANGED', 'VIOLATION_CREATED', 'VIOLATION_STATUS_CHANGED'];

function formatDate(v: string) {
  if (!v) return '—';
  return new Date(v).toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function AdminAuditLogsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [meta, setMeta] = useState<any>({ page: 1, totalPages: 1 });
  const [page, setPage] = useState(1);
  const [action, setAction] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: '20' });
    if (action) params.append('action', action);
    fetch(`/api/v1/admin/audit-logs?${params.toString()}`)
      .then((res) => (res.ok ? res.json() : { items: [], meta: {} }))
      .then((data) => {
        setItems(data.items || []);
        setMeta(data.meta || {});
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [page, action]);

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <SelectInput
          value={action}
          onChange={setAction}
          options={[{ value: '', label: 'All actions' }, ...ACTIONS.map((a) => ({ value: a, label: a }))]}
        />
      </div>

      {loading ? (
        <EmptyState message="Loading audit logs..." />
      ) : items.length === 0 ? (
        <EmptyState message="No audit logs found." />
      ) : (
        <>
          <Table headers={['Action', 'Actor', 'Entity', 'Entity ID', 'Metadata', 'Timestamp']}>
            {items.map((l) => (
              <tr key={l.id}>
                <Td>{l.action}</Td>
                <Td>{l.actor?.email || '—'}</Td>
                <Td>{l.entityType}</Td>
                <Td style={{ fontSize: '12px', color: 'var(--foreground-muted)', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {l.entityId || '—'}
                </Td>
                <Td style={{ fontSize: '12px', color: 'var(--foreground-muted)', maxWidth: '220px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {l.metadata ? JSON.stringify(l.metadata) : '—'}
                </Td>
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
