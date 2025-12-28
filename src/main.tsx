// CRITICAL: Import polyfills FIRST, before anything else
import './polyfills';

import React from 'react';
import { createRoot } from 'react-dom/client';
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
  } catch (e) {
    // Intentionally ignore legacy storage cleanup errors
  }
})();

// --- DEBUG: Forza reset storage locale e log errori globali ---
localStorage.clear();
if (typeof window !== 'undefined' && 'indexedDB' in window) {
  indexedDB.deleteDatabase('OrarioDocAI_BackupDB');
  indexedDB.deleteDatabase('OrarioDocAI_Data');
}
window.onerror = (msg, src, line, col, err) => {
  alert('JS ERROR: ' + msg + '\n' + (err?.stack || ''));
  return false;
};
window.onunhandledrejection = (e) => {
  alert('Promise ERROR: ' + (e.reason?.message || e.reason));
  return false;
};

// PWA Service Worker con gestione Origin Mismatch per AI Studio / Iframe
// Register the service worker only when explicitly enabled via env var to avoid
// accidental serving of stale cached assets from edge service workers.
interface ImportMetaEnv {
  // Required by Vite
  BASE_URL: string;
  MODE: string;
  SSR: boolean;
  VITE_GOOGLE_CLIENT_ID: string;
  VITE_GOOGLE_API_KEY: string;

  // Project-specific
  VITE_ENABLE_SW: string;
  VITE_GSI_CLIENT_ID: string;
  VITE_ENABLE_GSI_DEV: string;
  VITE_ALLOWED_HOSTS: string;
  PROD: boolean;
  DEV: boolean;
}

interface ImportMetaTyped extends ImportMeta {
  env: ImportMetaEnv;
}

const enableSW =
  typeof import.meta !== 'undefined' &&
  (import.meta as ImportMetaTyped).env &&
  (import.meta as ImportMetaTyped).env.VITE_ENABLE_SW === 'true';
if (enableSW && 'serviceWorker' in navigator) {
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
  console.debug('[SW] disabled by VITE_ENABLE_SW flag');
}

// Conditionally load Google Identity and API scripts only in production and when origin is allowed
(function loadGoogleScriptsIfAllowed() {
  try {
    const importMetaTyped = import.meta as ImportMetaTyped;
    const isProd = importMetaTyped && importMetaTyped.env && importMetaTyped.env.PROD;
    const isDev = importMetaTyped && importMetaTyped.env && importMetaTyped.env.DEV;
    const enableGsiDev = importMetaTyped && importMetaTyped.env && importMetaTyped.env.VITE_ENABLE_GSI_DEV === 'true';
    const gsiClientId = importMetaTyped && importMetaTyped.env && importMetaTyped.env.VITE_GSI_CLIENT_ID;

    // Allow listing for scripts and service worker registration.
    // Use VITE_ALLOWED_HOSTS env var as comma-separated list, fallback to known hosts.
    const envHosts = (importMetaTyped && importMetaTyped.env && importMetaTyped.env.VITE_ALLOWED_HOSTS) || '';
    const allowedHosts = envHosts ? envHosts.split(',').map((s: string) => s.trim()).filter(Boolean) : ['docentedoc.app', 'your-production-domain.example'];
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

// Ensure Zustand stores are preloaded before importing the App
async function bootstrapApp() {
  try {
    const lazy = await import('./stores/lazyStores');
    await lazy.preloadAllStores();

    // Dynamically import App after stores are ready to avoid initialization races
    const { App } = await import('./components/App');

    root.render(
      <ErrorBoundary>
        <React.StrictMode>
          <App />
        </React.StrictMode>
      </ErrorBoundary>
    );
  } catch (e) {
    // Critical bootstrap error — log full stack and render a minimal fallback
    console.error('[main] bootstrap failed', e);
    try {
      root.render(
        <ErrorBoundary>
          <div style={{padding:20,fontFamily:'sans-serif'}}>
            Errore di inizializzazione dell'applicazione. Aprire la console per dettagli.
          </div>
        </ErrorBoundary>
      );
    } catch (renderErr) {
      console.error('[main] render fallback failed', renderErr);
    }
  }
}

bootstrapApp();
