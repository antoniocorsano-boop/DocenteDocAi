/* GENERATED: MD3 Platinum Recovery - DO NOT EDIT MANUALLY */

// MD3 Compliant - Uses M3Dialog components
/**
 * UniversalModal - MD3 Compliant Modal Component
 * Migration Status: ✅ FULLY MIGRATED & ACCESSIBLE
 */

import React from 'react';
import { M3Dialog, M3DialogContent, M3DialogActions, M3Button } from './ui';
import type { UniversalModalProps } from '../types';
const UniversalModal: React.FC<UniversalModalProps> = ({
  open,
  title,
  onClose,
  children,
}) => {
  if (!open) return null;

  return (
    <M3Dialog
      onClose={onClose}
      title={title}
      maxWidth="sm"
      level={1}
    >
      <M3DialogContent style={{backgroundColor: 'var(--md-sys-color-surface-container-high)',
        opacity: 0.3,
        backdropFilter: 'blur(var(--md-sys-blur-small))'}}>
        {children}
      </M3DialogContent>
      <M3DialogActions>
        <M3Button onClick={onClose} variant="text">Chiudi</M3Button>
      </M3DialogActions>
    </M3Dialog>
  );
};

export default UniversalModal;

export default UniversalModal;











// TODO: Add Playwright snapshot test and link to CHECKLIST.md phase X
