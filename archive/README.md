# Archive Directory

Questa cartella contiene file archiviati che non sono più necessari per lo sviluppo attivo dell'applicazione ma sono conservati per riferimento storico.

## Struttura

### migration-reports/
Report e documentazione delle fasi di migrazione MD3 completate.
- File PHASE_*.md: Report delle fasi di migrazione
- File MD3_MIGRATION_*.md: Documentazione tecnica della migrazione
- File di pianificazione e strategia di migrazione

### lint-analysis/
File di analisi ESLint e linting delle varie fasi del progetto.
- File eslint-*.json: Risultati delle analisi ESLint per componenti specifici
- File lint-*.txt/json: Output delle analisi di linting
- File di analisi componenti e violazioni

### scripts/
Script di migrazione, fix e utility utilizzati durante lo sviluppo.
- Script Python per migrazione componenti
- Script PowerShell per migrazione MD3
- Tool di analisi e generazione report
- Script di deployment temporanei

### debug/
File di debug, log e output temporanei.
- Log di test e build
- File di coverage
- Screenshot e trace di debug
- File di configurazione temporanei

### reports/
Report di progresso e documentazione storica.
- Report di completamento fasi
- Checklist e guide temporanee
- Documentazione di progetto archiviata

## Note importanti

- Questi file sono conservati per riferimento storico e troubleshooting
- Non modificare i file in questa cartella
- Per sviluppo attivo, utilizzare solo i file nella root directory
- I file MD3 attuali sono mantenuti in root: `MD3_Alignment_Plan.md`, `MD3_Analysis_Report.md`, `MD3_Alignment_Final_Report.md`

Data archiviazione: 22 gennaio 2026