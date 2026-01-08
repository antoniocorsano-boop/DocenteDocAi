/**
 * MD3 Migration Helper Script
 *
 * Automates common MD3 compliance fixes across components.
 * Handles the most frequent legacy class patterns.
 */

const fs = require('fs');
const path = require('path');

/**
 * Migration patterns for common legacy classes
 */
const MIGRATION_PATTERNS = [
  // Color patterns
  {
    pattern: /bg-surface-container-high/g,
    replacement: 'bg-[var(--md-sys-color-surface-container-high)]'
  },
  {
    pattern: /bg-surface-container-low/g,
    replacement: 'bg-[var(--md-sys-color-surface-container-low)]'
  },
  {
    pattern: /bg-surface-container/g,
    replacement: 'bg-[var(--md-sys-color-surface-container)]'
  },
  {
    pattern: /text-on-surface/g,
    replacement: 'text-[var(--md-sys-color-on-surface)]'
  },
  {
    pattern: /text-on-surface-variant/g,
    replacement: 'text-[var(--md-sys-color-on-surface-variant)]'
  },
  {
    pattern: /border-outline-variant/g,
    replacement: 'border-[var(--md-sys-color-outline-variant)]'
  },
  {
    pattern: /border-outline/g,
    replacement: 'border-[var(--md-sys-color-outline)]'
  },

  // Elevation patterns
  {
    pattern: /shadow-2xl/g,
    replacement: 'shadow-[var(--md-sys-elevation-level4)]'
  },
  {
    pattern: /shadow-xl/g,
    replacement: 'shadow-[var(--md-sys-elevation-level3)]'
  },
  {
    pattern: /shadow-lg/g,
    replacement: 'shadow-[var(--md-sys-elevation-level2)]'
  },
  {
    pattern: /shadow-md/g,
    replacement: 'shadow-[var(--md-sys-elevation-level1)]'
  },

  // Shape patterns
  {
    pattern: /rounded-3xl/g,
    replacement: 'rounded-[var(--md-sys-shape-corner-extra-large)]'
  },
  {
    pattern: /rounded-2xl/g,
    replacement: 'rounded-[var(--md-sys-shape-corner-large)]'
  },
  {
    pattern: /rounded-xl/g,
    replacement: 'rounded-[var(--md-sys-shape-corner-medium)]'
  },
  {
    pattern: /rounded-lg/g,
    replacement: 'rounded-[var(--md-sys-shape-corner-small)]'
  },

  // Typography patterns (basic mapping)
  {
    pattern: /m3-headline-small/g,
    replacement: 'text-[var(--md-sys-typescale-headline-small)] font-[var(--md-sys-typescale-headline-small-font)]'
  },
  {
    pattern: /m3-body-large/g,
    replacement: 'text-[var(--md-sys-typescale-body-large)] font-[var(--md-sys-typescale-body-large-font)]'
  },
  {
    pattern: /m3-body-medium/g,
    replacement: 'text-[var(--md-sys-typescale-body-medium)] font-[var(--md-sys-typescale-body-medium-font)]'
  },
];

/**
 * Apply migrations to a file
 */
function migrateFile(filePath) {
  console.log(`🔄 Migrating: ${filePath}`);

  let content = fs.readFileSync(filePath, 'utf8');
  let changes = 0;

  MIGRATION_PATTERNS.forEach(({ pattern, replacement }) => {
    const matches = content.match(pattern);
    if (matches) {
      content = content.replace(pattern, replacement);
      changes += matches.length;
      console.log(`  ✅ ${matches.length} x ${pattern.source} → ${replacement}`);
    }
  });

  if (changes > 0) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`  📝 Applied ${changes} migrations\n`);
  } else {
    console.log(`  ℹ️  No migrations needed\n`);
  }

  return changes;
}

/**
 * Migrate all TSX files in a directory
 */
function migrateDirectory(dirPath) {
  const files = fs.readdirSync(dirPath);
  let totalChanges = 0;

  files.forEach(file => {
    const filePath = path.join(dirPath, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      totalChanges += migrateDirectory(filePath);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      totalChanges += migrateFile(filePath);
    }
  });

  return totalChanges;
}

// Main execution
if (require.main === module) {
  const targetPath = process.argv[2] || './src/components/ui';

  console.log(`🚀 Starting MD3 Migration for: ${targetPath}\n`);

  const stat = fs.statSync(targetPath);
  let totalChanges = 0;

  if (stat.isDirectory()) {
    totalChanges = migrateDirectory(targetPath);
  } else if (targetPath.endsWith('.tsx') || targetPath.endsWith('.ts')) {
    totalChanges = migrateFile(targetPath);
  } else {
    console.log(`❌ Invalid target: ${targetPath}. Must be a .tsx/.ts file or directory.`);
    process.exit(1);
  }

  console.log(`✅ Migration complete! Applied ${totalChanges} changes total.`);

  if (totalChanges > 0) {
    console.log(`\n💡 Next steps:`);
    console.log(`1. Run 'npm run lint' to check for any issues`);
    console.log(`2. Run 'node md3-audit.js check ${targetPath}' to verify compliance`);
    console.log(`3. Test components visually to ensure styling is correct`);
  }
}

module.exports = { migrateFile, migrateDirectory, MIGRATION_PATTERNS };