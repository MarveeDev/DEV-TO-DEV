'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Badge from '../../components/Badge';
import Link from 'next/link';
import BackButton from '../../components/Navigation/BackButton';
import DiscoverTabs from '../../components/Navigation/DiscoverTabs';

import ProjectCard from '../../components/ProjectCard';

export default function ProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const fetchProjects = (searchQuery = '', statusQuery = '') => {
    setLoading(true);
    let url = '/api/v1/projects?limit=20';
    if (searchQuery) url += `&search=${encodeURIComponent(searchQuery)}`;
    if (statusQuery) url += `&status=${encodeURIComponent(statusQuery)}`;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        setProjects(data.items || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProjects(search, statusFilter);
  }, [search, statusFilter]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* Header */}
      <section style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', marginBottom: '-8px' }}>
        <div className="page-header">
          <BackButton fallback="/dashboard" />
          <div className="page-header-content">
            <h1 className="text-wrap-safe" style={{ fontSize: '32px', fontWeight: 800, color: 'var(--foreground)', margin: '0 0 8px 0' }}>
              Projects
            </h1>
            <p style={{ color: 'var(--foreground-muted)', fontSize: '16px', margin: 0 }}>Build something. Share it. Grow together.</p>
          </div>
        </div>
        <Button variant="primary" onClick={() => router.push('/projects/create')}>Create Project</Button>
      </section>

      <DiscoverTabs />

      {/* Filters */}
      <section style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center' }}>
        <input 
          type="text" 
          placeholder="Search projects..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: '10px 16px',
            borderRadius: '8px',
            border: '1px solid var(--border)',
            fontSize: '14px',
            flexGrow: 1,
            maxWidth: '300px',
            outline: 'none',
            background: 'var(--card-bg)',
            color: 'var(--foreground)'
          }}
        />
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
          <Button size="sm" variant={statusFilter === '' ? 'primary' : 'outline'} onClick={() => setStatusFilter('')}>All</Button>
          <Button size="sm" variant={statusFilter === 'ACTIVE' ? 'primary' : 'outline'} onClick={() => setStatusFilter('ACTIVE')}>Active</Button>
          <Button size="sm" variant={statusFilter === 'COMPLETED' ? 'primary' : 'outline'} onClick={() => setStatusFilter('COMPLETED')}>Completed</Button>
        </div>
      </section>

      {/* Projects Grid */}
      {loading ? (
        <div style={{ padding: '60px', textAlign: 'center', color: 'var(--foreground-muted)' }}>Loading projects...</div>
      ) : projects.length === 0 ? (
        <Card padding="lg" style={{ textAlign: 'center' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--foreground)', marginBottom: '8px' }}>No projects found</h3>
          <p style={{ color: 'var(--foreground-muted)', marginBottom: '24px' }}>There are no projects matching your criteria.</p>
          <Button variant="primary" onClick={() => router.push('/projects/create')}>Create the first project</Button>
        </Card>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
          gap: '24px' 
        }}>
          {projects.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
