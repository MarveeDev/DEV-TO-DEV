import React from 'react';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  style,
  ...props
}: ButtonProps) {
  const baseStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 'var(--radius-md)',
    fontWeight: 600,
    cursor: 'pointer',
    border: 'none',
    transition: 'all 0.2s',
    width: fullWidth ? '100%' : 'auto',
  };

  const variants = {
    primary: {
      background: 'var(--primary)',
      color: '#ffffff',
    },
    secondary: {
      background: 'var(--border)',
      color: 'var(--foreground)',
    },
    outline: {
      background: 'transparent',
      border: '1px solid var(--border)',
      color: 'var(--foreground)',
    },
    ghost: {
      background: 'transparent',
      color: 'var(--foreground-muted)',
    }
  };

  const sizes = {
    sm: { padding: '6px 12px', fontSize: '12px' },
    md: { padding: '10px 16px', fontSize: '14px' },
    lg: { padding: '12px 24px', fontSize: '16px' },
  };

  return (
    <button
      style={{
        ...baseStyle,
        ...variants[variant],
        ...sizes[size],
        ...style,
      }}
      {...props}
    >
      {children}
    </button>
  );
}
