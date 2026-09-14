import React from 'react';
import Card from '../Card';
import Skeleton from '../Skeleton';

/** Notification list skeleton: icon, title, message, timestamp, action. */
export default function NotificationListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div role="status" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <span className="sr-only">Loading notifications…</span>
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} padding="md" aria-hidden="true" style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
          <Skeleton width={40} height={40} borderRadius="50%" style={{ flexShrink: 0 }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <Skeleton width="40%" maxWidth={180} height={14} />
              <Skeleton width={48} height={12} />
            </div>
            <Skeleton width="90%" height={13} style={{ marginBottom: 12 }} />
            <Skeleton width={110} height={30} borderRadius="var(--radius-md)" />
          </div>
        </Card>
      ))}
    </div>
  );
}
