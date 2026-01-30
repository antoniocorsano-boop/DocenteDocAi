// CRITICAL: Import build-time polyfill FIRST to prevent SSR errors
import './src/build-polyfill.js';

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { createHtmlPlugin } from 'vite-plugin-html';

export default defineConfig({
  resolve: {
    alias: {
      react: 'react',
      'react-dom': 'react-dom',
      scheduler: 'scheduler',
      'scheduler/unstable_mock': 'scheduler/unstable_mock',
    },
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'scheduler',
      'lodash',
      'underscore',
      './src/services/demoData.ts'
    ],
    esbuildOptions: {
      mainFields: ['module', 'jsnext:main', 'jsnext'],
    },
  },
  plugins: [
    react(),
    ...(process.env.NODE_ENV === 'production' ? [VitePWA({
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'sw.ts',
      registerType: 'autoUpdate',
      injectRegister: false,  // Boolean false instead of string 'false'
      manifest: {
        name: 'DocenteDoc AI',
        short_name: 'DocenteDoc',
        description: 'Assistente AI per Docenti Italiani',
        theme_color: 'var(--md-sys-color-primary)',
        background_color: 'var(--md-sys-color-surface)',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: 'icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      },
      injectManifest: {
        globPatterns: ['index.html', '**/*.{js,css,woff,woff2,png,svg,webmanifest}'],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // Aumentato a 5MB per gestire i chunk pesanti
      },
      devOptions: {
        enabled: true,
        type: 'module'
      }
    })] : []),
    createHtmlPlugin({
      minify: true,
    }),
  ],
  base: '/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: process.env.NODE_ENV === 'development' ? true : false,
    chunkSizeWarningLimit: 1000, // Aumentato per gestire le librerie pesanti
    assetsInlineLimit: 0,
    cssMinify: false,
    rollupOptions: {
      output: {
        manualChunks: undefined // Lasciamo che Vite gestisca il chunking ottimale
      },
    }
  },
  server: {
    hmr: false, // Disabilita l'Hot Module Replacement per catturare errori senza ricaricamenti
  },
});
