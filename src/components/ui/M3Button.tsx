import React, { ButtonHTMLAttributes } from 'react';
import { useTheme } from '../../theme/theme';

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
  // Use theme layers correctly
  const { layers } = useTheme();
  const { sys, ref, motion, elevation } = layers;

  // Base style
  const baseStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: `all ${motion.duration.short2} ${motion.easing.standard}`,
    outline: 'none',
    borderRadius: ref.shape.medium,
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.38 : 1,
    pointerEvents: disabled ? 'none' : 'auto',
    border: 'none',
    textDecoration: 'none',
    width: fullWidth ? '100%' : 'auto',
    gap: ref.spacing[2]
  };

  // Variant styles
  const getVariantStyles = (): React.CSSProperties => {
    switch (variant) {
      case 'filled':
        return {
          backgroundColor: sys.colors.primary,
          color: sys.colors.onPrimary,
          boxShadow: elevation.level1
        };
      case 'outlined':
        return {
          backgroundColor: 'transparent',
          color: sys.colors.primary,
          border: `1px solid ${sys.colors.outline}`
        };
      case 'text':
        return {
          backgroundColor: 'transparent',
          color: sys.colors.primary
        };
      case 'tonal':
        return {
          backgroundColor: sys.colors.secondaryContainer,
          color: sys.colors.onSecondaryContainer
        };
      case 'elevated':
        return {
          backgroundColor: sys.colors.surfaceContainerLow,
          color: sys.colors.primary,
          boxShadow: elevation.level2
        };
      default:
        return {
          backgroundColor: sys.colors.primary,
          color: sys.colors.onPrimary
        };
    }
  };

  // Size styles
  const getSizeStyles = (): React.CSSProperties => {
    switch (size) {
      case 'small':
        return {
          height: ref.spacing[9],
          padding: `0 ${ref.spacing[4]}`,
          borderRadius: ref.shape.small,
          fontSize: ref.typography.labelMedium.fontSize,
          fontWeight: ref.typography.labelMedium.fontWeight,
          lineHeight: ref.typography.labelMedium.lineHeight,
          letterSpacing: ref.typography.labelMedium.letterSpacing
        };
      case 'large':
        return {
          height: ref.spacing[12],
          padding: `0 ${ref.spacing[6]}`,
          borderRadius: ref.shape.large,
          fontSize: ref.typography.labelLarge.fontSize,
          fontWeight: ref.typography.labelLarge.fontWeight,
          lineHeight: ref.typography.labelLarge.lineHeight,
          letterSpacing: ref.typography.labelLarge.letterSpacing
        };
      default:
        // medium
        return {
          height: ref.spacing[10],
          padding: `0 ${ref.spacing[6]}`,
          borderRadius: ref.shape.medium,
          fontSize: ref.typography.labelLarge.fontSize,
          fontWeight: ref.typography.labelLarge.fontWeight,
          lineHeight: ref.typography.labelLarge.lineHeight,
          letterSpacing: ref.typography.labelLarge.letterSpacing
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
      {...props}
      type={type}
      disabled={disabled}
      onClick={onClick}
      title={title}
      style={combinedStyle}
      onMouseEnter={(e) => {
        if (!disabled && variant === 'filled') {
          e.currentTarget.style.backgroundColor = sys.colors.primaryHover;
          e.currentTarget.style.boxShadow = elevation.level1;
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          Object.assign(e.currentTarget.style, combinedStyle);
        }
      }}
      onFocus={(e) => {
        if (!disabled) {
          e.currentTarget.style.outline = `2px solid ${sys.colors.primary}`;
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
