import React from 'react';

interface LoadingModalProps {
  message: string;
}

const LoadingModal: React.FC<LoadingModalProps> = ({ message }) => {
  return (
    <div className="loading-modal-backdrop" role="alert" aria-live="assertive">
      <div className="large-spinner"></div>
      <p className="m3-title-large">{message}</p>
    </div>
  );
};

export default LoadingModal;
