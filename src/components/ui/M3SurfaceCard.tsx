import React from 'react';
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
  const { motion } = useTheme();

  const colorTokens: Record<string, { bg: string; fg: string }> = {
    primary: { bg: 'var(--md-sys-color-primary-container)', fg: 'var(--md-sys-color-on-primary-container)' },
    secondary: { bg: 'var(--md-sys-color-secondary-container)', fg: 'var(--md-sys-color-on-secondary-container)' },
    tertiary: { bg: 'var(--md-sys-color-tertiary-container)', fg: 'var(--md-sys-color-on-tertiary-container)' },
    surface: { bg: 'var(--md-sys-color-surface-container-high)', fg: 'var(--md-sys-color-on-surface)' },
    surfaceVariant: { bg: 'var(--md-sys-color-surface-container-low)', fg: 'var(--md-sys-color-on-surface-variant)' }
  };

  const palette = colorTokens[color];

  const baseStyle = {
    border: glass ? '1px solid var(--md-sys-color-outline-variant)' : '1px solid var(--md-sys-color-outline-variant)',
    borderRadius: 'var(--md-sys-shape-corner-large)',
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
    cursor: onClick ? 'pointer' : undefined
  } : {};

  const glassStyle = glass ? {
    backgroundColor: 'var(--md-sys-color-surface)',
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
      onMouseEnter={(e) => {
        if (interactive) {
          e.currentTarget.style.backgroundColor = 'var(--md-sys-color-surface-container-low)';
        }
      }}
      onMouseLeave={(e) => {
        if (interactive) {
          e.currentTarget.style.backgroundColor = glass ? 'var(--md-sys-color-surface)' : palette.bg;
          if (glass) e.currentTarget.style.opacity = '0.1';
        }
      }}
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

