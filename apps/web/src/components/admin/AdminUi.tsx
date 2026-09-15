'use client';

import React from 'react';
import { Search, ChevronDown, ChevronLeft, ChevronRight, Inbox } from 'lucide-react';
import Skeleton from '../Skeleton';

const TONE_BG: Record<string, string> = {
  blue: 'rgba(59, 130, 246, 0.14)',
  purple: 'rgba(139, 124, 246, 0.14)',
  green: 'rgba(52, 211, 153, 0.14)',
  amber: 'rgba(251, 191, 36, 0.14)',
  red: 'rgba(248, 113, 113, 0.14)',
  slate: 'rgba(148, 163, 184, 0.14)',
};

const TONE_COLOR: Record<string, string> = {
  blue: '#93c5fd',
  purple: '#c4b5fd',
  green: '#6ee7b7',
  amber: '#fcd34d',
  red: '#fca5a5',
  slate: '#cbd5e1',
};

export function StatCard({
  label,
  value,
  icon: Icon,
  sub,
  tone = 'blue',
}: {
  label: string;
  value: React.ReactNode;
  icon?: React.ComponentType<{ size?: number; strokeWidth?: number }>;
  sub?: React.ReactNode;
  tone?: 'blue' | 'purple' | 'green' | 'amber' | 'red' | 'slate';
}) {
  return (
    <div
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 14,
        padding: '18px 18px',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
        <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--foreground-muted)', letterSpacing: '0.02em' }}>
          {label}
        </div>
        {Icon && (
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 9,
              background: TONE_BG[tone],
              color: TONE_COLOR[tone],
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Icon size={16} strokeWidth={2.2} />
          </div>
        )}
      </div>
      <div>
        <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--foreground)', lineHeight: 1.1, letterSpacing: '-0.02em' }}>
          {value}
        </div>
        {sub && <div style={{ fontSize: '12px', color: 'var(--foreground-subtle)', marginTop: '6px' }}>{sub}</div>}
      </div>
    </div>
  );
}

const TONES: Record<string, { bg: string; color: string }> = {
  PENDING: { bg: 'rgba(251, 191, 36, 0.14)', color: '#fcd34d' },
  REVIEWING: { bg: 'rgba(59, 130, 246, 0.14)', color: '#93c5fd' },
  RESOLVED: { bg: 'rgba(52, 211, 153, 0.14)', color: '#6ee7b7' },
  DISMISSED: { bg: 'rgba(148, 163, 184, 0.14)', color: '#cbd5e1' },
  OPEN: { bg: 'rgba(251, 191, 36, 0.14)', color: '#fcd34d' },
  ACTIVE: { bg: 'rgba(52, 211, 153, 0.14)', color: '#6ee7b7' },
  RESTRICTED: { bg: 'rgba(251, 191, 36, 0.14)', color: '#fcd34d' },
  SUSPENDED: { bg: 'rgba(248, 113, 113, 0.14)', color: '#fca5a5' },
  LOW: { bg: 'rgba(148, 163, 184, 0.14)', color: '#cbd5e1' },
  MEDIUM: { bg: 'rgba(59, 130, 246, 0.14)', color: '#93c5fd' },
  HIGH: { bg: 'rgba(251, 191, 36, 0.14)', color: '#fcd34d' },
  CRITICAL: { bg: 'rgba(248, 113, 113, 0.14)', color: '#fca5a5' },
  USER: { bg: 'rgba(148, 163, 184, 0.14)', color: '#cbd5e1' },
  MODERATOR: { bg: 'rgba(59, 130, 246, 0.14)', color: '#93c5fd' },
  ADMIN: { bg: 'rgba(139, 124, 246, 0.14)', color: '#c4b5fd' },
  DIGITAL_PRODUCT: { bg: 'rgba(59, 130, 246, 0.14)', color: '#93c5fd' },
  SERVICE: { bg: 'rgba(52, 211, 153, 0.14)', color: '#6ee7b7' },
};

export function Badge({ value }: { value: string }) {
  const tone = TONES[value] ?? { bg: 'rgba(148, 163, 184, 0.14)', color: '#cbd5e1' };
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        fontSize: '11px',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.04em',
        padding: '4px 9px',
        borderRadius: '999px',
        background: tone.bg,
        color: tone.color,
        whiteSpace: 'nowrap',
      }}
    >
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: tone.color, flexShrink: 0 }} />
      {value}
    </span>
  );
}

