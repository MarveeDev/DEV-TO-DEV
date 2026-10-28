'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useCurrentUser } from '../../../../components/Auth/CurrentUserProvider';
import { Badge, PageHeader, SelectInput, EmptyState, TableSkeleton } from '../../../../components/admin/AdminUi';
import { hasPermission } from '../../../../lib/admin-permissions';
import { statusLabel, priorityLabel, extractErrorMessage } from '../../../../lib/support';
import {
  messageKindLabel,
  type StaffTicketDetail,
  type SupportMessageKind,
} from '../../../../lib/support-staff';

const STATUS_OPTIONS = [
  { value: 'OPEN', label: 'Open' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'RESOLVED', label: 'Resolved' },
  { value: 'CLOSED', label: 'Closed' },
];

const PRIORITY_OPTIONS = [
  { value: 'LOW', label: 'Low' },
  { value: 'NORMAL', label: 'Normal' },
  { value: 'HIGH', label: 'High' },
  { value: 'URGENT', label: 'Urgent' },
];

const CARD_STYLE: React.CSSProperties = {
  background: 'var(--surface)',
  border: '1px solid var(--border)',
  borderRadius: 14,
  padding: '20px',
};

function formatDateTime(value?: string | null): string {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export default function AdminSupportTicketPage() {
  const router = useRouter();
  const params = useParams<{ id: string | string[] }>();
  const id = typeof params?.id === 'string' ? params.id : '';

  const { user: me } = useCurrentUser();

  const [ticket, setTicket] = useState<StaffTicketDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [loadError, setLoadError] = useState('');

  const [saving, setSaving] = useState(false);
  const [actionError, setActionError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  const [assigneeId, setAssigneeId] = useState('');

  const [message, setMessage] = useState('');
  const [kind, setKind] = useState<SupportMessageKind>('REPLY');
  const [sending, setSending] = useState(false);

  const loadTicket = () => {
    if (!id) return;
    fetch(`/api/v1/admin/support/tickets/${id}`)
      .then(async (res) => {
        if (res.status === 401) {
          router.replace('/login');
          return;
        }
        if (res.status === 403) {
          setLoadError('You do not have permission to view this ticket.');
          return;
        }
        if (res.status === 404) {
          setNotFound(true);
          return;
        }
        if (!res.ok) {
          setLoadError('Unable to load this ticket. Please try again.');
          return;
        }
        setTicket((await res.json()) as StaffTicketDetail);
        setLoadError('');
        setNotFound(false);
      })
      .catch(() => setLoadError('Unable to load this ticket. Please try again.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadTicket();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (!me || !hasPermission(me.role, 'support.manage')) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', textAlign: 'center' }}>
        <div style={{ fontSize: '40px', fontWeight: 800, color: 'var(--foreground)' }}>403</div>
        <p style={{ color: 'var(--foreground-muted)', margin: '8px 0 0' }}>
          You do not have permission to access the Support Centre.
        </p>
      </div>
    );
  }

  const updateTicket = async (patch: { status?: string; priority?: string; assigneeId?: string }) => {
    setSaving(true);
    setActionError('');
    setActionSuccess('');
    try {
      const res = await fetch(`/api/v1/admin/support/tickets/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch),
      });

      if (res.status === 401) {
        router.replace('/login');
        return;
      }

      const body = await res.json().catch(() => null);

      if (res.status === 403) {
        setActionError('You do not have permission to update this ticket.');
        return;
      }
      if (res.status === 429) {
        setActionError(extractErrorMessage(body) ?? 'Too many requests. Please slow down.');
        return;
      }
      if (!res.ok) {
        setActionError(extractErrorMessage(body) ?? 'Unable to update the ticket. Please try again.');
        return;
      }

      setTicket((body as StaffTicketDetail) ?? ticket);
      setActionSuccess('Ticket updated.');
    } catch {
      setActionError('Unable to update the ticket. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const body = message.trim();
    if (!body) return;

    setSending(true);
    setActionError('');
    setActionSuccess('');
    try {
      const res = await fetch(`/api/v1/admin/support/tickets/${id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body, kind }),
      });

      if (res.status === 401) {
        router.replace('/login');
        return;
      }

      const responseBody = await res.json().catch(() => null);

      if (res.status === 403) {
        setActionError('You do not have permission to reply to this ticket.');
        return;
      }
      if (res.status === 429) {
        setActionError(extractErrorMessage(responseBody) ?? 'You are replying too quickly. Please wait a moment.');
        return;
      }
      if (!res.ok) {
        setActionError(extractErrorMessage(responseBody) ?? 'Unable to send your message. Please try again.');
        return;
      }

      setMessage('');
      setActionSuccess(kind === 'NOTE' ? 'Internal note added.' : 'Reply sent.');
      loadTicket();
    } catch {
      setActionError('Unable to send your message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const assignToMe = () => {
    if (!me?.id) return;
    updateTicket({ assigneeId: me.id });
  };
  const unassign = () => updateTicket({ assigneeId: '' });
  const assignCustom = (e: React.FormEvent) => {
    e.preventDefault();
    const value = assigneeId.trim();
    if (!value) return;
    updateTicket({ assigneeId: value });
    setAssigneeId('');
  };

  if (loading) {
    return <TableSkeleton rows={5} columns={1} />;
  }

  if (notFound) {
    return (
      <EmptyState message="Ticket not found." />
    );
  }

  if (loadError) {
    return <EmptyState message={loadError} />;
  }

  if (!ticket) {
    return <EmptyState message="Ticket not found." />;
  }

  const messages = Array.isArray(ticket.messages) ? ticket.messages : [];

  return (
    <div>
      <PageHeader title={ticket.subject} />

      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '20px' }}>
        <Badge value={ticket.status} label={statusLabel(ticket.status)} />
        <Badge value={ticket.priority} label={priorityLabel(ticket.priority)} />
        {ticket.category && (
          <span style={{ fontSize: '12px', color: 'var(--foreground-muted)' }}>{ticket.category}</span>
        )}
      </div>

      {actionError && (
        <div role="alert" style={{ background: 'var(--danger-light)', color: 'var(--danger)', padding: '12px 16px', borderRadius: 10, marginBottom: '16px', fontSize: '14px', border: '1px solid var(--danger)' }}>
          {actionError}
        </div>
      )}
      {actionSuccess && (
        <div role="status" style={{ background: 'var(--success-light)', color: 'var(--success)', padding: '12px 16px', borderRadius: 10, marginBottom: '16px', fontSize: '14px', border: '1px solid var(--success)' }}>
          {actionSuccess}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Metadata */}
        <div style={CARD_STYLE}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--foreground-subtle)', marginBottom: '4px' }}>Reporter</div>
              <div style={{ color: 'var(--foreground)' }}>{ticket.reporter?.displayName || '—'}</div>
            </div>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--foreground-subtle)', marginBottom: '4px' }}>Created</div>
              <div style={{ color: 'var(--foreground)' }}>{formatDateTime(ticket.createdAt)}</div>
            </div>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--foreground-subtle)', marginBottom: '4px' }}>Last updated</div>
              <div style={{ color: 'var(--foreground)' }}>{formatDateTime(ticket.updatedAt)}</div>
            </div>
            {ticket.closedAt && (
              <div>
                <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--foreground-subtle)', marginBottom: '4px' }}>Closed</div>
                <div style={{ color: 'var(--foreground)' }}>{formatDateTime(ticket.closedAt)}</div>
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        <div style={CARD_STYLE}>
          <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--foreground-subtle)', marginBottom: '8px' }}>Description</div>
          <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6, color: 'var(--foreground)', overflowWrap: 'anywhere' }}>
            {ticket.description}
          </div>
        </div>

        {/* Controls */}
        <div style={CARD_STYLE}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', alignItems: 'flex-end' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--foreground-muted)' }}>Status</span>
              <SelectInput value={ticket.status} onChange={(v) => updateTicket({ status: v })} options={STATUS_OPTIONS} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--foreground-muted)' }}>Priority</span>
              <SelectInput value={ticket.priority} onChange={(v) => updateTicket({ priority: v })} options={PRIORITY_OPTIONS} />
            </div>
          </div>

          <div style={{ marginTop: '20px', borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--foreground-muted)', marginBottom: '8px' }}>Assignee</div>
            <div style={{ color: 'var(--foreground)', marginBottom: '12px' }}>
              {ticket.assignee?.displayName || 'Unassigned'}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
              {me?.id && me.id !== ticket.assignee?.id && (
                <button type="button" onClick={assignToMe} disabled={saving} style={{ padding: '8px 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--surface-muted)', color: 'var(--foreground)', fontWeight: 600, fontSize: '13px', cursor: 'pointer', opacity: saving ? 0.6 : 1 }}>
                  Assign to me
                </button>
              )}
              {ticket.assignee && (
                <button type="button" onClick={unassign} disabled={saving} style={{ padding: '8px 14px', borderRadius: 10, border: '1px solid var(--danger)', background: 'transparent', color: 'var(--danger)', fontWeight: 600, fontSize: '13px', cursor: 'pointer', opacity: saving ? 0.6 : 1 }}>
                  Unassign
                </button>
              )}
              <form onSubmit={assignCustom} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input
                  type="text"
                  value={assigneeId}
                  onChange={(e) => setAssigneeId(e.target.value)}
                  placeholder="Assign by user ID"
                  style={{ padding: '8px 12px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--foreground)', fontSize: '13px', outline: 'none' }}
                />
                <button type="submit" disabled={saving || !assigneeId.trim()} style={{ padding: '8px 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--surface-muted)', color: 'var(--foreground)', fontWeight: 600, fontSize: '13px', cursor: 'pointer', opacity: saving || !assigneeId.trim() ? 0.6 : 1 }}>
                  Assign
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Conversation */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--foreground)', margin: 0 }}>Conversation</h2>
          {messages.length === 0 ? (
            <div style={{ ...CARD_STYLE, textAlign: 'center', color: 'var(--foreground-muted)', fontSize: '14px' }}>
              No messages yet.
            </div>
          ) : (
            messages.map((m) => {
              const isNote = m.kind === 'NOTE';
              return (
                <div
                  key={m.id}
                  style={{
                    ...CARD_STYLE,
                    background: isNote ? 'var(--warning-light)' : 'var(--surface)',
                    borderColor: isNote ? 'var(--warning)' : 'var(--border)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', marginBottom: '8px', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--foreground)' }}>
                        {m.author?.displayName || 'Staff'}
                      </span>
                      <Badge value={m.kind} label={messageKindLabel(m.kind)} />
                    </div>
                    <span style={{ fontSize: '12px', color: 'var(--foreground-subtle)' }}>{formatDateTime(m.createdAt)}</span>
                  </div>
                  <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.55, color: 'var(--foreground)', overflowWrap: 'anywhere' }}>
                    {m.body}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Composer */}
        <div style={CARD_STYLE}>
          <form onSubmit={sendMessage} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setKind('REPLY')}
                style={{
                  padding: '8px 16px',
                  borderRadius: 10,
                  border: '1px solid var(--border)',
                  background: kind === 'REPLY' ? 'var(--primary)' : 'var(--surface-muted)',
                  color: kind === 'REPLY' ? '#fff' : 'var(--foreground-muted)',
                  fontWeight: 600,
                  fontSize: '13px',
                  cursor: 'pointer',
                }}
              >
                Public reply
              </button>
              <button
                type="button"
                onClick={() => setKind('NOTE')}
                style={{
                  padding: '8px 16px',
                  borderRadius: 10,
                  border: '1px solid var(--border)',
                  background: kind === 'NOTE' ? 'var(--warning)' : 'var(--surface-muted)',
                  color: kind === 'NOTE' ? '#1a1400' : 'var(--foreground-muted)',
                  fontWeight: 600,
                  fontSize: '13px',
                  cursor: 'pointer',
                }}
              >
                Internal note
              </button>
            </div>

            {kind === 'NOTE' && (
              <div style={{ fontSize: '12px', color: 'var(--warning)' }}>
                Internal notes are visible to staff only and are never shown to the reporter.
              </div>
            )}

            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={5000}
              placeholder={kind === 'REPLY' ? 'Write a reply to the reporter...' : 'Write an internal note...'}
              style={{
                width: '100%',
                minHeight: '120px',
                padding: '12px 14px',
                borderRadius: 10,
                border: '1px solid var(--border)',
                background: 'var(--surface)',
                color: 'var(--foreground)',
                fontSize: '14px',
                outline: 'none',
                resize: 'vertical',
                boxSizing: 'border-box',
              }}
              required
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="submit"
                disabled={sending || !message.trim()}
                style={{
                  padding: '10px 18px',
                  borderRadius: 10,
                  background: 'var(--primary)',
                  color: '#fff',
                  fontWeight: 600,
                  fontSize: '14px',
                  border: 'none',
                  cursor: 'pointer',
                  opacity: sending || !message.trim() ? 0.6 : 1,
                }}
              >
                {sending ? 'Sending...' : kind === 'NOTE' ? 'Add Note' : 'Send Reply'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
