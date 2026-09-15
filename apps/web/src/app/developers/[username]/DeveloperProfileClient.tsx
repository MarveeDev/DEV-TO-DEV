'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Avatar from '../../../components/Avatar';
import SkillTag from '../../../components/SkillTag';
import DeveloperScoreBoard from '../../../components/DeveloperScoreBoard';
import PostCard from '../../../components/PostCard';
import Card from '../../../components/Card';
import Button from '../../../components/Button';
import Badge from '../../../components/Badge';
import BackButton from '../../../components/Navigation/BackButton';
import { useCurrentUser } from '../../../components/Auth/CurrentUserProvider';
import { ProfileSkeleton, PostCardSkeleton } from '../../../components/skeletons';
import EmptyState from '../../../components/EmptyState';
import { FileText, MapPin, Globe, ExternalLink } from 'lucide-react';

export default function DeveloperProfileClient({
  username,
  initialProfile,
}: {
  username: string;
  initialProfile: any | null;
}) {
  const router = useRouter();
  const { isAuthenticated } = useCurrentUser();

  const [developer, setDeveloper] = useState<any>(initialProfile);
  const [loading, setLoading] = useState(initialProfile === null);
  const [notFound, setNotFound] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<string>('NONE');

  useEffect(() => {
    let cancelled = false;

    const loadAuth = async () => {
      if (!isAuthenticated) return;
      try {
        const devRes = await fetch(`/api/v1/developers/${encodeURIComponent(username)}`);
        if (devRes.ok) {
          const devData = await devRes.json();
          if (!cancelled) {
            setDeveloper((prev: any) => ({ ...(prev ?? {}), ...devData }));
            setConnectionStatus(devData.publicConnectionStatus || 'NONE');
          }
        }
      } catch {
        // ignore; public profile is still shown
      }
    };

    const loadPublic = async () => {
      try {
        const res = await fetch(`/api/v1/developers/public/${encodeURIComponent(username)}`);
        if (res.ok) {
          const data = await res.json();
          if (!cancelled) setDeveloper(data);
        } else if (!initialProfile) {
          if (!cancelled) setNotFound(true);
        }
      } catch {
        if (!cancelled) setNotFound(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadAuth();
    if (initialProfile === null) {
      loadPublic();
    } else {
      setLoading(false);
    }

    return () => {
      cancelled = true;
    };
  }, [username, isAuthenticated]);

  const handleConnect = async () => {
    try {
      const res = await fetch(`/api/v1/connections/${encodeURIComponent(username)}`, { method: 'POST' });
      if (res.ok) {
        setConnectionStatus('PENDING');
      } else if (res.status === 401) {
        router.push('/login');
      } else {
        const errData = await res.json().catch(() => ({}));
        alert(errData.message || 'Failed to send request');
      }
    } catch (err) {
      alert('Network error');
    }
  };

  if (loading) return <ProfileSkeleton />;
  if (notFound && !developer) return <div style={{ padding: '60px', textAlign: 'center', color: '#ef4444' }}>Developer not found.</div>;
  if (!developer) return null;

  return (
    <div>
      <div>
        <div className="grid-2-col-sidebar">

          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <Card padding="md">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '24px' }}>
                <div className="page-header" style={{ alignItems: 'center' }}>
                  <BackButton fallback="/developers" />
                  <Avatar src={developer.avatarUrl} name={developer.displayName} size={80} />
                  <div className="page-header-content">
                    <h1 className="text-wrap-safe" style={{ fontSize: '28px', fontWeight: 800, color: 'var(--foreground)' }}>{developer.displayName || 'Unknown Developer'}</h1>
                    <p style={{ color: 'var(--foreground-muted)', fontSize: '15px', margin: '0 0 8px 0' }}>@{developer.username}</p>
                    {developer.experienceLevel && (
                      <Badge variant="outline" style={{ textTransform: 'capitalize' }}>{developer.experienceLevel?.toLowerCase()}</Badge>
                    )}
                  </div>
                </div>

                <div>
                  {isAuthenticated && connectionStatus === 'NONE' && (
                    <Button onClick={handleConnect} variant="primary">Connect</Button>
                  )}
                  {isAuthenticated && connectionStatus === 'PENDING' && (
                    <Button variant="outline" disabled>Request Sent</Button>
                  )}
                  {isAuthenticated && connectionStatus === 'INCOMING_REQUEST' && (
                    <Button variant="outline" disabled>Incoming Request</Button>
                  )}
                  {isAuthenticated && connectionStatus === 'ACCEPTED' && (
                    <Button variant="secondary" disabled>✓ Connected</Button>
                  )}
                </div>
              </div>

              {(developer.location || developer.websiteUrl || developer.githubUrl) && (
                <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {developer.location && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'var(--foreground-muted)' }}>
                      <MapPin size={16} color="var(--foreground-subtle)" />
                      <span>{developer.location}</span>
                    </div>
                  )}
                  {(developer.websiteUrl || developer.githubUrl) && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                      {developer.websiteUrl && (
                        <a
                          href={developer.websiteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontWeight: 600, color: 'var(--primary)', textDecoration: 'none' }}
                        >
                          <Globe size={16} />
                          Website
                        </a>
                      )}
                      {developer.githubUrl && (
                        <a
                          href={developer.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontWeight: 600, color: 'var(--primary)', textDecoration: 'none' }}
                        >
                          <ExternalLink size={16} />
                          GitHub
                        </a>
                      )}
                    </div>
                  )}
                </div>
              )}

              {developer.bio && (
                <div style={{ marginTop: '32px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px', color: 'var(--foreground)' }}>About</h3>
                  <p style={{ fontSize: '15px', lineHeight: 1.6, color: 'var(--foreground)', margin: 0 }}>{developer.bio}</p>
                </div>
              )}

              {developer.skills && developer.skills.length > 0 && (
                <div style={{ marginTop: '32px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px', color: 'var(--foreground)' }}>Skills</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {developer.skills.map((s: any) => (
                      <SkillTag
                        key={s.id || s.slug || s.name}
                        name={s.name}
                        slug={s.slug}
                      />
                    ))}
                  </div>
                </div>
              )}

              {developer.learningGoals && developer.learningGoals.length > 0 && (
                <div style={{ marginTop: '32px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px', color: 'var(--foreground)' }}>Learning Goals</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {developer.learningGoals.map((g: any) => (
                      <Badge key={g.id || g.slug || g.name} variant="outline">{g.name}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </Card>

            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--foreground)', margin: '0 0 16px 0' }}>Contributions</h2>
              <DeveloperPosts username={developer.username} />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <DeveloperScoreBoard username={developer.username} />
          </div>

        </div>
      </div>
    </div>
  );
}

function DeveloperPosts({ username }: { username: string }) {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/v1/posts?username=${username}&limit=10`)
      .then(res => res.ok ? res.json() : { data: [] })
      .then(data => {
        setPosts(data.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [username]);

  if (loading) return (
    <div role="status">
      <span className="sr-only">Loading posts…</span>
      <PostCardSkeleton />
      <PostCardSkeleton />
    </div>
  );
  if (posts.length === 0) return <EmptyState icon={FileText} title="No posts yet" description="This developer hasn't shared any public posts." />;

  return (
    <div>
      {posts.map(post => (
        <PostCard key={post.id} {...post} />
      ))}
    </div>
  );
}
