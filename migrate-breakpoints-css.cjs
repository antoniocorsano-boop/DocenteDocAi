const fs = require('fs');
const path = require('path');

function migrateBreakpointsCSS(content) {
  let migrated = content;

  // Replace legacy spacing tokens with MD3 equivalents
  const replacements = [
    { legacy: 'var(--spacing-2, var(--md-sys-spacing-2))', md3: 'var(--md-sys-spacing-2)' },
    { legacy: 'var(--spacing-3, var(--md-sys-spacing-3))', md3: 'var(--md-sys-spacing-3)' },
    { legacy: 'var(--spacing-4, var(--md-sys-spacing-4))', md3: 'var(--md-sys-spacing-4)' },
    { legacy: 'var(--spacing-6, var(--md-sys-spacing-6))', md3: 'var(--md-sys-spacing-6)' },
    { legacy: 'var(--spacing-8, var(--md-sys-spacing-8))', md3: 'var(--md-sys-spacing-8)' }
  ];

  replacements.forEach(({ legacy, md3 }) => {
    migrated = migrated.replace(new RegExp(legacy.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), md3);
  });

  return migrated;
}

// Main migration
const breakpointsPath = path.join(__dirname, 'src', 'design-system', 'breakpoints.css');

console.log('🚀 Migrating breakpoints.css legacy tokens');
console.log('📁 Replacing legacy spacing fallbacks with MD3 tokens\n');

try {
  const originalContent = fs.readFileSync(breakpointsPath, 'utf8');
  const migratedContent = migrateBreakpointsCSS(originalContent);

  // Create backup
  const backupPath = path.join(__dirname, 'src', 'design-system', 'breakpoints.css.backup');
  fs.writeFileSync(backupPath, originalContent);
  console.log(`💾 Backup created: breakpoints.css.backup\n`);

  // Write migrated content
  fs.writeFileSync(breakpointsPath, migratedContent);
  console.log(`✅ Legacy tokens migrated in breakpoints.css`);

} catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
}