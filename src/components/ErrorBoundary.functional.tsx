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
    <div className="bg-[var(--md-sys-color-surface-container-low)]" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "var(--md-sys-spacing-6)" }}>
      <div className="max-w-md rounded-[var(--md-sys-shape-corner-extra-large)] shadow-[var(--md-sys-elevation-level4)] border-[var(--md-sys-color-outline-variant)]/20 aura-glass" style={{ width: "100%", backgroundColor: "var(--md-sys-color-surface)", padding: "var(--md-sys-spacing-8)", border: "1px solid var(--md-sys-color-outline)", textAlign: "center" }}>
        <div className="text-on-error-container" style={{ width: "4rem", height: "4rem", backgroundColor: "var(--md-sys-color-error-container)", borderRadius: "9999px", display: "flex", alignItems: "center", justifyContent: "center", marginLeft: "auto", marginRight: "auto", marginBottom: "var(--md-sys-spacing-6)" }}>
          <span className="material-symbols-outlined text-4xl">dizzy</span>
        </div>
        <h1 className="text-[var(--md-sys-typescale-headline-small)] font-[var(--md-sys-typescale-headline-small-font)] text-[var(--md-sys-color-on-surface)]" style={{ fontWeight: "900", marginBottom: "var(--md-sys-spacing-2)" }}>Qualcosa è andato storto</h1>
        <p className="text-[var(--md-sys-typescale-body-medium)] font-[var(--md-sys-typescale-body-medium-font)] text-[var(--md-sys-color-on-surface)]-variant" style={{ marginBottom: "var(--md-sys-spacing-6)" }}>
          Si è verificato un errore imprevisto nell'interfaccia. Non preoccuparti, i tuoi dati sono al sicuro nel database locale.
        </p>
        <div className="bg-[var(--md-sys-color-surface-container-high)] rounded-[var(--md-sys-shape-corner-medium)] overflow-hidden" style={{ padding: "var(--md-sys-spacing-4)", textAlign: "left", marginBottom: "var(--md-sys-spacing-6)" }}>
          <p className="m3-label-small font-mono break-all m-0" style={{ color: "var(--md-sys-color-error)" }}>{error.toString()}</p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--md-sys-spacing-3)" }}>
          <button onClick={resetErrorBoundary} className="button button-filled" style={{ width: "100%", justifyContent: "center" }}>
            <span className="material-symbols-outlined" style={{ marginRight: "0.5rem" }}>refresh</span> Ricarica App
          </button>
          <button onClick={handleHardReset} className="button button-text-error" style={{ width: "100%", justifyContent: "center" }}>
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


