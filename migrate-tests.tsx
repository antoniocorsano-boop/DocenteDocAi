import fs from 'fs';
import path from 'path';

const ROOT_DIR = path.resolve('./src'); // cartella root dei test
const IMPORT_STATEMENT = "import { renderWithM3Theme } from '../test-utils';\n";

// Funzione per patchare un singolo file
const patchTestFile = (filePath: string) => {
  let content = fs.readFileSync(filePath, 'utf-8');
  let modified = false;

  // Aggiunge import se non presente
  if (!content.includes('renderWithM3Theme')) {
    content = IMPORT_STATEMENT + content;
    modified = true;
  }

  // Sostituisce render con renderWithM3Theme
  const renderRegex = /\brender\(/g;
  if (renderRegex.test(content)) {
    content = content.replace(renderRegex, 'renderWithM3Theme(');
    modified = true;
  }

  // Opzionale: segnalazione file con useTheme (per conferma)
  if (content.includes('useTheme')) {
    console.log(`Detected useTheme usage in: ${filePath}`);
  }

  if (modified) {
    fs.writeFileSync(filePath, content);
    console.log(`Patched: ${filePath}`);
  }
};

// Funzione ricorsiva per scansionare tutte le cartelle
const walkDir = (dir: string) => {
  fs.readdirSync(dir, { withFileTypes: true }).forEach((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) walkDir(fullPath);
    else if (entry.isFile() && entry.name.endsWith('.test.tsx')) patchTestFile(fullPath);
  });
};

console.log('Starting test migration...');
walkDir(ROOT_DIR);
console.log('Migration complete!');
