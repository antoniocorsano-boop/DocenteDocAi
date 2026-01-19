const fs = require('fs');
const path = require('path');

// Legacy tokens to check for
const LEGACY_TOKENS = {
  spacing: [
    '--spacing-0', '--spacing-1', '--spacing-2', '--spacing-3', '--spacing-4',
    '--spacing-5', '--spacing-6', '--spacing-8', '--spacing-10', '--spacing-12', '--spacing-16'
  ],
  typography: [
    '--typography-display-large-fontSize', '--typography-display-large-fontFamily',
    '--typography-display-large-fontWeight', '--typography-display-large-lineHeight',
    '--typography-display-large-letterSpacing', '--typography-display-medium-fontSize',
    '--typography-display-medium-fontFamily', '--typography-display-medium-fontWeight',
    '--typography-display-medium-lineHeight', '--typography-display-medium-letterSpacing',
    '--typography-display-small-fontSize', '--typography-display-small-fontFamily',
    '--typography-display-small-fontWeight', '--typography-display-small-lineHeight',
    '--typography-display-small-letterSpacing', '--typography-headline-large-fontSize',
    '--typography-headline-large-fontFamily', '--typography-headline-large-fontWeight',
    '--typography-headline-large-lineHeight', '--typography-headline-large-letterSpacing'
  ]
};

function analyzeFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const violations = [];

  // Check for legacy spacing tokens
  LEGACY_TOKENS.spacing.forEach(token => {
    const regex = new RegExp(token.replace('--', '--'), 'g');
    const matches = content.match(regex);
    if (matches) {
      violations.push({
        type: 'legacy_spacing',
        token: token,
        count: matches.length,
        file: path.basename(filePath)
      });
    }
  });

  // Check for legacy typography tokens
  LEGACY_TOKENS.typography.forEach(token => {
    const regex = new RegExp(token.replace('--', '--'), 'g');
    const matches = content.match(regex);
    if (matches) {
      violations.push({
        type: 'legacy_typography',
        token: token,
        count: matches.length,
        file: path.basename(filePath)
      });
    }
  });

  return violations;
}

// Analyze HelpModal and related files
const helpModalPath = path.join(__dirname, 'src', 'components', 'HelpModal.tsx');
const themePath = path.join(__dirname, 'src', 'theme.css');

console.log('🔍 Analyzing HelpModal for legacy token usage...\n');

const helpModalViolations = analyzeFile(helpModalPath);
const themeViolations = analyzeFile(themePath);

console.log('HelpModal.tsx violations:');
if (helpModalViolations.length === 0) {
  console.log('  ✅ No legacy tokens found in component');
} else {
  helpModalViolations.forEach(v => {
    console.log(`  🚫 ${v.token} (${v.count} occurrences)`);
  });
}

console.log('\nTheme.css legacy token definitions:');
if (themeViolations.length === 0) {
  console.log('  ✅ No legacy tokens found');
} else {
  themeViolations.forEach(v => {
    console.log(`  🚫 ${v.token} (${v.count} occurrences)`);
  });
}

console.log(`\n📊 Summary: ${helpModalViolations.length} violations in HelpModal.tsx, ${themeViolations.length} legacy definitions in theme.css`);