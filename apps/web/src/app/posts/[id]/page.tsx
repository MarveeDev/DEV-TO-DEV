'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Card from '../../../components/Card';
import Button from '../../../components/Button';
import BackButton from '../../../components/Navigation/BackButton';
import Link from 'next/link';
import { Edit2, Trash2 } from 'lucide-react';

export default function PostDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [post, setPost] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/v1/auth/me')
      .then(res => res.ok ? res.json() : null)
      .then(data => setUser(data));
      
    fetch(`/api/v1/posts/${params.id}`)
      .then(async res => {
        if (!res.ok) throw new Error('Post not found');
        return res.json();
      })
      .then(data => setPost(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [params.id]);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    
    try {
      const res = await fetch(`/api/v1/posts/${params.id}`, { method: 'DELETE' });
      if (res.ok) {
        router.push('/feed');
      } else {
        const data = await res.json();
        alert(data.message || 'Failed to delete post');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred while deleting the post');
    }
  };

  if (loading) return <div style={{ padding: '60px', textAlign: 'center', color: 'var(--foreground-muted)' }}>Loading post...</div>;
  if (error || !post) return <div style={{ padding: '60px', textAlign: 'center', color: '#ef4444' }}>{error || 'Post not found'}</div>;

  const isOwner = user?.id === post.author.id;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '40px' }}>
      <div className="page-header" style={{ marginBottom: '24px' }}>
        <BackButton fallback="/feed" />
      </div>

      <Card padding="lg">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--border)', flexShrink: 0 }}></div>
            <div>
              <Link href={`/developers/${post.author.profile.username}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <strong style={{ fontSize: '16px', color: 'var(--foreground)', display: 'block', marginBottom: '4px' }}>
                  {post.author.profile.displayName || 'Unknown'}
                </strong>
                <span style={{ fontSize: '14px', color: 'var(--foreground-muted)' }}>
                  @{post.author.profile.username}
                </span>
              </Link>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontSize: '13px', color: 'var(--foreground-muted)' }}>
              {new Date(post.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
            {isOwner && (
              <div style={{ display: 'flex', gap: '8px' }}>
                <Button variant="outline" onClick={() => router.push(`/posts/${post.id}/edit`)} style={{ padding: '6px 12px' }}>
                  <Edit2 size={16} style={{ marginRight: '6px' }} /> Edit
                </Button>
                <Button variant="outline" onClick={handleDelete} style={{ padding: '6px 12px', color: '#ef4444', borderColor: '#fca5a5' }}>
                  <Trash2 size={16} />
                </Button>
              </div>
            )}
          </div>
        </div>

        <h1 style={{ fontSize: '24px', fontWeight: 800, margin: '0 0 16px 0', color: 'var(--foreground)' }}>
          {post.title}
        </h1>

        {post.skills && post.skills.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
            {post.skills.map((skill: any) => (
              <Link key={skill.id} href={`/skills/${skill.slug || skill.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`} style={{ textDecoration: 'none' }}>
                <span style={{
                  fontSize: '13px',
                  padding: '6px 12px',
                  background: 'var(--primary-light)',
                  color: 'var(--primary)',
                  borderRadius: '999px',
                  fontWeight: 600,
                  display: 'inline-block',
                  transition: 'all 0.1s ease',
                  cursor: 'pointer'
                }} className="skill-pill">
                  {skill.name}
                </span>
              </Link>
            ))}
          </div>
        )}

        <div style={{ 
          fontSize: '16px', 
          color: 'var(--foreground)', 
          lineHeight: 1.7, 
          whiteSpace: 'pre-wrap',
          borderTop: '1px solid var(--border)',
          paddingTop: '24px'
        }}>
          {post.content}
        </div>
      </Card>
    </div>
  );
}
