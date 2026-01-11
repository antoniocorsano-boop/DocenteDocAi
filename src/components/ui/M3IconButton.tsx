import React from 'react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useTheme } from '../../hooks/useTheme';

interface M3IconButtonProps {
  icon: string;
  onClick?: () => void;
  ariaLabel: string;
  disabled?: boolean;
  title?: string;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'standard' | 'filled' | 'tonal' | 'outlined';
  size?: 'small' | 'medium' | 'large';
}

const M3IconButton: React.FC<M3IconButtonProps> = ({
  icon,
  onClick,
  ariaLabel,
  disabled = false,
  title,
  type = 'button',
  variant = 'standard',
  size = 'medium'
}) => {
  // Size styles using MD3 spacing tokens
  const getSizeStyles = (): React.CSSProperties => {
    switch (size) {
      case 'small':
        return {
          width: 'var(--md-sys-spacing-8)', // 32px
          height: 'var(--md-sys-spacing-8)', // 32px
          fontSize: 'var(--md-sys-typescale-label-large-font-size)'
        };
      case 'large':
        return {
          width: 'var(--md-sys-spacing-12)', // 48px
          height: 'var(--md-sys-spacing-12)', // 48px
          fontSize: 'var(--md-sys-typescale-headline-small-font-size)'
        };
      default: // medium
        return {
          width: 'var(--md-sys-spacing-10)', // 40px
          height: 'var(--md-sys-spacing-10)', // 40px
          fontSize: 'var(--md-sys-typescale-label-large-font-size)'
        };
    }
  };

  // Variant styles using MD3 design tokens
  const getVariantStyles = (): React.CSSProperties => {
    switch (variant) {
      case 'filled':
        return {
          backgroundColor: 'var(--md-sys-color-primary-container)',
          color: 'var(--md-sys-color-on-primary-container)'
        };
      case 'tonal':
        return {
          backgroundColor: 'var(--md-sys-color-secondary-container)',
          color: 'var(--md-sys-color-on-secondary-container)'
        };
      case 'outlined':
        return {
          backgroundColor: 'transparent',
          color: 'var(--md-sys-color-on-surface)',
          border: '1px solid var(--md-sys-color-outline)'
        };
      default: // standard
        return {
          backgroundColor: 'transparent',
          color: 'var(--md-sys-color-on-surface-variant)'
        };
    }
  };

  // Base styles
  const baseStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 'var(--md-sys-shape-corner-full)',
    transition: 'all var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard)',
    outline: 'none',
    border: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.38 : 1,
    pointerEvents: disabled ? 'none' : 'auto',
    fontFamily: 'var(--md-sys-typescale-label-large-font-family)',
    fontWeight: 'var(--md-sys-typescale-label-large-font-weight)',
    lineHeight: 'var(--md-sys-typescale-label-large-line-height)',
    letterSpacing: 'var(--md-sys-typescale-label-large-letter-spacing)',
    ...getSizeStyles(),
    ...getVariantStyles()
  };

  // Icon styles
  const iconStyle: React.CSSProperties = {
    fontFamily: 'Material Symbols Outlined',
    userSelect: 'none',
    fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24"
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      title={title || ariaLabel}
      style={baseStyle}
      onMouseEnter={(e) => {
        if (!disabled) {
          switch (variant) {
            case 'standard':
              e.currentTarget.style.backgroundColor = 'var(--md-sys-color-surface-variant)';
              break;
            case 'filled':
              e.currentTarget.style.backgroundColor = 'var(--md-sys-color-primary-container)';
              e.currentTarget.style.opacity = '0.8';
              break;
            case 'tonal':
              e.currentTarget.style.backgroundColor = 'var(--md-sys-color-secondary-container)';
              e.currentTarget.style.opacity = '0.8';
              break;
            case 'outlined':
              e.currentTarget.style.backgroundColor = 'var(--md-sys-color-surface-variant)';
              break;
          }
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          // Reset to original styles
          Object.assign(e.currentTarget.style, baseStyle);
        }
      }}
      onFocus={(e) => {
        if (!disabled) {
          e.currentTarget.style.outline = `2px solid var(--md-sys-color-primary)`;
          e.currentTarget.style.outlineOffset = '2px';
        }
      }}
      onBlur={(e) => {
        if (!disabled) {
          e.currentTarget.style.outline = 'none';
          e.currentTarget.style.outlineOffset = '0';
        }
      }}
    >
      <span
        style={iconStyle}
        aria-hidden="true"
      >
        {icon}
      </span>
    </button>
  );
};

export default M3IconButton;


