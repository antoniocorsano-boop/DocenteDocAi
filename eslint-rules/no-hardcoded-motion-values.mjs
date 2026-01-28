/**
 * ESLint Custom Rule: no-hardcoded-motion-values
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * PURPOSE: Enforce MD3 motion token usage, block hardcoded duration/easing
 * PHASE: 5 (MOTION & DURATION GOVERNANCE)
 * SEVERITY: ERROR (non-overridable)
 * 
 * BLOCKS:
 * - Hardcoded duration (ms, s)
 * - Hardcoded easing (ease, linear, cubic-bezier)
 * - transition: all (performance anti-pattern)
 * - animation-duration with numeric literals
 * - Non-MD3 motion variables
 * 
 * ALLOWS:
 * - var(--md-sys-motion-duration-*)
 * - var(--md-sys-motion-easing-*)
 * - Legacy --motion-* tokens (during migration period)
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'Enforce MD3 motion tokens, disallow hardcoded duration/easing values',
      category: 'MD3 Governance',
      recommended: true,
    },
    messages: {
      hardcodedDuration: 'Hardcoded duration "{{value}}" is forbidden. Use MD3 motion tokens: var(--md-sys-motion-duration-{short|medium|long|extra-long})',
      hardcodedEasing: 'Hardcoded easing "{{value}}" is forbidden. Use MD3 easing tokens: var(--md-sys-motion-easing-{standard|emphasized|decelerated|accelerated})',
      transitionAll: 'transition: all is forbidden (performance anti-pattern). Specify explicit properties.',
      nonMD3Variable: 'Non-MD3 motion variable "{{value}}" is deprecated. Use var(--md-sys-motion-*) tokens instead.',
      numericAnimationDuration: 'Numeric animation-duration "{{value}}" is forbidden. Use MD3 duration tokens.',
    },
    schema: [],
    fixable: null,
  },

  create(context) {
    const sourceCode = context.sourceCode || context.getSourceCode();

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // VIOLATION PATTERNS
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    const HARDCODED_DURATION_REGEX = /\b\d+(?:\.\d+)?(?:ms|s)\b/;
    const HARDCODED_EASING_REGEX = /\b(?:ease(?:-in-out|-in|-out)?|linear|cubic-bezier\([^)]+\))\b/;
    const TRANSITION_ALL_REGEX = /transition\s*:\s*['"]?\s*all\b/i;
    const NON_MD3_MOTION_VAR_REGEX = /var\(--motion-(?!easing-standard|easing-decelerate|easing-accelerate|easing-emphasized|easing-expressive|duration-short\d|duration-medium\d|duration-long\d)[a-zA-Z0-9-]+\)/;

    // MD3 tokens (allowed)
    const MD3_MOTION_TOKENS = [
      '--md-sys-motion-duration-short',
      '--md-sys-motion-duration-medium',
      '--md-sys-motion-duration-long',
      '--md-sys-motion-duration-extra-long',
      '--md-sys-motion-easing-standard',
      '--md-sys-motion-easing-emphasized',
      '--md-sys-motion-easing-decelerated',
      '--md-sys-motion-easing-accelerated',
    ];

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // HELPER FUNCTIONS
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    function isStyleProperty(node) {
      // Check if node is within a style object (inline or styled-component)
      return (
        node.parent &&
        node.parent.type === 'Property' &&
        node.parent.parent &&
        node.parent.parent.type === 'ObjectExpression'
      );
    }

    function checkStringValue(node, value) {
      // Skip if value references MD3 token
      if (MD3_MOTION_TOKENS.some(token => value.includes(token))) {
        return;
      }

      // Check for transition: all
      if (TRANSITION_ALL_REGEX.test(value)) {
        context.report({
          node,
          messageId: 'transitionAll',
        });
      }

      // Check for hardcoded duration (200ms, 0.3s)
      const durationMatch = value.match(HARDCODED_DURATION_REGEX);
      if (durationMatch) {
        context.report({
          node,
          messageId: 'hardcodedDuration',
          data: { value: durationMatch[0] },
        });
      }

      // Check for hardcoded easing (ease-in-out, cubic-bezier)
      const easingMatch = value.match(HARDCODED_EASING_REGEX);
      if (easingMatch) {
        context.report({
          node,
          messageId: 'hardcodedEasing',
          data: { value: easingMatch[0] },
        });
      }

      // Check for non-MD3 motion variables
      const nonMD3Match = value.match(NON_MD3_MOTION_VAR_REGEX);
      if (nonMD3Match) {
        context.report({
          node,
          messageId: 'nonMD3Variable',
          data: { value: nonMD3Match[0] },
        });
      }
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // VISITOR FUNCTIONS
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    return {
      // Check string literals in style objects
      Literal(node) {
        if (typeof node.value === 'string' && isStyleProperty(node)) {
          checkStringValue(node, node.value);
        }
      },

      // Check template literals in style objects
      TemplateLiteral(node) {
        if (isStyleProperty(node)) {
          const value = node.quasis.map(q => q.value.cooked).join('');
          checkStringValue(node, value);
        }
      },

      // Check JSX attribute values (style={{transition: '200ms'}})
      JSXAttribute(node) {
        if (
          node.name &&
          node.name.name === 'style' &&
          node.value &&
          node.value.type === 'JSXExpressionContainer'
        ) {
          const expr = node.value.expression;
          if (expr.type === 'ObjectExpression') {
            expr.properties.forEach(prop => {
              if (
                prop.key &&
                (prop.key.name === 'transition' ||
                  prop.key.name === 'animation' ||
                  prop.key.name === 'transitionDuration' ||
                  prop.key.name === 'animationDuration')
              ) {
                if (prop.value.type === 'Literal' && typeof prop.value.value === 'string') {
                  checkStringValue(prop.value, prop.value.value);
                }
              }
            });
          }
        }
      },

      // Check object property keys for motion-related properties
      Property(node) {
        if (
          node.key &&
          (node.key.name === 'transition' ||
            node.key.name === 'animation' ||
            node.key.name === 'transitionDuration' ||
            node.key.name === 'animationDuration' ||
            node.key.name === 'transitionTimingFunction' ||
            node.key.name === 'animationTimingFunction')
        ) {
          if (node.value.type === 'Literal' && typeof node.value.value === 'string') {
            checkStringValue(node.value, node.value.value);
          }

          // Check for numeric animation-duration (animationDuration: 300)
          if (
            (node.key.name === 'animationDuration' || node.key.name === 'transitionDuration') &&
            node.value.type === 'Literal' &&
            typeof node.value.value === 'number'
          ) {
            context.report({
              node: node.value,
              messageId: 'numericAnimationDuration',
              data: { value: node.value.value.toString() },
            });
          }
        }
      },
    };
  },
};
