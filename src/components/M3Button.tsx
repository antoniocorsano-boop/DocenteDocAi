import React, { CSSProperties } from 'react';
import { useTheme } from '../theme/theme';
import M3Typography from './ui/M3Typography';

interface M3ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'text' | 'filled' | 'outlined' | 'tonal' | 'elevated';
  size?: 'small' | 'medium' | 'large';
  style?: CSSProperties;
  'aria-label'?: string;
  type?: 'button' | 'submit' | 'reset';
}

export const M3Button: React.FC<M3ButtonProps> = ({ 
  children, 
  onClick, 
  disabled = false,
  variant = 'filled',
  size = 'medium',
  style: customStyle,
  'aria-label': ariaLabel,
  type = 'button'
}) => {
  // Use theme context (for future preset overrides support)
  useTheme();

  // Define variant styles using MD3 tokens
  const getVariantStyles = (): CSSProperties => {
    switch (variant) {
      case 'text':
        return {
          backgroundColor: 'transparent',
          color: 'var(--md-sys-color-primary)',
          border: 'none',
        };
      case 'outlined':
        return {
          backgroundColor: 'transparent',
          color: 'var(--md-sys-color-primary)',
          border: '1px solid var(--md-sys-color-outline)',
        };
      case 'tonal':
        return {
          backgroundColor: 'var(--md-sys-color-secondary-container)',
          color: 'var(--md-sys-color-on-secondary-container)',
          border: 'none',
        };
      case 'elevated':
        return {
          backgroundColor: 'var(--md-sys-color-surface-container-low)',
          color: 'var(--md-sys-color-primary)',
          border: 'none',
          boxShadow: 'var(--md-sys-elevation-level1)',
        };
      case 'filled':
      default:
        return {
          backgroundColor: 'var(--md-sys-color-primary)',
          color: 'var(--md-sys-color-on-primary)',
          border: 'none',
        };
    }
  };

  // Define size styles
  const getSizeStyles = (): CSSProperties => {
    switch (size) {
      case 'small':
        return {
          padding: 'var(--md-sys-spacing-2) var(--md-sys-spacing-3)',
          minHeight: '36px',
        };
      case 'large':
        return {
          padding: 'var(--md-sys-spacing-5) var(--md-sys-spacing-6)',
          minHeight: '52px',
        };
      case 'medium':
      default:
        return {
          padding: 'var(--md-sys-spacing-3) var(--md-sys-spacing-4)',
          minHeight: '44px',
        };
    }
  };

  const buttonStyle: CSSProperties = {
    ...getVariantStyles(),
    ...getSizeStyles(),
    borderRadius: 'var(--md-sys-shape-corner-medium)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.38 : 1,
    transition: 'all var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard)',
    fontSize: 'var(--md-sys-typescale-label-large-font-size)',
    fontWeight: 'var(--md-sys-typescale-label-large-weight)',
    lineHeight: 'var(--md-sys-typescale-label-large-line-height)',
    fontFamily: 'inherit',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 'var(--md-sys-spacing-2)',
    ...customStyle,
  };

  return (
    <button
      type={type}
      style={buttonStyle}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel || (typeof children === 'string' ? children : 'Button')}
      onMouseEnter={(e) => {
        if (!disabled) {
          (e.currentTarget as HTMLButtonElement).style.boxShadow = 'var(--md-sys-elevation-level2)';
        }
      }}
      onMouseLeave={(e) => {
        if (variant === 'elevated') {
          (e.currentTarget as HTMLButtonElement).style.boxShadow = 'var(--md-sys-elevation-level1)';
        } else {
          (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none';
        }
      }}
      onFocus={(e) => {
        (e.currentTarget as HTMLButtonElement).style.outline = `2px solid var(--md-sys-color-primary)`;
        (e.currentTarget as HTMLButtonElement).style.outlineOffset = '2px';
      }}
      onBlur={(e) => {
        (e.currentTarget as HTMLButtonElement).style.outline = 'none';
      }}
    >
      {children}
    </button>
  );
};