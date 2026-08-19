'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Badge from '../../components/Badge';

import DiscoverTabs from '../../components/Navigation/DiscoverTabs';
import BackButton from '../../components/Navigation/BackButton';

export default function NetworkPage() {
  const router = useRouter();
  
  const [connections, setConnections] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/v1/auth/me')
      .then(res => {
        if (!res.ok) throw new Error('Unauthenticated');
        return res.json();
      })
      .then(data => {
        setCurrentUserId(data.id);
        return Promise.all([
          fetch('/api/v1/connections').then(r => r.json()),
          fetch('/api/v1/connections/requests').then(r => r.json())
        ]);
      })
      .then(([connsData, reqsData]) => {
        setConnections(connsData);
        setRequests(reqsData);
        setLoading(false);
      })
      .catch(() => {
        router.push('/login');
      });
  }, [router]);

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

  if (loading) return <div style={{ padding: '60px', textAlign: 'center', color: 'var(--foreground-muted)' }}>Loading network...</div>;

  const incomingRequests = requests.filter(r => r.addressee.id === currentUserId && r.status === 'PENDING');
  const outgoingRequests = requests.filter(r => r.requester.id === currentUserId && r.status === 'PENDING');

  return (
    <div>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        <div className="page-header" style={{ marginBottom: '24px' }}>
          <BackButton fallback="/dashboard" />
          <div className="page-header-content">
            <h1 className="text-wrap-safe" style={{ fontSize: '32px', fontWeight: 800, color: 'var(--foreground)' }}>Network</h1>
            <p style={{ color: 'var(--foreground-muted)' }}>Manage your professional connections.</p>
          </div>
        </div>
        
        <DiscoverTabs />

        {incomingRequests.length > 0 && (
          <div style={{ marginBottom: '48px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--foreground)', margin: '0 0 16px 0' }}>Pending Requests</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {incomingRequests.map(req => (
                <Card key={req.id} padding="md" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--border)', flexShrink: 0 }}></div>
                    <div>
                      <Link href={`/developers/${req.requester.profile.username}`} style={{ fontWeight: 700, textDecoration: 'none', color: 'var(--foreground)', fontSize: '16px', display: 'block', marginBottom: '2px' }}>
                        {req.requester.profile.displayName}
                      </Link>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <span style={{ color: 'var(--foreground-muted)', fontSize: '13px' }}>@{req.requester.profile.username}</span>
                        <Badge variant="outline">{req.requester.profile.experienceLevel}</Badge>
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <Button onClick={() => handleAction(req.id, 'accept')} variant="primary" size="sm">Accept</Button>
                    <Button onClick={() => handleAction(req.id, 'reject')} variant="outline" size="sm">Reject</Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {outgoingRequests.length > 0 && (
          <div style={{ marginBottom: '48px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--foreground)', margin: '0 0 16px 0' }}>Outgoing Requests</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {outgoingRequests.map(req => (
                <Card key={req.id} padding="md" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--border)', flexShrink: 0 }}></div>
                    <div>
                      <Link href={`/developers/${req.addressee.profile.username}`} style={{ fontWeight: 700, textDecoration: 'none', color: 'var(--foreground)', fontSize: '16px', display: 'block', marginBottom: '2px' }}>
                        {req.addressee.profile.displayName}
                      </Link>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <span style={{ color: 'var(--foreground-muted)', fontSize: '13px' }}>@{req.addressee.profile.username}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <Button onClick={() => handleAction(req.id, 'delete')} variant="ghost" size="sm">Cancel Request</Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--foreground)', marginBottom: '16px' }}>My Connections</h2>
          {connections.length === 0 ? (
            <Card padding="md" style={{ textAlign: 'center' }}>
              <p style={{ color: 'var(--foreground-muted)' }}>You don't have any connections yet.</p>
            </Card>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {connections.map(conn => {
                const partner = conn.requester.id === currentUserId ? conn.addressee : conn.requester;
                return (
                  <Card key={conn.id} padding="md" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                      <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--border)', flexShrink: 0 }}></div>
                      <div>
                        <Link href={`/developers/${partner.profile.username}`} style={{ fontWeight: 700, textDecoration: 'none', color: 'var(--foreground)', fontSize: '16px', display: 'block', marginBottom: '2px' }}>
                          {partner.profile.displayName}
                        </Link>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <span style={{ color: 'var(--foreground-muted)', fontSize: '13px' }}>@{partner.profile.username}</span>
                          <Badge variant="outline">{partner.profile.experienceLevel}</Badge>
                        </div>
                      </div>
                    </div>
                    <div>
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
