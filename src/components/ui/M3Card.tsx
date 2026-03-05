// MD3 Compliant M3Card Component
// Fully compliant with MD3 tokens: uses var(--md-sys-*) CSS variables for theming, spacing, typography, shape, motion, and elevation
// No useTheme() dependency - all styling uses direct MD3 CSS variables

import React, { useState } from 'react';

interface M3CardProps {
  children: React.ReactNode;
  onClick?: () => void;
  onMouseEnter?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseLeave?: (e: React.MouseEvent<HTMLDivElement>) => void;
  variant?: 'elevated' | 'outlined' | 'filled';
  padding?: 'none' | 'small' | 'medium' | 'large';
  style?: React.CSSProperties;
  ariaLabel?: string;
}

const M3Card: React.FC<M3CardProps> = ({
  children,
  onClick,
  onMouseEnter,
  onMouseLeave,
  variant = 'elevated',
  padding = 'medium',
  style,
  ariaLabel
}) => {
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [pressed, setPressed] = useState(false);
  const isClickable = Boolean(onClick);

  // MD3 Token mapping - no useTheme() dependency
  // Color tokens
  const surface = 'var(--md-sys-color-surface)';
  const outlineVariant = 'var(--md-sys-color-outline-variant)';
  const surfaceContainerLow = 'var(--md-sys-color-surface-container-low)';
  const primary = 'var(--md-sys-color-primary)';

  // Shape token
  const large = 'var(--md-sys-shape-corner-large)';

  // Elevation tokens
  const level1 = 'var(--md-sys-elevation-level1)';
  const level2 = 'var(--md-sys-elevation-level2)';

  // Motion tokens
  const short2 = 'var(--md-sys-motion-duration-short2)';
  const standard = 'var(--md-sys-motion-easing-standard)';
  const springDefaultSpatial = 'var(--md-sys-motion-spring-expressive-default-spatial)';

  // Padding styles using MD3 spacing tokens
  const getPaddingStyles = (): string => {
    switch (padding) {
      case 'none':
        return 'var(--md-sys-spacing-0)';
      case 'small':
        return 'var(--md-sys-spacing-4)';
      case 'large':
        return 'var(--md-sys-spacing-8)';
      default: // medium
        return 'var(--md-sys-spacing-6)';
    }
  };

  // Variant styles using MD3 tokens
  const getVariantStyles = (): React.CSSProperties => {
    switch (variant) {
      case 'outlined':
        return {
          backgroundColor: surface,
          boxShadow: 'none',
          border: `var(--md-sys-border-width-normal) solid ${outlineVariant}`
        };
      case 'filled':
        return {
          backgroundColor: isClickable && hovered
            ? 'var(--md-sys-color-surface-container)'
            : surfaceContainerLow,
          boxShadow: 'none',
          border: 'none'
        };
      default: // elevated
        return {
          backgroundColor: surfaceContainerLow,
          boxShadow: isClickable && hovered ? level2 : level1,
          border: 'none'
        };
    }
  };

  // Base styles
  const baseStyle: React.CSSProperties = {
    padding: getPaddingStyles(),
    borderRadius: large,
    transition: [
      `transform var(--md-sys-motion-spring-expressive-default-spatial-duration, 500ms) ${springDefaultSpatial}`,
      `box-shadow ${short2} ${standard}`,
      `background-color ${short2} ${standard}`,
    ].join(', '),
    transform: isClickable
      ? pressed ? 'scale(0.98)' : hovered ? 'scale(1.03)' : 'scale(1)'
      : 'scale(1)',
    cursor: isClickable ? 'pointer' : undefined,
    outline: focused && isClickable ? `var(--md-sys-border-width-thick) solid ${primary}` : 'none',
    outlineOffset: focused ? 'var(--md-sys-spacing-2)' : 'var(--md-sys-spacing-0)',
    willChange: isClickable ? 'transform' : undefined,
    ...getVariantStyles(),
    ...style
  };

  return (
    <div
      onClick={onClick}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      aria-label={ariaLabel}
      style={baseStyle}
      onMouseEnter={(e) => {
        setHovered(true);
        onMouseEnter?.(e);
      }}
      onMouseLeave={(e) => {
        setHovered(false);
        setPressed(false);
        onMouseLeave?.(e);
      }}
      onMouseDown={() => isClickable && setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onTouchStart={() => isClickable && setPressed(true)}
      onTouchEnd={() => setPressed(false)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    >
      {children}
    </div>
  );
};

export default M3Card;

