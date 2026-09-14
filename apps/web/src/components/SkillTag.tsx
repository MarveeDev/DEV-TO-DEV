import React from 'react';
import Link from 'next/link';

interface SkillTagProps {
  name: string;
  slug?: string | null;
  variant?: 'default' | 'primary' | 'outline';
  onClick?: (e: React.MouseEvent) => void;
  style?: React.CSSProperties;
}

function skillSlug(name: string, slug?: string | null): string {
  return slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
}

/**
 * Compact technology pill. Links to the skill page when a name is provided.
 */
export default function SkillTag({ name, slug, variant = 'default', onClick, style }: SkillTagProps) {
  const classes = [
    'skill-pill',
    variant === 'primary' ? 'skill-pill--primary' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const href = `/skills/${encodeURIComponent(skillSlug(name, slug))}`;

  if (onClick) {
    return (
      <span className={classes} style={style} onClick={onClick} role="link" tabIndex={0}>
        {name}
      </span>
    );
  }

  return (
    <Link href={href} className={classes} style={style} onClick={(e: React.MouseEvent<HTMLAnchorElement>) => e.stopPropagation()}>
      {name}
    </Link>
  );
}
