'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import DeveloperScoreBoard from '../../../components/DeveloperScoreBoard';
import PostCard from '../../../components/PostCard';
import Card from '../../../components/Card';
import Button from '../../../components/Button';
import Badge from '../../../components/Badge';
import BackButton from '../../../components/Navigation/BackButton';

export default function PublicDeveloperProfilePage() {
  const { username } = useParams();
  const router = useRouter();
  
  const [developer, setDeveloper] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [connectionStatus, setConnectionStatus] = useState<string>('NONE');

  useEffect(() => {
    fetch(`/api/v1/developers/${username}`)
      .then(res => {
        if (res.status === 401) {
          router.push('/login');
          throw new Error('Unauthenticated');
        }
        if (!res.ok) throw new Error('Developer not found');
        return res.json();
      })
      .then(data => {
        setDeveloper(data);
        setConnectionStatus(data.publicConnectionStatus);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [username, router]);

  const handleConnect = async () => {
    try {
      const res = await fetch(`/api/v1/connections/${username}`, { method: 'POST' });
      if (res.ok) {
        setConnectionStatus('PENDING');
      } else {
        const errData = await res.json();
        alert(errData.message || 'Failed to send request');
      }
    } catch (err) {
      alert('Network error');
    }
  };

  if (loading) return <div style={{ padding: '60px', textAlign: 'center', color: 'var(--foreground-muted)' }}>Loading...</div>;
  if (error) return <div style={{ padding: '60px', textAlign: 'center', color: '#ef4444' }}>{error}</div>;
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
                  <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--border)', flexShrink: 0 }}></div>
                  <div className="page-header-content">
                    <h1 className="text-wrap-safe" style={{ fontSize: '28px', fontWeight: 800, color: 'var(--foreground)' }}>{developer.displayName || 'Unknown Developer'}</h1>
                    <p style={{ color: 'var(--foreground-muted)', fontSize: '15px', margin: '0 0 8px 0' }}>@{developer.username}</p>
                    <Badge variant="outline" style={{ textTransform: 'capitalize' }}>{developer.experienceLevel?.toLowerCase()}</Badge>
                  </div>
                </div>
                
                <div>
                  {connectionStatus === 'NONE' && (
                    <Button onClick={handleConnect} variant="primary">Connect</Button>
                  )}
                  {connectionStatus === 'PENDING' && (
                    <Button variant="outline" disabled>Request Sent</Button>
                  )}
                  {connectionStatus === 'INCOMING_REQUEST' && (
                    <Button variant="outline" disabled>Incoming Request</Button>
                  )}
                  {connectionStatus === 'ACCEPTED' && (
                    <Button variant="secondary" disabled>✓ Connected</Button>
                  )}
                </div>
              </div>

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
                      <Badge 
                        key={s.id} 
                        variant="default"
                        style={{ cursor: 'pointer' }}
                        onClick={(e: React.MouseEvent) => {
                          e.preventDefault();
                          router.push(`/skills/${s.slug || s.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`);
                        }}
                      >
                        {s.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {developer.learningGoals && developer.learningGoals.length > 0 && (
                <div style={{ marginTop: '32px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px', color: 'var(--foreground)' }}>Learning Goals</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {developer.learningGoals.map((g: any) => (
                      <Badge key={g.id} variant="outline">{g.name}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </Card>

            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--foreground)', marginBottom: '16px', margin: '0 0 16px 0' }}>Contributions</h2>
              <DeveloperPosts username={developer.username} />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {developer.matchData && (developer.matchData.sharedSkills > 0 || developer.matchData.sharedLearningGoals > 0 || developer.matchData.complementarySkills?.length > 0) && (
              <Card padding="md" style={{ background: 'var(--primary-light)', border: '1px solid var(--primary)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Compatibility</div>
                  <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--primary)' }}>{developer.matchData.compatibilityScore}%</div>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {developer.matchData.sharedSkills > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                      <span style={{ color: 'var(--foreground-muted)' }}>Shared Skills</span>
                      <strong style={{ color: 'var(--foreground)' }}>{developer.matchData.sharedSkills}</strong>
                    </div>
                  )}
                  
                  {developer.matchData.sharedLearningGoals > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                      <span style={{ color: 'var(--foreground-muted)' }}>Shared Goals</span>
                      <strong style={{ color: 'var(--foreground)' }}>{developer.matchData.sharedLearningGoals}</strong>
                    </div>
                  )}
                  
                  {developer.matchData.complementarySkills && developer.matchData.complementarySkills.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '14px' }}>
                      <span style={{ color: 'var(--foreground-muted)' }}>Complementary</span>
                      <strong style={{ color: 'var(--foreground)' }}>{developer.matchData.complementarySkills.join(', ')}</strong>
                    </div>
                  )}
                </div>
              </Card>
            )}

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

  if (loading) return <div style={{ color: 'var(--foreground-muted)' }}>Loading posts...</div>;
  if (posts.length === 0) return <Card padding="md" style={{ textAlign: 'center', color: 'var(--foreground-muted)' }}>No public posts yet.</Card>;

  return (
    <div>
      {posts.map(post => (
        <PostCard key={post.id} {...post} />
      ))}
    </div>
  );
}
