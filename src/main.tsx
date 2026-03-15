// CRITICAL: Initialize Performance API before React/Scheduler modules run
// NOTE: Now inlined in index.html as <script> tag, so we don't need to import pre-react-performance
// import './pre-react-performance';
// CRITICAL: Import polyfills FIRST, before anything else
// Polyfills handle DOM shims and performance fallbacks
import './polyfills';
import { logger } from './utils/logger';

// Initialize tracing lazily — OpenTelemetry packages are only loaded when the
// OTLP endpoint is configured (not at boot for normal users)
if (import.meta.env.VITE_OTEL_EXPORTER_OTLP_ENDPOINT) {
  import('./tracing');
}

import React from 'react';
import { createRoot } from 'react-dom/client';
import ErrorBoundary from './components/ErrorBoundary';

// CSS Architecture
import './theme.css';
import './logo.css';
import './global.css';

// Theme imports
import { M3ThemeProvider } from './theme/theme';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { buildMuiTheme } from './theme/muiTheme';
import { NKAProvider } from './nka/NKAProvider';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { useMemo, useState, useEffect } from 'react';
import { useSettingsStore } from './stores/useSettingsStore';
import { runRetentionCheck } from './utils/dataRetention';
import { hasPrivacyConsent } from './components/PrivacyConsentModal';

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

// GDPR B4 — data retention: purge AI artefacts older than 365 days
runRetentionCheck();

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
          logger.debug('[main] ignored extension error', ev.message, ev.filename);
        ev.preventDefault?.();
        return;
      }
          logger.error('[main] window.error', ev.message, ev.filename, ev.lineno, ev.colno, ev.error?.stack || '');
    } catch (err) {
      // swallow to avoid cascading failures
      logger.error('[main] error handler failed', err);
    }
  });

  window.addEventListener('unhandledrejection', (ev: PromiseRejectionEvent) => {
    try {
      const reason = ev.reason;
      const stack = reason && typeof reason === 'object' ? (reason as { stack?: string }).stack : String(reason);
      if (stack && stack.indexOf('chrome-extension://') !== -1) {
        logger.debug('[main] ignored extension rejection', stack);
        ev.preventDefault?.();
        return;
      }
      logger.error('[main] unhandledrejection', reason);
    } catch (err) {
      logger.error('[main] unhandledrejection handler failed', err);
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
      gsi.onload = () => { window.__googleGsiReady = true; logger.debug(`✅ Google GSI script loaded (${mode})`); };
      document.head.appendChild(gsi);

      const api = document.createElement('script');
      api.src = 'https://apis.google.com/js/api.js';
      api.async = true;
      api.onload = () => { window.__googleApiReady = true; logger.debug(`✅ Google API script loaded (${mode})`); };
      document.head.appendChild(api);
    } else {
      // Keep flags false in dev to avoid noisy 403s
      window.__googleApiReady = false;
      window.__googleGsiReady = false;
    }
  } catch (e) { logger.debug('Google script load gate error', e); }
})();

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error("Root element missing");

const root = createRoot(rootElement);

/**
 * Reactive MUI ThemeProvider — reads mode from Zustand and rebuilds the MUI
 * theme when dark/light/system changes, so MUI-internal component colours
 * (hover overlays, ripples, select menus, etc.) are always in sync with the
 * active mode.  Uses useMemo so the theme object is only recreated on
 * mode changes.
 */
function AppMuiThemeWrapper({ children }: { children: React.ReactNode }) {
  const mode = useSettingsStore(s => s.themeState.mode);

  // Track OS dark-mode preference reactively (for mode === 'system')
  const mq = typeof window !== 'undefined'
    ? window.matchMedia('(prefers-color-scheme: dark)')
    : null;
  const [systemDark, setSystemDark] = useState(() => mq?.matches ?? false);
  useEffect(() => {
    if (!mq) return;
    const handler = (e: MediaQueryListEvent) => setSystemDark(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const resolvedMode: 'light' | 'dark' =
    mode === 'system' ? (systemDark ? 'dark' : 'light') : mode;
  const theme = useMemo(() => buildMuiTheme(resolvedMode), [resolvedMode]);

  // Phase 1.2: Sync CSS class with MUI theme in the same commit to eliminate
  // mixed-mode frames (MUI dark while CSS still light, or vice versa)
  useEffect(() => {
    document.documentElement.classList.toggle('theme-dark', resolvedMode === 'dark');
  }, [resolvedMode]);

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline enableColorScheme />
      {children}
    </MuiThemeProvider>
  );
}

// Loading fallback component
function LoadingFallback() {
  return (
    <Paper
      role="main"
      aria-label="Caricamento applicazione in corso"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'var(--md-sys-viewport-height-full)',
        gap: 4,
        p: 5,
      }}
    >
      <Typography variant="body1">
        Caricamento in corso...
      </Typography>
    </Paper>
  );
}

