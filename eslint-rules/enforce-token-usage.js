/**
 * ESLint Rule: enforce-token-usage
 * 
 * Enforces that ALL layout values use MD3 tokens.
 * Any hardcoded unit is a BLOCKING ERROR.
 * 
 * Applied to: src files
 * Severity: ERROR
 */

export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'Enforce MD3 tokens - ZERO hardcoded values allowed',
      category: 'Design System Conformity',
      recommended: true
    },
    fixable: null,
    schema: []
  },
  create(context) {
    const FORBIDDEN_UNITS = /\d+(px|rem|em|%|vh|vw|fr)\b/;
    const LAYOUT_PROPERTIES = /^(padding|margin|gap|width|height|minWidth|minHeight|maxWidth|maxHeight|top|left|right|bottom|inset|fontSize|lineHeight|borderRadius|borderWidth)$/i;
    
    return {
      Property(node) {
        const keyName = node.key.name || node.key.value;
        
        if (LAYOUT_PROPERTIES.test(keyName)) {
          const value = node.value;
          
          if (value.type === 'Literal' && typeof value.value === 'string') {
            const val = value.value;
            
            // BLOCK: Any numeric unit
            if (FORBIDDEN_UNITS.test(val)) {
              context.report({
                node: value,
                message: `MD3 VIOLATION: Hardcoded unit in '${keyName}: ${val}'. MUST use var(--md-sys-*) token.`
              });
            }
            
            // BLOCK: calc() without tokens
            if (val.includes('calc') && !val.includes('var(--md-')) {
              context.report({
                node: value,
                message: `MD3 VIOLATION: calc() must use var(--md-sys-*) tokens only.`
              });
            }
            
            // BLOCK: CSS var with hardcoded fallback
            if (/var\([^)]+,\s*\d+(px|rem|em|%|vh|vw)/.test(val)) {
              context.report({
                node: value,
                message: `MD3 VIOLATION: CSS variable fallback contains hardcoded unit. Remove fallback or use MD3 token.`
              });
            }
          }
          
          // BLOCK: Template literals with hardcoded units
          if (value.type === 'TemplateLiteral') {
            const raw = context.sourceCode.getText(value);
            if (FORBIDDEN_UNITS.test(raw)) {
              context.report({
                node: value,
                message: `MD3 VIOLATION: Template literal contains hardcoded units. Use var(--md-sys-*) tokens.`
              });
            }
          }
        }
      },
      
      // BLOCK: className with spacing
      Literal(node) {
        if (typeof node.value === 'string' && /\b[pm]-\d+\b|\bgap-\d+\b/.test(node.value)) {
          context.report({
            node,
            message: `MD3 VIOLATION: className spacing not allowed. Use inline style with var(--md-sys-spacing-*).`
          });
        }
      }
    };
  }
};
