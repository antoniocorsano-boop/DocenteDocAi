// ✅ MD3 Native Compliant - Migrated from useTheme to direct MD3 tokens
import React from 'react';

interface M3SuggestionCardProps {
  children: React.ReactNode;
  variant?: 'active' | 'empty';
}

/**
 * M3SuggestionCard - Base component for AI suggestion containers.
 * Supports active (with accent border) and empty variants.
 */
const M3SuggestionCard: React.FC<M3SuggestionCardProps> = ({
  children,
  variant = 'active'
}) => {
  const baseStyles: React.CSSProperties = {
    backgroundColor: `color-mix(in srgb, var(--md-sys-color-surface-variant) var(--md-sys-percent-80), transparent)`,
    padding: 'var(--md-sys-spacing-6)',
    borderRadius: 'var(--md-sys-shape-corner-extra-large)'
  };

  const variantStyles: React.CSSProperties = variant === 'active'
    ? {
        borderLeft: `var(--md-sys-spacing-1) solid var(--md-sys-color-primary)`
      }
    : {
        border: `var(--md-sys-border-width-normal) solid color-mix(in srgb, var(--md-sys-color-outline-variant) var(--md-sys-percent-30), transparent)`
      };

  return (
    <div style={{ ...baseStyles, ...variantStyles }}>
      {children}
    </div>
  );
};

export default M3SuggestionCard;







