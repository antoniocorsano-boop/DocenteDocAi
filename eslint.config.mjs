import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/build/**",
      "**/storybook-static/**",
      "**/coverage/**",
      "**/__tests__/**",
      "**/nka/**",
      "**/playwright-report/**",
      "**/test-results/**",
      "**/.venv/**",
      "**/docentedoc-ai/docentedoc-ai/**",
      "**/*.ipynb",
      "**/vendor-*.js",
      "**/react-vendor-*.js",
      "**/vendor-react-check.js",
      "src/build-polyfill.js",
      "public/scheduler-polyfill.js",
      "__tests__/**",
      "**/*.test.tsx",
      "**/*.test.ts",
      "**/*.spec.tsx",
      "**/*.spec.ts",
      "**/src_backup/**",
      "**/archive/**",
      "**/scripts/**",
      "**/*.cjs"
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
  {
    ...pluginReact.configs.flat.recommended,
    settings: {
      react: {
        version: '18.2.0'
      }
    }
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    plugins: {
      'react-hooks': reactHooks,
    },
    rules: {
      'react-hooks/rules-of-hooks': 'warn',
      'react-hooks/exhaustive-deps': 'warn',
      '@typescript-eslint/no-unused-expressions': 'warn',
      '@typescript-eslint/ban-ts-comment': 'warn',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': ['error', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
        ignoreRestSiblings: true,
      }],
      '@typescript-eslint/no-unsafe-function-type': 'warn',
      '@typescript-eslint/no-empty-object-type': 'warn',
      '@typescript-eslint/explicit-module-boundary-types': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'off',
      'no-empty': 'warn',
      'no-prototype-builtins': 'off',
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
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
  {
    files: ['src/nka/NKANodeCard.tsx', '**/nka/NKANodeCard.tsx', '**/NKANodeCard.tsx'],
    rules: {
      'react/react-in-jsx-scope': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
    },
  },
  {
    files: ['**/nka/**/*.{ts,tsx}'],
    rules: {
      'react/react-in-jsx-scope': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
    },
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
  {
    files: ['**/NKANodeCard.tsx'],
    rules: {
      'react/react-in-jsx-scope': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
    },
  },
]);
