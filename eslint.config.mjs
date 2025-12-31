import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";

export default defineConfig([
  { files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"], plugins: { js }, extends: ["js/recommended"], languageOptions: { globals: globals.browser } },
  tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      '@typescript-eslint/no-unused-expressions': 'warn',
      '@typescript-eslint/ban-ts-comment': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      'no-empty': 'warn',
      'no-prototype-builtins': 'off',
    },
  },
  {
    ignores: [
      "__tests__/**/*.test.tsx",
      "__tests__/**/*.test.ts",
      "__tests__/**/*.spec.tsx",
      "__tests__/**/*.spec.ts",
      "src/**/*.test.tsx",
      "src/**/*.test.ts",
      "src/**/*.spec.tsx",
      "src/**/*.spec.ts"
    ]
  }
]);
