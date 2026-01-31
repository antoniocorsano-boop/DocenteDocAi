/* GENERATED: MD3 Platinum Recovery - DO NOT EDIT MANUALLY */

// MD3 Compliant - M3SurfaceCard component with layered theme destructuring
import React, { useState } from 'react';
import { useTheme } from '../../theme/theme';

interface M3SurfaceCardProps {
  children: React.ReactNode;
  variant?: 'low' | 'high'; // For opacity variations
  interactive?: boolean; // For hover states
  glass?: boolean; // For glass effects
  expressive?: boolean; // For expressive styling
  color?: 'primary' | 'secondary' | 'tertiary' | 'surface' | 'surfaceVariant';
  onClick?: () => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  role?: string;
  tabIndex?: number;
  'aria-label'?: string;
  style?: React.CSSProperties; // MD3 compatibility shim
}

/**
 * M3SurfaceCard - Base component for standardized surface styling.
 * Supports various variants for different use cases.
 */
const M3SurfaceCard: React.FC<M3SurfaceCardProps> = ({
  children,
  variant = 'low',
  interactive = false,
  glass = false,
  expressive = false,
  color = 'surface',
  onClick,
  onKeyDown,
  role,
  tabIndex,
  'aria-label': ariaLabel,
  // elevation prop removed (was unused)
  style,
}) => {
  const [hovered, setHovered] = useState(false);
  const { layers } = useTheme();
  const themeColor = layers.sys.colors;
  const shape = layers.ref.shape;
  const motion = layers.motion;

  const colorTokens: Record<string, { bg: string; fg: string }> = {
    primary: { bg: themeColor.primaryContainer, fg: themeColor.onPrimaryContainer },
    secondary: { bg: themeColor.secondaryContainer, fg: themeColor.onSecondaryContainer },
    tertiary: { bg: themeColor.tertiary, fg: themeColor.onTertiary },
    surface: { bg: themeColor.surfaceContainerHigh, fg: themeColor.onSurface },
    surfaceVariant: { bg: themeColor.surfaceContainerLow, fg: themeColor.onSurfaceVariant }
  };

  const palette = colorTokens[color];

  const baseStyle: React.CSSProperties = {
    border: `var(--md-sys-border-width-normal) solid ${themeColor.outlineVariant}`,
    borderRadius: shape.large,
    position: expressive ? ('relative' as React.CSSProperties['position']) : undefined,
    overflow: expressive ? 'hidden' : undefined,
    backdropFilter: glass ? 'blur(var(--md-sys-blur-large))' : undefined,
    WebkitBackdropFilter: glass ? 'blur(var(--md-sys-blur-large))' : undefined, // Safari support
  };

  const variantStyle = variant === 'low'
    ? { backgroundColor: glass ? undefined : palette.bg, opacity: 0.5 }
    : { backgroundColor: glass ? undefined : palette.bg, opacity: 0.5 };

  const interactiveStyle = interactive ? {
    transition: `background-color ${motion.duration.short2} ${motion.easing.standard}`,
    cursor: onClick ? 'pointer' : undefined,
    backgroundColor: hovered ? themeColor.surfaceContainerLow : (glass ? themeColor.surface : palette.bg),
    opacity: glass && hovered ? 0.1 : undefined
  } : {};

  const glassStyle = glass ? {
    backgroundColor: themeColor.surface,
    opacity: 0.1,
  } : {};

  const combinedStyle = {
    ...baseStyle,
    ...variantStyle,
    ...interactiveStyle,
    ...glassStyle,
    color: palette.fg,
    ...style,
  };

  return (
    <div
      style={combinedStyle}
      onMouseEnter={() => interactive && setHovered(true)}
      onMouseLeave={() => interactive && setHovered(false)}
      onClick={onClick}
      onKeyDown={onKeyDown}
      role={role}
      tabIndex={tabIndex}
      aria-label={ariaLabel}
      // elevation prop intentionally ignored for MD3 compatibility
    >
      {children}
    </div>
  );
};

export default M3SurfaceCard;










// TODO: Add Playwright snapshot test and link to CHECKLIST.md phase X
