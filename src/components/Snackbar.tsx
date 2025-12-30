
import React, { useEffect } from 'react';
import { useUIStore } from '../stores/useUIStore';

const SNACKBAR_COLORS = {
  success: {
    bg: 'var(--sys-primary)',
    color: 'var(--sys-on-primary)'
  },
  error: {
    bg: 'var(--sys-error)',
    color: 'var(--sys-on-error)'
  },
  info: {
    bg: 'var(--sys-surface-container-highest)',
    color: 'var(--sys-on-surface)'
  }
};


const Snackbar: React.FC = () => {
  const { toast, clearToast } = useUIStore(state => ({
    toast: state.modals.toast,
    clearToast: state.modals.clearToast
  }));

  useEffect(() => {
    if (toast.visible && clearToast) {
      const timeout = setTimeout(() => clearToast(), 3500);
      return () => clearTimeout(timeout);
    }
  }, [toast.visible, clearToast]);

  if (!toast.visible) return null;
  const { bg, color } = SNACKBAR_COLORS[toast.type] || SNACKBAR_COLORS.info;

  return (
    <div
      className="m3-snackbar"
      role="status"
      aria-live="polite"
      tabIndex={0}
      style={{ background: bg, color }}
    >
      <span className="material-symbols-outlined mr-2" aria-hidden="true">
        {toast.type === 'success' ? 'check_circle' : toast.type === 'error' ? 'error' : 'info'}
      </span>
      <span>{toast.message}</span>
      <button
        className="snackbar-close-btn"
        onClick={clearToast}
        aria-label="Chiudi notifica"
        disabled={!clearToast}
      >
        <span className="material-symbols-outlined">close</span>
      </button>
      <style>{`
        .m3-snackbar {
          position: fixed;
          left: 50%;
          bottom: 32px;
          transform: translateX(-50%);
          min-width: 220px;
          max-width: 90vw;
          padding: 0.9rem 1.5rem 0.9rem 1.1rem;
          border-radius: var(--md-corner-16); /* MD3 fix */
          box-shadow: var(--md-elevation-2); /* MD3 fix */
          display: flex;
          align-items: center;
          gap: 0.7rem;
          font-size: 1rem;
          font-weight: 600;
          z-index: 2000;
          animation: snackbar-in 0.22s cubic-bezier(0.34,1.56,0.64,1) both;
        }
        .snackbar-close-btn {
          background: none;
          border: none;
          color: inherit;
          font-size: 1.3rem;
          margin-left: 0.5rem;
          border-radius: 50%;
          cursor: pointer;
          padding: 0.2rem;
          transition: background 0.18s;
        }
        .snackbar-close-btn:hover {
          background: rgba(0,0,0,0.07);
        }
        @keyframes snackbar-in {
          from { opacity: 0; transform: translateX(-50%) translateY(30px) scale(0.98); }
          to { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
};

export default Snackbar;
