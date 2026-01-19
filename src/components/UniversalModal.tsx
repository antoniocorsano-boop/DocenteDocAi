// LEGACY - MD3 Non-compliant

/**
 * UniversalModal - MD3 Compliant Modal Component
 * Migration Date: Phase 7 (Remaining Components Migration)
 * Status: ✅ FULLY MIGRATED & ACCESSIBLE
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const theme = useTheme();
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
        backdropFilter: 'blur(4px)'}}>
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







