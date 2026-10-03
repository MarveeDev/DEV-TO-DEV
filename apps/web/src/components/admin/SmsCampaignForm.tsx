'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const MAX_NAME = 120;
const MAX_MESSAGE = 1600;

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

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontWeight: 600,
  marginBottom: '6px',
  fontSize: '13px',
  color: 'var(--foreground)',
};

export default function SmsCampaignForm({
  campaignId,
  initialName = '',
  initialMessage = '',
}: {
  campaignId?: string;
  initialName?: string;
  initialMessage?: string;
}) {
  const router = useRouter();
  const [name, setName] = useState(initialName);
  const [message, setMessage] = useState(initialMessage);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEdit = Boolean(campaignId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const res = await fetch(
        isEdit
          ? `/api/v1/admin/sms-campaigns/${campaignId}`
          : '/api/v1/admin/sms-campaigns',
        {
          method: isEdit ? 'PATCH' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, message }),
        },
      );
      if (res.ok) {
        router.push('/admin/sms-campaigns');
        router.refresh();
      } else {
        const err = await res.json().catch(() => ({}));
        const msg = err.message;
        setError(Array.isArray(msg) ? msg.join(', ') : msg || 'Failed to save campaign');
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '720px' }}>
      {error && (
        <div style={{ padding: '12px 16px', borderRadius: 10, background: 'rgba(239, 68, 68, 0.1)', color: '#b91c1c', border: '1px solid #fecaca', fontSize: '14px' }}>
          {error}
        </div>
      )}

      <div>
        <label style={labelStyle}>Campaign Name</label>
        <input
          type="text"
          value={name}
          maxLength={MAX_NAME}
          onChange={(e) => setName(e.target.value)}
          style={inputStyle}
          placeholder="e.g. Product launch announcement"
        />
        <div style={{ fontSize: '12px', color: 'var(--foreground-muted)', marginTop: '6px', textAlign: 'right' }}>
          {name.length} / {MAX_NAME}
        </div>
      </div>

      <div>
        <label style={labelStyle}>Message</label>
        <textarea
          value={message}
          maxLength={MAX_MESSAGE}
          onChange={(e) => setMessage(e.target.value)}
          style={{ ...inputStyle, minHeight: '140px', resize: 'vertical', lineHeight: 1.6 }}
          placeholder="Write your SMS message..."
        />
        <div style={{ fontSize: '12px', color: 'var(--foreground-muted)', marginTop: '6px', textAlign: 'right' }}>
          {message.length} / {MAX_MESSAGE} characters
        </div>
      </div>

      <div>
        <div style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--foreground-subtle)', marginBottom: '8px' }}>
          Message Preview
        </div>
        <div style={{ background: 'var(--surface-muted)', border: '1px solid var(--border)', borderRadius: 12, padding: '16px', minHeight: '60px' }}>
          {message.trim() ? (
            <span style={{ fontSize: '14px', color: 'var(--foreground)', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
              {message}
            </span>
          ) : (
            <span style={{ fontSize: '14px', color: 'var(--foreground-subtle)' }}>Your message preview will appear here.</span>
          )}
        </div>
      </div>

      <div style={{ padding: '12px 16px', borderRadius: 10, background: 'rgba(59, 130, 246, 0.08)', border: '1px solid rgba(59, 130, 246, 0.25)', color: 'var(--foreground-muted)', fontSize: '13px', lineHeight: 1.6 }}>
        Note: This phase only creates and manages campaign drafts. Actual sending to recipients will be added in a later phase.
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button
          type="submit"
          disabled={saving || !name.trim() || !message.trim()}
          style={{
            padding: '10px 18px',
            borderRadius: 10,
            border: 'none',
            background: 'var(--primary)',
            color: '#ffffff',
            fontSize: '14px',
            fontWeight: 600,
            cursor: saving || !name.trim() || !message.trim() ? 'not-allowed' : 'pointer',
            opacity: saving || !name.trim() || !message.trim() ? 0.6 : 1,
          }}
        >
          {saving ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Campaign'}
        </button>
        <Link
          href="/admin/sms-campaigns"
          style={{
            padding: '10px 18px',
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
    </form>
  );
}
