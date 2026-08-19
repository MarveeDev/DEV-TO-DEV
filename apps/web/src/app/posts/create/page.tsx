'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Card from '../../../components/Card';
import Button from '../../../components/Button';
import BackButton from '../../../components/Navigation/BackButton';
import { MediaUploader } from '../../../components/MediaUploader';
import { MessageSquarePlus, X } from 'lucide-react';

export default function CreatePostPage() {
  const router = useRouter();
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [skills, setSkills] = useState('');
  const [mediaIds, setMediaIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
      const res = await fetch('/api/v1/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, skills: skillsArray, mediaIds })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to create post');
      }

      router.push(`/feed`);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '40px' }}>
      <div className="page-header" style={{ marginBottom: '24px' }}>
        <BackButton fallback="/feed" />
        <div className="page-header-content">
          <h1 style={{ fontSize: '28px', fontWeight: 800, margin: 0, color: 'var(--foreground)', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <MessageSquarePlus size={28} color="var(--primary)" />
            Create a Post
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

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '14px', fontWeight: 600, color: 'var(--foreground)' }}>Media Attachments</label>
            {mediaIds.length > 0 && (
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '8px' }}>
                {mediaIds.map((id, index) => (
                  <div key={id} style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'var(--border)', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' }}>
                    Attachment {index + 1}
                    <button 
                      type="button" 
                      onClick={() => setMediaIds(prev => prev.filter(mId => mId !== id))}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', display: 'flex' }}
                    >
                      <X size={14} color="var(--foreground-muted)" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <MediaUploader 
              onUploadSuccess={(id) => setMediaIds(prev => [...prev, id])}
              onError={(err) => setError(err)}
            />
          </div>

          <div style={{ paddingTop: '8px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <Button variant="outline" type="button" onClick={() => router.push('/feed')} disabled={loading}>Cancel</Button>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? 'Posting...' : 'Publish Post'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
