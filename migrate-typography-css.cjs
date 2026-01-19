const fs = require('fs');
const path = require('path');

// MD3 typescale token mappings for legacy typography tokens
const TYPOGRAPHY_MAPPINGS = {
  // Display Large
  '--typography-display-large-family': 'var(--md-sys-typescale-display-large-font)',
  '--typography-display-large-size': 'var(--md-sys-typescale-display-large-size)',
  '--typography-display-large-weight': 'var(--md-sys-typescale-display-large-weight)',
  '--typography-display-large-height': 'var(--md-sys-typescale-display-large-line-height)',
  '--typography-display-large-tracking': 'var(--md-sys-typescale-display-large-tracking)',

  // Display Medium
  '--typography-display-medium-family': 'var(--md-sys-typescale-display-medium-font)',
  '--typography-display-medium-size': 'var(--md-sys-typescale-display-medium-size)',
  '--typography-display-medium-weight': 'var(--md-sys-typescale-display-medium-weight)',
  '--typography-display-medium-height': 'var(--md-sys-typescale-display-medium-line-height)',
  '--typography-display-medium-tracking': 'var(--md-sys-typescale-display-medium-tracking)',

  // Display Small
  '--typography-display-small-family': 'var(--md-sys-typescale-display-small-font)',
  '--typography-display-small-size': 'var(--md-sys-typescale-display-small-size)',
  '--typography-display-small-weight': 'var(--md-sys-typescale-display-small-weight)',
  '--typography-display-small-height': 'var(--md-sys-typescale-display-small-line-height)',
  '--typography-display-small-tracking': 'var(--md-sys-typescale-display-small-tracking)',

  // Headline Large
  '--typography-headline-large-family': 'var(--md-sys-typescale-headline-large-font)',
  '--typography-headline-large-size': 'var(--md-sys-typescale-headline-large-size)',
  '--typography-headline-large-weight': 'var(--md-sys-typescale-headline-large-weight)',
  '--typography-headline-large-height': 'var(--md-sys-typescale-headline-large-line-height)',
  '--typography-headline-large-tracking': 'var(--md-sys-typescale-headline-large-tracking)',

  // Headline Medium
  '--typography-headline-medium-family': 'var(--md-sys-typescale-headline-medium-font)',
  '--typography-headline-medium-size': 'var(--md-sys-typescale-headline-medium-size)',
  '--typography-headline-medium-weight': 'var(--md-sys-typescale-headline-medium-weight)',
  '--typography-headline-medium-height': 'var(--md-sys-typescale-headline-medium-line-height)',
  '--typography-headline-medium-tracking': 'var(--md-sys-typescale-headline-medium-tracking)',

  // Headline Small
  '--typography-headline-small-family': 'var(--md-sys-typescale-headline-small-font)',
  '--typography-headline-small-size': 'var(--md-sys-typescale-headline-small-size)',
  '--typography-headline-small-weight': 'var(--md-sys-typescale-headline-small-weight)',
  '--typography-headline-small-height': 'var(--md-sys-typescale-headline-small-line-height)',
  '--typography-headline-small-tracking': 'var(--md-sys-typescale-headline-small-tracking)',

  // Title Large
  '--typography-title-large-family': 'var(--md-sys-typescale-title-large-font)',
  '--typography-title-large-size': 'var(--md-sys-typescale-title-large-size)',
  '--typography-title-large-weight': 'var(--md-sys-typescale-title-large-weight)',
  '--typography-title-large-height': 'var(--md-sys-typescale-title-large-line-height)',
  '--typography-title-large-tracking': 'var(--md-sys-typescale-title-large-tracking)',

  // Title Medium
  '--typography-title-medium-family': 'var(--md-sys-typescale-title-medium-font)',
  '--typography-title-medium-size': 'var(--md-sys-typescale-title-medium-size)',
  '--typography-title-medium-weight': 'var(--md-sys-typescale-title-medium-weight)',
  '--typography-title-medium-height': 'var(--md-sys-typescale-title-medium-line-height)',
  '--typography-title-medium-tracking': 'var(--md-sys-typescale-title-medium-tracking)',

  // Title Small
  '--typography-title-small-family': 'var(--md-sys-typescale-title-small-font)',
  '--typography-title-small-size': 'var(--md-sys-typescale-title-small-size)',
  '--typography-title-small-weight': 'var(--md-sys-typescale-title-small-weight)',
  '--typography-title-small-height': 'var(--md-sys-typescale-title-small-line-height)',
  '--typography-title-small-tracking': 'var(--md-sys-typescale-title-small-tracking)',

  // Body Large
  '--typography-body-large-family': 'var(--md-sys-typescale-body-large-font)',
  '--typography-body-large-size': 'var(--md-sys-typescale-body-large-size)',
  '--typography-body-large-weight': 'var(--md-sys-typescale-body-large-weight)',
  '--typography-body-large-height': 'var(--md-sys-typescale-body-large-line-height)',
  '--typography-body-large-tracking': 'var(--md-sys-typescale-body-large-tracking)',

  // Body Medium
  '--typography-body-medium-family': 'var(--md-sys-typescale-body-medium-font)',
  '--typography-body-medium-size': 'var(--md-sys-typescale-body-medium-size)',
  '--typography-body-medium-weight': 'var(--md-sys-typescale-body-medium-weight)',
  '--typography-body-medium-height': 'var(--md-sys-typescale-body-medium-line-height)',
  '--typography-body-medium-tracking': 'var(--md-sys-typescale-body-medium-tracking)',

  // Body Small
  '--typography-body-small-family': 'var(--md-sys-typescale-body-small-font)',
  '--typography-body-small-size': 'var(--md-sys-typescale-body-small-size)',
  '--typography-body-small-weight': 'var(--md-sys-typescale-body-small-weight)',
  '--typography-body-small-height': 'var(--md-sys-typescale-body-small-line-height)',
  '--typography-body-small-tracking': 'var(--md-sys-typescale-body-small-tracking)',

  // Label Large
  '--typography-label-large-family': 'var(--md-sys-typescale-label-large-font)',
  '--typography-label-large-size': 'var(--md-sys-typescale-label-large-size)',
  '--typography-label-large-weight': 'var(--md-sys-typescale-label-large-weight)',
  '--typography-label-large-height': 'var(--md-sys-typescale-label-large-line-height)',
  '--typography-label-large-tracking': 'var(--md-sys-typescale-label-large-tracking)',

  // Label Medium
  '--typography-label-medium-family': 'var(--md-sys-typescale-label-medium-font)',
  '--typography-label-medium-size': 'var(--md-sys-typescale-label-medium-size)',
  '--typography-label-medium-weight': 'var(--md-sys-typescale-label-medium-weight)',
  '--typography-label-medium-height': 'var(--md-sys-typescale-label-medium-line-height)',
  '--typography-label-medium-tracking': 'var(--md-sys-typescale-label-medium-tracking)',

  // Label Small
  '--typography-label-small-family': 'var(--md-sys-typescale-label-small-font)',
  '--typography-label-small-size': 'var(--md-sys-typescale-label-small-size)',
  '--typography-label-small-weight': 'var(--md-sys-typescale-label-small-weight)',
  '--typography-label-small-height': 'var(--md-sys-typescale-label-small-line-height)',
  '--typography-label-small-tracking': 'var(--md-sys-typescale-label-small-tracking)'
};

