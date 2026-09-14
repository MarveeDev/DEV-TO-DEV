import React, { useState, useRef, useEffect } from 'react';

export interface Option {
  id: string;
  name: string;
  category?: string;
}

interface MultiSelectProps {
  options: Option[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  placeholder?: string;
}

export default function MultiSelect({ options, selectedIds, onChange, placeholder = "Select..." }: MultiSelectProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = options.filter(opt =>
    opt.name.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter(selId => selId !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  };

  const selectedOptions = options.filter(opt => selectedIds.includes(opt.id));

  const groupedOptions = filteredOptions.reduce((acc, opt) => {
    const key = opt.category || 'Other';
    if (!acc[key]) acc[key] = [];
    acc[key].push(opt);
    return acc;
  }, {} as Record<string, Option[]>);

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%' }}>
      <div
        style={{
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)',
          padding: '8px',
          minHeight: '44px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px',
          cursor: 'text',
          background: 'var(--surface)',
        }}
        onClick={() => setIsOpen(true)}
      >
        {selectedOptions.map(opt => (
          <span
            key={opt.id}
            style={{
              background: 'var(--primary-light)',
              color: 'var(--primary)',
              padding: '4px 8px',
              borderRadius: 'var(--radius-full)',
              display: 'inline-flex',
              alignItems: 'center',
              fontSize: '14px',
              fontWeight: 500,
            }}
          >
            {opt.name}
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); handleSelect(opt.id); }}
              aria-label={`Remove ${opt.name}`}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--primary)',
                marginLeft: '6px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '14px',
                lineHeight: 1,
                padding: 0,
              }}
            >
              ×
            </button>
          </span>
        ))}
        <input
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setIsOpen(true); }}
          onFocus={() => setIsOpen(true)}
          placeholder={selectedIds.length === 0 ? placeholder : ""}
          style={{
            border: 'none',
            outline: 'none',
            flexGrow: 1,
            minWidth: '120px',
            background: 'transparent',
            color: 'var(--foreground)',
            fontSize: 14,
          }}
        />
      </div>

      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          marginTop: '4px',
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-lg)',
          maxHeight: '300px',
          overflowY: 'auto',
          zIndex: 1000,
          color: 'var(--foreground)',
        }}>
          {filteredOptions.length === 0 ? (
            <div style={{ padding: '12px', color: 'var(--foreground-muted)', textAlign: 'center' }}>No results found</div>
          ) : (
            Object.entries(groupedOptions).map(([category, opts]) => (
              <div key={category}>
                {category !== 'Other' && (
                  <div style={{
                    padding: '8px 12px',
                    background: 'var(--surface-muted)',
                    fontWeight: 700,
                    fontSize: '12px',
                    color: 'var(--foreground-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    borderTop: '1px solid var(--border)',
                    borderBottom: '1px solid var(--border)',
                  }}>
                    {category}
                  </div>
                )}
                {opts.map(opt => {
                  const isSelected = selectedIds.includes(opt.id);
                  return (
                    <div
                      key={opt.id}
                      onClick={() => handleSelect(opt.id)}
                      style={{
                        padding: '10px 12px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        background: isSelected ? 'var(--primary-light)' : 'var(--surface)',
                        borderBottom: '1px solid var(--border)',
                      }}
                      onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.background = 'var(--surface-muted)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = isSelected ? 'var(--primary-light)' : 'var(--surface)'; }}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        readOnly
                        style={{ marginRight: '12px', cursor: 'pointer', accentColor: 'var(--primary)' }}
                      />
                      <span style={{ fontSize: 14 }}>{opt.name}</span>
                    </div>
                  );
                })}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
