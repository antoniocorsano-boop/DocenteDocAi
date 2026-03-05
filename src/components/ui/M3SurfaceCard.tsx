// MD3 Gold Compliant
import React, { useState } from 'react';

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

const colorTokens: Record<string, { bg: string; fg: string }> = {
  primary:       { bg: 'var(--md-sys-color-primary-container)',   fg: 'var(--md-sys-color-on-primary-container)' },
  secondary:     { bg: 'var(--md-sys-color-secondary-container)', fg: 'var(--md-sys-color-on-secondary-container)' },
  tertiary:      { bg: 'var(--md-sys-color-tertiary)',            fg: 'var(--md-sys-color-on-tertiary)' },
  surface:       { bg: 'var(--md-sys-color-surface-container-high)', fg: 'var(--md-sys-color-on-surface)' },
  surfaceVariant:{ bg: 'var(--md-sys-color-surface-container-low)',  fg: 'var(--md-sys-color-on-surface-variant)' },
};

/**
 * M3SurfaceCard - Base component for standardized surface styling.
 * Supports various variants for different use cases.
 */
const M3SurfaceCard: React.FC<M3SurfaceCardProps> = ({
  children,
  interactive = false,
  glass = false,
  expressive = false,
  color = 'surface',
  onClick,
  onKeyDown,
  role,
  tabIndex,
  'aria-label': ariaLabel,
  style,
}) => {
  const [hovered, setHovered] = useState(false);
  const palette = colorTokens[color];

  const baseStyle: React.CSSProperties = {
    border: `var(--md-sys-border-width-normal) solid var(--md-sys-color-outline-variant)`,
    borderRadius: 'var(--md-sys-shape-corner-large)',
    position: expressive ? 'relative' : undefined,
    overflow: expressive ? 'hidden' : undefined,
    backdropFilter: glass ? 'blur(var(--md-sys-blur-large))' : undefined,
    WebkitBackdropFilter: glass ? 'blur(var(--md-sys-blur-large))' : undefined,
    backgroundColor: glass ? 'var(--md-sys-color-surface)' : palette.bg,
    color: palette.fg,
  };

  const interactiveStyle: React.CSSProperties = interactive ? {
    transition: `background-color var(--md-sys-motion-duration-short) var(--md-sys-motion-easing-standard)`,
    cursor: onClick ? 'pointer' : undefined,
    backgroundColor: hovered
      ? 'var(--md-sys-color-surface-container-low)'
      : (glass ? 'var(--md-sys-color-surface)' : palette.bg),
    opacity: glass && hovered ? 'var(--md-sys-state-opacity-tint-faint)' : undefined,
  } : {};

  return (
    <div
      style={{ ...baseStyle, ...interactiveStyle, ...style }}
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
