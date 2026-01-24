// MD3 Compliant M3Button Component
// Fully compliant with MD3 tokens: uses var(--md-sys-*) CSS variables for theming, spacing, typography, shape, motion, and elevation
// No useTheme() dependency - all styling uses direct MD3 CSS variables

import React, { CSSProperties } from 'react';
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
  style: customStyle = {}, 
  type = 'button',
  'aria-label': ariaLabel
}) => { 
  // MD3 Token mapping - no useTheme() dependency
  // Variant tokens using direct MD3 CSS variables
  let backgroundColor = 'var(--md-sys-color-primary)';
  let color = 'var(--md-sys-color-on-primary)';
  let border = 'none';
  let boxShadow = 'none';
  if (variant === 'text') {
    backgroundColor = 'transparent';
    color = 'var(--md-sys-color-primary)';
  } else if (variant === 'outlined') {
    backgroundColor = 'transparent';
    color = 'var(--md-sys-color-primary)';
    border = '1px solid var(--md-sys-color-outline)';
  } else if (variant === 'tonal') {
    backgroundColor = 'var(--md-sys-color-secondary-container)';
    color = 'var(--md-sys-color-on-secondary-container)';
  } else if (variant === 'elevated') {
    backgroundColor = 'var(--md-sys-color-surface-container-low)';
    color = 'var(--md-sys-color-primary)';
    boxShadow = 'var(--md-sys-elevation-level-1)';
  }

  // Size tokens using MD3 spacing variables
  let padding = 'var(--md-sys-spacing-4) var(--md-sys-spacing-6)';
  let minHeight = 'var(--md-sys-spacing-10)';
  if (size === 'small') {
    padding = 'var(--md-sys-spacing-2) var(--md-sys-spacing-4)';
    minHeight = 'var(--md-sys-spacing-8)';
  } else if (size === 'large') {
    padding = 'var(--md-sys-spacing-6) var(--md-sys-spacing-8)';
    minHeight = 'var(--md-sys-spacing-12)';
  }

  const buttonStyle: CSSProperties = {
    backgroundColor,
    color,
    border,
    boxShadow,
    borderRadius: 'var(--md-sys-shape-corner-extra-large)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.38 : 1,
    transition: 'all var(--md-sys-motion-duration-short-2) var(--md-sys-motion-easing-standard)',
    fontSize: 'var(--md-sys-typescale-label-large-font)',
    fontWeight: 'var(--md-sys-typescale-label-large-weight)',
    lineHeight: 'var(--md-sys-typescale-label-large-line-height)',
    fontFamily: 'inherit',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 'var(--md-sys-spacing-2)',
    padding,
    minHeight,
    ...customStyle,
  };

  return (
    <button
      type={type}
      style={buttonStyle}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel ? ariaLabel : (typeof children === 'string' ? children : 'Button')}
      // Hover and focus effects handled by CSS pseudo-classes
    >
      {children}
    </button>
  );
};






