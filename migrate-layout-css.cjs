const fs = require('fs');
const path = require('path');

function migrateLayoutCSS(content) {
  let migrated = content;

  // Replace legacy spacing tokens with MD3 equivalents
  migrated = migrated.replace(/var\(--spacing-8, var\(--md-sys-spacing-8\)\)/g, 'var(--md-sys-spacing-8)');

  return migrated;
}

// Main migration
const layoutPath = path.join(__dirname, 'src', 'layout.css');

console.log('🚀 Migrating layout.css legacy tokens');
console.log('📁 Replacing legacy spacing fallbacks with MD3 tokens\n');

try {
  const originalContent = fs.readFileSync(layoutPath, 'utf8');
  const migratedContent = migrateLayoutCSS(originalContent);

  // Create backup
  const backupPath = path.join(__dirname, 'src', 'layout.css.backup');
  fs.writeFileSync(backupPath, originalContent);
  console.log(`💾 Backup created: layout.css.backup\n`);

  // Write migrated content
  fs.writeFileSync(layoutPath, migratedContent);
  console.log(`✅ Legacy tokens migrated in layout.css`);

} catch (error) {
  console.error('❌ Migration failed:', error.message);
  process.exit(1);
}