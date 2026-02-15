# 🔍 Analisi Critica dell'Architettura - DocenteDoc AI
**Data:** 15 Febbraio 2026
**Analista:** Sistema Automatico di Analisi Architetturale

---

## 📊 Executive Summary

DocenteDoc AI presenta un'architettura complessiva **SOLID e ben strutturata**, ma con diverse **criticità significative** che impattano l'esperienza utente finale e la manutenibilità del codice.

### Status Globale
- **Architettura Backend/State:** ✅ Eccellente (Zustand modulare)
- **Design System:** ✅ Eccellente (Material Design 3 token-based)
- **Implementazione UI:** ⚠️ **INCOMPLETA** (componenti esistono ma non usati)
- **Accessibilità:** ⚠️ **PARZIALE** (focus indicators presenti ma hover effects mancanti)
- **Codice Legacy:** ⚠️ **PRESENTE** (file di backup, codice duplicato)

---

## 🚨 CRITICITÀ ARCHITETTURALI CRITICHE

### 1. 🎨 INCOERENZA NELL'USO DEI COMPONENTI UI (ALTO IMPATTO)

#### Problema
I componenti UI riutilizzabili (EmptyState, LoadingState, Skeleton, MetricCard) sono stati **implementati** ma **non vengono utilizzati** nel codice reale. I componenti preferiscono implementare la stessa logica manualmente.

#### Evidenza
```typescript
// src/components/ui/EmptyState.tsx - ESISTE ✅
export const EmptyState: React.FC<EmptyStateProps> = ({...}) => {...}

// src/components/Home.tsx - USATO MANUALMENTE ❌
{activities.length === 0 && (
  <M3Surface style={{ ... }}>
    <span className="material-symbols-outlined">event_busy</span>
    <M3Typography>Nessuna attività recente</M3Typography>
    <M3Typography>Le tue attività appariranno qui</M3Typography>
  </M3Surface>
)}
```

#### Impatto
- **Duplicazione di codice:** Stessa logica implementata in più componenti
- **Mantenibilità:** Modifiche richiedono aggiornamenti multipli
- **Coerenza UI:** Stati vuoti hanno aspetto inconsistente
- **Effort di refactoring:** 8-12 ore per migrare tutti i componenti

#### Soluzione
```typescript
// INVECE DI:
{activities.length === 0 && (
  <M3Surface>...manuale...</M3Surface>
)}

// USARE:
{activities.length === 0 ? (
  <EmptyState
    icon="event_busy"
    title="Nessuna attività recente"
    description="Le tue attività appariranno qui"
    actionLabel="Crea attività"
    onAction={() => onNavigate('aula')}
  />
) : (
  <ActivityList activities={activities} />
)}
```

#### Componenti da migrare:
- [ ] `Home.tsx` - Empty state per activities
- [ ] `ClassSelection.tsx` - Empty state per classi
- [ ] `TimetableView.tsx` - Empty state per orario
- [ ] `StudentWorkspace.tsx` - Empty state per studenti
- [ ] Tutti i modal con caricamento - LoadingState
- [ ] Tutte le liste asincrone - Skeleton loaders

---

### 2. 🎭 MANCANZA DI HOVER EFFECTS (MEDIO IMPATTO)

#### Problema
I componenti interattivi (card, bottoni, M3Card) **non hanno hover effects**, rendendo l'interfaccia piatta e meno responsiva su desktop.

#### Evidenza
```typescript
// src/components/Home.tsx - M3Card senza hover
<M3Card
  onClick={() => onNavigate('aula')}
  style={{
    padding: 'var(--md-sys-spacing-4)',
    cursor: 'pointer',
    transition: 'transform 200ms, box-shadow 200ms', // ✅ transizione definita
    // ❌ MA NESSUN onMouseEnter/onMouseLeave
    border: '1px solid var(--md-sys-color-primary-container)'
  }}
>
```

#### Verifica Comando
```bash
grep -r "onMouseEnter\|onMouseLeave" src/components/*.tsx
# RISULTATO: 0 matches
```

#### Impatto
- **UX desktop povera:** Utenti desktop non ricevono feedback visivo
- **Profondità visiva:** App sembrano piatta
- **Professionalità:** Mancano microinterazioni standard

