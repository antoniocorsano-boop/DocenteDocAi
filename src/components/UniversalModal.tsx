
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
      <M3DialogContent className="bg-[var(--md-sys-color-surface-container-high)]/30 backdrop-blur-sm">
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
