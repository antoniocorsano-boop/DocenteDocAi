// MD3 Gold Compliant
import React from 'react';
import { M3Typography } from './M3Typography';

interface M3EmptyStateProps {
  title: string;
  description?: string;
  icon?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

/**
 * M3EmptyState — Empty state component following MD3 semantics.
 * Use when a list, search result, or content area is empty.
 */
export const M3EmptyState: React.FC<M3EmptyStateProps> = ({
  title,
  description,
  icon,
  children,
  style,
}) => (
  <div
    role="status"
    aria-label={title}
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 'var(--md-sys-spacing-4)',
      padding: 'var(--md-sys-spacing-8)',
      textAlign: 'center',
      color: 'var(--md-sys-color-on-surface-variant)',
      ...style,
    }}
  >
    {icon && (
      <span
        className="material-symbols-outlined"
        aria-hidden="true"
        style={{ fontSize: 'var(--icon-size-hero)', color: 'var(--md-sys-color-outline)' }}
      >
        {icon}
      </span>
    )}
    <M3Typography variant="title-medium" style={{ color: 'var(--md-sys-color-on-surface)', margin: 0 }}>
      {title}
    </M3Typography>
    {description && (
      <M3Typography variant="body-medium" style={{ color: 'var(--md-sys-color-on-surface-variant)', margin: 0 }}>
        {description}
      </M3Typography>
    )}
    {children}
  </div>
);

export default M3EmptyState;
