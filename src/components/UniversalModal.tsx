import React, { useEffect, useRef } from 'react';

interface UniversalModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

const UniversalModal: React.FC<UniversalModalProps> = ({
  open,
  title,
  onClose,
  children,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    if (open && modalRef.current) {
      modalRef.current.focus();
    }
  }, [open]);

  if (!open) return null;

  return (
    <div
      aria-modal="true"
      role="dialog"
      tabIndex={-1}
      ref={modalRef}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.32)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        role="document"
        style={{
          background: 'var(--sys-surface)',
          borderRadius: 12,
          minWidth: 320,
          maxWidth: 420,
          width: '90vw',
          boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
          padding: 28,
          outline: 'none',
        }}
        onClick={e => e.stopPropagation()}
      >
        <h2 style={{ margin: 0, marginBottom: 16, color: 'var(--sys-primary)' }}>{title}</h2>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default UniversalModal;
