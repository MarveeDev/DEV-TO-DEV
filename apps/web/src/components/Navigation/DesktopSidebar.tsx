'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  House, 
  Compass, 
  Folder, 
  CircleHelp, 
  MessageSquare, 
  Bell, 
  User, 
  Settings, 
  LogOut,
  Terminal,
  Map
} from 'lucide-react';

interface DesktopSidebarProps {
  currentPath: string;
  onLogout: () => void;
}

export default function DesktopSidebar({ currentPath, onLogout }: DesktopSidebarProps) {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetch('/api/v1/notifications')
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        if (Array.isArray(data)) {
          const unread = data.filter(n => !n.read).length;
          setUnreadCount(unread);
        }
      })
      .catch(err => console.error(err));
  }, []);
  
  const navItems = [
    { name: 'Home', path: '/dashboard', icon: House },
    { name: 'Discover', path: '/developers', icon: Compass },
    { name: 'Roadmaps', path: '/roadmaps', icon: Map },
    { name: 'Projects', path: '/projects', icon: Folder },
    { name: 'Questions', path: '/questions', icon: CircleHelp },
    { name: 'Messages', path: '/messages', icon: MessageSquare },
    { name: 'Notifications', path: '/notifications', icon: Bell, hasBadge: unreadCount > 0 },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  const getStyle = (path: string) => {
    const isActive = currentPath === path || currentPath.startsWith(path + '/');
    return {
      color: isActive ? 'var(--primary)' : 'var(--foreground-muted)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '48px',
      height: '48px',
      borderRadius: 'var(--radius-md)',
      background: isActive ? 'var(--primary-light)' : 'transparent',
      transition: 'all 0.2s',
      marginBottom: '8px',
      position: 'relative' as const,
      cursor: 'pointer'
    };
  };

  return (
    <>
      <style>{`
        .sidebar-icon-container:hover .sidebar-tooltip {
          opacity: 1;
          visibility: visible;
          transform: translateX(0);
        }
      `}</style>
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        width: 'var(--sidebar-width)',
        background: 'var(--surface)',
        borderRight: '1px solid var(--border)',
        zIndex: 60,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        boxSizing: 'border-box'
      }}>
        <div style={{ width: '100%', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
          <img src="/logo.png" alt="DEV-TO-DEV Logo" style={{ width: '32px', height: 'auto', objectFit: 'contain' }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, width: '100%', alignItems: 'center', paddingTop: '24px' }}>
          {navItems.map(item => (
            <Link key={item.name} href={item.path} style={{ textDecoration: 'none' }} className="sidebar-icon-container">
              <div style={getStyle(item.path)}>
                <item.icon size={24} strokeWidth={2} />
                {item.hasBadge && (
                  <span style={{
                    position: 'absolute',
                    top: '8px',
                    right: '10px',
                    width: '10px',
                    height: '10px',
                    background: 'var(--primary)',
                    border: '2px solid var(--surface)',
                    borderRadius: '50%'
                  }} />
                )}
                <div className="sidebar-tooltip" style={{
                  position: 'absolute',
                  left: '60px',
                  background: 'var(--foreground)',
                  color: 'var(--surface)',
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '12px',
                  fontWeight: 600,
                  pointerEvents: 'none',
                  opacity: 0,
                  visibility: 'hidden',
                  transform: 'translateX(-10px)',
                  transition: 'all 0.2s',
                  whiteSpace: 'nowrap',
                  zIndex: 100
                }}>
                  {item.name}
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', borderTop: '1px solid var(--border)', paddingTop: '24px' }}>
          <div className="sidebar-icon-container" style={getStyle('/settings')}>
            <Settings size={24} strokeWidth={2} />
            <div className="sidebar-tooltip" style={{
                  position: 'absolute', left: '60px', background: 'var(--foreground)', color: 'var(--surface)',
                  padding: '6px 12px', borderRadius: 'var(--radius-sm)', fontSize: '12px', fontWeight: 600,
                  opacity: 0, visibility: 'hidden', transform: 'translateX(-10px)', transition: 'all 0.2s', whiteSpace: 'nowrap'
                }}>Settings</div>
          </div>
          <button onClick={onLogout} className="sidebar-icon-container" style={{ ...getStyle(''), border: 'none' }}>
            <LogOut size={24} strokeWidth={2} />
            <div className="sidebar-tooltip" style={{
                  position: 'absolute', left: '60px', background: 'var(--foreground)', color: 'var(--surface)',
                  padding: '6px 12px', borderRadius: 'var(--radius-sm)', fontSize: '12px', fontWeight: 600,
                  opacity: 0, visibility: 'hidden', transform: 'translateX(-10px)', transition: 'all 0.2s', whiteSpace: 'nowrap'
                }}>Logout</div>
          </button>
        </div>
      </nav>
    </>
  );
}
