import React from 'react';

interface M3SurfaceCardProps {
  children: React.ReactNode;
  className?: string;
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
  className = '',
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
  const baseClasses = 'border rounded-[var(--md-sys-shape-corner-large)]';
  const variantClasses = variant === 'low' ? 'bg-[var(--md-sys-color-surface-container-low)]/50' : 'bg-[var(--md-sys-color-surface-container-high)]/50';
  const interactiveClasses = interactive ? 'hover:bg-[var(--md-sys-color-surface-container-low)] transition-colors' : '';
  const glassClasses = glass ? 'aura-glass backdrop-blur-xl border-white/10' : 'border-[var(--md-sys-color-outline-variant)]/10';
  const expressiveClasses = expressive ? 'relative overflow-hidden' : '';

  const colorTokens: Record<string, { bg: string; fg: string }> = {
    primary: { bg: 'var(--md-sys-color-primary-container)', fg: 'var(--md-sys-color-on-primary-container)' },
    secondary: { bg: 'var(--md-sys-color-secondary-container)', fg: 'var(--sys-on-secondary-container)' },
    tertiary: { bg: 'var(--sys-tertiary-container)', fg: 'var(--sys-on-tertiary-container)' },
    surface: { bg: 'var(--md-sys-color-surface-container-high)', fg: 'var(--md-sys-color-on-surface)' },
    surfaceVariant: { bg: 'var(--md-sys-color-surface-container-low)', fg: 'var(--md-sys-color-on-surface-variant)' }
  };

  const palette = colorTokens[color];

  return (
    <div
      className={`${baseClasses} ${variantClasses} ${interactiveClasses} ${glassClasses} ${expressiveClasses} ${className}`}
      style={{
        backgroundColor: glass ? undefined : palette.bg,
        color: palette.fg,
        borderRadius: 'calc(var(--shape-xl) * var(--sys-radius-multiplier))'
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

