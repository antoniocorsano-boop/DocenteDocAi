import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      manifest: false, // Usiamo il file statico in public
    }),
    // Plugin to ensure docx is only loaded dynamically
    {
      name: 'docx-lazy-load',
      resolveId(id) {
        if (id === 'docx') {
          return { id, external: false, moduleSideEffects: false };
        }
      },
    },
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