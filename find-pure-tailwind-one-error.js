#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Get all tsx files
const componentsDir = path.join(__dirname, 'src/components');
const files = execSync(`powershell -Command "Get-ChildItem -Path ${componentsDir} -Filter '*.tsx' -Recurse | Select-Object FullName"`).toString().split('\n').filter(f => f.trim());

console.log(`🔍 Scanning ${files.length} component files...\n`);

const pureUtilities = new Set([
  'flex', 'grid', 'block', 'inline', 'inline-block', 'hidden',
  'w-', 'h-', 'gap-', 'space-', 'p-', 'm-',
  'text-', 'font-', 'bg-', 'border-', 'rounded-',
  'hover:', 'focus:', 'active:', 'md:', 'lg:', 'xl:',
  'min-w-', 'max-w-', 'min-h-', 'max-h-',
  'absolute', 'relative', 'fixed', 'sticky',
  'top-', 'bottom-', 'left-', 'right-',
  'z-', 'opacity-', 'cursor-', 'pointer-events-',
  'shadow-', 'transform', 'scale-', 'translate-',
  'rotate-', 'justify-', 'items-', 'align-',
  'overflow-', 'truncate', 'line-clamp-',
  'uppercase', 'lowercase', 'capitalize', 'normal-case'
]);

const results = [];

for (const filePath of files) {
  if (!filePath.includes('.tsx')) continue;

  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const classNameMatches = content.match(/className=["'`]([^"'`]+)["'`]/g);

    if (!classNameMatches) continue;

    // Count only Tailwind utilities, not custom CSS classes
    const isPureTailwind = classNameMatches.every(match => {
      const classes = match.replace(/className=["'`]/g, '').replace(/["'`]$/g, '');
      const classArray = classes.split(/\s+/);
      
      return classArray.every(cls => {
        // Check if it's a pure Tailwind utility
        return pureUtilities.has(cls) || 
               [...pureUtilities].some(util => cls.startsWith(util)) ||
               cls.match(/^!/) ||  // Important flag
               cls === 'material-symbols-outlined'; // Special case
      });
    });

    if (isPureTailwind && classNameMatches.length > 0) {
      results.push({
        file: path.relative(__dirname, filePath),
        classCount: classNameMatches.length,
        classes: classNameMatches.slice(0, 2).join(' | ')
      });
    }
  } catch (e) {
    // ignore
  }
}

console.log('✅ FILES WITH PURE TAILWIND CLASSNAMES:\n');
results.sort((a, b) => a.classCount - b.classCount).slice(0, 15).forEach(r => {
  console.log(`${r.file}`);
  console.log(`   ${r.classCount} className(s): ${r.classes.substring(0, 100)}\n`);
});
