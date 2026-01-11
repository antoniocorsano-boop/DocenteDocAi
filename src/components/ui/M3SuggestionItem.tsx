import React from 'react';
import { useTheme } from '../../theme/theme';

interface M3SuggestionItemProps {
  children: React.ReactNode;
  onClick?: () => void;
}

/**
 * M3SuggestionItem - Base component for individual suggestion items in lists.
 * Includes hover effects and interactive styling.
 */
const M3SuggestionItem: React.FC<M3SuggestionItemProps> = ({
  children,
  onClick
}) => {
  const { spacing } = useTheme();

  return (
    <div
      style={{
        backgroundColor: 'var(--md-sys-color-surface-variant)',
        opacity: 0.8,
        padding: spacing[4],
        borderRadius: 'var(--md-sys-shape-corner-large)',
        border: `1px solid var(--md-sys-color-outline-variant)`,
        transition: 'border-color var(--md-sys-motion-duration-short) var(--md-sys-motion-easing-standard)',
        cursor: onClick ? 'pointer' : 'default'
      }}
      onMouseEnter={(e) => {
        if (onClick) {
          e.currentTarget.style.borderColor = 'var(--md-sys-color-primary)';
          e.currentTarget.style.opacity = '0.9';
        }
      }}
      onMouseLeave={(e) => {
        if (onClick) {
          e.currentTarget.style.borderColor = 'var(--md-sys-color-outline-variant)';
          e.currentTarget.style.opacity = '0.8';
        }
      }}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default M3SuggestionItem;

