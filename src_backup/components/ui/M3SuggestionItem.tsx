// LEGACY - MD3 Non-compliant
import React, { useState } from 'react';
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
  const { layers } = useTheme();
  const {
    sys: { color: { surfaceVariant, primary, outlineVariant } },
    ref: { spacing, shape: { corner: { large } } },
    motion: { duration: { short }, easing: { standard } }
  } = layers;
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      style={{backgroundColor: surfaceVariant,
        opacity: isHovered && onClick ? 0.9 : 0.8,
        padding: spacing[4],
        borderRadius: large,
        border: `1px solid ${isHovered && onClick ? primary : outlineVariant}`,
        transition: `border-color ${short} ${standard}`,
        cursor: onClick ? 'pointer' : 'default'}}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default M3SuggestionItem;


