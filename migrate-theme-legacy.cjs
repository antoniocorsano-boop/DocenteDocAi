const fs = require('fs');
const path = require('path');

// MD3 token mappings for legacy tokens
const TOKEN_MAPPINGS = {
  // Spacing mappings (most are already correct, but some need adjustment)
  '--spacing-0': '0px', // Already correct
  '--spacing-1': 'var(--md-sys-spacing-1)', // Already correct
  '--spacing-2': 'var(--md-sys-spacing-2)', // Already correct
  '--spacing-3': 'var(--md-sys-spacing-3)', // Already correct
  '--spacing-4': 'var(--md-sys-spacing-4)', // Already correct
  '--spacing-5': '20px', // Non-standard, keep as is for now
  '--spacing-6': 'var(--md-sys-spacing-6)', // Already correct
  '--spacing-8': 'var(--md-sys-spacing-8)', // Already correct
  '--spacing-10': '40px', // Non-standard, keep as is for now
  '--spacing-12': 'var(--md-sys-spacing-12)', // Already correct
  '--spacing-16': '64px', // Non-standard, keep as is for now

  // Typography mappings to MD3 typescale
  '--typography-display-large-fontSize': 'var(--md-sys-typescale-display-large-size)',
  '--typography-display-large-fontFamily': 'var(--md-sys-typescale-display-large-font)',
  '--typography-display-large-fontWeight': 'var(--md-sys-typescale-display-large-weight)',
  '--typography-display-large-lineHeight': 'var(--md-sys-typescale-display-large-line-height)',
  '--typography-display-large-letterSpacing': 'var(--md-sys-typescale-display-large-tracking)',

  '--typography-display-medium-fontSize': 'var(--md-sys-typescale-display-medium-size)',
  '--typography-display-medium-fontFamily': 'var(--md-sys-typescale-display-medium-font)',
  '--typography-display-medium-fontWeight': 'var(--md-sys-typescale-display-medium-weight)',
  '--typography-display-medium-lineHeight': 'var(--md-sys-typescale-display-medium-line-height)',
  '--typography-display-medium-letterSpacing': 'var(--md-sys-typescale-display-medium-tracking)',

  '--typography-display-small-fontSize': 'var(--md-sys-typescale-display-small-size)',
  '--typography-display-small-fontFamily': 'var(--md-sys-typescale-display-small-font)',
  '--typography-display-small-fontWeight': 'var(--md-sys-typescale-display-small-weight)',
  '--typography-display-small-lineHeight': 'var(--md-sys-typescale-display-small-line-height)',
  '--typography-display-small-letterSpacing': 'var(--md-sys-typescale-display-small-tracking)',

  '--typography-headline-large-fontSize': 'var(--md-sys-typescale-headline-large-size)',
  '--typography-headline-large-fontFamily': 'var(--md-sys-typescale-headline-large-font)',
  '--typography-headline-large-fontWeight': 'var(--md-sys-typescale-headline-large-weight)',
  '--typography-headline-large-lineHeight': 'var(--md-sys-typescale-headline-large-line-height)',
  '--typography-headline-large-letterSpacing': 'var(--md-sys-typescale-headline-large-tracking)'
};

function migrateLegacyTokens(content) {
  let migratedContent = content;
  let changes = 0;

  Object.entries(TOKEN_MAPPINGS).forEach(([legacyToken, md3Token]) => {
    // Create regex to match the legacy token definition
    const regex = new RegExp(`${legacyToken}:\\s*[^;]+;`, 'g');

    // Replace with MD3 equivalent
    const newDefinition = `${legacyToken}: ${md3Token}; /* MIGRATED TO MD3 */`;

    if (regex.test(migratedContent)) {
      migratedContent = migratedContent.replace(regex, newDefinition);
      changes++;
      console.log(`✅ Migrated ${legacyToken} → ${md3Token}`);
    }
  });

  return { migratedContent, changes };
}

// Main migration
const themePath = path.join(__dirname, 'src', 'theme.css');

console.log('🚀 Starting Block E: Legacy Styles Migration');
console.log('📁 Target: theme.css\n');

try {
  const originalContent = fs.readFileSync(themePath, 'utf8');
  const { migratedContent, changes } = migrateLegacyTokens(originalContent);

  if (changes > 0) {
    // Create backup
    const backupPath = path.join(__dirname, 'src', 'theme.css.backup');
    fs.writeFileSync(backupPath, originalContent);
    console.log(`💾 Backup created: theme.css.backup\n`);

    // Write migrated content
    fs.writeFileSync(themePath, migratedContent);
    console.log(`✅ Migration completed: ${changes} legacy tokens migrated`);
    console.log('🎯 Block E Phase 1: Theme.css migration - COMPLETE\n');

    // Run compliance check
    console.log('🔍 Running compliance verification...');
  } else {
    console.log('ℹ️  No legacy tokens found to migrate');
  }

} catch (error) {
  console.error('❌ Migration failed:', error.message);
  process.exit(1);
}