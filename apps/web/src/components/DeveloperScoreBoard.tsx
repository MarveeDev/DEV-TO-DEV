'use client';

import React, { useEffect, useState } from 'react';
import Card from './Card';

export default function DeveloperScoreBoard({ username, isMe }: { username?: string, isMe?: boolean }) {
  const [scoreData, setScoreData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const endpoint = isMe ? '/api/v1/score/me' : `/api/v1/score/developers/${username}`;

    fetch(endpoint)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        setScoreData(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [username, isMe]);

  if (loading) return null;
  if (!scoreData) return null;

  const stats = [
    { label: 'Dev Score', value: scoreData.score, highlight: true },
    { label: 'Streak', value: `${scoreData.streak} ${scoreData.streak === 1 ? 'day' : 'days'}` },
    { label: 'Posts', value: scoreData.postsCount },
    { label: 'Connections', value: scoreData.connectionsCount },
    { label: 'Projects', value: scoreData.projectsCount },
  ];

  return (
    <Card padding="md">
      <h3 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 16px 0', color: 'var(--foreground)' }}>Developer Stats</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {stats.map((s) => (
          <div
            key={s.label}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 16px',
              borderRadius: 'var(--radius-md)',
              background: s.highlight ? 'var(--primary-light)' : 'var(--surface-muted)',
            }}
          >
            <span style={{ fontSize: 13, color: s.highlight ? 'var(--primary)' : 'var(--foreground-muted)', fontWeight: 600 }}>
              {s.label}
            </span>
            <span style={{ fontSize: 18, fontWeight: 800, color: s.highlight ? 'var(--primary)' : 'var(--foreground)' }}>
              {s.value}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
