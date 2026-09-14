'use client';

import React from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onSubmit?: (value: string) => void;
  size?: 'md' | 'lg';
  style?: React.CSSProperties;
  inputStyle?: React.CSSProperties;
  autoFocus?: boolean;
}

export default function SearchBar({
  value,
  onChange,
  placeholder = 'Search...',
  onSubmit,
  size = 'md',
  style,
  inputStyle,
  autoFocus,
}: SearchBarProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSubmit) {
      e.preventDefault();
      onSubmit(value);
    }
  };

  return (
    <form
      role="search"
      style={{ position: 'relative', width: '100%', ...style }}
      onSubmit={(e) => {
        if (onSubmit) {
          e.preventDefault();
          onSubmit(value);
        }
      }}
    >
      <Search
        size={size === 'lg' ? 20 : 18}
        color="var(--foreground-subtle)"
        style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
      />
      <input
        type="text"
        value={value}
        autoFocus={autoFocus}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        aria-label={placeholder}
        style={{
          width: '100%',
          padding: size === 'lg' ? '13px 16px 13px 44px' : '11px 14px 11px 40px',
          borderRadius: 'var(--radius-full)',
          border: '1px solid var(--border)',
          background: 'var(--surface)',
          color: 'var(--foreground)',
          fontSize: size === 'lg' ? 15 : 14,
          outline: 'none',
          boxSizing: 'border-box',
          transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
          ...inputStyle,
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = 'var(--primary)';
          e.currentTarget.style.boxShadow = '0 0 0 3px var(--primary-light)';
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = 'var(--border)';
          e.currentTarget.style.boxShadow = 'none';
        }}
      />
    </form>
  );
}
