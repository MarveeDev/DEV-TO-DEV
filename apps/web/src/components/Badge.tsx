import React from 'react';

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: 'default' | 'primary' | 'outline' | 'success' | 'danger';
};

export default function Badge({ children, variant = 'default', style, ...props }: BadgeProps) {
  const variants: Record<NonNullable<BadgeProps['variant']>, React.CSSProperties> = {
    default: {
      background: 'var(--surface-hover)',
      color: 'var(--foreground)',
      border: '1px solid transparent',
    },
    primary: {
      background: 'var(--primary-light)',
      color: 'var(--primary)',
      border: '1px solid transparent',
    },
    outline: {
      background: 'transparent',
      color: 'var(--foreground-muted)',
      border: '1px solid var(--border-strong)',
    },
    success: {
      background: 'var(--success-light)',
      color: 'var(--success)',
      border: '1px solid transparent',
    },
    danger: {
      background: 'var(--danger-light)',
      color: 'var(--danger)',
      border: '1px solid transparent',
    },
  };

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '3px 10px',
        borderRadius: 'var(--radius-full)',
        fontSize: '12px',
        fontWeight: 600,
        lineHeight: 1.4,
        ...variants[variant],
        ...style,
      }}
      {...props}
    >
      {children}
    </span>
  );
}
