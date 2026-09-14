import React from 'react';
import Card from '../Card';
import Skeleton from '../Skeleton';

/** Matches a question card: title, excerpt, tags, votes/answers, author. */
export default function QuestionCardSkeleton() {
  return (
    <Card padding="md" aria-hidden="true" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Skeleton width="85%" height={18} />
      <Skeleton width="100%" height={13} />
      <Skeleton width="60%" height={13} />
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        <Skeleton width={56} height={22} borderRadius="999px" />
        <Skeleton width={48} height={22} borderRadius="999px" />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, marginTop: 4 }}>
        <div style={{ display: 'flex', gap: 14 }}>
          <Skeleton width={56} height={13} />
          <Skeleton width={64} height={13} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Skeleton width={20} height={20} borderRadius="50%" />
          <Skeleton width={60} height={13} />
        </div>
      </div>
    </Card>
  );
}
