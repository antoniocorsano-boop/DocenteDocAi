// CRITICAL: Initialize Performance API before React/Scheduler modules run
// NOTE: Now inlined in index.html as <script> tag, so we don't need to import pre-react-performance
// import './pre-react-performance';
// CRITICAL: Import polyfills FIRST, before anything else
// Polyfills handle DOM shims and performance fallbacks
import './polyfills';

// Initialize tracing
// import './tracing';

import React from 'react';
import { createRoot } from 'react-dom/client';
import ErrorBoundary from './components/ErrorBoundary';

// CSS Architecture
import './theme.css';
import './components.css';
import './logo.css';
import './global.css';

// Theme imports
import { M3ThemeProvider } from './theme/theme';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import muiTheme from './theme/muiTheme';
import { NKAProvider } from './nka/NKAProvider';
import M3Surface from './components/ui/M3Surface';
import { M3Typography } from './components/ui/M3Typography';

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
    // TEMPORARILY DISABLED: localStorage.clear();
    if (typeof window !== 'undefined' && 'indexedDB' in window) {
      // TEMPORARILY DISABLED: indexedDB.deleteDatabase('OrarioDocAI_BackupDB');
      // TEMPORARILY DISABLED: indexedDB.deleteDatabase('OrarioDocAI_Data');
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
    const isProd = import.meta.env.PROD;
    const isDev = import.meta.env.DEV;
    const enableGsiDev = import.meta.env.VITE_ENABLE_GSI_DEV === 'true';
    const gsiClientId = import.meta.env.VITE_GSI_CLIENT_ID;

    // Allow listing for scripts and service worker registration.
    // Use VITE_ALLOWED_HOSTS env var as comma-separated list, fallback to known hosts.
      const envHosts = import.meta.env.VITE_ALLOWED_HOSTS || '';
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

// Loading fallback component
function LoadingFallback() {
  return (
    <M3Surface 
      role="main" 
      aria-label="Caricamento applicazione in corso"
      style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: 'var(--md-sys-viewport-height-full)',
        gap: 'var(--md-sys-spacing-4)',
        padding: 'var(--md-sys-spacing-5)'
      }}
    >
      <M3Typography variant="body-large">
        Caricamento in corso...
      </M3Typography>
    </M3Surface>
  );
}

// Error fallback component
function ErrorFallback({ error: _error }: { error: Error }) {
  return (
    <M3Surface
      role="main"
      aria-label="Errore di inizializzazione applicazione"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'var(--md-sys-viewport-height-full)',
        gap: 'var(--md-sys-spacing-4)',
        padding: 'var(--md-sys-spacing-5)',
        textAlign: 'center'
      }}
    >
      <M3Typography variant="headline-medium">
        Errore di Inizializzazione
      </M3Typography>
      <M3Typography variant="body-large">
        Si è verificato un errore durante l'avvio dell'applicazione.
      </M3Typography>
      <M3Typography variant="body-medium">
        Aprire la console per maggiori dettagli.
      </M3Typography>
    </M3Surface>
  );
}

// Ensure Zustand stores are preloaded before importing the App
async function bootstrapApp() {
  try {
    // Show loading state
    root.render(
      <ErrorBoundary>
        <React.StrictMode>
          <MuiThemeProvider theme={muiTheme}>
            <CssBaseline enableColorScheme />
            <M3ThemeProvider>
              <LoadingFallback />
            </M3ThemeProvider>
          </MuiThemeProvider>
        </React.StrictMode>
      </ErrorBoundary>
    );

    const lazy = await import('./stores/lazyStores');
    await lazy.preloadAllStores();

    // Dynamically import App after stores are ready to avoid initialization races
    const { App } = await import('./components/App');
    const { ModalProvider } = await import('./contexts/ModalContext');

    root.render(
      <ErrorBoundary>
        <React.StrictMode>
          <MuiThemeProvider theme={muiTheme}>
            <CssBaseline enableColorScheme />
            <M3ThemeProvider>
              <NKAProvider>
                <ModalProvider>
                  <App />
                </ModalProvider>
              </NKAProvider>
            </M3ThemeProvider>
          </MuiThemeProvider>
        </React.StrictMode>
      </ErrorBoundary>
    );
  } catch (e) {
    // Critical bootstrap error — log full stack and render a minimal fallback
    console.error('[main] bootstrap failed', e);
    try {
      root.render(
        <ErrorBoundary>
          <React.StrictMode>
            <MuiThemeProvider theme={muiTheme}>
              <CssBaseline enableColorScheme />
              <M3ThemeProvider>
                <ErrorFallback error={e as Error} />
              </M3ThemeProvider>
            </MuiThemeProvider>
          </React.StrictMode>
        </ErrorBoundary>
      );
    } catch (renderErr) {
      console.error('[main] render fallback failed', renderErr);
    }
  }
}

bootstrapApp();
