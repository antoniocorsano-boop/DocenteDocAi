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
}) => {
  const [hovered, setHovered] = useState(false);
  const { layers: { sys: { color: themeColor }, ref: { shape }, motion } } = useTheme();

  const colorTokens: Record<string, { bg: string; fg: string }> = {
    primary: { bg: themeColor.primaryContainer, fg: themeColor.onPrimaryContainer },
    secondary: { bg: themeColor.secondaryContainer, fg: themeColor.onSecondaryContainer },
    tertiary: { bg: themeColor.tertiaryContainer, fg: themeColor.onTertiaryContainer },
    surface: { bg: themeColor.surfaceContainerHigh, fg: themeColor.onSurface },
    surfaceVariant: { bg: themeColor.surfaceContainerLow, fg: themeColor.onSurfaceVariant }
  };

  const palette = colorTokens[color];

  const baseStyle = {
    border: `1px solid ${themeColor.outlineVariant}`,
    borderRadius: shape.corner.large,
    position: expressive ? 'relative' : undefined,
    overflow: expressive ? 'hidden' : undefined,
    backdropFilter: glass ? 'blur(16px)' : undefined,
    WebkitBackdropFilter: glass ? 'blur(16px)' : undefined, // Safari support
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
    >
      {children}
    </div>
  );
};

export default M3SurfaceCard;






