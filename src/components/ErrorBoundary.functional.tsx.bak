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
    <div style={{ backgroundColor: 'var(--md-sys-color-surface-container-low)', minHeight: "var(--md-sys-viewport-height-full)", display: "flex", alignItems: "center", justifyContent: "center", padding: 'var(--app-spacing-section)'}}>
      <div style={{ borderRadius: 'var(--md-sys-shape-corner-large)', width: "var(--app-layout-full)", backgroundColor: "var(--app-color-surface)", padding: 'var(--md-sys-spacing-8)', border: "var(--app-border-thin) solid var(--md-sys-color-outline)", textAlign: "center"}}>
        <div style={{ color: 'var(--md-sys-color-on-error-container)', width: 'var(--app-spacing-container)', height: 'var(--app-spacing-container)', backgroundColor: "var(--md-sys-color-error)", borderRadius: 'var(--app-spacing-container)', display: "flex", alignItems: "center", justifyContent: "center", marginLeft: "var(--app-layout-auto)", marginRight: "var(--app-layout-auto)", marginBottom: 'var(--app-spacing-section)'}}>
          <span style={{ color: 'var(--md-sys-color-on-error)' }}>dizzy</span>
        </div>
        <h1 style={{ color: 'var(--app-color-on-primary)', fontWeight: "900", marginBottom: 'var(--app-spacing-component)'}}>Qualcosa è andato storto</h1>
        <p style={{ color: 'var(--app-color-on-surface-variant)', marginBottom: 'var(--app-spacing-section)'}}>
          Si è verificato un errore imprevisto nell'interfaccia. Non preoccuparti, i tuoi dati sono al sicuro nel database locale.
        </p>
        <div style={{ backgroundColor: 'var(--md-sys-color-surface-container-high)', borderRadius: 'var(--md-sys-shape-corner-large)' , padding: 'var(--app-spacing-container)', textAlign: "left", marginBottom: 'var(--app-spacing-section)'}}>
          <p style={{ margin: 'var(--app-spacing-container)' , color: "var(--md-sys-color-error)"}}>{error.toString()}</p>
        </div>
        <div style={{display: "flex", flexDirection: "column", gap: 'var(--app-spacing-element)'}}>
          <button onClick={resetErrorBoundary}  style={{ width: "var(--app-layout-full)", justifyContent: "center" }}>
            <span  style={{ marginRight: "var(--app-spacing-component)" }}>refresh</span> Ricarica App
          </button>
          <button onClick={handleHardReset}  style={{ width: "var(--app-layout-full)", justifyContent: "center" }}>
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








