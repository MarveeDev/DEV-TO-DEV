'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '../../components/Button';
import SearchBar from '../../components/SearchBar';
import EmptyState from '../../components/EmptyState';
import Link from 'next/link';
import BackButton from '../../components/Navigation/BackButton';
import DiscoverTabs from '../../components/Navigation/DiscoverTabs';

import ProjectCard from '../../components/ProjectCard';
import { ProjectCardSkeleton } from '../../components/skeletons';
import { Folder } from 'lucide-react';

export default function ProjectsClient({ initialProjects }: { initialProjects: any[] | null }) {
  const router = useRouter();
  const [projects, setProjects] = useState<any[]>(initialProjects ?? []);
  const [loading, setLoading] = useState(initialProjects === null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const didMount = useRef(false);

  const hasInitial = initialProjects !== null;

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
    if (!didMount.current) {
      didMount.current = true;
      if (hasInitial) return;
    }
    fetchProjects(search, statusFilter);
  }, [search, statusFilter]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

      {/* Header */}
      <section style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', marginBottom: '-8px' }}>
        <div className="page-header">
          <BackButton fallback="/dashboard" />
          <div className="page-header-content">
            <h1 className="text-wrap-safe" style={{ color: 'var(--foreground)', margin: '0 0 8px 0' }}>
              Projects
            </h1>
            <p style={{ color: 'var(--foreground-muted)', fontSize: '16px', margin: 0 }}>Build something. Share it. Grow together.</p>
          </div>
        </div>
        <Button variant="primary" onClick={() => router.push('/projects/create')}>Create Project</Button>
      </section>

      <DiscoverTabs />

      {/* Filters */}
      <section style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center' }}>
        <div style={{ flexGrow: 1, maxWidth: 320 }}>
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search projects..."
          />
        </div>
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
          <Button size="sm" variant={statusFilter === '' ? 'primary' : 'outline'} onClick={() => setStatusFilter('')}>All</Button>
          <Button size="sm" variant={statusFilter === 'ACTIVE' ? 'primary' : 'outline'} onClick={() => setStatusFilter('ACTIVE')}>Active</Button>
          <Button size="sm" variant={statusFilter === 'COMPLETED' ? 'primary' : 'outline'} onClick={() => setStatusFilter('COMPLETED')}>Completed</Button>
        </div>
      </section>

      {/* Projects Grid */}
      {loading ? (
        <div role="status" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
          <span className="sr-only">Loading projects…</span>
          <ProjectCardSkeleton />
          <ProjectCardSkeleton />
          <ProjectCardSkeleton />
          <ProjectCardSkeleton />
          <ProjectCardSkeleton />
          <ProjectCardSkeleton />
        </div>
      ) : projects.length === 0 ? (
        <EmptyState
          icon={Folder}
          title="No projects found"
          description="There are no projects matching your criteria."
          action={<Button variant="primary" onClick={() => router.push('/projects/create')}>Create the first project</Button>}
        />
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
