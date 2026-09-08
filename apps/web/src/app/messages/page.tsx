'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Card from '../../components/Card';
import BackButton from '../../components/Navigation/BackButton';
import { MessageSquare } from 'lucide-react';

export default function MessagesInboxPage() {
  const router = useRouter();
  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/v1/messages/conversations');
        if (res.status === 401) { router.push('/login'); return; }
        if (res.ok) setConversations(await res.json());
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);

  const formatTime = (iso?: string) => {
    if (!iso) return '';
    try {
      const d = new Date(iso);
      const today = new Date();
      const sameDay = d.toDateString() === today.toDateString();
      return sameDay
        ? d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : d.toLocaleDateString([], { month: 'short', day: 'numeric' });
    } catch {
      return '';
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="page-header" style={{ marginBottom: '24px' }}>
        <BackButton fallback="/dashboard" />
        <div className="page-header-content">
          <h1 className="text-wrap-safe" style={{ fontSize: '32px', fontWeight: 800, color: 'var(--foreground)' }}>Messages</h1>
          <p style={{ color: 'var(--foreground-muted)' }}>Your private conversations.</p>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '60px', textAlign: 'center', color: 'var(--foreground-muted)' }}>Loading messages...</div>
      ) : conversations.length === 0 ? (
        <Card padding="lg" style={{ textAlign: 'center' }}>
          <MessageSquare size={40} color="var(--border)" style={{ margin: '0 auto 12px' }} />
          <h3 style={{ margin: '0 0 8px 0', color: 'var(--foreground)', fontSize: '18px' }}>No conversations yet</h3>
          <p style={{ margin: 0, color: 'var(--foreground-muted)' }}>
            Start a chat from a connection on your <Link href="/network" style={{ color: 'var(--primary)' }}>Network</Link> page.
          </p>
        </Card>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {conversations.map((c) => {
            const p = c.partner?.profile;
            if (!p) return null;
            return (
              <Link key={c.id} href={`/messages/${p.username}${c.listing ? `?conversation=${c.id}&listing=${c.listing.id}` : ''}`} style={{ textDecoration: 'none' }}>
                <Card padding="md" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--border)', flexShrink: 0, overflow: 'hidden' }}>
                    {p.avatarUrl && <img src={p.avatarUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontWeight: 700, color: 'var(--foreground)', fontSize: '16px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {p.displayName}
                      </span>
                      <span style={{ color: 'var(--foreground-muted)', fontSize: '12px', flexShrink: 0 }}>
                        {formatTime(c.lastMessage?.createdAt || c.updatedAt)}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                      <span style={{ color: 'var(--foreground-muted)', fontSize: '14px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {c.listing ? `🛒 ${c.listing.title} — ` : ''}{c.lastMessage ? c.lastMessage.body : 'No messages yet'}
                      </span>
                      {c.unreadCount > 0 && (
                        <span style={{ flexShrink: 0, background: 'var(--primary)', color: '#fff', fontSize: '12px', fontWeight: 700, minWidth: '20px', height: '20px', borderRadius: '10px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '0 6px' }}>
                          {c.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
