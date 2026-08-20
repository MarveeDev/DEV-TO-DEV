'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import DesktopHeader from './DesktopHeader';
import DesktopSidebar from './DesktopSidebar';
import MobileBottomNav from './MobileBottomNav';

export default function NavigationRoot() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    fetch('/api/v1/auth/me')
      .then(res => {
        setIsAuthenticated(res.ok);
        setLoading(false);
      })
      .catch(() => {
        setIsAuthenticated(false);
        setLoading(false);
      });
  }, [pathname]);

  const handleLogout = async () => {
    await fetch('/api/v1/auth/logout', { method: 'POST' });
    setIsAuthenticated(false);
    router.push('/login');
  };

  return (
    <>
      <style>{`
        .desktop-nav-layer {
          display: none;
        }
        .mobile-nav-layer {
          display: block;
        }
        .unauth-mobile-header {
          position: sticky;
          top: 0;
          z-index: 50;
          background: var(--surface);
          border-bottom: 1px solid var(--border);
          padding: 16px 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        @media (min-width: 1024px) {
          .desktop-nav-layer {
            display: block;
          }
          .mobile-nav-layer, .unauth-mobile-header {
            display: none !important;
          }
        }
      `}</style>
      
      {/* Desktop Navigation */}
      <div className="desktop-nav-layer">
        <DesktopHeader isAuthenticated={isAuthenticated} loading={loading} onLogout={handleLogout} />
        {isAuthenticated && !loading && (
          <DesktopSidebar onLogout={handleLogout} currentPath={pathname} />
        )}
      </div>

      {/* Mobile Navigation */}
      {!loading && isAuthenticated && (
        <div className="mobile-nav-layer">
          <MobileBottomNav currentPath={pathname} />
        </div>
      )}

      {/* Mobile Unauthenticated Header */}
      {!loading && !isAuthenticated && (
        <header className="unauth-mobile-header">
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img src="/logo.png" alt="DEV-TO-DEV Logo" style={{ height: '28px', width: 'auto', objectFit: 'contain' }} />
          </div>
          <a href="/login" style={{ background: 'var(--primary)', color: '#ffffff', padding: '8px 16px', borderRadius: 'var(--radius-sm)', textDecoration: 'none', fontSize: '14px', fontWeight: 600 }}>
            Login
          </a>
        </header>
      )}

      {/* Mobile Authenticated Header */}
      {!loading && isAuthenticated && (
        <header className="unauth-mobile-header" style={{ padding: '12px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img src="/logo.png" alt="DEV-TO-DEV Logo" style={{ height: '28px', width: 'auto', objectFit: 'contain' }} />
          </div>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--border)', flexShrink: 0 }} />
        </header>
      )}
    </>
  );
}
