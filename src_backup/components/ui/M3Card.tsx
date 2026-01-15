// LEGACY - MD3 Non-compliant
import React, { useState } from 'react';
import { useTheme } from '../../theme/theme';

interface M3CardProps {
  children: React.ReactNode;
  onClick?: () => void;
  onMouseEnter?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseLeave?: (e: React.MouseEvent<HTMLDivElement>) => void;
  variant?: 'elevated' | 'outlined' | 'filled';
  padding?: 'none' | 'small' | 'medium' | 'large';
  style?: React.CSSProperties;
  ariaLabel?: string;
}

const M3Card: React.FC<M3CardProps> = ({
  children,
  onClick,
  onMouseEnter,
  onMouseLeave,
  variant = 'elevated',
  padding = 'medium',
  style,
  ariaLabel
}) => {
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const isClickable = Boolean(onClick);
  const { layers } = useTheme();
  const { sys, ref, elevation, motion } = layers;

  // Padding styles using ref.spacing tokens
  const getPaddingStyles = (): string => {
    switch (padding) {
      case 'none':
        return '0';
      case 'small':
        return ref.spacing[3];
      case 'large':
        return ref.spacing[6];
      default: // medium
        return ref.spacing[4];
    }
  };

  // Variant styles using sys and elevation tokens
  const getVariantStyles = (): React.CSSProperties => {
    switch (variant) {
      case 'outlined':
        return {
          backgroundColor: sys.color.surface,
          boxShadow: 'none',
          border: `1px solid ${sys.color.outlineVariant}`
        };
      case 'filled':
        return {
          backgroundColor: sys.color.surfaceContainerLow,
          boxShadow: 'none',
          border: 'none'
        };
      default: // elevated
        return {
          backgroundColor: sys.color.surfaceContainerLow,
          boxShadow: isClickable && hovered ? elevation.level2 : elevation.level1,
          border: 'none'
        };
    }
  };

  // Base styles
  const baseStyle: React.CSSProperties = {
    padding: getPaddingStyles(),
    borderRadius: ref.shape.corner.large,
    transition: isClickable ? `box-shadow ${motion.duration.short2} ${motion.easing.standard}` : undefined,
    cursor: isClickable ? 'pointer' : undefined,
    outline: focused && isClickable ? `2px solid ${sys.color.primary}` : 'none',
    outlineOffset: focused ? ref.spacing[2] : '0',
    ...getVariantStyles(),
    ...style
  };

  return (
    <div
      onClick={onClick}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      aria-label={ariaLabel}
      style={baseStyle}
      onMouseEnter={(e) => {
        setHovered(true);
        onMouseEnter?.(e);
      }}
      onMouseLeave={(e) => {
        setHovered(false);
        onMouseLeave?.(e);
      }}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    >
      {children}
    </div>
  );
};

export default M3Card;



