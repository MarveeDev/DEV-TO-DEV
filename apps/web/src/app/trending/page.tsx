'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, TrendingUp } from 'lucide-react';
import Card from '../../components/Card';
import Link from 'next/link';

function TrendingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');
  
  const [trending, setTrending] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/v1/trending?t=${Date.now()}`, { cache: 'no-store' })
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        setTrending(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '80px' }}>
      <div style={{ padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '16px', borderBottom: '1px solid var(--border)', background: 'var(--surface)', position: 'sticky', top: 0, zIndex: 10 }}>
        <button 
          onClick={() => router.back()} 
          style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: 'var(--foreground)' }}
        >
          <ArrowLeft size={24} />
        </button>
        <h1 style={{ fontSize: '20px', fontWeight: 700, margin: 0, color: 'var(--foreground)' }}>Trending in Tech</h1>
      </div>

      <div style={{ padding: '24px' }}>
        {categoryParam && (
          <div style={{ marginBottom: '24px', padding: '12px 16px', background: 'var(--primary-light)', border: '1px solid var(--primary)', borderRadius: 'var(--radius-md)', color: 'var(--primary)', fontWeight: 600 }}>
            Viewing category: {categoryParam}
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
          <TrendingUp size={24} color="#ef4444" />
          <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>Top Technologies This Week</h2>
        </div>

        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--foreground-muted)' }}>Loading trending data...</div>
        ) : trending.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--foreground-muted)' }}>No trending data available.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {trending.map((topic, index) => (
              <Link key={topic.slug} href={`/skills/${topic.slug}`} style={{ textDecoration: 'none' }}>
                <Card padding="md" style={{ display: 'flex', alignItems: 'center', gap: '16px', border: '1px solid var(--border)', transition: 'transform 0.2s' }}>
                  <div style={{ 
                    width: '32px', 
                    height: '32px', 
                    borderRadius: '50%', 
                    background: index < 3 ? 'var(--primary)' : 'var(--surface)', 
                    color: index < 3 ? '#fff' : 'var(--foreground-muted)',
                    border: index < 3 ? 'none' : '1px solid var(--border)',
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '14px'
                  }}>
                    {index + 1}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: '16px', color: 'var(--foreground)' }}>{topic.name}</div>
                    <div style={{ fontSize: '13px', color: 'var(--foreground-muted)', marginTop: '4px' }}>
                      Based on community activity
                    </div>
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--primary)' }}>
                    Explore →
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function TrendingPage() {
  return (
    <Suspense fallback={<div style={{ padding: '40px', textAlign: 'center', color: 'var(--foreground-muted)' }}>Loading...</div>}>
      <TrendingContent />
    </Suspense>
  );
}
