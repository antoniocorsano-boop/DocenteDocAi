/// <reference types="vite/client" />

// Global declarations for custom window properties and Google API
declare global {
	interface Window {
		aistudio?: {
			hasSelectedApiKey: () => Promise<boolean>;
			openSelectKey: () => Promise<void>;
		};
	}
}
// Google One Tap/Identity Services
declare const google: typeof import('google-one-tap');
declare const gapi: typeof import('gapi-script');
