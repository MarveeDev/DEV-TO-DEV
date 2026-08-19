'use client';

import { useState, useEffect, useRef, KeyboardEvent } from 'react';
import { useRouter } from 'next/navigation';
import Card from '../../../../components/Card';
import Button from '../../../../components/Button';
import BackButton from '../../../../components/Navigation/BackButton';

const STATUS_OPTIONS = [
  { value: 'ACTIVE', label: 'Active (In Development)' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'PAUSED', label: 'Paused' },
  { value: 'ARCHIVED', label: 'Archived' }
];

function CustomStatusSelect({ value, onChange }: { value: string, onChange: (val: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsOpen(!isOpen);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const selectedOption = STATUS_OPTIONS.find(opt => opt.value === value) || STATUS_OPTIONS[0];

  return (
    <div 
      ref={containerRef} 
      style={{ position: 'relative', width: '100%' }}
    >
      <div
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls="status-listbox"
        tabIndex={0}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '10px 12px',
          borderRadius: '8px',
          border: isOpen ? '1px solid var(--primary)' : '1px solid var(--border)',
          background: '#fff',
          fontSize: '14px',
          color: 'var(--foreground)',
          cursor: 'pointer',
          outline: 'none',
          boxShadow: isOpen ? '0 0 0 2px var(--primary-light)' : 'none',
          minHeight: '44px'
        }}
      >
        <span>{selectedOption.label}</span>
        <span style={{ fontSize: '10px', color: 'var(--foreground-muted)' }}>▼</span>
      </div>

      {isOpen && (
        <ul
          id="status-listbox"
          role="listbox"
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            right: 0,
            background: '#fff',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            margin: 0,
            padding: '4px',
            listStyle: 'none',
            maxHeight: '200px',
            overflowY: 'auto',
            zIndex: 50
          }}
        >
          {STATUS_OPTIONS.map((opt) => (
            <li
              key={opt.value}
              role="option"
              aria-selected={value === opt.value}
              onClick={() => {
                onChange(opt.value);
                setIsOpen(false);
              }}
              style={{
                padding: '10px 12px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px',
                background: value === opt.value ? 'var(--primary-light)' : 'transparent',
                color: value === opt.value ? 'var(--primary)' : 'var(--foreground)',
                display: 'flex',
                alignItems: 'center',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = value === opt.value ? 'var(--primary-light)' : '#f1f5f9')}
              onMouseLeave={(e) => (e.currentTarget.style.background = value === opt.value ? 'var(--primary-light)' : 'transparent')}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function EditProjectPage({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const [projectId, setProjectId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    githubUrl: '',
    demoUrl: '',
    status: 'ACTIVE'
  });

  useEffect(() => {
    const fetchProjectAndUser = async () => {
      try {
        let user = null;
        const userRes = await fetch('/api/v1/auth/me');
        if (userRes.ok) {
          const userData = await userRes.json();
          user = userData?.developerProfile;
        }

        if (!user) {
          router.push('/login');
          return;
        }

        const projRes = await fetch(`/api/v1/projects/${params.slug}`);
        if (!projRes.ok) throw new Error('Project not found');
        const projData = await projRes.json();
        
        if (projData.ownerId !== user.id) {
          router.push(`/projects/${params.slug}`);
          return;
        }

        setProjectId(projData.id);
        setFormData({
          title: projData.title || '',
          description: projData.description || '',
          githubUrl: projData.githubUrl || '',
          demoUrl: projData.demoUrl || '',
          status: projData.status || 'ACTIVE'
        });
        
        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProjectAndUser();
  }, [params.slug, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectId) return;

    setSubmitting(true);
    setError('');

    try {
      const res = await fetch(`/api/v1/projects/${projectId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || 'Failed to update project');
      }

      router.push(`/projects/${data.slug || params.slug}`);
    } catch (err: any) {
      setError(err.message);
      setSubmitting(false);
    }
  };

  if (loading) return <div style={{ padding: '60px', textAlign: 'center', color: 'var(--foreground-muted)' }}>Loading project...</div>;
  if (error && !projectId) return <div style={{ padding: '60px', textAlign: 'center', color: 'red' }}>{error}</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '600px', margin: '0 auto' }}>
      <section className="page-header">
        <BackButton fallback={`/projects/${params.slug}`} />
        <div className="page-header-content">
          <h1 className="text-wrap-safe" style={{ fontSize: '32px', fontWeight: 800, color: 'var(--foreground)' }}>
            Edit Project
          </h1>
          <p style={{ color: 'var(--foreground-muted)', fontSize: '16px', margin: 0 }}>Update your project details and settings.</p>
        </div>
      </section>

      <Card padding="lg">
        {error && <div style={{ padding: '12px', background: '#fee2e2', color: '#b91c1c', borderRadius: '6px', marginBottom: '24px', fontSize: '14px' }}>{error}</div>}
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label htmlFor="title" style={{ fontSize: '14px', fontWeight: 600, color: 'var(--foreground)' }}>Project Name *</label>
            <input 
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="e.g. NextJS E-commerce Template"
              style={{ padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--border)', fontSize: '14px', outline: 'none' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label htmlFor="description" style={{ fontSize: '14px', fontWeight: 600, color: 'var(--foreground)' }}>Description *</label>
            <textarea 
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
              placeholder="What does this project do? What problem does it solve?"
              style={{ padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--border)', fontSize: '14px', outline: 'none', resize: 'vertical' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label htmlFor="githubUrl" style={{ fontSize: '14px', fontWeight: 600, color: 'var(--foreground)' }}>GitHub Repository URL</label>
            <input 
              id="githubUrl"
              name="githubUrl"
              type="url"
              value={formData.githubUrl}
              onChange={handleChange}
              placeholder="https://github.com/username/repo"
              style={{ padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--border)', fontSize: '14px', outline: 'none' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label htmlFor="demoUrl" style={{ fontSize: '14px', fontWeight: 600, color: 'var(--foreground)' }}>Live Demo URL</label>
            <input 
              id="demoUrl"
              name="demoUrl"
              type="url"
              value={formData.demoUrl}
              onChange={handleChange}
              placeholder="https://my-project.vercel.app"
              style={{ padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--border)', fontSize: '14px', outline: 'none' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label id="status-label" htmlFor="status" style={{ fontSize: '14px', fontWeight: 600, color: 'var(--foreground)' }}>Status</label>
            <CustomStatusSelect 
              value={formData.status} 
              onChange={(val) => setFormData({ ...formData, status: val })} 
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
            <Button type="button" variant="outline" onClick={() => router.push(`/projects/${params.slug}`)}>Cancel</Button>
            <Button type="submit" variant="primary" disabled={submitting}>
              {submitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>

        </form>
      </Card>
    </div>
  );
}
