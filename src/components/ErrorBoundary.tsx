import React, { Component, ErrorInfo, ReactNode } from 'react';
import { useUIStore } from '../stores/useUIStore';

interface ErrorBoundaryProps {
	children: ReactNode;
}

interface ErrorBoundaryState {
	hasError: boolean;
	error?: Error;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
	constructor(props: ErrorBoundaryProps) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError(error: Error): ErrorBoundaryState {
		return { hasError: true, error };
	}

	componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
		console.error('ErrorBoundary caught an error:', error, errorInfo);

		// In a real app, you might want to send this to an error reporting service
		// For now, we'll just log it and show a user-friendly message
	}

	render(): React.ReactElement {
		if (this.state.hasError) {
			return <ErrorFallback error={this.state.error} />;
		}

		return this.props.children;
	}
}

// Separate component to use hooks
const ErrorFallback: React.FC<{ error?: Error }> = ({ error }) => {
	const { showToast } = useUIStore(state => ({ showToast: state.actions.showToast }));

	React.useEffect(() => {
		showToast(
			"Si è verificato un errore imprevisto. L'applicazione verrà ricaricata.",
			"error"
		);

		// Auto-reload after a short delay to give user time to see the message
		const timer = setTimeout(() => {
			window.location.reload();
		}, 3000);

		return () => clearTimeout(timer);
	}, [showToast]);

	return (
		<div className="min-h-screen flex items-center justify-center bg-surface p-6">
			<div className="max-w-md w-full bg-surface-container-high rounded-3xl p-8 shadow-xl border border-outline-variant/20 text-center">
				<div className="w-16 h-16 bg-error-container rounded-full flex items-center justify-center mx-auto mb-6">
					<span className="material-symbols-outlined text-3xl text-on-error-container">error</span>
				</div>

				<h2 className="m3-headline-small font-black text-on-surface mb-8">
					Oops! Qualcosa è andato storto
				</h2>

				<p className="m3-body-large text-on-surface-variant mb-6">
					Si è verificato un errore imprevisto nell'applicazione.
					La pagina verrà ricaricata automaticamente tra pochi secondi.
				</p>

				<div className="flex items-center justify-center gap-8 text-sm text-on-surface-variant">
					<span className="material-symbols-outlined animate-spin">refresh</span>
					<span>Ricaricamento in corso...</span>
				</div>

				{process.env.NODE_ENV === 'development' && error && (
					<details className="mt-6 text-left">
						<summary className="cursor-pointer text-sm font-medium text-on-surface-variant hover:text-on-surface">
							Dettagli errore (solo in sviluppo)
						</summary>
						<pre className="mt-4 p-6 bg-surface-container rounded-lg text-xs overflow-auto max-h-32 text-on-surface-variant">
							{error.stack}
						</pre>
					</details>
				)}
			</div>
		</div>
	);
};

export { ErrorBoundary };
export default ErrorBoundary;

