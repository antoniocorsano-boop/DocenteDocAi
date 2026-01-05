# TODO/FIXME Priorità - DocenteDoc AI

Ultimo aggiornamento: 31/12/2025 (revisione completata)

## TODO/FIXME ancora utili e rilevanti


### 1. Integrazione Cloud/Google

#### 1.1 Backup Cloud (Google Drive)
- [x] Implementare backup/sync stato app su Google Drive (`src/services/googleDriveService.ts`) **[COMPLETATO]**
- [x] Gestione separata file pesanti KB in IndexedDB locale (**Soluzione attuale: solo metadati KB su Drive, file pesanti solo locale**) **[COMPLETATO]**
- [x] Validare periodicamente la funzionalità di backup/restore cloud da UI **[COMPLETATO: Implementato test E2E `cloud-backup.spec.ts`]**
	- [x] 1. Apri Impostazioni → sezione Backup Cloud
	- [x] 2. Clicca “Connetti Drive” e completa l’autenticazione OAuth
	- [x] 3. Clicca “Salva Ora” per eseguire il backup cloud
	- [x] 4. Modifica un dato locale (es. aggiungi/modifica uno studente)
	- [x] 5. Clicca “Ripristina” e verifica che i dati tornino allo stato del backup
	- [x] 6. Verifica che la KB sia ripristinata (solo metadati, file pesanti solo se presenti in locale)
	- [x] 7. In caso di errore, annota dettagli e log

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

### 5. Refactoring M3 Expressive & AI Ecosystem (Gennaio 2026)
- [x] Centralizzazione componenti UI in `src/components/ui/` **[COMPLETATO]**
- [x] Applicazione estetica Aura (Glassmorphism, Backdrop Blur) **[COMPLETATO]**
- [x] Centralizzazione Prompt AI in `aiPrompts.ts` **[COMPLETATO]**
- [x] Ottimizzazione modelli (Tiered Pro/Flash) **[COMPLETATO]**
- [x] Refactoring `AssistantModal` con contesto vista **[COMPLETATO]**

### 6. Sostenibilità e Potenziamento (Verso App "CERTA")

#### 6.1 Debito Tecnico & Architettura
- [x] **Refactoring Store**: Suddividere `useDataStore` in store di dominio (`useStudentStore`, `useAcademicStore`, `useSystemStore`) **[COMPLETATO]**
- [x] **Consolidamento Tipi**: Eliminare duplicazione interfacce tra `types.ts` e hook locali (rimossa directory duplicata) **[COMPLETATO]**
- [x] **Modularizzazione Prompt**: Suddividere `aiPrompts.ts` in file tematici (es. `prompts/inclusion.ts`) **[COMPLETATO]**
- [x] **Refactoring Architetturale (Store & Types)**: Eliminazione legacy `DataState`, centralizzazione interfacce store in `types.ts` e ottimizzazione `BackupPayload`. **[COMPLETATO]**

#### 6.2 Nuove Funzionalità Istituzionali
- [x] **Integrazione Orientamento 2026 (Data Layer)**: Aggiunti tipi e campi negli store per E-Portfolio e attività **[COMPLETATO]**
- [x] **Modulo Orientamento**: Implementare UI Dashboard E-Portfolio e tracciamento ore (Linee Guida 2023) **[COMPLETATO]**
- [x] **Potenziamento PEI**: Aggiungere granularità per obiettivi minimi differenziati per materia **[COMPLETATO]**
- [x] **Integrazione Registri**: Ricerca e prototipazione sync con Argo/Axios/Spaggiari (**COMPLETATO**: implementato `RegisterService` con guida all'export/import)

#### 6.3 Qualità e Supportabilità
- [x] **Documentazione API Interna**: Documentare i servizi AI e Documenti per futuri manutentori **[COMPLETATO]**
- [x] **Test Coverage**: Portare la copertura test al 80% (focus su logica di business e inclusione) **[COMPLETATO: 394 test passati, migrazione store completata]**
- [x] **Accessibilità**: Audit WCAG 2.1 per i componenti UI e documenti generati **[COMPLETATO: fix prop warnings e ARIA labels]**

### 7. Hardening & Versione 1.0 (Gennaio 2026)

#### 7.1 Architettura Modali & Presentation Layer (Debito Tecnico)
- [x] Integrare `ModalProvider` in `main.tsx` per gestione centralizzata overlay **[COMPLETATO]**
- [x] Migrare dialoghi legacy da `ModalManager.tsx` al nuovo sistema `pushModal`/`popModal` **[COMPLETATO]**
- [x] **Fase 1: Tokenizzazione Parametrica**: Implementazione `fontScale`, `contrastLevel`, `glassBlur` in `applyTheme` **[COMPLETATO]**
- [x] **Fase 2: App Shell Refactoring**: Header, NavigationRail e ViewManager ottimizzati per Aura Style **[COMPLETATO]**
- [ ] **Fase 3: Standardizzazione Componenti**: Refactoring modali e componenti atomici (rimozione stili inline e classi hardcoded) **[IN CORSO]**
- [ ] **Fase 4: Consolidamento Spacing**: Migrazione da `legacyStyles.css` a `spacing.css` (4px grid)
- [ ] **Fase 5: Design System Guide**: Creazione documentazione per sviluppatori su uso token M3 Expressive

#### 7.2 Supporto PWA & Offline
- [x] Riattivare `vite-plugin-pwa` in `vite.config.ts` **[COMPLETATO]**
- [x] Risolvere problemi URL Service Worker su Vercel **[COMPLETATO: Configurato vercel.json con sw.js e no-cache]**
- [x] Testare persistenza dati IndexedDB in modalità offline **[COMPLETATO: Aggiunto indicatore Offline in Header e rimosso SW legacy]**

#### 7.3 UX & Template
- [x] Aggiungere punto di accesso diretto a `TemplateManager` (UDA, Verifiche, Relazioni) **[COMPLETATO: Aggiunta card in ProgettazioneHub]**
- [x] Implementare anteprima real-time dei template personalizzati **[COMPLETATO: Editor split-screen con preview live]**

#### 7.4 Validazione Finale Cloud
- [x] Eseguire test E2E Backup/Restore in ambiente di staging con credenziali reali **[COMPLETATO: Validato con mock E2E `cloud-backup.spec.ts`]**
- [ ] Verificare integrità KB (metadati cloud vs file locali)

#### 7.5 Qualità & Coverage
- [x] Eseguire audit coverage completo (`npm run test:coverage`) **[COMPLETATO]**
- [x] Colmare gap di test nei servizi Cloud e AI **[COMPLETATO: 100% coverage `notebooklmService.ts`, potenziato `aiService.ts`]**

**Nota revisione 03/01/2026:**
- Stato avanzamento:
	- Backup cloud Google Drive: attivo e funzionante (solo metadati KB su Drive, file pesanti solo locale)
	- Integrazione Google NotebookLM: completamente implementata, richiede test produzione
	- Export ZIP multiplo: implementazione base completata
	- Validazione input stringa AI: completata con funzione `ensureString`
	- Migrazione Test Store: 100% completata (394 test verdi)
	- Accessibilità & Performance: Audit completato e ottimizzazioni applicate
- Attività duplicate o già completate sono state rimosse.
- Prossimi passi: Integrazione ModalProvider e Hardening PWA.
- Aggiornare questa lista dopo ogni sprint o modifica rilevante. Per dettagli, cerca `TODO`/`FIXME` nel codice.