
import * as fs from 'fs';
import * as path from 'path';
import { colorTokens, typographyTokens, spacingTokens } from './src/theme/tokens';

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

  // Sostituisci colori hardcoded (es. #6750A4 -> theme.colors.primary)
  Object.entries(colorTokens).forEach(([key, value]) => {
    const regex = new RegExp(`(['"\`])${value}\\1`, 'g');
    updated = updated.replace(regex, `'theme.colors.${key}'`);
  });

  // Sostituisci font-size (es. font-size: 16px -> theme.typography.body1.fontSize)
  Object.entries(typographyTokens).forEach(([key, styles]) => {
    updated = updated.replace(new RegExp(`font-size:\\s*${styles.fontSize}`, 'g'), `font-size: theme.typography.${key}.fontSize`);
    updated = updated.replace(new RegExp(`line-height:\\s*${styles.lineHeight}`, 'g'), `line-height: theme.typography.${key}.lineHeight`);
    updated = updated.replace(new RegExp(`font-weight:\\s*${styles.fontWeight}`, 'g'), `font-weight: theme.typography.${key}.fontWeight`);
  });

  // Sostituisci spaziature (es. margin: 16px -> theme.spacing['4'])
  Object.entries(spacingTokens).forEach(([key, value]) => {
    updated = updated.replace(new RegExp(`(margin|padding):\\s*${value}`, 'g'), `$1: theme.spacing['${key}']`);
  });

  return updated;
}

// Script principale
function main() {
  const srcDir = path.join(__dirname, 'src');
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

  console.log('Aggiornamento completato. File aggiornati:');
  updatedFiles.forEach(file => console.log(`- ${file}`));
  if (updatedFiles.length === 0) {
    console.log('Nessun file aggiornato.');
  }
}

main();