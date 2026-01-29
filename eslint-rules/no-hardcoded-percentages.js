export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow hardcoded percentage values',
      category: 'MD3 Compliance',
    },
    messages: {
      noPercentages: 'Hardcoded percentage "{{percentage}}" is forbidden. Use MD3 percent tokens: var(--md-sys-percent-*)',
    },
  },
  create(context) {
    return {
      Literal(node) {
        if (typeof node.value === 'string') {
          // Match percentages not preceded by MD3 token
          const percentRegex = /(?<!(?:var\(--md-sys-percent-))\b\d+(?:\.\d+)?%\b/g;
          let match;
          while ((match = percentRegex.exec(node.value)) !== null) {
            context.report({
              node,
              messageId: 'noPercentages',
              data: { percentage: match[0] },
            });
          }
        }
      },
      TemplateLiteral(node) {
        const fullText = node.quasis.map(quasi => quasi.value.raw).join('');
        // Match percentages not preceded by MD3 token
        const percentRegex = /(?<!(?:var\(--md-sys-percent-))\b\d+(?:\.\d+)?%\b/g;
        let match;
        while ((match = percentRegex.exec(fullText)) !== null) {
          context.report({
            node,
            messageId: 'noPercentages',
            data: { percentage: match[0] },
          });
        }
      },
    };
  },
};