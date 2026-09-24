import type { ReactElement } from 'react';

import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

interface SkeletonBlockProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  className?: string;
  count?: number;
}

/**
 * Rectangular skeleton primitive. Every page skeleton should build from this
 * (and SkeletonCircle) instead of importing react-loading-skeleton directly,
 * so a future skeleton library swap only touches this file.
 */
export function SkeletonBlock({
  width,
  height,
  borderRadius,
  className,
  count,
}: SkeletonBlockProps): ReactElement {
  return (
    <Skeleton
      width={width}
      height={height}
      borderRadius={borderRadius}
      className={className}
      count={count}
    />
  );
}

interface SkeletonCircleProps {
  size: number;
  className?: string;
}

/** Circular skeleton primitive, for avatars, icons, and round buttons. */
export function SkeletonCircle({
  size,
  className,
}: SkeletonCircleProps): ReactElement {
  return <Skeleton circle width={size} height={size} className={className} />;
}
