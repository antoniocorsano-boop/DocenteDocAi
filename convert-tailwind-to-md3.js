#!/usr/bin/env node

/**
 * Bulk Tailwind to MD3 Token Converter
 * Converts className attributes to inline styles with MD3 tokens
 */

const fs = require('fs');
const path = require('path');

// Mapping of Tailwind classes to MD3 CSS properties
const TAILWIND_TO_MD3 = {
  // Layout
  'flex': 'display: \'flex\'',
  'grid': 'display: \'grid\'',
  'inline-flex': 'display: \'inline-flex\'',
  'block': 'display: \'block\'',
  'inline': 'display: \'inline\'',
  'flex-col': 'flexDirection: \'column\'',
  'flex-row': 'flexDirection: \'row\'',
  'flex-wrap': 'flexWrap: \'wrap\'',
  'flex-grow': 'flex: 1',
  'w-full': 'width: \'100%\'',
  'h-full': 'height: \'100%\'',
  
  // Spacing (gaps and padding)
  'gap-1': 'gap: \'var(--md-sys-spacing-1)\'',
  'gap-2': 'gap: \'var(--md-sys-spacing-2)\'',
  'gap-3': 'gap: \'var(--md-sys-spacing-3)\'',
  'gap-4': 'gap: \'var(--md-sys-spacing-4)\'',
  'gap-6': 'gap: \'var(--md-sys-spacing-6)\'',
  'gap-8': 'gap: \'var(--md-sys-spacing-8)\'',
  'gap-12': 'gap: \'var(--md-sys-spacing-12)\'',
  'gap-16': 'gap: \'var(--md-sys-spacing-16)\'',
  
  'p-1': 'padding: \'var(--md-sys-spacing-1)\'',
  'p-2': 'padding: \'var(--md-sys-spacing-2)\'',
  'p-3': 'padding: \'var(--md-sys-spacing-3)\'',
  'p-4': 'padding: \'var(--md-sys-spacing-4)\'',
  'p-5': 'padding: \'var(--md-sys-spacing-5)\'',
  'p-6': 'padding: \'var(--md-sys-spacing-6)\'',
  'p-8': 'padding: \'var(--md-sys-spacing-8)\'',
  
  'space-y-3': 'gap: \'var(--md-sys-spacing-3)\'',
  'space-y-6': 'gap: \'var(--md-sys-spacing-6)\'',
  'space-y-8': 'gap: \'var(--md-sys-spacing-8)\'',
  
  // Border radius
  'rounded-full': 'borderRadius: \'9999px\'',
  'rounded-lg': 'borderRadius: \'var(--md-sys-shape-corner-large)\'',
  'rounded-md': 'borderRadius: \'var(--md-sys-shape-corner-medium)\'',
  'rounded-sm': 'borderRadius: \'var(--md-sys-shape-corner-small)\'',
  
  // Text styling
  'text-center': 'textAlign: \'center\'',
  'text-left': 'textAlign: \'left\'',
  'text-right': 'textAlign: \'right\'',
  'text-xs': 'fontSize: \'var(--md-sys-typescale-label-small-font-size)\'',
  'text-sm': 'fontSize: \'var(--md-sys-typescale-body-small-font-size)\'',
  'text-base': 'fontSize: \'var(--md-sys-typescale-body-medium-font-size)\'',
  'text-lg': 'fontSize: \'var(--md-sys-typescale-body-large-font-size)\'',
  'text-xl': 'fontSize: \'var(--md-sys-typescale-headline-small-font-size)\'',
  'text-2xl': 'fontSize: \'var(--md-sys-typescale-headline-medium-font-size)\'',
  'text-3xl': 'fontSize: \'var(--md-sys-typescale-display-small-font-size)\'',
  
  // Colors
  'text-primary': 'color: \'var(--md-sys-color-primary)\'',
  'text-secondary': 'color: \'var(--md-sys-color-secondary)\'',
  'text-tertiary': 'color: \'var(--md-sys-color-tertiary)\'',
  'text-error': 'color: \'var(--md-sys-color-error)\'',
  'bg-primary': 'backgroundColor: \'var(--md-sys-color-primary)\'',
  'bg-secondary': 'backgroundColor: \'var(--md-sys-color-secondary)\'',
  'bg-error': 'backgroundColor: \'var(--md-sys-color-error)\'',
  
  // Borders
  'border': 'border: \'1px solid var(--md-sys-color-outline)\'',
  'border-b': 'borderBottom: \'1px solid var(--md-sys-color-outline)\'',
  'border-t': 'borderTop: \'1px solid var(--md-sys-color-outline)\'',
  'border-l': 'borderLeft: \'1px solid var(--md-sys-color-outline)\'',
  'border-r': 'borderRight: \'1px solid var(--md-sys-color-outline)\'',
  
  // Alignment
  'items-center': 'alignItems: \'center\'',
  'items-start': 'alignItems: \'flex-start\'',
  'items-end': 'alignItems: \'flex-end\'',
  'justify-center': 'justifyContent: \'center\'',
  'justify-between': 'justifyContent: \'space-between\'',
  'justify-start': 'justifyContent: \'flex-start\'',
  'justify-end': 'justifyContent: \'flex-end\'',
};

