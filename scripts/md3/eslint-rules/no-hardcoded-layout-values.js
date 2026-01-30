/**
 * ESLint Rule: no-hardcoded-layout-values
 * 
 * BLOCKS all hardcoded layout values in JSX style attributes.
 * Enforces STRICT MD3 token-only policy.
 * 
 * Applied to: src files
 * Severity: ERROR
 */

export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'Block hardcoded layout values - vh/vw/fr/auto/numeric literals forbidden',
      category: 'Design System Conformity',
      recommended: true
    },
    fixable: null,
    schema: []
  },
  create(context) {
    const VIEWPORT_UNITS = /\d+(vh|vw|vmin|vmax)/;
    const GRID_FR_UNITS = /\d+fr/;
    const PERCENTAGE = /\d+%/;
    const AUTO_KEYWORD = /\bauto\b/;
    const FLEX_NUMERIC = /^['"]?\d+\s+\d+\s+(auto|0)/;
    
    return {
      Property(node) {
        const keyName = node.key.name || node.key.value;
        const value = node.value;
        
        if (!value || value.type !== 'Literal' || typeof value.value !== 'string') {
          return;
        }
        
        const val = value.value;
        
        // BLOCK: viewport units
        if (VIEWPORT_UNITS.test(val)) {
          context.report({
            node: value,
            message: `MD3 VIOLATION: Viewport unit in '${keyName}: ${val}'. Use var(--md-sys-viewport-*) token.`
          });
        }
        
        // BLOCK: grid fr units
        if (/gridTemplate|grid-template/i.test(keyName) && GRID_FR_UNITS.test(val)) {
          context.report({
            node: value,
            message: `MD3 VIOLATION: Grid 'fr' unit in '${keyName}: ${val}'. Use var(--md-sys-grid-fr-*) token.`
          });
        }
        
        // BLOCK: percentage units (except transform which is allowed)
        if (!/transform/i.test(keyName) && PERCENTAGE.test(val)) {
          // Allow percentages in color-mix functions
          if (!/color-mix/i.test(val)) {
            context.report({
              node: value,
              message: `MD3 VIOLATION: Percentage unit in '${keyName}: ${val}'. Use var(--md-sys-percent-*) token.`
            });
          }
        }
        
        // BLOCK: auto keyword in margin
        if (/margin/i.test(keyName) && AUTO_KEYWORD.test(val)) {
          // Allow var(--md-sys-margin-auto) token or semantic var(--app-layout-auto) token
          if (!val.includes('var(--md-sys-margin-auto)') && !val.includes('var(--app-layout-auto)')) {
            context.report({
              node: value,
              message: `MD3 VIOLATION: 'auto' keyword in '${keyName}: ${val}'. Use var(--md-sys-margin-auto) or var(--app-layout-auto) token.`
            });
          }
        }
        
        // BLOCK: numeric flex values
        if (/^flex$/i.test(keyName) && FLEX_NUMERIC.test(val)) {
          context.report({
            node: value,
            message: `MD3 VIOLATION: Numeric flex value '${val}'. Use var(--md-sys-flex-*) token.`
          });
        }
        
        // BLOCK: any style value not starting with var(--md- or var(--app-
        if (/^(width|height|min|max|padding|margin|gap|spacing)/i.test(keyName)) {
          // Allow if value contains MD3 tokens, semantic tokens, or is allowed literal
          const hasMD3Token = val.includes('var(--md-') || val.includes('var(--z-');
          const hasSemanticToken = val.includes('var(--app-');
          const isAllowedLiteral = val === '0' || val === 'none' || val === 'inherit' || val === 'unset' || val === 'fit-content';
          if (!hasMD3Token && !hasSemanticToken && !isAllowedLiteral) {
            context.report({
              node: value,
              message: `MD3 VIOLATION: '${keyName}: ${val}' does not use MD3 token. MUST be var(--md-sys-*) or var(--app-*) semantic token.`
            });
          }
        }
      }
    };
  }
};
