/* GENERATED: MD3 Platinum Recovery — DO NOT EDIT MANUALLY */

import React from 'react';
import { M3Typography } from './ui';

interface CardProps {
  title?: string;
  content?: string;
  onClick?: () => void;
  fullWidth?: boolean;
  label?: string;
}

export const Card: React.FC<CardProps> = ({
  title = 'Titolo Card',
  content = 'Contenuto della card.',
  onClick,
  fullWidth = true
}) => {
  return (
    <div
      onClick={onClick}
      style={{
        width: fullWidth ? '100%' : 'auto',
        padding: 'var(--md-sys-spacing-4)',
        backgroundColor: 'var(--md-sys-color-surface-container-highest)',
        borderRadius: 'var(--md-sys-shape-corner-medium)',
        border: 'var(--md-sys-border-width-thin) solid var(--md-sys-color-outline-variant)',
        cursor: onClick ? 'pointer' : 'default',
        boxShadow: 'var(--md-sys-elevation-level1)'
      }}
    >
      <M3Typography variant="title-medium" style={{ color: 'var(--md-sys-color-on-surface)' }}>
        {title}
      </M3Typography>
      <M3Typography variant="body-medium" style={{ color: 'var(--md-sys-color-on-surface-variant)', marginTop: 'var(--md-sys-spacing-2)' }}>
        {content}
      </M3Typography>
    </div>
  );
};

// SNAPSHOT_PLACEHOLDER: Card component visual regression baseline
// TODO: Add Playwright snapshot test and link to [CHECKLIST.md](http://_vscodecontentref_/CHECKLIST.md) phase 3
