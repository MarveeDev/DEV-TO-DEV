import React from 'react';
import Card from '../Card';
import Skeleton from '../Skeleton';
import ProjectCardSkeleton from './ProjectCardSkeleton';
import QuestionCardSkeleton from './QuestionCardSkeleton';

/** Full dashboard composition: greeting + search, tabs, developers, projects, questions, sidebar. */
export default function DashboardSkeleton() {
  return (
    <div role="status" style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <span className="sr-only">Loading dashboard…</span>

      {/* Greeting + search */}
      <div aria-hidden="true" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Skeleton width={52} height={52} borderRadius="50%" />
          <div style={{ flex: 1, minWidth: 0 }}>
            <Skeleton width="50%" maxWidth={280} height={24} style={{ marginBottom: 8 }} />
            <Skeleton width="30%" maxWidth={180} height={14} />
          </div>
        </div>
        <Skeleton width="100%" height={52} borderRadius="999px" />
      </div>

      {/* Category tabs */}
      <div aria-hidden="true">
        <Skeleton width="100%" maxWidth={460} height={40} borderRadius="var(--radius-md)" />
      </div>

      {/* Featured developers */}
      <div aria-hidden="true" style={{ display: 'flex', gap: 16, overflow: 'hidden' }}>
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} padding="md" style={{ flex: '0 0 200px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              <Skeleton width={56} height={56} borderRadius="50%" />
              <Skeleton width="70%" height={15} />
              <Skeleton width="50%" height={12} />
              <Skeleton width={72} height={20} borderRadius="999px" />
            </div>
          </Card>
        ))}
      </div>

      {/* Lower grid */}
      <div className="dashboard-lower-grid" aria-hidden="true">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32, minWidth: 0 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Skeleton width={160} height={20} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
              <ProjectCardSkeleton />
              <ProjectCardSkeleton />
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Skeleton width={160} height={20} />
            <QuestionCardSkeleton />
            <QuestionCardSkeleton />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          <Card padding="md" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Skeleton width="60%" height={20} style={{ marginBottom: 4 }} />
            <Skeleton width="100%" height={44} borderRadius="var(--radius-md)" />
            <Skeleton width="100%" height={44} borderRadius="var(--radius-md)" />
          </Card>
          <Card padding="md" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Skeleton width="50%" height={20} style={{ marginBottom: 4 }} />
            <Skeleton width="100%" height={44} borderRadius="var(--radius-md)" />
            <Skeleton width="100%" height={44} borderRadius="var(--radius-md)" />
          </Card>
        </div>
      </div>
    </div>
  );
}
