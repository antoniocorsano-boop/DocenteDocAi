#!/usr/bin/env node

/**
 * MD3 Theme Token Consolidation Script - Phase 9
 * Replaces hardcoded values with semantic MD3 tokens
 */

const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

// Files to process
const PATTERNS = [
  'src/components/**/*.tsx',
  'src/layout/**/*.tsx',
  'src/styles/**/*.css'
];

// Exclusions
const EXCLUDE_PATTERNS = [
  '**/*.test.*',
  '**/*.stories.*',
  '**/*.spec.*',
  '**/scripts/**',
  '**/archive/**',
  '**/*.bak'
];

// Token replacement patterns
const TOKEN_REPLACEMENTS = [
  // Colors - Primary
  {
    pattern: /var\(--md-sys-color-primary\)/g,
    replacement: 'var(--app-color-primary)',
    category: 'color',
    description: 'Primary color → semantic token'
  },
  {
    pattern: /var\(--md-sys-color-on-primary\)/g,
    replacement: 'var(--app-color-on-primary)',
    category: 'color',
    description: 'On primary color → semantic token'
  },
  {
    pattern: /var\(--md-sys-color-primary-container\)/g,
    replacement: 'var(--app-color-primary-container)',
    category: 'color',
    description: 'Primary container color → semantic token'
  },
  {
    pattern: /var\(--md-sys-color-on-primary-container\)/g,
    replacement: 'var(--app-color-on-primary-container)',
    category: 'color',
    description: 'On primary container color → semantic token'
  },

  // Colors - Secondary
  {
    pattern: /var\(--md-sys-color-secondary\)/g,
    replacement: 'var(--app-color-secondary)',
    category: 'color',
    description: 'Secondary color → semantic token'
  },
  {
    pattern: /var\(--md-sys-color-on-secondary\)/g,
    replacement: 'var(--app-color-on-secondary)',
    category: 'color',
    description: 'On secondary color → semantic token'
  },
  {
    pattern: /var\(--md-sys-color-secondary-container\)/g,
    replacement: 'var(--app-color-secondary-container)',
    category: 'color',
    description: 'Secondary container color → semantic token'
  },
  {
    pattern: /var\(--md-sys-color-on-secondary-container\)/g,
    replacement: 'var(--app-color-on-secondary-container)',
    category: 'color',
    description: 'On secondary container color → semantic token'
  },

  // Colors - Surface
  {
    pattern: /var\(--md-sys-color-surface\)/g,
    replacement: 'var(--app-color-surface)',
    category: 'color',
    description: 'Surface color → semantic token'
  },
  {
    pattern: /var\(--md-sys-color-on-surface\)/g,
    replacement: 'var(--app-color-on-surface)',
    category: 'color',
    description: 'On surface color → semantic token'
  },
  {
    pattern: /var\(--md-sys-color-surface-container\)/g,
    replacement: 'var(--app-color-surface-container)',
    category: 'color',
    description: 'Surface container color → semantic token'
  },
  {
    pattern: /var\(--md-sys-color-on-surface-container\)/g,
    replacement: 'var(--app-color-on-surface-container)',
    category: 'color',
    description: 'On surface container color → semantic token'
  },

  // Spacing - Common values
  {
    pattern: /var\(--md-sys-spacing-4\)/g,
    replacement: 'var(--app-spacing-container)',
    category: 'spacing',
    description: 'Container spacing → semantic token'
  },
  {
    pattern: /var\(--md-sys-spacing-6\)/g,
    replacement: 'var(--app-spacing-section)',
    category: 'spacing',
    description: 'Section spacing → semantic token'
  },
  {
    pattern: /var\(--md-sys-spacing-3\)/g,
    replacement: 'var(--app-spacing-element)',
    category: 'spacing',
    description: 'Element spacing → semantic token'
  },
  {
    pattern: /var\(--md-sys-spacing-2\)/g,
    replacement: 'var(--app-spacing-component)',
    category: 'spacing',
    description: 'Component spacing → semantic token'
  },
  {
    pattern: /var\(--md-sys-spacing-5\)/g,
    replacement: 'var(--app-spacing-touch)',
    category: 'spacing',
    description: 'Touch spacing → semantic token'
  },

  // Layout - Common values
  {
    pattern: /var\(--md-sys-percent-100\)/g,
    replacement: 'var(--app-layout-full)',
    category: 'layout',
    description: 'Full percentage → semantic layout token'
  },
  {
    pattern: /var\(--md-sys-percent-50\)/g,
    replacement: 'var(--app-layout-half)',
    category: 'layout',
    description: 'Half percentage → semantic layout token'
  },
  {
    pattern: /var\(--md-sys-percent-25\)/g,
    replacement: 'var(--app-layout-quarter)',
    category: 'layout',
    description: 'Quarter percentage → semantic layout token'
  },
  {
    pattern: /var\(--md-sys-margin-auto\)/g,
    replacement: 'var(--app-layout-auto)',
    category: 'layout',
    description: 'Auto margin → semantic layout token'
  },

  // Elevation
  {
    pattern: /var\(--md-sys-elevation-level-0\)/g,
    replacement: 'var(--app-elevation-level-0)',
    category: 'elevation',
    description: 'Elevation level 0 → semantic token'
  },
  {
    pattern: /var\(--md-sys-elevation-level-1\)/g,
    replacement: 'var(--app-elevation-level-1)',
    category: 'elevation',
    description: 'Elevation level 1 → semantic token'
  },
  {
    pattern: /var\(--md-sys-elevation-level-2\)/g,
    replacement: 'var(--app-elevation-level-2)',
    category: 'elevation',
    description: 'Elevation level 2 → semantic token'
  },
  {
    pattern: /var\(--md-sys-elevation-level-3\)/g,
    replacement: 'var(--app-elevation-level-3)',
    category: 'elevation',
    description: 'Elevation level 3 → semantic token'
  },
  {
    pattern: /var\(--md-sys-elevation-level-4\)/g,
    replacement: 'var(--app-elevation-level-4)',
    category: 'elevation',
    description: 'Elevation level 4 → semantic token'
  },
  {
    pattern: /var\(--md-sys-elevation-level-5\)/g,
    replacement: 'var(--app-elevation-level-5)',
    category: 'elevation',
    description: 'Elevation level 5 → semantic token'
  },

  // Shape
  {
    pattern: /var\(--md-sys-radius-2\)/g,
    replacement: 'var(--app-shape-small)',
    category: 'shape',
    description: 'Small border radius → semantic shape token'
  },
  {
    pattern: /var\(--md-sys-radius-4\)/g,
    replacement: 'var(--app-shape-medium)',
    category: 'shape',
    description: 'Medium border radius → semantic shape token'
  },
  {
    pattern: /var\(--md-sys-radius-6\)/g,
    replacement: 'var(--app-shape-large)',
    category: 'shape',
    description: 'Large border radius → semantic shape token'
  },
  {
    pattern: /var\(--md-sys-radius-full\)/g,
    replacement: 'var(--app-shape-full)',
    category: 'shape',
    description: 'Full border radius → semantic shape token'
  },

  // Borders
  {
    pattern: /var\(--md-sys-border-width-thin\)/g,
    replacement: 'var(--app-border-thin)',
    category: 'border',
    description: 'Thin border width → semantic border token'
  },
  {
    pattern: /var\(--md-sys-border-width-normal\)/g,
    replacement: 'var(--app-border-normal)',
    category: 'border',
    description: 'Normal border width → semantic border token'
  },
  {
    pattern: /var\(--md-sys-border-width-medium\)/g,
    replacement: 'var(--app-border-medium)',
    category: 'border',
    description: 'Medium border width → semantic border token'
  },
  {
    pattern: /var\(--md-sys-border-width-thick\)/g,
    replacement: 'var(--app-border-thick)',
    category: 'border',
    description: 'Thick border width → semantic border token'
  },

  // Typography
  {
    pattern: /var\(--md-sys-typescale-display-large-font-size\)/g,
    replacement: 'var(--app-text-display)',
    category: 'typography',
    description: 'Display font size → semantic typography token'
  },
  {
    pattern: /var\(--md-sys-typescale-headline-large-font-size\)/g,
    replacement: 'var(--app-text-headline)',
    category: 'typography',
    description: 'Headline font size → semantic typography token'
  },
  {
    pattern: /var\(--md-sys-typescale-title-large-font-size\)/g,
    replacement: 'var(--app-text-title)',
    category: 'typography',
    description: 'Title font size → semantic typography token'
  },
  {
    pattern: /var\(--md-sys-typescale-body-large-font-size\)/g,
    replacement: 'var(--app-text-body)',
    category: 'typography',
    description: 'Body font size → semantic typography token'
  },
  {
    pattern: /var\(--md-sys-typescale-label-large-font-size\)/g,
    replacement: 'var(--app-text-label)',
    category: 'typography',
    description: 'Label font size → semantic typography token'
  },
  {
    pattern: /var\(--md-sys-typescale-body-small-font-size\)/g,
    replacement: 'var(--app-text-caption)',
    category: 'typography',
    description: 'Caption font size → semantic typography token'
  },

  // Z-Index
  {
    pattern: /var\(--md-sys-z-base\)/g,
    replacement: 'var(--app-z-base)',
    category: 'zIndex',
    description: 'Base z-index → semantic token'
  },
  {
    pattern: /var\(--md-sys-z-content\)/g,
    replacement: 'var(--app-z-content)',
    category: 'zIndex',
    description: 'Content z-index → semantic token'
  },
  {
    pattern: /var\(--md-sys-z-overlay\)/g,
    replacement: 'var(--app-z-overlay)',
    category: 'zIndex',
    description: 'Overlay z-index → semantic token'
  },
  {
    pattern: /var\(--md-sys-z-modal\)/g,
    replacement: 'var(--app-z-modal)',
    category: 'zIndex',
    description: 'Modal z-index → semantic token'
  },
  {
    pattern: /var\(--md-sys-z-tooltip\)/g,
    replacement: 'var(--app-z-tooltip)',
    category: 'zIndex',
    description: 'Tooltip z-index → semantic token'
  },

  // Motion
  {
    pattern: /var\(--md-sys-motion-duration-medium\)/g,
    replacement: 'var(--app-motion-standard)',
    category: 'motion',
    description: 'Standard motion duration → semantic token'
  },
  {
    pattern: /var\(--md-sys-motion-duration-short\)/g,
    replacement: 'var(--app-motion-quick)',
    category: 'motion',
    description: 'Quick motion duration → semantic token'
  },
  {
    pattern: /var\(--md-sys-motion-duration-long\)/g,
    replacement: 'var(--app-motion-slow)',
    category: 'motion',
    description: 'Slow motion duration → semantic token'
  },
  {
    pattern: /var\(--md-sys-motion-easing-standard\)/g,
    replacement: 'var(--app-easing-standard)',
    category: 'motion',
    description: 'Standard easing → semantic token'
  },
  {
    pattern: /var\(--md-sys-motion-easing-emphasized\)/g,
    replacement: 'var(--app-easing-emphasized)',
    category: 'motion',
    description: 'Emphasized easing → semantic token'
  }
];

