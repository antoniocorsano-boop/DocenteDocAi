/**
 * ESLint Rule: no-hardcoded-colors
 * 
 * Detects hardcoded color values (#HEX or rgb/rgba) in component code
 * and suggests using design tokens (--sys-*) instead.
 * 
 * Applied to: src files
 * Severity: error
 */

export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'Enforce use of design tokens instead of hardcoded colors',
      category: 'Design System Conformity',
      recommended: true
    },
    fixable: null,
    hasSuggestions: true,
    schema: []
  },
  create(context) {
    const sourceCode = context.sourceCode;

    return {
      // Detect hardcoded hex colors like '#6750A4', '#FFFFFF', etc.
      Literal(node) {
        if (typeof node.value === 'string') {
          const value = node.value;

          // Check for hex colors (#HEX)
          if (/#[0-9a-fA-F]{6}\b/.test(value)) {
            context.report({
              node,
              message: `Hardcoded color '${value}' found. Use design tokens instead (e.g., var(--sys-primary))`,
              suggest: [
                {
                  desc: 'Replace with CSS variable reference',
                  fix(fixer) {
                    return fixer.replaceText(node, `'var(--sys-primary)'`);
                  }
                }
              ]
            });
          }

          // Check for rgb() or rgba() colors
          if (/\b(rgb|rgba)\s*\(/i.test(value)) {
            context.report({
              node,
              message: `Hardcoded RGB color '${value}' found. Use design tokens from color utilities instead.`,
              suggest: [
                {
                  desc: 'Use color token from design-system/utils',
                  fix(fixer) {
                    return fixer.replaceText(node, `getColorTokenRgb('--sys-primary')`);
                  }
                }
              ]
            });
          }
        }
      },

      // Detect colors in template literals (more complex patterns)
      TemplateLiteral(node) {
        const raw = sourceCode.getText(node);
        
        // Check for hex in template strings
        if (/#[0-9a-fA-F]{6}/.test(raw)) {
          const match = raw.match(/#[0-9a-fA-F]{6}/g);
          match?.forEach(color => {
            context.report({
              node,
              message: `Hardcoded color '${color}' in template literal. Use var(--sys-*) tokens.`
            });
          });
        }

        // Check for rgb in template strings
        if (/rgb\([^)]+\)/.test(raw)) {
          context.report({
            node,
            message: `Hardcoded RGB color in template literal. Use design tokens instead.`
          });
        }
      },

      // Detect colors in style attributes and objects
      Property(node) {
        if (node.key && /^(color|backgroundColor|borderColor|fill|stroke)$/i.test(node.key.name || node.key.value)) {
          const value = node.value;
          
          // Check literal values
          if (value.type === 'Literal' && typeof value.value === 'string') {
            if (/#[0-9a-fA-F]{6}/.test(value.value)) {
              context.report({
                node: value,
                message: `Hardcoded color '${value.value}' in style property. Use var(--sys-*) instead.`
              });
            }
          }

          // Check template literals
          if (value.type === 'TemplateLiteral') {
            const text = sourceCode.getText(value);
            if (/#[0-9a-fA-F]{6}/.test(text)) {
              context.report({
                node: value,
                message: `Hardcoded hex color in style property. Use CSS variables.`
              });
            }
          }
        }
      }
    };
  }
};
