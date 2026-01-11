import React from 'react';
import { useTheme } from '../../theme/theme';

interface M3ActivityItemProps {
  children: React.ReactNode;
}

/**
 * M3ActivityItem - Base component for recent activity list items.
 * Provides consistent surface styling with hover effects.
 * 
 * Migration Date: Phase 7 (Remaining Components Migration) - useTheme compliance and className removal
 */
const M3ActivityItem: React.FC<M3ActivityItemProps> = ({
  children
}) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const theme = useTheme();
  
  return (
  <div style={{
    padding: 'var(--md-sys-spacing-8)',
    backgroundColor: 'color-mix(in srgb, var(--md-sys-color-surface-container-low) 50%, transparent)',
    border: '1px solid color-mix(in srgb, var(--md-sys-color-outline-variant) 10%, transparent)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 'var(--md-sys-shape-corner-large)',
    transition: 'background-color var(--md-sys-motion-easing-standard) var(--md-sys-motion-duration-short)'
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.backgroundColor = 'var(--md-sys-color-surface-container-low)';
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.backgroundColor = 'color-mix(in srgb, var(--md-sys-color-surface-container-low) 50%, transparent)';
  }}>
    {children}
  </div>
  );
};

export default M3ActivityItem;

