import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { playwright } from '@vitest/browser-playwright';
const dirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);

const storybookPlugins = [] as unknown[];

try {
  // Optional dependency: Storybook Vitest addon is loaded when present.
   
  const { storybookTest } = require('@storybook/addon-vitest/vitest-plugin');
  storybookPlugins.push(storybookTest({
    configDir: path.join(dirname, '.storybook')
  }));
} catch (error) {
  console.warn('[vitest] Storybook Vitest addon not installed; skipping Storybook project');
}

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}', '__tests__/**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}' // Include all files in __tests__
    ],
    exclude: ['node_modules', 'dist', 'e2e', '__tests__/visual-regression/**'],
    projects: storybookPlugins.length ? [{
      extends: true,
      plugins: storybookPlugins,
      test: {
        name: 'storybook',
        browser: {
          enabled: true,
          headless: true,
          provider: playwright({}),
          instances: [{
            browser: 'chromium'
          }]
        },
        setupFiles: ['.storybook/vitest.setup.ts']
      }
    }] : undefined
  }
});
