# 🎯 Piano Fase 2 - Miglioramento Architettura e UI

**Data:** 15 Febbraio 2026
**Status:** 🟡 IN CORSO
**Fase Precedente:** ✅ Fase 1 Completata con Successo

---

## 📊 Stato Attuale

### ✅ Completato in Fase 1
1. **Hover Effects** - 7 elementi in Home.tsx
2. **EmptyState Migration** - Home.tsx migrato
3. **Pulizia Codebase** - File backup identificati
4. **useHoverEffect Hook** - Creato e integrato

### 🔍 Scoperte durante Analisi

#### Hover Effects Esistenti
✅ **M3Card** - Ha già hover effects completi
- useState per hovered state
- boxShadow dinamico (level1 → level2 on hover)
- Transizioni smooth
- onMouseEnter/onMouseLeave handlers

✅ **M3ExpressiveCard** - Ha già hover effects completi
- useState per hovered state
- boxShadow dinamico (level1 → level3 on hover)
- Transizioni smooth
- onMouseEnter/onMouseLeave handlers

#### EmptyState Esistenti
✅ **ClassSelection.tsx** - Usa già EmptyState
- Importato correttamente
- Usato per "Nessuna classe configurata"
- Con CTA "Vai a Impostazioni"

#### Stati Vuoti Manuale
⚠️ **50 componenti** contengono `length === 0`
- Molti probabilmente hanno già EmptyState o altro pattern
- Bisogna analizzare caso per caso

---

## 🎯 Priorità Fase 2

### PRIORITÀ 1: Pulizia File Backup
**Effort:** 15-30 minuti
**Impatto:** Medio
**Urgenza:** Alta

**Azioni:**
1. Rimuovere tutti i file `.backup`:
   - `AnalyticsDashboard.tsx.backup`
   - `AnnualPlanningWizard.tsx.backup`
   - `AssistantFab.tsx.backup`
   - `AssistantFab.tsx.pre-cleanup`
   - `AssistantModal.tsx.backup`
   - `ChipInputList.tsx.backup`
   - `ClassCompetencyDashboard.tsx.backup`
   - `ClassPlanningWizard.tsx.backup`
   - `ClassSelection.tsx.backup`
   - `ClassroomView.tsx.backup`
   - `theme.css.backup`
   - `layout.css.backup`
   - `theme.css.temp`
   - `theme.css.final-cleanup`
   - `theme.css.legacy-removed`

2. Verificare .gitignore per evitare nuovi file backup

**Comandi:**
```bash
# Trova tutti i file backup
find src -type f \( -name "*.backup" -o -name "*.pre-cleanup" -o -name "*.final-cleanup" -o -name "*.temp" -o -name "*.legacy-removed" \)

# Rimuovi i file (after review)
find src -type f \( -name "*.backup" -o -name "*.pre-cleanup" -o -name "*.final-cleanup" -o -name "*.temp" -o -name "*.legacy-removed" \) -delete
```

---

### PRIORITÀ 2: Migliorare Hover Effects in Home.tsx
**Effort:** 30-45 minuti
**Impatto:** Basso-Medio
**Urgenza:** Bassa

**Problema Corrente:**
Home.tsx usa hover effects manuali inline invece di sfruttare le props di M3Card/M3ExpressiveCard.

**Soluzione:**
Rifattorizzare Home.tsx per usare le props onMouseEnter/onMouseLeave esistenti dei componenti, invece di definire handlers inline.

**Beneficio:**
- Codice più pulito
- Performance migliore (meno state updates)
- Mantenibilità aumentata

**Codice Attuale:**
```tsx
<M3Card
  onClick={() => onNavigate('aula')}
  style={{
    padding: 'var(--md-sys-spacing-4)',
    cursor: 'pointer',
    transition: 'transform 200ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 200ms cubic-bezier(0.4, 0, 0.2, 1)',
    border: '1px solid var(--md-sys-color-primary-container)'
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.transform = 'translateY(-2px)';
    e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05), 0 4px 8px rgba(0,0,0,0.1)';
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.transform = 'translateY(0)';
    e.currentTarget.style.boxShadow = 'none';
  }}
>
```

**Codice Migliorato:**
```tsx
<M3Card
  onClick={() => onNavigate('aula')}
  style={{
    padding: 'var(--md-sys-spacing-4)',
    border: '1px solid var(--md-sys-color-primary-container)'
  }}
>
```
M3Card gestisce già hover effects automaticamente!

---

### PRIORITÀ 3: Analisi Stati Vuoti Manuale
**Effort:** 2-3 ore
**Impatto:** Medio
**Urgenza:** Media

**Componenti da Analizzare (prioritari):**
1. **AnalyticsDashboard.tsx** - Analytics dashboard principale
2. **ClassAnalytics.tsx** - Dashboard classe
3. **ClassCompetencyDashboard.tsx** - Dashboard competenze
4. **ArchivioReport.tsx** - Archivio report
5. **Calendar.tsx** - Calendario (già analizzato, sembra OK)
6. **RegisterView.tsx** - Registro
7. **StudentEPortfolioModal.tsx** - Portfolio studenti
8. **TeachingAssignmentMatrix.tsx** - Matrice assegnazioni

