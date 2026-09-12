'use client';

import { useEffect, useState } from 'react';
import { Badge } from '../../../components/admin/AdminUi';

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '24px', boxShadow: 'var(--shadow-sm)' }}>
      <h2 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--foreground)', marginBottom: '12px' }}>{title}</h2>
      {children}
    </div>
  );
}

export default function AdminSettingsPage() {
  const [me, setMe] = useState<any>(null);

  useEffect(() => {
    fetch('/api/v1/auth/me')
      .then((res) => (res.ok ? res.json() : null))
      .then(setMe)
      .catch(() => {});
  }, []);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px', maxWidth: '720px' }}>
      <Card title="Admin Account">
        <div style={{ fontSize: '14px', color: 'var(--foreground-muted)', lineHeight: 1.7 }}>
          <div>Signed in as: <strong style={{ color: 'var(--foreground)' }}>{me?.email || '—'}</strong></div>
          <div style={{ marginTop: '4px' }}>Role: <Badge value={me?.role || 'USER'} /></div>
          <div style={{ marginTop: '12px', fontSize: '13px' }}>
            Roles are managed through the Users section. Only an ADMIN can promote or demote other accounts.
          </div>
        </div>
      </Card>

      <Card title="Moderation Configuration">
        <div style={{ fontSize: '14px', color: 'var(--foreground-muted)', lineHeight: 1.7 }}>
          <p>
            Moderation is performed manually by ADMIN and MODERATOR roles through the Reports and Violations sections.
            There is no automated moderation in this phase.
          </p>
          <p style={{ marginTop: '8px' }}>
            Marketplace reports use statuses: PENDING, REVIEWING, RESOLVED, DISMISSED. Violations use severity
            levels (LOW, MEDIUM, HIGH, CRITICAL) and statuses (OPEN, RESOLVED, DISMISSED).
          </p>
        </div>
      </Card>

      <Card title="Marketplace Safety Configuration">
        <div style={{ fontSize: '14px', color: 'var(--foreground-muted)', lineHeight: 1.7 }}>
          <p>
            Users can report listings with one of eight reasons. A report is an allegation; a confirmed decision is
            recorded as a violation. These concepts are kept separate.
          </p>
          <p style={{ marginTop: '8px' }}>
            Marketplace pricing continues to support USD and GHS per listing. No conversion or payment processing
            exists in this phase.
          </p>
        </div>
      </Card>
    </div>
  );
}
