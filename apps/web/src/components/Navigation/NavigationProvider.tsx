'use client';

import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';

interface NavigationContextType {
  history: string[];
  canGoBack: boolean;
  goBack: (fallback: string) => void;
}

const NavigationContext = createContext<NavigationContextType>({
  history: [],
  canGoBack: false,
  goBack: () => {},
});

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [history, setHistory] = useState<string[]>([]);
  const isNavigatingBack = useRef(false);

  useEffect(() => {
    const currentUrl = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');

    setHistory((prev) => {
      // Ignore identical consecutive URLs
      if (prev.length > 0 && prev[prev.length - 1] === currentUrl) {
        return prev;
      }
      
      // If the URL matches the previous one in stack, it's a POP (either Browser Back or our router.back)
      if (prev.length > 1 && prev[prev.length - 2] === currentUrl) {
        return prev.slice(0, -1);
      }
      
      // Otherwise, it's a PUSH. Add to stack.
      return [...prev, currentUrl];
    });
  }, [pathname, searchParams]);

  const goBack = (fallback: string) => {
    if (history.length > 1) {
      router.back();
    } else {
      // We don't have in-app history to pop. Use fallback safely.
      if (pathname === fallback) {
        // Prevent pushing the exact same route
        const parentPath = pathname.split('/').slice(0, -1).join('/') || '/';
        router.push(parentPath);
      } else {
        router.push(fallback);
      }
    }
  };

  return (
    <NavigationContext.Provider value={{ history, canGoBack: history.length > 1, goBack }}>
      {children}
    </NavigationContext.Provider>
  );
}

export const useNavigation = () => useContext(NavigationContext);
