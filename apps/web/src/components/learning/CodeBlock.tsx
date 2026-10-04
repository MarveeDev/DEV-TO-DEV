'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

/**
 * Reusable dark code block. Plain monospace rendering (no syntax-highlighting
 * dependency is introduced in this phase); language label, line numbers, a
 * copy button, and horizontal scrolling on small screens are provided.
 */
export default function CodeBlock({
  code,
  language,
  title,
}: {
  code: string;
  language?: string;
  title?: string;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard unavailable — ignore.
    }
  };

  const lines = code.split('\n');

  return (
    <div style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid #1f2a44', background: '#0b1220' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 14px',
          background: '#111a2e',
          borderBottom: '1px solid #1f2a44',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
          {title && (
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#9aa7bd', whiteSpace: 'nowrap' }}>{title}</span>
          )}
          {language && (
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                color: '#7dd3fc',
                background: 'rgba(125, 211, 252, 0.12)',
                padding: '2px 8px',
                borderRadius: 999,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}
            >
              {language}
            </span>
          )}
        </div>
        <button
          onClick={copy}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'transparent',
            border: 'none',
            color: copied ? '#34d399' : '#9aa7bd',
            fontSize: '12px',
            fontWeight: 600,
            cursor: 'pointer',
            padding: '4px 8px',
            borderRadius: 6,
          }}
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>

      <div style={{ overflowX: 'auto', padding: '14px 0' }}>
        <pre
          style={{
            margin: 0,
            display: 'table',
            minWidth: '100%',
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
            fontSize: '13px',
            lineHeight: 1.7,
            color: '#e7ecf5',
          }}
        >
          {lines.map((line, i) => (
            <span key={i} style={{ display: 'table-row' }}>
              <span
                style={{
                  display: 'table-cell',
                  textAlign: 'right',
                  padding: '0 14px',
                  userSelect: 'none',
                  color: '#3d4a63',
                  minWidth: '2.5em',
                }}
              >
                {i + 1}
              </span>
              <span style={{ display: 'table-cell', paddingRight: '18px', whiteSpace: 'pre' }}>{line || ' '}</span>
            </span>
          ))}
        </pre>
      </div>
    </div>
  );
}
