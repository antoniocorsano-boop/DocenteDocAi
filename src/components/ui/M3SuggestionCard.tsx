import React from 'react';
import { useTheme } from '../../theme/theme';

interface M3SuggestionCardProps {
  children: React.ReactNode;
  variant?: 'active' | 'empty';
}

/**
 * M3SuggestionCard - Base component for AI suggestion containers.
 * Supports active (with accent border) and empty variants.
 * 
 * Migration Date: Phase 7 (Remaining Components Migration) - useTheme compliance and className removal
 */
const M3SuggestionCard: React.FC<M3SuggestionCardProps> = ({
  children,
  variant = 'active'
}) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const theme = useTheme();

  const baseStyles = {
    backgroundColor: 'color-mix(in srgb, var(--md-sys-color-surface-variant) 80%, transparent)',
    padding: 'var(--md-sys-spacing-5)',
    borderRadius: 'var(--md-sys-shape-corner-extra-large)'
  };

  const variantStyles = variant === 'active'
    ? {
        borderLeft: '4px solid var(--md-sys-color-primary)'
      }
    : {
        border: '1px solid color-mix(in srgb, var(--md-sys-color-outline-variant) 30%, transparent)'
      };

  return (
    <div style={{ ...baseStyles, ...variantStyles }}>
      {children}
    </div>
  );
};

export default M3SuggestionCard;

