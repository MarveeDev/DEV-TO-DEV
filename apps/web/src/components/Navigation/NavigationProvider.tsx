'use client';

import React, { createContext, useContext, useEffect, useState, useRef, Suspense } from 'react';
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

function NavigationTracker({ setHistory }: { setHistory: React.Dispatch<React.SetStateAction<string[]>> }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

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
  }, [pathname, searchParams, setHistory]);

  return null;
}

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  
  const [history, setHistory] = useState<string[]>([]);
  const isNavigatingBack = useRef(false);

  const goBack = (fallback: string) => {
    console.log('[NAVIGATION] goBack requested, fallback:', fallback);
    console.log('[NAVIGATION] current history:', history);
    if (history.length > 1) {
      console.log('[NAVIGATION] using router.back()');
      router.back();
    } else {
      if (pathname === fallback) {
        const parentPath = pathname.split('/').slice(0, -1).join('/') || '/';
        console.log('[NAVIGATION] fallback matched pathname, using parent:', parentPath);
        router.push(parentPath);
      } else {
        console.log('[NAVIGATION] using fallback:', fallback);
        router.push(fallback);
      }
    }
  };

  return (
    <NavigationContext.Provider value={{ history, canGoBack: history.length > 1, goBack }}>
      <Suspense fallback={null}>
        <NavigationTracker setHistory={setHistory} />
      </Suspense>
      {children}
    </NavigationContext.Provider>
  );
}

export const useNavigation = () => useContext(NavigationContext);
