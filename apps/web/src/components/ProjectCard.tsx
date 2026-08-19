import React from 'react';
import Link from 'next/link';
import Card from './Card';
import Badge from './Badge';

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
      avatarUrl?: string;
    };
    skills: { skill: { name: string } }[];
    _count?: { contributors: number };
  };
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card padding="md">
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px', gap: '8px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--foreground)', margin: 0, wordBreak: 'break-word' }}>
            {project.title}
          </h3>
          <Badge variant={project.status === 'ACTIVE' ? 'primary' : 'default'}>
            {project.status}
          </Badge>
        </div>

        <p style={{ color: 'var(--foreground-muted)', fontSize: '14px', lineHeight: 1.5, marginBottom: '16px', flexGrow: 1, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {project.description}
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
          {project.skills?.slice(0, 3).map((ps: any, idx: number) => (
            <Link 
              key={idx} 
              href={`/skills/${ps.skill.slug || ps.skill.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
              style={{ textDecoration: 'none' }}
              onClick={(e) => e.stopPropagation()}
            >
              <span style={{ fontSize: '12px', padding: '2px 8px', background: 'var(--surface-hover)', borderRadius: '12px', color: 'var(--foreground)', display: 'inline-block', transition: 'all 0.1s ease', cursor: 'pointer' }} className="skill-pill">
                {ps.skill.name}
              </span>
            </Link>
          ))}
          {project.skills?.length > 3 && (
            <span style={{ fontSize: '12px', padding: '2px 8px', background: 'var(--surface-hover)', borderRadius: '12px', color: 'var(--foreground-muted)' }}>
              +{project.skills.length - 3}
            </span>
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid var(--border)', marginTop: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--border)', flexShrink: 0 }}></div>
            <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--foreground)' }}>{project.owner?.displayName}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--foreground-muted)', fontSize: '12px' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
              {project._count?.contributors || 0}
            </div>
            
            <Link href={`/projects/${project.slug}`} style={{ fontSize: '14px', fontWeight: 600, color: 'var(--primary)', textDecoration: 'none' }}>
              View
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
}
