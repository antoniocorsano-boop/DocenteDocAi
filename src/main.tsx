// CRITICAL: Import polyfills FIRST, before anything else
import './polyfills';

import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './components/App';
import ErrorBoundary from './components/ErrorBoundary';

// CSS Architecture
import './theme.css';
import './layout.css';
import './components.css';
import './logo.css';
import './modules.css';

/**
 * STORAGE RECOVERY:
 * Rimuoviamo immediatamente dati pesanti legacy se presenti.
 */
(() => {
  try {
    const keys = ['app_state', 'orariodoc_backup'];
    keys.forEach(key => {
      const data = localStorage.getItem(key);
      if (data && data.length > 2 * 1024 * 1024) { 
        localStorage.removeItem(key);
      }
    });
  } catch (e) {}
})();

// PWA Service Worker con gestione Origin Mismatch per AI Studio / Iframe
// Register the service worker only in production builds to avoid dev-time cache/fetch issues
if (import.meta && (import.meta as any).env && (import.meta as any).env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Evitiamo il caricamento del SW se siamo in un dominio di sandbox/iframe non autorizzato per i manifest
    const isSandbox = window.location.hostname.includes('usercontent.goog') || window.self !== window.top;
    if (!isSandbox) {
      navigator.serviceWorker.register('./service-worker.js', { scope: './' })
        .then(() => console.debug('[SW] registered'))
        .catch(err => console.debug('[SW] registration failed', err));
    }
  });
} else {
  // In dev, we intentionally do not register the SW so failed fetches don't block development
  // (We keep the App-level unregister guard as an additional safety net.)
}

// Conditionally load Google Identity and API scripts only in production and when origin is allowed
(function loadGoogleScriptsIfAllowed() {
  try {
    const isProd = import.meta && (import.meta as any).env && (import.meta as any).env.PROD;
    const isDev = import.meta && (import.meta as any).env && (import.meta as any).env.DEV;
    const enableGsiDev = import.meta && (import.meta as any).env && (import.meta as any).env.VITE_ENABLE_GSI_DEV === 'true';
    const gsiClientId = import.meta && (import.meta as any).env && (import.meta as any).env.VITE_GSI_CLIENT_ID;

    // Allow listing for scripts and service worker registration.
    // Use VITE_ALLOWED_HOSTS env var as comma-separated list, fallback to known hosts.
    const envHosts = (import.meta && (import.meta as any).env && (import.meta as any).env.VITE_ALLOWED_HOSTS) || '';
    const allowedHosts = envHosts ? envHosts.split(',').map(s => s.trim()).filter(Boolean) : ['docentedoc.app', 'your-production-domain.example'];
    const host = window.location.hostname;

    const shouldLoadGsi = (isProd && allowedHosts.includes(host)) || (isDev && enableGsiDev && !!gsiClientId);

    if (shouldLoadGsi) {
      const mode = isProd ? 'prod' : 'dev';
      const gsi = document.createElement('script');
      gsi.src = 'https://accounts.google.com/gsi/client';
      gsi.async = true;
      gsi.onload = () => { window.__googleGsiReady = true; console.log(`✅ Google GSI script loaded (${mode})`); };
      document.head.appendChild(gsi);

      const api = document.createElement('script');
      api.src = 'https://apis.google.com/js/api.js';
      api.async = true;
      api.onload = () => { window.__googleApiReady = true; console.log(`✅ Google API script loaded (${mode})`); };
      document.head.appendChild(api);
    } else {
      // Keep flags false in dev to avoid noisy 403s
      window.__googleApiReady = false;
      window.__googleGsiReady = false;
    }
  } catch (e) { console.debug('Google script load gate error', e); }
})();

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error("Root element missing");

const root = createRoot(rootElement);
root.render(
  <ErrorBoundary>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </ErrorBoundary>
);
