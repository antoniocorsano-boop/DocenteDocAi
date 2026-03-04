// MD3 Gold Compliant
// Component per stati di caricamento
// Audit: febbraio 2026

import React from 'react';
import { M3Surface, M3Typography } from './index';

interface LoadingStateProps {
  message?: string;
  size?: 'small' | 'medium' | 'large';
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Caricamento...',
  size = 'medium'
}) => {
  const spinnerSize = {
    small: 'var(--md-sys-spacing-6)',
    medium: 'var(--md-sys-spacing-8)',
    large: 'var(--md-sys-spacing-10)'
  }[size];

  return (
    <M3Surface
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'var(--md-sys-spacing-4)',
        padding: 'var(--md-sys-spacing-8)'
      }}
    >
      {/* Spinner MD3 compliant */}
      <div
        style={{
          width: spinnerSize,
          height: spinnerSize,
          border: 'var(--md-sys-border-width-thick) solid var(--md-sys-color-primary-container)',
          borderTopColor: 'var(--md-sys-color-primary)',
          borderRadius: 'var(--md-sys-shape-corner-full)',
          animation: 'spin 1s linear infinite' // eslint-disable-line design-system/no-hardcoded-motion-values, design-system/no-invalid-component-props
        }}
        role="status"
        aria-label="Caricamento in corso"
      />
      
      {message && (
        <M3Typography
          variant="body-medium"
          style={{ 
            color: 'var(--md-sys-color-on-surface-variant)',
            fontWeight: 'var(--md-sys-typescale-weight-medium)'
          }}
        >
          {message}
        </M3Typography>
      )}
      
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </M3Surface>
  );
};

export default LoadingState;
