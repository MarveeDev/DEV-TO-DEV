import React from 'react';
import Card from './Card';

interface LegalPageProps {
  title: string;
  updated: string;
  children: React.ReactNode;
}

export default function LegalPage({ title, updated, children }: LegalPageProps) {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '60px' }}>
      <div className="page-header" style={{ marginBottom: '24px' }}>
        <div className="page-header-content">
          <h1 style={{ fontSize: '28px', fontWeight: 800, margin: 0, color: 'var(--foreground)' }}>
            {title}
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--foreground-muted)', marginTop: '8px' }}>
            Last updated: {updated}
          </p>
        </div>
      </div>

      <Card padding="lg">
        <div className="legal-content">{children}</div>
      </Card>
    </div>
  );
}