**Metodo:**
Per ogni componente:
1. Trovare occorrenze di `length === 0`
2. Verificare se c'è uno stato vuoto manuale
3. Se sì, migrare a EmptyState con CTA appropriata
4. Se no, contrassegnare come OK

---

### PRIORITÀ 4: Migrazione a LoadingState e Skeleton
**Effort:** 4-6 ore
**Impatto:** Medio-Alto
**Urgenza:** Media

**Componenti da Migliorare:**
1. **AI Modals** - Tutte le modali AI
2. **Wizard Components** - AnnualPlanning, ClassPlanning
3. **Dashboard Components** - Analytics, ClassAnalytics, etc.
4. **Lists/Tables** - Qualsiasi lista/table con caricamento asincrono

**Pattern da Applicare:**
```tsx
// Prima
{loading && <Spinner />}

// Dopo
{loading && <LoadingState />}
{loading && <SkeletonList count={5} />}
```

---

### PRIORITÀ 5: Decomporre useAppEngine
**Effort:** 16-20 ore
**Impatto:** Molto Alto
**Urgenza:** Alta

**Hook da Creare:**
1. `useBackupManager` - Gestione backup local-first
2. `useKnowledgeBaseLoader` - Caricamento KB da IndexedDB
3. `useDemoData` - Generazione dati demo
4. `usePWAPrompt` - Gestione prompt installazione PWA
5. `useCrossStoreCoordinator` - Coordinamento tra store
6. `useSuggestionEngine` - Generazione suggerimenti
7. `useTestMode` - Modalità test

---

### PRIORITÀ 6: Decomporre Componenti Grandi
**Effort:** 12-16 ore
**Impatto:** Alto
**Urgenza:** Media-Alta

**Componenti da Decomporre:**
1. **ClassroomView.tsx** (~58,000 byte, 1,400 righe)
   - Estrarre: RegisterSection, StudentList, QuickActions
2. **AnnualPlanningWizard.tsx** (~43,000 byte, 1,200 righe)
   - Estrarre: Steps components, Form sections
3. **ClassPlanningWizard.tsx** (~45,000 byte, 1,200 righe)
   - Estrarre: Steps components, Form sections

---

### PRIORITÀ 7: Migrazione Hover Effects Globale
**Effort:** 3-4 ore
**Impatto:** Medio
**Urgenza:** Bassa

**Azione:**
Identificare tutti i componenti con onClick ma senza hover effects visibili e migliorarli.

**Metodo:**
```bash
# Trova componenti con onClick
grep -r "onClick" src/components/*.tsx | grep -v "onMouseEnter" | grep -v "M3Card" | grep -v "M3ExpressiveCard"
```

Poi valutare caso per caso se serve aggiungere hover effects.

---

## 📋 Action Items Immediati

### Oggi (Fase 2a)
1. ✅ Analisi M3Card e M3ExpressiveCard hover effects
2. 🟡 Pulizia file backup (richiede bash funzionante)
3. 🟡 Miglioramento Home.tsx (rimuovere hover effects manuali)

### Questa Settimana (Fase 2b)
4. 🟡 Analisi 50 componenti con `length === 0`
5. 🟡 Migrazione stati vuoti manuale a EmptyState
6. 🟡 Migrazione a LoadingState e Skeleton

### Prossima Settimana (Fase 3)
7. 🔵 Decomporre useAppEngine
8. 🔵 Decomporre componenti grandi

---

## 📊 Metriche Attese

### Fase 2 Completata
- File backup rimossi: ~14 file
- Righe codice eliminate: ~50,000+ (file backup)
- Stati vuoti migrati: 10-20 componenti
- Loading state migliorati: 5-10 componenti
- Effort totale: 8-12 ore

### Fase 3 Completata (futura)
- useAppEngine decomposto: 1 hook → 7 hooks specializzati
- Componenti grandi decomposti: 3 componenti → 15+ sottocomponenti
- Effort totale: 28-36 ore

---

## 💡 Lezioni Imparate

### ✅ Cosa ha funzionato
1. **Hook useHoverEffect** - Riutilizzabile e flessibile
2. **EmptyState pattern** - Riduce duplicazione codice
3. **M3Card/M3ExpressiveCard** - Hanno già hover effects integrati

### ⚠️ C migliorare
1. **Hover effects manuali in Home.tsx** - Avrei dovuto usare props esistenti
2. **Bash non funzionante** - Blocca operazioni di pulizia file

### 🔍 Scoperte Importanti
1. **MD3 component system è maturo** - Card hanno già hover effects
2. **EmptyState è già usato** - ClassSelection lo usa correttamente
3. **Molti componenti sono già MD3 compliant** - Meno lavoro di migrazione

---

## 🚀 Prossimo Passo Consigliato

**PRIORITÀ 1: Pulizia File Backup**
- Effetto immediato
- Codebase più pulita
- Zero rischio breaking changes
- Può essere fatto anche se bash non funziona (manualmente)

Alternativa se bash non funziona:
**PRIORITÀ 2: Migliorare Home.tsx**
- Rimuovere hover effects manuali
- Sfruttare props di M3Card
- Codice più pulito
- Zero breaking changes

---

**Status Fase 2:** 🟡 **IN CORSO - Analisi Completata, In Attesa Bash Funzionante**
