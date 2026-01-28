/**
 * ESLint Rule: no-numeric-zindex
 * 
 * BLOCKS numeric z-index values.
 * Enforces CSS variable var(--z-*) pattern only.
 * 
 * Applied to: src files
 * Severity: ERROR
 */

export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'Block numeric z-index - only CSS variables allowed',
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
              message: `MD3 VIOLATION: Numeric z-index ${value.value}. Use zIndex: 'var(--z-*)' instead.`
            });
          }
          
          // BLOCK: String numeric
          if (value.type === 'Literal' && typeof value.value === 'string' && /^\d+$/.test(value.value)) {
            context.report({
              node: value,
              message: `MD3 VIOLATION: String numeric z-index '${value.value}'. Use zIndex: 'var(--z-*)' instead.`
            });
          }
          
          // BLOCK: MemberExpression (Z_INDEX.foo.bar)
          if (value.type === 'MemberExpression') {
            context.report({
              node: value,
              message: `MD3 VIOLATION: z-index from JS constant. Use zIndex: 'var(--z-*)' CSS variable instead.`
            });
          }
          
          // ALLOW ONLY: String starting with 'var(--z-'
          if (value.type === 'Literal' && typeof value.value === 'string') {
            if (!value.value.startsWith('var(--z-')) {
              context.report({
                node: value,
                message: `MD3 VIOLATION: z-index '${value.value}' must be var(--z-*) CSS variable.`
              });
            }
          }
        }
      }
    };
  }
};
