// MD3 Compliant - Migrated to direct CSS custom properties
import React, { useState } from 'react';

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
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      style={{
        padding: 'var(--app-spacing-container)',
        backgroundColor: isHovered
          ? 'var(--md-sys-color-surface-container-low)'
          : `color-mix(in srgb, var(--md-sys-color-surface-container-low) var(--md-sys-state-opacity-disabled), transparent)`,
        border: `var(--app-border-normal) solid color-mix(in srgb, var(--md-sys-color-outline-variant) var(--md-sys-state-opacity-disabled), transparent)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: 'var(--md-sys-shape-corner-large)',
        transition: `background-color var(--app-motion-quick) var(--app-easing-standard)`
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
    </div>
  );
};

export default M3ActivityItem;







