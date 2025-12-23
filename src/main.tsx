import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './components/App';
import ErrorBoundary from './components/ErrorBoundary';

// CRITICAL: Initialize comprehensive document polyfill FIRST, before any library loads
if (typeof window !== 'undefined') {
  // Robust document polyfill with full API
  if (typeof document === 'undefined' || !document.createElement) {
    (window as any).document = {
      createElement: (tag: string) => ({ tagName: tag }),
      createElementNS: (ns: string, tag: string) => ({ tagName: tag }),
      createTextNode: (text: string) => ({ nodeValue: text }),
      getElementById: () => null,
      querySelector: () => null,
      querySelectorAll: () => [],
      addEventListener: () => {},
      body: { appendChild: () => {}, insertBefore: () => {} },
      head: { appendChild: () => {} },
      documentElement: {}
    };
  }
  
  // Robust DOMParser polyfill
  if (typeof DOMParser === 'undefined') {
    (window as any).DOMParser = class DOMParser {
      parseFromString(str: string, type: string) {
        return { 
          body: { childNodes: [] },
          documentElement: {},
          querySelector: () => null
        };
      }
    };
  }
  
  // Ensure Node and HTMLElement
  if (typeof Node === 'undefined') {
    (window as any).Node = class {};
  }
  if (typeof HTMLElement === 'undefined') {
    (window as any).HTMLElement = class {};
  }
}

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
  <React.StrictMode>
    <ErrorBoundary>
        <App />
    </ErrorBoundary>
  </React.StrictMode>
);
