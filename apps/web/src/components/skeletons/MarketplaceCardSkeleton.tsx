import React from 'react';
import Card from '../Card';
import Skeleton from '../Skeleton';

/** Matches a marketplace listing card: image, type/price, title, desc, seller. */
export default function MarketplaceCardSkeleton() {
  return (
    <Card padding="md" aria-hidden="true" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Skeleton width="100%" height={160} borderRadius="var(--radius-sm)" style={{ marginBottom: 16 }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
        <Skeleton width={88} height={20} borderRadius="6px" />
        <Skeleton width={64} height={18} />
      </div>
      <Skeleton width="80%" height={18} style={{ marginBottom: 8 }} />
      <Skeleton width="100%" height={13} style={{ marginBottom: 8 }} />
      <Skeleton width="60%" height={13} style={{ marginBottom: 16 }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, borderTop: '1px solid var(--border)', paddingTop: 12, marginTop: 'auto' }}>
        <Skeleton width={24} height={24} borderRadius="50%" />
        <Skeleton width={88} height={12} />
      </div>
    </Card>
  );
}
