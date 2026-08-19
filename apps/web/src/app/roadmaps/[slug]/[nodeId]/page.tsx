'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Card from '../../../../components/Card';
import Button from '../../../../components/Button';
import BackButton from '../../../../components/Navigation/BackButton';
import { CheckCircle2, Circle, Lock } from 'lucide-react';

export default function RoadmapNodePage({ params }: { params: Promise<{ slug: string, nodeId: string }> | { slug: string, nodeId: string } }) {
  const router = useRouter();
  console.log('Rendering RoadmapNodePage!');
  const unwrappedParams = React.use(params as any) as { slug: string, nodeId: string };
  console.log('unwrappedParams', unwrappedParams);
  const slug = unwrappedParams.slug;
  const nodeId = unwrappedParams.nodeId;
  const [node, setNode] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [progress, setProgress] = useState<any[]>([]);

  const clientFetch = async (url: string, options?: any) => {
    return window.fetch(url, options);
  };

  useEffect(() => {
    clientFetch('/api/v1/auth/me')
      .then(res => res.ok ? res.json() : null)
      .then(data => setUser(data))
      .catch(() => {});

    fetchData();
  }, [nodeId]);

  const fetchData = async () => {
    try {
      const res = await clientFetch(`/api/v1/roadmaps/nodes/${encodeURIComponent(nodeId)}`);
      if (!res.ok) throw new Error('Node not found');
      const data = await res.json();
      setNode(data);

      const progRes = await clientFetch('/api/v1/roadmaps/me');
      if (progRes.ok) {
        const progData = await progRes.json();
        setProgress(progData);
        setIsCompleted(progData.some((p: any) => p.nodeId === nodeId));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const isLocked = node?.prerequisites?.length > 0 && !node.prerequisites.every((prereq: any) =>
    progress.some(p => p.nodeId === prereq.prerequisiteId)
  );

  const handleToggleComplete = async () => {
    if (!user) {
      router.push('/login');
      return;
    }
    if (isLocked) return;
    
    setUpdating(true);
    try {
      if (isCompleted) {
        await clientFetch(`/api/v1/roadmaps/nodes/${encodeURIComponent(nodeId)}/complete`, { method: 'DELETE' });
        setIsCompleted(false);
      } else {
        const res = await clientFetch(`/api/v1/roadmaps/nodes/${encodeURIComponent(nodeId)}/complete`, { method: 'POST' });
        if (res.ok) {
          setIsCompleted(true);
        } else {
          const err = await res.json();
          alert(err.message || 'Failed to complete node');
        }
      }
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '60px' }}>
      <div className="page-header" style={{ marginBottom: '24px' }}>
        <BackButton fallback={`/roadmaps/${encodeURIComponent(slug)}`} />
        {node && node.roadmap && (
          <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--foreground-muted)', background: 'var(--border)', padding: '4px 12px', borderRadius: '999px', marginLeft: '12px' }}>
            {node.roadmap.title}
          </span>
        )}
      </div>

      {loading ? (
        <div style={{ padding: '60px', textAlign: 'center', color: 'var(--foreground-muted)' }}>Loading topic...</div>
      ) : !node ? (
        <div style={{ padding: '60px', textAlign: 'center', color: '#ef4444' }}>Topic not found.</div>
      ) : (
        <Card padding="lg" style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
                {node.stage}
              </div>
              <h1 style={{ fontSize: '32px', fontWeight: 800, margin: '0 0 12px 0', color: 'var(--foreground)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                {isLocked && <Lock size={28} color="var(--foreground-muted)" />}
                {node.title}
              </h1>
              <p style={{ fontSize: '16px', color: 'var(--foreground-muted)', margin: 0, lineHeight: 1.6 }}>
                {node.description}
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--foreground-muted)' }}>
                ~{node.estimatedHours} hours
              </span>
            </div>
          </div>

          {node.learningObjectives && node.learningObjectives.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--foreground)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Learning Objectives
              </h4>
              <ul style={{ margin: 0, paddingLeft: '20px', color: 'var(--foreground-muted)', fontSize: '15px', lineHeight: 1.6 }}>
                {node.learningObjectives.map((obj: string, i: number) => (
                  <li key={i} style={{ marginBottom: '6px' }}>{obj}</li>
                ))}
              </ul>
            </div>
          )}

          {node.topics && node.topics.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--foreground)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Core Topics
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {node.topics.map((topic: string, i: number) => (
                  <span key={i} style={{ fontSize: '14px', background: 'var(--border)', color: 'var(--foreground)', padding: '6px 12px', borderRadius: '4px' }}>
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          )}

          {node.practicalExercise && (
            <div style={{ marginBottom: '32px', padding: '16px', background: 'rgba(59, 130, 246, 0.05)', borderRadius: '8px', border: '1px solid rgba(59, 130, 246, 0.1)' }}>
              <h4 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--primary)', margin: '0 0 12px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><line x1="10" y1="9" x2="8" y2="9"></line></svg>
                Practical Exercise
              </h4>
              <p style={{ margin: 0, fontSize: '15px', color: 'var(--foreground-muted)', lineHeight: 1.6 }}>
                {node.practicalExercise}
              </p>
            </div>
          )}

          {(node.recommendedBookUrl || node.videoUrl) && (
            <div style={{ marginBottom: '32px', padding: '16px', background: 'var(--surface)', borderRadius: '8px', border: '1px solid var(--border)' }}>
              <h4 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--foreground)', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path></svg>
                Recommended Learning Resources
              </h4>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
                {node.recommendedBookUrl && (
                  <div style={{ paddingBottom: node.videoUrl ? '24px' : '0', borderBottom: node.videoUrl ? '1px solid var(--border)' : 'none' }}>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--foreground)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '16px' }}>📖</span> Learn by Reading
                    </div>
                    {node.recommendedBookTitle && (
                      <div style={{ marginBottom: '4px' }}>
                        <span style={{ fontSize: '16px', fontWeight: 600, color: 'var(--foreground)' }}>
                          {node.recommendedBookTitle}
                        </span>
                      </div>
                    )}
                    {node.recommendedBookAuthor && (
                      <div style={{ marginBottom: '8px', fontSize: '14px', color: 'var(--muted)' }}>
                        {node.recommendedBookAuthor}
                      </div>
                    )}
                    {node.recommendedBookDescription && (
                      <div style={{ marginBottom: '12px', fontSize: '14px', color: 'var(--foreground)', lineHeight: '1.5' }}>
                        {node.recommendedBookDescription}
                      </div>
                    )}
                    <a href={node.recommendedBookUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontWeight: 500, color: 'var(--primary)', background: 'rgba(59, 130, 246, 0.1)', padding: '6px 12px', borderRadius: '4px', textDecoration: 'none' }}>
                      {node.resourceType === 'BOOK' ? 'Open Recommended Book →' : node.resourceType === 'COURSE_RESOURCE' ? 'Open Recommended Course →' : node.resourceType === 'OFFICIAL_DOCUMENTATION' ? 'Open Official Resource →' : 'Open Reading Resource →'}
                    </a>
                  </div>
                )}

                {node.videoUrl && (
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--foreground)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '16px' }}>🎥</span> Learn by Watching
                    </div>
                    {node.videoTitle && (
                      <div style={{ marginBottom: '4px' }}>
                        <span style={{ fontSize: '16px', fontWeight: 600, color: 'var(--foreground)' }}>
                          {node.videoTitle}
                        </span>
                      </div>
                    )}
                    {node.videoInstructor && (
                      <div style={{ marginBottom: '8px', fontSize: '14px', color: 'var(--muted)' }}>
                        {node.videoInstructor} {node.videoPlatform ? `• ${node.videoPlatform}` : ''} {node.videoDuration ? `• ${node.videoDuration}` : ''}
                      </div>
                    )}
                    {node.videoDescription && (
                      <div style={{ marginBottom: '12px', fontSize: '14px', color: 'var(--foreground)', lineHeight: '1.5' }}>
                        {node.videoDescription}
                      </div>
                    )}
                    <a href={node.videoUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontWeight: 500, color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)', padding: '6px 12px', borderRadius: '4px', textDecoration: 'none' }}>
                      Watch Video →
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          {isLocked && (
            <div style={{ background: '#fffbeb', border: '1px solid #fde68a', color: '#92400e', padding: '16px', borderRadius: '8px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Lock size={20} />
              <div>
                <strong>Locked.</strong> You must complete prerequisite topics before you can complete this node.
              </div>
            </div>
          )}

          <div style={{ paddingTop: '24px', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '16px', fontWeight: 600, margin: '0 0 12px 0', color: 'var(--foreground)' }}>Related Skills</h3>
              {node.skills && node.skills.length > 0 ? (
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {node.skills.map((s: any) => (
                    <Link key={s.id} href={`/skills/${s.skill.slug}`} style={{ textDecoration: 'none' }}>
                      <span style={{ fontSize: '13px', padding: '4px 12px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '999px', color: 'var(--foreground)', display: 'inline-block', transition: 'all 0.1s ease', cursor: 'pointer' }} className="skill-pill">
                        {s.skill.name}
                      </span>
                    </Link>
                  ))}
                </div>
              ) : (
                <span style={{ fontSize: '14px', color: 'var(--foreground-muted)' }}>No specific skills mapped yet.</span>
              )}
            </div>

            <div>
              <Button 
                variant={isCompleted ? 'outline' : 'primary'} 
                onClick={handleToggleComplete} 
                disabled={updating || isLocked}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', opacity: isLocked ? 0.5 : 1 }}
              >
                {isCompleted ? (
                  <><CheckCircle2 size={20} color="var(--primary)" /> Completed</>
                ) : (
                  <><Circle size={20} /> Mark Complete</>
                )}
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
