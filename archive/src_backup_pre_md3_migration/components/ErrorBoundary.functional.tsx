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
  const { layers } = useTheme();
    if (window.confirm("Questo cancellerà la cache locale per ripristinare l'app. I dati salvati su Drive sono al sicuro. Continuare?")) {
      localStorage.clear();
      window.location.reload();
    }
  };
  return (
    <div style={{ backgroundColor: sys.colors.[var(--md-sys-color-surface-container-low)] }} style={{minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: layers.ref.spacing['6']}}>
      <div style={{ borderRadius: ref.shape[] }} style={{width: "100%", backgroundColor: "layers.sys.colors.surface", padding: layers.ref.spacing['8'], border: "1px solid layers.sys.colors.outline", textAlign: "center"}}>
        <div style={{ color: sys.colors.on-error-container }} style={{width: ref.spacing[64], height: ref.spacing[64], backgroundColor: "layers.sys.colors.error-container", borderRadius: ref.spacing[9999], display: "flex", alignItems: "center", justifyContent: "center", marginLeft: "auto", marginRight: "auto", marginBottom: layers.ref.spacing['6']}}>
          <span style={{ color: sys.colors.4xl }}>dizzy</span>
        </div>
        <h1 style={{ color: sys.colors.[var(--md-sys-typescale-headline-small)], color: sys.colors.[var(--md-sys-color-on-surface)] }} style={{fontWeight: "900", marginBottom: layers.ref.spacing['2']}}>Qualcosa è andato storto</h1>
        <p style={{ color: sys.colors.[var(--md-sys-typescale-body-medium)], color: sys.colors.[var(--md-sys-color-on-surface)]-variant }} style={{marginBottom: layers.ref.spacing['6']}}>
          Si è verificato un errore imprevisto nell'interfaccia. Non preoccuparti, i tuoi dati sono al sicuro nel database locale.
        </p>
        <div style={{ backgroundColor: sys.colors.[var(--md-sys-color-surface-container-high)], borderRadius: ref.shape[] }} style={{padding: layers.ref.spacing['4'], textAlign: "left", marginBottom: layers.ref.spacing['6']}}>
          <p style={{ margin: ref.spacing[0] }} style={{color: "layers.sys.colors.error"}}>{error.toString()}</p>
        </div>
        <div style={{display: "flex", flexDirection: "column", gap: layers.ref.spacing['3']}}>
          <button onClick={resetErrorBoundary}  style={{ width: "100%", justifyContent: "center" }}>
            <span  style={{ marginRight: "0.5rem" }}>refresh</span> Ricarica App
          </button>
          <button onClick={handleHardReset}  style={{ width: "100%", justifyContent: "center" }}>
            Reset Totale (Emergenza)
          </button>
        </div>
      </div>
    </div>
  );
};

// Modern ErrorBoundary using react-error-boundary (recommended for functional React)
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';
import { useTheme } from '../theme/theme';

const ErrorBoundary: React.FC<Props> = ({ children }) => {
  return (
    <ReactErrorBoundary FallbackComponent={ErrorFallback}>
      {children}
    </ReactErrorBoundary>
  );
};

export default ErrorBoundary;



