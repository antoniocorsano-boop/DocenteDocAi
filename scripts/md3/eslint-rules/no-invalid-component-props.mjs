/**
 * ESLint Custom Rule: no-invalid-component-props
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * PURPOSE: Enforce MD3 component contracts, block invalid props/styles
 * PHASE: 6 (COMPONENT CONTRACTS)
 * SEVERITY: ERROR (non-overridable)
 * 
 * BLOCKS:
 * - Inline styles with hardcoded values (width, height, margin, padding, zIndex)
 * - Forbidden props on components (width, height, margin, padding, zIndex, transition, animation)
 * - Non-MD3 className utilities
 * - Hardcoded motion/color/layout values in inline styles
 * 
 * ALLOWS:
 * - var(--md-sys-*) token usage in inline styles
 * - MD3 component classes (m3-*, md3-*, aura-*, layout-*)
 * - CSS classes defined in MD3 design system
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'Enforce MD3 component contracts, disallow invalid props and inline styles',
      category: 'MD3 Governance',
      recommended: true,
    },
    messages: {
      forbiddenProp: 'Prop "{{propName}}" is forbidden on components. Use MD3 wrapper components or CSS classes with MD3 tokens instead.',
      hardcodedInlineStyle: 'Hardcoded {{property}} value "{{value}}" in inline style is forbidden. Use MD3 tokens: var(--md-sys-*)',
      hardcodedZIndex: 'Hardcoded zIndex "{{value}}" is forbidden. Use MD3 z-index tokens: var(--md-sys-z-*)',
      hardcodedMotion: 'Hardcoded motion value "{{value}}" is forbidden. Use MD3 motion tokens: var(--md-sys-motion-*)',
      hardcodedColor: 'Hardcoded color "{{value}}" is forbidden. Use MD3 color tokens: var(--md-sys-color-*)',
      invalidClassName: 'Non-MD3 className "{{className}}" detected. Use MD3 component classes (m3-*, md3-*) or remove className.',
    },
    schema: [],
    fixable: null,
  },

  create(context) {
    const sourceCode = context.sourceCode || context.getSourceCode();

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // FORBIDDEN PATTERNS
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    const FORBIDDEN_PROPS = [
      'width',
      'height',
      'margin',
      'padding',
      'zIndex',
      'transition',
      'animation',
      'gap',
      'top',
      'left',
      'right',
      'bottom',
    ];

    const LAYOUT_PROPS = ['width', 'height', 'margin', 'padding', 'gap', 'top', 'left', 'right', 'bottom'];
    const MOTION_PROPS = ['transition', 'animation', 'transitionDuration', 'animationDuration'];
    const COLOR_PROPS = ['color', 'backgroundColor', 'borderColor', 'fill', 'stroke'];

    // Allowed className patterns (MD3-compliant)
    const ALLOWED_CLASSNAME_PATTERNS = [
      /^m3-/,
      /^md3-/,
      /^aura-/,
      /^material-symbols-/,
      /^app-/,
      /^layout-/,
    ];

    // Utility class patterns (typically non-MD3)
    const UTILITY_CLASSNAME_PATTERNS = [
      /^w-/,          // width utilities
      /^h-/,          // height utilities
      /^p-/,          // padding utilities
      /^m-/,          // margin utilities
      /^gap-/,        // gap utilities
      /^text-/,       // text utilities
      /^bg-/,         // background utilities
      /^border-/,     // border utilities
      /^rounded-/,    // border-radius utilities
      /^shadow-/,     // shadow utilities
      /^z-/,          // z-index utilities
      /^transition-/, // transition utilities
      /^animate-/,    // animation utilities
    ];

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // HELPER FUNCTIONS
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    function isHardcodedLayoutValue(value) {
      return /^\d+(?:px|rem|em|%|vh|vw)$/.test(value) || /^[0-9.]+(px|rem|em|%)/.test(value);
    }

    function isHardcodedMotionValue(value) {
      return /\d+(?:ms|s)/.test(value) || /(?:ease|linear|cubic-bezier)/.test(value);
    }

    function isHardcodedColorValue(value) {
      return /^#[0-9a-fA-F]{3,6}$/.test(value) || /^rgb|rgba|hsl|hsla/.test(value);
    }

    function isAllowedClassName(className) {
      return ALLOWED_CLASSNAME_PATTERNS.some(pattern => pattern.test(className));
    }

    function isUtilityClassName(className) {
      return UTILITY_CLASSNAME_PATTERNS.some(pattern => pattern.test(className));
    }

    function checkInlineStyle(node, styleObj) {
      if (styleObj.type !== 'ObjectExpression') return;

      styleObj.properties.forEach(prop => {
        if (prop.type !== 'Property') return;

        const propName = prop.key.name || prop.key.value;
        const propValue = prop.value;

        // Check layout props
        if (LAYOUT_PROPS.includes(propName)) {
          if (propValue.type === 'Literal' && typeof propValue.value === 'string') {
            const value = propValue.value;
            // Allow MD3 tokens
            if (value.startsWith('var(--md-sys-')) return;
            
            if (isHardcodedLayoutValue(value)) {
              context.report({
                node: propValue,
                messageId: 'hardcodedInlineStyle',
                data: { property: propName, value },
              });
            }
          }
        }

        // Check zIndex
        if (propName === 'zIndex') {
          if (propValue.type === 'Literal' && typeof propValue.value === 'number') {
            context.report({
              node: propValue,
              messageId: 'hardcodedZIndex',
              data: { value: propValue.value.toString() },
            });
          }
        }

        // Check motion props
        if (MOTION_PROPS.includes(propName)) {
          if (propValue.type === 'Literal' && typeof propValue.value === 'string') {
            const value = propValue.value;
            // Allow MD3 tokens
            if (value.startsWith('var(--md-sys-motion-')) return;
            
            if (isHardcodedMotionValue(value)) {
              context.report({
                node: propValue,
                messageId: 'hardcodedMotion',
                data: { value },
              });
            }
          }
        }

        // Check color props
        if (COLOR_PROPS.includes(propName)) {
          if (propValue.type === 'Literal' && typeof propValue.value === 'string') {
            const value = propValue.value;
            // Allow MD3 tokens
            if (value.startsWith('var(--md-sys-color-')) return;
            // Allow keyword colors (transparent, inherit, etc.)
            if (/^(transparent|inherit|currentColor|initial|unset)$/i.test(value)) return;
            
            if (isHardcodedColorValue(value)) {
              context.report({
                node: propValue,
                messageId: 'hardcodedColor',
                data: { value },
              });
            }
          }
        }
      });
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // VISITOR FUNCTIONS
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    return {
      // Check JSX attributes for forbidden props
      JSXAttribute(node) {
        const propName = node.name && node.name.name;
        
        // Check forbidden props on components (uppercase = component)
        if (node.parent && node.parent.name && node.parent.name.name) {
          const componentName = node.parent.name.name;
          const isComponent = /^[A-Z]/.test(componentName);

          if (isComponent && FORBIDDEN_PROPS.includes(propName)) {
            // Allow zIndex on M3Menu since it's a wrapper that forwards to M3Popover
            if (componentName === 'M3Menu' && propName === 'zIndex') {
              return;
            }
            
            context.report({
              node,
              messageId: 'forbiddenProp',
              data: { propName },
            });
          }
        }

        // Check style attribute
        if (propName === 'style' && node.value && node.value.type === 'JSXExpressionContainer') {
          const expr = node.value.expression;
          if (expr.type === 'ObjectExpression') {
            checkInlineStyle(node, expr);
          }
        }

        // Check className attribute
        if (propName === 'className' && node.value) {
          let className = '';
          
          if (node.value.type === 'Literal') {
            className = node.value.value;
          } else if (node.value.type === 'JSXExpressionContainer' && node.value.expression.type === 'Literal') {
            className = node.value.expression.value;
          }

          if (className) {
            const classes = className.split(/\s+/);
            classes.forEach(cls => {
              if (cls && !isAllowedClassName(cls) && isUtilityClassName(cls)) {
                context.report({
                  node: node.value,
                  messageId: 'invalidClassName',
                  data: { className: cls },
                });
              }
            });
          }
        }
      },

      // Check object properties in style objects (e.g., const styles = { ... })
      ObjectExpression(node) {
        // Check if this is likely a style object (not comprehensive, but catches common patterns)
        const parent = node.parent;
        if (
          parent &&
          (parent.type === 'VariableDeclarator' ||
            parent.type === 'Property' ||
            parent.type === 'JSXExpressionContainer')
        ) {
          // Only check if it's in a JSX context or named like a style object
          const isStyleContext =
            (parent.type === 'JSXExpressionContainer') ||
            (parent.type === 'VariableDeclarator' && parent.id.name && /style|Style|STYLE/.test(parent.id.name)) ||
            (parent.type === 'Property' && parent.key.name && /style|Style/.test(parent.key.name));

          if (isStyleContext) {
            checkInlineStyle(node, node);
          }
        }
      },
    };
  },
};
