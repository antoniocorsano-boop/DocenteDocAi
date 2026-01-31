/* GENERATED: MD3 Platinum Recovery — DO NOT EDIT MANUALLY */

import React from 'react';
import { M3Typography, M3Button } from './ui';

interface HeaderProps {
  teacherName?: string;
  onLogout?: () => void;
  fullWidth?: boolean;
  label?: string;
  onClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  teacherName = 'Docente',
  onLogout,
  fullWidth = true
}) => {
  return (
    <header
      style={{
        width: fullWidth ? '100%' : 'auto',
        padding: 'var(--md-sys-spacing-4)',
        backgroundColor: 'var(--md-sys-color-surface)',
        borderBottom: 'var(--md-sys-border-width-thin) solid var(--md-sys-color-outline-variant)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}
    >
      <M3Typography variant="headline-small" style={{ color: 'var(--md-sys-color-on-surface)' }}>
        Benvenuto, {teacherName}
      </M3Typography>
      <M3Button variant="outlined" onClick={onLogout}>
        Logout
      </M3Button>
    </header>
  );
};

// SNAPSHOT_PLACEHOLDER: Header component visual regression baseline
// TODO: Add Playwright snapshot test and link to [CHECKLIST.md](http://_vscodecontentref_/CHECKLIST.md) phase 3
