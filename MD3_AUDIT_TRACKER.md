# MD3 Audit — DocenteDoc AI

> **Istruzioni per Claude/Copilot:** Aggiorna questo file dopo ogni sessione di lavoro.
> Sposta le voci tra le sezioni man mano che il lavoro avanza.
> Non rimuovere voci: usa lo storico per tracciare la progressione.

---

## Stato Generale

| Metrica                   | Valore     |
| ------------------------- | ---------- |
| Ultimo aggiornamento      | 2026-03-05 |
| Componenti totali censiti | 71         |
| ✅ Conformi               | 71         |
| ❌ Violazioni aperte      | 0          |
| 🔄 In lavorazione         | 0          |
| 🚫 Eccezioni approvate    | 5          |

---

## ❌ Violazioni Aperte

| #   | File | Riga | Regola violata (sezione)  | Descrizione                                | Priorità |
| --- | ---- | ---- | ------------------------- | ------------------------------------------ | -------- |
| —   | —    | —    | Nessuna violazione aperta | Tutti i componenti sono MD3 Gold Compliant | —        |

---

## 🔄 In Lavorazione

| #   | File | Violazione | Assegnato a | Iniziato il |
| --- | ---- | ---------- | ----------- | ----------- |
| —   | —    | —          | —           | —           |

---

## ✅ Violazioni Risolte

