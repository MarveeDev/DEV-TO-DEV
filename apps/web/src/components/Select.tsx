'use client';

import React, { useState, useRef, useEffect, useId } from 'react';

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  label?: string;       // e.g. "Sort by"
  id?: string;
  fullWidth?: boolean;
  style?: React.CSSProperties;
}

export default function Select({
  options,
  value,
  onChange,
  label,
  id,
  fullWidth = false,
  style,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const autoId = useId();
  const triggerId = id ?? `select-trigger-${autoId}`;
  const listboxId = `select-listbox-${autoId}`;

  const selectedOption = options.find((o) => o.value === value) ?? options[0];

  // Close on outside click / touch
  useEffect(() => {
    function handlePointerDown(e: MouseEvent | TouchEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
    };
  }, []);

  // Keyboard navigation
  function handleKeyDown(e: React.KeyboardEvent) {
    const currentIndex = options.findIndex((o) => o.value === value);
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsOpen((prev) => !prev);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!isOpen) { setIsOpen(true); return; }
      const next = options[(currentIndex + 1) % options.length];
      onChange(next.value);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!isOpen) { setIsOpen(true); return; }
      const prev = options[(currentIndex - 1 + options.length) % options.length];
      onChange(prev.value);
    }
  }

  function handleSelect(optValue: string) {
    onChange(optValue);
    setIsOpen(false);
  }

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        display: fullWidth ? 'flex' : 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        width: fullWidth ? '100%' : undefined,
        ...style,
      }}
    >
      {label && (
        <span
          id={`${triggerId}-label`}
          style={{ fontSize: '14px', color: 'var(--foreground-muted)', whiteSpace: 'nowrap', userSelect: 'none' }}
        >
          {label}
        </span>
      )}

      {/* Trigger button */}
      <button
        id={triggerId}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        aria-labelledby={label ? `${triggerId}-label ${triggerId}` : undefined}
        onClick={() => setIsOpen((prev) => !prev)}
        onKeyDown={handleKeyDown}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '6px',
          padding: '6px 12px',
          flex: fullWidth ? '1 1 0' : undefined,
          width: fullWidth && !label ? '100%' : undefined,
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border)',
          background: 'var(--card-bg)',
          color: 'var(--foreground)',
          fontSize: '14px',
          fontWeight: 500,
          cursor: 'pointer',
          outline: 'none',
          whiteSpace: 'nowrap',
          transition: 'border-color 0.15s, box-shadow 0.15s',
          boxShadow: isOpen ? '0 0 0 2px var(--primary-light)' : 'none',
          borderColor: isOpen ? 'var(--primary)' : 'var(--border)',
        }}
      >
        {selectedOption?.label}
        {/* Chevron */}
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          style={{
            transition: 'transform 0.2s',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            flexShrink: 0,
          }}
        >
          <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <ul
          ref={listRef}
          id={listboxId}
          role="listbox"
          aria-label={label ?? 'Options'}
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            right: 0,
            minWidth: '160px',
            margin: 0,
            padding: '4px',
            listStyle: 'none',
            background: 'var(--card-bg)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
            zIndex: 9999,
            overflow: 'hidden',
          }}
        >
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <li
                key={opt.value}
                role="option"
                aria-selected={isSelected}
                onClick={() => handleSelect(opt.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleSelect(opt.value); }
                }}
                tabIndex={0}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '8px',
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '14px',
                  fontWeight: isSelected ? 600 : 400,
                  color: isSelected ? 'var(--primary)' : 'var(--foreground)',
                  background: isSelected ? 'var(--primary-light)' : 'transparent',
                  cursor: 'pointer',
                  transition: 'background 0.1s',
                  outline: 'none',
                  userSelect: 'none',
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) e.currentTarget.style.background = 'var(--surface)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = isSelected ? 'var(--primary-light)' : 'transparent';
                }}
                onFocus={(e) => {
                  if (!isSelected) e.currentTarget.style.background = 'var(--surface)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.background = isSelected ? 'var(--primary-light)' : 'transparent';
                }}
              >
                <span>{opt.label}</span>
                {isSelected && (
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                    style={{ flexShrink: 0 }}
                  >
                    <path
                      d="M2.5 7L5.5 10L11.5 4"
                      stroke="var(--primary)"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
