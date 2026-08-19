'use client';

import { ArrowLeft } from 'lucide-react';
import { useNavigation } from './NavigationProvider';

interface BackButtonProps {
  fallback: string;
}

export default function BackButton({ fallback }: BackButtonProps) {
  const { goBack } = useNavigation();

  const handleBack = () => {
    goBack(fallback);
  };

  return (
    <button
      onClick={handleBack}
      aria-label="Go back"
      title="Go back"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '40px',
        height: '40px',
        borderRadius: '8px',
        border: 'none',
        background: 'transparent',
        color: 'var(--foreground)',
        cursor: 'pointer',
        flexShrink: 0,
      }}
      onMouseEnter={(e) => e.currentTarget.style.background = 'var(--border)'}
      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
    >
      <ArrowLeft size={24} />
    </button>
  );
}
