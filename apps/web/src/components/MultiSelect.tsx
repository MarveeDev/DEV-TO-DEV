import React, { useState, useRef, useEffect } from 'react';

export interface Option {
  id: string;
  name: string;
  category?: string; // Optional for grouped items
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

  // Group by category if available
  const groupedOptions = filteredOptions.reduce((acc, opt) => {
    const key = opt.category || 'Other';
    if (!acc[key]) acc[key] = [];
    acc[key].push(opt);
    return acc;
  }, {} as Record<string, Option[]>);

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%', fontFamily: 'sans-serif' }}>
      <div 
        style={{
          border: '1px solid #ccc',
          borderRadius: '4px',
          padding: '8px',
          minHeight: '40px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px',
          cursor: 'text',
          background: '#fff'
        }}
        onClick={() => setIsOpen(true)}
      >
        {selectedOptions.map(opt => (
          <span 
            key={opt.id} 
            style={{
              background: '#e0e7ff',
              color: '#3730a3',
              padding: '4px 8px',
              borderRadius: '16px',
              display: 'inline-flex',
              alignItems: 'center',
              fontSize: '14px',
              fontWeight: 500
            }}
          >
            {opt.name}
            <button 
              type="button"
              onClick={(e) => { e.stopPropagation(); handleSelect(opt.id); }}
              style={{
                background: 'none',
                border: 'none',
                color: '#3730a3',
                marginLeft: '6px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '12px'
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
            color: '#000'
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
          background: '#fff',
          border: '1px solid #ccc',
          borderRadius: '4px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          maxHeight: '300px',
          overflowY: 'auto',
          zIndex: 1000,
          color: '#000'
        }}>
          {filteredOptions.length === 0 ? (
            <div style={{ padding: '12px', color: '#666', textAlign: 'center' }}>No results found</div>
          ) : (
            Object.entries(groupedOptions).map(([category, opts]) => (
              <div key={category}>
                {category !== 'Other' && (
                  <div style={{ 
                    padding: '8px 12px', 
                    background: '#f9fafb', 
                    fontWeight: 'bold',
                    fontSize: '12px',
                    color: '#6b7280',
                    textTransform: 'uppercase',
                    borderTop: '1px solid #e5e7eb',
                    borderBottom: '1px solid #e5e7eb'
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
                        background: isSelected ? '#f3f4f6' : '#fff',
                        borderBottom: '1px solid #f3f4f6'
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = '#f3f4f6')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = isSelected ? '#f3f4f6' : '#fff')}
                    >
                      <input 
                        type="checkbox" 
                        checked={isSelected} 
                        readOnly 
                        style={{ marginRight: '12px', cursor: 'pointer' }}
                      />
                      {opt.name}
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
