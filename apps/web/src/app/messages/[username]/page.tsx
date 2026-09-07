'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from '../../../components/Button';
import BackButton from '../../../components/Navigation/BackButton';
import { Send } from 'lucide-react';

export default function ChatPage() {
  const router = useRouter();
  const params = useParams();
  const username = params.username as string;

  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [partner, setPartner] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const conversationIdRef = useRef<string | null>(null);

  // Initial load: identify current user + open/create the conversation thread.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const meRes = await fetch('/api/v1/auth/me');
        if (!meRes.ok) { router.push('/login'); return; }
        const me = await meRes.json();
        if (cancelled) return;
        setCurrentUserId(me.id);

        const res = await fetch(`/api/v1/messages/with/${encodeURIComponent(username)}`);
        if (!res.ok) throw new Error('Unable to open this conversation');
        const data = await res.json();
        if (cancelled) return;
        setConversationId(data.id);
        conversationIdRef.current = data.id;
        setPartner(data.partner);
        setMessages(data.messages || []);
      } catch (e: any) {
        if (!cancelled) setError(e.message || 'Something went wrong');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [username, router]);

  // Poll for new messages while the tab is visible.
  useEffect(() => {
    if (!conversationId) return;
    const poll = async () => {
      if (document.hidden) return;
      try {
        const res = await fetch(`/api/v1/messages/${conversationId}`);
        if (res.ok) {
          const data = await res.json();
          setMessages(data.messages || []);
        }
      } catch {
        /* transient network errors are ignored; next tick retries */
      }
    };
    const id = setInterval(poll, 4000);
    return () => clearInterval(id);
  }, [conversationId]);

  // Keep the view pinned to the latest message.
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages.length]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const text = draft.trim();
    if (!text || sending || !conversationId) return;
    setSending(true);
    setDraft('');
    try {
      const res = await fetch(`/api/v1/messages/${conversationId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body: text }),
      });
      if (res.ok) {
        const msg = await res.json();
        setMessages(prev => [...prev, msg]);
      } else {
        setDraft(text); // restore on failure
      }
    } catch {
      setDraft(text);
    } finally {
      setSending(false);
    }
  };

  const formatTime = (iso: string) => {
    try {
      return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <style>{`
        .chat-scroll { height: calc(100dvh - 300px); min-height: 260px; }
        @media (min-width: 1024px) { .chat-scroll { height: calc(100dvh - 240px); } }
      `}</style>

      <div className="page-header" style={{ marginBottom: '16px', alignItems: 'center' }}>
        <BackButton fallback="/messages" />
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--border)', flexShrink: 0, overflow: 'hidden' }}>
            {partner?.profile?.avatarUrl && (
              <img src={partner.profile.avatarUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            )}
          </div>
          <div style={{ minWidth: 0 }}>
            {partner?.profile ? (
              <Link href={`/developers/${partner.profile.username}`} style={{ fontWeight: 700, color: 'var(--foreground)', textDecoration: 'none', fontSize: '18px', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {partner.profile.displayName}
              </Link>
            ) : (
              <span style={{ fontWeight: 700, color: 'var(--foreground)', fontSize: '18px' }}>Chat</span>
            )}
            {partner?.profile && (
              <span style={{ color: 'var(--foreground-muted)', fontSize: '13px' }}>@{partner.profile.username}</span>
            )}
          </div>
        </div>
      </div>

      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Messages */}
        <div ref={scrollRef} className="chat-scroll" style={{ overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {loading ? (
            <div style={{ margin: 'auto', color: 'var(--foreground-muted)' }}>Loading conversation...</div>
          ) : error ? (
            <div style={{ margin: 'auto', color: '#ef4444', textAlign: 'center' }}>{error}</div>
          ) : messages.length === 0 ? (
            <div style={{ margin: 'auto', color: 'var(--foreground-muted)', textAlign: 'center' }}>
              No messages yet. Say hello 👋
            </div>
          ) : (
            messages.map((m) => {
              const mine = m.senderId === currentUserId;
              return (
                <div key={m.id} style={{ display: 'flex', justifyContent: mine ? 'flex-end' : 'flex-start' }}>
                  <div style={{
                    maxWidth: '75%',
                    padding: '10px 14px',
                    borderRadius: '16px',
                    borderBottomRightRadius: mine ? '4px' : '16px',
                    borderBottomLeftRadius: mine ? '16px' : '4px',
                    background: mine ? 'var(--primary)' : 'var(--background)',
                    color: mine ? '#ffffff' : 'var(--foreground)',
                    border: mine ? 'none' : '1px solid var(--border)',
                    fontSize: '15px',
                    lineHeight: 1.5,
                    wordBreak: 'break-word',
                    whiteSpace: 'pre-wrap',
                  }}>
                    {m.body}
                    <div style={{ fontSize: '11px', marginTop: '4px', opacity: 0.7, textAlign: 'right', color: mine ? '#ffffff' : 'var(--foreground-muted)' }}>
                      {formatTime(m.createdAt)}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Composer */}
        <form onSubmit={handleSend} style={{ display: 'flex', gap: '8px', padding: '12px', borderTop: '1px solid var(--border)', background: 'var(--surface)' }}>
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={partner?.profile ? `Message ${partner.profile.displayName}...` : 'Type a message...'}
            disabled={loading || !!error}
            aria-label="Message"
            style={{
              flex: 1,
              padding: '12px 16px',
              borderRadius: '999px',
              border: '1px solid var(--border)',
              background: 'var(--background)',
              color: 'var(--foreground)',
              fontSize: '15px',
              outline: 'none',
            }}
          />
          <Button type="submit" variant="primary" disabled={sending || !draft.trim() || loading || !!error} aria-label="Send" style={{ borderRadius: '999px', padding: '0 18px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Send size={18} />
          </Button>
        </form>
      </div>
    </div>
  );
}
