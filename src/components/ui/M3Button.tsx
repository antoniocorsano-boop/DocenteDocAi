import React, { ButtonHTMLAttributes } from 'react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useTheme } from '../../hooks/useTheme';

interface M3ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'filled' | 'outlined' | 'text' | 'tonal' | 'elevated';
  size?: 'small' | 'medium' | 'large';
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const M3Button: React.FC<M3ButtonProps> = ({
  variant = 'filled',
  size = 'medium',
  startIcon,
  endIcon,
  disabled = false,
  onClick,
  children,
  type = 'button',
  fullWidth = false,
  title,
  ...props
}) => {
  // Base styles using MD3 design tokens
  const baseStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard)',
    outline: 'none',
    borderRadius: 'var(--md-sys-shape-corner-medium)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.38 : 1,
    pointerEvents: disabled ? 'none' : 'auto',
    border: 'none',
    textDecoration: 'none'
  };

  // Variant styles using MD3 design tokens
  const getVariantStyles = (): React.CSSProperties => {
    switch (variant) {
      case 'filled':
        return {
          backgroundColor: 'var(--md-sys-color-primary)',
          color: 'var(--md-sys-color-on-primary)',
          boxShadow: 'var(--md-sys-elevation-level0)'
        };
      case 'outlined':
        return {
          backgroundColor: 'transparent',
          color: 'var(--md-sys-color-primary)',
          border: '1px solid var(--md-sys-color-outline)'
        };
      case 'text':
        return {
          backgroundColor: 'transparent',
          color: 'var(--md-sys-color-primary)'
        };
      case 'tonal':
        return {
          backgroundColor: 'var(--md-sys-color-secondary-container)',
          color: 'var(--md-sys-color-on-secondary-container)'
        };
      case 'elevated':
        return {
          backgroundColor: 'var(--md-sys-color-surface-container-low)',
          color: 'var(--md-sys-color-primary)',
          boxShadow: 'var(--md-sys-elevation-level1)'
        };
      default:
        return {
          backgroundColor: 'var(--md-sys-color-primary)',
          color: 'var(--md-sys-color-on-primary)'
        };
    }
  };

  // Size styles using MD3 spacing tokens
  const getSizeStyles = (): React.CSSProperties => {
    switch (size) {
      case 'small':
        return {
          height: 'var(--md-sys-spacing-9)', // 36px
          padding: '0 var(--md-sys-spacing-4)', // 0 16px
          gap: 'var(--md-sys-spacing-2)', // 8px
          borderRadius: 'var(--md-sys-shape-corner-small)',
          fontSize: 'var(--md-sys-typescale-label-medium-font-size)',
          fontWeight: 'var(--md-sys-typescale-label-medium-font-weight)',
          lineHeight: 'var(--md-sys-typescale-label-medium-line-height)',
          letterSpacing: 'var(--md-sys-typescale-label-medium-letter-spacing)'
        };
      case 'large':
        return {
          height: 'var(--md-sys-spacing-12)', // 48px
          padding: '0 var(--md-sys-spacing-6)', // 0 24px
          gap: 'var(--md-sys-spacing-2)', // 8px
          borderRadius: 'var(--md-sys-shape-corner-large)',
          fontSize: 'var(--md-sys-typescale-label-large-font-size)',
          fontWeight: 'var(--md-sys-typescale-label-large-font-weight)',
          lineHeight: 'var(--md-sys-typescale-label-large-line-height)',
          letterSpacing: 'var(--md-sys-typescale-label-large-letter-spacing)'
        };
      default: // medium
        return {
          height: 'var(--md-sys-spacing-10)', // 40px
          padding: '0 var(--md-sys-spacing-6)', // 0 24px
          gap: 'var(--md-sys-spacing-2)', // 8px
          borderRadius: 'var(--md-sys-shape-corner-medium)',
          fontSize: 'var(--md-sys-typescale-label-large-font-size)',
          fontWeight: 'var(--md-sys-typescale-label-large-font-weight)',
          lineHeight: 'var(--md-sys-typescale-label-large-line-height)',
          letterSpacing: 'var(--md-sys-typescale-label-large-letter-spacing)'
        };
    }
  };

  // Hover and focus styles
  const getHoverStyles = (): React.CSSProperties => {
    if (disabled) return {};

    switch (variant) {
      case 'filled':
        return {
          boxShadow: 'var(--md-sys-elevation-level1)',
          backgroundColor: 'var(--md-sys-color-primary-hover)' // This might need to be calculated
        };
      case 'outlined':
        return {
          backgroundColor: 'var(--md-sys-color-primary-container)',
          borderColor: 'var(--md-sys-color-primary)'
        };
      case 'text':
        return {
          backgroundColor: 'var(--md-sys-color-primary-container)'
        };
      case 'tonal':
        return {
          boxShadow: 'var(--md-sys-elevation-level1)'
        };
      case 'elevated':
        return {
          boxShadow: 'var(--md-sys-elevation-level2)'
        };
      default:
        return {};
    }
  };

  const combinedStyle: React.CSSProperties = {
    ...baseStyle,
    ...getVariantStyles(),
    ...getSizeStyles(),
    ...(fullWidth && { width: '100%' })
  };

  return (
    <button
      {...props}
      type={type}
      disabled={disabled}
      onClick={onClick}
      title={title}
      style={combinedStyle}
      onMouseEnter={(e) => {
        if (!disabled) {
          const hoverStyles = getHoverStyles();
          Object.assign(e.currentTarget.style, hoverStyles);
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          // Reset to original styles
          Object.assign(e.currentTarget.style, combinedStyle);
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
      {startIcon && <span style={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>{startIcon}</span>}
      {children && <span style={{ flex: '1 1 auto', textAlign: 'center' }}>{children}</span>}
      {endIcon && <span style={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>{endIcon}</span>}
    </button>
  );
};

export default M3Button;


