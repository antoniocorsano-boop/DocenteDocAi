const fs = require('fs');
const path = require('path');

function scanComponents() {
  const violations = [];
  const componentsDir = path.join(__dirname, 'src', 'components');

  function scanFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');
    const relativePath = path.relative(process.cwd(), filePath);

    // Check for className
    const classNameRegex = /className\s*=\s*["'][^"']*["']/g;
    lines.forEach((line, index) => {
      if (classNameRegex.test(line)) {
        violations.push({
          file: relativePath,
          line: index + 1,
          type: 'className',
          description: 'Uses className attribute',
          suggestion: 'Replace with inline style using MD3 tokens'
        });
      }
    });

    // Check for hardcoded colors
    const colorRegex = /#[0-9a-fA-F]{3,6}|rgb\([^)]+\)|rgba\([^)]+\)|hsl\([^)]+\)/g;
    lines.forEach((line, index) => {
      if (colorRegex.test(line) && !line.includes('var(--md-sys-')) {
        violations.push({
          file: relativePath,
          line: index + 1,
          type: 'hardcoded-color',
          description: 'Uses hardcoded color values',
          suggestion: 'Use var(--md-sys-color-*) tokens'
        });
      }
    });

    // Check for hardcoded spacing
    const spacingRegex = /\d+(px|rem|em|vh|vw|vmin|vmax)/g;
    lines.forEach((line, index) => {
      if (spacingRegex.test(line) && !line.includes('var(--md-sys-')) {
        violations.push({
          file: relativePath,
          line: index + 1,
          type: 'hardcoded-spacing',
          description: 'Uses hardcoded spacing units',
          suggestion: 'Use var(--md-sys-spacing-*) tokens'
        });
      }
    });

    // Check for Tailwind classes (common ones)
    const tailwindRegex = /\b(space-y-\d+|p-\d+|m-\d+|text-\w+|bg-\w+|border-\w+|rounded-\w+|shadow-\w+|flex|grid|block|inline|hidden)\b/g;
    lines.forEach((line, index) => {
      if (tailwindRegex.test(line)) {
        violations.push({
          file: relativePath,
          line: index + 1,
          type: 'tailwind-class',
          description: 'Uses Tailwind utility classes',
          suggestion: 'Replace with inline style using MD3 tokens'
        });
      }
    });

    // Check for missing useTheme
    const hasUseTheme = content.includes('useTheme');
    const hasM3ThemeProvider = content.includes('M3ThemeProvider');
    if (!hasUseTheme && !hasM3ThemeProvider && (content.includes('export') && (content.includes('function') || content.includes('const') && content.includes('=') && content.includes('(')))) {
      violations.push({
        file: relativePath,
        line: 1,
        type: 'missing-useTheme',
        description: 'Component does not use useTheme hook',
        suggestion: 'Import and use useTheme hook for MD3 tokens'
      });
    }
  }

  function scanDirectory(dir) {
    const items = fs.readdirSync(dir);
    items.forEach(item => {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
        scanDirectory(fullPath);
      } else if (stat.isFile() && item.endsWith('.tsx')) {
        scanFile(fullPath);
      }
    });
  }

  scanDirectory(componentsDir);
  return violations;
}

// Run the scan
const violations = scanComponents();
console.log(JSON.stringify(violations, null, 2));