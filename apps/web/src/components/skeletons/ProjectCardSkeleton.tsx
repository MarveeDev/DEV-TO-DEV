import React from 'react';
import Card from '../Card';
import Skeleton from '../Skeleton';

/** Matches a project card: title, description, tech pills, footer metadata. */
export default function ProjectCardSkeleton() {
  return (
    <Card padding="md" aria-hidden="true" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 12 }}>
        <Skeleton width="55%" maxWidth={200} height={18} />
        <Skeleton width={72} height={22} borderRadius="999px" />
      </div>
      <Skeleton width="100%" height={13} style={{ marginBottom: 8 }} />
      <Skeleton width="92%" height={13} style={{ marginBottom: 8 }} />
      <Skeleton width="60%" height={13} style={{ marginBottom: 16 }} />
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
        <Skeleton width={56} height={22} borderRadius="999px" />
        <Skeleton width={48} height={22} borderRadius="999px" />
        <Skeleton width={44} height={22} borderRadius="999px" />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: 14, marginTop: 'auto' }}>
        <Skeleton width={100} height={20} />
        <Skeleton width={48} height={16} />
      </div>
    </Card>
  );
}
