import React from 'react';

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: 'default' | 'primary' | 'outline';
};

export default function Badge({ children, variant = 'default', style, ...props }: BadgeProps) {
  const variants = {
    default: {
      background: 'var(--border)',
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
      border: '1px dashed var(--border)',
    }
  };

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '4px 12px',
        borderRadius: '9999px',
        fontSize: '12px',
        fontWeight: 500,
        ...variants[variant],
        ...style,
      }}
      {...props}
    >
      {children}
    </span>
  );
}
