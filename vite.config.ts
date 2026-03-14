// CRITICAL: Import build-time polyfill FIRST to prevent SSR errors
import './src/build-polyfill.js';

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { createHtmlPlugin } from 'vite-plugin-html';
import { compression } from 'vite-plugin-compression2';
import { visualizer } from 'rollup-plugin-visualizer';

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
        theme_color: '#6750A4',
        background_color: '#FFFBFE',
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
        // Escludi dal precache i chunk lazy pesanti: vengono scaricati on-demand, non al primo avvio
        globIgnores: ['**/{pdf-vendor,xlsx-vendor,dnd-vendor,chart-vendor,ai-vendor,opentelemetry-vendor}-*.js'],
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
    compression({ algorithm: 'brotliCompress', exclude: [/\.(png|jpe?g|gif|webp|avif|svg)$/i] }),
    compression({ algorithm: 'gzip',           exclude: [/\.(png|jpe?g|gif|webp|avif|svg)$/i] }),
    visualizer({ open: false, filename: 'audit/bundle-stats.html', gzipSize: true, brotliSize: true, template: 'list' }),
    // Make Vite-generated CSS non-blocking to eliminate render-blocking penalty
    {
      name: 'non-blocking-css',
      transformIndexHtml: {
        order: 'post' as const,
        handler(html: string) {
          return html.replace(
            /<link rel="stylesheet" crossorigin href="(\/assets\/[^"]+\.css)">/g,
            (_: string, href: string) =>
              `<link rel="preload" as="style" href="${href}" onload="this.onload=null;this.rel='stylesheet'">` +
              `<noscript><link rel="stylesheet" href="${href}"></noscript>`
          );
        },
      },
    },
  ],
  base: '/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: process.env.NODE_ENV === 'development' ? true : false,
    chunkSizeWarningLimit: 1000, // Aumentato per gestire le librerie pesanti
    assetsInlineLimit: 0,
    cssMinify: true,
    // Keep modulepreload with dependency filtering to avoid preloading heavy lazy chunks.
    // Polyfill not needed — modern browsers support modulepreload natively.
    modulePreload: {
      polyfill: false,
      resolveDependencies: (_filename: string, deps: string[]) =>
        deps.filter(dep =>
          !dep.includes('pdf-vendor') &&
          !dep.includes('ai-vendor') &&
          !dep.includes('dnd-vendor') &&
          !dep.includes('chart-vendor') &&
          !dep.includes('xlsx-vendor') &&
          !dep.includes('opentelemetry-vendor')
        ),
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Force the Vite preload helper into vendor so it's in a startup chunk,
          // preventing pdf-vendor from being statically imported at app boot.
          if (id.includes('\0vite/preload-helper') || id === '\0vite/preload-helper.js') {
            return 'vendor';
          }
          // React core — must be resolved before mui-vendor to avoid circular reference
          if (
            id.includes('node_modules/react/') ||
            id.includes('node_modules/react-dom/') ||
            id.includes('node_modules/scheduler/') ||
            id.includes('node_modules/react-is/')
          ) {
            return 'react-vendor';
          }
          // MUI + Emotion + Popper — depends on react-vendor
          if (
            id.includes('node_modules/@mui/') ||
            id.includes('node_modules/@emotion/') ||
            id.includes('node_modules/@popperjs/')
          ) {
            return 'mui-vendor';
          }
          // AI / heavy libs
          if (id.includes('@google/genai') || id.includes('node_modules/lighthouse') || id.includes('node_modules/chrome-launcher')) {
            return 'ai-vendor';
          }
          // Document libs (dynamic-import only — excluded from modulepreload)
          // jspdf + html2canvas are dynamically imported in ExportModal/TestPreviewModal
          // Note: canvg / svg-pathdata / d3-path are shared with recharts, left in vendor to avoid circular chunk
          if (
            id.includes('/node_modules/mammoth') ||
            id.includes('/node_modules/docx/') ||
            id.includes('/node_modules/jszip/') ||
            id.includes('/node_modules/fflate/') ||
            id.includes('/node_modules/jspdf/') ||
            id.includes('/node_modules/html2canvas/') ||
            // docx/mammoth transitive deps — use exact path prefix to avoid broad substring matches
            id.includes('/node_modules/@xmldom/') ||
            id.includes('/node_modules/bluebird/') ||
            id.includes('/node_modules/underscore/') ||
            id.includes('/node_modules/dingbat-to-unicode/') ||
            id.includes('/node_modules/lop/') ||
            id.includes('/node_modules/option/')
          ) {
            return 'pdf-vendor';
          }
          // xlsx — loaded on demand for Excel file import
          if (id.includes('node_modules/xlsx')) {
            return 'xlsx-vendor';
          }
          // DnD — not needed on initial render
          if (id.includes('@dnd-kit')) {
            return 'dnd-vendor';
          }
          // OpenTelemetry — lazy-loaded, only active when OTLP endpoint is configured
          if (
            id.includes('@opentelemetry/') ||
            id.includes('node_modules/protobufjs') ||
            id.includes('@protobufjs/') ||
            (id.includes('node_modules/pako') && !id.includes('jszip'))
          ) {
            return 'opentelemetry-vendor';
          }
          // Chart / analytics libs + recharts transitive deps (redux family)
          if (
            id.includes('chart') ||
            id.includes('recharts') ||
            id.includes('d3') ||
            id.includes('@reduxjs/toolkit') ||
            // exact redux packages (not redux-like e.g. 'reductor')
            /[/]node_modules[/]redux[-/]/.test(id) ||
            id.includes('node_modules/react-redux') ||
            id.includes('node_modules/redux-thunk') ||
            id.includes('node_modules/reselect') ||
            id.includes('node_modules/react-transition-group')
          ) {
            return 'chart-vendor';
          }
          // Other large node_modules
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
      },
    }
  },
  server: {
    hmr: false, // Disabilita l'Hot Module Replacement per catturare errori senza ricaricamenti
  },
});
