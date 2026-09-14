'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Badge from '../../components/Badge';
import Avatar from '../../components/Avatar';
import EmptyState from '../../components/EmptyState';

import DiscoverTabs from '../../components/Navigation/DiscoverTabs';
import BackButton from '../../components/Navigation/BackButton';
import { useCurrentUser } from '../../components/Auth/CurrentUserProvider';
import { Users } from 'lucide-react';
import { DeveloperCardSkeleton } from '../../components/skeletons';

export default function NetworkPage() {
  const router = useRouter();
  const { user, loading: authLoading, isAuthenticated } = useCurrentUser();

  const [connections, setConnections] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const currentUserId = user?.id ?? null;

  const autoScrollPausedRef = useRef(false);
  const autoScrollCooldownRef = useRef(0);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated || !user) {
      router.push('/login');
      return;
    }
    Promise.all([
      fetch('/api/v1/connections').then(r => r.json()),
      fetch('/api/v1/connections/requests').then(r => r.json())
    ])
      .then(([connsData, reqsData]) => {
        setConnections(connsData);
        setRequests(reqsData);
        setLoading(false);
      })
      .catch(() => {
        router.push('/login');
      });
  }, [authLoading, isAuthenticated, user, router]);

  const handleAction = async (id: string, action: 'accept' | 'reject' | 'delete') => {
    try {
      const url = action === 'delete' ? `/api/v1/connections/${id}` : `/api/v1/connections/${id}/${action}`;
      const method = action === 'delete' ? 'DELETE' : 'PATCH';

      const res = await fetch(url, { method });
      if (res.ok) {
        if (action === 'accept') {
          const req = requests.find(r => r.id === id);
          if (req) {
            setRequests(prev => prev.filter(r => r.id !== id));
            setConnections(prev => [...prev, { ...req, status: 'ACCEPTED' }]);
          }
        } else if (action === 'reject') {
          setRequests(prev => prev.filter(r => r.id !== id));
        } else if (action === 'delete') {
          setConnections(prev => prev.filter(c => c.id !== id));
          setRequests(prev => prev.filter(r => r.id !== id));
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (loading || typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let rafId = 0;
    const SPEED = 0.4;

    const scrollableDistance = () =>
      document.documentElement.scrollHeight - window.innerHeight;
    const cooldown = (ms: number) => {
      autoScrollCooldownRef.current = Date.now() + ms;
    };

    const step = () => {
      const paused = autoScrollPausedRef.current || Date.now() < autoScrollCooldownRef.current;
      if (!paused && scrollableDistance() > 4) {
        if (window.scrollY >= scrollableDistance() - 1) {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          cooldown(1200);
        } else {
          window.scrollBy(0, SPEED);
        }
      }
      rafId = requestAnimationFrame(step);
    };
    rafId = requestAnimationFrame(step);

    const onTouchStart = () => { autoScrollPausedRef.current = true; };
    const onTouchEnd = () => { autoScrollPausedRef.current = false; cooldown(2000); };
    const onWheel = () => cooldown(2000);
    const onKeyDown = (e: KeyboardEvent) => {
      if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' ', 'Tab'].includes(e.key)) {
        cooldown(2000);
      }
    };
    const onVisibility = () => { autoScrollPausedRef.current = document.hidden; };

    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    window.addEventListener('wheel', onWheel, { passive: true });
    window.addEventListener('keydown', onKeyDown);
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [loading]);

  if (loading) return (
    <div role="status" style={{ maxWidth: 800, margin: '0 auto' }}>
      <span className="sr-only">Loading network…</span>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <DeveloperCardSkeleton />
        <DeveloperCardSkeleton />
        <DeveloperCardSkeleton />
        <DeveloperCardSkeleton />
      </div>
    </div>
  );

  const incomingRequests = requests.filter(r => r.addressee.id === currentUserId && r.status === 'PENDING');
  const outgoingRequests = requests.filter(r => r.requester.id === currentUserId && r.status === 'PENDING');

  return (
    <div
      onMouseEnter={() => { autoScrollPausedRef.current = true; }}
      onMouseLeave={() => { autoScrollPausedRef.current = false; }}
    >
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <div className="page-header" style={{ marginBottom: 24 }}>
          <BackButton fallback="/dashboard" />
          <div className="page-header-content">
            <h1 className="text-wrap-safe" style={{ color: 'var(--foreground)' }}>Network</h1>
            <p style={{ color: 'var(--foreground-muted)' }}>Manage your professional connections.</p>
          </div>
        </div>

        <DiscoverTabs />

        {incomingRequests.length > 0 && (
          <div style={{ marginBottom: 40 }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--foreground)', margin: '0 0 16px 0' }}>Pending Requests</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {incomingRequests.map(req => (
                <Card key={req.id} padding="md" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
                  <div style={{ display: 'flex', gap: 16, alignItems: 'center', minWidth: 0 }}>
                    <Avatar src={req.requester.profile.avatarUrl} name={req.requester.profile.displayName} size={48} />
                    <div style={{ minWidth: 0 }}>
                      <Link href={`/developers/${req.requester.profile.username}`} style={{ fontWeight: 700, textDecoration: 'none', color: 'var(--foreground)', fontSize: 16, display: 'block', marginBottom: 2 }}>
                        {req.requester.profile.displayName}
                      </Link>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <span style={{ color: 'var(--foreground-subtle)', fontSize: 13 }}>@{req.requester.profile.username}</span>
                        <Badge variant="outline">{req.requester.profile.experienceLevel}</Badge>
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <Button onClick={() => handleAction(req.id, 'accept')} variant="primary" size="sm">Accept</Button>
                    <Button onClick={() => handleAction(req.id, 'reject')} variant="outline" size="sm">Reject</Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {outgoingRequests.length > 0 && (
          <div style={{ marginBottom: 40 }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--foreground)', margin: '0 0 16px 0' }}>Outgoing Requests</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {outgoingRequests.map(req => (
                <Card key={req.id} padding="md" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
                  <div style={{ display: 'flex', gap: 16, alignItems: 'center', minWidth: 0 }}>
                    <Avatar src={req.addressee.profile.avatarUrl} name={req.addressee.profile.displayName} size={48} />
                    <div style={{ minWidth: 0 }}>
                      <Link href={`/developers/${req.addressee.profile.username}`} style={{ fontWeight: 700, textDecoration: 'none', color: 'var(--foreground)', fontSize: 16, display: 'block', marginBottom: 2 }}>
                        {req.addressee.profile.displayName}
                      </Link>
                      <span style={{ color: 'var(--foreground-subtle)', fontSize: 13 }}>@{req.addressee.profile.username}</span>
                    </div>
                  </div>
                  <Button onClick={() => handleAction(req.id, 'delete')} variant="ghost" size="sm">Cancel Request</Button>
                </Card>
              ))}
            </div>
          </div>
        )}

        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--foreground)', marginBottom: 16 }}>My Connections</h2>
          {connections.length === 0 ? (
            <EmptyState icon={Users} title="No connections yet" description="Discover developers and send connection requests to grow your network." />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {connections.map(conn => {
                const partner = conn.requester.id === currentUserId ? conn.addressee : conn.requester;
                return (
                  <Card key={conn.id} padding="md" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
                    <div style={{ display: 'flex', gap: 16, alignItems: 'center', minWidth: 0 }}>
                      <Avatar src={partner.profile.avatarUrl} name={partner.profile.displayName} size={48} />
                      <div style={{ minWidth: 0 }}>
                        <Link href={`/developers/${partner.profile.username}`} style={{ fontWeight: 700, textDecoration: 'none', color: 'var(--foreground)', fontSize: 16, display: 'block', marginBottom: 2 }}>
                          {partner.profile.displayName}
                        </Link>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                          <span style={{ color: 'var(--foreground-subtle)', fontSize: 13 }}>@{partner.profile.username}</span>
                          <Badge variant="outline">{partner.profile.experienceLevel}</Badge>
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <Link href={`/messages/${partner.profile.username}`} style={{ textDecoration: 'none' }}>
                        <Button variant="primary" size="sm">Message</Button>
                      </Link>
                      <Button onClick={() => handleAction(conn.id, 'delete')} variant="outline" size="sm">Remove</Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
