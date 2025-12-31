# TODO/FIXME Priorità - DocenteDoc AI

Ultimo aggiornamento: 31/12/2025 (revisione completata)

## TODO/FIXME ancora utili e rilevanti


### 1. Integrazione Cloud/Google

#### 1.1 Backup Cloud (Google Drive)
- [x] Implementare backup/sync stato app su Google Drive (`src/services/googleDriveService.ts`) **[COMPLETATO]**
- [x] Gestione separata file pesanti KB in IndexedDB locale (**Soluzione attuale: solo metadati KB su Drive, file pesanti solo locale**) **[COMPLETATO]**
- [ ] Validare periodicamente la funzionalità di backup/restore cloud da UI
	- [ ] 1. Apri Impostazioni → sezione Backup Cloud
	- [ ] 2. Clicca “Connetti Drive” e completa l’autenticazione OAuth
	- [ ] 3. Clicca “Salva Ora” per eseguire il backup cloud
	- [ ] 4. Modifica un dato locale (es. aggiungi/modifica uno studente)
	- [ ] 5. Clicca “Ripristina” e verifica che i dati tornino allo stato del backup
	- [ ] 6. Verifica che la KB sia ripristinata (solo metadati, file pesanti solo se presenti in locale)
	- [ ] 7. In caso di errore, annota dettagli e log

#### 1.2 Integrazione Google NotebookLM
- [x] Creare componente `NotebookLMImportModal.tsx` per importazione file **[COMPLETATO]**
- [x] Definire interfaccia `KnowledgeBaseEntry` in `types.ts` **[COMPLETATO]**
- [x] Integrare modale nel componente `ProgettazioneHub.tsx` **[COMPLETATO]**
- [x] Implementare servizio base OAuth in `src/services/notebooklmService.ts` **[COMPLETATO: funzioni getAuthToken, fetchNotebookFiles, syncNotebookFiles implementate]**
- [ ] Testare OAuth flow completo in produzione (richiede credenziali Google valide)
- [ ] Testare sincronizzazione file locali/remoti in ambiente reale

**Note stato:**
- La logica di backup cloud Drive è attiva e funzionante (solo metadati KB su Drive, file pesanti solo locale).
- L'integrazione NotebookLM è completamente implementata a livello di codice (UI + servizio), ma richiede test in produzione con credenziali Google valide per verificare OAuth e sincronizzazione.


### 2. Export/Documenti
- [x] Implementazione base compressione ZIP per download multipli in `src/components/BatchExportWizard.tsx` (**COMPLETATO**: funzionalità base presente, miglioramenti UX/gestione errori possibili)


### 3. Ottimizzazioni/Validazioni AI
- [x] Validare che i contenuti passati all'AI siano sempre stringhe in `src/services/aiService.ts` (**COMPLETATO**: implementata funzione `ensureString` e sostituiti tutti i commenti FIX)

### 4. Milestone e Prossimi Passi
- [ ] **Q1 2026 Milestone**: Test produzione OAuth NotebookLM e validazione backup cloud
- [ ] **Miglioramenti UX**: Ottimizzazioni interfaccia e gestione errori per export ZIP
- [ ] **Performance**: Code splitting e ottimizzazioni bundle size
- [ ] **Testing**: Espansione coverage test automatici (attualmente ~60%)

**Nota revisione 31/12/2025:**
- Stato avanzamento:
	- Backup cloud Google Drive: attivo e funzionante (solo metadati KB su Drive, file pesanti solo locale)
	- Integrazione Google NotebookLM: completamente implementata, richiede test produzione
	- Export ZIP multiplo: implementazione base completata
	- Validazione input stringa AI: completata con funzione `ensureString`
- Attività duplicate o già completate sono state rimosse.
- Prossimi passi: test in produzione per OAuth NotebookLM e validazione backup cloud periodica.
- Aggiornare questa lista dopo ogni sprint o modifica rilevante. Per dettagli, cerca `TODO`/`FIXME` nel codice.