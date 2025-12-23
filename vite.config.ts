// CRITICAL: Import build-time polyfill FIRST to prevent SSR errors
import './src/build-polyfill.js';

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';

// Plugin to wrap problematic imports with document safety checks
const documentSafetyPlugin = () => ({
  name: 'document-safety',
  resolveId(id) {
    // Wrap problematic libraries
    if (['docx', 'pdf-lib', 'jspdf', 'mammoth', 'pdfjs-dist'].some(lib => id.includes(lib))) {
      return null; // Let vite handle it normally, but we'll intercept in transform
    }
  },
  transform(code, id) {
    // Only transform node_modules
    if (!id.includes('node_modules')) return null;
    
    // For doc libraries, wrap with document existence check
    if (['docx', 'pdf-lib', 'jspdf', 'mammoth', 'pdfjs-dist'].some(lib => id.includes(lib))) {
      // Prepend safety check at the very top
      return {
        code: `
if (typeof document === 'undefined' && typeof globalThis !== 'undefined') {
  const safeElement = { nodeType: 1, tagName: 'DIV', style: {}, attributes: {}, 
    appendChild: () => safeElement, removeChild: () => safeElement, 
    getAttribute: () => '', setAttribute: () => {}, 
    addEventListener: () => {}, querySelector: () => null, querySelectorAll: () => [],
    getElementsByTagName: () => [], getElementsByClassName: () => [], 
    getElementById: () => null, appendChild: () => safeElement
  };
  const mockDoc = { 
    ...safeElement, nodeType: 9, body: safeElement, head: safeElement, 
    documentElement: safeElement, 
    createElement: () => safeElement,
    createElementNS: () => safeElement,
    createTextNode: () => ({ nodeValue: '' }),
    createDocumentFragment: () => safeElement
  };
  globalThis.document = mockDoc;
  if (typeof window !== 'undefined') window.document = mockDoc;
}
${code}`,
        map: null
      };
    }
    return null;
  }
});

export default defineConfig({
  plugins: [
    documentSafetyPlugin(),
    react(),
    // Temporarily disabled PWA due to service worker URL error in Vercel
    // VitePWA({
    //   registerType: 'autoUpdate',
    //   injectRegister: 'auto',
    //   manifest: false, // Usiamo il file statico in public
    // }),
  ],
  base: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: process.env.NODE_ENV === 'development' ? true : false,
    rollupOptions: {
      input: {
        main: './index.html',
      },
        output: {
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) return 'vendor-react';
            if (id.includes('@google/genai')) return 'vendor-genai';
            if (id.includes('pdf-lib')) return 'vendor-pdf-lib';
            if (id.includes('pdfjs-dist')) return 'vendor-pdfjs';
            if (id.includes('jspdf') || id.includes('jspdf-autotable')) return 'vendor-jspdf';
            if (id.includes('mammoth')) return 'vendor-mammoth';
            if (id.includes('docx')) return 'vendor-docx';
            if (id.includes('html2canvas')) return 'vendor-html2canvas';
            if (id.includes('zustand') || id.includes('purify') || id.includes('lodash')) return 'vendor-utils';
            // fallback for other large doc-related libraries
            if (id.match(/node_modules\/.*(pdf|doc|mammoth|jspdf|pdfjs|html2canvas)/)) return 'vendor-docs';
            return 'vendor';
          }
        }
      },
    },
  },
  server: {
    port: 8080,
    host: '0.0.0.0',
    hmr: {
      overlay: false
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(process.cwd(), './src'),
    },
  },
});