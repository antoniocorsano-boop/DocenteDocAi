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
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Evitiamo il caricamento del SW se siamo in un dominio di sandbox/iframe non autorizzato per i manifest
    const isSandbox = window.location.hostname.includes('usercontent.goog') || window.self !== window.top;
    if (!isSandbox) {
      navigator.serviceWorker.register('./service-worker.js', { scope: './' })
        .catch(err => console.debug('SW skipped in development/sandbox context'));
    }
  });
}

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
