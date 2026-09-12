'use client';

import React from 'react';

export function StatCard({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-md)',
        padding: '20px',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--foreground-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
        {label}
      </div>
      <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--foreground)', marginTop: '8px' }}>{value}</div>
    </div>
  );
}

const TONES: Record<string, { bg: string; color: string }> = {
  PENDING: { bg: '#fef3c7', color: '#92400e' },
  REVIEWING: { bg: '#dbeafe', color: '#1e40af' },
  RESOLVED: { bg: '#dcfce7', color: '#166534' },
  DISMISSED: { bg: '#f1f5f9', color: '#475569' },
  OPEN: { bg: '#fef3c7', color: '#92400e' },
  ACTIVE: { bg: '#dcfce7', color: '#166534' },
  RESTRICTED: { bg: '#fef3c7', color: '#92400e' },
  SUSPENDED: { bg: '#fee2e2', color: '#991b1b' },
  LOW: { bg: '#f1f5f9', color: '#475569' },
  MEDIUM: { bg: '#dbeafe', color: '#1e40af' },
  HIGH: { bg: '#fed7aa', color: '#9a3412' },
  CRITICAL: { bg: '#fee2e2', color: '#991b1b' },
  USER: { bg: '#f1f5f9', color: '#475569' },
  MODERATOR: { bg: '#dbeafe', color: '#1e40af' },
  ADMIN: { bg: '#e0e7ff', color: '#3730a3' },
  DIGITAL_PRODUCT: { bg: '#dbeafe', color: '#1e40af' },
  SERVICE: { bg: '#dcfce7', color: '#166534' },
};

export function Badge({ value }: { value: string }) {
  const tone = TONES[value] ?? { bg: '#f1f5f9', color: '#475569' };
  return (
    <span
      style={{
        display: 'inline-block',
        fontSize: '11px',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.4px',
        padding: '3px 8px',
        borderRadius: '999px',
        background: tone.bg,
        color: tone.color,
        whiteSpace: 'nowrap',
      }}
    >
      {value}
    </span>
  );
}

export function Table({ headers, children }: { headers: string[]; children: React.ReactNode }) {
  return (
    <div style={{ overflowX: 'auto', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', background: 'var(--surface)' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', minWidth: '640px' }}>
        <thead>
          <tr>
            {headers.map((h) => (
              <th
                key={h}
                style={{
                  textAlign: 'left',
                  padding: '12px 16px',
                  borderBottom: '1px solid var(--border)',
                  color: 'var(--foreground-muted)',
                  fontSize: '12px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.4px',
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

export function Td({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <td style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', color: 'var(--foreground)', verticalAlign: 'middle', ...style }}>{children}</td>;
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
          padding: '6px 12px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border)',
          background: 'var(--surface)',
          color: page <= 1 ? 'var(--foreground-muted)' : 'var(--foreground)',
          cursor: page <= 1 ? 'not-allowed' : 'pointer',
          fontSize: '13px',
          fontWeight: 600,
        }}
      >
        Previous
      </button>
      <span style={{ fontSize: '13px', color: 'var(--foreground-muted)' }}>
        Page {page} of {totalPages}
      </span>
      <button
        disabled={page >= totalPages}
        onClick={() => onChange(page + 1)}
        style={{
          padding: '6px 12px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border)',
          background: 'var(--surface)',
          color: page >= totalPages ? 'var(--foreground-muted)' : 'var(--foreground)',
          cursor: page >= totalPages ? 'not-allowed' : 'pointer',
          fontSize: '13px',
          fontWeight: 600,
        }}
      >
        Next
      </button>
    </div>
  );
}

export function EmptyState({ message }: { message: string }) {
  return (
    <div style={{ textAlign: 'center', padding: '48px 16px', color: 'var(--foreground-muted)', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
      {message}
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
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        padding: '10px 12px',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border)',
        background: 'var(--surface)',
        color: 'var(--foreground)',
        fontSize: '14px',
        outline: 'none',
        width: '100%',
        maxWidth: '360px',
      }}
    />
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
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        padding: '10px 12px',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border)',
        background: 'var(--surface)',
        color: 'var(--foreground)',
        fontSize: '14px',
        outline: 'none',
      }}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}
