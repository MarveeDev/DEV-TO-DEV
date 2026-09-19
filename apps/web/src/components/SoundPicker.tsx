'use client';

import { useEffect, useRef, useState } from 'react';
import { Search, X, Play, Pause } from 'lucide-react';

export interface Sound {
  id: string;
  title: string;
  artist: string;
  audioUrl?: string;
  duration?: number;
  category?: string;
  usageCount?: number;
}

interface SoundPickerProps {
  open: boolean;
  onClose: () => void;
  onSelect: (sound: Sound) => void;
}

const CATEGORIES = ['Lo-fi', 'Ambient', 'Instrumental', 'Focus'];

export default function SoundPicker({ open, onClose, onSelect }: SoundPickerProps) {
  const [sounds, setSounds] = useState<Sound[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (category) params.append('category', category);
    params.append('limit', '50');
    fetch(`/api/v1/sounds?${params.toString()}`)
      .then((res) => (res.ok ? res.json() : { items: [] }))
      .then((data) => setSounds(data.items || []))
      .catch(() => setSounds([]))
      .finally(() => setLoading(false));
  }, [open, search, category]);

  // Stop any preview when the picker closes or unmounts.
  useEffect(() => {
    if (!open) {
      audioRef.current?.pause();
      audioRef.current = null;
      setPreviewId(null);
      setPlaying(false);
    }
  }, [open]);

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, []);

  const togglePreview = (sound: Sound) => {
    if (previewId === sound.id && playing) {
      audioRef.current?.pause();
      setPlaying(false);
      return;
    }
    audioRef.current?.pause();
    audioRef.current = null;
    if (sound.audioUrl) {
      const audio = new Audio(sound.audioUrl);
      audioRef.current = audio;
      audio.onended = () => {
        setPlaying(false);
        setPreviewId(null);
      };
      audio.play().catch(() => {
        setPlaying(false);
        setPreviewId(null);
      });
      setPreviewId(sound.id);
      setPlaying(true);
    }
  };

  if (!open) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 300,
        background: 'rgba(11, 18, 32, 0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          width: '100%',
          maxWidth: '520px',
          maxHeight: 'min(85vh, 720px)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-lg)',
        }}
      >
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--foreground)', margin: 0 }}>Background Sound</h2>
            <p style={{ fontSize: '13px', color: 'var(--foreground-muted)', margin: '2px 0 0' }}>Choose a sound for your video post.</p>
          </div>
          <button onClick={onClose} aria-label="Close" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--foreground-muted)', display: 'flex', padding: 4 }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: '12px 20px', display: 'flex', flexDirection: 'column', gap: '10px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--foreground-subtle)', pointerEvents: 'none' }} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search sounds..."
              style={{
                width: '100%',
                padding: '10px 12px 10px 36px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border)',
                background: 'var(--background)',
                color: 'var(--foreground)',
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            <button
              onClick={() => setCategory('')}
              style={{
                padding: '6px 12px',
                borderRadius: '999px',
                border: '1px solid var(--border)',
                background: category === '' ? 'var(--primary)' : 'var(--surface)',
                color: category === '' ? '#fff' : 'var(--foreground-muted)',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              All
            </button>
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '999px',
                  border: '1px solid var(--border)',
                  background: category === c ? 'var(--primary)' : 'var(--surface)',
                  color: category === c ? '#fff' : 'var(--foreground-muted)',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '8px 12px' }}>
          {loading ? (
            <div style={{ padding: '32px', textAlign: 'center', color: 'var(--foreground-muted)', fontSize: '14px' }}>Loading sounds…</div>
          ) : sounds.length === 0 ? (
            <div style={{ padding: '32px', textAlign: 'center', color: 'var(--foreground-muted)', fontSize: '14px' }}>No sounds found.</div>
          ) : (
            sounds.map((sound) => {
              const isPreviewing = previewId === sound.id && playing;
              return (
                <div
                  key={sound.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px',
                    borderRadius: 'var(--radius-md)',
                    transition: 'background 0.12s ease',
                  }}
                >
                  <button
                    onClick={() => togglePreview(sound)}
                    aria-label={isPreviewing ? 'Pause preview' : 'Preview sound'}
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      border: '1px solid var(--border)',
                      background: isPreviewing ? 'var(--primary)' : 'var(--surface)',
                      color: isPreviewing ? '#fff' : 'var(--foreground)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      flexShrink: 0,
                    }}
                  >
                    {isPreviewing ? <Pause size={18} /> : <Play size={18} />}
                  </button>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--foreground)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {sound.title}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--foreground-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {sound.artist}{sound.category ? ` · ${sound.category}` : ''}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      onSelect(sound);
                      onClose();
                    }}
                    style={{
                      padding: '8px 14px',
                      borderRadius: 'var(--radius-md)',
                      border: 'none',
                      background: 'var(--primary)',
                      color: '#fff',
                      fontSize: '13px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      flexShrink: 0,
                    }}
                  >
                    Select
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
