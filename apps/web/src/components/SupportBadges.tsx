import Badge from './Badge';
import { statusLabel, priorityLabel } from '../lib/support';

const FALLBACK_TONE = { background: 'var(--surface-hover)', color: 'var(--foreground-muted)' };

const STATUS_TONES: Record<string, { background: string; color: string }> = {
  OPEN: { background: 'var(--primary-light)', color: 'var(--primary)' },
  PENDING: { background: 'var(--warning-light)', color: 'var(--warning)' },
  IN_PROGRESS: { background: 'var(--accent-light)', color: 'var(--accent)' },
  RESOLVED: { background: 'var(--success-light)', color: 'var(--success)' },
  CLOSED: { background: 'var(--surface-hover)', color: 'var(--foreground-muted)' },
};

const PRIORITY_TONES: Record<string, { background: string; color: string }> = {
  LOW: { background: 'var(--surface-hover)', color: 'var(--foreground-muted)' },
  NORMAL: { background: 'var(--primary-light)', color: 'var(--primary)' },
  HIGH: { background: 'var(--warning-light)', color: 'var(--warning)' },
  URGENT: { background: 'var(--danger-light)', color: 'var(--danger)' },
};

export function StatusBadge({ value }: { value: string | undefined | null }) {
  const tone = (value && STATUS_TONES[value]) || FALLBACK_TONE;
  return <Badge style={tone}>{statusLabel(value)}</Badge>;
}

export function PriorityBadge({ value }: { value: string | undefined | null }) {
  const tone = (value && PRIORITY_TONES[value]) || FALLBACK_TONE;
  return <Badge style={tone}>{priorityLabel(value)}</Badge>;
}
