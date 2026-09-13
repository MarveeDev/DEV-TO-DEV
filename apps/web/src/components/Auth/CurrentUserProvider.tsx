'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

export interface CurrentUser {
  id: string;
  email?: string | null;
  role?: string;
  status?: string;
  developerProfile?: any | null;
  pendingProfile?: any | null;
  [key: string]: any;
}

interface CurrentUserContextValue {
  user: CurrentUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  logout: () => Promise<void>;
}

const CurrentUserContext = createContext<CurrentUserContextValue>({
  user: null,
  loading: true,
  isAuthenticated: false,
  logout: async () => {},
});

/**
 * Fetches the current authenticated user exactly once for the client session
 * and shares it across the app so consumers do not each call /api/v1/auth/me.
 */
export function CurrentUserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/v1/auth/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((data: CurrentUser | null) => {
        if (!cancelled) {
          setUser(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setUser(null);
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const logout = useCallback(async () => {
    await fetch('/api/v1/auth/logout', { method: 'POST' });
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, loading, isAuthenticated: Boolean(user), logout }),
    [user, loading, logout],
  );

  return (
    <CurrentUserContext.Provider value={value}>
      {children}
    </CurrentUserContext.Provider>
  );
}

export function useCurrentUser() {
  return useContext(CurrentUserContext);
}
