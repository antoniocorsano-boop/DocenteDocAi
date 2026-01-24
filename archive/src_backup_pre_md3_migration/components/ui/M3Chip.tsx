// LEGACY - MD3 Non-compliant
import React from 'react';
import { useTheme } from '../../theme/theme';

export type M3ChipProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
  variant?: 'filled' | 'outlined' | 'elevated';
  disabled?: boolean;
  onDelete?: () => void;
};

function M3Chip({ label, variant = 'filled', disabled, onDelete, ...buttonProps }: M3ChipProps): React.ReactElement {
  const [isHovered, setIsHovered] = React.useState(false);
  const [isFocused, setIsFocused] = React.useState(false);
  const { layers } = useTheme();
  const { sys, ref, motion, elevation } = layers;

  // Variant styles using MD3 design tokens
  const getVariantStyles = (): React.CSSProperties => {
    const baseStyles: React.CSSProperties = {};

    switch (variant) {
      case 'outlined':
        baseStyles.backgroundColor = sys.color.surface;
        baseStyles.color = sys.color.onSurfaceVariant;
        baseStyles.border = `2px solid ${sys.color.outline}`;
        if (isHovered || isFocused) {
          baseStyles.borderColor = sys.color.onSurfaceVariant;
        }
        break;
      case 'elevated':
        baseStyles.backgroundColor = sys.color.surface;
        baseStyles.color = sys.color.onSurfaceVariant;
        baseStyles.border = `1px solid ${sys.color.surfaceVariant}`;
        baseStyles.boxShadow = elevation.level1;
        if (isHovered || isFocused) {
          baseStyles.boxShadow = elevation.level2;
        }
        break;
      default: // filled
        baseStyles.backgroundColor = sys.color.secondaryContainer;
        baseStyles.color = sys.color.onSecondaryContainer;
        baseStyles.border = `1px solid ${sys.color.secondaryContainer}`;
        break;
    }

    return baseStyles;
  };

  // Container styles
  const containerStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: ref.spacing[2],
    borderRadius: ref.shape.corner.small,
    padding: `${ref.spacing[1]} ${ref.spacing[3]}`,
    transition: `all ${motion.duration.short2} ${motion.easing.standard}`,
    opacity: disabled ? 0.38 : (variant === 'filled' && (isHovered || isFocused) ? 0.8 : 1),
    cursor: disabled ? 'not-allowed' : 'default',
    pointerEvents: disabled ? 'none' : 'auto'
  };

  // Button styles
  const buttonStyle: React.CSSProperties = {
    fontFamily: ref.typography.labelLarge.fontFamily,
    fontSize: ref.typography.labelLarge.fontSize,
    fontWeight: ref.typography.labelLarge.fontWeight,
    lineHeight: ref.typography.labelLarge.lineHeight,
    letterSpacing: ref.typography.labelLarge.letterSpacing,
    borderRadius: ref.shape.corner.small,
    transition: `all ${motion.duration.short2} ${motion.easing.standard}`,
    outline: 'none',
    border: 'none',
    backgroundColor: 'transparent',
    cursor: disabled ? 'not-allowed' : 'pointer',
    ...getVariantStyles()
  };

  // Delete button styles
  const deleteButtonStyle: React.CSSProperties = {
    width: ref.spacing[4],
    height: ref.spacing[4],
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: ref.shape.corner.full,
    color: sys.color.onSurfaceVariant,
    transition: `all ${motion.duration.short2} ${motion.easing.standard}`,
    outline: 'none',
    border: 'none',
    backgroundColor: 'transparent',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: isHovered || isFocused ? 0.8 : 1
  };

  // Icon styles
  const iconStyle: React.CSSProperties = {
    fontFamily: 'Material Symbols Outlined',
    fontSize: ref.typography.bodySmall.fontSize,
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



