'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  Badge,
  EmptyState,
  PageHeader,
  Pagination,
  Table,
  TableSkeleton,
  Td,
} from '../../../../../components/admin/AdminUi';

function formatDate(v: string) {
  if (!v) return '—';
  return new Date(v).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

export default function AdminCampaignRecipientsPage() {
  const params = useParams<{ id: string }>();
  const campaignId = params.id;

  const [campaign, setCampaign] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [meta, setMeta] = useState<any>({ page: 1, totalPages: 1 });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const [importing, setImporting] = useState(false);
  const [summary, setSummary] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const fetchRecipients = useCallback(() => {
    const params2 = new URLSearchParams({ page: String(page), limit: '20' });
    fetch(`/api/v1/admin/sms-campaigns/${campaignId}/recipients?${params2.toString()}`)
      .then((res) => (res.ok ? res.json() : { items: [], meta: {} }))
      .then((data) => {
        setItems(data.items || []);
        setMeta(data.meta || {});
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [campaignId, page]);

  useEffect(() => {
    fetch(`/api/v1/admin/sms-campaigns/${campaignId}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setCampaign(data))
      .catch(() => {});
  }, [campaignId]);

  useEffect(() => {
    setLoading(true);
    fetchRecipients();
  }, [fetchRecipients]);

  const refreshCampaign = async () => {
    const res = await fetch(`/api/v1/admin/sms-campaigns/${campaignId}`);
    if (res.ok) setCampaign(await res.json());
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setSummary(null);
    setImporting(true);
    try {
      const form = new FormData();
      form.append('file', file);
      const res = await fetch(`/api/v1/admin/sms-campaigns/${campaignId}/recipients/import`, {
        method: 'POST',
        body: form,
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setSummary(data);
        await refreshCampaign();
        fetchRecipients();
      } else {
        const msg = data.message;
        setError(Array.isArray(msg) ? msg.join(', ') : msg || 'Import failed');
      }
    } catch {
      setError('An error occurred during import.');
    } finally {
      setImporting(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const removeRecipient = async (recipientId: string) => {
    const res = await fetch(
      `/api/v1/admin/sms-campaigns/${campaignId}/recipients/${recipientId}`,
      { method: 'DELETE' },
    );
    if (res.ok) {
      setItems((prev) => prev.filter((r) => r.id !== recipientId));
      await refreshCampaign();
    }
  };

  const clearInvalid = async () => {
    if (!window.confirm('Clear all invalid (skipped) recipients?')) return;
    await fetch(`/api/v1/admin/sms-campaigns/${campaignId}/recipients/invalid`, { method: 'DELETE' });
    await refreshCampaign();
    fetchRecipients();
  };

  const clearAll = async () => {
    if (!window.confirm('Clear ALL recipients? This cannot be undone.')) return;
    await fetch(`/api/v1/admin/sms-campaigns/${campaignId}/recipients`, { method: 'DELETE' });
    await refreshCampaign();
    fetchRecipients();
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid var(--border)',
    borderRadius: 10,
    background: 'var(--surface)',
    color: 'var(--foreground)',
    fontSize: '14px',
    outline: 'none',
  };

  return (
    <div>
      <PageHeader
        title={campaign?.name || 'Campaign Recipients'}
        description={
          campaign
            ? `Status: ${campaign.status} · ${campaign.recipientCount ?? 0} recipients`
            : 'Manage campaign contacts.'
        }
        actions={
          <Link
            href={`/admin/sms-campaigns/${campaignId}`}
            style={{
              padding: '9px 16px',
              borderRadius: 10,
              border: '1px solid var(--border)',
              background: 'var(--surface)',
              color: 'var(--foreground-muted)',
              fontSize: '14px',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            Back to Campaign
          </Link>
        }
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '920px' }}>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: '20px' }}>
          <div style={{ fontSize: '14px', fontWeight: 700, marginBottom: '8px' }}>Import Contacts</div>
          <p style={{ fontSize: '13px', color: 'var(--foreground-muted)', margin: '0 0 14px' }}>
            Upload a CSV with a phone-number column (e.g. <code>phone</code>, <code>mobile</code>). Numbers are
            validated, normalized to E.164, and deduplicated. Max 1MB / 10,000 rows.
          </p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
            <input
              ref={fileRef}
              type="file"
              accept=".csv,text/csv"
              onChange={handleImport}
              disabled={importing}
              style={inputStyle}
            />
          </div>
          {importing && <div style={{ fontSize: '13px', color: 'var(--foreground-muted)', marginTop: '12px' }}>Importing…</div>}
          {error && (
            <div style={{ padding: '12px 16px', borderRadius: 10, background: 'rgba(239, 68, 68, 0.1)', color: '#b91c1c', border: '1px solid #fecaca', fontSize: '13px', marginTop: '12px' }}>
              {error}
            </div>
          )}
          {summary && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '16px' }}>
              {[
                ['Imported', summary.total],
                ['Valid', summary.valid],
                ['Duplicates', summary.duplicates],
                ['Invalid', summary.invalid],
                ['Added', summary.added],
              ].map(([label, value]) => (
                <div key={label} style={{ background: 'var(--surface-muted)', border: '1px solid var(--border)', borderRadius: 10, padding: '12px 16px', minWidth: '100px' }}>
                  <div style={{ fontSize: '11px', color: 'var(--foreground-muted)', fontWeight: 600, textTransform: 'uppercase' }}>{label}</div>
                  <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--foreground)' }}>{value}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ fontSize: '14px', fontWeight: 700 }}>Recipients</div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={clearInvalid}
                style={{ padding: '8px 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--foreground-muted)', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
              >
                Clear Invalid
              </button>
              <button
                onClick={clearAll}
                style={{ padding: '8px 14px', borderRadius: 10, border: '1px solid var(--danger)', background: 'transparent', color: 'var(--danger)', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
              >
                Clear All
              </button>
            </div>
          </div>

          {loading ? (
            <TableSkeleton rows={5} columns={4} />
          ) : items.length === 0 ? (
            <EmptyState message="No recipients yet. Import a CSV to add contacts." />
          ) : (
            <>
              <Table headers={['Phone Number', 'Status', 'Added', 'Action']}>
                {items.map((r) => (
                  <tr key={r.id}>
                    <Td style={{ fontWeight: 600 }}>{r.normalizedPhone || r.phoneNumber}</Td>
                    <Td><Badge value={r.status} /></Td>
                    <Td>{formatDate(r.createdAt)}</Td>
                    <Td>
                      <button
                        onClick={() => removeRecipient(r.id)}
                        style={{ background: 'none', border: 'none', color: 'var(--danger)', fontSize: '13px', fontWeight: 600, cursor: 'pointer', padding: 0 }}
                      >
                        Remove
                      </button>
                    </Td>
                  </tr>
                ))}
              </Table>
              <Pagination page={meta.page || 1} totalPages={meta.totalPages || 1} onChange={setPage} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
