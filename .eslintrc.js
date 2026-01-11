/**
 * ESLint Configuration for React + Material Design 3 Project
 *
 * Rationale for rule differentiation:
 * - Infrastructure files (e.g., tokens.ts, theme.tsx) define raw design tokens and context, so MD3-specific rules
 *   (e.g., no hardcoded colors) are relaxed to avoid false positives while keeping core TS/hook rules.
 * - UI components enforce strict MD3 to ensure compliance and prevent regressions.
 * - No files are ignored; overrides ensure targeted relaxation without compromising overall quality.
 * - Strategy for future infrastructure: Use glob patterns (e.g., src/theme/**) to automatically include new files
 *   in the theme directory without manual config edits, promoting maintainability.
 * - Trade-off: Slight risk of hardcoded values in infrastructure, but mitigated by manual review and core rules.
 */

module.exports = {
  // Base parser and plugins for React/TypeScript
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ['@typescript-eslint', 'react', 'react-hooks'],
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
  ],
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    // Core rules active everywhere (TS, hooks, unused vars) - never disabled
    'no-unused-vars': 'off', // Disabled in favor of TS version
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    '@typescript-eslint/no-explicit-any': 'warn',
    // MD3-specific rules: Enforced globally for UI components - not disabled here
    'no-hardcoded-colors': 'error', // Prohibits hex/rgba in styles (custom rule)
    'no-hardcoded-spacing': 'error', // Prohibits px/rem in styles (custom rule)
    'no-classname': 'error', // Prohibits className (custom rule)
    'no-tailwind': 'error', // Prohibits Tailwind utilities (custom rule)
  },
  overrides: [
    {
      // Infrastructure files: Relax MD3 rules to allow token definitions
      // Pattern: Matches current (tokens.ts, theme.tsx) and future files in src/theme/** for scalability
      // Trade-off: Allows hardcoded values in these files, but prevents bugs via core rules; easy to add new infra files
      files: ['src/theme/**/*.ts', 'src/theme/**/*.tsx'],
      rules: {
        'no-hardcoded-colors': 'off', // Allows defining color palettes without false positives; trade-off: manual review needed for correctness
        'no-hardcoded-spacing': 'off', // Allows defining spacing tokens without false positives; trade-off: manual review needed for correctness
        'no-classname': 'off', // Not applicable; infrastructure doesn't use className; trade-off: none, as it's irrelevant here
        'no-tailwind': 'off', // Not applicable; infrastructure doesn't use Tailwind; trade-off: none, as it's irrelevant here
      },
    },
  ],
};
