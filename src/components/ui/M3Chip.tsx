import React from 'react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useTheme } from '../../hooks/useTheme';

export type M3ChipProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
  variant?: 'filled' | 'outlined' | 'elevated';
  disabled?: boolean;
  onDelete?: () => void;
};

function M3Chip({ label, variant = 'filled', disabled, onDelete, className, ...buttonProps }: M3ChipProps): React.ReactElement {
  const [isHovered, setIsHovered] = React.useState(false);
  const [isFocused, setIsFocused] = React.useState(false);

  // Variant styles using MD3 design tokens
  const getVariantStyles = (): React.CSSProperties => {
    const baseStyles: React.CSSProperties = {};

    switch (variant) {
      case 'outlined':
        baseStyles.backgroundColor = 'var(--md-sys-color-surface)';
        baseStyles.color = 'var(--md-sys-color-on-surface-variant)';
        baseStyles.border = '2px solid var(--md-sys-color-outline)';
        if (isHovered || isFocused) {
          baseStyles.borderColor = 'var(--md-sys-color-on-surface-variant)';
        }
        break;
      case 'elevated':
        baseStyles.backgroundColor = 'var(--md-sys-color-surface)';
        baseStyles.color = 'var(--md-sys-color-on-surface-variant)';
        baseStyles.border = '1px solid var(--md-sys-color-surface-variant)';
        baseStyles.boxShadow = 'var(--md-sys-elevation-level1)';
        if (isHovered || isFocused) {
          baseStyles.boxShadow = 'var(--md-sys-elevation-level2)';
        }
        break;
      default: // filled
        baseStyles.backgroundColor = 'var(--md-sys-color-secondary-container)';
        baseStyles.color = 'var(--md-sys-color-on-secondary-container)';
        baseStyles.border = '1px solid var(--md-sys-color-secondary-container)';
        if (isHovered || isFocused) {
          baseStyles.backgroundColor = 'var(--md-sys-color-secondary-container-hover)';
        }
        break;
    }

    return baseStyles;
  };

  // Container styles
  const containerStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 'var(--md-sys-spacing-2)',
    borderRadius: 'var(--md-sys-shape-corner-small)',
    padding: 'var(--md-sys-spacing-1) var(--md-sys-spacing-3)',
    transition: 'all var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard)',
    opacity: disabled ? 0.38 : 1,
    cursor: disabled ? 'not-allowed' : 'default',
    pointerEvents: disabled ? 'none' : 'auto'
  };

  // Button styles
  const buttonStyle: React.CSSProperties = {
    fontFamily: 'var(--md-sys-typescale-label-large-font-family)',
    fontSize: 'var(--md-sys-typescale-label-large-font-size)',
    fontWeight: 'var(--md-sys-typescale-label-large-font-weight)',
    lineHeight: 'var(--md-sys-typescale-label-large-line-height)',
    letterSpacing: 'var(--md-sys-typescale-label-large-letter-spacing)',
    borderRadius: 'var(--md-sys-shape-corner-small)',
    transition: 'all var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard)',
    outline: 'none',
    border: 'none',
    backgroundColor: 'transparent',
    cursor: disabled ? 'not-allowed' : 'pointer',
    ...getVariantStyles()
  };

  // Delete button styles
  const deleteButtonStyle: React.CSSProperties = {
    width: 'var(--md-sys-spacing-4)',
    height: 'var(--md-sys-spacing-4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 'var(--md-sys-shape-corner-full)',
    color: 'var(--md-sys-color-on-surface-variant)',
    transition: 'all var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard)',
    outline: 'none',
    border: 'none',
    backgroundColor: 'transparent',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: isHovered || isFocused ? 0.8 : 1
  };

  // Icon styles
  const iconStyle: React.CSSProperties = {
    fontFamily: 'Material Symbols Outlined',
    fontSize: 'var(--md-sys-typescale-body-small-font-size)',
    fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24",
    userSelect: 'none'
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);
  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  return (
    <button
      style={buttonStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      disabled={disabled}
      {...buttonProps}
    >
      <span style={containerStyle}>
        {label}
        {onDelete && (
          <button
            type="button"
            style={deleteButtonStyle}
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            disabled={disabled}
            aria-label="Remove"
          >
            <span style={iconStyle}>close</span>
          </button>
        )}
      </span>
    </button>
  );
}

export default M3Chip;


