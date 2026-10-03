'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Badge, PageHeader } from '../../../../../components/admin/AdminUi';

const CONFIRMATION = 'SEND CAMPAIGN';

export default function AdminSendCampaignPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const [preview, setPreview] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [confirmation, setConfirmation] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/v1/admin/sms-campaigns/${params.id}/send-preview`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!data) setNotFound(true);
        setPreview(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [params.id]);

  const handleSend = async () => {
    if (confirmation !== CONFIRMATION) return;
    setError(null);
    setSending(true);
    try {
      const res = await fetch(`/api/v1/admin/sms-campaigns/${params.id}/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ confirmation }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        router.push(`/admin/sms-campaigns/${params.id}`);
      } else {
        const msg = data.message;
        setError(Array.isArray(msg) ? msg.join(', ') : msg || 'Failed to send campaign');
      }
    } catch {
      setError('An error occurred while sending the campaign.');
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return <PageHeader title="Send Campaign" description="Loading..." />;
  }

  if (notFound || !preview) {
    return (
      <div>
        <PageHeader title="Send Campaign" />
        <div style={{ padding: '24px', border: '1px solid var(--border)', borderRadius: 14, background: 'var(--surface)', color: 'var(--foreground-muted)' }}>
          Campaign not found.
        </div>
      </div>
    );
  }

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
      <PageHeader title="Send Campaign" description="Review and confirm before sending." />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '680px' }}>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '16px' }}>
            <div style={{ fontSize: '16px', fontWeight: 700 }}>{preview.name}</div>
            <Badge value={preview.status} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '20px' }}>
            {[
              ['Recipients', preview.recipientCount ?? 0],
              ['Pending', preview.pendingCount ?? 0],
              ['Est. Units', preview.estimatedUnits ?? 0],
            ].map(([label, value]) => (
              <div key={label}>
                <div style={{ fontSize: '12px', color: 'var(--foreground-muted)', fontWeight: 600 }}>{label}</div>
                <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--foreground)' }}>{value}</div>
              </div>
            ))}
          </div>

          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--foreground-subtle)', marginBottom: '8px' }}>
              Message
            </div>
            <div style={{ background: 'var(--surface-muted)', border: '1px solid var(--border)', borderRadius: 12, padding: '16px', fontSize: '14px', color: 'var(--foreground)', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
              {preview.message}
            </div>
          </div>

          <div style={{ padding: '14px 16px', borderRadius: 10, background: 'rgba(251, 191, 36, 0.12)', border: '1px solid rgba(251, 191, 36, 0.4)', color: 'var(--foreground)', fontSize: '14px', fontWeight: 600, marginBottom: '20px' }}>
            ⚠️ This action sends real SMS messages to {preview.pendingCount ?? 0} recipients and may consume GOnline SMS credits.
          </div>

          {!preview.sendable && (
            <div style={{ padding: '12px 16px', borderRadius: 10, background: 'rgba(239, 68, 68, 0.1)', color: '#b91c1c', border: '1px solid #fecaca', fontSize: '13px', marginBottom: '16px' }}>
              This campaign is not currently sendable (it must be READY and have pending recipients).
            </div>
          )}

          {preview.sendable && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                  Type <code>{CONFIRMATION}</code> to confirm:
                </div>
                <input
                  type="text"
                  value={confirmation}
                  onChange={(e) => setConfirmation(e.target.value)}
                  placeholder={CONFIRMATION}
                  style={inputStyle}
                />
              </div>
              {error && (
                <div style={{ padding: '10px 14px', borderRadius: 10, background: 'rgba(239, 68, 68, 0.1)', color: '#b91c1c', border: '1px solid #fecaca', fontSize: '13px' }}>
                  {error}
                </div>
              )}
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <button
                  onClick={handleSend}
                  disabled={sending || confirmation !== CONFIRMATION}
                  style={{
                    padding: '10px 20px',
                    borderRadius: 10,
                    border: 'none',
                    background: 'var(--danger)',
                    color: '#ffffff',
                    fontSize: '14px',
                    fontWeight: 700,
                    cursor: sending || confirmation !== CONFIRMATION ? 'not-allowed' : 'pointer',
                    opacity: sending || confirmation !== CONFIRMATION ? 0.6 : 1,
                  }}
                >
                  {sending ? 'Sending...' : 'Send Campaign'}
                </button>
                <Link
                  href={`/admin/sms-campaigns/${params.id}`}
                  style={{
                    padding: '10px 20px',
                    borderRadius: 10,
                    border: '1px solid var(--border)',
                    background: 'var(--surface)',
                    color: 'var(--foreground-muted)',
                    fontSize: '14px',
                    fontWeight: 600,
                    textDecoration: 'none',
                  }}
                >
                  Cancel
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
