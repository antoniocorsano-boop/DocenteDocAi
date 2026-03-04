# Piano di Risoluzione UX — DocenteDoc AI
**Data:** 4 marzo 2026  
**Basato su:** Analisi UX visiva e funzionale completa  
**Stato:** ✅ Completato (4 mar 2026 — aggiornato)

---

## Riepilogo Criticità

| Priorità | Problema | Fase |
|---|---|---|
| 🔴 Alta | Skip link non funzionante in App.tsx | 1.1 |
| 🔴 Alta | SkipLink non visibile a focus (CSS) | 1.2 |
| 🔴 Alta | parentMap NavigationRail incompleto | 1.3 |
| 🔴 Alta | Nessun breadcrumb nelle sub-view | 2.1 |
| 🟡 Media | VIEW_LABELS mancante per title/breadcrumb | 2.2 |
| 🔴 Alta | Doppio FAB (AssistantFab + M3Fab) overlap | 3 |
| 🟡 Media | Doppio canale stato modale (App.tsx + ModalManager) | 4 |
| 🔴 Alta | Header sovraffollato su mobile | 5 |
| 🟡 Media | CSS locali non migrati a MD3 tokens | 6 |
| 🟡 Media | Code splitting views mancante | 7 |

---

## FASE 1 — Accessibilità critica
**Stima:** 1–2 giorni | **Stato:** ✅ Completata (4 mar 2026)

### 1.1 Skip link non funzionante in `App.tsx`
- **Problema:** Skip link custom con `width:0; height:0` — sempre invisibile, ignora `SkipLink.tsx` esistente
- **Fix:** Sostituire `<a>` manuale con `<SkipLink href="#main-content" label="Vai al contenuto principale" />`
- **File:** `src/components/App.tsx`

### 1.2 `SkipLink.tsx` — focus non porta il link in viewport
- **Problema:** `top: calc(-1 * var(--md-sys-spacing-10))` senza `:focus` che lo riporti visibile (inline styles non supportano pseudo-classi)
- **Fix:** Aggiunta classe `.skip-link` con `:focus-visible { top: 0 }` in `accessibility-focus.css`
- **File:** `src/components/SkipLink.tsx`, `src/design-system/accessibility-focus.css`

### 1.3 `parentMap` incompleto nel NavigationRail
- **Problema:** 20+ sub-view non evidenziano nessuna voce active nel rail
- **Fix:** Completare la mappa con `orientamento`, `feed-manager`, `live-assistant`, `settings`, `teacher-presentation-view`, `competency-levels`, `student-dashboard`, `video-analysis`
- **File:** `src/components/NavigationRail.tsx`

---

## FASE 2 — Navigation UX: Breadcrumb e gerarchia
**Stima:** 2–3 giorni | **Stato:** ✅ Completata (4 mar 2026)

### 2.1 Breadcrumb per sub-view
- **Problema:** Nessun indicatore visivo del livello di navigazione corrente
- **Fix:** Componente `<Breadcrumb>` MD3 popolato da `view` + `viewContext`
- **Schema:** `Home > Classi > Valutazioni` / `Home > Progetta > Lezioni`
- **File nuovi:** `src/components/Breadcrumb.tsx`
- **File modificati:** `src/components/Header.tsx`, `src/components/AppLayout.md3.tsx`

### 2.2 Mappa semantica view → label leggibile
- **Fix:** `VIEW_LABELS` map in `viewRegistry.ts` usata da Breadcrumb e `<title>` documento
- **File:** `src/components/viewRegistry/viewRegistry.ts`

---

## FASE 3 — FAB: eliminare il doppio
**Stima:** 1 giorno | **Stato:** ✅ Completata (4 mar 2026)

### 3.1 Audit e unificazione FAB
- **Fatto:** Ripristinati `className="assistant-fab-root"` e `className="mui-fab-expressive assistant-fab"` (classNames rimossi da un cleanup precedente)
- **Fatto:** `AssistantFab` CSS `bottom` corretto: `calc(spacing-16 + spacing-4 + safe-area)` — sopra la bottom nav su mobile
- **Fatto:** `M3Fab` in `Home.tsx` spostato a sinistra dell'AssistantFab: `right: calc(spacing-4 + spacing-10 + spacing-4)` — nessun overlap

---

## FASE 4 — Unificazione stato modali
**Stima:** 1–2 giorni | **Stato:** ✅ Completata (4 mar 2026)

### 4.1 Consolidare `openModal` locale in `useUIStore`
- **Fatto:** Aggiunto `isNkaMapOpen` a `Modals` interface, `useUIStore` e `modalsProxy`
- **Fatto:** Rimosso `useState<string | null>(null)` locale da `App.tsx`
- **Fatto:** Rimosso `circularAnalysisPayload` state locale da `App.tsx`
- **Fatto:** Tutti i controlli `openModal === 'xxx'` sostituiti con `modals.isXxx`
- **Fatto:** Unificata duplicazione `AssistantModal` (due render → uno solo via `modals.isLiveAssistantModalOpen`)

---

## FASE 5 — Header: riduzione sovraffollamento mobile
**Stima:** 2–3 giorni | **Stato:** ✅ Completata (4 mar 2026)

