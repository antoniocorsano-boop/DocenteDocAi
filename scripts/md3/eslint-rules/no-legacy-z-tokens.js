/**
 * ESLint Rule: no-legacy-z-tokens
 *
 * BLOCKS legacy --z-* CSS variables.
 * Enforces MD3 --md-sys-z-* tokens only.
 *
 * Applied to: src files
 * Severity: ERROR
 */

export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'Block legacy --z-* tokens - only MD3 --md-sys-z-* variables allowed',
      category: 'Design System Conformity',
      recommended: true
    },
    fixable: null,
    schema: []
  },
  create(context) {
    return {
      // Check CSS-in-JS properties
      Property(node) {
        const keyName = node.key.name || node.key.value;
        const value = node.value;

        if (value.type === 'Literal' && typeof value.value === 'string') {
          const val = value.value;

          // BLOCK: Legacy --z-* CSS variables anywhere in the value
          if (val.includes('--z-') && !val.startsWith('var(--z-') && !val.includes('--md-sys-z-')) {
            context.report({
              node: value,
              message: `MD3 VIOLATION: Legacy z-index token '${val}'. Use var(--z-*) or var(--md-sys-z-*) instead.`
            });
          }
        }
      },

      // Check CSS files and style blocks
      'TaggedTemplateExpression[tag.name="css"]': function(node) {
        const quasi = node.quasi;
        const cssContent = quasi.quasis.map(q => q.value.raw).join('');

        // BLOCK: Legacy --z-* CSS variables in CSS
        if (cssContent.includes('--z-') && !cssContent.includes('var(--z-') && !cssContent.includes('--md-sys-z-')) {
          context.report({
            node: node,
            message: `MD3 VIOLATION: Legacy z-index token in CSS. Use var(--z-*) or var(--md-sys-z-*) instead.`
          });
        }
      },

      // Check for CSS custom property declarations
      'Property:matches([key.name=/^--/])': function(node) {
        const propName = node.key.name || node.key.value;

        // BLOCK: Legacy --z-* custom property declarations
        if (propName.startsWith('--z-')) {
          context.report({
            node: node.key,
            message: `MD3 VIOLATION: Legacy z-index token '${propName}'. Use --md-sys-z-* instead.`
          });
        }
      }
    };
  }
};