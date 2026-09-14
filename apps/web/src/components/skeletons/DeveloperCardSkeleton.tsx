import React from 'react';
import Card from '../Card';
import Skeleton from '../Skeleton';

/** Matches a developer/connection row: avatar, name, username, pills, action. */
export default function DeveloperCardSkeleton() {
  return (
    <Card
      padding="md"
      aria-hidden="true"
      style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}
    >
      <div style={{ display: 'flex', gap: 16, alignItems: 'center', flex: 1, minWidth: 0 }}>
        <Skeleton width={52} height={52} borderRadius="50%" style={{ flexShrink: 0 }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <Skeleton width="45%" maxWidth={180} height={16} style={{ marginBottom: 6 }} />
          <Skeleton width="30%" maxWidth={120} height={12} style={{ marginBottom: 12 }} />
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <Skeleton width={64} height={22} borderRadius="999px" />
            <Skeleton width={56} height={22} borderRadius="999px" />
            <Skeleton width={48} height={22} borderRadius="999px" />
          </div>
        </div>
      </div>
      <Skeleton width={72} height={34} borderRadius="var(--radius-md)" style={{ flexShrink: 0 }} />
    </Card>
  );
}
