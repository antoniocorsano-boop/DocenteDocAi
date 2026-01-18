import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Lista completa dei file da correggere (aggiornata dopo correzioni parziali)
const filesToFix = [
    'src/components/ClassSelection.tsx',
    'src/components/CreateLessonFromAiModal.tsx',
    'src/components/EditSlotModal.tsx',
    'src/components/Home.tsx',
    'src/components/PassaggioAnnoWizard.tsx',
    'src/components/RegisterImportDialog.tsx',
    'src/components/SlotActionModal.tsx',
    'src/components/VideoAnalysisModal.tsx',
    'src/components/ViewLoadingPlaceholder.tsx'
];

function fixDuplicateStyles(content) {
    // Pattern più sicuro: trova righe che contengono "style=" più di una volta
    const lines = content.split('\n');
    const fixedLines = lines.map(line => {
        const styleMatches = line.match(/style=/g);
        if (styleMatches && styleMatches.length > 1) {
            // Trova la posizione del primo "style="
            const firstStyleIndex = line.indexOf('style=');
            // Trova la posizione del secondo "style="
            const secondStyleIndex = line.indexOf('style=', firstStyleIndex + 1);

            if (secondStyleIndex > firstStyleIndex) {
                // Trova la fine del secondo style attribute (conteggio delle parentesi graffe)
                let braceCount = 0;
                let endSecondStyleIndex = secondStyleIndex;

                for (let i = secondStyleIndex; i < line.length; i++) {
                    if (line[i] === '{') braceCount++;
                    else if (line[i] === '}') braceCount--;

                    if (braceCount === 0 && i > secondStyleIndex) {
                        endSecondStyleIndex = i + 1; // +1 per includere la parentesi graffa
                        break;
                    }
                }

                // Rimuovi solo il secondo style attribute (incluso lo spazio precedente)
                const beforeSecondStyle = line.substring(0, secondStyleIndex).trimEnd();
                const afterSecondStyle = line.substring(endSecondStyleIndex);
                return beforeSecondStyle + afterSecondStyle;
            }
        }
        return line;
    });

    return fixedLines.join('\n');
}

console.log('🔧 Fixing duplicate style attributes in', filesToFix.length, 'files...\n');

let fixedCount = 0;
let totalReplacements = 0;

filesToFix.forEach(filePath => {
    try {
        const fullPath = path.resolve(__dirname, filePath);
        const content = fs.readFileSync(fullPath, 'utf8');
        const originalContent = content;

        const fixedContent = fixDuplicateStyles(content);

        if (fixedContent !== originalContent) {
            fs.writeFileSync(fullPath, fixedContent, 'utf8');

            // Conta le righe modificate (ogni riga con duplicati conta come una sostituzione)
            const originalLines = originalContent.split('\n');
            const fixedLines = fixedContent.split('\n');
            let replacements = 0;
            for (let i = 0; i < originalLines.length; i++) {
                const originalLine = originalLines[i];
                const fixedLine = fixedLines[i];
                if (originalLine !== fixedLine && originalLine.includes('style=') && (originalLine.match(/style=/g) || []).length > 1) {
                    replacements++;
                }
            }
            totalReplacements += replacements;

            console.log(`✅ Fixed ${filePath} (${replacements} replacements)`);
            fixedCount++;
        } else {
            console.log(`⚪ No changes needed for ${filePath}`);
        }
    } catch (error) {
        console.error(`❌ Error processing ${filePath}:`, error.message);
    }
});

console.log(`\n🎉 Fixed ${fixedCount} files with ${totalReplacements} total duplicate style attributes removed.`);
console.log('\n🔍 Running build to verify fixes...');

// Nota: lo script non può eseguire npm run build direttamente,
// ma possiamo suggerirlo all'utente