import React from 'react';

type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  padding?: 'none' | 'sm' | 'md' | 'lg';
};

export default function Card({ children, padding = 'md', style, ...props }: CardProps) {
  const paddings = {
    none: '0',
    sm: '12px',
    md: '24px',
    lg: '32px',
  };

  return (
    <div
      style={{
        background: 'var(--surface)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow-sm)',
        padding: paddings[padding],
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
}
