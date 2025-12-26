import React, { useEffect, useRef } from 'react';
import Tooltip from './Tooltip';

export interface DialogProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  ariaLabel?: string;
  width?: string | number;
  maxWidth?: string | number;
}

const Dialog: React.FC<DialogProps> = ({ open, onClose, title, children, actions, ariaLabel, width = '95vw', maxWidth = 420 }) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const lastActiveRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (open) {
      lastActiveRef.current = document.activeElement as HTMLElement | null;
      dialogRef.current?.focus();
    } else {
      lastActiveRef.current?.focus();
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Tab' && dialogRef.current) {
        // Focus trap
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (!e.shiftKey && document.activeElement === last) {
          first.focus();
          e.preventDefault();
        } else if (e.shiftKey && document.activeElement === first) {
          last.focus();
          e.preventDefault();
        }
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="m3-dialog-overlay" role="dialog" aria-modal="true" aria-label={ariaLabel || title || 'Dialog'}>
      <div
        className="m3-dialog surface-container-high elevation-2 rounded-l animate-fade-in"
        ref={dialogRef}
        tabIndex={-1}
        style={{ width, maxWidth }}
      >
        <header className="m3-dialog-header flex items-center gap-2 p-4 border-b">
          {title && <h2 className="m3-title-medium flex-1">{title}</h2>}
          <Tooltip label="Chiudi dialog">
            <button className="m3-dialog-close icon-button" onClick={onClose} aria-label="Chiudi dialog">
              <span className="material-symbols-outlined">close</span>
            </button>
          </Tooltip>
        </header>
        <div className="m3-dialog-content p-4">{children}</div>
        {actions && <footer className="m3-dialog-actions flex gap-2 p-4 border-t">{actions}</footer>}
      </div>
      <style>{`
        .m3-dialog-overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,0.18); z-index: 1200; display: flex; align-items: center; justify-content: center;
        }
        .m3-dialog {
          background: var(--sys-surface, #fff); color: var(--sys-on-surface, #222); border-radius: 1.2rem; box-shadow: 0 8px 32px rgba(0,0,0,0.18); width: 95vw; max-width: 420px; min-height: 120px; display: flex; flex-direction: column; overflow: hidden; outline: none;
          animation: fade-in 0.22s var(--motion-expressive, cubic-bezier(0.34,1.56,0.64,1)) both;
        }
        .m3-dialog-header { border-bottom: 1px solid var(--sys-outline-variant, #eee); }
        .m3-dialog-close { background: none; border: none; cursor: pointer; border-radius: 50%; padding: 0.3rem; transition: background 0.2s; }
        .m3-dialog-close:hover { background: var(--sys-surface-variant, #f5f5f5); }
        .m3-dialog-content { flex: 1; }
        .m3-dialog-actions { border-top: 1px solid var(--sys-outline-variant, #eee); justify-content: flex-end; }
        @media (max-width: 600px) {
          .m3-dialog { width: 100vw; max-width: 100vw; border-radius: 0; box-shadow: none; }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(24px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
};

export default Dialog;
