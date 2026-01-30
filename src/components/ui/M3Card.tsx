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
  const isClickable = Boolean(onClick);

  // MD3 Token mapping - no useTheme() dependency
  // Color tokens
  const surface = 'var(--app-color-surface)';
  const outlineVariant = 'var(--md-sys-color-outline-variant)';
  const surfaceContainerLow = 'var(--md-sys-color-surface-container-low)';
  const primary = 'var(--app-color-primary)';

  // Shape token
  const large = 'var(--md-sys-shape-corner-large)';

  // Elevation tokens
  const level1 = 'var(--app-elevation-level-1)';
  const level2 = 'var(--app-elevation-level-2)';

  // Motion tokens
  const short2 = 'var(--md-sys-motion-duration-short-2)';
  const standard = 'var(--app-easing-standard)';

  // Padding styles using MD3 spacing tokens
  const getPaddingStyles = (): string => {
    switch (padding) {
      case 'none':
        return 'var(--md-sys-spacing-0)';
      case 'small':
        return 'var(--app-spacing-container)';
      case 'large':
        return 'var(--md-sys-spacing-8)';
      default: // medium
        return 'var(--app-spacing-section)';
    }
  };

  // Variant styles using MD3 tokens
  const getVariantStyles = (): React.CSSProperties => {
    switch (variant) {
      case 'outlined':
        return {
          backgroundColor: surface,
          boxShadow: 'none',
          border: `var(--app-border-normal) solid ${outlineVariant}`
        };
      case 'filled':
        return {
          backgroundColor: surfaceContainerLow,
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
    transition: isClickable ? `box-shadow ${short2} ${standard}` : undefined,
    cursor: isClickable ? 'pointer' : undefined,
    outline: focused && isClickable ? `var(--app-border-thick) solid ${primary}` : 'none',
    outlineOffset: focused ? 'var(--app-spacing-component)' : 'var(--md-sys-spacing-0)',
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
        onMouseLeave?.(e);
      }}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    >
      {children}
    </div>
  );
};

export default M3Card;








