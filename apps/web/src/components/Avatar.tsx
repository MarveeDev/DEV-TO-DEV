'use client';

import React, { useState } from 'react';

interface AvatarProps {
  src?: string | null;
  name?: string | null;
  size?: number;
  style?: React.CSSProperties;
  className?: string;
}

const PALETTE: { bg: string; fg: string }[] = [
  { bg: '#e0e7ff', fg: '#4338ca' },
  { bg: '#dbeafe', fg: '#1d4ed8' },
  { bg: '#ede9fe', fg: '#6d28d9' },
  { bg: '#cffafe', fg: '#0e7490' },
  { bg: '#dcfce7', fg: '#15803d' },
  { bg: '#fef3c7', fg: '#b45309' },
  { bg: '#fee2e2', fg: '#b91c1c' },
  { bg: '#fce7f3', fg: '#be185d' },
];

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

function getInitials(name?: string | null): string {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * Renders a user avatar. Uses the provided image when available and falls back
 * to deterministic initials on a soft brand tint otherwise (or on image error).
 * Uses a plain <img> so external avatar hosts work without next/image config.
 */
export default function Avatar({ src, name, size = 40, style, className }: AvatarProps) {
  const [errored, setErrored] = useState(false);
  const showImage = src && !errored;

  const palette = PALETTE[hashString(name || '') % PALETTE.length];
  const initials = getInitials(name);

  const baseStyle: React.CSSProperties = {
    width: size,
    height: size,
    borderRadius: '50%',
    flexShrink: 0,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    background: showImage ? 'var(--surface-hover)' : palette.bg,
    color: palette.fg,
    fontWeight: 700,
    fontSize: Math.round(size * 0.4),
    lineHeight: 1,
    userSelect: 'none',
  };

  return (
    <div style={{ ...baseStyle, ...style }} className={className} aria-hidden="true">
      {showImage ? (
        <img
          src={src}
          alt=""
          referrerPolicy="no-referrer"
          onError={() => setErrored(true)}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
}
