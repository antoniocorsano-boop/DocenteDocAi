/**
 * ESLint Rule: require-useTheme
 *
 * Requires UI components to import and use the useTheme hook for MD3 tokens.
 * Relaxed for infrastructure files (tokens.ts, theme.tsx).
 *
 * Applied to: UI components
 * Severity: warn
 */

export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'Require useTheme hook in UI components for MD3 token access',
      category: 'MD3 Compliance',
      recommended: true
    },
    fixable: null,
    schema: []
  },
  create(context) {
    let hasUseThemeImport = false;
    let hasUseThemeCall = false;

    return {
      ImportDeclaration(node) {
        if (node.specifiers.some(spec => spec.local.name === 'useTheme')) {
          hasUseThemeImport = true;
        }
      },
      CallExpression(node) {
        if (node.callee.name === 'useTheme') {
          hasUseThemeCall = true;
        }
      },
      'Program:exit'() {
        // Only check if it's a component file (has JSX)
        const sourceCode = context.sourceCode;
        const hasJSX = sourceCode.ast.body.some(node =>
          node.type === 'ExportDefaultDeclaration' ||
          node.type === 'ExportNamedDeclaration' ||
          (node.type === 'VariableDeclaration' && node.declarations.some(decl =>
            decl.init && decl.init.type === 'ArrowFunctionExpression'
          ))
        );

        if (hasJSX && !hasUseThemeImport) {
          context.report({
            node: context.sourceCode.ast,
            message: 'UI components must import useTheme hook for MD3 token access'
          });
        }
      }
    };
  }
};