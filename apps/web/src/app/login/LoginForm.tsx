'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCurrentUser } from '../../components/Auth/CurrentUserProvider';
import { staffWorkspacePath } from '../../lib/admin-permissions';

export default function LoginForm() {
  const router = useRouter();
  const { refreshUser } = useCurrentUser();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) return;

    setBusy(true);
    setError('');
    try {
      const res = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const data = await res.json().catch(() => ({}));

      if (res.status === 429) {
        setError('Too many sign-in attempts. Please wait a moment and try again.');
        return;
      }

      if (!res.ok) {
        setError(data.message || 'Invalid email or password.');
        return;
      }

      const user = await refreshUser();
      const dest = user && user.role && user.role !== 'USER' ? staffWorkspacePath(user.role) : '/dashboard';
      router.push(dest);
      router.refresh();
    } catch {
      setError('Unable to sign in. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {error && (
        <div role="alert" style={{ padding: '12px', background: '#fee2e2', color: '#991b1b', borderRadius: 'var(--radius-sm)', fontSize: '14px', textAlign: 'left', border: '1px solid #fca5a5' }}>
          {error}
        </div>
      )}

      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email address"
        autoComplete="email"
        required
        style={{ width: '100%', padding: '12px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--foreground)', fontSize: '14px', outline: 'none' }}
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        autoComplete="current-password"
        required
        style={{ width: '100%', padding: '12px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--foreground)', fontSize: '14px', outline: 'none' }}
      />
      <button
        type="submit"
        disabled={busy}
        style={{ width: '100%', padding: '12px', background: 'var(--primary)', color: '#fff', borderRadius: 'var(--radius-md)', textDecoration: 'none', fontWeight: 600, fontSize: '14px', border: 'none', cursor: 'pointer', opacity: busy ? 0.7 : 1 }}
      >
        {busy ? 'Signing in...' : 'Sign in'}
      </button>
    </form>
  );
}
