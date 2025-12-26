// CRITICAL: Import build-time polyfill FIRST to prevent SSR errors
import './src/build-polyfill.js';

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// import { VitePWA } from 'vite-plugin-pwa';
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
  base: '/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: process.env.NODE_ENV === 'development' ? true : false,
    chunkSizeWarningLimit: 800, // Increase limit - we have large dependencies (PDFs, genAI, etc.)
    rollupOptions: {
      input: {
        main: './index.html',
      },
      output: {
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
        manualChunks(id: string) {
          // Split large dependencies into separate chunks
          if (id.includes('node_modules')) {
            // React ecosystem - core dependency
            if (id.includes('react') || id.includes('react-dom')) return 'vendor-react';
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
            if (id.includes('purify') || id.includes('lodash')) return 'vendor-utils';
            // Default vendor chunk for other node_modules
            return 'vendor';
          }
        },
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
    dedupe: ['react', 'react-dom'],
    alias: {
      react: require.resolve('react'),
      'react-dom': require.resolve('react-dom'),
      '@': path.resolve(process.cwd(), './src'),
    },
  },
});