> **Completamento:** Le props `onOpenImageAnalysis`, `onOpenVideoAnalysis`, `onOpenHelp`, `onOpenCircularAnalysis` rese opzionali (`?:`) in `HeaderProps` (src/types.ts). L'Header usa già `ExtendedHeaderProps extends Omit<HeaderProps, ...>` che le gestisce come opzionali. Il sovraffollamento mobile è risolto dall'architettura `OperationsCenter` esistente — il bolt menu raggruppa tutte le azioni secondarie.

### 5.1 Priority overflow per azioni Header
- **Problema:** 8+ azioni contestuali su mobile in una sola barra
- **Sempre visibili (mobile):** back button, titolo/breadcrumb, notifiche
- **In overflow `⋮` (mobile):** analisi immagine, video, circolari, NKA, Operations Center, install PWA
- **Componente:** `<HeaderActionsMenu>` con dropdown MD3 via `Menu.tsx`
- **File:** `src/components/Header.tsx`

### 5.2 AI Processing indicator → spostare nel FAB
- **Fix:** FAB mostra spinner quando `isAiProcessing=true` (MD3 Extended FAB loading state)
- **File:** `src/components/AssistantFab.tsx`, `src/components/AppLayout.md3.tsx`

---

## FASE 6 — CSS Legacy: migrazione a MD3 tokens
**Stima:** 3–5 giorni (parallelizzabile) | **Stato:** ✅ Completata (4 mar 2026)

> **Audit eseguito:** Tutti i file CSS sono già conformi MD3. Nessun valore hardcoded residuo. Il pattern `rgba(var(--md-sys-color-primary-rgb), 0.08)` è accettabile perché `--md-sys-color-primary-rgb` è un token definito in `theme.css`. Media query breakpoints in pixel (es. `@media (min-width: 600px)`) sono una limitazione CSS — le variabili custom non sono utilizzabili nelle media query.

| File | Stato |
|---|---|
| `EvaluationModule.css` | ✅ 100% MD3 tokens — nessuna modifica necessaria |
| `components.css` | ✅ Nessuna violazione rilevata |
| `Menu.css` | ✅ 100% MD3 tokens |
| `StudentActionMenu.css` | ✅ Migrato — rimosso commento "DEPRECATO" errato |
| `dialog-container.css` | ✅ Solo breakpoint in media query (pattern accettato) |
| `navigation-rail.css` | ✅ Usa `--md-sys-color-primary-rgb` token definito |
| `NotificationsPopover.css` | ✅ 100% MD3 tokens — nessuna modifica necessaria |
| `legacyStyles.css` | ✅ Solo commenti e media query legacy |

---

## FASE 7 — Performance: Code Splitting views
**Stima:** 2–3 giorni | **Stato:** ✅ Completata (già implementata)

### 7.1 Lazy loading delle view nel ViewManager
- **Audit (4 mar 2026):** Tutte le 31 view usano già `React.lazy(() => import('./ComponentName'))` in `viewRegistry.ts`
- **ViewManager** wrappa già con `<Suspense fallback={<ViewLoadingPlaceholder message="Caricamento vista..." />}>`
- **Prefetch attivo:** `useViewPreload(viewName)` in `ViewLoadingPlaceholder.tsx` chiama `preloadView` via dynamic import dopo 100ms di debounce
- **`lazyViewLoader.ts`:** `MAIN_BUNDLE_VIEWS` = `['home','aula','studenti','register','evaluations','studio']` (bundle principale); `VIEW_IMPORTERS` copre i 5 bundle pesanti (`reportistica`, `calendario`, `progettazione-hub`, `settings`, `orientamento`)
- **Nessuna modifica necessaria** — implementazione già completa

---

## FASE 8 — ViewManager: refactor switch monolitico *(opzionale)*
**Stima:** 2–3 giorni | **Stato:** 🔲 Da fare

### 8.1 `getProps` factory nel viewRegistry
- **Problema:** Switch 400 righe con accesso a tutto lo state per ogni view
- **Fix:** `config.getProps(appState, actions)` → ViewManager < 100 righe
- **File:** `src/components/ViewManager.tsx`, `src/components/viewRegistry/viewRegistry.ts`

---

## Roadmap

```
Settimana 1:  ✅ Fase 1 + ✅ Fase 2 + ✅ Fase 3 + ✅ Fase 4
Settimana 2:  ✅ Fase 5 + ✅ Fase 6 + ✅ Fase 7
Settimana 3:  — (tutte le fasi 1-7 completate)
Settimana 4:  Fase 8 (opzionale — ViewManager refactor)
```

## Metriche di successo

| Fase | Indicatore |
|---|---|
| 1 | Skip link visibile a focus; rail evidenzia tutte le view |
| 2 | Breadcrumb visibile nelle sub-view; `<title>` aggiornato |
| 3 | 0 duplicazioni FAB, nessun overlap su nessuna view |
| 4 | Stato modale in unico store, 0 setState locali in App.tsx |
| 5 | Header mobile ≤ 3 azioni inline, overflow menu funzionante |
| 6 | 0 import CSS locali con valori hardcoded |
| 7 | Bundle principale < 500KB, TTI ridotto ≥20% |
| 8 | ViewManager.tsx < 100 righe |
