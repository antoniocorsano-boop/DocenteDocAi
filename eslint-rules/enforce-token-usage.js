/**
 * ESLint Rule: enforce-token-usage
 * 
 * Enforces that spacing/padding/margin values use design tokens
 * (--spacing-*) instead of hardcoded px or arbitrary Tailwind values.
 * 
 * Applied to: src files
 * Severity: warn
 */

export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'Enforce use of spacing tokens (--spacing-*) instead of arbitrary values',
      category: 'Design System Conformity',
      recommended: true
    },
    fixable: null,
    schema: []
  },
  create(context) {
    // Valid Tailwind spacing equivalents
    const validTailwindSpacing = [
      'p-0', 'p-1', 'p-2', 'p-3', 'p-4', 'p-5', 'p-6', 'p-8', 'p-10', 'p-12', 'p-16', 'p-20',
      'm-0', 'm-1', 'm-2', 'm-3', 'm-4', 'm-6', 'm-8', 'm-10', 'm-12', 'm-16',
      'gap-0', 'gap-1', 'gap-2', 'gap-3', 'gap-4', 'gap-5', 'gap-6', 'gap-8', 'gap-10', 'gap-12',
      'space-x-2', 'space-x-4', 'space-x-6', 'space-y-2', 'space-y-4', 'space-y-6'
    ];

    return {
      // Check style properties for hardcoded padding/margin
      Property(node) {
        const keyName = node.key.name || node.key.value;
        
        // Check for padding, margin, gap properties
        if (/^(padding|margin|gap|gap-x|gap-y)$/i.test(keyName)) {
          const value = node.value;
          
          // Check for hardcoded px values (p-5, p-7, etc.)
          if (value.type === 'Literal' && typeof value.value === 'string') {
            const val = value.value;
            
            // Detect arbitrary pixel values
            if (/^\d+px$/.test(val)) {
              context.report({
                node: value,
                message: `Hardcoded pixel value '${val}'. Use CSS variable var(--spacing-*) instead.`
              });
            }

            // Detect arbitrary Tailwind values like 'p-5', 'p-7'
            if (/^[pm]?-[0-9]+$/.test(val) && !validTailwindSpacing.includes(val)) {
              context.report({
                node: value,
                message: `Arbitrary spacing value '${val}' not in spacing scale. Use p-4, p-6, p-8 or var(--spacing-*).`
              });
            }
          }

          // Check for hardcoded calc() expressions
          if (value.type === 'Literal' && typeof value.value === 'string' && value.value.includes('calc')) {
            const val = value.value;
            if (!val.includes('--spacing-') && !val.includes('var(')) {
              context.report({
                node: value,
                message: `Hardcoded calc() without tokens. Use var(--spacing-*) in calculations.`
              });
            }
          }
        }
      },

      // Check className strings for arbitrary spacing
      Literal(node) {
        if (typeof node.value === 'string' && /^[\w\s-]+$/.test(node.value)) {
          const classes = node.value.split(/\s+/);
          
          classes.forEach(cls => {
            // Check for arbitrary Tailwind spacing
            if (/^[pm]-[5-9]$|^[pm]-[0-9]{2,}$/.test(cls)) {
              // Allow valid spacing values
              if (!validTailwindSpacing.includes(cls)) {
                context.report({
                  node,
                  message: `Arbitrary spacing class '${cls}' in className. Use valid spacing scale (p-4, p-6, p-8, m-4, m-6, m-8, gap-4, gap-6, gap-8).`
                });
              }
            }

            // Check for arbitrary gap values
            if (/^gap-[5-9]$|^gap-[0-9]{2,}$/.test(cls)) {
              if (!validTailwindSpacing.includes(cls)) {
                context.report({
                  node,
                  message: `Arbitrary gap class '${cls}'. Use gap-4, gap-6, gap-8 from spacing scale.`
                });
              }
            }
          });
        }
      }
    };
  }
};
