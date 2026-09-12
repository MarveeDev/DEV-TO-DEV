'use client';

import { useEffect, useState } from 'react';
import { Badge, Table, Td, Pagination, EmptyState, SelectInput } from '../../../components/admin/AdminUi';

const TYPES = [
  'SCAM_FRAUD',
  'MISLEADING_INFORMATION',
  'COPYRIGHT_INFRINGEMENT',
  'PROHIBITED_ITEM',
  'SPAM',
  'HARASSMENT_ABUSE',
  'MALICIOUS_CODE',
  'OTHER',
];
const SEVERITIES = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
const STATUSES = ['OPEN', 'RESOLVED', 'DISMISSED'];

function formatDate(v: string) {
  if (!v) return '—';
  return new Date(v).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

export default function AdminViolationsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [meta, setMeta] = useState<any>({ page: 1, totalPages: 1 });
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ userId: '', type: 'SPAM', severity: 'MEDIUM', description: '' });
  const [formError, setFormError] = useState('');

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: '20' });
    if (status) params.append('status', status);
    fetch(`/api/v1/admin/violations?${params.toString()}`)
      .then((res) => (res.ok ? res.json() : { items: [], meta: {} }))
      .then((data) => {
        setItems(data.items || []);
        setMeta(data.meta || {});
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [page, status]);

  const updateStatus = async (id: string, newStatus: string) => {
    const res = await fetch(`/api/v1/admin/violations/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });
    if (res.ok) {
      setItems((prev) => prev.map((v) => (v.id === id ? { ...v, status: newStatus } : v)));
    } else {
      const err = await res.json().catch(() => ({}));
      alert(err.message || 'Failed to update violation');
    }
  };

  const createViolation = async () => {
    setFormError('');
    const res = await fetch('/api/v1/admin/violations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: form.userId.trim(),
        type: form.type,
        severity: form.severity,
        description: form.description.trim() || undefined,
      }),
    });
    if (res.ok) {
      setShowForm(false);
      setForm({ userId: '', type: 'SPAM', severity: 'MEDIUM', description: '' });
      setPage(1);
      const data = await res.json().catch(() => ({}));
      setItems((prev) => [data, ...prev]);
    } else {
      const err = await res.json().catch(() => ({}));
      setFormError(err.message || 'Failed to create violation');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <SelectInput
          value={status}
          onChange={setStatus}
          options={[{ value: '', label: 'All statuses' }, ...STATUSES.map((s) => ({ value: s, label: s }))]}
        />
        <button
          onClick={() => setShowForm((v) => !v)}
          style={{ padding: '10px 16px', borderRadius: 'var(--radius-md)', border: 'none', background: 'var(--primary)', color: '#fff', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}
        >
          {showForm ? 'Cancel' : 'New Violation'}
        </button>
      </div>

      {showForm && (
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '20px', marginBottom: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: 'var(--foreground)' }}>User ID</label>
              <input
                value={form.userId}
                onChange={(e) => setForm({ ...form, userId: e.target.value })}
                placeholder="UUID of the user"
                style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--foreground)', fontSize: '14px' }}
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: 'var(--foreground)' }}>Type</label>
                <SelectInput value={form.type} onChange={(v) => setForm({ ...form, type: v })} options={TYPES.map((t) => ({ value: t, label: t }))} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: 'var(--foreground)' }}>Severity</label>
                <SelectInput value={form.severity} onChange={(v) => setForm({ ...form, severity: v })} options={SEVERITIES.map((s) => ({ value: s, label: s }))} />
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: 'var(--foreground)' }}>Description (optional)</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                style={{ width: '100%', minHeight: '70px', padding: '10px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--foreground)', fontSize: '14px' }}
              />
            </div>
            {formError && <div style={{ color: '#ef4444', fontSize: '13px' }}>{formError}</div>}
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={createViolation}
                disabled={!form.userId.trim()}
                style={{ padding: '10px 16px', borderRadius: 'var(--radius-md)', border: 'none', background: 'var(--primary)', color: '#fff', fontWeight: 600, fontSize: '14px', cursor: form.userId.trim() ? 'pointer' : 'not-allowed', opacity: form.userId.trim() ? 1 : 0.6 }}
              >
                Create Violation
              </button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <EmptyState message="Loading violations..." />
      ) : items.length === 0 ? (
        <EmptyState message="No violations found." />
      ) : (
        <>
          <Table headers={['Type', 'Severity', 'User', 'Status', 'Created']}>
            {items.map((v) => (
              <tr key={v.id}>
                <Td>{v.type}</Td>
                <Td><Badge value={v.severity} /></Td>
                <Td>{v.user?.developerProfile?.displayName || v.user?.email || '—'}</Td>
                <Td>
                  <select
                    value={v.status}
                    onChange={(e) => updateStatus(v.id, e.target.value)}
                    style={{ padding: '4px 8px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--foreground)', fontSize: '13px' }}
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </Td>
                <Td>{formatDate(v.createdAt)}</Td>
              </tr>
            ))}
          </Table>
          <Pagination page={meta.page || 1} totalPages={meta.totalPages || 1} onChange={setPage} />
        </>
      )}
    </div>
  );
}
