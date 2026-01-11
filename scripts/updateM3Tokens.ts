import * as fs from 'fs';
import * as path from 'path';
import { colorTokens, darkColorTokens, typographyTokens, spacingTokens, motionTokens } from '../src/theme/tokens';

// Funzione per scansionare file ricorsivamente
function scanDirectory(dir: string, extensions: string[]): string[] {
  const files: string[] = [];
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
      files.push(...scanDirectory(fullPath, extensions));
    } else if (stat.isFile() && extensions.some(ext => fullPath.endsWith(ext))) {
      files.push(fullPath);
    }
  }
  return files;
}

// Funzione per sostituire valori hardcoded
function replaceHardcodedValues(content: string): string {
  let updated = content;

  // Evita sostituzioni dentro stringhe o template literals
  const stringRegex = /(['"`])((?:\\.|(?!\1)[^\\])*?)\1/g;
  const placeholders: string[] = [];
  let placeholderIndex = 0;

  // Sostituisci temporaneamente le stringhe con placeholder
  updated = updated.replace(stringRegex, (match) => {
    placeholders[placeholderIndex] = match;
    return `__STRING_PLACEHOLDER_${placeholderIndex++}__`;
  });

  // Ora sostituisci valori hardcoded nel codice rimanente
  // Sostituisci colori hardcoded (es. #6750A4 -> theme.colors.primary)
  const allColors = { ...colorTokens, ...darkColorTokens };
  Object.entries(allColors).forEach(([key, value]) => {
    const regex = new RegExp(`\\b${value}\\b`, 'g');
    updated = updated.replace(regex, `theme.colors.${key}`);
  });

  // Sostituisci tipografia (es. font-size: 16px -> theme.typography.body1.fontSize)
  Object.entries(typographyTokens).forEach(([key, styles]) => {
    updated = updated.replace(new RegExp(`font-size:\\s*${styles.fontSize}`, 'g'), `font-size: theme.typography.${key}.fontSize`);
    updated = updated.replace(new RegExp(`line-height:\\s*${styles.lineHeight}`, 'g'), `line-height: theme.typography.${key}.lineHeight`);
    updated = updated.replace(new RegExp(`font-weight:\\s*${styles.fontWeight}`, 'g'), `font-weight: theme.typography.${key}.fontWeight`);
  });

  // Sostituisci spaziature (es. margin: 16px -> theme.spacing['4'])
  Object.entries(spacingTokens).forEach(([key, value]) => {
    updated = updated.replace(new RegExp(`(margin|padding):\\s*${value}`, 'g'), `$1: theme.spacing['${key}']`);
  });

  // Sostituisci motion (es. transition-duration: 200ms -> theme.motion.duration.short4)
  Object.entries(motionTokens.duration).forEach(([key, value]) => {
    updated = updated.replace(new RegExp(`transition-duration:\\s*${value}`, 'g'), `transition-duration: theme.motion.duration.${key}`);
  });

  // Sostituisci easing (es. transition-timing-function: cubic-bezier(0.2, 0.0, 0, 1.0) -> theme.motion.easing.standard)
  Object.entries(motionTokens.easing).forEach(([key, value]) => {
    const escapedValue = value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    updated = updated.replace(new RegExp(`transition-timing-function:\\s*${escapedValue}`, 'g'), `transition-timing-function: theme.motion.easing.${key}`);
  });

  // Ripristina le stringhe originali
  placeholders.forEach((placeholder, index) => {
    updated = updated.replace(`__STRING_PLACEHOLDER_${index}__`, placeholder);
  });

  return updated;
}

// Script principale
function main() {
  const srcDir = path.join(__dirname, '..', 'src');
  const files = scanDirectory(srcDir, ['.tsx', '.css']);
  const updatedFiles: string[] = [];

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf-8');
    const updatedContent = replaceHardcodedValues(content);
    if (content !== updatedContent) {
      fs.writeFileSync(file, updatedContent, 'utf-8');
      updatedFiles.push(file);
    }
  }

  console.log('Aggiornamento M3 completato. File aggiornati:');
  updatedFiles.forEach(file => console.log(`- ${path.relative(process.cwd(), file)}`));
  if (updatedFiles.length === 0) {
    console.log('Nessun file aggiornato.');
  }
}

main();