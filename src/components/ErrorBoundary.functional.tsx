// LEGACY - MD3 Non-compliant
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
    <div style={{ backgroundColor: 'var(--md-sys-color-surface-container-low)', minHeight: "var(--md-sys-viewport-height-full)", display: "flex", alignItems: "center", justifyContent: "center", padding: 'var(--md-sys-spacing-6)'}}>
      <div style={{ borderRadius: 'var(--md-sys-shape-corner-large)', width: "var(--md-sys-percent-100)", backgroundColor: "var(--md-sys-color-surface)", padding: 'var(--md-sys-spacing-8)', border: "1px solid var(--md-sys-color-outline)", textAlign: "center"}}>
        <div style={{ color: 'var(--md-sys-color-on-error-container)', width: 'var(--md-sys-spacing-4)', height: 'var(--md-sys-spacing-4)', backgroundColor: "var(--md-sys-color-error)", borderRadius: 'var(--md-sys-spacing-4)', display: "flex", alignItems: "center", justifyContent: "center", marginLeft: "var(--md-sys-margin-auto)", marginRight: "var(--md-sys-margin-auto)", marginBottom: 'var(--md-sys-spacing-6)'}}>
          <span style={{ color: 'var(--md-sys-color-on-error)' }}>dizzy</span>
        </div>
        <h1 style={{ color: 'var(--md-sys-color-on-primary)', fontWeight: "900", marginBottom: 'var(--md-sys-spacing-2)'}}>Qualcosa è andato storto</h1>
        <p style={{ color: 'var(--md-sys-color-on-surface-variant)', marginBottom: 'var(--md-sys-spacing-6)'}}>
          Si è verificato un errore imprevisto nell'interfaccia. Non preoccuparti, i tuoi dati sono al sicuro nel database locale.
        </p>
        <div style={{ backgroundColor: 'var(--md-sys-color-surface-container-high)', borderRadius: 'var(--md-sys-shape-corner-large)' , padding: 'var(--md-sys-spacing-4)', textAlign: "left", marginBottom: 'var(--md-sys-spacing-6)'}}>
          <p style={{ margin: 'var(--md-sys-spacing-4)' , color: "var(--md-sys-color-error)"}}>{error.toString()}</p>
        </div>
        <div style={{display: "flex", flexDirection: "column", gap: 'var(--md-sys-spacing-3)'}}>
          <button onClick={resetErrorBoundary}  style={{ width: "var(--md-sys-percent-100)", justifyContent: "center" }}>
            <span  style={{ marginRight: "var(--md-sys-spacing-2)" }}>refresh</span> Ricarica App
          </button>
          <button onClick={handleHardReset}  style={{ width: "var(--md-sys-percent-100)", justifyContent: "center" }}>
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








