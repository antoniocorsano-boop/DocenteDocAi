import fs from 'fs';
import path from 'path';
import OpenAI from 'openai';
import { execSync } from 'child_process';

// --- CONFIGURAZIONE ---
const ROOT_DIR = path.resolve('./src');
const BATCH_SIZE = 5; // quanti file processare per batch
const SAFE_FILE_SIZE = 250; // max righe per file sicuro
const IGNORE_PATTERNS = [/Wizard/, /AI/, /Store/, /charts/];
const SAFE_PATTERNS = [/ui/, /\.stories\.tsx$/, /pages/];

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// --- FUNZIONI UTILI ---
function isSafeFile(filePath, content) {
  const name = path.basename(filePath);
  if (IGNORE_PATTERNS.some(r => r.test(name))) return false;
  if (SAFE_PATTERNS.some(r => r.test(filePath)) && content.split('\n').length <= SAFE_FILE_SIZE) {
    return true;
  }
  return false;
}

function scanFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      results = results.concat(scanFiles(filePath));
    } else if (filePath.endsWith('.tsx')) {
      const content = fs.readFileSync(filePath, 'utf8');
      if (isSafeFile(filePath, content)) results.push({ path: filePath, content });
    }
  });
  return results;
}

// --- Genera prompt per GPT ---
function generatePrompt(filePath, content) {
  return `
Leggi questo file TSX e restituisci una versione MD3-compliant.

Regole:
- Rimuovi className
- Sostituisci layers.sys.* e layers.ref.* con var(--md-sys-*)
- Rimuovi commenti legacy MD3 NON-compliant
- Nessun valore hardcoded
- Solo inline style con token MD3
- Mantieni logica, hooks, layout e componenti
- Correggi sintassi e lint
- Restituisci solo il file completo corretto

File: ${filePath}
\`\`\`tsx
${content}
\`\`\`
`;
}

// --- Funzione per retry automatico ---
async function callWithRetry(prompt, retries = 3, delay = 5000) {
  for (let i = 0; i < retries; i++) {
    try {
      return await client.chat.completions.create({
        model: 'gpt-4.1-mini',
        messages: [{ role: 'user', content: prompt }]
      });
    } catch (err) {
      console.log(`⚠️ Tentativo ${i + 1} fallito: ${err.message}`);
      if (i < retries - 1) await new Promise(res => setTimeout(res, delay));
      else throw err;
    }
  }
}

// --- Funzione principale ---
async function migrateFiles() {
  const allFiles = scanFiles(ROOT_DIR);
  if (!allFiles.length) {
    console.log('⚠️ Nessun file sicuro trovato per la migrazione.');
    return;
  }

  const report = [];
  console.log(`📝 Trovati ${allFiles.length} file sicuri.`);

  // Elaborazione a batch
  for (let i = 0; i < allFiles.length; i += BATCH_SIZE) {
    const batch = allFiles.slice(i, i + BATCH_SIZE);
    console.log(`\n🚀 Elaborazione batch ${i / BATCH_SIZE + 1} (${batch.length} file)`);

    for (const fileObj of batch) {
      console.log(`Migrando: ${fileObj.path}`);
      const prompt = generatePrompt(fileObj.path, fileObj.content);

      try {
        const response = await callWithRetry(prompt, 3, 5000);
        const updatedFile = response.choices[0].message.content;

        fs.writeFileSync(fileObj.path, updatedFile, 'utf8');
        console.log(`✅ Salvato: ${fileObj.path}`);

        // Commit automatico
        execSync(`git add "${fileObj.path}"`);
        execSync(`git commit -m "md3: fase 1 migrazione ${path.basename(fileObj.path)}"`);

        report.push({ file: fileObj.path, status: 'migrated' });
      } catch (err) {
        console.error(`❌ Errore migrando ${fileObj.path}:`, err.message);
        report.push({ file: fileObj.path, status: 'error', message: err.message });
      }
    }

    // Piccola pausa tra batch per evitare rate limit
    if (i + BATCH_SIZE < allFiles.length) {
      console.log(`⏳ Pausa 5 secondi prima del prossimo batch...`);
      await new Promise(res => setTimeout(res, 5000));
    }
  }

  fs.writeFileSync('./md3-migration-report.json', JSON.stringify(report, null, 2));
  console.log('\n🎉 Migrazione completata. Report in md3-migration-report.json');
}

// --- Avvio ---
migrateFiles();
