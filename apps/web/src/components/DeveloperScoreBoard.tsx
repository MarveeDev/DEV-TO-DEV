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

  return (
    <Card padding="md">
      <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px', color: 'var(--foreground)' }}>Developer Stats</h3>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
        gap: '16px',
      }}>
        <div>
          <div style={{ fontSize: '12px', color: 'var(--foreground-muted)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em' }}>Dev Score</div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--primary)' }}>{scoreData.score}</div>
        </div>
        
        <div>
          <div style={{ fontSize: '12px', color: 'var(--foreground-muted)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em' }}>Streak</div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--foreground)' }}>{scoreData.streak} {scoreData.streak === 1 ? 'day' : 'days'}</div>
        </div>

        <div>
          <div style={{ fontSize: '12px', color: 'var(--foreground-muted)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em' }}>Posts</div>
          <div style={{ fontSize: '20px', fontWeight: 600, color: 'var(--foreground)' }}>{scoreData.postsCount}</div>
        </div>

        <div>
          <div style={{ fontSize: '12px', color: 'var(--foreground-muted)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em' }}>Connections</div>
          <div style={{ fontSize: '20px', fontWeight: 600, color: 'var(--foreground)' }}>{scoreData.connectionsCount}</div>
        </div>

        <div>
          <div style={{ fontSize: '12px', color: 'var(--foreground-muted)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em' }}>Projects</div>
          <div style={{ fontSize: '20px', fontWeight: 600, color: 'var(--foreground)' }}>{scoreData.projectsCount}</div>
        </div>
      </div>
    </Card>
  );
}