// Mapping for complex patterns (regex-based)
const COMPLEX_PATTERNS = [
  {
    pattern: /w-(\d+)/,
    replacement: (match) => {
      const num = parseInt(match[1]);
      return `width: '${num * 4}px'`; // Tailwind: 1 = 4px
    }
  },
  {
    pattern: /h-(\d+)/,
    replacement: (match) => {
      const num = parseInt(match[1]);
      return `height: '${num * 4}px'`;
    }
  },
  {
    pattern: /text-\[([^\]]+)\]/,
    replacement: (match) => `fontSize: '${match[1]}'`
  },
  {
    pattern: /bg-\[([^\]]+)\]/,
    replacement: (match) => `backgroundColor: '${match[1]}'`
  },
  {
    pattern: /rounded-\[([^\]]+)\]/,
    replacement: (match) => `borderRadius: '${match[1]}'`
  },
  {
    pattern: /shadow-\[([^\]]+)\]/,
    replacement: (match) => `boxShadow: '${match[1]}'`
  },
];

function convertClassNameToStyle(classStr) {
  const classes = classStr.split(' ').filter(c => c.trim());
  const styles = [];
  const remaining = [];
  
  for (const cls of classes) {
    if (TAILWIND_TO_MD3[cls]) {
      styles.push(TAILWIND_TO_MD3[cls]);
    } else {
      // Try complex patterns
      let found = false;
      for (const {pattern, replacement} of COMPLEX_PATTERNS) {
        const match = cls.match(pattern);
        if (match) {
          styles.push(replacement(match));
          found = true;
          break;
        }
      }
      if (!found) {
        remaining.push(cls);
      }
    }
  }
  
  return {
    styles: styles.length > 0 ? `{{ ${styles.join(', ')} }}` : null,
    remaining: remaining
  };
}

function processFile(filePath) {
  console.log(`Processing: ${path.basename(filePath)}`);
  
  let content = fs.readFileSync(filePath, 'utf-8');
  let modified = false;
  
  // Find className attributes with Tailwind classes
  const classNameRegex = /className=["']([^"']*tailwind|[^"']*\s(?:flex|gap|p-|w-|h-|text-|bg-|rounded|border|items|justify|grid)[^"']*)["']/g;
  
  content = content.replace(classNameRegex, (match, classes) => {
    const { styles, remaining } = convertClassNameToStyle(classes);
    modified = true;
    
    if (remaining.length > 0) {
      console.log(`  ⚠️  Could not convert: ${remaining.join(', ')}`);
      return match; // Keep original if has unmapped classes
    }
    
    if (styles) {
      return `style=${styles}`;
    }
    
    return '';
  });
  
  if (modified) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`  ✅ Updated!`);
  } else {
    console.log(`  ℹ️  No changes needed`);
  }
  
  return modified;
}

// Process top files
const topFiles = [
  'src/components/HelpModal.tsx',
  'src/components/SignInScreen.tsx',
  'src/components/EvaluationModule.tsx',
];

console.log('🚀 Starting Tailwind to MD3 conversion...\n');

let filesModified = 0;
topFiles.forEach(file => {
  const fullPath = path.join(process.cwd(), file);
  if (fs.existsSync(fullPath)) {
    if (processFile(fullPath)) {
      filesModified++;
    }
  } else {
    console.log(`⚠️  File not found: ${file}`);
  }
  console.log('');
});

console.log(`\n✅ Conversion complete! ${filesModified} files modified.`);
