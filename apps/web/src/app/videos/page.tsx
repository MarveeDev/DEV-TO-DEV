'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Search, PlaySquare, Calendar } from 'lucide-react';

export default function VideosPage() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const searchVideos = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setHasSearched(true);
    try {
      const res = await fetch(`/api/v1/videos/search?q=${encodeURIComponent(query)}`);
      if (res.ok) {
        const data = await res.json();
        setVideos(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '80px' }}>
      <div style={{ padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '16px', borderBottom: '1px solid var(--border)', background: 'var(--surface)', position: 'sticky', top: 0, zIndex: 10 }}>
        <button 
          onClick={() => router.back()} 
          style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: 'var(--foreground)' }}
        >
          <ArrowLeft size={24} />
        </button>
        <h1 style={{ fontSize: '20px', fontWeight: 700, margin: 0, color: 'var(--foreground)' }}>Tech Videos</h1>
      </div>

      <div style={{ padding: '24px' }}>
        <form onSubmit={searchVideos} style={{ display: 'flex', gap: '12px', marginBottom: '32px' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <Search size={20} color="var(--foreground-muted)" style={{ position: 'absolute', left: '16px', top: '12px' }} />
            <input 
              type="text"
              placeholder="Search tech talks, tutorials, conferences..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px 12px 48px',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border)',
                background: 'var(--background)',
                color: 'var(--foreground)',
                fontSize: '16px',
                boxSizing: 'border-box'
              }}
            />
          </div>
          <button 
            type="submit"
            disabled={loading}
            style={{
              padding: '0 24px',
              borderRadius: 'var(--radius-lg)',
              background: 'var(--primary)',
              color: '#fff',
              border: 'none',
              fontWeight: 600,
              fontSize: '16px',
              cursor: 'pointer',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>

        {!hasSearched && (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--foreground-muted)' }}>
            <PlaySquare size={48} color="var(--border)" style={{ margin: '0 auto 16px auto', display: 'block' }} />
            <div style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>Search for tech videos</div>
            <div style={{ fontSize: '14px' }}>Find tutorials, conference talks, and deep dives.</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center', marginTop: '24px' }}>
              {['Next.js Tutorial', 'Kubernetes Architecture', 'Rust for Beginners', 'Docker Compose'].map(term => (
                <button 
                  key={term}
                  onClick={() => { setQuery(term); setTimeout(() => searchVideos(), 0); }}
                  style={{ padding: '6px 12px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '999px', fontSize: '13px', color: 'var(--foreground)', cursor: 'pointer' }}
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}

        {hasSearched && videos.length === 0 && !loading && (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--foreground-muted)' }}>
            No videos found for "{query}".
          </div>
        )}

        {videos.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
            {videos.map(video => (
              <a 
                key={video.id} 
                href={video.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ 
                  textDecoration: 'none', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  background: 'var(--surface)',
                  borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden',
                  border: '1px solid var(--border)',
                  transition: 'transform 0.2s',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
                }}
              >
                <div style={{ width: '100%', aspectRatio: '16/9', background: '#000', position: 'relative' }}>
                  <img src={video.thumbnailUrl} alt={video.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', bottom: '8px', right: '8px', background: 'rgba(0,0,0,0.8)', color: '#fff', fontSize: '12px', padding: '2px 6px', borderRadius: '4px', fontWeight: 600 }}>
                    EXTERNAL
                  </div>
                </div>
                <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <h3 style={{ margin: '0 0 8px 0', fontSize: '15px', fontWeight: 600, color: 'var(--foreground)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {video.title}
                  </h3>
                  <div style={{ fontSize: '13px', color: 'var(--foreground-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: 'auto' }}>
                    <span>{video.channelTitle}</span>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--foreground-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                    <Calendar size={12} />
                    <span>{new Date(video.publishedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
