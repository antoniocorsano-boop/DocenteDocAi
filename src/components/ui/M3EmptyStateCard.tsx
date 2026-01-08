import React from 'react';

interface M3EmptyStateCardProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * M3EmptyStateCard - Base component for empty state containers.
 * Provides consistent styling for "no content" scenarios.
 */
const M3EmptyStateCard: React.FC<M3EmptyStateCardProps> = ({
  children,
  className = ''
}) => (
  <div className={`bg-surface-variant/80 p-5 rounded-[var(--md-sys-shape-corner-extra-large)] border border-[var(--md-sys-color-outline-variant)]/30 flex flex-col items-center justify-center text-center min-h-full ${className}`}>
    {children}
  </div>
);

export default M3EmptyStateCard;

