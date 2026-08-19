'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PostCard from '../../components/PostCard';
import DeveloperScoreBoard from '../../components/DeveloperScoreBoard';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Badge from '../../components/Badge';

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/v1/auth/me')
      .then(res => {
        if (!res.ok) throw new Error('Unauthenticated');
        return res.json();
      })
      .then(data => setUser(data))
      .catch(() => router.push('/login'));
  }, [router]);

  const handleLogout = async () => {
    await fetch('/api/v1/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  if (!user) return <div style={{ padding: '60px', textAlign: 'center', color: 'var(--foreground-muted)' }}>Loading...</div>;

  const profile = user.developerProfile;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 800, color: 'var(--foreground)' }}>My Profile</h1>
          <Button onClick={handleLogout} variant="outline">Logout</Button>
        </div>
        
        <div className="grid-2-col-sidebar">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <Card padding="md">
              <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '32px' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--border)', flexShrink: 0 }}></div>
                <div>
                  <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--foreground)', margin: '0 0 4px 0' }}>{profile?.displayName || 'Unknown Developer'}</h2>
                  <p style={{ color: 'var(--foreground-muted)', fontSize: '15px', margin: '0 0 8px 0' }}>@{profile?.username}</p>
                  <Badge variant="outline" style={{ textTransform: 'capitalize' }}>{profile?.experienceLevel?.toLowerCase()}</Badge>
                </div>
              </div>
              
              {profile?.bio && (
                <div style={{ marginBottom: '32px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px', color: 'var(--foreground)' }}>About</h3>
                  <p style={{ fontSize: '15px', lineHeight: 1.6, color: 'var(--foreground)', margin: 0 }}>{profile.bio}</p>
                </div>
              )}

              {profile?.skills && profile.skills.length > 0 && (
                <div style={{ marginBottom: '32px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px', color: 'var(--foreground)' }}>Skills</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {profile.skills.map((s: any) => (
                      <Badge 
                        key={s.skill.id} 
                        variant="default" 
                        style={{ cursor: 'pointer' }}
                        onClick={(e: React.MouseEvent) => {
                          e.preventDefault();
                          router.push(`/skills/${s.skill.slug || s.skill.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`);
                        }}
                      >
                        {s.skill.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {profile?.learningGoals && profile.learningGoals.length > 0 && (
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px', color: 'var(--foreground)' }}>Learning Goals</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {profile.learningGoals.map((g: any) => (
                      <Badge key={g.learningGoal.id} variant="outline">{g.learningGoal.name}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </Card>

            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--foreground)', marginBottom: '16px', margin: '0 0 16px 0' }}>My Posts</h2>
              <MyPosts username={profile.username} currentUserId={user.id} />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <DeveloperScoreBoard isMe={true} />
            
            <Card padding="md">
              <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px', color: 'var(--foreground)' }}>Connected Accounts</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {user.authIdentities?.map((id: any) => (
                  <li key={id.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ textTransform: 'capitalize', fontWeight: 600, fontSize: '14px' }}>{id.provider}</span>
                    <span style={{ color: 'var(--foreground-muted)', fontSize: '12px' }}>ID: {id.providerAccountId.slice(0, 8)}...</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>
    </div>
  );
}

function MyPosts({ username, currentUserId }: { username: string, currentUserId: string }) {
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

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    try {
      const res = await fetch(`/api/v1/posts/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setPosts(prev => prev.filter(p => p.id !== id));
      } else {
        alert('Failed to delete post');
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div style={{ color: 'var(--foreground-muted)' }}>Loading posts...</div>;
  if (posts.length === 0) return <Card padding="md" style={{ textAlign: 'center', color: 'var(--foreground-muted)' }}>No posts yet. Head over to the feed to post!</Card>;

  return (
    <div>
      {posts.map(post => (
        <PostCard key={post.id} {...post} currentUserId={currentUserId} onDelete={handleDelete} />
      ))}
    </div>
  );
}
