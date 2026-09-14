import React from 'react';
import Card from '../Card';
import Skeleton from '../Skeleton';

/** Matches a roadmap card: category/difficulty, title, description, meta, CTA. */
export default function RoadmapCardSkeleton() {
  return (
    <Card padding="lg" aria-hidden="true" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
        <Skeleton width={80} height={22} borderRadius="6px" />
        <Skeleton width={60} height={22} borderRadius="6px" />
      </div>
      <Skeleton width="70%" height={20} style={{ marginBottom: 12 }} />
      <Skeleton width="100%" height={13} style={{ marginBottom: 8 }} />
      <Skeleton width="85%" height={13} style={{ marginBottom: 24 }} />
      <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
        <Skeleton width={90} height={14} />
        <Skeleton width={70} height={14} />
      </div>
      <Skeleton width="100%" height={42} borderRadius="var(--radius-md)" style={{ marginTop: 'auto' }} />
    </Card>
  );
}