#### Soluzione
```typescript
// Aggiungere hover effects a tutte le card cliccabili:
<M3Card
  onClick={() => onNavigate('aula')}
  style={{
    padding: 'var(--md-sys-spacing-4)',
    cursor: 'pointer',
    transition: 'transform 200ms, box-shadow 200ms',
    border: '1px solid var(--md-sys-color-primary-container)'
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.transform = 'translateY(-2px)';
    e.currentTarget.style.boxShadow = 'var(--md-sys-elevation-level2)';
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.transform = 'translateY(0)';
    e.currentTarget.style.boxShadow = 'none';
  }}
>
```

---

### 3. 📦 FILE DI BACKUP E CODICE DUPLICATO (MEDIO IMPATTO)

#### Problema
Presenza di numerosi file `.backup` e `.pre-cleanup` che aumentano la dimensione del codebase e creano confusione.

#### Evidenza
```
src/components/
├── AssistantFab.tsx
├── AssistantFab.tsx.backup          ❌ DUPLICATO
├── AssistantFab.tsx.pre-cleanup    ❌ DUPLICATO
├── ClassCompetencyDashboard.tsx
├── ClassCompetencyDashboard.tsx.backup  ❌ DUPLICATO
├── ClassroomView.tsx
├── ClassroomView.tsx.backup        ❌ DUPLICATO
... e molti altri
```

#### Impatto
- **Repository size:** Aumentata inutilmente
- **Confusione:** Sviluppatori non sanno quale file usare
- **Git performance:** Checkout più lenti
- **Memory:** Editor caricano file duplicati

#### Soluzione
```bash
# Rimuovere tutti i file di backup:
find src -name "*.backup" -delete
find src -name "*.pre-cleanup" -delete
find src -name "*.final-cleanup" -delete

# Assicurarsi che siano in .gitignore:
*.backup
*.pre-cleanup
*.final-cleanup
*.temp
```

---

### 4. 🔗 MONOLITICO USEAPPENGINE (ALTO IMPATTO)

#### Problema
`useAppEngine.ts` è un **hook monolitico di 1000+ righe** che gestisce troppe responsabilità:
- Caricamento dati
- Navigazione
- Sync con Drive
- Suggerimenti AI
- Modal management
- Export/Import
- Etc.

#### Evidenza
```typescript
// src/hooks/useAppEngine.ts - 1009 righe!
export const useAppEngine = () => {
  // 500+ righe di logica di caricamento
  // 200+ righe di coordinazione azioni
  // 100+ righe di gestione modals
  // 200+ righe di aggregazione state/actions

  const appStateObject: AppState = useMemo(() => ({
    user, students, lessons, slots, evaluations, competencyEvals, uda, eventi,
    knowledgeBase, corpora, notifiche, rubriche, pianiInclusione, giudizi, reportistica,
    feedSources, draftRegister, finalizedRegister,
    settings, aiSettings, themeState,
    backupState, driveSyncState,
    installPrompt, canShowPrompt, suggestions, studentProfileContext, selectedClassForDashboard,
    activeSuggestion, dismissedSuggestions, isGlobalAiLoading,
    navigationHistory, curricula, submissions, orientamentoActivities, ePortfolioEntries
  }), [/* 20+ dependencies */]);

  const actionsObject: AppActions = useMemo(() => ({
    // 50+ azioni esposte
  }), [/* 30+ dependencies */]);
};
```

#### Impatto
- **Complessità mentale:** Difficile mantenere
- **Performance:** Troppi useMemo/React.memo
- **Testabilità:** Difficile testare isolatamente
- **Re-render:** Dipendenze complesse causano re-render eccessivi

#### Soluzione Proposta
```typescript
// Decomporre in hook specializzati:

// src/hooks/useDataLoader.ts - Caricamento dati
export const useDataLoader = () => { /* 150 righe */ };

// src/hooks/useNavigation.ts - Navigazione
export const useNavigation = () => { /* 80 righe */ };

// src/hooks/useDriveSync.ts - Google Drive sync
export const useDriveSync = () => { /* 120 righe */ };

// src/hooks/useAiSuggestions.ts - Suggerimenti AI
export const useAiSuggestions = () => { /* 100 righe */ };

// src/hooks/useAppEngine.ts - Orchestratore leggero
export const useAppEngine = () => {
  const data = useDataLoader();
  const nav = useNavigation();
  const sync = useDriveSync();
  const ai = useAiSuggestions();

  return { ...data, ...nav, ...sync, ...ai };
};
```

---

## ⚠️ CRITICITÀ UX/UI

### 5. 📱 STATI VUOTI NON GUIDATI (MEDIO IMPATTO)

