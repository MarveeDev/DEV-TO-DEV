import React from 'react';
import type { LucideIcon } from 'lucide-react';
import Card from './Card';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  style?: React.CSSProperties;
}

export default function EmptyState({ icon: Icon, title, description, action, style }: EmptyStateProps) {
  return (
    <Card padding="lg" style={{ textAlign: 'center', ...style }}>
      {Icon && (
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            background: 'var(--surface-muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
          }}
        >
          <Icon size={26} color="var(--foreground-subtle)" />
        </div>
      )}
      <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--foreground)', margin: '0 0 6px 0' }}>
        {title}
      </h3>
      {description && (
        <p style={{ color: 'var(--foreground-muted)', margin: '0 0 20px 0', lineHeight: 1.5 }}>
          {description}
        </p>
      )}
      {action && <div style={{ display: 'flex', justifyContent: 'center' }}>{action}</div>}
    </Card>
  );
}