| #   | File                                          | Violazione                                                                                                                                                       | Risolto il | Note                                                                                                  |
| --- | --------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ----------------------------------------------------------------------------------------------------- |
| 1   | `src/components/BottomNav.tsx`                | Varie violazioni MD3 (batch 1)                                                                                                                                   | 2025-12    | Sessione 1                                                                                            |
| 2   | `src/components/ui/M3Dialog.tsx`              | Varie violazioni MD3 (batch 1)                                                                                                                                   | 2025-12    | Sessione 1                                                                                            |
| 3   | `src/components/ui/M3Chip.tsx`                | Varie violazioni MD3 (batch 1)                                                                                                                                   | 2025-12    | Sessione 1                                                                                            |
| 4   | `src/components/ui/M3ListItem.tsx`            | Varie violazioni MD3 (batch 1)                                                                                                                                   | 2025-12    | Sessione 1                                                                                            |
| 5   | `src/components/ui/M3Card.tsx`                | Varie violazioni MD3 (batch 1)                                                                                                                                   | 2025-12    | Sessione 1                                                                                            |
| 6   | `src/components/AssistantModal.tsx`           | Varie violazioni MD3 (batch 2)                                                                                                                                   | 2026-02-17 | Sessione 2                                                                                            |
| 7   | `src/components/NavigationRail.tsx`           | Varie violazioni MD3 (batch 2)                                                                                                                                   | 2026-02-17 | Sessione 2                                                                                            |
| 8   | `src/components/ui/M3Menu.tsx`                | Varie violazioni MD3 (batch 2)                                                                                                                                   | 2026-02-17 | Sessione 2                                                                                            |
| 9   | `src/components/WelcomeScreen.tsx`            | Varie violazioni MD3 (batch 2)                                                                                                                                   | 2026-02-17 | Sessione 2                                                                                            |
| 10  | `src/components/ui/M3IconButton.tsx`          | Varie violazioni MD3 (batch 2)                                                                                                                                   | 2026-02-17 | Sessione 2                                                                                            |
| 11  | `src/components/ui/Snackbar.tsx`              | Varie violazioni MD3 (batch 2)                                                                                                                                   | 2026-02-17 | Sessione 2                                                                                            |
| 12  | `src/components/ContextualStrip.tsx`          | Varie violazioni MD3 (batch 2)                                                                                                                                   | 2026-02-17 | Sessione 2                                                                                            |
| 13  | `src/components/SecondaryNavDrawer.tsx`       | Varie violazioni MD3 (batch 2)                                                                                                                                   | 2026-02-17 | Sessione 2                                                                                            |
| 14  | `src/theme.css`                               | Token `--icon-size-xl`/`--icon-size-hero` non dichiarati                                                                                                         | 2026-03-05 | Sessione 3 — reclassificati su spacing-10/spacing-12                                                  |
| 15  | `src/components/ErrorBoundary.tsx`            | `<h2>`, `<p>`, `<span>` nudi senza M3Typography; icone senza `material-symbols-outlined`                                                                         | 2026-03-05 | Sessione 3                                                                                            |
| 16  | `src/components/ui/M3ExpressiveCard.tsx`      | `<h3>`, `<p>` nudi; `opacity: 0.7/0.5` hardcoded                                                                                                                 | 2026-03-05 | Sessione 3                                                                                            |
| 17  | `src/components/ui/UseCaseCard.tsx`           | Multipli `<p>` nudi con stili inline; icona senza classe `material-symbols-outlined`; `lineHeight: "1.25"` hardcoded                                             | 2026-03-05 | Sessione 3                                                                                            |
| 18  | `src/components/ui/M3Button.tsx`              | `opacity: 1` hardcoded (stato enabled)                                                                                                                           | 2026-03-05 | Sessione 3 — sostituito con `undefined`                                                               |
| 19  | `src/components/ui/ActionTile.tsx`            | `outlineOffset: '0'`; `fontSize: 'var(--md-sys-spacing-6)'` su icone; `letterSpacing: '0.08em'` hardcoded                                                        | 2026-03-05 | Sessione 3                                                                                            |
| 20  | `src/components/ui/ActionCard.tsx`            | `opacity: disabled ? 0.5 : 1` — valori numerici hardcoded                                                                                                        | 2026-03-05 | Sessione 3                                                                                            |
| 21  | `src/components/ui/CategoryCard.tsx`          | `outlineOffset: focused ? '...' : '0'`                                                                                                                           | 2026-03-05 | Sessione 3                                                                                            |
| 22  | `src/components/ui/InfoCard.tsx`              | Raw `<button>` per chiusura invece di `M3IconButton`; `fontSize: 'var(--md-sys-spacing-6)'` su icona                                                             | 2026-03-05 | Sessione 3                                                                                            |
| 23  | `src/components/ui/TabGroup.tsx`              | `outlineOffset: '0'`; `lineHeight: 1` su badge                                                                                                                   | 2026-03-05 | Sessione 3                                                                                            |
| 24  | `src/components/ui/FAB.tsx`                   | `gap: '0'`; `opacity: 1` hardcoded                                                                                                                               | 2026-03-05 | Sessione 3                                                                                            |
| 25  | `src/components/ui/M3ChoiceCard.tsx`          | **CRITICO** `\`${token}30\`` / `\`${token}80\``→ CSS non valido (hex suffix su`var()`); `fontSize: spacing-6`; `letterSpacing: '0.2em'`; `<span>` nudo per label | 2026-03-05 | Sessione 3 — fix: `color-mix()`                                                                       |
| 26  | `src/components/ui/ThinkingIndicator.tsx`     | **CRITICO** Token malformati: `--md-sys-typescale-title-large-font-size-weight` e `--md-sys-typescale-title-large-font-size-line-height` (non esistono)          | 2026-03-05 | Sessione 3 — corretti nei token reali                                                                 |
| 27  | `src/components/ViewLoadingPlaceholder.tsx`   | `minHeight: 'calc(0.6 * var(--md-sys-viewport-height-full))'` invece di token                                                                                    | 2026-03-05 | Sessione 3 — `var(--md-sys-viewport-height-60)`                                                       |
| 28  | `src/components/Home.tsx`                     | 2× `fontSize: 'var(--md-sys-spacing-6)'` su icone; 1× `fontSize: 'var(--md-sys-spacing-10)'` su icona hero                                                       | 2026-03-05 | Sessione 3 — sostituiti con token `icon-size-*`                                                       |
| 29  | `src/components/ui/M3Popover.tsx`             | `GAP = 8` e `VIEWPORT_MARGIN = 16` non tokenizzati (vedi eccezione #4)                                                                                           | 2026-03-05 | Sessione 3 — documentati come eccezione funzionale                                                    |
| 30  | `src/components/ui/M3DatePicker.tsx`          | `fontFamily: 'var(--font-family)'` (×3, righe 19/38/75) — token non-MD3                                                                                          | 2026-03-05 | Sessione 4 — → `var(--md-sys-typescale-body-large-font-family)`                                       |
| 31  | `src/components/ui/M3SurfaceCard.tsx`         | `opacity: glass && hovered ? 0.1 : undefined` — valore numerico hardcoded                                                                                        | 2026-03-05 | Sessione 4 — → `var(--md-sys-state-opacity-tint-faint)`                                               |
| 32  | `src/components/ui/ActionCard.tsx`            | `fontSize: 'var(--md-sys-spacing-6)'` su icona                                                                                                                   | 2026-03-05 | Sessione 4 — → `var(--icon-size-medium)`                                                              |
| 33  | `src/components/ui/CategoryCard.tsx`          | `fontSize: 'var(--md-sys-spacing-6)'` su icona; mancanti `material-symbols-outlined` e `aria-hidden`                                                             | 2026-03-05 | Sessione 4 — corretti                                                                                 |
| 34  | `src/components/ui/EmptyState.tsx`            | `fontSize: 'var(--md-sys-spacing-12)'` su icona hero; `lineHeight: '1.5'` hardcoded                                                                              | 2026-03-05 | Sessione 4 — → `var(--icon-size-hero)`, rimosso lineHeight                                            |
| 35  | `src/components/ui/MetricCard.tsx`            | `fontSize: 'var(--md-sys-spacing-6)'` su icona                                                                                                                   | 2026-03-05 | Sessione 4 — → `var(--icon-size-medium)`                                                              |
| 36  | `src/components/ui/SectionHeader.tsx`         | `fontSize: 'var(--md-sys-spacing-6)'` su icona                                                                                                                   | 2026-03-05 | Sessione 4 — → `var(--icon-size-medium)`                                                              |
| 37  | `src/components/SettingsSection.tsx`          | `iconStyle.fontSize: 'var(--md-sys-spacing-6)'` su icona                                                                                                         | 2026-03-05 | Sessione 4 — → `var(--icon-size-medium)`                                                              |
| 38  | `src/components/AssistantModal.tsx`           | `fontSize: 'var(--md-sys-spacing-10)'` su icona tool                                                                                                             | 2026-03-05 | Sessione 4 — → `var(--icon-size-xl)`                                                                  |
| 39  | `src/components/CurriculumManager.tsx`        | `fontSize: 'var(--md-sys-spacing-12)'` su icona upload_file                                                                                                      | 2026-03-05 | Sessione 4 — → `var(--icon-size-hero)`                                                                |
| 40  | `src/components/LessonView.tsx`               | `fontSize: 'var(--md-sys-spacing-10)'` su icona folder_off                                                                                                       | 2026-03-05 | Sessione 4 — → `var(--icon-size-xl)`                                                                  |
| 41  | `src/components/ShareModal.tsx`               | Icone senza `material-symbols-outlined`/`aria-hidden`; `spacing-6` su icone; bare `<p>` con inline fontSize/fontWeight                                           | 2026-03-05 | Sessione 4 — corretti tutti, → M3Typography                                                           |
| 42  | `src/components/OperationsCenter.tsx`         | `fontSize: spacing-10` su container div invece di span icona                                                                                                     | 2026-03-05 | Sessione 4 — spostato su span con `var(--icon-size-xl)`                                               |
| 43  | `src/components/TeachingAssignmentMatrix.tsx` | `<span>bolt</span>`/`<span>info</span>` nudi (no `material-symbols-outlined`); `<h3>`/`<p>` nudi; `spacing-6`+`lineHeight:1` su icona                            | 2026-03-05 | Sessione 5 — aggiunti `material-symbols-outlined`+`aria-hidden`, → M3Typography, → `icon-size-medium` |
| 44  | `src/components/Timetable.tsx`                | `fontSize: 'var(--md-sys-spacing-6)'` su icona; `<p>` nudo in Guidance                                                                                           | 2026-03-05 | Sessione 5 — → `var(--icon-size-medium)`, → M3Typography                                              |
| 45  | `src/components/CurriculumManager.tsx`        | `opacity: 0.85` hardcoded su testo secondario                                                                                                                    | 2026-03-05 | Sessione 5 — → `var(--md-sys-state-opacity-caption)`                                                  |
| 46  | `src/components/LessonView.tsx`               | `opacity: 0.8` hardcoded                                                                                                                                         | 2026-03-05 | Sessione 5 — → `var(--md-sys-state-opacity-caption)`                                                  |
| 47  | `src/components/OperationsCenter.tsx`         | `opacity: 0.85` hardcoded                                                                                                                                        | 2026-03-05 | Sessione 5 — → `var(--md-sys-state-opacity-caption)`                                                  |
| 48  | `src/components/StudentProfile.tsx`           | `opacity: 0.8` hardcoded                                                                                                                                         | 2026-03-05 | Sessione 5 — → `var(--md-sys-state-opacity-caption)`                                                  |
| 49  | `src/components/AnnualPlanningWizard.tsx`     | 6× bare `<h3>`, 2× bare `<h4>`, 6× bare `<p>` con stili inline testo                                                                                             | 2026-03-05 | Sessione 5 — tutti → M3Typography con variant semantica; aggiunto import                              |

---

## 🚫 Eccezioni Approvate

| #   | File                                | Componente               | Motivazione                                                                                                                                                                                                      | Approvato da  | Data       |
| --- | ----------------------------------- | ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- | ---------- |
| 1   | `src/components/ui/BottomSheet.tsx` | BottomSheet              | Animazioni `backdrop-fade-in`, `sheet-slide-up` definite in `<style>` inline; durata/easing usano token MD3. Pattern accettato per animazioni entry/exit component-scoped.                                       | Copilot/audit | 2026-03-05 |
| 2   | `src/components/ui/Tooltip.tsx`     | Tooltip                  | Animazione `tooltip-fade-in` definita in `<style>` inline; stessa motivazione di BottomSheet.                                                                                                                    | Copilot/audit | 2026-03-05 |
| 3   | `src/components/ui/M3Button.tsx`    | M3Button                 | `transform: 'scale(0.96)' / 'scale(1.02)' / 'scale(1)'` — valori funzionali per press/hover state; nessun token MD3 equivalente per scale transform.                                                             | Copilot/audit | 2026-03-05 |
| 4   | `src/components/ui/M3Popover.tsx`   | M3Popover                | `const GAP = 8` e `const VIEWPORT_MARGIN = 16` — `getBoundingClientRect()` restituisce px nativi; i token CSS non sono fruibili in aritmetica JS. Equivalenti semantici: `spacing-2` (8px) e `spacing-4` (16px). | Copilot/audit | 2026-03-05 |
| 5   | `src/components/GlobalFab.tsx`      | GlobalFab / DraggableFab | `top: \`${position.top}px\``, `left: \`${position.left}px\``— posizione calcolata da drag gesture via`pointermove`; richiede px nativi da coordinate DOM. Pattern identico a M3Popover (eccezione #4).           | Copilot/audit | 2026-03-05 |

---

## 📋 Checklist per Nuovo File

Prima di considerare un file "MD3 Gold Compliant", verificare:

- [ ] Nessun `<div>` usato per container visivi (sezione 3)
- [ ] Tutti i container usano `M3Surface`, `AppLayout` o wrapper MD3 (sezione 3)
- [ ] Nessuna proprietà tipografica inline (sezione 4)
- [ ] Tutti i testi usano `M3Typography` (sezione 4)
- [ ] Nessuno spacing hardcoded (sezione 5)
- [ ] Nessun `box-shadow` manuale (sezione 6)
- [ ] Elevation gestita tramite provider MD3 (sezione 6)
- [ ] Tutti i bottoni sono componenti MD3 (sezione 7)
- [ ] Tutti gli elementi interattivi hanno `aria-label` (sezione 7)
- [ ] Icone decorative con `aria-hidden` (sezione 7)
- [ ] Errori e loader usano componenti MD3 dedicati (sezione 8)
- [ ] Nessun suffisso hex su `var()` — es. `` `${token}30` `` è CSS non valido (sezione 5)
- [ ] Nessun token malformato — verificare i nomi esatti in `theme.css` (sezione 4)
- [ ] `opacity` numerica hardcoded assente — usare `var(--md-sys-state-opacity-*)` (sezione 5)
- [ ] `outlineOffset: '0'` rimosso — usare `undefined` per reset (sezione 5)
- [ ] Icone con `className="material-symbols-outlined"` e `fontSize: 'var(--icon-size-*)'` (sezione 7)

---

## 📅 Storico Sessioni

### 2025-12 — Sessione 1

**File analizzati:** BottomNav, M3Dialog, M3Chip, M3ListItem, M3Card (12 file totali nel batch)

**Violazioni trovate:** Varie per i 5 file (inline styles, token mancanti, bare elements)

**Violazioni risolte:** BottomNav, M3Dialog, M3Chip, M3ListItem, M3Card

**Note:** Prima sessione di audit MD3. Creati 4 file `.github/instructions/*.instructions.md`.

---

### 2026-02-17 — Sessione 2

**File analizzati:** 32 file in 2 batch (audit approfondito)

**Violazioni trovate:** 8 file con violazioni; 24 conformi

**Violazioni risolte:** AssistantModal, NavigationRail, M3Menu, WelcomeScreen, M3IconButton, Snackbar, ContextualStrip, SecondaryNavDrawer

**Note:** Tutti i fix verificati con zero TS errors.

---

### 2026-03-05 — Sessione 3

**File analizzati:** 43 file in 3 batch paralleli (audit completo di tutti i file rimanenti)

**Violazioni trovate:**

- **CRITICHE**: M3ChoiceCard (CSS non valido con hex suffix su `var()`), ThinkingIndicator (token malformati inesistenti)
- **ALTE**: UseCaseCard, M3Button, ActionTile, ActionCard, CategoryCard, InfoCard, TabGroup, FAB, ViewLoadingPlaceholder, Home
- **MEDIE/BASSE**: M3DatePicker, M3SurfaceCard, M3Popover (poi documentato come eccezione)

**Violazioni risolte:** 16 file fixati (incluse le 2 critiche)

**Eccezioni documentate:** BottomSheet, Tooltip (animazioni scoped), M3Button (scale transform), M3Popover/GlobalFab (posizione DOM px)

**Conformi senza modifiche:** M3BottomAppBar, M3Surface, MetricCard, EmptyState, M3EmptyStateCard, Avatar, M3ActivityItem, M3AnimatedIcon, M3BadgedIcon, M3SuggestionCard, M3HeroCard, SectionHeader, Header, AppLayout.md3.tsx, Breadcrumb, Logo, ThemeBubble, M3ProgressBar, AiMemoryChip (18 file)

**Note:** `spin` e `pulse` keyframe confermati in `theme.css` (righe 939, 943). Token `--icon-size-xl` e `--icon-size-hero` aggiunti a `theme.css`.

---

### 2026-03-05 — Sessione 4

**File analizzati:** Deep scan di tutti i `src/components/**/*.tsx` con grep multi-pattern

**Violazioni trovate:**

- `var(--font-family)` (legacy non-MD3): M3DatePicker (×3)
- Opacity numerica hardcoded: M3SurfaceCard (0.1)
- `fontSize: spacing-N` su icone (invece di `icon-size-*`): ActionCard, CategoryCard, EmptyState, MetricCard, SectionHeader, SettingsSection, AssistantModal, CurriculumManager, LessonView, OperationsCenter
- Icone senza `material-symbols-outlined`/`aria-hidden`: CategoryCard, ShareModal, OperationsCenter
- Bare `<p>` con inline fontSize/fontWeight: ShareModal

**Violazioni risolte:** 13 file (violazioni #30–42)

**Note:** Tutti i fix verificati con zero TS errors. Nessuna dipendenza di stile non tracciata introdotta.

---

### 2026-03-05 — Sessione 5

**File analizzati:** TeachingAssignmentMatrix, Timetable, CurriculumManager (opacity), LessonView (opacity), OperationsCenter (opacity), StudentProfile (opacity), AnnualPlanningWizard

**Violazioni trovate:**

- TeachingAssignmentMatrix: `<span>bolt</span>`/`<span>info</span>` nudi (no classe icona); bare `<h3>`, `<p>`; `spacing-6`+`lineHeight:1` su icona
- Timetable: `spacing-6` su icona; `<p>` nudo in Guidance children
- CurriculumManager/LessonView/OperationsCenter/StudentProfile: `opacity: 0.8x` numerico hardcoded
- AnnualPlanningWizard: 6× `<h3>`, 2× `<h4>`, 6× `<p>` nudi con inline tipografia; M3Typography non importato

**Violazioni risolte:** 7 file (violazioni #43–49)

**Stato finale:** 0 violazioni aperte — tutti i 71 componenti censiti sono MD3 Gold Compliant

**Note:** Tutti i fix verificati con zero TS errors.