#### Problema
Gli stati vuoti sono informativi ma **mancano di Call-To-Action** chiare o percorsi guidati.

#### Evidenza Attuale
```typescript
// Home.tsx
<M3Typography>Nessuna attività recente</M3Typography>
<M3Typography>Le tue attività appariranno qui</M3Typography>
// ❌ Nessuna azione suggerita!
```

#### Soluzione
```typescript
<EmptyState
  icon="event_busy"
  title="Nessuna attività recente"
  description="Le tue attività appariranno qui. Inizia aggiungendo una lezione o un compito."
  actionLabel="Crea attività"
  onAction={() => onNavigate('aula')}
/>
```

---

### 6. 🎯 TIPOGRAFIA INCONSISTENTE (BASSO IMPATTO)

#### Problema
Alcuni componenti usano hardcoded values invece di token MD3.

#### Evidenza
```typescript
// Home.tsx
fontSize: '48px',        // ❌ Hardcoded
lineHeight: '56px',      // ❌ Hardcoded

// DOVREBBE ESSERE:
fontSize: 'var(--md-sys-typescale-display-medium-size)',
lineHeight: 'var(--md-sys-typescale-display-medium-line-height)',
```

#### Impatto
- **Scalabilità:** Difficile cambiare dimensioni globalmente
- **Coerenza:** Rischio di valori diversi in vari componenti
- **Accessibilità:** Non rispetta le preferenze utente

---

### 7. 🧩 COMPONENTI MONOLITICI (MEDIO IMPATTO)

#### Problema
Alcuni componenti sono eccessivamente grandi (500+ righe):

- `ClassroomView.tsx` - ~1400 righe
- `AnnualPlanningWizard.tsx` - ~1200 righe
- `ClassPlanningWizard.tsx` - ~1200 righe
- `AnalyticsDashboard.tsx` - ~1100 righe
- `AssistantModal.tsx` - ~500 righe

#### Impatto
- **Leggibilità:** Difficile trovare logica specifica
- **Testability:** Difficile testare porzioni isolate
- **Manutenzione:** Bug fixes rischiosi

#### Soluzione
```typescript
// Esempio: ClassroomView.tsx
// Decomporsi in:
- ClassroomAttendance.tsx     // ~200 righe
- ClassroomParticipation.tsx  // ~150 righe
- ClassroomHomework.tsx       // ~150 righe
- ClassroomResources.tsx      // ~150 righe
- ClassroomNotes.tsx          // ~100 righe
- ClassroomView.tsx           // ~300 righe (orchestrator)
```

---

## 🔍 CRITICITÀ ACCESSIBILITÀ

### 8. ♿ FOCUS INDICATORS PRESENTI MA NON UNIFORMI (BASSO IMPATTO)

#### Problema
`accessibility-focus.css` è implementato correttamente ma non tutti i componenti lo usano in modo coerente.

#### Evidenza
```css
/* src/design-system/accessibility-focus.css ✅ ESISTE */
*:focus-visible {
  outline: var(--md-sys-spacing-0-5) solid var(--md-sys-color-primary);
  outline-offset: var(--md-sys-spacing-0-5);
}
```

#### Tuttavia...
Molti componenti hanno stili inline che potrebbero sovrascrivere gli stili CSS globali.

#### Soluzione
Verificare che nessuno stile inline definisca `outline: none` senza condizioni adeguate.

---

## 📊 METRICHE DEL CODEBASE

### Dimensione
```
src/components:    ~150 componenti TSX
src/stores:       6 store Zustand (modulare ✅)
src/hooks:        ~20 hook custom
src/services:     ~10 servizi
src/utils:        ~30 utility functions
```

### Criticità per Area

| Area | Status | Priorità | Effort Fix |
|------|--------|----------|------------|
| Incoerenza UI Components | 🔴 Critica | ALTA | 8-12 ore |
| Hover Effects | 🟡 Media | MEDIA | 4-6 ore |
| File Backup | 🟡 Media | MEDIA | 1-2 ore |
| useAppEngine Monolitico | 🔴 Critica | ALTA | 16-20 ore |
| Stati Vuoti Non Guidati | 🟡 Media | MEDIA | 2-4 ore |
| Tipografia Inconsistente | 🟢 Bassa | BASSA | 2-3 ore |
| Componenti Monolitici | 🟡 Media | MEDIA | 12-16 ore |
| Focus Indicators | 🟢 Bassa | BASSA | 2-3 ore |

