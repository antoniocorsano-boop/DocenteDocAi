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
    <div className="min-h-screen flex items-center justify-center bg-[var(--md-sys-color-surface-container-low)] p-6">
      <div className="max-w-md w-full bg-surface p-8 rounded-[var(--md-sys-shape-corner-extra-large)] shadow-[var(--md-sys-elevation-level4)] border border-[var(--md-sys-color-outline-variant)]/20 text-center aura-glass">
        <div className="w-16 h-16 bg-error-container text-on-error-container rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="material-symbols-outlined text-4xl">dizzy</span>
        </div>
        <h1 className="text-[var(--md-sys-typescale-headline-small)] font-[var(--md-sys-typescale-headline-small-font)] font-black text-[var(--md-sys-color-on-surface)] mb-2">Qualcosa è andato storto</h1>
        <p className="text-[var(--md-sys-typescale-body-medium)] font-[var(--md-sys-typescale-body-medium-font)] text-[var(--md-sys-color-on-surface)]-variant mb-6">
          Si è verificato un errore imprevisto nell'interfaccia. Non preoccuparti, i tuoi dati sono al sicuro nel database locale.
        </p>
        <div className="bg-[var(--md-sys-color-surface-container-high)] p-4 rounded-[var(--md-sys-shape-corner-medium)] text-left mb-6 overflow-hidden">
          <p className="m3-label-small font-mono text-error break-all m-0">{error.toString()}</p>
        </div>
        <div className="flex flex-col gap-3">
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


