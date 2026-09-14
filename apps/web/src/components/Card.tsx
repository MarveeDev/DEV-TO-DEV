import React from 'react';

type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  padding?: 'none' | 'sm' | 'md' | 'lg';
};

export default function Card({ children, padding = 'md', style, className, ...props }: CardProps) {
  const paddings = {
    none: '0',
    sm: '12px',
    md: '24px',
    lg: '32px',
  };

  return (
    <div
      className={['card', className].filter(Boolean).join(' ')}
      style={{ padding: paddings[padding], ...style }}
      {...props}
    >
      {children}
    </div>
  );
}
