# DocenteDoc AI

> Nota rapida: le istruzioni canoniche (design MD3, token-only, M3 custom-first, test/coverage) sono in [.github/copilot-instructions_v2.md](../.github/copilot-instructions_v2.md). Riferisciti a quelle per qualsiasi modifica.

DocenteDoc AI è un ecosistema didattico intelligente progettato per docenti italiani. Questa applicazione web progressiva (PWA) è costruita con un'architettura **Local-First**, garantendo che tutti i dati sensibili rimangano sul dispositivo dell'utente.

## Panoramica del Progetto

Il progetto include una serie di componenti React e stili CSS modulari, tutti progettati per rispettare le linee guida di Material Design 3 (MD3). Per garantire la conformità a queste linee guida, è stato sviluppato uno script di auditing che analizza i file `.tsx` e `.module.css` nella directory `src/components/`.

## Funzionalità Principali

- Gestione di studenti, valutazioni e lezioni
- Calendario e orario scolastico
- Assistente AI integrato
- Generazione di documenti
- Backup su Google Drive
- Crittografia locale dei dati sensibili

## Audit di Conformità a MD3

Lo script `scripts/audit-md3-expressive.js` esegue un'analisi statica sui file `.tsx` e `.module.css` per verificare la conformità ai requisiti espressivi di Material Design 3. Le seguenti aree vengono controllate:

- **Coerenza delle forme**: Verifica che le forme utilizzate nei componenti siano conformi alle linee guida di MD3.
- **Utilizzo dei token di elevazione**: Controlla che i componenti utilizzino correttamente i token di elevazione.
- **Durata del movimento e easing**: Analizza le animazioni per garantire che rispettino le durate e gli easing raccomandati.
- **Token tipografici**: Verifica l'uso corretto dei token tipografici.
- **Griglia di spaziatura**: Controlla che gli spazi siano conformi alla griglia di spaziatura di MD3.
- **Token di colore**: Assicura che i colori utilizzati siano conformi ai token di colore di MD3.

## Istruzioni per l'Installazione

1. Clona il repository:
   ```
   git clone <repository-url>
   ```
2. Naviga nella directory del progetto:
   ```
   cd docentedoc-ai
   ```
3. Installa le dipendenze:
   ```
   npm install
   ```

## Esecuzione dell'Audit

Per eseguire l'audit della conformità a MD3, utilizza il seguente comando:
```
node scripts/audit-md3-expressive.js
```

Questo script analizzerà i file nella directory `src/components/` e fornirà un report sui problemi di conformità riscontrati, insieme a suggerimenti per le correzioni.

## Contribuire

Se desideri contribuire al progetto, sentiti libero di aprire una pull request o segnalare problemi. La tua partecipazione è molto apprezzata!

## Licenza

Questo progetto è concesso in licenza sotto la MIT License. Vedi il file LICENSE per ulteriori dettagli.