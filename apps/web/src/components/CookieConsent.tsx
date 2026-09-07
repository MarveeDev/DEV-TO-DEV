'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

const STORAGE_KEY = 'devtodev_cookie_consent';
const CONSENT_VERSION = 1;

interface ConsentState {
  necessary: boolean;
  nonEssential: boolean;
  version: number;
  timestamp: string;
}

function readConsent(): ConsentState | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && parsed.version === CONSENT_VERSION) {
      return parsed;
    }
  } catch {
    // ignore malformed storage
  }
  return null;
}

function saveConsent(nonEssential: boolean) {
  const state: ConsentState = {
    necessary: true,
    nonEssential,
    version: CONSENT_VERSION,
    timestamp: new Date().toISOString(),
  };
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // storage unavailable
  }
}

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    if (!readConsent()) {
      setShowBanner(true);
    }
  }, []);

  const acceptAll = () => {
    saveConsent(true);
    setShowBanner(false);
    setShowSettings(false);
  };

  const rejectNonEssential = () => {
    saveConsent(false);
    setShowBanner(false);
    setShowSettings(false);
  };

  if (!showBanner) return null;

  const buttonBase: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '10px 16px',
    borderRadius: 'var(--radius-md)',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    border: 'none',
    transition: 'all 0.2s',
    whiteSpace: 'nowrap',
  };

  return (
    <>
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          padding: '16px',
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            pointerEvents: 'auto',
            maxWidth: '1200px',
            margin: '0 auto',
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-md)',
            padding: '20px',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          <div style={{ flex: '1 1 320px', minWidth: 0 }}>
            <p style={{ fontSize: '14px', lineHeight: 1.6, color: 'var(--foreground)', margin: '0 0 4px' }}>
              <strong style={{ fontWeight: 700 }}>We value your privacy.</strong>{' '}
              DEV-TO-DEV uses a single essential cookie to keep you signed in. We do not use analytics, advertising, or tracking cookies.
            </p>
            <p style={{ fontSize: '13px', color: 'var(--foreground-muted)', margin: 0 }}>
              Read our{' '}
              <Link href="/privacy" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>Privacy Policy</Link>
              ,{' '}
              <Link href="/terms" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>Terms &amp; Conditions</Link>
              , and{' '}
              <Link href="/cookie-policy" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>Cookie Policy</Link>.
            </p>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={() => setShowSettings(true)}
              style={{ ...buttonBase, background: 'transparent', color: 'var(--foreground-muted)', border: '1px solid var(--border)' }}
            >
              Cookie Settings
            </button>
            <button
              type="button"
              onClick={rejectNonEssential}
              style={{ ...buttonBase, background: 'transparent', color: 'var(--foreground)', border: '1px solid var(--border)' }}
            >
              Reject Non-Essential
            </button>
            <button
              type="button"
              onClick={acceptAll}
              style={{ ...buttonBase, background: 'var(--primary)', color: '#ffffff' }}
            >
              Accept All
            </button>
          </div>
        </div>
      </div>

      {showSettings && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1100,
            background: 'rgba(15, 23, 42, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
          onClick={() => setShowSettings(false)}
        >
          <div
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-md)',
              width: '100%',
              maxWidth: '480px',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '24px',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ fontSize: '20px', fontWeight: 800, margin: '0 0 4px', color: 'var(--foreground)' }}>
              Cookie Settings
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--foreground-muted)', margin: '0 0 20px' }}>
              Manage your cookie preferences. Essential cookies are always on.
            </p>

            <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '16px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                <div style={{ minWidth: 0 }}>
                  <strong style={{ display: 'block', fontSize: '14px', color: 'var(--foreground)', marginBottom: '4px' }}>
                    Essential
                  </strong>
                  <span style={{ fontSize: '13px', color: 'var(--foreground-muted)', lineHeight: 1.5 }}>
                    Required to keep you signed in and secure your account. Always active.
                  </span>
                </div>
                <div
                  style={{
                    flexShrink: 0,
                    width: '40px',
                    height: '22px',
                    borderRadius: '999px',
                    background: 'var(--primary)',
                    position: 'relative',
                    opacity: 0.9,
                    cursor: 'not-allowed',
                  }}
                  aria-label="Essential cookies are always on"
                >
                  <span
                    style={{
                      position: 'absolute',
                      top: '3px',
                      right: '3px',
                      width: '16px',
                      height: '16px',
                      borderRadius: '50%',
                      background: '#ffffff',
                    }}
                  />
                </div>
              </div>
            </div>

            <p style={{ fontSize: '13px', color: 'var(--foreground-muted)', lineHeight: 1.6, margin: '0 0 20px' }}>
              DEV-TO-DEV does not currently use any analytics, advertising, marketing, or preference cookies. Learn more in our{' '}
              <Link href="/cookie-policy" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>Cookie Policy</Link>.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={rejectNonEssential}
                style={{ ...buttonBase, background: 'transparent', color: 'var(--foreground)', border: '1px solid var(--border)' }}
              >
                Save Preferences
              </button>
              <button
                type="button"
                onClick={acceptAll}
                style={{ ...buttonBase, background: 'var(--primary)', color: '#ffffff' }}
              >
                Accept All
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
