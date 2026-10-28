'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Card from '../../../components/Card';
import { useCurrentUser } from '../../../components/Auth/CurrentUserProvider';

export default function ActivatePage() {
  const router = useRouter();
  const params = useParams<{ token: string | string[] }>();
  const token = typeof params?.token === 'string' ? params.token : '';
  const { refreshUser } = useCurrentUser();

  const [loading, setLoading] = useState(Boolean(token));
  const [info, setInfo] = useState<{ name?: string | null; email?: string; role?: string } | null>(null);
  const [invalid, setInvalid] = useState(!token);

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [formError, setFormError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!token) return;
    fetch(`/api/v1/auth/activate/${token}`)
      .then(async (res) => {
        if (res.status === 401 || res.status === 404) {
          setInvalid(true);
          return;
        }
        if (!res.ok) {
          setInvalid(true);
          return;
        }
        setInfo(await res.json());
      })
      .catch(() => setInvalid(true))
      .finally(() => setLoading(false));
  }, [token]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      setFormError('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirm) {
      setFormError('Passwords do not match.');
      return;
    }

    setBusy(true);
    setFormError('');
    try {
      const res = await fetch('/api/v1/auth/activate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json().catch(() => ({}));

      if (res.status === 429) {
        setFormError('Too many attempts. Please wait a moment and try again.');
        return;
      }

      if (!res.ok) {
        setFormError(data.message || 'This invitation is invalid or has expired.');
        return;
      }

      await refreshUser();
      router.push('/admin');
      router.refresh();
    } catch {
      setFormError('Unable to activate your account. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 65px)', alignItems: 'center', justifyContent: 'center', background: 'var(--background)' }}>
      <div style={{ width: '100%', maxWidth: '440px', padding: '24px' }}>
        <Card padding="lg">
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
            <img src="/logo.png" alt="DEV-TO-DEV Logo" style={{ height: '44px', width: 'auto', objectFit: 'contain' }} />
          </div>

          {loading ? (
            <p style={{ textAlign: 'center', color: 'var(--foreground-muted)', fontSize: '14px' }}>Loading invitation…</p>
          ) : invalid ? (
            <div style={{ textAlign: 'center' }}>
              <h1 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--foreground)', marginBottom: '8px' }}>Invitation unavailable</h1>
              <p style={{ color: 'var(--foreground-muted)', fontSize: '14px', lineHeight: 1.6, marginBottom: '20px' }}>
                This invitation link is invalid, has expired, or has already been used. Please contact your platform administrator.
              </p>
              <Link href="/login" style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '14px' }}>Back to sign in</Link>
            </div>
          ) : (
            <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ textAlign: 'center' }}>
                <h1 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--foreground)', marginBottom: '6px' }}>Set your password</h1>
                <p style={{ color: 'var(--foreground-muted)', fontSize: '14px', margin: 0 }}>
                  {info?.name ? `${info.name} — ` : ''}{info?.role || 'Staff'} · {info?.email || ''}
                </p>
              </div>

              {formError && (
                <div role="alert" style={{ padding: '12px', background: '#fee2e2', color: '#991b1b', borderRadius: 'var(--radius-sm)', fontSize: '14px', border: '1px solid #fca5a5' }}>
                  {formError}
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label htmlFor="activate-password" style={{ fontSize: '13px', fontWeight: 600, color: 'var(--foreground)' }}>Password</label>
                <input
                  id="activate-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  minLength={8}
                  required
                  style={{ width: '100%', padding: '12px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--foreground)', fontSize: '14px', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label htmlFor="activate-confirm" style={{ fontSize: '13px', fontWeight: 600, color: 'var(--foreground)' }}>Confirm password</label>
                <input
                  id="activate-confirm"
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  autoComplete="new-password"
                  minLength={8}
                  required
                  style={{ width: '100%', padding: '12px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--foreground)', fontSize: '14px', outline: 'none' }}
                />
              </div>

              <button
                type="submit"
                disabled={busy}
                style={{ width: '100%', padding: '12px', background: 'var(--primary)', color: '#fff', borderRadius: 'var(--radius-md)', fontWeight: 600, fontSize: '14px', border: 'none', cursor: 'pointer', opacity: busy ? 0.7 : 1 }}
              >
                {busy ? 'Activating...' : 'Activate Account'}
              </button>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
}
