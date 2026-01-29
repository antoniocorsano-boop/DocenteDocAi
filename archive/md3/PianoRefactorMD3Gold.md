# Piano di Refactor MD3 Gold — Modalità Document Driven

## 1. Fase di Allineamento Documentale (BLOCCANTE)

- Verifica presenza e integrità dei seguenti documenti:
  - MD3_GOVERNANCE_COMPLIANCE_CONTRACT.md (root, vincolante)
  - .github/prompt-audit-critico-md3.md (audit)
  - .github/prompt-refactor-md3-gold.md (refactor)
  - .github/copilot-instructions.md (istruzioni Copilot)
- Se manca o è ambiguo anche solo un documento, fermarsi e segnalare.

## 2. Fase di Audit Preliminare (BLOCCANTE)

- Eseguire audit automatico/manuale su tutti i file React/TSX:
  - Ricerca di ogni violazione: px, rem, %, hex, rgba, className, utility CSS, spacing/dimensioni hardcoded, transizioni custom, elevation, componenti non MD3.
  - Ogni violazione va documentata in un report audit (es. audit/md3-compliance-report.md).
- Se il report non è completo o ci sono dubbi su una regola, fermarsi e segnalare.

## 3. Fase di Refactor Guidato (STRICT)

- Applicare refactor SOLO secondo prompt .github/prompt-refactor-md3-gold.md.
- Ogni modifica deve:
  - Eliminare ogni valore hardcoded, sostituendo solo con token MD3 (var(--md-sys-\*)).
  - Usare solo componenti MD3/wrapper approvati.
  - Non modificare layout visivo (no cambi di spacing/dimensioni percepite).
  - Non introdurre nuovi token senza dichiarazione e approvazione.
  - Non introdurre eccezioni senza documentazione e approvazione.
- Ogni step va documentato in CHANGELOG e nel report audit.

## 4. Fase di Validazione e Blocco Errori

- Dopo ogni refactor, eseguire:
  - npm run build e npm run test
  - Audit Problems panel e lint
- Se emergono errori, fermarsi e risolvere PRIMA di proseguire.
- Se un errore deriva da ambiguità documentale, fermarsi e segnalare.

## 5. Fase di Commit e Governance

- Ogni commit deve:
  - Avere messaggio conforme a convenzione (es. fix(md3): [descrizione])
  - Allegare report audit aggiornato.
  - Essere bloccato da pre-commit hook che verifica compliance (se presente).

## 6. Fase di Rollout e Monitoraggio

- Applicare la stessa procedura a ogni nuovo file/feature.
- Aggiornare la checklist e il report audit a ogni ciclo.

---

### Dubbi da chiarire PRIMA di procedere:

- Tutti i token MD3 necessari sono già definiti in theme/tokens.ts? Se manca un token, va proposto e documentato.
- Tutti i wrapper MD3 usati sono approvati dal contratto? Se c’è un wrapper custom, serve approvazione/documentazione.
- Le eccezioni (es. transizioni, motion, expressive) sono già documentate e approvate? Se no, bloccare.
