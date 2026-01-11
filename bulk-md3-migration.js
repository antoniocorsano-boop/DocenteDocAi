/**
 * bulk-md3-migration.js
 *
 * Script per migrazione massiva incrementale MD3
 * Converte pattern comuni di className in inline styles MD3
 * Usage: node bulk-md3-migration.js [--dry-run] [--component=ComponentName]
 */

import fs from 'fs';
import { glob } from 'glob';

// Pattern comuni da migrare (className → style)
const migrationPatterns = {
  // Material Symbols
  'material-symbols-outlined': {
    style: { fontFamily: 'Material Symbols Outlined' },
    requiresUseTheme: false
  },

  // Layout comuni
  'flex': { style: { display: 'flex' }, requiresUseTheme: false },
  'flex flex-col': { style: { display: 'flex', flexDirection: 'column' }, requiresUseTheme: false },
  'flex flex-row': { style: { display: 'flex', flexDirection: 'row' }, requiresUseTheme: false },
  'flex items-center': { style: { display: 'flex', alignItems: 'center' }, requiresUseTheme: false },
  'flex justify-center': { style: { display: 'flex', justifyContent: 'center' }, requiresUseTheme: false },
  'flex items-center justify-center': {
    style: { display: 'flex', alignItems: 'center', justifyContent: 'center' },
    requiresUseTheme: false
  },

  // Spacing
  'space-y-4': { style: { marginTop: 'var(--md-sys-spacing-4)' }, requiresUseTheme: false },
  'space-y-8': { style: { marginTop: 'var(--md-sys-spacing-8)' }, requiresUseTheme: false },
  'gap-4': { style: { gap: 'var(--md-sys-spacing-4)' }, requiresUseTheme: false },
  'gap-6': { style: { gap: 'var(--md-sys-spacing-6)' }, requiresUseTheme: false },
  'gap-8': { style: { gap: 'var(--md-sys-spacing-8)' }, requiresUseTheme: false },

  // Grid
  'grid': { style: { display: 'grid' }, requiresUseTheme: false },
  'grid grid-cols-1': { style: { display: 'grid', gridTemplateColumns: '1fr' }, requiresUseTheme: false },
  'grid grid-cols-2': { style: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)' }, requiresUseTheme: false },
  'grid grid-cols-3': { style: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }, requiresUseTheme: false },

  // Padding
  'p-4': { style: { padding: 'var(--md-sys-spacing-4)' }, requiresUseTheme: false },
  'p-8': { style: { padding: 'var(--md-sys-spacing-8)' }, requiresUseTheme: false },
  'px-4': { style: { paddingLeft: 'var(--md-sys-spacing-4)', paddingRight: 'var(--md-sys-spacing-4)' }, requiresUseTheme: false },
  'py-4': { style: { paddingTop: 'var(--md-sys-spacing-4)', paddingBottom: 'var(--md-sys-spacing-4)' }, requiresUseTheme: false },

  // Colors (semplici)
  'text-primary': { style: { color: 'var(--md-sys-color-primary)' }, requiresUseTheme: false },
  'bg-surface': { style: { backgroundColor: 'var(--md-sys-color-surface)' }, requiresUseTheme: false },
  'border-outline-variant': { style: { borderColor: 'var(--md-sys-color-outline-variant)' }, requiresUseTheme: false }
};

// Funzione per applicare migrazioni
async function migrateComponents(dryRun = false, targetComponent = null) {
  const componentFiles = await glob('src/components/**/*.tsx');

  for (const filePath of componentFiles) {
    if (targetComponent && !filePath.includes(targetComponent)) continue;

    console.log(`Processing ${filePath}...`);

    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    let needsUseTheme = false;

    // Applica pattern di migrazione
    for (const [className, config] of Object.entries(migrationPatterns)) {
      const regex = new RegExp(`className=["']${escapeRegex(className)}["']`, 'g');

      if (regex.test(content)) {
        // Converti className in style
        const styleString = JSON.stringify(config.style, null, 2)
          .replace(/"([^"]+)":/g, '$1:') // Rimuovi quotes dalle chiavi
          .replace(/"/g, "'"); // Singole quotes per valori

        content = content.replace(regex, `style={${styleString}}`);
        modified = true;

        if (config.requiresUseTheme) needsUseTheme = true;
      }
    }

    // Aggiungi useTheme se necessario
    if (needsUseTheme && !content.includes("import { useTheme }")) {
      // Trova import React
      const importMatch = content.match(/import React.*from 'react';/);
      if (importMatch) {
        content = content.replace(importMatch[0],
          `${importMatch[0]}\nimport { useTheme } from '../theme/theme';`
        );
        modified = true;
      }
    }

    if (modified) {
      if (dryRun) {
        console.log(`Would modify ${filePath}`);
      } else {
        fs.writeFileSync(filePath, content);
        console.log(`Modified ${filePath}`);
      }
    }
  }
}

// Utility per escape regex
function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Main
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const componentArg = args.find(arg => arg.startsWith('--component='));
const targetComponent = componentArg ? componentArg.split('=')[1] : null;

migrateComponents(dryRun, targetComponent).catch(console.error);