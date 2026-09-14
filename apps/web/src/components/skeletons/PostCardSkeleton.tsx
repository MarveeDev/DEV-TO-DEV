import React from 'react';
import Card from '../Card';
import Skeleton from '../Skeleton';

/** Matches a feed post card: author, content lines, engagement row. */
export default function PostCardSkeleton() {
  return (
    <Card padding="md" aria-hidden="true" style={{ marginBottom: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <Skeleton width={42} height={42} borderRadius="50%" style={{ flexShrink: 0 }} />
          <div>
            <Skeleton width={120} height={15} style={{ marginBottom: 6 }} />
            <Skeleton width={80} height={12} />
          </div>
        </div>
        <Skeleton width={48} height={12} />
      </div>
      <Skeleton width="100%" height={13} style={{ marginBottom: 8 }} />
      <Skeleton width="95%" height={13} style={{ marginBottom: 8 }} />
      <Skeleton width="70%" height={13} style={{ marginBottom: 16 }} />
      <div style={{ display: 'flex', gap: 24, borderTop: '1px solid var(--border)', paddingTop: 12 }}>
        <Skeleton width={64} height={18} />
        <Skeleton width={72} height={18} />
        <Skeleton width={56} height={18} />
      </div>
    </Card>
  );
}
