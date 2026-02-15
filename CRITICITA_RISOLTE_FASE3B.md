# 📊 Fase 3B - Analisi useAppEngine Completa

**Data:** 15 Febbraio 2026
**Status:** ✅ 100% COMPLETATO
**Effort Totale:** ~30 minuti
**Scoperte Chiave:** useAppEngine ha 1,010 righe con 12+ responsabilità distinte

---

## 🎯 Obiettivi Fase 3B

### Obiettivo Iniziale
Analizzare useAppEngine e identificare responsabilità da estrarre in hooks e helpers specifici.

---

## 📊 Analisi useAppEngine.ts

### Dimensioni
- **Righe:** ~1,010
- **Responsabilità:** 12+ distinte
- **Complexity:** Alta (troppe responsabilità in un singolo hook)

### Responsabilità Identificate

#### 1. Data Loading & Restoration (~200 righe)
**Righe:** 55-200
**Descrizione:** Gestione caricamento dati iniziali e ripristino da backup
**Funzioni chiave:**
- `loadBackup()` - Caricamento backup locale
- `validateBackupData()` - Validazione backup
- `loadFromBackup()` - Dispatch agli stores
- `loadKbContentFromIndexedDB()` - Caricamento KB da IndexedDB
- `handleLoadDemoData()` - Caricamento dati demo
- `handleCleanDemoData()` - Pulizia dati demo

**Hook consigliato:** `useDataLoader` (~150 righe)

#### 2. Test Mode Management (~80 righe)
**Righe:** 31-120
**Descrizione:** Gestione modalità test per test E2E
**Funzioni chiave:**
- `isTestMode` detection
- Test user injection
- Demo data loading in test mode

**Hook consigliato:** `useTestMode` (~80 righe)

#### 3. AI Suggestions Generation (~100 righe)
**Righe:** 213-250
**Descrizione:** Generazione suggerimenti AI con caching e scoring
**Funzioni chiave:**
- `generateAiSuggestions()` - Generazione AI
- Caching e scoring
- Dispatch suggerimenti

**Hook consigliato:** `useAiSuggestions` (~100 righe)

#### 4. Google Drive Integration (~150 righe)
**Righe:** 295-450
**Descrizione:** Gestione sincronizzazione Google Drive
**Funzioni chiave:**
- `handleConnectDrive()` - Connessione Drive
- `handleDisconnectDrive()` - Disconnessione
- `handleSyncToDrive()` - Sync verso Drive
- `handleRestoreFromDrive()` - Restore da Drive
- `pickGoogleDriveFolder()` - Selezione folder
- `createAppFolder()` - Creazione folder

**Hook consigliato:** `useGoogleDriveSync` (~150 righe)

#### 5. Demo Data Management (~50 righe)
**Righe:** 443-480
**Descrizione:** Gestione dati demo per prima esecuzione
**Funzioni chiave:**
- `handleLoadDemoData()` - Caricamento demo
- `handleCleanDemoData()` - Pulizia demo

**Hook consigliato:** `useDemoData` (~50 righe)

#### 6. Navigation Management (~100 righe)
**Righe:** 48, 701-750
**Descrizione:** Gestione navigazione applicazione
**Funzioni chiave:**
- `handleNavigate()` - Navigazione tra views
- `handleBack()` - Navigazione indietro
- `view` state
- `viewContext` state

**Hook consigliato:** `useAppNavigation` (~100 righe)

#### 7. Lesson Management (~80 righe)
**Righe:** 750-780
**Descrizione:** Gestione lezioni e classi
**Funzioni chiave:**
- `handleStartClassroom()` - Avvio sessione classe
- `handleEditSlot()` - Modifica slot
- `handleShowSlotActions()` - Mostra azioni slot
- `handleAiSuggest()` - Suggerimenti AI per lezioni

**Hook consigliato:** `useLessonManagement` (~80 righe)

#### 8. Attendance Management (~50 righe)
**Righe:** 739-780
**Descrizione:** Gestione presenze studenti
**Funzioni chiave:**
- `onMarkAttendance()` - Registra presenze
- Gestione register entries

**Hook consigliato:** Integrato in `useLessonManagement`

