'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Card from '../../../components/Card';
import Button from '../../../components/Button';
import EmptyState from '../../../components/EmptyState';
import Skeleton from '../../../components/Skeleton';
import Avatar from '../../../components/Avatar';
import BackButton from '../../../components/Navigation/BackButton';
import { StatusBadge, PriorityBadge } from '../../../components/SupportBadges';
import { useRequireAuth } from '../../../components/Auth/useRequireAuth';
import { LifeBuoy, Send } from 'lucide-react';
import {
  extractErrorMessage,
  type DeveloperTicketDetail,
  type DeveloperTicketMessage,
} from '../../../lib/support';

function formatDateTime(value: string | null | undefined): string {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function authorLabel(message: DeveloperTicketMessage, currentUserId?: string): string {
  if (currentUserId && message.authorId === currentUserId) return 'You';
  if (message.isStaff) return message.author?.displayName || 'Support Team';
  return message.author?.displayName || 'Developer';
}

export default function SupportTicketPage() {
  const router = useRouter();
  const params = useParams<{ id: string | string[] }>();
  const id = typeof params?.id === 'string' ? params.id : '';

  const { user: currentUser, loading: authLoading, isAuthenticated } = useRequireAuth('/login');

  const [ticket, setTicket] = useState<DeveloperTicketDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [loadError, setLoadError] = useState('');

  const [reply, setReply] = useState('');
  const [replyError, setReplyError] = useState('');
  const [sending, setSending] = useState(false);

  const loadTicket = () => {
    if (!id) return;
    fetch(`/api/v1/support/tickets/${id}`)
      .then(async (res) => {
        if (res.status === 401) {
          router.replace('/login');
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
        setTicket((await res.json()) as DeveloperTicketDetail);
        setLoadError('');
        setNotFound(false);
      })
      .catch(() => {
        setLoadError('Unable to load this ticket. Please try again.');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (authLoading || !isAuthenticated) return;
    loadTicket();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, isAuthenticated, id]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const body = reply.trim();
    if (!body) {
      setReplyError('Please enter a message.');
      return;
    }

    setSending(true);
    setReplyError('');
    try {
      const res = await fetch(`/api/v1/support/tickets/${id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body }),
      });

      if (res.status === 401) {
        router.replace('/login');
        return;
      }

      const responseBody = await res.json().catch(() => null);

      if (res.status === 429) {
        setReplyError(
          extractErrorMessage(responseBody) ??
            'You are replying too quickly. Please wait a moment and try again.',
        );
        return;
      }

      if (!res.ok) {
        setReplyError(extractErrorMessage(responseBody) ?? 'Unable to send your reply. Please try again.');
        return;
      }

      setReply('');
      loadTicket();
    } catch {
      setReplyError('Unable to send your reply. Please try again.');
    } finally {
      setSending(false);
    }
  };

  if (authLoading || !isAuthenticated || loading) {
    return (
      <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Skeleton width="60%" maxWidth={360} height={30} />
        <Skeleton width="40%" maxWidth={240} height={14} style={{ marginBottom: '16px' }} />
        <Card padding="md" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Skeleton width="100%" height={16} />
          <Skeleton width="90%" height={13} />
          <Skeleton width="70%" height={13} />
        </Card>
      </div>
    );
  }

  if (notFound) {
    return (
      <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>
        <EmptyState
          icon={LifeBuoy}
          title="Ticket not found"
          description="This ticket does not exist or you do not have permission to view it."
          action={
            <Button variant="primary" onClick={() => router.push('/support')}>
              Back to Support
            </Button>
          }
        />
      </div>
    );
  }

  if (loadError) {
    return (
      <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>
        <EmptyState
          icon={LifeBuoy}
          title="Something went wrong"
          description={loadError}
          action={
            <Button variant="primary" onClick={() => { setLoading(true); setLoadError(''); setNotFound(false); loadTicket(); }}>
              Try Again
            </Button>
          }
        />
      </div>
    );
  }

  if (!ticket) {
    return (
      <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>
        <EmptyState
          icon={LifeBuoy}
          title="Ticket not found"
          description="This ticket does not exist or you do not have permission to view it."
          action={
            <Button variant="primary" onClick={() => router.push('/support')}>
              Back to Support
            </Button>
          }
        />
      </div>
    );
  }

  const messages = Array.isArray(ticket.messages) ? ticket.messages : [];

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '60px' }}>
      {/* Header */}
      <div className="page-header">
        <BackButton fallback="/support" />
        <div className="page-header-content" style={{ flex: 1 }}>
          <h1 className="text-wrap-safe" style={{ color: 'var(--foreground)', margin: '0 0 8px 0' }}>
            {ticket.subject}
          </h1>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
            <StatusBadge value={ticket.status} />
            <PriorityBadge value={ticket.priority} />
            {ticket.category && (
              <span
                style={{
                  fontSize: '12px',
                  color: 'var(--foreground-muted)',
                  background: 'var(--surface-hover)',
                  padding: '3px 10px',
                  borderRadius: 'var(--radius-full)',
                  fontWeight: 600,
                }}
              >
                {ticket.category}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Original description */}
      <Card padding="lg">
        <div style={{ fontSize: '13px', color: 'var(--foreground-subtle)', marginBottom: '12px' }}>
          Opened {formatDateTime(ticket.createdAt) || '—'}
        </div>
        <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6, color: 'var(--foreground)', overflowWrap: 'anywhere' }}>
          {ticket.description}
        </div>
      </Card>

      {/* Conversation */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--foreground)', margin: 0 }}>
          {messages.length} {messages.length === 1 ? 'Reply' : 'Replies'}
        </h2>

        {messages.length === 0 ? (
          <Card padding="md" style={{ textAlign: 'center', color: 'var(--foreground-muted)', fontSize: '14px' }}>
            No replies yet. Our team will respond here.
          </Card>
        ) : (
          messages.map((message) => {
            const isOwn = Boolean(currentUser && message.authorId === currentUser.id);
            return (
              <Card key={message.id} padding="md" style={{ display: 'flex', gap: '14px' }}>
                <Avatar name={authorLabel(message, currentUser?.id)} size={36} />
                <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px' }}>
                    <strong style={{ fontSize: '14px', color: 'var(--foreground)' }}>
                      {authorLabel(message, currentUser?.id)}
                    </strong>
                    {message.isStaff && (
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          letterSpacing: '0.04em',
                          color: 'var(--primary)',
                          background: 'var(--primary-light)',
                          padding: '2px 8px',
                          borderRadius: 'var(--radius-full)',
                        }}
                      >
                        Support
                      </span>
                    )}
                    {isOwn && (
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          color: 'var(--foreground-muted)',
                          background: 'var(--surface-hover)',
                          padding: '2px 8px',
                          borderRadius: 'var(--radius-full)',
                        }}
                      >
                        You
                      </span>
                    )}
                  </div>
                  <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.55, color: 'var(--foreground)', overflowWrap: 'anywhere' }}>
                    {message.body}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--foreground-subtle)' }}>
                    {formatDateTime(message.createdAt) || '—'}
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </section>

      {/* Reply composer */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--foreground)', margin: 0 }}>
          Add a reply
        </h2>
        <form onSubmit={handleSend} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {replyError && (
            <div
              role="alert"
              style={{
                background: 'var(--danger-light)',
                color: 'var(--danger)',
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                fontSize: '14px',
                border: '1px solid var(--danger)',
              }}
            >
              {replyError}
            </div>
          )}
          <textarea
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            maxLength={5000}
            placeholder="Write your reply..."
            aria-label="Reply message"
            style={{
              width: '100%',
              minHeight: '120px',
              padding: '12px 16px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)',
              background: 'var(--background)',
              color: 'var(--foreground)',
              fontSize: '15px',
              outline: 'none',
              resize: 'vertical',
              boxSizing: 'border-box',
            }}
            required
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="primary" type="submit" disabled={sending || !reply.trim()}>
              <Send size={16} />
              {sending ? 'Sending...' : 'Send Reply'}
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
}
