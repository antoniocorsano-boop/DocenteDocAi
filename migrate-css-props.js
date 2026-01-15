#!/usr/bin/env node
/**
 * Comprehensive MD3 Token Migration for Settings.tsx
 * Handles CSS shorthand properties, template literals, and complex patterns
 */

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/components/Settings.tsx');

// Helper function to create template literal from value
function createTemplateLiteral(cssValue) {
  if (!cssValue.includes('var(--md-sys-')) {
    return `'${cssValue}'`;
  }
  
  // Replace each var() with interpolation
  let result = cssValue.replace(/var\(--md-sys-([^)]+)\)/g, (match, varName) => {
    return `\${tokenFor('${varName}')}`;
  });
  
  return `\`${result}\``;
}

// Token lookup function (inline)
const getTokenExpr = (varName) => {
  const tokenMap = {
    'color-surface-container-low': 'theme.layers.sys.colors.surfaceContainerLow',
    'color-surface-container-high': 'theme.layers.sys.colors.surfaceContainerHigh',
    'color-surface-container-highest': 'theme.layers.sys.colors.surfaceContainerHighest',
    'color-surface-container': 'theme.layers.sys.colors.surfaceContainer',
    'color-outline-variant': 'theme.layers.sys.colors.outlineVariant',
    'color-outline': 'theme.layers.sys.colors.outline',
    'color-primary': 'theme.layers.sys.colors.primary',
    'color-secondary': 'theme.layers.sys.colors.secondary',
    'color-tertiary': 'theme.layers.sys.colors.tertiary',
    'color-error': 'theme.layers.sys.colors.error',
    'color-on-surface': 'theme.layers.sys.colors.onSurface',
    'color-on-surface-variant': 'theme.layers.sys.colors.onSurfaceVariant',
    'color-on-primary-container': 'theme.layers.sys.colors.onPrimaryContainer',
    'color-on-secondary-container': 'theme.layers.sys.colors.onSecondaryContainer',
    'color-on-tertiary-container': 'theme.layers.sys.colors.onTertiaryContainer',
    'color-on-error-container': 'theme.layers.sys.colors.onErrorContainer',
    'color-primary-container': 'theme.layers.sys.colors.primaryContainer',
    'color-secondary-container': 'theme.layers.sys.colors.secondaryContainer',
    'color-tertiary-container': 'theme.layers.sys.colors.tertiaryContainer',
    'color-error-container': 'theme.layers.sys.colors.errorContainer',
    'spacing-1': "theme.layers.ref.spacing['1']",
    'spacing-2': "theme.layers.ref.spacing['2']",
    'spacing-3': "theme.layers.ref.spacing['3']",
    'spacing-4': "theme.layers.ref.spacing['4']",
    'spacing-5': "theme.layers.ref.spacing['5']",
    'spacing-6': "theme.layers.ref.spacing['6']",
    'spacing-8': "theme.layers.ref.spacing['8']",
    'spacing-12': "theme.layers.ref.spacing['12']",
    'spacing-14': "theme.layers.ref.spacing['14']",
    'spacing-16': "theme.layers.ref.spacing['16']",
    'spacing-32': "theme.layers.ref.spacing['32']",
    'shape-corner-small': 'theme.layers.ref.shape.small',
    'shape-corner-medium': 'theme.layers.ref.shape.medium',
    'shape-corner-large': 'theme.layers.ref.shape.large',
    'shape-corner-extra-large': 'theme.layers.ref.shape.extraLarge',
    'shape-corner-full': 'theme.layers.ref.shape.full',
    'motion-easing-standard': 'theme.layers.motion.easing.standard',
    'motion-easing-emphasized': 'theme.layers.motion.easing.emphasized',
    'motion-duration-short': 'theme.layers.motion.duration.short',
    'motion-duration-medium': 'theme.layers.motion.duration.medium',
    'motion-duration-short1': 'theme.layers.motion.duration.short1',
    'motion-duration-short2': 'theme.layers.motion.duration.short2',
    'motion-duration-medium1': 'theme.layers.motion.duration.medium1',
    'motion-duration-medium2': 'theme.layers.motion.duration.medium2',
    'elevation-level0': 'theme.layers.elevation.level0',
    'elevation-level1': 'theme.layers.elevation.level1',
    'elevation-level2': 'theme.layers.elevation.level2',
    'elevation-level3': 'theme.layers.elevation.level3',
    'elevation-level4': 'theme.layers.elevation.level4',
    'elevation-level5': 'theme.layers.elevation.level5',
  };
  
  return tokenMap[varName] || `/* UNKNOWN: ${varName} */`;
};

try {
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Pattern 1: String values with var() - convert to template literals
  // Match: '..var(--md-sys-X-Y)...'
  content = content.replace(/'([^']*var\(--md-sys-[^)]+\)[^']*)'/g, (match) => {
    const cssValue = match.slice(1, -1); // Remove quotes
    
    // Build template literal
    let templateContent = cssValue;
    const varPattern = /var\(--md-sys-([^)]+)\)/g;
    const replacements = [];
    
    let m;
    while ((m = varPattern.exec(cssValue)) !== null) {
      const tokenExpr = getTokenExpr(m[1]);
      replacements.push({ full: m[0], token: tokenExpr });
    }
    
    replacements.forEach(r => {
      templateContent = templateContent.replace(r.full, `\${${r.token}}`);
    });
    
    return `\`${templateContent}\``;
  });
  
  fs.writeFileSync(filePath, content, 'utf-8');
  console.log('✅ Second-pass migration complete - CSS properties converted to template literals');
  
} catch (error) {
  console.error('❌ Migration failed:', error.message);
  console.error(error);
  process.exit(1);
}
