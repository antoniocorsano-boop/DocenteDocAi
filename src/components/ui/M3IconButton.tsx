// MD3 Compliant - Migrated to direct CSS custom properties
import React, { useState } from 'react';

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
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  // Size styles using MD3 spacing tokens
  const getSizeStyles = (): React.CSSProperties => {
    switch (size) {
      case 'small':
        return {
          width: 'var(--md-sys-spacing-8)',
          height: 'var(--md-sys-spacing-8)',
          fontSize: 'var(--app-text-label)'
        };
      case 'large':
        return {
          width: 'var(--md-sys-spacing-12)',
          height: 'var(--md-sys-spacing-12)',
          fontSize: 'var(--app-text-title)'
        };
      default: // medium
        return {
          width: 'var(--md-sys-spacing-10)',
          height: 'var(--md-sys-spacing-10)',
          fontSize: 'var(--app-text-label)'
        };
    }
  };

  // Variant styles using MD3 design tokens
  const getVariantStyles = (): React.CSSProperties => {
    switch (variant) {
      case 'filled':
        return {
          backgroundColor: 'var(--app-color-primary-container)',
          color: 'var(--app-color-on-primary-container)'
        };
      case 'tonal':
        return {
          backgroundColor: 'var(--app-color-secondary-container)',
          color: 'var(--app-color-on-secondary-container)'
        };
      case 'outlined':
        return {
          backgroundColor: hovered ? 'var(--md-sys-color-surface-variant)' : 'transparent',
          color: 'var(--app-color-on-surface)',
          border: `var(--app-border-normal) solid var(--md-sys-color-outline)`
        };
      default: // standard
        return {
          backgroundColor: hovered ? 'var(--md-sys-color-surface-variant)' : 'transparent',
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
    transition: `all var(--md-sys-motion-duration-short2) var(--app-easing-standard)`,
    outline: focused ? `var(--app-border-thick) solid var(--app-color-primary)` : 'none',
    outlineOffset: focused ? 'var(--app-spacing-component)' : '0',
    border: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.38 : (hovered && (variant === 'filled' || variant === 'tonal') ? 0.8 : 1),
    pointerEvents: disabled ? 'none' : 'auto',
    fontFamily: 'var(--md-sys-typescale-font-family)',
    fontWeight: 'var(--app-text-label-weight)',
    lineHeight: 'var(--app-text-label-line-height)',
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
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
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








