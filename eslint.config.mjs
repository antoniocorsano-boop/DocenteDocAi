import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";

// Custom ESLint rules for design system conformity
import noHardcodedColors from "./scripts/md3/eslint-rules/no-hardcoded-colors.js";
import enforceTokenUsage from "./scripts/md3/eslint-rules/enforce-token-usage.js";
import noNewCssFiles from "./scripts/md3/eslint-rules/no-new-css-files.js";
import noClassname from "./scripts/md3/eslint-rules/no-classname.js";
import noTailwindClasses from "./scripts/md3/eslint-rules/no-tailwind-classes.js";
import noHardcodedLayoutValues from "./scripts/md3/eslint-rules/no-hardcoded-layout-values.js";
import noNumericZindex from "./scripts/md3/eslint-rules/no-numeric-zindex.js";
import noLegacyZTokens from "./scripts/md3/eslint-rules/no-legacy-z-tokens.js";
import noHardcodedMotionValues from "./scripts/md3/eslint-rules/no-hardcoded-motion-values.mjs";
import noInvalidComponentProps from "./scripts/md3/eslint-rules/no-invalid-component-props.mjs";
import noHardcodedViewportUnits from "./scripts/md3/eslint-rules/no-hardcoded-viewport-units.js";
import noHardcodedPercentages from "./scripts/md3/eslint-rules/no-hardcoded-percentages.js";

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
      "**/scripts/**"
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
  // Design System Conformity Rules
  {
    files: ['src/**/*.{ts,tsx}'],
    plugins: {
      'design-system': {
        rules: {
          'no-hardcoded-colors': noHardcodedColors,
          'enforce-token-usage': enforceTokenUsage,
          'no-new-css-files': noNewCssFiles,
          'no-classname': noClassname,
          'no-tailwind-classes': noTailwindClasses,
          'no-hardcoded-layout-values': noHardcodedLayoutValues,
          'no-numeric-zindex': noNumericZindex,
          'no-legacy-z-tokens': noLegacyZTokens,
          'no-hardcoded-motion-values': noHardcodedMotionValues,
          'no-invalid-component-props': noInvalidComponentProps,
          'no-hardcoded-viewport-units': noHardcodedViewportUnits,
          'no-hardcoded-percentages': noHardcodedPercentages
        }
      }
    },
    rules: {
      'design-system/no-hardcoded-colors': 'error',
      'design-system/enforce-token-usage': 'error',
      'design-system/no-new-css-files': 'warn',
      'design-system/no-classname': 'error',
      'design-system/no-tailwind-classes': 'error',
      'design-system/no-hardcoded-layout-values': 'error',
      'design-system/no-numeric-zindex': 'error',
      'design-system/no-legacy-z-tokens': 'error',
      'design-system/no-hardcoded-motion-values': 'error',
      'design-system/no-invalid-component-props': 'error',
      'design-system/no-hardcoded-viewport-units': 'error',
      'design-system/no-hardcoded-percentages': 'error',
      // MUI restriction removed - migration complete (Phase 3, 2026-01-06)
      // Previously blocked @mui/material, @emotion/react, @emotion/styled
      // All components now use custom M3 implementation (see PHASE_3_MIGRATION_COMPLETE.md)
    }
  },
  // Infrastructure files: Relax MD3-specific rules
  // Reason: tokens.ts and theme.tsx define MD3 tokens and may need direct CSS variable usage,
  // utility classes for token generation, or className for theme application
  {
    files: ['src/theme/tokens.ts', 'src/theme/theme.tsx'],
    rules: {
      'design-system/no-classname': 'off', // May need className for body theme application
      'design-system/no-tailwind-classes': 'off', // May use utility classes in token definitions
      'design-system/no-hardcoded-colors': 'warn', // Still warn but allow for token definitions
      'design-system/enforce-token-usage': 'off' // May define tokens directly
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
  {
    files: ['**/NKANodeCard.tsx'],
    rules: {
      'react/react-in-jsx-scope': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
    },
  },
]);
