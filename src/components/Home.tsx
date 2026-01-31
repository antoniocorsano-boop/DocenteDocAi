/* GENERATED: MD3 Platinum Recovery — DO NOT EDIT MANUALLY */

import React from 'react';
import { M3Typography, M3Button, M3Card } from './ui';

interface HomeProps {
  teacherName?: string;
  onStartDay?: () => void;
  fullWidth?: boolean;
  label?: string;
  onClick?: () => void;
}

export const Home: React.FC<HomeProps> = ({
  teacherName = 'Docente',
  onStartDay,
  fullWidth = true
}) => {
  return (
    <div
      style={{
        width: fullWidth ? '100%' : 'auto',
        padding: 'var(--md-sys-spacing-4)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--md-sys-spacing-4)',
        backgroundColor: 'var(--md-sys-color-surface)',
        color: 'var(--md-sys-color-on-surface)'
      }}
    >
      <M3Typography variant="headline-large">
        Benvenuto, {teacherName}
      </M3Typography>
      <M3Typography variant="body-large">
        Dashboard principale per gestire le tue attività didattiche.
      </M3Typography>
      <M3Card>
        <M3Typography variant="title-medium">Prossima lezione</M3Typography>
        <M3Typography variant="body-medium">Nessuna lezione pianificata.</M3Typography>
      </M3Card>
      <M3Button variant="filled" onClick={onStartDay}>
        Inizia Giornata
      </M3Button>
    </div>
  );
};

// SNAPSHOT_PLACEHOLDER: Home component visual regression baseline
// TODO: Add Playwright snapshot test and link to [CHECKLIST.md](http://_vscodecontentref_/CHECKLIST.md) phase 3
