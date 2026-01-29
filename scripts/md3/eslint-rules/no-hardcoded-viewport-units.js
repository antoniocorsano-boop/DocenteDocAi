export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow hardcoded viewport units (vh, vw, vmin, vmax)',
      category: 'MD3 Compliance',
    },
    messages: {
      noViewportUnits: 'Hardcoded viewport unit "{{unit}}" is forbidden. Use MD3 viewport tokens: var(--md-sys-viewport-*)',
    },
  },
  create(context) {
    return {
      Literal(node) {
        if (typeof node.value === 'string') {
          const viewportRegex = /\b\d+(?:\.\d+)?(?:vh|vw|vmin|vmax)\b/g;
          let match;
          while ((match = viewportRegex.exec(node.value)) !== null) {
            context.report({
              node,
              messageId: 'noViewportUnits',
              data: { unit: match[0] },
            });
          }
        }
      },
      TemplateLiteral(node) {
        const fullText = node.quasis.map(quasi => quasi.value.raw).join('');
        const viewportRegex = /\b\d+(?:\.\d+)?(?:vh|vw|vmin|vmax)\b/g;
        let match;
        while ((match = viewportRegex.exec(fullText)) !== null) {
          context.report({
            node,
            messageId: 'noViewportUnits',
            data: { unit: match[0] },
          });
        }
      },
    };
  },
};