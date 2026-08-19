'use client';

import { useEffect, useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import PostCard from '../../components/PostCard';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Link from 'next/link';
import BackButton from '../../components/Navigation/BackButton';

export default function FeedPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newContent, setNewContent] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetch('/api/v1/auth/me')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (!data) router.push('/login');
        else setUser(data);
      });
  }, [router]);

  useEffect(() => {
    fetchPosts(page);
  }, [page]);

  const fetchPosts = async (p: number) => {
    try {
      const res = await fetch(`/api/v1/posts?page=${p}&limit=20`);
      if (res.ok) {
        const data = await res.json();
        setPosts(data.data);
        setTotalPages(data.meta.totalPages);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePostSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!newContent.trim()) return;
    
    try {
      const res = await fetch('/api/v1/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newContent })
      });
      if (res.ok) {
        setNewContent('');
        setPage(1);
        fetchPosts(1);
      }
    } catch (err) {
      console.error(err);
    }
  };

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

  if (!user || loading) return <div style={{ padding: '60px', textAlign: 'center', color: 'var(--foreground-muted)' }}>Loading feed...</div>;

  return (
    <div>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
          <div className="page-header">
            <BackButton fallback="/dashboard" />
            <div className="page-header-content">
              <h2 className="text-wrap-safe" style={{ fontSize: '24px', fontWeight: 800, color: 'var(--foreground)', margin: '0 0 8px 0' }}>Latest Activity</h2>
              <p style={{ color: 'var(--foreground-muted)', margin: 0 }}>See what developers are building.</p>
            </div>
          </div>
          <Link href="/profile" style={{ textDecoration: 'none' }}>
            <Button variant="outline">My Profile</Button>
          </Link>
        </div>

        <Card padding="md" style={{ marginBottom: '32px' }}>
          <Link href="/posts/create" style={{ textDecoration: 'none' }}>
            <div style={{
              width: '100%',
              padding: '12px 16px',
              background: 'var(--background)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--foreground-muted)',
              fontSize: '15px',
              cursor: 'text',
              display: 'flex',
              alignItems: 'center',
              minHeight: '48px'
            }}>
              What are you building or learning?
            </div>
          </Link>
        </Card>

        {posts.length === 0 ? (
          <Card padding="md" style={{ textAlign: 'center' }}>
            <p style={{ color: 'var(--foreground-muted)' }}>No posts yet. Be the first to share!</p>
          </Card>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {posts.map(post => (
              <PostCard 
                key={post.id} 
                {...post} 
                currentUserId={user.id} 
                onDelete={handleDelete} 
              />
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px' }}>
            <Button 
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
              variant="outline"
            >
              Previous
            </Button>
            <span style={{ fontSize: '14px', color: 'var(--foreground-muted)', fontWeight: 600 }}>Page {page} of {totalPages}</span>
            <Button 
              disabled={page === totalPages}
              onClick={() => setPage(p => p + 1)}
              variant="outline"
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
