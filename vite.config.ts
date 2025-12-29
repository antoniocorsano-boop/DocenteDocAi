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
          // Force all node_modules into a single vendor chunk to guarantee
          // React and its consumers execute in a safe order and avoid
          // cross-chunk circular-import / TDZ runtime errors in prod.
          if (id.includes('node_modules')) return 'vendor';
        },
      },
    },
  },
});