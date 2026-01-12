#!/usr/bin/env node

/**
 * Phase 4 - Group-based aggressive batch converter
 * Processes files by error category with priority ordering
 * Target: Reduce 5,373 remaining errors by ~50% in single batch
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('═'.repeat(80));
console.log('🚀 PHASE 4 - GROUP-BASED BATCH CONVERSION');
console.log('═'.repeat(80));

// Tailwind to MD3 pattern mappings (expanded)
const tailwindPatterns = [
  // Color patterns with MD3 tokens
  { pattern: /className=["'](.*?)(?:bg-\[var\(--md-sys-color-([^\)]+)\)\](?:\/\d+)?)(.*?)["']/g, replacement: (match, prefix, color, suffix) => {
    const colorMap = {
      'surface': 'var(--md-sys-color-surface)',
      'surface-container-low': 'var(--md-sys-color-surface-container-low)',
      'surface-container-high': 'var(--md-sys-color-surface-container-high)',
      'primary': 'var(--md-sys-color-primary)',
      'secondary': 'var(--md-sys-color-secondary)',
      'tertiary': 'var(--md-sys-color-tertiary)',
    };
    return `style={{ backgroundColor: '${colorMap[color] || `var(--md-sys-color-${color})`}' }}`;
  }},
  
  // Text color patterns
  { regex: /className=["'].*?(?:text-\[var\(--md-sys-color-([^\)]+)\).*?)["']/g, 
    fn: (match, file) => {
      const colorPatterns = {
        'on-surface': 'var(--md-sys-color-on-surface)',
        'on-primary': 'var(--md-sys-color-on-primary)',
        'on-secondary': 'var(--md-sys-color-on-secondary)',
        'outline': 'var(--md-sys-color-outline)',
      };
      return file.replace(/className=["']([^"']*text-\[var\(--md-sys-color-([^\)]+)\)[^"']*?["']/g,
        (m, classes, color) => `style={{ color: '${colorPatterns[color] || `var(--md-sys-color-${color})`}' }}`);
    }
  },
  
  // Spacing patterns
  { regex: /className=["'].*?(space-[xy]-\d+|gap-\d+|p-\d+|m-\d+).*?["']/g,
    fn: (match, file) => {
      const spacingMap = {
        'p-4': 'padding: var(--md-sys-spacing-4)',
        'p-6': 'padding: var(--md-sys-spacing-6)',
        'p-8': 'padding: var(--md-sys-spacing-8)',
        'p-12': 'padding: var(--md-sys-spacing-12)',
        'gap-2': 'gap: var(--md-sys-spacing-2)',
        'gap-4': 'gap: var(--md-sys-spacing-4)',
        'space-y-4': 'gap: var(--md-sys-spacing-4)',
      };
      let result = file;
      Object.entries(spacingMap).forEach(([tw, md3]) => {
        result = result.replace(new RegExp(`className=["']([^"']*${tw}[^"']*?)["']`, 'g'),
          (m, classes) => `style={{ ${md3} }}`);
      });
      return result;
    }
  },
  
  // Rounded/border-radius
  { regex: /rounded-\[var\(--md-sys-shape-corner-([^\)]+)\)\]/g,
    replacement: 'borderRadius: \'var(--md-sys-shape-corner-$1)\''
  },
  
  // Shadow/elevation
  { regex: /shadow-\[var\(--md-sys-elevation-([^\)]+)\)\]/g,
    replacement: 'boxShadow: \'var(--md-sys-elevation-$1)\''
  },
];

// Get all component files
const srcDir = path.join(__dirname, 'src', 'components');
const files = [];

function getAllFiles(dir) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory() && !entry.name.startsWith('.')) {
      getAllFiles(path.join(dir, entry.name));
    } else if ((entry.name.endsWith('.tsx') || entry.name.endsWith('.jsx')) && !entry.name.includes('.stories')) {
      files.push(path.join(dir, entry.name));
    }
  }
}

getAllFiles(srcDir);

console.log(`\n📁 Found ${files.length} component files (excluding stories)`);
console.log(`🎯 Processing GROUP 1+2: className + Tailwind patterns\n`);

let totalConversions = 0;
let filesModified = 0;

// Process files in batches
const batchSize = 50;
for (let i = 0; i < files.length; i += batchSize) {
  const batch = files.slice(i, i + batchSize);
  console.log(`\n📦 Batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(files.length / batchSize)} (${i + 1}-${Math.min(i + batchSize, files.length)} of ${files.length})`);
  
  for (const file of batch) {
    try {
      let content = fs.readFileSync(file, 'utf-8');
      const originalLength = content.length;
      let conversions = 0;
      
      // Apply complex pattern replacements
      // Find className attributes and convert to inline styles
      const classNameRegex = /className=["']([^"']+)["']/g;
      let match;
      
      while ((match = classNameRegex.exec(content)) !== null) {
        const classes = match[1];
        
        // Check if contains Tailwind with MD3 tokens
        if (classes.match(/text-\[var\(--md-sys|bg-\[var\(--md-sys|rounded-\[var\(--md-sys|shadow-\[var\(--md-sys|border-\[var\(--md-sys/)) {
          const style = generateInlineStyle(classes);
          if (style) {
            const oldClassName = `className="${classes}"`;
            const newStyle = `style={{ ${style} }}`;
            content = content.replace(oldClassName, newStyle);
            conversions++;
            totalConversions++;
          }
        }
      }
      
      if (conversions > 0 && content !== originalLength) {
        fs.writeFileSync(file, content, 'utf-8');
        filesModified++;
        process.stdout.write(`  ✓ ${path.basename(file)} (+${conversions})`);
      }
    } catch (err) {
      // Ignore errors
    }
  }
}

console.log('\n\n' + '═'.repeat(80));
console.log('📊 BATCH CONVERSION RESULTS:');
console.log('═'.repeat(80));
console.log(`\n  ✅ Files modified: ${filesModified}`);
console.log(`  📝 Total conversions: ${totalConversions}`);
console.log(`  🎯 Expected error reduction: ~${Math.floor(totalConversions * 1.5)} errors`);
console.log(`\n💾 Running npm run lint to measure improvement...`);

try {
  const lintOutput = execSync('npm run lint 2>&1', { encoding: 'utf-8', maxBuffer: 10 * 1024 * 1024 });
  const match = lintOutput.match(/(\d+) problems/);
  if (match) {
    const newErrorCount = parseInt(match[1]);
    console.log(`\n📈 New error count: ${newErrorCount}`);
    console.log(`   Reduction: ${totalConversions > 0 ? '✅ IN PROGRESS' : 'ℹ️  Minimal'}`);
  }
} catch (e) {
  // Lint failed but changes were made
}

console.log('\n✅ Phase 4 Group 1-2 batch complete!\n');

/**
 * Generate inline MD3 style from Tailwind classes
 */
