// CRITICAL: Import build-time polyfill FIRST to prevent SSR errors
import './src/build-polyfill.js';

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      react: path.resolve(__dirname, 'node_modules/react'),
      'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),
      underscore: 'lodash', // Shim underscore to lodash
    },
    dedupe: ['react', 'react-dom'],
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'lodash', 'lodash-es', 'underscore'],
    esbuildOptions: {
      mainFields: ['module', 'jsnext:main', 'jsnext'],
    },
  },
  plugins: [
    react(),
    // Temporarily disabled PWA due to service worker URL error in Vercel
    // VitePWA({
    //   registerType: 'autoUpdate',
    //   injectRegister: 'auto',
    //   manifest: false, // Usiamo il file statico in public
    // }),
  ],
  base: '/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: process.env.NODE_ENV === 'development' ? true : false,
    chunkSizeWarningLimit: 800, // Increase limit - we have large dependencies (PDFs, genAI, etc.)
    rollupOptions: {
      external: ['mammoth', 'jspdf', 'pdf-lib', 'docx'],
      input: {
        main: './index.html',
      },
      output: {
        manualChunks(id: string) {
          // Split large dependencies into separate chunks
          if (id.includes('node_modules')) {
            // React ecosystem - core dependency
            // Ensure scheduler, jsx-runtime and sync-external-store live with react to avoid circular cross-chunk imports
            if (
              id.includes('react') ||
              id.includes('react-dom') ||
              id.includes('scheduler') ||
              id.includes('use-sync-external-store') ||
              id.includes('use-sync-external-store-shim') ||
              id.includes('react/jsx-runtime')
            ) return 'vendor-react';
            // State management - separated to load after React
            if (id.includes('zustand')) return 'vendor-zustand';
            // AI model library - large, can be lazy-loaded
            if (id.includes('@google/genai')) return 'vendor-genai';
            // Canvas rendering - large library
            if (id.includes('html2canvas')) return 'vendor-html2canvas';
            // Document conversion libraries - very large, lazy-loaded on demand
            if (id.includes('jspdf')) return 'vendor-jspdf';
            if (id.includes('pdf-lib')) return 'vendor-pdf-lib';
            if (id.includes('docx')) return 'vendor-docx';
            if (id.includes('mammoth')) return 'vendor-mammoth';
            if (id.includes('pdfjs-dist')) return 'vendor-pdfjs';
            // Utility libraries
            if (id.includes('lodash-es') || id.includes('lodash')) return 'vendor-lodash';
            if (id.includes('underscore')) return 'vendor-underscore';
            if (id.includes('purify')) return 'vendor-utils';
            // Default vendor chunk for other node_modules
            return 'vendor';
          }
        },
      },
    },
  },
});