async function processFiles() {
  console.log('🔄 Starting MD3 Theme Token Consolidation - Phase 9\n');

  const report = {
    processed: 0,
    modified: 0,
    replacements: {},
    errors: [],
    timestamp: new Date().toISOString()
  };

  // Initialize replacement counters
  TOKEN_REPLACEMENTS.forEach(replacement => {
    report.replacements[replacement.category] = report.replacements[replacement.category] || {};
    report.replacements[replacement.category][replacement.description] = 0;
  });

  try {
    // Get all files matching patterns
    const files = [];
    for (const pattern of PATTERNS) {
      const matches = await glob(pattern, {
        ignore: EXCLUDE_PATTERNS,
        cwd: process.cwd()
      });
      files.push(...matches);
    }

    console.log(`📁 Found ${files.length} files to process\n`);

    for (const file of files) {
      report.processed++;
      const filePath = path.resolve(file);

      try {
        // Read file
        const content = fs.readFileSync(filePath, 'utf8');
        let modifiedContent = content;
        let fileModified = false;

        // Apply all replacements
        TOKEN_REPLACEMENTS.forEach(replacement => {
          const matches = modifiedContent.match(replacement.pattern);
          if (matches) {
            const count = matches.length;
            modifiedContent = modifiedContent.replace(replacement.pattern, replacement.replacement);
            report.replacements[replacement.category][replacement.description] += count;
            fileModified = true;
          }
        });

        if (fileModified) {
          // Create backup
          const backupPath = `${filePath}.bak`;
          fs.writeFileSync(backupPath, content);
          console.log(`💾 Backup created: ${path.relative(process.cwd(), backupPath)}`);

          // Write modified content
          fs.writeFileSync(filePath, modifiedContent);
          report.modified++;
          console.log(`✅ Modified: ${path.relative(process.cwd(), filePath)}`);
        }

      } catch (error) {
        report.errors.push({
          file: path.relative(process.cwd(), filePath),
          error: error.message
        });
        console.error(`❌ Error processing ${path.relative(process.cwd(), filePath)}: ${error.message}`);
      }
    }

    // Generate report
    const reportPath = 'md3-theme-token-consolidation-report.json';
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`\n📊 Report saved: ${reportPath}`);

    // Summary
    console.log('\n🎯 CONSOLIDATION SUMMARY:');
    console.log(`   Files processed: ${report.processed}`);
    console.log(`   Files modified: ${report.modified}`);
    console.log(`   Errors: ${report.errors.length}`);

    console.log('\n🔄 REPLACEMENTS BY CATEGORY:');
    Object.entries(report.replacements).forEach(([category, replacements]) => {
      const total = Object.values(replacements).reduce((sum, count) => sum + count, 0);
      if (total > 0) {
        console.log(`   ${category.toUpperCase()}: ${total} replacements`);
        Object.entries(replacements).forEach(([desc, count]) => {
          if (count > 0) {
            console.log(`     • ${desc}: ${count}`);
          }
        });
      }
    });

    if (report.errors.length > 0) {
      console.log('\n⚠️  ERRORS:');
      report.errors.forEach(err => {
        console.log(`   • ${err.file}: ${err.error}`);
      });
    }

    console.log('\n✅ MD3 Theme Token Consolidation completed successfully!');
    console.log('🎉 Phase 9: Theme Token Consolidation - COMPLETE');

  } catch (error) {
    console.error('💥 Fatal error:', error.message);
    process.exit(1);
  }
}

// Run the script
processFiles();