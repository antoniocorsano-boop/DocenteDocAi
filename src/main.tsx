// CRITICAL: Initialize Performance API before React/Scheduler modules run
// NOTE: Now inlined in index.html as <script> tag, so we don't need to import pre-react-performance
// import './pre-react-performance';
// CRITICAL: Import polyfills FIRST, before anything else
// Polyfills handle DOM shims and performance fallbacks
import './polyfills';

// Initialize tracing
import './tracing';

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
  } catch {
    // Intentionally ignore legacy storage cleanup errors
  }
})();

// --- DEBUG: Forza reset storage locale e log errori globali ---
// Avoid clearing storage when running E2E tests so test harness can inject data
const isTestMode = (typeof window !== 'undefined' && (window as { __TEST_MODE?: boolean }).__TEST_MODE === true) || ((import.meta as ImportMeta).env?.VITE_TEST_MODE === 'true');
if (!isTestMode) {
  try {
    localStorage.clear();
    if (typeof window !== 'undefined' && 'indexedDB' in window) {
      indexedDB.deleteDatabase('OrarioDocAI_BackupDB');
      indexedDB.deleteDatabase('OrarioDocAI_Data');
    }
  } catch {
    // Ignore errors during cleanup in non-test runs
  }
} else {
  console.info('[main] Test mode active — preserving localStorage and IndexedDB for E2E');
}
// Improved global error handlers.
// - Ignore errors originating from browser extensions (chrome-extension://)
// - Avoid blocking alerts (which break automated tests)
// - Log useful diagnostic info for local debugging
function isExtensionSource(src?: string | null) {
  return typeof src === 'string' && src.startsWith('chrome-extension://');
}

if (typeof window !== 'undefined') {
  window.addEventListener('error', (ev: ErrorEvent) => {
    try {
      if (isExtensionSource(ev.filename)) {
        // Ignore noisy extension-injected errors
        console.debug('[main] ignored extension error', ev.message, ev.filename);
        ev.preventDefault?.();
        return;
      }
      console.error('[main] window.error', ev.message, ev.filename, ev.lineno, ev.colno, ev.error?.stack || '');
    } catch (err) {
      // swallow to avoid cascading failures
      console.error('[main] error handler failed', err);
    }
  });

  window.addEventListener('unhandledrejection', (ev: PromiseRejectionEvent) => {
    try {
      const reason = ev.reason;
      const stack = reason && typeof reason === 'object' ? (reason as { stack?: string }).stack : String(reason);
      if (stack && stack.indexOf('chrome-extension://') !== -1) {
        console.debug('[main] ignored extension rejection', stack);
        ev.preventDefault?.();
        return;
      }
      console.error('[main] unhandledrejection', reason);
    } catch (err) {
      console.error('[main] unhandledrejection handler failed', err);
    }
  });
}

// PWA Service Worker registration is handled by vite-plugin-pwa in vite.config.ts
// with injectRegister: 'auto' which adds the registration script to index.html.

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
    const { ModalProvider } = await import('./context/ModalContext');

    root.render(
      <ErrorBoundary>
        <React.StrictMode>
          <ModalProvider>
            <App />
          </ModalProvider>
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
            Errore di inizializzazione dell&apos;applicazione. Aprire la console per dettagli.
          </div>
        </ErrorBoundary>
      );
    } catch (renderErr) {
      console.error('[main] render fallback failed', renderErr);
    }
  }
}

bootstrapApp();
