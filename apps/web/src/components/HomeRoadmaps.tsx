'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Card from './Card';
import Button from './Button';
import { Map, ArrowRight } from 'lucide-react';

export default function HomeRoadmaps() {
  const [roadmaps, setRoadmaps] = useState<any[]>([]);
  const [progress, setProgress] = useState<any[]>([]);
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const rRes = await fetch('/api/v1/roadmaps');
        if (!cancelled) {
          const rData = rRes.ok ? await rRes.json() : [];
          setRoadmaps(Array.isArray(rData) ? rData : []);
        }

        const meRes = await fetch('/api/v1/auth/me');
        if (meRes.ok) {
          setIsAuth(true);
          const pRes = await fetch('/api/v1/roadmaps/me');
          const pData = pRes.ok ? await pRes.json() : [];
          if (!cancelled) setProgress(Array.isArray(pData) ? pData : []);
        }
      } catch {
        // Non-critical section; keep the homepage resilient.
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) return null;

  const featured = roadmaps.slice(0, 3);
  const completedNodes = progress.length;
  const startedRoadmaps = new Set(progress.map((p: any) => p.roadmapId)).size;

  return (
    <section style={{ padding: '60px 24px', background: 'var(--surface)', borderTop: '1px solid var(--border)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={{ fontSize: '32px', fontWeight: 800, color: 'var(--foreground)', margin: '0 0 8px 0' }}>
            Find Your Learning Path
          </h2>
          <p style={{ color: 'var(--foreground-muted)', fontSize: '16px', margin: '0 auto', maxWidth: '560px', lineHeight: 1.5 }}>
            Explore structured roadmaps and know what to learn next.
          </p>
          {isAuth && completedNodes > 0 && (
            <p style={{ color: 'var(--primary)', fontSize: '14px', fontWeight: 600, margin: '12px 0 0 0' }}>
              You&apos;ve completed {completedNodes} topic{completedNodes === 1 ? '' : 's'} across {startedRoadmaps} roadmap{startedRoadmaps === 1 ? '' : 's'}. Keep going!
            </p>
          )}
        </div>

        {featured.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px', marginBottom: '32px' }}>
            {featured.map((r: any) => (
              <Link key={r.id} href={`/roadmaps/${r.slug}`} style={{ textDecoration: 'none' }}>
                <Card padding="md" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <Map size={16} color="var(--primary)" />
                    <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--foreground-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      {r.category}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--foreground)', margin: '0 0 6px 0' }}>{r.title}</h3>
                  <p style={{ fontSize: '14px', color: 'var(--foreground-muted)', margin: '0 0 12px 0', lineHeight: 1.5, flex: 1 }}>
                    {r.description}
                  </p>
                  <span style={{ fontSize: '13px', color: 'var(--primary)', fontWeight: 600 }}>
                    {r._count?.nodes || 0} topics →
                  </span>
                </Card>
              </Link>
            ))}
          </div>
        )}

        <div style={{ textAlign: 'center' }}>
          <Link href="/roadmaps" style={{ textDecoration: 'none' }}>
            <Button variant="primary" size="lg" style={{ display: 'inline-flex', gap: '8px' }}>
              Explore Roadmaps <ArrowRight size={18} />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
