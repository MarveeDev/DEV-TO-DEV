import React from 'react';

type SkeletonProps = React.HTMLAttributes<HTMLDivElement> & {
  width?: number | string;
  height?: number | string;
  maxWidth?: number | string;
  borderRadius?: number | string;
};

/**
 * A lightweight pulsing placeholder used by route-level loading.tsx files.
 * Purely presentational (no hooks) so it can render on the server.
 */
export default function Skeleton({
  width = '100%',
  height = 16,
  maxWidth,
  borderRadius = 'var(--radius-md)',
  style,
  ...props
}: SkeletonProps) {
  return (
    <div
      className="skeleton"
      aria-hidden="true"
      style={{
        width,
        height,
        maxWidth,
        borderRadius,
        ...style,
      }}
      {...props}
    />
  );
}
