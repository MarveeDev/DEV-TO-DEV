'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Card from '../../../../components/Card';
import Button from '../../../../components/Button';
import BackButton from '../../../../components/Navigation/BackButton';
import { Edit2 } from 'lucide-react';

export default function EditPostPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [skills, setSkills] = useState('');
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`/api/v1/posts/${params.id}`)
      .then(async res => {
        if (!res.ok) throw new Error('Post not found');
        return res.json();
      })
      .then(data => {
        setTitle(data.title || '');
        setContent(data.content || '');
        if (data.skills && Array.isArray(data.skills)) {
          setSkills(data.skills.map((s: any) => s.name).join(', '));
        }
      })
      .catch(err => setError(err.message))
      .finally(() => setInitializing(false));
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError('Title and content are required.');
      return;
    }
    
    const skillsArray = skills.split(',').map(s => s.trim()).filter(s => s.length > 0);
    if (skillsArray.length === 0) {
      setError('At least one skill or technology is required.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const res = await fetch(`/api/v1/posts/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, skills: skillsArray })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to update post');
      }

      router.push(`/posts/${params.id}`);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (initializing) return <div style={{ padding: '60px', textAlign: 'center', color: 'var(--foreground-muted)' }}>Loading...</div>;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '40px' }}>
      <div className="page-header" style={{ marginBottom: '24px' }}>
        <BackButton fallback={`/posts/${params.id}`} />
        <div className="page-header-content">
          <h1 style={{ fontSize: '28px', fontWeight: 800, margin: 0, color: 'var(--foreground)', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Edit2 size={28} color="var(--primary)" />
            Edit Post
          </h1>
        </div>
      </div>

      <Card padding="lg">
        {error && (
          <div style={{ background: '#fef2f2', color: '#991b1b', padding: '12px 16px', borderRadius: '8px', marginBottom: '24px', fontSize: '14px', border: '1px solid #f87171' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '14px', fontWeight: 600, color: 'var(--foreground)' }}>Title *</label>
            <input 
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What are you building or learning?"
              style={{
                width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border)',
                background: 'var(--background)', color: 'var(--foreground)', fontSize: '15px', outline: 'none', boxSizing: 'border-box'
              }}
              required
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '14px', fontWeight: 600, color: 'var(--foreground)' }}>Content *</label>
            <textarea 
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share details, snippets, or thoughts..."
              style={{
                width: '100%', minHeight: '200px', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border)',
                background: 'var(--background)', color: 'var(--foreground)', fontSize: '15px', outline: 'none', resize: 'vertical', boxSizing: 'border-box'
              }}
              required
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '14px', fontWeight: 600, color: 'var(--foreground)' }}>Technologies/Skills *</label>
            <input 
              type="text"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="e.g. React, Next.js, TypeScript"
              style={{
                width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border)',
                background: 'var(--background)', color: 'var(--foreground)', fontSize: '15px', outline: 'none', boxSizing: 'border-box'
              }}
            />
            <span style={{ fontSize: '13px', color: 'var(--foreground-muted)' }}>Separate tags with commas. At least one is required.</span>
          </div>

          <div style={{ paddingTop: '8px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <Button variant="outline" type="button" onClick={() => router.push(`/posts/${params.id}`)} disabled={loading}>Cancel</Button>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
