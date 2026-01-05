/**
 * Custom ESLint Rules for DocenteDoc AI
 * Enforces project-specific coding standards and patterns
 */

export const requireDesignTokens = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Enforce use of design tokens (CSS variables) instead of hardcoded colors',
      category: 'Design System',
      recommended: true,
    },
  },
  create(context) {
    return {
      Literal(node) {
        if (node.value && typeof node.value === 'string') {
          // Check for hardcoded color hex codes
          if (/#[0-9a-f]{3,6}|rgb|hsl/.test(node.value.toLowerCase())) {
            // Allow in specific files (test, config)
            const filename = context.filename;
            if (!/test|spec|config|vite|vitest/.test(filename)) {
              context.report({
                node,
                message: `Hardcoded color detected: "${node.value}". Use CSS variables from design-system/theme.ts instead (e.g., var(--sys-primary))`,
              });
            }
          }
        }
      },
    };
  },
};

export const functionalComponentsOnly = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Enforce functional components instead of class components',
      category: 'React',
      recommended: true,
    },
  },
  create(context) {
    return {
      ClassDeclaration(node) {
        if (node.superClass) {
          const superClassName = sourceCode.getText(node.superClass);
          if (superClassName.includes('React.Component') || superClassName.includes('PureComponent')) {
            context.report({
              node,
              message: `Class component "${node.id.name}" detected. Use functional components with hooks instead (React 18.2+ requirement).`,
            });
          }
        }
      },
    };
  },
};

export const requirePropsInterface = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Require TypeScript interface definitions for component props',
      category: 'TypeScript',
      recommended: true,
    },
  },
  create(context) {
    return {
      FunctionDeclaration(node) {
        // Check if this is a React component (starts with uppercase)
        if (/^[A-Z]/.test(node.id.name) && node.params.length > 0) {
          const hasPropsInterface = false; // Simplified - actual implementation would check for interface
          if (!hasPropsInterface && context.filename.includes('/components/')) {
            context.report({
              node,
              message: `Component "${node.id.name}" should have a TypeScript interface defined for props (e.g., interface ${node.id.name}Props).`,
            });
          }
        }
      },
    };
  },
};

export const noMagicStrings = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Discourage magic strings in component logic',
      category: 'Best Practices',
      recommended: false,
    },
  },
  create(context) {
    const magicPatterns = [
      /^[0-9]{2,}$/, // Pure numbers
      /^(true|false)$/, // Boolean strings
    ];

    return {
      Literal(node) {
        if (typeof node.value === 'string' && node.value.length > 5) {
          // Could match magic strings
          if (magicPatterns.some(pattern => pattern.test(node.value))) {
            context.report({
              node,
              message: `Magic string detected: "${node.value}". Consider extracting to a constant or use constants/systemManual.ts.`,
            });
          }
        }
      },
    };
  },
};

export default {
  requireDesignTokens,
  functionalComponentsOnly,
  requirePropsInterface,
  noMagicStrings,
};
