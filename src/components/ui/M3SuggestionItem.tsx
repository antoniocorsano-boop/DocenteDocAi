import React from 'react';

interface M3SuggestionItemProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

/**
 * M3SuggestionItem - Base component for individual suggestion items in lists.
 * Includes hover effects and interactive styling.
 */
const M3SuggestionItem: React.FC<M3SuggestionItemProps> = ({
  children,
  className = '',
  onClick
}) => (
  <div
    className={`bg-surface-variant/80 p-4 rounded-2xl border border-outline-variant hover:border-primary/30 group transition-colors ${onClick ? 'cursor-pointer' : ''} ${className}`}
    onClick={onClick}
  >
    {children}
  </div>
);

export default M3SuggestionItem;