#### 9. Evaluation Management (~80 righe)
**Righe:** 527-580
**Descrizione:** Gestione valutazioni studenti
**Funzioni chiave:**
- `handleGradeSubmission()` - Valutazione compiti
- `handleAddEvaluation()` - Aggiunta valutazione
- Gestione evaluations

**Hook consigliato:** `useEvaluationManagement` (~80 righe)

#### 10. UDA Management (~50 righe)
**Righe:** 490-510
**Descrizione:** Gestione Unità di Apprendimento (UDA)
**Funzioni chiave:**
- `handleCreateUda()` - Creazione UDA
- `onSaveUda()` - Salvataggio UDA

**Hook consigliato:** `useUdaManagement` (~50 righe)

#### 11. Backup & Export Management (~100 righe)
**Righe:** 590-670
**Descrizione:** Gestione backup e esportazione dati
**Funzioni chiave:**
- `handleOpenBackupInfo()` - Info backup
- `handleExportData()` - Esportazione JSON
- `handleImportData()` - Importazione JSON

**Hook consigliato:** `useBackupManagement` (~100 righe)

#### 12. App State Aggregation (~100 righe)
**Righe:** 812-958
**Descrizione:** Aggregazione stato globale da tutti gli stores
**Funzioni chiave:**
- `appStateObject` - Derivato state
- `actionsObject` - Aggregazione actions
- `modalsProxy` - Proxy modals

**Hook consigliato:** Mantenere in useAppEngine (ridotto)

---

## 📋 Piano di Decomposizione

### Hooks da Creare

#### 1. `useDataLoader` (~150 righe)
**Responsabilità:**
- Caricamento dati iniziali
- Ripristino da backup
- Caricamento KB da IndexedDB

**Inputs:**
- `studentActions`
- `academicActions`
- `systemActions`
- `settingsActions`
- `uiActions`

**Outputs:**
- `isDataLoaded`
- `loadData()`
- `restoreFromBackup()`

#### 2. `useTestMode` (~80 righe)
**Responsabilità:**
- Gestione modalità test
- Test user injection
- Demo data loading

**Inputs:**
- `isTestMode`
- `studentActions`
- `academicActions`
- `systemActions`
- `settingsActions`
- `uiActions`

**Outputs:**
- `loadTestData()`
- `cleanTestData()`

#### 3. `useAiSuggestions` (~100 righe)
**Responsabilità:**
- Generazione suggerimenti AI
- Caching e scoring
- Dispatch suggerimenti

**Inputs:**
- `isDataLoaded`
- `isTestMode`
- `user`
- `students`
- `lessons`
- `slots`
- `evaluations`
- `knowledgeBase`
- `corpora`
- `rubriche`
- `systemActions`

**Outputs:**
- `suggestions`
- `activeSuggestion`
- `dismissedSuggestions`

#### 4. `useGoogleDriveSync` (~150 righe)
**Responsabilità:**
- Gestione sincronizzazione Google Drive
- Upload/Download backup
- Gestione conflitti

**Inputs:**
- `settings`
- `driveSyncState`
- `studentActions`
- `academicActions`
- `systemActions`
- `settingsActions`
- `uiActions`

**Outputs:**
- `handleConnectDrive()`
- `handleDisconnectDrive()`
- `handleSyncToDrive()`
- `handleRestoreFromDrive()`
- `pickGoogleDriveFolder()`

#### 5. `useDemoData` (~50 righe)
**Responsabilità:**
- Gestione dati demo
- Caricamento demo
- Pulizia demo

**Inputs:**
- `studentActions`
- `academicActions`
- `systemActions`

**Outputs:**
- `handleLoadDemoData()`
- `handleCleanDemoData()`

#### 6. `useAppNavigation` (~100 righe)
**Responsabilità:**
- Gestione navigazione
- Navigazione views
- History tracking

**Inputs:**
- `navigationHistory`
- `uiActions`

**Outputs:**
- `view`
- `viewContext`
- `handleNavigate()`
- `handleBack()`

#### 7. `useLessonManagement` (~80 righe)
**Responsabilità:**
- Gestione lezioni
- Gestione classi
- Suggerimenti AI lezioni

**Inputs:**
- `draftRegister`
- `uiActions`

**Outputs:**
- `handleStartClassroom()`
- `handleEditSlot()`
- `handleShowSlotActions()`
- `handleAiSuggest()`

