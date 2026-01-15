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
    <div style={{ backgroundColor:  layers.sys.color.surfaceContainerLow }} style={{minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: layers.ref.spacing['6']}}>
      <div style={{ borderRadius: layers.ref.shape.corner.large }} style={{width: "100%", backgroundColor: "layers.sys.color.surface", padding: layers.ref.spacing['8'], border: "1px solid layers.sys.color.outline", textAlign: "center"}}>
        <div style={{ color: sys.colors.on-error-container }} style={{width: layers.ref.spacing['4'], height: layers.ref.spacing['4'], backgroundColor: "layers.sys.color.error-container", borderRadius: layers.ref.spacing['4'], display: "flex", alignItems: "center", justifyContent: "center", marginLeft: "auto", marginRight: "auto", marginBottom: layers.ref.spacing['6']}}>
          <span style={{ color: sys.colors.4xl }}>dizzy</span>
        </div>
        <h1 style={{ color: sys.colors.[var(--md-sys-typescale-headline-small)], color:  layers.sys.color.onPrimary }} style={{fontWeight: "900", marginBottom: layers.ref.spacing['2']}}>Qualcosa è andato storto</h1>
        <p style={{ color: sys.colors.[var(--md-sys-typescale-body-medium)], color:  layers.sys.color.onSurfaceVariant }} style={{marginBottom: layers.ref.spacing['6']}}>
          Si è verificato un errore imprevisto nell'interfaccia. Non preoccuparti, i tuoi dati sono al sicuro nel database locale.
        </p>
        <div style={{ backgroundColor:  layers.sys.color.surfaceContainerHigh, borderRadius: layers.ref.shape.corner.large }} style={{padding: layers.ref.spacing['4'], textAlign: "left", marginBottom: layers.ref.spacing['6']}}>
          <p style={{ margin: layers.ref.spacing['4'] }} style={{color: "layers.sys.color.error"}}>{error.toString()}</p>
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







