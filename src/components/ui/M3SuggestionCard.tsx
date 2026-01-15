// LEGACY - MD3 Non-compliant
import React from 'react';
import { useTheme } from '../../theme/theme';

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
  const { layers } = useTheme();
  const { sys, ref } = layers;

  const baseStyles: React.CSSProperties = {
    backgroundColor: `color-mix(in srgb, ${sys.color.surfaceVariant} 80%, transparent)`,
    padding: layers.ref.spacing['6'],
    borderRadius: ref.shape.corner.extraLarge
  };

  const variantStyles: React.CSSProperties = variant === 'active'
    ? {
        borderLeft: `4px solid ${sys.color.primary}`
      }
    : {
        border: `1px solid color-mix(in srgb, ${sys.color.outlineVariant} 30%, transparent)`
      };

  return (
    <div style={{ ...baseStyles, ...variantStyles }}>
      {children}
    </div>
  );
};

export default M3SuggestionCard;






