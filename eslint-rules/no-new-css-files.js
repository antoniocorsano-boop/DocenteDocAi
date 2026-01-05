/**
 * ESLint Rule: no-new-css-files
 * 
 * Prevents creation of new standalone CSS files in src/ directory.
 * Encourages use of CSS-in-JS, CSS Modules, or Tailwind utilities instead.
 * 
 * Exception: .module.css files are allowed for component-scoped styles
 * 
 * Applied to: src
 * Severity: warn
 */

export default {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Prevent creation of new global CSS files to enforce design system usage',
      category: 'Design System Conformity',
      recommended: false
    },
    fixable: null,
    schema: []
  },
  create(context) {
    const filename = context.filename;

    // Only check CSS files
    if (!filename.endsWith('.css')) {
      return {};
    }

    // Allow .module.css files (component-scoped)
    if (filename.includes('.module.css')) {
      return {};
    }

    // Allow specific legacy files that are already in use
    const allowedLegacyFiles = [
      'Menu.css',
      'navigation-rail.css',
      'dialog-container.css',
      'typography.css',
      'breakpoints.css',
      'spacing.css'
    ];

    const isAllowed = allowedLegacyFiles.some(f => filename.endsWith(f));

    if (!isAllowed && filename.startsWith('src')) {
      return {
        Program(node) {
          context.report({
            node,
            message: `New CSS file '${filename}' detected. Use CSS Modules (.module.css), Tailwind utilities, or design tokens (CSS variables) instead of global CSS.`,
            suggest: [
              {
                desc: 'Convert to .module.css for component scoping',
                fix() {
                  return null; // Manual fix required
                }
              },
              {
                desc: 'Use Tailwind classes instead',
                fix() {
                  return null;
                }
              },
              {
                desc: 'Use CSS variables from design-system',
                fix() {
                  return null;
                }
              }
            ]
          });
        }
      };
    }

    return {};
  }
};