function migrateTypographyCSS(content) {
  let migrated = content;

  Object.entries(TYPOGRAPHY_MAPPINGS).forEach(([legacyToken, md3Token]) => {
    // Replace var(legacyToken, fallback) with var(md3Token, fallback)
    const regex = new RegExp(`var\\(${legacyToken}([^)]*)\\)`, 'g');
    migrated = migrated.replace(regex, `var(${md3Token}$1)`);
  });

  return migrated;
}

// Main migration
const typographyPath = path.join(__dirname, 'src', 'design-system', 'typography.css');

console.log('🚀 Migrating typography.css legacy tokens');
console.log('📁 Replacing legacy typography tokens with MD3 typescale tokens\n');

try {
  const originalContent = fs.readFileSync(typographyPath, 'utf8');
  const migratedContent = migrateTypographyCSS(originalContent);

  // Create backup
  const backupPath = path.join(__dirname, 'src', 'design-system', 'typography.css.backup');
  fs.writeFileSync(backupPath, originalContent);
  console.log(`💾 Backup created: typography.css.backup\n`);

  // Write migrated content
  fs.writeFileSync(typographyPath, migratedContent);
  console.log(`✅ Legacy typography tokens migrated in typography.css`);
  console.log('🎯 Block E Phase 1: Typography.css migration - COMPLETE\n');

} catch (error) {
  console.error('❌ Migration failed:', error.message);
  process.exit(1);
}