const fs = require('fs');
const path = require('path');

function removeLegacyTypography(content) {
  // Remove the entire legacy typography block
  const legacyTypographyPattern = /\/\* Typography Tokens M3 - LEGACY \(DEPRECATED\) \*\/[\s\S]*?\/\* Typography Tokens M3 - OFFICIAL \(Use these\) \*\//g;

  let cleaned = content.replace(legacyTypographyPattern, '/* Typography Tokens M3 - OFFICIAL (Use these) */');

  return cleaned;
}

// Main cleanup
const themePath = path.join(__dirname, 'src', 'theme.css');

console.log('🧹 Removing remaining legacy typography tokens from theme.css\n');

try {
  const originalContent = fs.readFileSync(themePath, 'utf8');
  const cleanedContent = removeLegacyTypography(originalContent);

  // Create backup
  const backupPath = path.join(__dirname, 'src', 'theme.css.final-cleanup');
  fs.writeFileSync(backupPath, originalContent);
  console.log(`💾 Backup created: theme.css.final-cleanup\n`);

  // Write cleaned content
  fs.writeFileSync(themePath, cleanedContent);
  console.log(`✅ Legacy typography tokens removed from theme.css`);
  console.log('🎯 Block E Phase 1: Final cleanup - COMPLETE\n');

} catch (error) {
  console.error('❌ Cleanup failed:', error.message);
  process.exit(1);
}