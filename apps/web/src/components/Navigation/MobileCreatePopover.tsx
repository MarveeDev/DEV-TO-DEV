'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { MessageSquarePlus, FolderPlus, CircleHelp } from 'lucide-react';

export default function MobileCreatePopover({ onClose }: { onClose: () => void }) {
  const router = useRouter();

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.4)',
      zIndex: 60,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end'
    }} onClick={onClose}>
      
      <div 
        onClick={e => e.stopPropagation()}
        style={{
          background: 'var(--surface)',
          borderTopLeftRadius: 'var(--radius-lg)',
          borderTopRightRadius: 'var(--radius-lg)',
          padding: '24px 16px 32px 16px',
          paddingBottom: 'calc(32px + env(safe-area-inset-bottom))',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        <div style={{ width: '40px', height: '4px', background: 'var(--border)', borderRadius: '2px', margin: '0 auto 16px auto' }} />
        
        <h3 style={{ fontSize: '18px', fontWeight: 700, textAlign: 'center', marginBottom: '8px' }}>Create</h3>
        
        <button onClick={() => {
          router.push('/posts/create');
          onClose();
        }} style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          padding: '16px',
          background: 'var(--primary-light)',
          border: '1px solid var(--primary)',
          borderRadius: 'var(--radius-md)',
          color: 'var(--primary)',
          fontWeight: 600,
          fontSize: '16px',
          cursor: 'pointer'
        }}>
          <MessageSquarePlus size={24} />
          Create Post
        </button>

        <button onClick={() => {
          router.push('/projects/create');
          onClose();
        }} style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          padding: '16px',
          background: 'var(--background)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)',
          color: 'var(--foreground)',
          fontWeight: 600,
          fontSize: '16px',
          cursor: 'pointer'
        }}>
          <FolderPlus size={24} color="var(--foreground-muted)" />
          Create Project
        </button>

        <button onClick={() => {
          router.push('/questions/ask');
          onClose();
        }} style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          padding: '16px',
          background: 'var(--background)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)',
          color: 'var(--foreground)',
          fontWeight: 600,
          fontSize: '16px',
          cursor: 'pointer'
        }}>
          <CircleHelp size={24} color="var(--foreground-muted)" />
          Ask Question
        </button>
      </div>
    </div>
  );
}
