// MD3 Compliant M3Button Component
// Fully compliant with MD3 tokens: uses var(--md-sys-*) CSS variables for theming, spacing, typography, shape, motion, and elevation
// No useTheme() dependency - all styling uses direct MD3 CSS variables

import React, { ButtonHTMLAttributes, useState } from 'react';

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
  // Extract aria-label from props to handle it properly
  const { 'aria-label': ariaLabel, ...otherProps } = props;
  const [isPressed, setIsPressed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  // MD3 Token mapping — direct --md-sys-* tokens only
  // Color tokens
  const primary = 'var(--md-sys-color-primary)';
  const onPrimary = 'var(--md-sys-color-on-primary)';
  const outline = 'var(--md-sys-color-outline)';
  const secondaryContainer = 'var(--md-sys-color-secondary-container)';
  const onSecondaryContainer = 'var(--md-sys-color-on-secondary-container)';
  const surfaceContainerLow = 'var(--md-sys-color-surface-container-low)';

  // Spacing tokens
  const spacing4 = 'var(--md-sys-spacing-4)';
  const spacing6 = 'var(--md-sys-spacing-6)';
  const spacing10 = 'var(--md-sys-spacing-10)';
  const spacing12 = 'var(--md-sys-spacing-12)';

  // Shape tokens
  const shapeSmall = 'var(--md-sys-shape-corner-small)';
  const shapeMedium = 'var(--md-sys-shape-corner-medium)';
  const shapeLarge = 'var(--md-sys-shape-corner-large)';

  // Typography tokens
  const labelMediumFontSize = 'var(--md-sys-typescale-label-large-font-size)';
  const labelMediumFontWeight = 'var(--md-sys-typescale-label-large-weight)';
  const labelMediumLineHeight = 'var(--md-sys-typescale-label-large-line-height)';
  const labelMediumLetterSpacing = 'var(--md-sys-typescale-label-medium-letter-spacing)';

  const labelLargeFontSize = 'var(--md-sys-typescale-label-large-font-size)';
  const labelLargeFontWeight = 'var(--md-sys-typescale-label-large-weight)';
  const labelLargeLineHeight = 'var(--md-sys-typescale-label-large-line-height)';
  const labelLargeLetterSpacing = 'var(--md-sys-typescale-label-large-letter-spacing)';

  // Motion tokens
  const durationShort2 = 'var(--md-sys-motion-duration-short2)';
  const easingStandard = 'var(--md-sys-motion-easing-standard)';
  const springFastEffects = 'var(--md-sys-motion-spring-expressive-fast-effects)';

  // Base style
  const baseStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: [
      `transform ${durationShort2} ${springFastEffects}`,
      `box-shadow ${durationShort2} ${easingStandard}`,
      `background-color ${durationShort2} ${easingStandard}`,
      `color ${durationShort2} ${easingStandard}`
    ].join(', '),
    transform: disabled ? 'scale(1)' : isPressed ? 'scale(0.96)' : isHovered ? 'scale(1.02)' : 'scale(1)',
    outline: 'none',
    borderRadius: shapeMedium,
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 'var(--md-sys-state-opacity-disabled)' : 1,
    pointerEvents: disabled ? 'none' : 'auto',
    border: 'none',
    textDecoration: 'none',
    width: fullWidth ? 'var(--md-sys-percent-100)' : 'auto',
    gap: spacing4
  };

  // Variant styles
  const getVariantStyles = (): React.CSSProperties => {
    switch (variant) {
      case 'filled':
        return {
          backgroundColor: primary,
          color: onPrimary,
          boxShadow: 'var(--md-sys-elevation-level1)'
        };
      case 'outlined':
        return {
          backgroundColor: 'transparent',
          color: primary,
          border: `var(--md-sys-border-width-normal) solid ${outline}`
        };
      case 'text':
        return {
          backgroundColor: 'transparent',
          color: primary
        };
      case 'tonal':
        return {
          backgroundColor: secondaryContainer,
          color: onSecondaryContainer
        };
      case 'elevated':
        return {
          backgroundColor: surfaceContainerLow,
          color: primary,
          boxShadow: 'var(--md-sys-elevation-level2)'
        };
      default:
        return {
          backgroundColor: primary,
          color: onPrimary
        };
    }
  };

  // Size styles
  const getSizeStyles = (): React.CSSProperties => {
    switch (size) {
      case 'small':
        return {
          height: spacing10,
          padding: `0 ${spacing4}`,
          borderRadius: shapeSmall,
          fontSize: labelMediumFontSize,
          fontWeight: labelMediumFontWeight,
          lineHeight: labelMediumLineHeight,
          letterSpacing: labelMediumLetterSpacing
        };
      case 'large':
        return {
          height: spacing12,
          padding: `0 ${spacing6}`,
          borderRadius: shapeLarge,
          fontSize: labelLargeFontSize,
          fontWeight: labelLargeFontWeight,
          lineHeight: labelLargeLineHeight,
          letterSpacing: labelLargeLetterSpacing
        };
      default:
        // medium
        return {
          height: spacing10,
          padding: `0 ${spacing4}`,
          borderRadius: shapeMedium,
          fontSize: labelLargeFontSize,
          fontWeight: labelLargeFontWeight,
          lineHeight: labelLargeLineHeight,
          letterSpacing: labelLargeLetterSpacing
        };
    }
  };

  const combinedStyle: React.CSSProperties = {
    ...baseStyle,
    ...getVariantStyles(),
    ...getSizeStyles()
  };

  return (
    <button
      {...otherProps}
      type={type}
      disabled={disabled}
      onClick={onClick}
      title={title}
      style={combinedStyle}
      aria-label={ariaLabel || title || (typeof children === 'string' ? children : undefined)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setIsPressed(false); }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
    >
      {startIcon && (
        <span
          style={{
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            minWidth: spacing6,
            minHeight: spacing6
          }}
        >
          {startIcon}
        </span>
      )}
      {children && (
        <span
          style={{
            flex: 'var(--md-sys-flex-1-1-auto)',
            textAlign: 'center',
            fontSize: labelLargeFontSize,
            fontWeight: labelLargeFontWeight,
            lineHeight: labelLargeLineHeight,
            letterSpacing: labelLargeLetterSpacing,
            color: combinedStyle.color
          }}
        >
          {children}
        </span>
      )}
      {endIcon && (
        <span
          style={{
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            minWidth: spacing4,
            minHeight: spacing4
          }}
        >
          {endIcon}
        </span>
      )}
    </button>
  );
};

export default M3Button;

