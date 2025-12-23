import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './components/App';
import ErrorBoundary from './components/ErrorBoundary';

// CRITICAL: Initialize comprehensive document polyfill FIRST, before any library loads
if (typeof window !== 'undefined') {
  // Create a comprehensive document mock that handles all docx library needs
  const safeElement = {
    tagName: 'DIV',
    className: '',
    id: '',
    style: {},
    attributes: {},
    childNodes: [],
    children: [],
    parentNode: null,
    textContent: '',
    innerHTML: '',
    nodeType: 1,
    appendChild: function(n: any) { if (this.childNodes) this.childNodes.push(n); return this; },
    insertBefore: function(n: any, r: any) { if (this.childNodes) this.childNodes.unshift(n); return this; },
    removeChild: function(n: any) { return this; },
    replaceChild: function(n: any, r: any) { return this; },
    addEventListener: function() { return undefined; },
    removeEventListener: function() { return undefined; },
    getAttribute: function(n: string) { return this.attributes?.[n] || ''; },
    setAttribute: function(n: string, v: any) { if (!this.attributes) this.attributes = {}; this.attributes[n] = v; },
    removeAttribute: function(n: string) { if (this.attributes) delete this.attributes[n]; },
    querySelector: function() { return null; },
    querySelectorAll: function() { return []; }
  };

  // Robust document polyfill with full API
  if (typeof document === 'undefined' || !document.createElement) {
    (window as any).document = {
      createElement: (tag: string) => ({ ...safeElement, tagName: tag.toUpperCase() }),
      createElementNS: (ns: string, tag: string) => ({ ...safeElement, tagName: tag.toUpperCase() }),
      createTextNode: (text: string) => ({ nodeValue: text, nodeType: 3 }),
      createDocumentFragment: () => ({ ...safeElement, nodeType: 11 }),
      createAttribute: (n: string) => ({ name: n, value: '' }),
      getElementById: () => null,
      querySelector: () => null,
      querySelectorAll: () => [],
      getElementsByTagName: () => [],
      getElementsByClassName: () => [],
      getElementsByName: () => [],
      addEventListener: () => {},
      removeEventListener: () => {},
      adoptNode: (n: any) => n,
      importNode: (n: any) => n,
      body: { ...safeElement },
      head: { ...safeElement },
      documentElement: { ...safeElement, nodeType: 9 },
      nodeType: 9
    };
  }
  
  // Robust DOMParser polyfill
  if (typeof DOMParser === 'undefined') {
    (window as any).DOMParser = class DOMParser {
      parseFromString(str: string, type: string) {
        return { 
          body: { ...safeElement },
          documentElement: { ...safeElement },
          querySelector: () => null,
          querySelectorAll: () => [],
          nodeType: 9
        };
      }
    };
  }
  
  // Ensure Node and HTMLElement with proper constants
  if (typeof Node === 'undefined') {
    (window as any).Node = {
      ELEMENT_NODE: 1,
      ATTRIBUTE_NODE: 2,
      TEXT_NODE: 3,
      CDATA_SECTION_NODE: 4,
      ENTITY_REFERENCE_NODE: 5,
      ENTITY_NODE: 6,
      PROCESSING_INSTRUCTION_NODE: 7,
      COMMENT_NODE: 8,
      DOCUMENT_NODE: 9,
      DOCUMENT_TYPE_NODE: 10,
      DOCUMENT_FRAGMENT_NODE: 11
    };
  }
  if (typeof HTMLElement === 'undefined') {
    (window as any).HTMLElement = class HTMLElement {};
  }
  if (typeof Element === 'undefined') {
    (window as any).Element = class Element {};
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
