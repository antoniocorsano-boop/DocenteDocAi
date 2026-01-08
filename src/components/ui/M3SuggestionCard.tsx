import React from 'react';

interface M3SuggestionCardProps {
  children: React.ReactNode;
  variant?: 'active' | 'empty';
  className?: string;
}

/**
 * M3SuggestionCard - Base component for AI suggestion containers.
 * Supports active (with accent border) and empty variants.
 */
const M3SuggestionCard: React.FC<M3SuggestionCardProps> = ({
  children,
  variant = 'active',
  className = ''
}) => {
  const baseClasses = 'bg-surface-variant/80 p-5 rounded-[var(--md-sys-shape-corner-extra-large)]';
  const variantClasses = variant === 'active'
    ? 'border-l-4 border-primary'
    : 'border border-[var(--md-sys-color-outline-variant)]/30';

  return (
    <div className={`${baseClasses} ${variantClasses} ${className}`}>
      {children}
    </div>
  );
};

export default M3SuggestionCard;