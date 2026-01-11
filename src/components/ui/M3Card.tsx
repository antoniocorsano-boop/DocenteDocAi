import React from 'react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useTheme } from '../../hooks/useTheme';

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
  const isClickable = Boolean(onClick);

  // Padding styles using MD3 spacing tokens
  const getPaddingStyles = (): string => {
    switch (padding) {
      case 'none':
        return '0';
      case 'small':
        return 'var(--md-sys-spacing-3)'; // 12px
      case 'large':
        return 'var(--md-sys-spacing-6)'; // 24px
      default: // medium
        return 'var(--md-sys-spacing-4)'; // 16px
    }
  };

  // Variant styles using MD3 design tokens
  const getVariantStyles = (): React.CSSProperties => {
    switch (variant) {
      case 'outlined':
        return {
          backgroundColor: 'var(--md-sys-color-surface)',
          boxShadow: 'none',
          border: '1px solid var(--md-sys-color-outline-variant)'
        };
      case 'filled':
        return {
          backgroundColor: 'var(--md-sys-color-surface-container-highest)',
          boxShadow: 'none',
          border: 'none'
        };
      default: // elevated
        return {
          backgroundColor: 'var(--md-sys-color-surface-container-low)',
          boxShadow: 'var(--md-sys-elevation-level1)',
          border: 'none'
        };
    }
  };

  // Base styles
  const baseStyle: React.CSSProperties = {
    padding: getPaddingStyles(),
    borderRadius: 'var(--md-sys-shape-corner-large)',
    transition: isClickable ? 'box-shadow var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard)' : undefined,
    cursor: isClickable ? 'pointer' : undefined,
    outline: 'none',
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
        if (isClickable && variant === 'elevated') {
          e.currentTarget.style.boxShadow = 'var(--md-sys-elevation-level2)';
        }
        onMouseEnter?.(e);
      }}
      onMouseLeave={(e) => {
        if (isClickable && variant === 'elevated') {
          e.currentTarget.style.boxShadow = 'var(--md-sys-elevation-level1)';
        }
        onMouseLeave?.(e);
      }}
      onFocus={(e) => {
        if (isClickable) {
          e.currentTarget.style.outline = `2px solid var(--md-sys-color-primary)`;
          e.currentTarget.style.outlineOffset = '2px';
        }
      }}
      onBlur={(e) => {
        if (isClickable) {
          e.currentTarget.style.outline = 'none';
          e.currentTarget.style.outlineOffset = '0';
        }
      }}
    >
      {children}
    </div>
  );
};

export default M3Card;