// Error fallback component
function ErrorFallback({ error: _error }: { error: Error }) {
  return (
    <Paper
      role="main"
      aria-label="Errore di inizializzazione applicazione"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'var(--md-sys-viewport-height-full)',
        gap: 4,
        p: 5,
        textAlign: 'center',
      }}
    >
      <Typography variant="h5">
        Errore di Inizializzazione
      </Typography>
      <Typography variant="body1">
        Si è verificato un errore durante l'avvio dell'applicazione.
      </Typography>
      <Typography variant="body2">
        Aprire la console per maggiori dettagli.
      </Typography>
    </Paper>
  );
}

// Ensure Zustand stores are preloaded before importing the App
async function bootstrapApp() {
  try {
    // ── Landing page fast-path (no consent gate, no App bootstrap) ──────────
    if (window.location.pathname.startsWith('/landing')) {
      const { default: LandingPage } = await import('./pages/landing/LandingPage');
      root.render(
        <ErrorBoundary>
          <React.StrictMode>
            <AppMuiThemeWrapper>
              <M3ThemeProvider>
                <LandingPage />
              </M3ThemeProvider>
            </AppMuiThemeWrapper>
          </React.StrictMode>
        </ErrorBoundary>
      );
      return;
    }

    // Show loading state
    root.render(
      <ErrorBoundary>
        <React.StrictMode>
          <AppMuiThemeWrapper>
            <M3ThemeProvider>
              <LoadingFallback />
            </M3ThemeProvider>
          </AppMuiThemeWrapper>
        </React.StrictMode>
      </ErrorBoundary>
    );

    const lazy = await import('./stores/lazyStores');
    await lazy.preloadAllStores();

    // Dynamically import App after stores are ready to avoid initialization races
    const { App } = await import('./components/App');
    const { ModalProvider } = await import('./contexts/ModalContext');
    const { default: PrivacyConsentModal } = await import('./components/PrivacyConsentModal');

    /** Consent gate — keeps app blocked until GDPR informativa is accepted. */
    function AppWithConsent() {
      const isTestMode = !!(window as unknown as { __TEST_MODE?: boolean }).__TEST_MODE
        || localStorage.getItem('__e2e_test_mode') === 'true';
      const [consented, setConsented] = useState(() => isTestMode || hasPrivacyConsent());
      if (!consented) {
        return <PrivacyConsentModal onAccepted={() => setConsented(true)} />;
      }
      return (
        <NKAProvider>
          <ModalProvider>
            <App />
          </ModalProvider>
        </NKAProvider>
      );
    }

    root.render(
      <ErrorBoundary>
        <React.StrictMode>
          <AppMuiThemeWrapper>
            <M3ThemeProvider>
              <AppWithConsent />
            </M3ThemeProvider>
          </AppMuiThemeWrapper>
        </React.StrictMode>
      </ErrorBoundary>
    );
  } catch (e) {
    // Critical bootstrap error — log full stack and render a minimal fallback
    logger.error('[main] bootstrap failed', e);
    try {
      root.render(
        <ErrorBoundary>
          <React.StrictMode>
            <AppMuiThemeWrapper>
              <M3ThemeProvider>
                <ErrorFallback error={e as Error} />
              </M3ThemeProvider>
            </AppMuiThemeWrapper>
          </React.StrictMode>
        </ErrorBoundary>
      );
    } catch (renderErr) {
      logger.error('[main] render fallback failed', renderErr);
    }
  }
}

bootstrapApp();
