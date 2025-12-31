// CRITICAL: Import build-time polyfill FIRST to prevent SSR errors
import './src/build-polyfill.js';

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// import { VitePWA } from 'vite-plugin-pwa';
import { createHtmlPlugin } from 'vite-plugin-html';

export default defineConfig({
  resolve: {
    alias: {
      react: 'react',
      'react-dom': 'react-dom',
      scheduler: 'scheduler',
      underscore: 'lodash', // Shim underscore to lodash
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'scheduler', 'lodash', 'lodash-es', 'underscore', './src/services/demoData.ts'],
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
    createHtmlPlugin({
      minify: true,
    }),
  ],
  base: '/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: process.env.NODE_ENV === 'development' ? true : false,
    chunkSizeWarningLimit: 800, // Increase limit - we have large dependencies (PDFs, genAI, etc.)
    assetsInlineLimit: 0, // Evita data URL per font e altri asset
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react')) return 'react-vendor';
            if (id.includes('pdf-lib') || id.includes('jspdf') || id.includes('docx') || id.includes('mammoth')) return 'pdf-tools';
            if (id.includes('@google/genai')) return 'genai';
            if (id.includes('lodash') || id.includes('underscore')) return 'lodash-vendor';
            return 'vendor';
          }
        },
      },
    }
  },
});