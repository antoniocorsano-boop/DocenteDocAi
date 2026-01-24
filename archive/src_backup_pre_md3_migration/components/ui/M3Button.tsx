// LEGACY - MD3 Non-compliant
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
  const { sys: { colors }, ref, motion, elevation } = layers;

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
          backgroundColor: colors.primary,
          color: colors.onPrimary,
          boxShadow: elevation.level1
        };
      case 'outlined':
        return {
          backgroundColor: 'transparent',
          color: colors.primary,
          border: `1px solid ${colors.outline}`
        };
      case 'text':
        return {
          backgroundColor: 'transparent',
          color: colors.primary
        };
      case 'tonal':
        return {
          backgroundColor: colors.secondaryContainer,
          color: colors.onSecondaryContainer
        };
      case 'elevated':
        return {
          backgroundColor: colors.surfaceContainerLow,
          color: colors.primary,
          boxShadow: elevation.level2
        };
      default:
        return {
          backgroundColor: colors.primary,
          color: colors.onPrimary
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
      aria-label={title || (typeof children === 'string' ? children : undefined)}
    >
      {startIcon && (
        <span
          style={{
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            minWidth: ref.spacing[6],
            minHeight: ref.spacing[6]
          }}
        >
          {startIcon}
        </span>
      )}
      {children && (
        <span
          style={{
            flex: '1 1 auto',
            textAlign: 'center',
            fontSize: ref.typography.labelLarge.fontSize,
            fontWeight: ref.typography.labelLarge.fontWeight,
            lineHeight: ref.typography.labelLarge.lineHeight,
            letterSpacing: ref.typography.labelLarge.letterSpacing,
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
            minWidth: ref.spacing[6],
            minHeight: ref.spacing[6]
          }}
        >
          {endIcon}
        </span>
      )}
    </button>
  );
};

export default M3Button;