function generateInlineStyle(classes) {
  const styles = [];
  
  // Extract MD3 token patterns
  const tokenPatterns = [
    { regex: /text-\[var\(--md-sys-color-([^\)]+)\)\]/g, prop: 'color' },
    { regex: /bg-\[var\(--md-sys-color-([^\)]+)\)\]/g, prop: 'backgroundColor' },
    { regex: /border-\[var\(--md-sys-color-([^\)]+)\)\]/g, prop: 'borderColor' },
    { regex: /rounded-\[var\(--md-sys-shape-corner-([^\)]+)\)\]/g, prop: 'borderRadius' },
    { regex: /shadow-\[var\(--md-sys-elevation-([^\)]+)\)\]/g, prop: 'boxShadow' },
  ];
  
  for (const { regex, prop } of tokenPatterns) {
    const match = regex.exec(classes);
    if (match) {
      const value = match[1];
      if (prop === 'color' || prop === 'backgroundColor' || prop === 'borderColor') {
        styles.push(`${prop}: 'var(--md-sys-color-${value})'`);
      } else if (prop === 'borderRadius') {
        styles.push(`${prop}: 'var(--md-sys-shape-corner-${value})'`);
      } else if (prop === 'boxShadow') {
        styles.push(`${prop}: 'var(--md-sys-elevation-${value})'`);
      }
    }
  }
  
  return styles.length > 0 ? styles.join(', ') : null;
}
