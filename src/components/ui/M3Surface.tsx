/**
 * M3Surface.tsx
 * Material Design 3 Surface component with Tonal Elevation support
 * https://m3.material.io/styles/elevation/overview
 */

import React from 'react';

type ElevationLevel = 0 | 1 | 2 | 3 | 4 | 5;

interface M3SurfaceProps {
  children: React.ReactNode;
  elevation?: ElevationLevel;
  tonalElevation?: boolean;
  borderRadius?: 'none' | 'small' | 'medium' | 'large' | 'extra-large' | 'full';
  padding?: 'none' | 'small' | 'medium' | 'large';
  style?: React.CSSProperties;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

const M3Surface: React.FC<M3SurfaceProps> = ({
  children,
  elevation = 0,
  tonalElevation = false,
  borderRadius = 'medium',
  padding = 'medium',
  style = {},
  className = '',
  as: Component = 'div',
}) => {
  const getBorderRadius = () => {
    switch (borderRadius) {
      case 'none':
        return '0';
      case 'small':
        return 'var(--md-sys-shape-corner-small)';
      case 'medium':
        return 'var(--md-sys-shape-corner-medium)';
      case 'large':
        return 'var(--md-sys-shape-corner-large)';
      case 'extra-large':
        return 'var(--md-sys-shape-corner-extra-large)';
      case 'full':
        return 'var(--md-sys-shape-corner-full)';
      default:
        return 'var(--md-sys-shape-corner-medium)';
    }
  };

  const getPadding = () => {
    switch (padding) {
      case 'none':
        return '0';
      case 'small':
        return 'var(--md-sys-spacing-2)';
      case 'medium':
        return 'var(--md-sys-spacing-4)';
      case 'large':
        return 'var(--md-sys-spacing-6)';
      default:
        return 'var(--md-sys-spacing-4)';
    }
  };

  const getBackgroundColor = () => {
    if (tonalElevation) {
      return `var(--app-surface-tonal-level-${elevation})`;
    }
    return 'var(--md-sys-color-surface)';
  };

  const getSurfaceTint = () => {
    if (tonalElevation) {
      return 'none'; // Already mixed in background
    }
    // Standard MD3 surface tint overlay
    return `var(--app-tonal-elevation-level-${elevation})`;
  };

  return (
    <Component
      className={className}
      style={{
        position: 'relative',
        borderRadius: getBorderRadius(),
        padding: getPadding(),
        backgroundColor: getBackgroundColor(),
        boxShadow: `var(--app-elevation-level-${elevation})`,
        transition: `all var(--md-sys-motion-duration-medium) var(--md-sys-motion-easing-emphasized)`,
        ...style,
      }}
    >
      {/* Surface tint overlay (for non-tonal surfaces) */}
      {!tonalElevation && elevation > 0 && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: getBorderRadius(),
            backgroundColor: getSurfaceTint(),
            pointerEvents: 'none',
          }}
          aria-hidden="true"
        />
      )}

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1 }}>{children}</div>
    </Component>
  );
};

export default M3Surface;
