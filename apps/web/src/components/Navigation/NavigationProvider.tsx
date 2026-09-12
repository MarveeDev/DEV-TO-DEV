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

function NavigationTracker({
  setHistory,
  setPathname,
  routerRef,
}: {
  setHistory: React.Dispatch<React.SetStateAction<string[]>>;
  setPathname: React.Dispatch<React.SetStateAction<string>>;
  routerRef: React.MutableRefObject<ReturnType<typeof useRouter> | null>;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    setPathname(pathname);
    routerRef.current = router;

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
  }, [pathname, searchParams, setHistory, setPathname, router, routerRef]);

  return null;
}

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const [history, setHistory] = useState<string[]>([]);
  const [pathname, setPathname] = useState('');
  const routerRef = useRef<ReturnType<typeof useRouter> | null>(null);

  const goBack = (fallback: string) => {
    const router = routerRef.current;
    if (history.length > 1) {
      router?.back();
    } else {
      if (pathname === fallback) {
        const parentPath = pathname.split('/').slice(0, -1).join('/') || '/';
        router?.push(parentPath);
      } else {
        router?.push(fallback);
      }
    }
  };

  return (
    <NavigationContext.Provider value={{ history, canGoBack: history.length > 1, goBack }}>
      <Suspense fallback={null}>
        <NavigationTracker setHistory={setHistory} setPathname={setPathname} routerRef={routerRef} />
      </Suspense>
      {children}
    </NavigationContext.Provider>
  );
}

export const useNavigation = () => useContext(NavigationContext);
