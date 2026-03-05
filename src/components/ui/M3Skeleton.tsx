// MD3 Gold Compliant
import React from 'react';

interface M3SkeletonProps {
  variant?: 'text' | 'rectangular' | 'circular';
  width?: string | number;
  height?: string | number;
  style?: React.CSSProperties;
  className?: string;
}

/**
 * M3Skeleton — Loading placeholder component.
 * Renders an animated shimmer block while content is loading.
 */
export const M3Skeleton: React.FC<M3SkeletonProps> = ({
  variant = 'rectangular',
  width = '100%',
  height = '1em',
  style,
  className,
}) => {
  const borderRadius =
    variant === 'circular'
      ? 'var(--md-sys-shape-corner-full)'
      : variant === 'text'
      ? 'var(--md-sys-shape-corner-small)'
      : 'var(--md-sys-shape-corner-medium)';

  return (
    <div
      aria-hidden="true"
      // eslint-disable-next-line design-system/no-classname -- className prop-passthrough API for consumer integration (tests, storybook)
      className={className}
      style={{
        width,
        height,
        borderRadius,
        backgroundColor: 'var(--md-sys-color-surface-container-highest)',
        animation: 'pulse var(--md-sys-motion-duration-extra-long) var(--md-sys-motion-easing-standard) infinite',
        ...style,
      }}
    />
  );
};

export default M3Skeleton;
