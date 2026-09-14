import React from 'react';
import Card from '../Card';
import Skeleton from '../Skeleton';
import PostCardSkeleton from './PostCardSkeleton';

/** Profile page skeleton: header, identity card, posts, stats sidebar. */
export default function ProfileSkeleton() {
  return (
    <div role="status" style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <span className="sr-only">Loading profile…</span>

      <div aria-hidden="true" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <Skeleton width={180} height={28} />
        <Skeleton width={140} height={40} borderRadius="var(--radius-md)" />
      </div>

      <div className="grid-2-col-sidebar">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32, minWidth: 0 }}>
          <Card padding="md" aria-hidden="true">
            <div style={{ display: 'flex', gap: 20, alignItems: 'center', marginBottom: 32 }}>
              <Skeleton width={80} height={80} borderRadius="50%" style={{ flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <Skeleton width="60%" maxWidth={240} height={24} style={{ marginBottom: 8 }} />
                <Skeleton width="40%" maxWidth={140} height={14} style={{ marginBottom: 8 }} />
                <Skeleton width={100} height={22} borderRadius="999px" />
              </div>
            </div>
            <Skeleton width="100%" height={13} style={{ marginBottom: 8 }} />
            <Skeleton width="90%" height={13} style={{ marginBottom: 24 }} />
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} width={64} height={22} borderRadius="999px" />
              ))}
            </div>
          </Card>

          <div aria-hidden="true" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Skeleton width={140} height={20} />
            <PostCardSkeleton />
            <PostCardSkeleton />
          </div>
        </div>

        <div aria-hidden="true" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <Card padding="md">
            <Skeleton width="60%" height={20} style={{ marginBottom: 16 }} />
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} width="100%" height={40} borderRadius="var(--radius-md)" style={{ marginBottom: 12 }} />
            ))}
          </Card>
          <Card padding="md">
            <Skeleton width="50%" height={20} style={{ marginBottom: 16 }} />
            <Skeleton width="100%" height={40} borderRadius="var(--radius-md)" />
          </Card>
        </div>
      </div>
    </div>
  );
}
