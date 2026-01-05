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
    <div className="min-h-screen flex items-center justify-center bg-surface-container-low p-6">
      <div className="max-w-md w-full bg-surface p-8 rounded-3xl shadow-2xl border border-outline-variant/20 text-center aura-glass">
        <div className="w-16 h-16 bg-error-container text-on-error-container rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="material-symbols-outlined text-4xl">dizzy</span>
        </div>
        <h1 className="m3-headline-small font-black text-on-surface mb-2">Qualcosa è andato storto</h1>
        <p className="m3-body-medium text-on-surface-variant mb-6">
          Si è verificato un errore imprevisto nell'interfaccia. Non preoccuparti, i tuoi dati sono al sicuro nel database locale.
        </p>
        <div className="bg-surface-container-high p-4 rounded-xl text-left mb-6 overflow-hidden">
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
