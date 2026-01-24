// LEGACY - MD3 Non-compliant
import React, { useState } from 'react';
import { useTheme } from '../../theme/theme';

interface M3ActivityItemProps {
  children: React.ReactNode;
}

/**
 * M3ActivityItem - Base component for recent activity list items.
 * Provides consistent surface styling with hover effects.
 */
const M3ActivityItem: React.FC<M3ActivityItemProps> = ({
  children
}) => {
  const { layers } = useTheme();
  const { sys, ref, motion } = layers;
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      style={{
        padding: ref.spacing[8],
        backgroundColor: isHovered
          ? sys.color.surfaceContainerLow
          : `color-mix(in srgb, ${sys.color.surfaceContainerLow} 50%, transparent)`,
        border: `1px solid color-mix(in srgb, ${sys.color.outlineVariant} 10%, transparent)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: ref.shape.corner.large,
        transition: `background-color ${motion.duration.short} ${motion.easing.standard}`
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
    </div>
  );
};

export default M3ActivityItem;


