
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  // Dichiarazione esplicita per soddisfare TypeScript strict mode
  public readonly props: Readonly<Props>;

  public constructor(props: Props) {
    super(props);
    this.props = props;
  }

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  private handleReload = () => {
      window.location.reload();
  }

  private handleHardReset = () => {
      if(window.confirm("Questo cancellerà la cache locale per ripristinare l'app. I dati salvati su Drive sono al sicuro. Continuare?")) {
          localStorage.clear();
          window.location.reload();
      }
  }

  public render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-surface-container-low p-6">
          <div className="max-w-md w-full bg-surface p-8 rounded-3xl shadow-lg border border-outline-variant text-center">
            <div className="w-16 h-16 bg-error-container text-on-error-container rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="material-symbols-outlined text-4xl">dizzy</span>
            </div>
            <h1 className="text-2xl font-bold text-on-surface mb-2">Qualcosa è andato storto</h1>
            <p className="text-on-surface-variant mb-6">
              Si è verificato un errore imprevisto nell'interfaccia. Non preoccuparti, i tuoi dati sono al sicuro nel database locale.
            </p>
            
            <div className="bg-surface-container-high p-3 rounded-lg text-left mb-6 overflow-hidden">
                <p className="text-xs font-mono text-error break-words">
                    {this.state.error?.toString()}
                </p>
            </div>

            <div className="flex flex-col gap-3">
                <button 
                    onClick={this.handleReload}
                    className="button button-filled w-full justify-center"
                >
                    <span className="material-symbols-outlined mr-2">refresh</span> Ricarica App
                </button>
                <button 
                    onClick={this.handleHardReset}
                    className="button button-text-error w-full justify-center"
                >
                    Reset Totale (Emergenza)
                </button>
            </div>
          </div>
        </div>
      );
    }
    const { children } = this.props;
    return children;
  }
}

export default ErrorBoundary;
