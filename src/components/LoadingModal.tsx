import React from 'react';
import { M3Dialog, M3DialogContent } from './ui';

interface LoadingModalProps {
  message: string;
}

const LoadingModal: React.FC<LoadingModalProps> = ({ message }) => {
  return (
    <M3Dialog
      onClose={() => {}}
      maxWidth="xs"
      level={5}
      hideCloseButton
      hideBackdrop={true}
    >
      <M3DialogContent className="flex flex-col items-center justify-center py-8 bg-[var(--md-sys-color-surface-container-high)]/30 backdrop-blur-sm">
        <div className="relative w-16 h-16 mb-6">
          <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="m3-title-medium text-center animate-pulse">{message}</p>
      </M3DialogContent>
    </M3Dialog>
  );
};

export default LoadingModal;
