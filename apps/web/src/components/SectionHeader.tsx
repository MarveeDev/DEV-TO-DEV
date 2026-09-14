import React from 'react';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  style?: React.CSSProperties;
}

export default function SectionHeader({ title, subtitle, action, style }: SectionHeaderProps) {
  return (
    <div className="section-header" style={style}>
      <div style={{ minWidth: 0 }}>
        <h2 className="section-header__title">{title}</h2>
        {subtitle && <p className="section-header__subtitle">{subtitle}</p>}
      </div>
      {action && <div style={{ flexShrink: 0 }}>{action}</div>}
    </div>
  );
}
