import React from 'react';
import Card from '../Card';
import Skeleton from '../Skeleton';

/** Conversation list skeleton: avatar, name, preview, timestamp. */
export default function MessageListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div role="status" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <span className="sr-only">Loading messages…</span>
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} padding="md" aria-hidden="true" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Skeleton width={48} height={48} borderRadius="50%" style={{ flexShrink: 0 }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <Skeleton width="35%" maxWidth={160} height={16} />
              <Skeleton width={48} height={12} />
            </div>
            <Skeleton width="70%" maxWidth={320} height={13} />
          </div>
        </Card>
      ))}
    </div>
  );
}
