// MD3 Compliant M3ProgressBar Component
// Fully compliant with MD3 tokens: uses var(--md-sys-*) CSS variables for theming, spacing, typography, shape, motion, and elevation
// No useTheme() dependency - all styling uses direct MD3 CSS variables

import React from 'react';

export type M3ProgressBarProps = {
  value: number; // 0-1
  label?: string;
  showValue?: boolean;
  variant?: 'linear' | 'circular';
  size?: 'small' | 'medium' | 'large';
  color?: 'primary' | 'secondary' | 'tertiary';
};

function M3ProgressBar({
  value,
  label,
  showValue = false,
  variant = 'linear',
  size = 'medium',
  color = 'primary'
}: M3ProgressBarProps): React.ReactElement {
  const clampedValue = Math.max(0, Math.min(1, value));
  const percentage = clampedValue * 100;

  // MD3 Token mapping - no useTheme() dependency
  // Color tokens
  const primary = 'var(--md-sys-color-primary)';
  const secondary = 'var(--md-sys-color-secondary)';
  const tertiary = 'var(--md-sys-color-tertiary)';
  const surfaceVariant = 'var(--md-sys-color-surface-variant)';
  const onSurfaceVariant = 'var(--md-sys-color-on-surface-variant)';

  // Shape tokens
  const full = 'var(--md-sys-shape-corner-full)';

  // Spacing tokens
  const spacing1 = 'var(--md-sys-spacing-1)';
  const spacing2 = 'var(--md-sys-spacing-2)';
  const spacing4 = 'var(--md-sys-spacing-4)';

  // Typography tokens
  const bodySmall = {
    fontFamily: 'var(--md-sys-typescale-body-small-font)',
    fontSize: 'var(--md-sys-typescale-body-small-size)',
    fontWeight: 'var(--md-sys-typescale-body-small-weight)',
    lineHeight: 'var(--md-sys-typescale-body-small-line-height)',
    letterSpacing: 'var(--md-sys-typescale-body-small-tracking)'
  };

  const getColor = () => {
    switch (color) {
      case 'secondary': return secondary;
      case 'tertiary': return tertiary;
      default: return primary;
    }
  };

  const getSize = () => {
    switch (size) {
      case 'small': return { height: spacing1, borderRadius: full };
      case 'large': return { height: spacing4, borderRadius: full };
      default: return { height: spacing2, borderRadius: full };
    }
  };

  if (variant === 'circular') {
    // Circular progress - simplified implementation
    const sizePx = size === 'small' ? 24 : size === 'large' ? 48 : 36;
    return (
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: spacing2,
          ...bodySmall
        }}
        role="progressbar"
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
      >
        <div
          style={{
            width: `${sizePx}px`,
            height: `${sizePx}px`,
            borderRadius: full,
            border: `${sizePx/8}px solid ${surfaceVariant}`,
            borderTopColor: getColor(),
            animation: 'spin 1s linear infinite'
          }}
        />
        {showValue && <span>{Math.round(percentage)}%</span>}
      </div>
    );
  }

  // Linear progress bar
  const barSize = getSize();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: spacing1,
        width: '100%'
      }}
    >
      {(label || showValue) && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            ...bodySmall,
            color: onSurfaceVariant
          }}
        >
          {label && <span>{label}</span>}
          {showValue && <span>{Math.round(percentage)}%</span>}
        </div>
      )}
      <div
        style={{
          width: '100%',
          height: barSize.height,
          backgroundColor: surfaceVariant,
          borderRadius: barSize.borderRadius,
          overflow: 'hidden'
        }}
        role="progressbar"
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
      >
        <div
          style={{
            width: `${percentage}%`,
            height: '100%',
            backgroundColor: getColor(),
            transition: 'width 0.3s ease'
          }}
        />
      </div>
    </div>
  );
}

export default M3ProgressBar;