/**
 * ESLint Rule: require-useTheme
 *
 * No-op rule - MD3 tokens are consumed via CSS variables only.
 * JavaScript must NEVER define, compute, store, or expose design tokens.
 */

export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'No-op - MD3 tokens via CSS variables only',
      category: 'MD3 Compliance',
      recommended: false
    },
    fixable: null,
    schema: []
  },
  create() {
    return {};
  }
};