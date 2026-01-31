#!/usr/bin/env node
/**
 * Script: md3-pr-draft.js
 * Scopo: Automatizzare branch, commit e preparazione draft PR per MD3 Platinum Recovery
 */

const { execSync } = require('child_process');
const fs = require('fs');

// Configurazione
const BRANCH_NAME = 'md3-platinum-recovery-phase1';
const COMMIT_MSG = 'feat(MD3 Platinum Recovery): apply skeleton, props, MD3 tokens, TODO snapshot placeholders';
const FILES_TO_ADD = [
  'src/components/**',
  'CHECKLIST.md',
  '.vscode/md3-governance.code-snippets'
];
const PR_BODY = `
# MD3 Platinum Recovery — Phase 1

## Modifiche principali
- Header comment /* GENERATED: MD3 Platinum Recovery — DO NOT EDIT MANUALLY */
- Props standard aggiunti (fullWidth, label, onClick)
- Skeleton responsive per Header, Home, Navigation, Cards
- Uso esclusivo di MD3 tokens (var(--md-sys-*))
- TODO snapshot/Playwright comment con link a [CHECKLIST.md](./CHECKLIST.md)

## Checklist Fasi 1-5
- [ ] Fase 1: Freeze & Stabilizzazione
- [ ] Fase 2: Pulizia tecnica mirata
- [ ] Fase 3: Restyling UX critico
- [ ] Fase 4: Automazione & Governance
- [ ] Fase 5: Miglioramenti progressivi

> Tutte le modifiche AST-safe, nessuna modifica alle espressioni JS/TS esistenti.
`;

try {
  // 1️⃣ Creare branch (o switchare se esiste)
  try {
    execSync(`git checkout -b ${BRANCH_NAME}`, { stdio: 'inherit' });
  } catch {
    execSync(`git checkout ${BRANCH_NAME}`, { stdio: 'inherit' });
  }

  // 2️⃣ Aggiungere file
  execSync(`git add src/components/** CHECKLIST.md`, { stdio: 'inherit' });
  execSync(`git add -f .vscode/md3-governance.code-snippets`, { stdio: 'inherit' });

  // 3️⃣ Commit
  execSync(`git commit -m "${COMMIT_MSG}"`, { stdio: 'inherit' });

  // 4️⃣ Push
  execSync(`git push origin ${BRANCH_NAME}`, { stdio: 'inherit' });

  // 5️⃣ Generare file body PR temporaneo
  fs.writeFileSync('PR_BODY.md', PR_BODY);
  console.log('\n✅ Branch creato, commit fatto, push eseguito.');
  console.log('📄 PR body salvato in PR_BODY.md. Copia e incolla in GitHub per draft PR.');
} catch (error) {
  console.error('❌ Errore durante l\'esecuzione dello script:', error.message);
  process.exit(1);
}