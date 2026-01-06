// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";

// Custom ESLint rules for design system conformity
import noHardcodedColors from "./eslint-rules/no-hardcoded-colors.js";
import enforceTokenUsage from "./eslint-rules/enforce-token-usage.js";
import noNewCssFiles from "./eslint-rules/no-new-css-files.js";

export default defineConfig([
  {
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/build/**",
      "**/coverage/**",
      "**/playwright-report/**",
      "**/test-results/**",
      "**/.venv/**",
      "**/docentedoc-ai/docentedoc-ai/**",
      "**/vendor-*.js",
      "**/react-vendor-*.js",
      "**/vendor-react-check.js",
      "src/build-polyfill.js",
      "public/scheduler-polyfill.js",
      "__tests__/**",
      "**/*.test.tsx",
      "**/*.test.ts",
      "**/*.spec.tsx",
      "**/*.spec.ts"
    ]
  },
  { 
    files: [
      "src/**/*.{js,ts,tsx,jsx}", 
      "scripts/**/*.{js,cjs,mjs,ts}", 
      "tools/**/*.{js,cjs,mjs,ts}", 
      "e2e/**/*.{ts,js}", 
      "eslint.config.mjs", 
      "vite.config.ts", 
      "vitest.config.ts", 
      "playwright.config.ts"
    ], 
    plugins: { js }, 
    extends: ["js/recommended"], 
    languageOptions: { globals: globals.browser } 
  },
  tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      '@typescript-eslint/no-unused-expressions': 'warn',
      '@typescript-eslint/ban-ts-comment': 'warn',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/no-unsafe-function-type': 'warn',
      '@typescript-eslint/no-empty-object-type': 'warn',
      '@typescript-eslint/explicit-module-boundary-types': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'off',
      'no-empty': 'warn',
      'no-prototype-builtins': 'off',
      'react/prop-types': 'off',
      'react/no-unescaped-entities': 'off',
      'react/display-name': 'off',
    },
  },
  {
    files: ['src/components/views/**/*.{ts,tsx}'],
    rules: {
      'react/prop-types': 'off',
    },
  },
  // Design System Conformity Rules
  {
    files: ['src/**/*.{ts,tsx}'],
    plugins: {
      'design-system': {
        rules: {
          'no-hardcoded-colors': noHardcodedColors,
          'enforce-token-usage': enforceTokenUsage,
          'no-new-css-files': noNewCssFiles
        }
      }
    },
    rules: {
      'design-system/no-hardcoded-colors': 'error',
      'design-system/enforce-token-usage': 'warn',
      'design-system/no-new-css-files': 'warn'
    }
  },
  {
    files: ['**/tools/**/*.{js,cjs,mjs,ts}', '**/scripts/**/*.{js,cjs,mjs,ts}', 'vite.config.ts', 'vitest.config.ts', 'playwright.config.ts'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'no-unused-vars': 'off',
      'no-empty': 'off',
    },
  },
  {
    files: ['src/sw.ts'],
    languageOptions: {
      globals: {
        ...globals.serviceworker,
      },
    },
  },
  {
    files: ['src/services/googleDriveService.ts'],
    languageOptions: {
      globals: {
        gapi: 'readonly',
        google: 'readonly',
      },
    },
  },
]);
