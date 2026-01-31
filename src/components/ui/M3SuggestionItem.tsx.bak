// MD3 Compliant - M3SuggestionItem component with layered theme destructuring
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
  const { layers: { sys: { color }, ref: { spacing, shape }, motion } } = useTheme();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      style={{backgroundColor: color.surfaceVariant,
        opacity: isHovered && onClick ? 0.9 : 0.8,
        padding: spacing[4],
        borderRadius: shape.corner.large,
        border: `var(--app-border-normal) solid ${isHovered && onClick ? color.primary : color.outlineVariant}`,
        transition: `border-color ${motion.duration.short} ${motion.easing.standard}`,
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







