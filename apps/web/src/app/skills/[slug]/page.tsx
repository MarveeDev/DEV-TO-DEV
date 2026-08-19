'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Card from '../../../components/Card';
import BackButton from '../../../components/Navigation/BackButton';
import Badge from '../../../components/Badge';

export default function SkillPage({ params }: { params: Promise<{ slug: string }> | { slug: string } }) {
  const unwrappedParams = React.use(params as any) as { slug: string };
  const slug = unwrappedParams.slug;
  const [skill, setSkill] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const clientFetch = async (url: string, options?: any) => {
    return window.fetch(url, options);
  };

  useEffect(() => {
    clientFetch(`/api/v1/skills/${encodeURIComponent(slug)}`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        setSkill(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return <div style={{ padding: '60px', textAlign: 'center', color: 'var(--foreground-muted)' }}>Loading skill...</div>;
  }

  if (!skill) {
    return (
      <div style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '60px' }}>
        <div style={{ marginBottom: '24px' }}>
          <BackButton fallback="/roadmaps" />
        </div>
        <div style={{ padding: '60px', textAlign: 'center', color: '#ef4444' }}>Skill not found.</div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '60px' }}>
      <div className="page-header" style={{ marginBottom: '24px' }}>
        <BackButton fallback="/roadmaps" />
        {skill.category && (
          <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--foreground-muted)', background: 'var(--border)', padding: '4px 12px', borderRadius: '999px', marginLeft: '12px' }}>
            {skill.category.name}
          </span>
        )}
      </div>

      <Card padding="lg" style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 800, margin: '0 0 12px 0', color: 'var(--foreground)' }}>
          {skill.name}
        </h1>
        <p style={{ fontSize: '16px', color: 'var(--foreground-muted)', margin: 0, lineHeight: 1.6 }}>
          Learn and explore {skill.name} through the DEV-TO-DEV curriculum, projects, and discussions.
        </p>
      </Card>

      {skill.roadmaps && skill.roadmaps.length > 0 && (
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '24px', color: 'var(--foreground)' }}>Learning Curriculum</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {skill.roadmaps.map((rs: any) => (
              <Card key={rs.id} padding="lg" style={{ borderLeft: '4px solid var(--primary)' }}>
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--primary)', textTransform: 'uppercase', marginBottom: '4px' }}>
                    {rs.node.roadmap.title}
                  </div>
                  <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--foreground)', margin: '0 0 8px 0' }}>
                    {rs.node.title}
                  </h3>
                  <p style={{ fontSize: '15px', color: 'var(--foreground-muted)', margin: 0, lineHeight: 1.6 }}>
                    {rs.node.description || 'Learn the fundamental concepts of this node.'}
                  </p>
                </div>

                {rs.node.learningObjectives && rs.node.learningObjectives.length > 0 && (
                  <div style={{ marginBottom: '16px' }}>
                    <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--foreground)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Learning Objectives
                    </h4>
                    <ul style={{ margin: 0, paddingLeft: '20px', color: 'var(--foreground-muted)', fontSize: '14px', lineHeight: 1.6 }}>
                      {rs.node.learningObjectives.map((obj: string, i: number) => (
                        <li key={i} style={{ marginBottom: '4px' }}>{obj}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {rs.node.topics && rs.node.topics.length > 0 && (
                  <div style={{ marginBottom: '16px' }}>
                    <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--foreground)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Core Topics
                    </h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {rs.node.topics.map((topic: string, i: number) => (
                        <span key={i} style={{ fontSize: '13px', background: 'var(--border)', color: 'var(--foreground)', padding: '4px 10px', borderRadius: '4px' }}>
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {rs.node.practicalExercise && (
                  <div style={{ marginBottom: '20px', padding: '12px', background: 'rgba(59, 130, 246, 0.05)', borderRadius: '8px', border: '1px solid rgba(59, 130, 246, 0.1)' }}>
                    <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--primary)', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><line x1="10" y1="9" x2="8" y2="9"></line></svg>
                      Practical Exercise
                    </h4>
                    <p style={{ margin: 0, fontSize: '14px', color: 'var(--foreground-muted)', lineHeight: 1.5 }}>
                      {rs.node.practicalExercise}
                    </p>
                  </div>
                )}

                <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <Link href={`/roadmaps/${rs.node.roadmap.slug}/${rs.node.id}`} style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', background: 'var(--primary)', color: 'white', padding: '8px 16px', borderRadius: '6px', fontSize: '14px', fontWeight: 600, transition: 'opacity 0.2s' }}>
                      Go to Course Material →
                    </Link>
                  </div>
                  
                  {(rs.node.recommendedBookUrl || rs.node.videoUrl) && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
                      {rs.node.recommendedBookUrl && (
                        <div style={{ background: 'var(--surface)', padding: '12px', borderRadius: '6px', border: '1px solid var(--border)' }}>
                          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--foreground)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ fontSize: '16px' }}>📖</span> Learn by Reading
                          </div>
                          <div style={{ fontSize: '14px', color: 'var(--foreground)', fontWeight: 500, marginBottom: '8px', lineHeight: '1.4' }}>
                            {rs.node.recommendedBookTitle || 'Learning Resource'}
                          </div>
                          <a href={rs.node.recommendedBookUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 500, color: 'var(--primary)', background: 'rgba(59, 130, 246, 0.1)', padding: '6px 12px', borderRadius: '4px', textDecoration: 'none' }}>
                            {rs.node.resourceType === 'BOOK' ? 'Open Book →' : rs.node.resourceType === 'COURSE_RESOURCE' ? 'Open Course →' : 'Open Resource →'}
                          </a>
                        </div>
                      )}

                      {rs.node.videoUrl && (
                        <div style={{ background: 'var(--surface)', padding: '12px', borderRadius: '6px', border: '1px solid var(--border)' }}>
                          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--foreground)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ fontSize: '16px' }}>🎥</span> Learn by Watching
                          </div>
                          <div style={{ fontSize: '14px', color: 'var(--foreground)', fontWeight: 500, marginBottom: '8px', lineHeight: '1.4' }}>
                            {rs.node.videoTitle || 'Video Resource'}
                          </div>
                          <a href={rs.node.videoUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 500, color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)', padding: '6px 12px', borderRadius: '4px', textDecoration: 'none' }}>
                            Watch Video →
                          </a>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {skill.projects && skill.projects.length > 0 && (
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '16px', color: 'var(--foreground)' }}>Related Projects</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
            {skill.projects.map((ps: any) => (
              <Link key={ps.id} href={`/projects/${ps.project.slug}`} style={{ textDecoration: 'none' }}>
                <Card padding="md" style={{ height: '100%' }} className="hover-card">
                  <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--foreground)', marginBottom: '8px' }}>{ps.project.title}</div>
                  <div style={{ fontSize: '14px', color: 'var(--foreground-muted)' }}>By {ps.project.owner.displayName}</div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}

      {skill.posts && skill.posts.length > 0 && (
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '16px', color: 'var(--foreground)' }}>Related Posts</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {skill.posts.map((ps: any) => (
              <Link key={ps.id} href={`/posts/${ps.post.id}`} style={{ textDecoration: 'none' }}>
                <Card padding="md" className="hover-card">
                  <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--foreground)', marginBottom: '8px' }}>{ps.post.title || 'Untitled Post'}</div>
                  <div style={{ fontSize: '14px', color: 'var(--foreground-muted)' }}>By {ps.post.author?.email || 'Unknown'}</div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}

      {skill.questions && skill.questions.length > 0 && (
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '16px', color: 'var(--foreground)' }}>Related Questions</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {skill.questions.map((qs: any) => (
              <Link key={qs.id} href={`/questions/${qs.question.id}`} style={{ textDecoration: 'none' }}>
                <Card padding="md" className="hover-card">
                  <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--foreground)', marginBottom: '8px' }}>{qs.question.title}</div>
                  <div style={{ fontSize: '14px', color: 'var(--foreground-muted)' }}>By {qs.question.author?.displayName || 'Unknown'}</div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}

      <style jsx global>{`
        .hover-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
          border-color: var(--primary);
        }
      `}</style>
    </div>
  );
}
