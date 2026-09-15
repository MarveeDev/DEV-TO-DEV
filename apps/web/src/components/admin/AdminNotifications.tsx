'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Bell, Flag, ShieldAlert, ArrowRight, Inbox } from 'lucide-react';

interface ReportItem {
  id: string;
  reason: string;
  createdAt: string;
  listing?: { title?: string } | null;
}

interface ViolationItem {
  id: string;
  type: string;
  severity: string;
  createdAt: string;
  user?: { email?: string; developerProfile?: { displayName?: string } } | null;
}

function timeAgo(v: string): string {
  const diff = Date.now() - new Date(v).getTime();
  const s = Math.floor(diff / 1000);
  if (s < 60) return 'just now';
  const m = Math.floor(s / 60);
  if (m < 60) return `${m} minute${m === 1 ? '' : 's'} ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} hour${h === 1 ? '' : 's'} ago`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d} day${d === 1 ? '' : 's'} ago`;
  return new Date(v).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

const iconTile: React.CSSProperties = {
  width: 32,
  height: 32,
  borderRadius: 9,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
};

/**
 * Admin-specific notification popover. Uses real admin data only:
 * pending marketplace reports and open violations (both fetch via the
 * existing RolesGuard-protected admin endpoints). It never navigates to
 * the normal user /notifications page.
 */
export default function AdminNotifications() {
  const [open, setOpen] = useState(false);
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [violations, setViolations] = useState<ViolationItem[]>([]);
  const [reportTotal, setReportTotal] = useState(0);
  const [violationTotal, setViolationTotal] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      fetch('/api/v1/admin/marketplace/reports?status=PENDING&limit=5').then((r) =>
        r.ok ? r.json() : { items: [], meta: {} },
      ),
      fetch('/api/v1/admin/violations?status=OPEN&limit=5').then((r) =>
        r.ok ? r.json() : { items: [], meta: {} },
      ),
    ])
      .then(([rep, vio]) => {
        if (cancelled) return;
        setReports(rep.items || []);
        setViolations(vio.items || []);
        setReportTotal(rep.meta?.total || 0);
        setViolationTotal(vio.meta?.total || 0);
        setLoaded(true);
      })
      .catch(() => {
        if (!cancelled) setLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const total = reportTotal + violationTotal;
  const badgeValue = total > 99 ? '99+' : String(total);
  const hasItems = reports.length > 0 || violations.length > 0;

  return (
    <div ref={rootRef} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Admin notifications"
        aria-haspopup="true"
        aria-expanded={open}
        style={{
          position: 'relative',
          width: 38,
          height: 38,
          borderRadius: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: open ? 'var(--foreground)' : 'var(--foreground-muted)',
          background: open ? 'var(--surface-hover)' : 'transparent',
          border: '1px solid transparent',
          cursor: 'pointer',
          transition: 'background 0.12s ease, color 0.12s ease',
        }}
        onMouseEnter={(e) => {
          if (!open) {
            e.currentTarget.style.background = 'var(--surface-hover)';
            e.currentTarget.style.color = 'var(--foreground)';
          }
        }}
        onMouseLeave={(e) => {
          if (!open) {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = 'var(--foreground-muted)';
          }
        }}
      >
        <Bell size={18} />
        {total > 0 && (
          <span
            style={{
              position: 'absolute',
              top: -4,
              right: -4,
              minWidth: 18,
              height: 18,
              padding: '0 5px',
              borderRadius: 999,
              background: 'var(--danger)',
              color: '#ffffff',
              fontSize: 10,
              fontWeight: 800,
              lineHeight: '18px',
              textAlign: 'center',
              boxShadow: '0 0 0 2px var(--surface)',
            }}
          >
            {badgeValue}
          </span>
        )}
      </button>

      {open && (
        <div
          style={{
            position: 'fixed',
            top: 68,
            right: 16,
            width: 340,
            maxWidth: 'calc(100vw - 32px)',
            maxHeight: 'calc(100vh - 88px)',
            overflowY: 'auto',
            zIndex: 200,
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 14,
            boxShadow: 'var(--shadow-lg)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '14px 16px',
              borderBottom: '1px solid var(--border)',
            }}
          >
            <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--foreground)' }}>Admin Notifications</span>
            <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--foreground-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {loaded ? `${total} open` : '…'}
            </span>
          </div>

          {!loaded ? (
            <div style={{ padding: '24px 16px', textAlign: 'center', color: 'var(--foreground-muted)', fontSize: '13px' }}>Loading…</div>
          ) : !hasItems ? (
            <div
              style={{
                padding: '32px 16px',
                textAlign: 'center',
                color: 'var(--foreground-muted)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <div style={{ ...iconTile, background: 'var(--surface-muted)', color: 'var(--foreground-subtle)', width: 44, height: 44 }}>
                <Inbox size={22} />
              </div>
              <div style={{ fontSize: '13px' }}>No pending admin activity.</div>
            </div>
          ) : (
            <div>
              {reports.length > 0 && (
                <div style={{ padding: '8px 0', borderBottom: violations.length > 0 ? '1px solid var(--border)' : 'none' }}>
                  <div style={{ padding: '6px 16px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--foreground-subtle)' }}>
                    Reports
                  </div>
                  {reports.map((r) => (
                    <Link
                      key={r.id}
                      href="/admin/reports"
                      onClick={() => setOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '12px',
                        padding: '10px 16px',
                        textDecoration: 'none',
                        transition: 'background 0.12s ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--surface-hover)')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      <div style={{ ...iconTile, background: 'rgba(251, 191, 36, 0.14)', color: '#fcd34d' }}>
                        <Flag size={15} />
                      </div>
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--foreground)' }}>New report</div>
                        <div style={{ fontSize: '12px', color: 'var(--foreground-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {r.listing?.title || 'A marketplace listing was reported'}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--foreground-subtle)', marginTop: '2px' }}>{timeAgo(r.createdAt)}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {violations.length > 0 && (
                <div style={{ padding: '8px 0' }}>
                  <div style={{ padding: '6px 16px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--foreground-subtle)' }}>
                    Moderation
                  </div>
                  {violations.map((v) => (
                    <Link
                      key={v.id}
                      href="/admin/violations"
                      onClick={() => setOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '12px',
                        padding: '10px 16px',
                        textDecoration: 'none',
                        transition: 'background 0.12s ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--surface-hover)')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      <div style={{ ...iconTile, background: 'rgba(248, 113, 113, 0.14)', color: '#fca5a5' }}>
                        <ShieldAlert size={15} />
                      </div>
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--foreground)' }}>Violation requires review</div>
                        <div style={{ fontSize: '12px', color: 'var(--foreground-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {v.type} · {v.severity}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--foreground-subtle)', marginTop: '2px' }}>{timeAgo(v.createdAt)}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '12px 16px',
                  borderTop: '1px solid var(--border)',
                }}
              >
                <Link
                  href="/admin/reports"
                  onClick={() => setOpen(false)}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 700, color: 'var(--primary)', textDecoration: 'none' }}
                >
                  View all reports
                  <ArrowRight size={13} />
                </Link>
                <Link
                  href="/admin/violations"
                  onClick={() => setOpen(false)}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 700, color: 'var(--primary)', textDecoration: 'none' }}
                >
                  View all violations
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
