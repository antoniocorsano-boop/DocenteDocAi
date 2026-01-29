import fs from 'fs';
import path from 'path';

// Percorso al JSON dei prompt
const promptsFile = path.resolve('md3-prompts.json');

// Cartella temporanea per i file pronti
const tempDir = path.resolve('md3-temp');

// Crea la cartella se non esiste
if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

// Legge e parse del JSON
let prompts;
try {
    const promptsJSON = fs.readFileSync(promptsFile, 'utf-8');
    prompts = JSON.parse(promptsJSON);
    if (!Array.isArray(prompts)) throw new Error("Il JSON deve essere un array di oggetti {file, prompt}");
} catch (err) {
    console.error(`❌ Errore nel leggere o parsare il JSON: ${err.message}`);
    process.exit(1);
}

console.log(`ℹ️ Trovati ${prompts.length} prompt nel JSON.`);

let filesProcessed = 0;
let filesMissing = 0;

prompts.forEach((item, index) => {
    if (!item.file || !item.prompt) {
        console.warn(`⚠️ Prompt #${index + 1} mancante di file o prompt`);
        return;
    }

    const filePath = path.resolve(item.file);

    if (!fs.existsSync(filePath)) {
        console.warn(`⚠️ File non trovato: ${filePath}`);
        filesMissing++;
        return;
    }

    const originalContent = fs.readFileSync(filePath, 'utf-8');

    // Inserisce il prompt in cima al file
    const contentWithPrompt = `/**
 * PROMPT MD3 MIGRATION
 * --------------------
${item.prompt.split('\n').map(line => ` * ${line}`).join('\n')}
 */

${originalContent}
`;

    const fileName = path.basename(item.file);
    const tempFilePath = path.join(tempDir, fileName);

    fs.writeFileSync(tempFilePath, contentWithPrompt, 'utf-8');
    console.log(`✅ File pronto per Copilot: ${tempFilePath}`);
    filesProcessed++;
});

console.log(`\n🎯 Preparazione completata.`);
console.log(`✅ File pronti: ${filesProcessed}`);
if (filesMissing > 0) console.log(`⚠️ File mancanti: ${filesMissing}`);
console.log(`Tutti i file pronti sono nella cartella: ${tempDir}`);
console.log(`Apri ciascun file in VSCode e usa Continue per la migrazione MD3.`);
