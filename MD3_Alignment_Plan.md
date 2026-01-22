# PIANO DI ALLINEAMENTO MD3 - DOCENTEDOC AI

## OBIETTIVO
Allineare rigorosamente l'app a Material Design 3 per garantire consistenza, ripetibilità e prevedibilità visiva, senza introdurre refactor massivi o nuove varianti di design.

## VINCOLI FONDAMENTALI
- NON riscrivere l'architettura
- NON introdurre nuove varianti di design o token
- NON rompere test, lint o build
- NON "abbellire" l'app
- Ragionare sempre in termini di consistenza, ripetibilità e prevedibilità

## STEP OPERATIVI

### STEP 1: ANALISI INIZIALE (SCANSIONE CODICE)
- Scansionare tutto il codice (JS/TSX, CSS, componenti) per:
  - Colori hardcoded (#hex, rgba, valori custom)
  - Override locali di font-size, color, border-radius
  - Tipografia non standard
  - Spacing custom (padding/margin arbitrari)
  - Card annidate o superfici senza ruolo
  - Override su componenti interattivi (Button, TextField, etc.)
- Strumenti: grep_search per pattern come "#[0-9a-fA-F]{6}", "rgba\(", "font-size:", "border-radius:", ecc.
- Output: Lista di file e linee con eccezioni MD3.

### STEP 2: CLASSIFICAZIONE INCOERENZE
Classificare i problemi trovati in:
- **Bloccanti**: Colori hardcoded, override di proprietà fondamentali fuori dal theme.
- **Alto impatto**: Tipografia non standard, spacing incoerente tra schermate.
- **Minori**: Micro-differenze di padding/margin.
- **Legacy**: Override storici non impattanti, lasciare invariati.
- Documentare in un report intermedio.

### STEP 3: CORREZIONE INCOERENZE BLOCCANTI
- Rimuovere colori hardcoded sostituendoli con token MD3 (var(--md-sys-color-*)).
- Eliminare override locali di font-size, color, border-radius.
- Riallineare componenti al theme MD3.
- Verificare con lint e build dopo ogni correzione.

### STEP 4: UNIFORMARE TIPOGRAFIA E SPACING
- Ridurre varianti tipografiche a quelle MD3 standard.
- Normalizzare spacing e padding tra schermate usando token MD3.
- Assicurare che headline, title, body siano distinguibili senza colore.

### STEP 5: SEMPLIFICARE SUPERFICI E STRATI
- Eliminare card annidate inutilmente.
- Usare Card solo per separazione semantica.
- Uniformare elevazione secondo MD3.

### STEP 6: UNIFORMARE COMPONENTI INTERATTIVI
- Eliminare override locali su Button, TextField, Dialog, AppBar.
- Assicurare un solo stile per primary action, secondary e tertiary coerenti.
- Riallineare focus, hover, disabled state.

### STEP 7: VALIDAZIONE FINALE
- Eseguire lint, build e test per confermare che tutto sia verde.
- Scansionare nuovamente per verificare che le correzioni siano applicate.
- Aggiornare documentazione e report.

### STEP 8: AGGIORNAMENTO DOCUMENTI
- Creare/aggiornare report di progresso (es. MD3_Alignment_Report.md).
- Documentare eccezioni legacy e piano per refactor futuri.
- Aggiornare README o documenti di progetto con note su consistenza MD3.

## CRONOLOGIA
- Giorno 1: Step 1-2 (Analisi e classificazione)
- Giorno 2: Step 3 (Correzioni bloccanti)
- Giorno 3: Step 4-5 (Uniformare tipografia, superfici)
- Giorno 4: Step 6 (Componenti interattivi)
- Giorno 5: Step 7-8 (Validazione e documentazione)

## METRICHE DI SUCCESSO
- Zero colori hardcoded.
- Tipografia limitata a varianti MD3.
- Spacing coerente tra schermate.
- Componenti interattivi uniformi.
- Build e lint verdi.

## RISCHI E MITIGAZIONE
- Rompere build: Testare ogni modifica con lint e build.
- Perdita di funzionalità: Limitarsi a sostituzioni dirette, non refactor.
- Eccedere scope: Attenersi solo a correzioni di consistenza, non miglioramenti creativi.

Data creazione: 22 gennaio 2026
Responsabile: AI Assistant (GitHub Copilot)