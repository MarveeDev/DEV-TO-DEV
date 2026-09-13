import Skeleton from './Skeleton';

/**
 * Shared route-loading skeleton. Renders a page header plus a set of card
 * placeholders that mirror the shape of the content being loaded.
 */
export default function PageLoading({
  maxWidth = 800,
  count = 4,
  variant = 'list',
}: {
  maxWidth?: number;
  count?: number;
  variant?: 'list' | 'grid';
}) {
  return (
    <div style={{ maxWidth: `${maxWidth}px`, margin: '0 auto', width: '100%' }}>
      {/* Page header */}
      <div style={{ marginBottom: '32px' }}>
        <Skeleton width="60%" maxWidth={320} height={30} style={{ marginBottom: '12px' }} />
        <Skeleton width="40%" maxWidth={220} height={14} />
      </div>

      {variant === 'grid' ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '20px',
          }}
        >
          {Array.from({ length: count }).map((_, i) => (
            <div
              key={i}
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-sm)',
                overflow: 'hidden',
              }}
            >
              <Skeleton width="100%" height={150} borderRadius={0} />
              <div style={{ padding: '16px' }}>
                <Skeleton width="70%" height={16} style={{ marginBottom: '10px' }} />
                <Skeleton width="100%" height={13} style={{ marginBottom: '8px' }} />
                <Skeleton width="50%" height={13} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {Array.from({ length: count }).map((_, i) => (
            <div
              key={i}
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                padding: '20px',
                boxShadow: 'var(--shadow-sm)',
                display: 'flex',
                gap: '16px',
              }}
            >
              <Skeleton width={48} height={48} borderRadius="50%" style={{ flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <Skeleton width="50%" height={16} style={{ marginBottom: '10px' }} />
                <Skeleton width="90%" height={13} style={{ marginBottom: '8px' }} />
                <Skeleton width="70%" height={13} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
