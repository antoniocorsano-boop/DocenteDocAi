/**
 * ESLint Rule: no-numeric-zindex
 * 
 * BLOCKS numeric z-index values and legacy --z-* tokens.
 * Enforces MD3 CSS variable var(--md-sys-z-*) pattern only.
 * 
 * Applied to: src files
 * Severity: ERROR
 */

export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'Block numeric z-index and legacy --z-* tokens - only MD3 --md-sys-z-* variables allowed',
      category: 'Design System Conformity',
      recommended: true
    },
    fixable: null,
    schema: []
  },
  create(context) {
    return {
      Property(node) {
        const keyName = node.key.name || node.key.value;
        
        if (/^zIndex$/i.test(keyName)) {
          const value = node.value;
          
          // BLOCK: Numeric literal
          if (value.type === 'Literal' && typeof value.value === 'number') {
            context.report({
              node: value,
              message: `MD3 VIOLATION: Numeric z-index ${value.value}. Use zIndex: 'var(--md-sys-z-*)' instead.`
            });
          }
          
          // BLOCK: String numeric
          if (value.type === 'Literal' && typeof value.value === 'string' && /^\d+$/.test(value.value)) {
            context.report({
              node: value,
              message: `MD3 VIOLATION: String numeric z-index '${value.value}'. Use zIndex: 'var(--md-sys-z-*)' instead.`
            });
          }
          
          // BLOCK: MemberExpression (Z_INDEX.foo.bar)
          if (value.type === 'MemberExpression') {
            context.report({
              node: value,
              message: `MD3 VIOLATION: z-index from JS constant. Use zIndex: 'var(--md-sys-z-*)' CSS variable instead.`
            });
          }
          
          // BLOCK: Legacy --z-* CSS variables
          if (value.type === 'Literal' && typeof value.value === 'string' && value.value.includes('--z-')) {
            context.report({
              node: value,
              message: `MD3 VIOLATION: Legacy z-index token '${value.value}'. Use var(--md-sys-z-*) instead.`
            });
          }
          
          // ALLOW ONLY: String starting with 'var(--md-sys-z-'
          if (value.type === 'Literal' && typeof value.value === 'string') {
            if (!value.value.startsWith('var(--md-sys-z-')) {
              context.report({
                node: value,
                message: `MD3 VIOLATION: z-index '${value.value}' must be var(--md-sys-z-*) CSS variable.`
              });
            }
          }
        }
      }
    };
  }
};
