import React from 'react';
import { useTheme } from '../../theme/theme';

interface M3EmptyStateCardProps {
  children: React.ReactNode;
}

/**
 * M3EmptyStateCard - Base component for empty state containers.
 * Provides consistent styling for "no content" scenarios.
 * 
 * Migration Date: Phase 7 (Remaining Components Migration) - useTheme compliance and className removal
 */
const M3EmptyStateCard: React.FC<M3EmptyStateCardProps> = ({
  children
}) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const theme = useTheme();
  
  return (
  <div style={{
    backgroundColor: 'color-mix(in srgb, var(--md-sys-color-surface-variant) 80%, transparent)',
    padding: 'var(--md-sys-spacing-5)',
    borderRadius: 'var(--md-sys-shape-corner-extra-large)',
    border: '1px solid color-mix(in srgb, var(--md-sys-color-outline-variant) 30%, transparent)',
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

