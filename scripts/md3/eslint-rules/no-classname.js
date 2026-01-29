/**
 * ESLint Rule: no-classname
 *
 * Prevents use of className in UI components, enforcing inline styles with MD3 tokens.
 * Relaxed for infrastructure files (tokens.ts, theme.tsx).
 *
 * Applied to: UI components
 * Severity: error
 */

export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'Ban className usage in UI components, use inline styles with MD3 tokens',
      category: 'MD3 Compliance',
      recommended: true
    },
    fixable: null,
    schema: []
  },
  create(context) {
    return {
      JSXAttribute(node) {
        if (node.name.name === 'className') {
          // Allow material-symbols-outlined class for Material Design icons
          const classValue = node.value?.value || '';
          if (classValue.includes('material-symbols-outlined')) {
            return;
          }
          context.report({
            node,
            message: 'className not allowed in UI components. Use inline style with MD3 tokens instead.'
          });
        }
      }
    };
  }
};