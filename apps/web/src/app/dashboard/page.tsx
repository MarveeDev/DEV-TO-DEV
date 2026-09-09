'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { Map, ArrowRight, BookOpen } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [roadmaps, setRoadmaps] = useState<any[]>([]);
  const [progress, setProgress] = useState<any[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const meRes = await fetch('/api/v1/auth/me');
        if (!meRes.ok) {
          router.push('/login');
          return;
        }
        const me = await meRes.json();
        if (!me.developerProfile) {
          router.push('/onboarding');
          return;
        }

        const [rRes, pRes] = await Promise.all([
          fetch('/api/v1/roadmaps'),
          fetch('/api/v1/roadmaps/me'),
        ]);
        if (cancelled) return;
        const rData = rRes.ok ? await rRes.json() : [];
        const pData = pRes.ok ? await pRes.json() : [];
        setRoadmaps(Array.isArray(rData) ? rData : []);
        setProgress(Array.isArray(pData) ? pData : []);
      } catch {
        // Non-critical; keep the page resilient.
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [router]);

  if (loading) {
    return <div style={{ padding: '60px', textAlign: 'center', color: 'var(--foreground-muted)' }}>Loading your learning path...</div>;
  }

  const progressByRoadmap: Record<string, number> = {};
  progress.forEach((p: any) => {
    progressByRoadmap[p.roadmapId] = (progressByRoadmap[p.roadmapId] || 0) + 1;
  });

  const startedRoadmaps = roadmaps.filter((r) => (progressByRoadmap[r.id] || 0) > 0);
  const recommendedRoadmaps = roadmaps.filter((r) => !progressByRoadmap[r.id]).slice(0, 3);
  const totalCompleted = progress.length;
  const startedCount = Object.keys(progressByRoadmap).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', paddingBottom: '40px' }}>
      {/* Header */}
      <section style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
        <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <BookOpen size={24} color="var(--primary)" />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h1 style={{ fontSize: '32px', fontWeight: 800, color: 'var(--foreground)', margin: '0 0 4px 0' }}>Your Learning Roadmap</h1>
          <p style={{ color: 'var(--foreground-muted)', fontSize: '16px', margin: 0 }}>
            {totalCompleted > 0
              ? `You've completed ${totalCompleted} topic${totalCompleted === 1 ? '' : 's'} across ${startedCount} roadmap${startedCount === 1 ? '' : 's'}. Keep going!`
              : 'Learn, build, and grow through structured engineering roadmaps.'}
          </p>
        </div>
      </section>

      {/* Continue Learning */}
      {startedRoadmaps.length > 0 && (
        <section>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--foreground)', margin: '0 0 16px 0' }}>Continue Learning</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
            {startedRoadmaps.map((r: any) => {
              const done = progressByRoadmap[r.id] || 0;
              const total = r._count?.nodes || 0;
              const pct = total > 0 ? Math.round((done / total) * 100) : 0;
              return (
                <Link key={r.id} href={`/roadmaps/${r.slug}`} style={{ textDecoration: 'none' }}>
                  <Card padding="md" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <Map size={16} color="var(--primary)" />
                      <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--foreground-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{r.category}</span>
                    </div>
                    <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--foreground)', margin: '0 0 10px 0' }}>{r.title}</h3>
                    <div style={{ marginBottom: '12px' }}>
                      <div style={{ height: '6px', background: 'var(--border)', borderRadius: '999px', overflow: 'hidden' }}>
                        <div style={{ width: `${pct}%`, height: '100%', background: 'var(--primary)' }} />
                      </div>
                      <div style={{ fontSize: '13px', color: 'var(--foreground-muted)', marginTop: '6px' }}>
                        {done} of {total} topics completed
                      </div>
                    </div>
                    <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--primary)', fontWeight: 600, fontSize: '14px' }}>
                      Continue <ArrowRight size={16} />
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Recommended / Discover Roadmaps */}
      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--foreground)', margin: '0 0 4px 0' }}>
              {startedRoadmaps.length > 0 ? 'Recommended Roadmaps' : 'Find Your Learning Path'}
            </h2>
            <p style={{ color: 'var(--foreground-muted)', fontSize: '14px', margin: 0 }}>
              Explore structured roadmaps and know what to learn next.
            </p>
          </div>
          <Link href="/roadmaps" style={{ textDecoration: 'none' }}>
            <Button variant="primary" size="md" style={{ display: 'inline-flex', gap: '8px' }}>
              Explore Roadmaps <ArrowRight size={16} />
            </Button>
          </Link>
        </div>

        {recommendedRoadmaps.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
            {recommendedRoadmaps.map((r: any) => (
              <Link key={r.id} href={`/roadmaps/${r.slug}`} style={{ textDecoration: 'none' }}>
                <Card padding="md" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <Map size={16} color="var(--primary)" />
                    <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--foreground-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{r.category}</span>
                  </div>
                  <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--foreground)', margin: '0 0 6px 0' }}>{r.title}</h3>
                  <p style={{ fontSize: '14px', color: 'var(--foreground-muted)', margin: '0 0 12px 0', lineHeight: 1.5, flex: 1 }}>{r.description}</p>
                  <span style={{ fontSize: '13px', color: 'var(--primary)', fontWeight: 600 }}>{r._count?.nodes || 0} topics →</span>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <Card padding="md" style={{ textAlign: 'center' }}>
            <p style={{ color: 'var(--foreground-muted)', margin: '0 0 16px 0' }}>You&apos;ve started every roadmap. Explore them all to continue learning.</p>
            <Link href="/roadmaps" style={{ textDecoration: 'none' }}>
              <Button variant="outline">View All Roadmaps</Button>
            </Link>
          </Card>
        )}
      </section>
    </div>
  );
}
