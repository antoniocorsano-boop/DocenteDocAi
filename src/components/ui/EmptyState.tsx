// MD3 Gold Compliant
// Component per stati vuoti con call-to-action
// Audit: febbraio 2026

import React from 'react';
import { M3Surface, M3Typography } from './index';
import { M3Button } from '../M3Button';

interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  illustration?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  illustration
}) => {
  return (
    <M3Surface
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--md-sys-spacing-8)',
        gap: 'var(--md-sys-spacing-4)',
        minHeight: 'var(--md-sys-spacing-14)',
        textAlign: 'center',
        borderRadius: 'var(--md-sys-spacing-3)',
        background: 'var(--md-sys-color-surface-variant)'
      }}
    >
      {/* Icona grande o illustrazione custom */}
      {illustration || (
        <span
          className="material-symbols-outlined"
          aria-hidden="true"
          style={{
            fontSize: 'var(--icon-size-hero)',
            color: 'var(--md-sys-color-primary)',
            opacity: 'var(--md-sys-state-opacity-secondary)'
          }}
        >
          {icon}
        </span>
      )}
      
      {/* Titolo principale */}
      <M3Typography
        variant="headline-small"
        style={{
          color: 'var(--md-sys-color-on-surface)',
          fontWeight: 'var(--md-sys-typescale-weight-semibold)'
        }}
      >
        {title}
      </M3Typography>
      
      {/* Descrizione */}
      <M3Typography
        variant="body-large"
        style={{
          color: 'var(--md-sys-color-on-surface-variant)',
          maxWidth: 'var(--md-sys-spacing-16)'
        }}
      >
        {description}
      </M3Typography>
      
      {/* Call to Action */}
      {actionLabel && onAction && (
        <M3Button
          variant="filled"
          onClick={onAction}
          style={{ marginTop: 'var(--md-sys-spacing-2)' }}
        >
          {actionLabel}
        </M3Button>
      )}
    </M3Surface>
  );
};

export default EmptyState;
