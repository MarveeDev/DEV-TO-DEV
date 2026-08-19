'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Card from '../../../components/Card';
import Button from '../../../components/Button';
import BackButton from '../../../components/Navigation/BackButton';
import { Play, CheckCircle2, Circle, Lock } from 'lucide-react';

export default function RoadmapDetailsPage({ params }: { params: Promise<{ slug: string }> | { slug: string } }) {
  const router = useRouter();
  const unwrappedParams = React.use(params as any) as { slug: string };
  const slug = unwrappedParams.slug;
  const [roadmap, setRoadmap] = useState<any>(null);
  const [progress, setProgress] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [starting, setStarting] = useState(false);

  const clientFetch = async (url: string, options?: any) => {
    return window.fetch(url, options);
  };

  useEffect(() => {
    clientFetch('/api/v1/auth/me')
      .then(res => res.ok ? res.json() : null)
      .then(data => setUser(data))
      .catch(() => {});

    fetchData();
  }, [slug]);

  const fetchData = async () => {
    try {
      const rmRes = await clientFetch(`/api/v1/roadmaps/${encodeURIComponent(slug)}`);
      if (!rmRes.ok) throw new Error('Roadmap not found');
      const rmData = await rmRes.json();
      setRoadmap(rmData);

      const progRes = await clientFetch('/api/v1/roadmaps/me');
      if (progRes.ok) {
        const progData = await progRes.json();
        setProgress(progData.filter((p: any) => p.roadmapId === rmData.id));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleStart = async () => {
    if (!user) {
      router.push('/login');
      return;
    }
    setStarting(true);
    try {
      await clientFetch(`/api/v1/roadmaps/${encodeURIComponent(slug)}/start`, { method: 'POST' });
      await fetchData();
    } finally {
      setStarting(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '60px' }}>
      <div className="page-header" style={{ marginBottom: '24px' }}>
        <BackButton fallback="/roadmaps" />
      </div>

      {loading ? (
        <div style={{ padding: '60px', textAlign: 'center', color: 'var(--foreground-muted)' }}>Loading roadmap...</div>
      ) : !roadmap ? (
        <div style={{ padding: '60px', textAlign: 'center', color: '#ef4444' }}>Roadmap not found.</div>
      ) : (
        <>
          <Card padding="lg" style={{ marginBottom: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h1 style={{ fontSize: '32px', fontWeight: 800, margin: '0 0 12px 0', color: 'var(--foreground)' }}>
                  {roadmap.title}
                </h1>
                <p style={{ fontSize: '16px', color: 'var(--foreground-muted)', margin: '0 0 24px 0', maxWidth: '600px', lineHeight: 1.6 }}>
                  {roadmap.description}
                </p>
              </div>
            </div>

            <div style={{ background: 'var(--background)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--foreground)' }}>Your Progress</span>
                <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--primary)' }}>
                  {progress.length} / {roadmap.nodes.length} ({roadmap.nodes.length > 0 ? Math.round((progress.length / roadmap.nodes.length) * 100) : 0}%)
                </span>
              </div>
              <div style={{ width: '100%', height: '8px', background: 'var(--border)', borderRadius: '4px', overflow: 'hidden', marginBottom: '20px' }}>
                <div style={{ width: `${roadmap.nodes.length > 0 ? Math.round((progress.length / roadmap.nodes.length) * 100) : 0}%`, height: '100%', background: 'var(--primary)', transition: 'width 0.3s ease' }}></div>
              </div>
              
              {(!progress.length) && (
                <Button variant="primary" onClick={handleStart} disabled={starting} style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '8px' }}>
                  <Play size={18} /> {starting ? 'Starting...' : 'Start Roadmap'}
                </Button>
              )}
            </div>
          </Card>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {Array.from(
              (() => {
                const map = new Map<string, any[]>();
                roadmap.nodes.forEach((node: any) => {
                  if (!map.has(node.stage)) map.set(node.stage, []);
                  map.get(node.stage)!.push(node);
                });
                return map;
              })().entries()
            ).map(([stageName, nodes]) => (
              <div key={stageName}>
                <h3 style={{ 
                  fontSize: '14px', 
                  fontWeight: 700, 
                  color: 'var(--foreground-muted)', 
                  textTransform: 'uppercase', 
                  letterSpacing: '1px',
                  margin: '0 0 16px 16px' 
                }}>
                  {stageName}
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {nodes.map((node: any) => {
                    const isCompleted = progress.some(p => p.nodeId === node.id);
                    const isLocked = node.prerequisites?.length > 0 && 
                      !node.prerequisites.every((prereq: any) => 
                        progress.some(p => p.nodeId === prereq.prerequisiteId)
                      );

                    return (
                      <Link href={`/roadmaps/${encodeURIComponent(slug)}/${node.id}`} key={node.id} style={{ textDecoration: 'none' }}>
                        <div style={{
                          padding: '20px',
                          background: 'var(--surface)',
                          borderRadius: '12px',
                          border: isCompleted ? '1px solid var(--primary-light)' : '1px solid var(--border)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '16px',
                          transition: 'all 0.2s',
                          boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
                          opacity: isLocked ? 0.6 : 1
                        }}
                        onMouseEnter={(e) => { if(!isLocked) e.currentTarget.style.borderColor = 'var(--primary)'; }}
                        onMouseLeave={(e) => e.currentTarget.style.borderColor = isCompleted ? 'var(--primary-light)' : 'var(--border)'}
                        >
                          {isLocked ? (
                            <Lock size={24} color="var(--foreground-muted)" />
                          ) : isCompleted ? (
                            <CheckCircle2 size={24} color="var(--primary)" />
                          ) : (
                            <Circle size={24} color="var(--border)" />
                          )}
                          
                          <div style={{ flex: 1 }}>
                            <h4 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: 600, color: isLocked ? 'var(--foreground-muted)' : 'var(--foreground)' }}>
                              {node.title}
                            </h4>
                            <p style={{ margin: 0, fontSize: '14px', color: 'var(--foreground-muted)' }}>
                              {node.description}
                            </p>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