export function Table({ headers, children }: { headers: string[]; children: React.ReactNode }) {
  return (
    <div className="admin-table" style={{ overflowX: 'auto', border: '1px solid var(--border)', borderRadius: 14, background: 'var(--surface)' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', minWidth: '640px' }}>
        <thead>
          <tr>
            {headers.map((h) => (
              <th
                key={h}
                style={{
                  textAlign: 'left',
                  padding: '13px 16px',
                  borderBottom: '1px solid var(--border)',
                  background: 'var(--surface-muted)',
                  color: 'var(--foreground-muted)',
                  fontSize: '11px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  whiteSpace: 'nowrap',
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

export function Td({ children, style, ...rest }: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return <td style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)', color: 'var(--foreground)', verticalAlign: 'middle', ...style }} {...rest}>{children}</td>;
}

export function TableSkeleton({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div className="admin-table" style={{ border: '1px solid var(--border)', borderRadius: 14, background: 'var(--surface)', overflow: 'hidden' }}>
      <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)', background: 'var(--surface-muted)' }}>
        <Skeleton width={180} height={12} />
      </div>
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} style={{ display: 'flex', gap: '16px', padding: '14px 16px', borderBottom: r === rows - 1 ? 'none' : '1px solid var(--border)' }}>
          {Array.from({ length: columns }).map((_, c) => (
            <Skeleton key={c} width={`${100 / columns}%`} height={14} maxWidth={c === 0 ? 200 : undefined} />
          ))}
        </div>
      ))}
    </div>
  );
}

export function Pagination({
  page,
  totalPages,
  onChange,
}: {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '20px', flexWrap: 'wrap' }}>
      <button
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '7px 14px',
          borderRadius: 10,
          border: '1px solid var(--border)',
          background: 'var(--surface)',
          color: page <= 1 ? 'var(--foreground-subtle)' : 'var(--foreground)',
          cursor: page <= 1 ? 'not-allowed' : 'pointer',
          fontSize: '13px',
          fontWeight: 600,
        }}
      >
        <ChevronLeft size={15} />
        Previous
      </button>
      <span style={{ fontSize: '13px', color: 'var(--foreground-muted)' }}>
        Page {page} of {totalPages}
      </span>
      <button
        disabled={page >= totalPages}
        onClick={() => onChange(page + 1)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '7px 14px',
          borderRadius: 10,
          border: '1px solid var(--border)',
          background: 'var(--surface)',
          color: page >= totalPages ? 'var(--foreground-subtle)' : 'var(--foreground)',
          cursor: page >= totalPages ? 'not-allowed' : 'pointer',
          fontSize: '13px',
          fontWeight: 600,
        }}
      >
        Next
        <ChevronRight size={15} />
      </button>
    </div>
  );
}

export function EmptyState({ message, icon: Icon = Inbox }: { message: string; icon?: React.ComponentType<{ size?: number; strokeWidth?: number }> }) {
  return (
    <div
      style={{
        textAlign: 'center',
        padding: '48px 16px',
        color: 'var(--foreground-muted)',
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 14,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '12px',
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          background: 'var(--surface-muted)',
          color: 'var(--foreground-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Icon size={22} strokeWidth={2} />
      </div>
      <div style={{ fontSize: '14px' }}>{message}</div>
    </div>
  );
}

export function SearchInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: '360px' }}>
      <Search
        size={16}
        style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--foreground-subtle)', pointerEvents: 'none' }}
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          padding: '10px 12px 10px 36px',
          borderRadius: 10,
          border: '1px solid var(--border)',
          background: 'var(--surface)',
          color: 'var(--foreground)',
          fontSize: '14px',
          outline: 'none',
          width: '100%',
        }}
      />
    </div>
  );
}

export function SelectInput({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          padding: '10px 34px 10px 12px',
          borderRadius: 10,
          border: '1px solid var(--border)',
          background: 'var(--surface)',
          color: 'var(--foreground)',
          fontSize: '14px',
          outline: 'none',
          appearance: 'none',
          cursor: 'pointer',
        }}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown
        size={15}
        style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--foreground-subtle)', pointerEvents: 'none' }}
      />
    </div>
  );
}

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap', marginBottom: '24px' }}>
      <div style={{ minWidth: 0 }}>
        <h1 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--foreground)', letterSpacing: '-0.02em', margin: 0 }}>{title}</h1>
        {description && <p style={{ fontSize: '14px', color: 'var(--foreground-muted)', margin: '6px 0 0' }}>{description}</p>}
      </div>
      {actions && <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>{actions}</div>}
    </div>
  );
}
