'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Card from '../../../components/Card';
import Button from '../../../components/Button';
import BackButton from '../../../components/Navigation/BackButton';
import Link from 'next/link';
import { Edit2, Trash2, Send, MessageCircle } from 'lucide-react';

export default function PostDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = React.use(params);
  const [post, setPost] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [comments, setComments] = useState<any[]>([]);
  const [commentsLoaded, setCommentsLoaded] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [postingComment, setPostingComment] = useState(false);
  const [commentError, setCommentError] = useState('');
  const commentInputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    fetch('/api/v1/auth/me')
      .then(res => res.ok ? res.json() : null)
      .then(data => setUser(data));

    fetch(`/api/v1/posts/${id}`)
      .then(async res => {
        if (!res.ok) throw new Error('Post not found');
        return res.json();
      })
      .then(data => setPost(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    fetch(`/api/v1/posts/${id}/comments`)
      .then(res => res.ok ? res.json() : [])
      .then(data => setComments(Array.isArray(data) ? data : []))
      .catch(() => setComments([]))
      .finally(() => setCommentsLoaded(true));
  }, [id]);

  useEffect(() => {
    if (!commentsLoaded) return;
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    if (params.get('comments') === '1') {
      setTimeout(() => {
        commentInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        commentInputRef.current?.focus();
      }, 150);
    }
  }, [commentsLoaded]);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      const res = await fetch(`/api/v1/posts/${id}`, { method: 'DELETE' });
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

  const handlePostComment = async () => {
    const trimmed = commentText.trim();
    if (!trimmed || postingComment) return;
    setCommentError('');
    setPostingComment(true);
    try {
      const res = await fetch(`/api/v1/posts/${id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: trimmed }),
      });
      if (res.ok) {
        const newComment = await res.json();
        setComments(prev => [...prev, newComment]);
        setCommentText('');
      } else {
        const data = await res.json().catch(() => ({}));
        setCommentError(data.message || 'Failed to post comment');
      }
    } catch (err) {
      console.error(err);
      setCommentError('Failed to post comment');
    } finally {
      setPostingComment(false);
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

      <Card padding="lg" style={{ marginTop: '24px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 800, margin: '0 0 16px 0', color: 'var(--foreground)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <MessageCircle size={20} color="var(--primary)" />
          Comments
          <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--foreground-muted)' }}>
            ({comments.length})
          </span>
        </h2>

        {comments.length === 0 ? (
          <p style={{ fontSize: '14px', color: 'var(--foreground-muted)', margin: '0 0 20px 0' }}>
            No comments yet. Be the first to share your thoughts.
          </p>
        ) : (
          <div style={{ marginBottom: '16px' }}>
            {comments.map(comment => (
              <div key={comment.id} style={{ display: 'flex', gap: '12px', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--border)', flexShrink: 0 }}></div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <strong style={{ fontSize: '14px', color: 'var(--foreground)' }}>
                      {comment.author?.profile?.displayName || 'Unknown'}
                    </strong>
                    {comment.author?.profile?.username && (
                      <span style={{ fontSize: '12px', color: 'var(--foreground-muted)' }}>
                        @{comment.author.profile.username}
                      </span>
                    )}
                    <span style={{ fontSize: '12px', color: 'var(--foreground-muted)' }}>
                      · {new Date(comment.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <p style={{ fontSize: '14px', color: 'var(--foreground)', margin: '4px 0 0', lineHeight: 1.5, whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>
                    {comment.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {user ? (
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
            <textarea
              ref={commentInputRef}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment..."
              rows={3}
              style={{
                width: '100%',
                minHeight: '80px',
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border)',
                background: 'var(--background)',
                color: 'var(--foreground)',
                fontSize: '14px',
                resize: 'vertical',
                boxSizing: 'border-box',
                outline: 'none',
                fontFamily: 'inherit',
                lineHeight: 1.5
              }}
            />
            {commentError && (
              <p style={{ color: '#ef4444', fontSize: '13px', margin: '8px 0 0' }}>{commentError}</p>
            )}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
              <Button variant="primary" onClick={handlePostComment} disabled={postingComment || !commentText.trim()}>
                <Send size={16} style={{ marginRight: '6px' }} />
                {postingComment ? 'Posting...' : 'Post Comment'}
              </Button>
            </div>
          </div>
        ) : (
          <p style={{ fontSize: '14px', color: 'var(--foreground-muted)', borderTop: '1px solid var(--border)', paddingTop: '16px', margin: 0 }}>
            <Link href="/login" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>Sign in</Link> to comment on this post.
          </p>
        )}
      </Card>
    </div>
  );
}
