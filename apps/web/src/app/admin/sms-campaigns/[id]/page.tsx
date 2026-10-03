'use client';

import { useEffect, useState } from 'react';
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/v1/admin/sms-campaigns/${params.id}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!data) setError('Campaign not found');
        setCampaign(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load campaign');
        setLoading(false);
      });
  }, [params.id]);

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

  return (
    <div>
      <PageHeader
        title={campaign.name}
        description={`Created ${formatDate(campaign.createdAt)}`}
        actions={
          <>
            <Link
              href={`/admin/sms-campaigns/${campaign.id}/recipients`}
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
              Manage Recipients
            </Link>
            <Link
              href={`/admin/sms-campaigns/${campaign.id}/edit`}
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
              Edit
            </Link>
          </>
        }
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px', maxWidth: '720px' }}>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <span style={{ fontSize: '13px', color: 'var(--foreground-muted)', fontWeight: 600 }}>Status</span>
            <Badge value={campaign.status} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--foreground-muted)', fontWeight: 600 }}>Recipients</div>
              <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--foreground)' }}>{campaign.recipientCount ?? 0}</div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--foreground-muted)', fontWeight: 600 }}>Sent</div>
              <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--foreground)' }}>{campaign.sentCount ?? 0}</div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--foreground-muted)', fontWeight: 600 }}>Failed</div>
              <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--foreground)' }}>{campaign.failedCount ?? 0}</div>
            </div>
          </div>

          <div>
            <div style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--foreground-subtle)', marginBottom: '8px' }}>
              Message
            </div>
            <div style={{ background: 'var(--surface-muted)', border: '1px solid var(--border)', borderRadius: 12, padding: '16px', fontSize: '14px', color: 'var(--foreground)', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
              {campaign.message}
            </div>
          </div>

          <div style={{ marginTop: '16px', padding: '12px 16px', borderRadius: 10, background: 'rgba(59, 130, 246, 0.08)', border: '1px solid rgba(59, 130, 246, 0.25)', color: 'var(--foreground-muted)', fontSize: '13px', lineHeight: 1.6 }}>
            Sending will be available in the next phase.
          </div>
        </div>
      </div>
    </div>
  );
}
