#!/usr/bin/env node
/**
 * Comprehensive MD3 Token Migration for All Component Files
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob').sync || null;

const files = [
  'src/components/HelpModal.tsx',
  'src/components/App.tsx',
  'src/components/VideoAnalysisModal.tsx'
];

// Token mapping from CSS variables to theme tokens
const tokenMap = {
  // Colors
  'color-surface-container-low': 'theme.layers.sys.colors.surfaceContainerLow',
  'color-surface-container-high': 'theme.layers.sys.colors.surfaceContainerHigh',
  'color-surface-container': 'theme.layers.sys.colors.surfaceContainer',
  'color-outline-variant': 'theme.layers.sys.colors.outlineVariant',
  'color-outline': 'theme.layers.sys.colors.outline',
  'color-primary': 'theme.layers.sys.colors.primary',
  'color-secondary': 'theme.layers.sys.colors.secondary',
  'color-on-surface': 'theme.layers.sys.colors.onSurface',
  'color-on-surface-variant': 'theme.layers.sys.colors.onSurfaceVariant',
  
  // Spacing
  'spacing-1': "theme.layers.ref.spacing['1']",
  'spacing-2': "theme.layers.ref.spacing['2']",
  'spacing-3': "theme.layers.ref.spacing['3']",
  'spacing-4': "theme.layers.ref.spacing['4']",
  'spacing-5': "theme.layers.ref.spacing['5']",
  'spacing-6': "theme.layers.ref.spacing['6']",
  'spacing-8': "theme.layers.ref.spacing['8']",
  
  // Shape
  'shape-corner-small': 'theme.layers.ref.shape.small',
  'shape-corner-medium': 'theme.layers.ref.shape.medium',
  'shape-corner-large': 'theme.layers.ref.shape.large',
  'shape-corner-extra-large': 'theme.layers.ref.shape.extraLarge',
  
  // Motion
  'motion-easing-standard': 'theme.layers.motion.easing.standard',
  'motion-duration-short': 'theme.layers.motion.duration.short',
  'motion-duration-medium': 'theme.layers.motion.duration.medium',
  
  // Typescale (keep these as-is for now - they're used directly in fonts)
};

function getTokenExpr(varName) {
  return tokenMap[varName] || `/* UNKNOWN: ${varName} */`;
}

function migrateFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`⏭️  File not found: ${filePath}`);
    return false;
  }
  
  let content = fs.readFileSync(filePath, 'utf-8');
  const originalSize = content.length;
  
  // Convert string values with embedded var() calls to template literals
  content = content.replace(/'([^']*var\(--md-sys-[^)]+\)[^']*)'/g, (match) => {
    const cssValue = match.slice(1, -1); // Remove quotes
    
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
  
  // Replace simple var() calls (not in strings) with token references
  content = content.replace(/var\(--md-sys-([^)]+)\)/g, (match, varName) => {
    return getTokenExpr(varName);
  });
  
  // Write back only if changed
  if (content !== originalSize || content.length !== originalSize) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`✅ Migrated: ${filePath}`);
    return true;
  } else {
    console.log(`⏭️  No changes: ${filePath}`);
    return false;
  }
}

try {
  files.forEach(file => {
    const fullPath = path.join(__dirname, file);
    migrateFile(fullPath);
  });
  console.log('\n✅ All component migrations complete!');
} catch (error) {
  console.error('❌ Migration failed:', error.message);
  process.exit(1);
}
