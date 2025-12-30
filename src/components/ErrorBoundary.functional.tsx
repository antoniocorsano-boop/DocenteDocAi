import React, { ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

/**
 * Functional ErrorBoundary using react-error-boundary for modern React apps.
 * Shows a Material 3 styled fallback UI and reset options.
 */
const ErrorFallback: React.FC<{ error: Error; resetErrorBoundary: () => void }> = ({ error, resetErrorBoundary }) => {
  const handleHardReset = () => {
    if (window.confirm("Questo cancellerà la cache locale per ripristinare l'app. I dati salvati su Drive sono al sicuro. Continuare?")) {
      localStorage.clear();
      window.location.reload();
    }
  };
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--sys-surface-container-low)',
        padding: '1.5rem',
      }}
    >
      <div
        style={{
          maxWidth: '28rem',
          width: '100%',
          background: 'var(--sys-surface)',
          padding: '2rem',
          borderRadius: '1.5rem',
          boxShadow: '0 4px 24px 0 rgba(103,80,164,0.08)',
          border: '1px solid var(--sys-outline-variant)',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            width: '4rem',
            height: '4rem',
            background: 'var(--sys-error-container)',
            color: 'var(--sys-on-error-container)',
            borderRadius: '9999px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '2.5rem' }}>dizzy</span>
        </div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--sys-on-surface)', marginBottom: '0.5rem' }}>Qualcosa è andato storto</h1>
        <p style={{ color: 'var(--sys-on-surface-variant)', marginBottom: '1.5rem' }}>
          Si è verificato un errore imprevisto nell'interfaccia. Non preoccuparti, i tuoi dati sono al sicuro nel database locale.
        </p>
        <div
          style={{
            background: 'var(--sys-surface-container-high)',
            padding: '0.75rem',
            borderRadius: '0.75rem',
            textAlign: 'left',
            marginBottom: '1.5rem',
            overflow: 'hidden',
          }}
        >
          <p style={{ fontSize: '0.8rem', fontFamily: 'Roboto Mono, monospace', color: 'var(--sys-error)', wordBreak: 'break-word', margin: 0 }}>{error.toString()}</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <button onClick={resetErrorBoundary} className="button button-filled w-full justify-center">
            <span className="material-symbols-outlined mr-2">refresh</span> Ricarica App
          </button>
          <button onClick={handleHardReset} className="button button-text-error w-full justify-center">
            Reset Totale (Emergenza)
          </button>
        </div>
      </div>
    </div>
  );
};

// Modern ErrorBoundary using react-error-boundary (recommended for functional React)
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';

const ErrorBoundary: React.FC<Props> = ({ children }) => {
  return (
    <ReactErrorBoundary FallbackComponent={ErrorFallback}>
      {children}
    </ReactErrorBoundary>
  );
};

export default ErrorBoundary;
