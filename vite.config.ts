// CRITICAL: Import build-time polyfill FIRST to prevent SSR errors
import './src/build-polyfill.js';

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';

export default defineConfig({
  plugins: [
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
            if (id.includes('html2canvas')) return 'vendor-html2canvas';
            if (id.includes('zustand') || id.includes('purify') || id.includes('lodash')) return 'vendor-utils';
            // Don't bundle doc libraries - they will be loaded dynamically to avoid document access during init
            if (id.match(/docx|pdf-lib|jspdf|mammoth|pdfjs-dist/)) {
              return null; // Let Vite handle it but don't create separate vendor
            }
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