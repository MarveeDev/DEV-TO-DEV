'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Card from '../../../components/Card';
import Button from '../../../components/Button';
import Badge from '../../../components/Badge';
import BackButton from '../../../components/Navigation/BackButton';

export default function ProjectDetailsPage({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const [project, setProject] = useState<any>(null);
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [joinStatus, setJoinStatus] = useState<'IDLE' | 'LOADING' | 'PENDING' | 'ACCEPTED' | 'ERROR'>('IDLE');

  const fetchProjectAndUser = async () => {
    try {
      let user = null;
      const userRes = await fetch('/api/v1/auth/me');
      if (userRes.ok) {
        const userData = await userRes.json();
        user = userData?.developerProfile;
        setCurrentUser(user);
      }

      const projRes = await fetch(`/api/v1/projects/${params.slug}`);
      if (!projRes.ok) throw new Error('Project not found');
      const projData = await projRes.json();
      setProject(projData);

      // If user is owner, fetch pending requests
      if (user && projData.owner && user.id === projData.owner.id) {
        const reqsRes = await fetch(`/api/v1/projects/${projData.id}/requests`);
        if (reqsRes.ok) {
          const reqsData = await reqsRes.json();
          setRequests(reqsData);
        }
      } else if (user) {
        // If user is NOT owner, determine if they are a contributor already
        const isContributor = projData.contributors?.some((c: any) => c.developerProfileId === user.id);
        if (isContributor) {
          setJoinStatus('ACCEPTED');
        } else {
          // Ideally the API would tell us if we have a pending request.
          // Since it doesn't easily without an endpoint, we'll rely on the join attempt 
          // to return 409 Conflict if already pending.
        }
      }

      setLoading(false);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectAndUser();
  }, [params.slug]);

  if (loading) return <div style={{ padding: '60px', textAlign: 'center', color: 'var(--foreground-muted)' }}>Loading project...</div>;
  if (error || !project) return <div style={{ padding: '60px', textAlign: 'center', color: 'red' }}>{error || 'Project not found'}</div>;

  const isOwner = currentUser && project.owner && currentUser.id === project.owner.id;

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this project? This action cannot be undone.')) return;
    
    try {
      const res = await fetch(`/api/v1/projects/${project.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      router.push('/projects');
    } catch (err) {
      alert('Error deleting project');
    }
  };

  const handleJoinProject = async () => {
    setJoinStatus('LOADING');
    try {
      const res = await fetch(`/api/v1/projects/${project.id}/join`, { method: 'POST' });
      if (!res.ok) {
        if (res.status === 409) {
          alert('You already have a pending request or are already a contributor.');
          setJoinStatus('PENDING');
          return;
        }
        if (res.status === 401) {
          router.push('/login');
          return;
        }
        throw new Error('Failed to join');
      }
      setJoinStatus('PENDING');
      alert('Request sent to project owner!');
    } catch (err) {
      setJoinStatus('ERROR');
      alert('Network error while requesting to join.');
    }
  };

  const handleRequestAction = async (requestId: string, status: 'ACCEPTED' | 'REJECTED') => {
    try {
      const res = await fetch(`/api/v1/projects/${project.id}/requests/${requestId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        setRequests(requests.filter(r => r.id !== requestId));
        if (status === 'ACCEPTED') {
          // Re-fetch project to update contributors list
          fetchProjectAndUser();
        }
      } else {
        alert('Failed to process request');
      }
    } catch (e) {
      alert('Network error');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '800px', margin: '0 auto' }}>
      
      {/* Header */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div className="page-header">
            <BackButton fallback="/projects" />
            <div className="page-header-content">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px', flexWrap: 'wrap' }}>
                <h1 className="text-wrap-safe" style={{ fontSize: '36px', fontWeight: 800, color: 'var(--foreground)' }}>
                  {project.title}
                </h1>
                <Badge variant={project.status === 'ACTIVE' ? 'primary' : 'default'}>{project.status}</Badge>
              </div>
              <p style={{ color: 'var(--foreground-muted)', fontSize: '16px', lineHeight: 1.6, whiteSpace: 'pre-wrap', margin: 0 }}>
                {project.description}
              </p>
            </div>
          </div>
          
          {isOwner && (
            <div style={{ display: 'flex', gap: '8px' }}>
              <Button variant="outline" onClick={() => router.push(`/projects/${project.slug}/edit`)}>Edit Project</Button>
              <Button variant="outline" onClick={handleDelete}>Delete Project</Button>
            </div>
          )}
          {!isOwner && currentUser && joinStatus !== 'ACCEPTED' && (
            <div style={{ display: 'flex', gap: '8px' }}>
              <Button 
                variant="primary" 
                onClick={handleJoinProject}
                disabled={joinStatus === 'LOADING' || joinStatus === 'PENDING'}
              >
                {joinStatus === 'PENDING' ? 'Request Pending' : 'Join Project'}
              </Button>
            </div>
          )}
        </div>
      </section>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
        
        {/* Technologies */}
        <Card padding="md">
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--foreground)', marginBottom: '16px' }}>Technologies</h3>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {project.skills?.length > 0 ? (
              project.skills.map((ps: any) => (
                <Link key={ps.id} href={`/skills/${ps.skill.slug || ps.skill.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`} style={{ textDecoration: 'none' }}>
                  <Badge variant="default" style={{ cursor: 'pointer' }}>{ps.skill.name}</Badge>
                </Link>
              ))
            ) : (
              <span style={{ fontSize: '14px', color: 'var(--foreground-muted)' }}>No technologies listed</span>
            )}
          </div>
        </Card>

        {/* Links */}
        <Card padding="md">
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--foreground)', marginBottom: '16px' }}>Links</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {project.githubUrl ? (
              <a href={project.githubUrl} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--foreground)', textDecoration: 'none', fontSize: '14px', fontWeight: 500 }}>
                GitHub Repository ↗
              </a>
            ) : (
              <span style={{ fontSize: '14px', color: 'var(--foreground-muted)' }}>No GitHub link</span>
            )}
            {project.demoUrl ? (
              <a href={project.demoUrl} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', textDecoration: 'none', fontSize: '14px', fontWeight: 500 }}>
                Live Demo ↗
              </a>
            ) : (
              <span style={{ fontSize: '14px', color: 'var(--foreground-muted)' }}>No Live Demo</span>
            )}
          </div>
        </Card>
      </div>

      {/* Collaboration Requests (Owner Only) */}
      {isOwner && requests.length > 0 && (
        <section style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--foreground)', margin: 0 }}>Join Requests</h3>
          <Card padding="md">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {requests.map(req => (
                <div key={req.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--border)', flexShrink: 0 }}></div>
                    <div>
                      <h4 style={{ fontSize: '14px', fontWeight: 600, margin: '0 0 2px 0' }}>{req.developerProfile?.displayName}</h4>
                      <p style={{ fontSize: '12px', color: 'var(--foreground-muted)', margin: 0 }}>Wants to join</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <Button size="sm" variant="outline" onClick={() => handleRequestAction(req.id, 'REJECTED')}>Reject</Button>
                    <Button size="sm" variant="primary" onClick={() => handleRequestAction(req.id, 'ACCEPTED')}>Accept</Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </section>
      )}

      {/* Owner & Contributors */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--foreground)', margin: 0 }}>Team</h3>
        <Card padding="md">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--border)', flexShrink: 0 }}></div>
                <div>
                  <Link href={`/developers/${project.owner?.username}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <h4 style={{ fontSize: '14px', fontWeight: 600, margin: '0 0 2px 0' }}>{project.owner?.displayName}</h4>
                  </Link>
                  <p style={{ fontSize: '12px', color: 'var(--foreground-muted)', margin: 0 }}>Owner</p>
                </div>
              </div>
            </div>

            {project.contributors?.length === 0 && (
              <div style={{ padding: '24px 0', textAlign: 'center', color: 'var(--foreground-muted)', fontSize: '14px' }}>
                Be the first developer to join this project.
              </div>
            )}

            {project.contributors?.map((c: any) => (
              <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--border)', flexShrink: 0 }}></div>
                  <div>
                    <Link href={`/developers/${c.developerProfile?.username}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      <h4 style={{ fontSize: '14px', fontWeight: 600, margin: '0 0 2px 0' }}>{c.developerProfile?.displayName}</h4>
                    </Link>
                    <p style={{ fontSize: '12px', color: 'var(--foreground-muted)', margin: 0 }}>Contributor</p>
                  </div>
                </div>
              </div>
            ))}

          </div>
        </Card>
      </section>

    </div>
  );
}
