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
declare const google: any;
declare const gapi: any;
