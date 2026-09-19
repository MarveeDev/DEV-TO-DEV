'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Card from '../../../components/Card';
import Button from '../../../components/Button';
import BackButton from '../../../components/Navigation/BackButton';
import { Play, Pause, Music } from 'lucide-react';

interface SoundDetail {
  id: string;
  title: string;
  artist: string;
  audioUrl?: string;
  duration?: number;
  category?: string;
  usageCount?: number;
  postCount?: number;
}

export default function SoundDetailClient({ id, initialSound }: { id: string; initialSound: SoundDetail | null }) {
  const [sound, setSound] = useState<SoundDetail | null>(initialSound);
  const [loading, setLoading] = useState(initialSound === null);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (initialSound !== null) return;
    fetch(`/api/v1/sounds/${encodeURIComponent(id)}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setSound(data))
      .catch(() => setSound(null))
      .finally(() => setLoading(false));
  }, [id, initialSound]);

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, []);

  const togglePreview = () => {
    if (playing) {
      audioRef.current?.pause();
      setPlaying(false);
      return;
    }
    audioRef.current?.pause();
    audioRef.current = null;
    if (sound?.audioUrl) {
      const audio = new Audio(sound.audioUrl);
      audioRef.current = audio;
      audio.onended = () => setPlaying(false);
      audio.play().catch(() => setPlaying(false));
      setPlaying(true);
    }
  };

  if (loading) {
    return <div style={{ padding: '60px', textAlign: 'center', color: 'var(--foreground-muted)' }}>Loading sound…</div>;
  }

  if (!sound) {
    return <div style={{ padding: '60px', textAlign: 'center', color: '#ef4444' }}>Sound not found.</div>;
  }

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', paddingBottom: '40px' }}>
      <div className="page-header" style={{ marginBottom: '24px' }}>
        <BackButton fallback="/code" />
      </div>

      <Card padding="lg">
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={{ width: 64, height: 64, borderRadius: 'var(--radius-md)', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Music size={28} />
          </div>
          <div style={{ minWidth: 0 }}>
            <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--foreground)', margin: 0 }}>{sound.title}</h1>
            <p style={{ color: 'var(--foreground-muted)', fontSize: '14px', margin: '4px 0 0' }}>{sound.artist}</p>
          </div>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '16px' }}>
          {sound.category && (
            <span style={{ fontSize: '12px', fontWeight: 600, padding: '4px 10px', borderRadius: '999px', background: 'var(--surface-hover)', color: 'var(--foreground)' }}>{sound.category}</span>
          )}
          {sound.duration && (
            <span style={{ fontSize: '12px', fontWeight: 600, padding: '4px 10px', borderRadius: '999px', background: 'var(--surface-hover)', color: 'var(--foreground)' }}>{sound.duration}s</span>
          )}
        </div>

        <p style={{ margin: '16px 0 0', color: 'var(--foreground-muted)', fontSize: '14px' }}>
          Used in {sound.postCount ?? sound.usageCount ?? 0} CODE videos
        </p>

        <div style={{ display: 'flex', gap: '12px', marginTop: '24px', flexWrap: 'wrap' }}>
          <Button variant="primary" onClick={togglePreview}>
            {playing ? <Pause size={16} style={{ marginRight: '6px' }} /> : <Play size={16} style={{ marginRight: '6px' }} />}
            {playing ? 'Pause' : 'Preview'}
          </Button>
          <Link href={`/posts/create?soundId=${encodeURIComponent(sound.id)}`} style={{ textDecoration: 'none' }}>
            <Button variant="outline">Use this sound</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
