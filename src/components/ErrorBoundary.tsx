// MD3 Gold Compliant
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Typography } from '@mui/material';
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
        console.error('ErrorBoundary: Full error stack:', error.stack);
		// For now, we'll just log it and show a user-friendly message
	}

	render(): ReactNode {
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
		<div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-4)' }}>
			<div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-4)' }}>
				<div style={{ display: 'flex', alignItems: 'center', gap: 'var(--md-sys-spacing-3)' }}>
					<span className="material-symbols-outlined">error</span>
				</div>

				<Typography variant="h6" component="h2">
					Oops! Qualcosa è andato storto
				</Typography>

				<Typography variant="body2" component="p">
					Si è verificato un errore imprevisto nell'applicazione.
					La pagina verrà ricaricata automaticamente tra pochi secondi.
				</Typography>

				<div style={{ display: 'flex', alignItems: 'center', gap: 'var(--md-sys-spacing-3)' }}>
					<span className="material-symbols-outlined">refresh</span>
					<Typography variant="body2" component="span">Ricaricamento in corso...</Typography>
				</div>

				{process.env.NODE_ENV === 'development' && error && (
					<details>
						<summary>
							Dettagli errore (solo in sviluppo)
						</summary>
						<pre >
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

