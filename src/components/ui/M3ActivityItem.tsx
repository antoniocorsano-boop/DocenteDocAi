import React from 'react';

interface M3ActivityItemProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * M3ActivityItem - Base component for recent activity list items.
 * Provides consistent surface styling with hover effects.
 */
const M3ActivityItem: React.FC<M3ActivityItemProps> = ({
  children,
  className = ''
}) => (
  <div className={`p-8 bg-surface-container-low/50 border border-outline-variant/10 flex items-center justify-between group/item hover:bg-surface-container-low transition-colors rounded-2xl ${className}`}>
    {children}
  </div>
);

export default M3ActivityItem;