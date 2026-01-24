// LEGACY - MD3 Non-compliant
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
  const { layers } = useTheme();
  const { sys, ref, motion } = layers;

  const colorTokens: Record<string, { bg: string; fg: string }> = {
    primary: { bg: sys.color.primaryContainer, fg: sys.color.onPrimaryContainer },
    secondary: { bg: sys.color.secondaryContainer, fg: sys.color.onSecondaryContainer },
    tertiary: { bg: sys.color.tertiaryContainer, fg: sys.color.onTertiaryContainer },
    surface: { bg: sys.color.surfaceContainerHigh, fg: sys.color.onSurface },
    surfaceVariant: { bg: sys.color.surfaceContainerLow, fg: sys.color.onSurfaceVariant }
  };

  const palette = colorTokens[color];

  const baseStyle = {
    border: `1px solid ${sys.color.outlineVariant}`,
    borderRadius: ref.shape.corner.large,
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
    backgroundColor: hovered ? sys.color.surfaceContainerLow : (glass ? sys.color.surface : palette.bg),
    opacity: glass && hovered ? 0.1 : undefined
  } : {};

  const glassStyle = glass ? {
    backgroundColor: sys.color.surface,
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


