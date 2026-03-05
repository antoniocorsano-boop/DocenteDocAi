// MD3 Gold Compliant
import React from 'react';
import { M3Typography } from './M3Typography';
import { M3Button } from './M3Button';

interface M3ErrorStateProps {
  title: string;
  description?: string;
  onRetry?: () => void;
  showRetry?: boolean;
  style?: React.CSSProperties;
}

/**
 * M3ErrorState — Error state component following MD3 semantics.
 * Use when an operation fails and recovery is possible.
 */
export const M3ErrorState: React.FC<M3ErrorStateProps> = ({
  title,
  description,
  onRetry,
  showRetry = false,
  style,
}) => (
  <div
    role="alert"
    aria-label={title}
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 'var(--md-sys-spacing-4)',
      padding: 'var(--md-sys-spacing-8)',
      textAlign: 'center',
      backgroundColor: 'var(--md-sys-color-error-container)',
      color: 'var(--md-sys-color-on-error-container)',
      borderRadius: 'var(--md-sys-shape-corner-large)',
      ...style,
    }}
  >
    <span
      className="material-symbols-outlined"
      aria-hidden="true"
      style={{ fontSize: 'var(--icon-size-xl)', color: 'var(--md-sys-color-error)' }}
    >
      error
    </span>
    <M3Typography variant="title-medium" style={{ color: 'var(--md-sys-color-on-error-container)', margin: 0 }}>
      {title}
    </M3Typography>
    {description && (
      <M3Typography variant="body-medium" style={{ color: 'var(--md-sys-color-on-error-container)', margin: 0 }}>
        {description}
      </M3Typography>
    )}
    {showRetry && onRetry && (
      <M3Button variant="tonal" onClick={onRetry}>
        <span className="material-symbols-outlined" aria-hidden="true">refresh</span>
        Riprova
      </M3Button>
    )}
  </div>
);

export default M3ErrorState;
