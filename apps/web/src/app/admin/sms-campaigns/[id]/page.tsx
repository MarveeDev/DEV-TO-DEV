'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Badge, PageHeader } from '../../../../components/admin/AdminUi';

function formatDate(v: string) {
  if (!v) return '—';
  return new Date(v).toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function AdminViewSmsCampaignPage() {
  const params = useParams<{ id: string }>();
  const [campaign, setCampaign] = useState<any>(null);
  const [preview, setPreview] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [testPhone, setTestPhone] = useState('');
  const [testResult, setTestResult] = useState<any>(null);
  const [testing, setTesting] = useState(false);
  const [testError, setTestError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const [cRes, pRes] = await Promise.all([
      fetch(`/api/v1/admin/sms-campaigns/${params.id}`),
      fetch(`/api/v1/admin/sms-campaigns/${params.id}/send-preview`),
    ]);
    const cData = cRes.ok ? await cRes.json() : null;
    const pData = pRes.ok ? await pRes.json() : null;
    if (!cData) setError('Campaign not found');
    setCampaign(cData);
    setPreview(pData);
    setLoading(false);
  }, [params.id]);

  useEffect(() => {
    load();
  }, [load]);

  const action = async (path: string, method = 'POST') => {
    const res = await fetch(`/api/v1/admin/sms-campaigns/${params.id}/${path}`, { method });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      alert(err.message || 'Action failed');
      return;
    }
    await load();
  };

  const sendTest = async () => {
    setTestError(null);
    setTestResult(null);
    setTesting(true);
    try {
      const res = await fetch(`/api/v1/admin/sms-campaigns/${params.id}/test`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: testPhone }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setTestResult(data);
      } else {
        const msg = data.message;
        setTestError(Array.isArray(msg) ? msg.join(', ') : msg || 'Test SMS failed');
      }
    } catch {
      setTestError('An error occurred sending the test SMS.');
    } finally {
      setTesting(false);
    }
  };

  if (loading) {
    return <PageHeader title="Campaign" description="Loading..." />;
  }

  if (error || !campaign) {
    return (
      <div>
        <PageHeader title="Campaign" />
        <div style={{ padding: '24px', border: '1px solid var(--border)', borderRadius: 14, background: 'var(--surface)', color: 'var(--foreground-muted)' }}>
          {error || 'Campaign not found'}
        </div>
      </div>
    );
  }

  const inputStyle: React.CSSProperties = {
    padding: '10px 12px',
    border: '1px solid var(--border)',
    borderRadius: 10,
    background: 'var(--surface)',
    color: 'var(--foreground)',
    fontSize: '14px',
    outline: 'none',
  };
  const btnStyle: React.CSSProperties = {
    padding: '9px 16px',
    borderRadius: 10,
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
  };

  return (
    <div>
      <PageHeader
        title={campaign.name}
        description={`Created ${formatDate(campaign.createdAt)}`}
        actions={
          <>
            <Link href={`/admin/sms-campaigns/${campaign.id}/recipients`} style={{ ...btnStyle, background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--foreground)', textDecoration: 'none' }}>
              Manage Recipients
            </Link>
            <Link href={`/admin/sms-campaigns/${campaign.id}/edit`} style={{ ...btnStyle, background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--foreground-muted)', textDecoration: 'none' }}>
              Edit
            </Link>
          </>
        }
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px', maxWidth: '760px' }}>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <span style={{ fontSize: '13px', color: 'var(--foreground-muted)', fontWeight: 600 }}>Status</span>
            <Badge value={campaign.status} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
            {[
              ['Recipients', campaign.recipientCount ?? 0],
              ['Pending', preview?.pendingCount ?? 0],
              ['Sent', campaign.sentCount ?? 0],
              ['Failed', campaign.failedCount ?? 0],
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
              {campaign.message}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {campaign.status === 'DRAFT' && (
              <button onClick={() => action('ready')} style={{ ...btnStyle, background: 'var(--primary)', color: '#ffffff', border: 'none' }}>
                Mark Ready
              </button>
            )}
            {(campaign.status === 'DRAFT' || campaign.status === 'READY') && (
              <button onClick={() => action('cancel')} style={{ ...btnStyle, background: 'transparent', border: '1px solid var(--danger)', color: 'var(--danger)' }}>
                Cancel Campaign
              </button>
            )}
            {campaign.status === 'READY' && (
              <Link href={`/admin/sms-campaigns/${campaign.id}/send`} style={{ ...btnStyle, background: 'var(--primary)', color: '#ffffff', border: 'none', textDecoration: 'none' }}>
                Send Campaign
              </Link>
            )}
          </div>

          {campaign.status !== 'READY' && campaign.status !== 'SENDING' && campaign.status !== 'COMPLETED' && (
            <div style={{ marginTop: '16px', padding: '10px 14px', borderRadius: 10, background: 'var(--surface-muted)', border: '1px solid var(--border)', fontSize: '13px', color: 'var(--foreground-muted)' }}>
              {campaign.status === 'FAILED' ? (
                <>This campaign failed during sending and <strong>cannot be resent</strong>. To reach remaining recipients, create a new campaign.</>
              ) : campaign.status === 'CANCELLED' ? (
                <>This campaign was cancelled and cannot be sent.</>
              ) : (
                <>A campaign must be marked <strong>Ready</strong> before it can be sent.</>
              )}
            </div>
          )}
        </div>

        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: '24px' }}>
          <div style={{ fontSize: '14px', fontWeight: 700, marginBottom: '8px' }}>Test SMS</div>
          <p style={{ fontSize: '13px', color: 'var(--foreground-muted)', margin: '0 0 12px' }}>
            Send the campaign message to a single test number. This does not count toward campaign delivery.
          </p>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <input
              type="tel"
              value={testPhone}
              onChange={(e) => setTestPhone(e.target.value)}
              placeholder="+233244000000"
              style={{ ...inputStyle, flex: 1, minWidth: '200px' }}
            />
            <button onClick={sendTest} disabled={testing || !testPhone.trim()} style={{ ...btnStyle, background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--foreground)', opacity: testing || !testPhone.trim() ? 0.6 : 1 }}>
              {testing ? 'Sending...' : 'Send Test SMS'}
            </button>
          </div>
          {testResult && (
            <div style={{ marginTop: '12px', padding: '10px 14px', borderRadius: 10, background: 'rgba(34, 197, 94, 0.1)', color: '#15803d', border: '1px solid #bbf7d0', fontSize: '13px' }}>
              Test SMS sent{testResult.messageId ? ` (message id ${testResult.messageId})` : ''}.
            </div>
          )}
          {testError && (
            <div style={{ marginTop: '12px', padding: '10px 14px', borderRadius: 10, background: 'rgba(239, 68, 68, 0.1)', color: '#b91c1c', border: '1px solid #fecaca', fontSize: '13px' }}>
              {testError}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
