'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Card from '../../components/Card';
import Button from '../../components/Button';
import BackButton from '../../components/Navigation/BackButton';
import { Map, Clock, ArrowRight, Activity, Filter, Search, ChevronDown } from 'lucide-react';

export default function RoadmapsPage() {
  const [roadmaps, setRoadmaps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);

  const clientFetch = async (url: string, options?: any) => {
    return window.fetch(url, options);
  };

  useEffect(() => {
    fetchRoadmaps();
  }, [category, search]);

  const fetchRoadmaps = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (category) params.append('category', category);
      
      const res = await clientFetch(`/api/v1/roadmaps?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to load roadmaps');
      const data = await res.json();
      setRoadmaps(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', paddingBottom: '40px' }}>
      <div className="page-header" style={{ marginBottom: '32px' }}>
        <BackButton fallback="/dashboard" />
        <div className="page-header-content">
          <h1 style={{ fontSize: '32px', fontWeight: 800, margin: '0 0 8px 0', color: 'var(--foreground)', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Map size={32} color="var(--primary)" />
            Engineering & Technology Roadmaps
          </h1>
          <p style={{ margin: 0, fontSize: '16px', color: 'var(--foreground-muted)' }}>
            Find your path. Build your skills. Become a professional.
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '32px', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 300px', position: 'relative' }}>
          <Search size={20} color="var(--foreground-muted)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
          <input
            type="text"
            placeholder="Search roadmaps..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--surface)', fontSize: '15px', color: 'var(--foreground)', boxSizing: 'border-box', outline: 'none' }}
          />
        </div>
        <div style={{ flex: '0 0 auto', position: 'relative' }}>
          <button 
            onClick={() => setShowCategoryMenu(!showCategoryMenu)}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              gap: '8px',
              padding: '12px 16px', 
              borderRadius: '8px', 
              border: '1px solid var(--border)', 
              background: 'var(--surface)', 
              fontSize: '15px', 
              color: 'var(--foreground)', 
              outline: 'none',
              cursor: 'pointer',
              minWidth: '160px'
            }}
          >
            <span>{category || 'All Categories'}</span>
            <ChevronDown size={18} color="var(--foreground-muted)" />
          </button>
          
          {showCategoryMenu && (
            <>
              <div 
                style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 90 }}
                onClick={() => setShowCategoryMenu(false)}
              />
              <div style={{ 
                position: 'absolute', 
                top: '100%', 
                left: 0, 
                marginTop: '8px', 
                background: 'var(--surface)', 
                border: '1px solid var(--border)', 
                borderRadius: '8px', 
                boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)', 
                minWidth: '200px',
                zIndex: 100,
                maxHeight: '300px',
                overflowY: 'auto'
              }}>
                <button 
                  onClick={() => { setCategory(''); setShowCategoryMenu(false); }}
                  style={{ display: 'block', width: '100%', padding: '14px 16px', textAlign: 'left', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '15px', color: category === '' ? 'var(--primary)' : 'var(--foreground)', borderBottom: '1px solid var(--border)', fontWeight: category === '' ? 600 : 400 }}
                >
                  All Categories
                </button>
                {['Foundations', 'Engineering', 'Security', 'Data', 'Infrastructure'].map(cat => (
                  <button 
                    key={cat}
                    onClick={() => { setCategory(cat); setShowCategoryMenu(false); }}
                    style={{ display: 'block', width: '100%', padding: '14px 16px', textAlign: 'left', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '15px', color: category === cat ? 'var(--primary)' : 'var(--foreground)', fontWeight: category === cat ? 600 : 400 }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {loading && <div style={{ textAlign: 'center', padding: '40px', color: 'var(--foreground-muted)' }}>Loading roadmaps...</div>}
      
      {error && (
        <div style={{ background: 'var(--surface)', padding: '32px 24px', borderRadius: '12px', marginBottom: '24px', border: '1px solid var(--border)', textAlign: 'center' }}>
          <div style={{ background: 'var(--background)', width: '64px', height: '64px', borderRadius: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <Activity size={32} color="var(--foreground-muted)" />
          </div>
          <h3 style={{ margin: '0 0 8px 0', color: 'var(--foreground)', fontSize: '20px', fontWeight: 700 }}>Unable to load roadmaps</h3>
          <p style={{ margin: '0 auto 24px auto', color: 'var(--foreground-muted)', maxWidth: '400px', lineHeight: 1.5 }}>
            Please check your connection and try again.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Button variant="outline" onClick={() => fetchRoadmaps()}>
              Retry
            </Button>
          </div>
        </div>
      )}

      {!loading && !error && roadmaps.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 20px', background: 'var(--surface)', borderRadius: '12px', border: '1px solid var(--border)' }}>
          <Map size={48} color="var(--border)" style={{ margin: '0 auto 16px' }} />
          <h3 style={{ margin: '0 0 8px 0', color: 'var(--foreground)', fontSize: '18px' }}>No roadmaps found</h3>
          <p style={{ margin: 0, color: 'var(--foreground-muted)' }}>Try adjusting your search or category filters.</p>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
        {!loading && !error && roadmaps.map((roadmap: any) => (
          <Card key={roadmap.id} padding="lg" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--primary)', background: 'var(--primary-light)', padding: '4px 8px', borderRadius: '6px' }}>
                {roadmap.category}
              </span>
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--foreground-muted)', background: 'var(--background)', padding: '4px 8px', borderRadius: '6px', border: '1px solid var(--border)' }}>
                {roadmap.difficulty}
              </span>
            </div>
            
            <h2 style={{ fontSize: '20px', fontWeight: 800, margin: '0 0 12px 0', color: 'var(--foreground)' }}>
              {roadmap.title}
            </h2>
            
            <p style={{ fontSize: '15px', color: 'var(--foreground-muted)', margin: '0 0 24px 0', flex: 1, lineHeight: 1.6 }}>
              {roadmap.description}
            </p>

            <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', color: 'var(--foreground-muted)', fontSize: '13px', fontWeight: 500 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clock size={16} />
                ~{roadmap.estimatedHours} hours
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Activity size={16} />
                {roadmap._count?.nodes || 0} topics
              </div>
            </div>

            <Link href={`/roadmaps/${roadmap.slug}`} style={{ textDecoration: 'none' }}>
              <Button variant="primary" style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                View Roadmap <ArrowRight size={18} />
              </Button>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}
