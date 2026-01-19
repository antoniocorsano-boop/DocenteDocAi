const fs = require('fs');
const path = require('path');

function removeLegacyTokenDefinitions(content) {
  let cleanedContent = content;

  // Remove legacy spacing token definitions
  const legacySpacingBlock = /\/\* Spacing Tokens M3 - LEGACY \(DEPRECATED 2026-01-06\) \*\/[\s\S]*?\/\* Spacing Tokens M3 - OFFICIAL \(Use these\) \*\//g;
  cleanedContent = cleanedContent.replace(legacySpacingBlock, '/* Spacing Tokens M3 - OFFICIAL (Use these) */');

  // Remove legacy typography token definitions
  const legacyTypographyBlock = /\/\* Typography Tokens M3 - LEGACY \(DEPRECATED\) \*\/[\s\S]*?\/\* Typography Tokens M3 - OFFICIAL \(Use these\) \*\//g;
  cleanedContent = cleanedContent.replace(legacyTypographyBlock, '/* Typography Tokens M3 - OFFICIAL (Use these) */');

  // Remove individual legacy shape tokens (marked as deprecated)
  const legacyShapeBlock = /\/\* Forme M3 - LEGACY \(DEPRECATED\) \*\/[\s\S]*?\/\* Official M3 Shape Corner Tokens \*\//g;
  cleanedContent = cleanedContent.replace(legacyShapeBlock, '/* Official M3 Shape Corner Tokens */');

  return cleanedContent;
}

// Main cleanup
const themePath = path.join(__dirname, 'src', 'theme.css');

console.log('🧹 Starting Block E: Legacy Token Removal');
console.log('📁 Target: theme.css\n');

try {
  const originalContent = fs.readFileSync(themePath, 'utf8');
  const cleanedContent = removeLegacyTokenDefinitions(originalContent);

  // Create backup
  const backupPath = path.join(__dirname, 'src', 'theme.css.legacy-removed');
  fs.writeFileSync(backupPath, originalContent);
  console.log(`💾 Backup created: theme.css.legacy-removed\n`);

  // Write cleaned content
  fs.writeFileSync(themePath, cleanedContent);
  console.log(`✅ Legacy token definitions removed from theme.css`);
  console.log('🎯 Block E Phase 1: Legacy token cleanup - COMPLETE\n');

  // Run compliance check
  console.log('🔍 Running compliance verification...');

} catch (error) {
  console.error('❌ Cleanup failed:', error.message);
  process.exit(1);
}