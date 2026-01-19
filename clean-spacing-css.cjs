const fs = require('fs');
const path = require('path');

function cleanSpacingCSS(content) {
  // Remove the legacy spacing variable definitions block
  const legacyVarsBlock = /\/\* ========================================\s+CSS VARIABLES \(already defined in index\.ts\)\s+======================================== \*\/[\s\S]*?:root \{\s+\/\* var\(--md-sys-spacing-1\) base unit multiples \*\/[\s\S]*?--spacing-24: 6rem;\s+\/\* 96px \*\/\s+\}/;

  let cleaned = content.replace(legacyVarsBlock, '/* ========================================\n   MD3 Spacing Variables (defined in theme.css)\n   ======================================== */');

  return cleaned;
}

// Main cleanup
const spacingPath = path.join(__dirname, 'src', 'design-system', 'spacing.css');

console.log('🧹 Cleaning design-system/spacing.css');
console.log('📁 Removing legacy spacing variable definitions\n');

try {
  const originalContent = fs.readFileSync(spacingPath, 'utf8');
  const cleanedContent = cleanSpacingCSS(originalContent);

  // Create backup
  const backupPath = path.join(__dirname, 'src', 'design-system', 'spacing.css.backup');
  fs.writeFileSync(backupPath, originalContent);
  console.log(`💾 Backup created: spacing.css.backup\n`);

  // Write cleaned content
  fs.writeFileSync(spacingPath, cleanedContent);
  console.log(`✅ Legacy spacing definitions removed from spacing.css`);

} catch (error) {
  console.error('❌ Cleanup failed:', error.message);
  process.exit(1);
}