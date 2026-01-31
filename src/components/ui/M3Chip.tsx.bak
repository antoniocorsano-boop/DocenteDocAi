// MD3 Compliant M3Chip Component
// Fully compliant with MD3 tokens: uses var(--md-sys-*) CSS variables for theming, spacing, typography, shape, motion, and elevation
// No useTheme() dependency - all styling uses direct MD3 CSS variables

import React from 'react';

export type M3ChipProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
  variant?: 'filled' | 'outlined' | 'elevated';
  disabled?: boolean;
  onDelete?: () => void;
};

function M3Chip({ label, variant = 'filled', disabled, onDelete, ...buttonProps }: M3ChipProps): React.ReactElement {
  const [isHovered, setIsHovered] = React.useState(false);
  const [isFocused, setIsFocused] = React.useState(false);

  // MD3 Token mapping - no useTheme() dependency
  // Color tokens
  const surface = 'var(--app-color-surface)';
  const onSurfaceVariant = 'var(--app-color-on-surface-variant)';
  const outline = 'var(--md-sys-color-outline)';
  const surfaceVariant = 'var(--md-sys-color-surface-variant)';
  const secondaryContainer = 'var(--app-color-secondary-container)';
  const onSecondaryContainer = 'var(--app-color-on-secondary-container)';

  // Shape tokens
  const small = 'var(--md-sys-shape-corner-small)';
  const full = 'var(--md-sys-shape-corner-full)';

  // Elevation tokens
  const level1 = 'var(--app-elevation-level-1)';
  const level2 = 'var(--app-elevation-level-2)';

  // Motion tokens
  const short2 = 'var(--md-sys-motion-duration-short-2)';
  const standard = 'var(--app-easing-standard)';

  // Typography tokens
  const labelLarge = {
    fontFamily: 'var(--md-sys-typescale-label-large-font)',
    fontSize: 'var(--app-text-label)',
    fontWeight: 'var(--md-sys-typescale-label-large-weight)',
    lineHeight: 'var(--app-text-label-line-height)',
    letterSpacing: 'var(--md-sys-typescale-label-large-tracking)'
  };
  const bodySmall = {
    fontSize: 'var(--app-text-body)'
  };

  // Variant styles using MD3 design tokens
  const getVariantStyles = (): React.CSSProperties => {
    const baseStyles: React.CSSProperties = {};

    switch (variant) {
      case 'outlined':
        baseStyles.backgroundColor = surface;
        baseStyles.color = onSurfaceVariant;
        baseStyles.border = `var(--app-border-thick) solid ${outline}`;
        if (isHovered || isFocused) {
          baseStyles.borderColor = onSurfaceVariant;
        }
        break;
      case 'elevated':
        baseStyles.backgroundColor = surface;
        baseStyles.color = onSurfaceVariant;
        baseStyles.border = `var(--app-border-normal) solid ${surfaceVariant}`;
        baseStyles.boxShadow = level1;
        if (isHovered || isFocused) {
          baseStyles.boxShadow = level2;
        }
        break;
      default: // filled
        baseStyles.backgroundColor = secondaryContainer;
        baseStyles.color = onSecondaryContainer;
        baseStyles.border = `var(--app-border-normal) solid ${secondaryContainer}`;
        break;
    }

    return baseStyles;
  };

  // Container styles
  const containerStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 'var(--app-spacing-component)',
    borderRadius: small,
    padding: `var(--app-spacing-component) var(--app-spacing-element)`,
    transition: `all ${short2} ${standard}`,
    opacity: disabled ? 0.38 : (variant === 'filled' && (isHovered || isFocused) ? 0.8 : 1),
    cursor: disabled ? 'not-allowed' : 'default',
    pointerEvents: disabled ? 'none' : 'auto'
  };

  // Button styles
  const buttonStyle: React.CSSProperties = {
    fontFamily: labelLarge.fontFamily,
    fontSize: labelLarge.fontSize,
    fontWeight: labelLarge.fontWeight,
    lineHeight: labelLarge.lineHeight,
    letterSpacing: labelLarge.letterSpacing,
    borderRadius: small,
    transition: `all ${short2} ${standard}`,
    outline: 'none',
    border: 'none',
    backgroundColor: 'transparent',
    cursor: disabled ? 'not-allowed' : 'pointer',
    ...getVariantStyles()
  };

  // Delete button styles
  const deleteButtonStyle: React.CSSProperties = {
    width: 'var(--app-spacing-container)',
    height: 'var(--app-spacing-container)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: full,
    color: onSurfaceVariant,
    transition: `all ${short2} ${standard}`,
    outline: 'none',
    border: 'none',
    backgroundColor: 'transparent',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: isHovered || isFocused ? 0.8 : 1
  };

  // Icon styles
  const iconStyle: React.CSSProperties = {
    fontFamily: 'Material Symbols Outlined',
    fontSize: bodySmall.fontSize,
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








