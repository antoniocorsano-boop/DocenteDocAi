/**
 * ESLint Rule: no-tailwind-classes
 *
 * Prevents Tailwind utility classes in UI components, enforcing MD3 token usage.
 * Relaxed for infrastructure files (tokens.ts, theme.tsx).
 *
 * Applied to: UI components
 * Severity: error
 */

export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'Ban Tailwind utility classes in UI components, use MD3 tokens',
      category: 'MD3 Compliance',
      recommended: true
    },
    fixable: null,
    schema: []
  },
  create(context) {
    // Common Tailwind classes to detect
    const tailwindClasses = [
      'p-', 'm-', 'space-', 'gap-', 'flex', 'grid', 'block', 'inline', 'hidden',
      'text-', 'bg-', 'border-', 'rounded-', 'shadow-', 'w-', 'h-', 'min-', 'max-'
    ];

    return {
      JSXAttribute(node) {
        if (node.name.name === 'className' && node.value && node.value.type === 'Literal') {
          const classNames = node.value.value.split(' ');
          for (const className of classNames) {
            for (const twClass of tailwindClasses) {
              if (className.startsWith(twClass)) {
                context.report({
                  node,
                  message: `Tailwind class '${className}' not allowed. Use MD3 tokens in inline styles.`
                });
                break;
              }
            }
          }
        }
      }
    };
  }
};