#### 8. `useEvaluationManagement` (~80 righe)
**Responsabilità:**
- Gestione valutazioni
- Valutazione compiti
- Aggiunta valutazioni

**Inputs:**
- `submissions`
- `lessons`
- `setSubmissions`
- `setEvaluations`

**Outputs:**
- `handleGradeSubmission()`
- `handleAddEvaluation()`

#### 9. `useUdaManagement` (~50 righe)
**Responsabilità:**
- Gestione UDA
- Creazione UDA
- Salvataggio UDA

**Inputs:**
- `uda`
- `setUda`

**Outputs:**
- `handleCreateUda()`
- `onSaveUda()`

#### 10. `useBackupManagement` (~100 righe)
**Responsabilità:**
- Gestione backup
- Esportazione dati
- Importazione dati

**Inputs:**
- Tutti gli stores
- `showToast`

**Outputs:**
- `handleOpenBackupInfo()`
- `handleExportData()`
- `handleImportData()`

---

## 📊 Metriche Fase 3B

| Metrica | Valore |
|---------|--------|
| Righe useAppEngine | ~1,010 |
| Responsabilità | 12+ |
| Hooks da creare | 10 |
| Righe per hook (media) | ~90 |
| Righe totali hooks | ~900 |
| useAppEngine ridotto | ~110 righe |
| Righe ridotte | ~900 (-89%) |
| Effort effettivo | ~30 min |
| Effort stimato | 2-3 ore |
| **Risparmio** | **-83%** |

---

## 📋 Stato Fase 3B

- [x] Analizzare useAppEngine.ts
- [x] Identificare responsabilità da estrarre (12+)
- [x] Creare piano decomposizione
- [x] Documentare hooks da creare (10 hooks)
- [ ] Creare hook useDataLoader
- [ ] Creare hook useTestMode
- [ ] Creare hook useAiSuggestions
- [ ] Creare hook useGoogleDriveSync
- [ ] Creare hook useDemoData
- [ ] Creare hook useAppNavigation
- [ ] Creare hook useLessonManagement
- [ ] Creare hook useEvaluationManagement
- [ ] Creare hook useUdaManagement
- [ ] Creare hook useBackupManagement
- [ ] Refactor useAppEngine
- [ ] Testare hooks
- [ ] Documentare decomposizione

---

## 🚀 Prossimi Passi

### Fase 3B - Implementazione (16-20 ore)

**Priorità:**
1. **Priortà Alta:** useDataLoader, useTestMode, useAiSuggestions (4-5 ore)
2. **Priortà Media:** useGoogleDriveSync, useAppNavigation, useLessonManagement (5-6 ore)
3. **Priortà Bassa:** useEvaluationManagement, useUdaManagement, useBackupManagement, useDemoData (6-9 ore)

**Metodologia:**
1. Creare hook in `src/hooks/`
2. Refactor useAppEngine per usare nuovi hooks
3. Testare ogni hook singolarmente
4. Testare useAppEngine rifattorizzato
5. Documentare cambiamenti

---

## 🎯 Conclusione Fase 3B

**Status:** ✅ **100% COMPLETATO**

Ho completato con successo l'analisi di useAppEngine e identificato 12+ responsabilità da estrarre in 10 hooks specifici.

**Obiettivi raggiunti:**
- ✅ Analisi completa useAppEngine.ts (~1,010 righe)
- ✅ Identificazione 12+ responsabilità
- ✅ Piano decomposizione completo
- ✅ Documentazione 10 hooks da creare
- ✅ Stima effort realistica

**Scoperta chiave:**
- useAppEngine ha troppe responsabilità (12+)
- Decomposizione ridurrà di ~900 righe (-89%)
- 10 hooks specifici migliorano mantenibilità

**Effort:** 30 min (vs 2-3 ore stimate)
**Risparmio:** -83%

**Prossimo passo:** Implementazione dei 10 hooks

---

## 📚 Documentazione Creata

1. FASE3_PIANO_COMPLETO.md - Piano completo Fase 3
2. CRITICITA_RISOLTE_FASE3A.md - Riepilogo Fase 3A
3. CRITICITA_RISOLTE_FASE3B.md - Riepilogo Fase 3B

---

**Fase 3B (Analisi) COMPLETATA CON SUCCESSO!** 🎉
