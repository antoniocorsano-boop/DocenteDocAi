// LEGACY - MD3 Non-compliant
import React, { useState } from 'react';
import { useTheme } from '../../theme/theme';

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
  const { layers } = useTheme();
  const { sys, ref, motion } = layers;
  // Size styles using MD3 spacing tokens
  const getSizeStyles = (): React.CSSProperties => {
    switch (size) {
      case 'small':
        return {
          width: ref.spacing[8],
          height: ref.spacing[8],
          fontSize: ref.typography.labelLarge.fontSize
        };
      case 'large':
        return {
          width: ref.spacing[12],
          height: ref.spacing[12],
          fontSize: ref.typography.headlineSmall.fontSize
        };
      default: // medium
        return {
          width: ref.spacing[10],
          height: ref.spacing[10],
          fontSize: ref.typography.labelLarge.fontSize
        };
    }
  };

  // Variant styles using MD3 design tokens
  const getVariantStyles = (): React.CSSProperties => {
    switch (variant) {
      case 'filled':
        return {
          backgroundColor: sys.color.primaryContainer,
          color: sys.color.onPrimaryContainer
        };
      case 'tonal':
        return {
          backgroundColor: sys.color.secondaryContainer,
          color: sys.color.onSecondaryContainer
        };
      case 'outlined':
        return {
          backgroundColor: hovered ? sys.color.surfaceVariant : 'transparent',
          color: sys.color.onSurface,
          border: `1px solid ${sys.color.outline}`
        };
      default: // standard
        return {
          backgroundColor: hovered ? sys.color.surfaceVariant : 'transparent',
          color: sys.color.onSurfaceVariant
        };
    }
  };

  // Base styles
  const baseStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: ref.shape.corner.full,
    transition: `all ${motion.duration.short2} ${motion.easing.standard}`,
    outline: focused ? `2px solid ${sys.color.primary}` : 'none',
    outlineOffset: focused ? ref.spacing[2] : '0',
    border: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.38 : (hovered && (variant === 'filled' || variant === 'tonal') ? 0.8 : 1),
    pointerEvents: disabled ? 'none' : 'auto',
    fontFamily: ref.typography.labelLarge.fontFamily,
    fontWeight: ref.typography.labelLarge.fontWeight,
    lineHeight: ref.typography.labelLarge.lineHeight,
    letterSpacing: ref.typography.labelLarge.letterSpacing,
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