---

## 🛠️ PIANO D'AZIONE PRIORITARIO

### FASE 1: Criticità Urgenti (2-3 giorni)

1. **Day 1: Rimuovere file di backup**
   ```bash
   find src -name "*.backup" -delete
   find src -name "*.pre-cleanup" -delete
   ```
   - Effort: 1 ora
   - Impatto immediato su repository size

2. **Day 1-2: Aggiungere hover effects**
   - Creare utility per hover effects riutilizzabili
   - Applicare a tutte le card cliccabili
   - Effort: 4-6 ore

3. **Day 2-3: Migrare a EmptyState/LoadingState/Skeleton**
   - Home.tsx
   - ClassSelection.tsx
   - TimetableView.tsx
   - Tutti i modal con loading
   - Effort: 8-12 ore

### FASE 2: Refactoring Architetturale (1-2 settimane)

4. **Week 1: Decomporre useAppEngine**
   - Creare hook specializzati
   - Migrare logica
   - Testare ogni hook
   - Effort: 16-20 ore

5. **Week 1-2: Decomporre componenti grandi**
   - ClassroomView.tsx
   - AnnualPlanningWizard.tsx
   - ClassPlanningWizard.tsx
   - Effort: 12-16 ore

### FASE 3: Rifiniture UX/UI (3-5 giorni)

6. **Migliorare stati vuoti con CTA guidate**
   - Effort: 2-4 ore

7. **Uniformare tipografia con token MD3**
   - Effort: 2-3 ore

8. **Verificare accessibilità focus indicators**
   - Effort: 2-3 ore

---

## 💡 RACCOMANDAZIONI DI LUNGO TERMINE

### 1. Code Review Guidelines
- **Bloccare** commit che includono file `.backup`
- **Richiedere** uso di componenti UI riutilizzabili (EmptyState, LoadingState, etc.)
- **Verificare** che nuovo codice non duplichi logica esistente

### 2. Testing
- Aggiungere **unit tests** per hook specializzati dopo refactoring
- Aggiungere **visual regression tests** per componenti UI
- Aggiungere **accessibility tests** con axe-core

### 3. Documentation
- Documentare **architettura dei componenti** (quando usare EmptyState, quando usare Skeleton)
- Creare **guida di contribuzione** per nuovo codice
- Mantenere **mappe mentali** di componenti e loro relazioni

### 4. Performance
- Monitorare **re-render** con React DevTools
- Implementare **React.memo** per componenti costosi
- Considerare **virtualization** per liste lunghe (studenti, lezioni)

---

## 📈 OBBIETTIVI DI SUCCESSO

### Breve Termine (1 mese)
- ✅ Zero file di backup nel repository
- ✅ Hover effects su tutte le card cliccabili
- ✅ 100% uso di EmptyState/LoadingState/Skeleton
- ✅ useAppEngine < 300 righe

### Medio Termine (3 mesi)
- ✅ Tutti i componenti < 400 righe
- ✅ 95% copertura test unit tests
- ✅ Lighthouse Accessibility Score > 95
- ✅ Zero duplicazioni di logica

### Lungo Termine (6 mesi)
- ✅ Sostenibilità architetturale massima
- ✅ Onboarding nuovi sviluppatori < 2 giorni
- ✅ Refactoring senza paura di regressioni

---

## 🎯 CONCLUSIONI

DocenteDoc AI ha un'**ottima base architetturale** (Zustand modulare, MD3 tokens, React 18) ma soffre di **incoerenza nell'implementazione**:

### Punti di Forza
- ✅ **State management** ben progettato con Zustand
- ✅ **Design System** completo con Material Design 3
- ✅ **Componenti UI** riutilizzabili esistenti
- ✅ **TypeScript strict** per type safety

### Punti di Debolezza
- ❌ **Componenti UI esistono ma non vengono usati**
- ❌ **Codice duplicato** (file backup, implementazioni manuali)
- ❌ **Hook monolitico** (useAppEngine 1000+ righe)
- ❌ **Hover effects mancanti** per desktop UX
- ❌ **Componenti giganti** difficili da mantenere

### Verdetto
L'applicazione è **funzionalmente completa** ma richiede **refactoring sistematico** per raggiungere standard di qualità enterprise-level. Le criticità identificate sono **tutte risolvibili** con effort pianificato e non richiedono riscritture architetturali radicali.

---

**Analisi completata. Pronto per implementazione.**
