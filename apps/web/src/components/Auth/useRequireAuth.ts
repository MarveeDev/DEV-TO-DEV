'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCurrentUser } from './CurrentUserProvider';

/**
 * Reusable client-side auth guard. Returns the full auth context (user,
 * loading, isAuthenticated, logout, refreshUser) and redirects to /login when
 * the auth state resolves to "unauthenticated". While loading, it does nothing,
 * so pages never redirect prematurely.
 */
export function useRequireAuth(redirectTo = '/login') {
  const router = useRouter();
  const auth = useCurrentUser();

  useEffect(() => {
    if (auth.loading) return;
    if (!auth.isAuthenticated || !auth.user) {
      router.push(redirectTo);
    }
  }, [auth.loading, auth.isAuthenticated, auth.user, router, redirectTo]);

  return auth;
}
