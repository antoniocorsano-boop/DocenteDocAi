// M3Expressive: LoadingModal - Loading indicator modal with M3 tokens
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
      <M3DialogContent className="loading-modal-content">
        <div className="loading-modal-spinner-container">
          <div className="loading-modal-spinner-ring-outer"></div>
          <div className="loading-modal-spinner-ring-inner"></div>
        </div>
        <p className="m3-title-medium loading-modal-message">{message}</p>
      </M3DialogContent>
    </M3Dialog>
  );
};

export default LoadingModal;


