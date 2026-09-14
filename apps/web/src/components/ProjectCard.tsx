import React from 'react';
import Link from 'next/link';
import Card from './Card';
import Badge from './Badge';
import Avatar from './Avatar';
import SkillTag from './SkillTag';

interface ProjectCardProps {
  project: {
    title: string;
    slug: string;
    description: string;
    status: 'ACTIVE' | 'COMPLETED' | 'PAUSED' | 'ARCHIVED';
    thumbnailUrl?: string;
    owner: {
      displayName: string;
      username: string;
      avatarUrl?: string | null;
    };
    skills: { skill: { name: string; slug?: string } }[];
    _count?: { contributors: number };
  };
}

const STATUS_VARIANT: Record<string, 'primary' | 'success' | 'default'> = {
  ACTIVE: 'primary',
  COMPLETED: 'success',
  PAUSED: 'default',
  ARCHIVED: 'default',
};

export default function ProjectCard({ project }: ProjectCardProps) {
  const statusLabel = project.status.charAt(0) + project.status.slice(1).toLowerCase();

  return (
    <Link href={`/projects/${project.slug}`} style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
      <Card padding="md" className="hover-card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12, gap: 8 }}>
          <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--foreground)', margin: 0, wordBreak: 'break-word', letterSpacing: '-0.01em' }}>
            {project.title}
          </h3>
          <Badge variant={STATUS_VARIANT[project.status] ?? 'default'}>{statusLabel}</Badge>
        </div>

        <p style={{ color: 'var(--foreground-muted)', fontSize: 14, lineHeight: 1.5, marginBottom: 16, flexGrow: 1, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {project.description}
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
          {project.skills?.slice(0, 3).map((ps, idx) => (
            <SkillTag key={idx} name={ps.skill.name} slug={ps.skill.slug} />
          ))}
          {project.skills && project.skills.length > 3 && (
            <span className="skill-pill">+{project.skills.length - 3}</span>
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 14, borderTop: '1px solid var(--border)', marginTop: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
            <Avatar src={project.owner?.avatarUrl} name={project.owner?.displayName} size={24} />
            <span className="truncate" style={{ fontSize: 12, fontWeight: 500, color: 'var(--foreground)' }}>{project.owner?.displayName}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--foreground-muted)', fontSize: 12 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
              {project._count?.contributors || 0}
            </div>
            <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--primary)' }}>View</span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
