// LEGACY - MD3 Non-compliant
import React from 'react';
import { useTheme } from '../../theme/theme';

interface M3EmptyStateCardProps {
  children: React.ReactNode;
}

/**
 * M3EmptyStateCard - Base component for empty state containers.
 * Provides consistent styling for "no content" scenarios.
 */
const M3EmptyStateCard: React.FC<M3EmptyStateCardProps> = ({
  children
}) => {
  const { layers } = useTheme();
  const { sys, ref } = layers;

  return (
    <div style={{
      backgroundColor: `color-mix(in srgb, ${sys.color.surfaceVariant} 80%, transparent)`,
      padding: ref.spacing[5],
      borderRadius: ref.shape.corner.extraLarge,
      border: `1px solid color-mix(in srgb, ${sys.color.outlineVariant} 30%, transparent)`,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      minHeight: '100%'
    }}>
      {children}
    </div>
  );
};

export default M3EmptyStateCard;


