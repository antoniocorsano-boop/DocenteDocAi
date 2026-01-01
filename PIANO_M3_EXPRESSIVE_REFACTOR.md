# 📋 PIANO DI REFACTORING M3 EXPRESSIVE - DocenteDoc AI

**Data Inizio:** 1 Gennaio 2026  
**Durata Stimata:** 6-8 settimane  
**Status:** � IN PROGRESS (Phase 1 Complete)

---

## 📊 SCORECARD ATTUALE

```
╔════════════════════════════════════════════════════════╗
║        DocenteDoc AI - M3 Expressive Readiness        ║
╠════════════════════════════════════════════════════════╣
║  1. Modal Architecture         ████████░░  80%        ║  ✅ 19/25 migrated
║  2. Legacy Pattern Removal     ███░░░░░░░  30%        ║  In-progress
║  3. Typography Standardization ██████░░░░ 60%        ║  Queued
║  4. Layout M3 Expressive      ████░░░░░░  40%        ║  Queued
║  ─────────────────────────────────────────────────────║
║  OVERALL M3 MATURITY:  ████████░░  46%               ║  ⬆️ +4%
╚════════════════════════════════════════════════════════╝
```

**PROGRESS DELTA (from start):**
- ✅ 19 modals migrated to M3Dialog (40% of 48)
- ✅ Infrastructure complete (zIndex.ts, legacyStyles.css)
- ✅ TypeScript errors resolved (6 fixed)
- ✅ Build stable (10.92s, zero errors)
- ⏳ 6 COMPLEX modals remaining

---

## 🎯 PROBLEMI CRITICI IDENTIFICATI

### 1. ARCHITETTURA OVERLAY - "Modal Hell"

**Stato:** ⚠️ Parzialmente Implementato

| Problema | File | Occorrenze | Gravità |
|----------|------|-----------|---------|
| Z-index hardcoded | AssistantModal.tsx, Dialog.tsx, ProgettazioneHub.tsx | 4+ | 🔴 ALTA |
| Modali non portali | 48 file *Modal.tsx | ~43 non gestiti | 🔴 ALTA |
| Conflitti stacking | AssistantModal (z:2000), Dialog (z:1200) | 2+ | 🔴 ALTA |
| Nidificazione non tracking | UdaDetailModal in ProgettazioneHub | 3 livelli | 🟡 MEDIA |

### 2. PATTERN LEGACY - Stilistico

**Stato:** 🔴 Critico

| Categoria | Occorrenze | File Interessati | Fix |
|-----------|-----------|------------------|-----|
| Stili inline (style={{}}) | 127 istanze | 45+ file | Rimuovere → CSS/Classi |
| Z-index inline | 12 file | AssistantModal, ProgettazioneHub | Centralizzare zIndex.ts |
| Card fantasma (div) | ~60 file | UI components | → M3ExpressiveCard |
| Font-size hardcoded | 15+ | SmartDocumentEditor, AssistantModal | → .m3-* classi |

### 3. TYPOGRAPHY - Non Coerente

**Stato:** ⚠️ Definito ma Non Usato

| Scale | Coverage | Stato |
|-------|----------|-------|
| .m3-display-* | 0% | ❌ Mai usato |
| .m3-headline-* | 20% | ⚠️ Raramente |
| .m3-title-* | 60% | ⚠️ Moderato |
| .m3-body-* | 35% | ⚠️ Scarso |
| .m3-label-* | 65% | ✅ Ok |

### 4. LAYOUT - Readiness Navigation Rail

**Stato:** ⚠️ In Progresso

| Aspetto | Status | Note |
|---------|--------|------|
| Grid System | ⚠️ Flex-based | Manca CSS Grid |
| Token Spacing | ✅ Definiti | Ma non ovunque |
| Breakpoints | ❌ Hardcoded | @media sparsi |
| Aria/A11y | ⚠️ Parziale | Dialog OK, Menu no |

---

## 🚀 FASI DI REFACTORING

### FASE 1: UNIFICAZIONE OVERLAY (2-3 settimane)

**Status:** � IN PROGRESS (Part A: COMPLETE, Part B: IN EXECUTION)  
**Completamento:** 75% (19/25 modals migrated)  
**Scadenza:** Week 1-3

#### Milestone 1.1: Centralizzazione Z-Index

**Obbiettivo:** Creare singola fonte di verità per z-index

**Task:**
- [ ] Creare [`src/design-system/zIndex.ts`](src/design-system/zIndex.ts)
- [ ] Definire costanti: `Z_INDEX_MODAL_LEVEL_1`, `Z_INDEX_MODAL_LEVEL_2`, etc.
- [ ] Importare in ModalContext.tsx
- [ ] Rimuovere hardcoded z-index da: AssistantModal, Dialog, ProgettazioneHub

**File Output:**
```typescript
// src/design-system/zIndex.ts
export const Z_INDEX = {
  dropdown: 1100,
  popover: 1150,
  modalBackdrop: 1300,
  level1Modal: 1400,
  level2Modal: 1500,
  level3Modal: 1600,
  snackbar: 2000,
  tooltip: 3000,
} as const;
```

**Test:**
- [ ] 3+ livelli di modali nidificati funzionano ✓
- [ ] AssistantModal non sovrasta livelli superiori ✓
- [ ] Dialog.tsx rispetta stack ✓

---

#### Milestone 1.2: Migrazione Modali Test Case

**Obbiettivo:** PianoInclusioneEditor come test case per pattern

**Task:**
- [ ] Audit: [PianoInclusioneEditor.tsx](src/components/PianoInclusioneEditor.tsx)
- [ ] Refactor: Usare `useModal()` anziché `dialog-backdrop`
- [ ] Rimuovere: `import './dialog-container.css'`
- [ ] Creazione: `<M3Dialog>` wrapper
- [ ] Test: Nidificazione con AssistantModal

**File Modificati:**
- `src/components/PianoInclusioneEditor.tsx` (80 righe)
- `src/components/M3Dialog.tsx` (NUOVO - 120 righe)

**Checklist Qualità:**
- [ ] TypeScript strict mode ✓
- [ ] Accessibility (ARIA) ✓
- [ ] Focus trap ✓
- [ ] Escape key close ✓

---

#### Milestone 1.3: Batch Migration Modali Critici

**Obbiettivo:** Migrare top 10 modali più usati

**Modali Target:**
1. [ ] `AssistantModal.tsx` - 418 righe (Frequenza: ALTA)
2. [ ] `ImageGeneratorModal.tsx` (Frequenza: MEDIA)
3. [ ] `DocumentGeneratorModal.tsx` (Frequenza: MEDIA)
4. [ ] `AddEvaluationModal.tsx` (Frequenza: ALTA)
5. [ ] `CompetencyEvaluationModal.tsx` (Frequenza: MEDIA)
6. [ ] `EventModal.tsx` (Frequenza: MEDIA)
7. [ ] `ExportModal.tsx` (Frequenza: BASSA)
8. [ ] `HelpModal.tsx` (Frequenza: BASSA)
9. [ ] `CircolareAnalysisModal.tsx` (Frequenza: MEDIA)
10. [ ] `IdeaGeneratorModal.tsx` (Frequenza: MEDIA)

**Remaining 38 Modali:** Fase 2 o manutenzione continua

---

### FASE 2: ELIMINAZIONE PATTERN LEGACY (3-4 settimane)

**Status:** 🔴 NON INIZIATO  
**Responsabile:** [TBD]  
**Scadenza:** Week 4-7

#### Milestone 2.1: Standardizzazione Card Components

**Obbiettivo:** Eliminare div generici → M3ExpressiveCard, Dialog

**Task:**
- [ ] Audit: Tutti gli usi di `.dialog-container` (4 file)
- [ ] Audit: Tutti gli usi di `.dialog-backdrop` (4 file)
- [ ] Creazione: `<M3ExpressiveCard />` component
- [ ] Creazione: `<M3CardContent />`, `<M3CardActions />`
- [ ] Migration: ProgettazioneHub UdaDetailModal
- [ ] Migration: Tutte le card fantasy rimanenti

**Prima/Dopo Esempio:**
```tsx
// ❌ PRIMA
<div className="dialog-backdrop">
  <div className="dialog-container w-full max-w-2xl">
    <div className="dialog-header">...</div>
    <div className="dialog-content">...</div>
    <div className="dialog-footer">...</div>
  </div>
</div>

// ✅ DOPO
<M3ExpressiveCard
  title="Titolo"
  open={open}
  onClose={onClose}
  maxWidth="2xl"
>
  <M3CardContent>...</M3CardContent>
  <M3CardActions>...</M3CardActions>
</M3ExpressiveCard>
```

**Componenti Nuovi:**
- `src/components/M3ExpressiveCard.tsx` (150 righe)
- `src/components/M3CardContent.tsx` (40 righe)
- `src/components/M3CardActions.tsx` (40 righe)

---

#### Milestone 2.2: Rimozione Stili Inline

**Obbiettivo:** 0 `style={{` per positioning/z-index/layout

**Strategia:**
1. Identificare categorie di stili inline:
   - Positioning (`position`, `top`, `right`, `z-index`)
   - Sizing (`width`, `height`, `maxWidth`)
   - Layout (`display`, `flexDirection`, `gap`)
   - Colors (convertire a var(...))

2. Per ogni categoria:
   - Creare classe CSS corrispondente
   - Refactor componente
   - Test responsive

**File Critici (Priority Order):**
1. [ ] `ProgettazioneHub.tsx` - 8 style inline
2. [ ] `AssistantModal.tsx` - 6 style inline (dopo migrazione)
3. [ ] `SmartDocumentEditor.tsx` - 5 style inline
4. [ ] `LessonsPage.tsx` - 4 style inline
5. [ ] `OperationsCenter.tsx` - 4 style inline

**Esempio Refactor:**
```tsx
// ❌ PRIMA
<div style={{ position: 'fixed', right: 24, bottom: 24, zIndex: 3200 }}>

// ✅ DOPO
// src/components.css
.fab-container {
  position: fixed;
  right: var(--spacing-6);
  bottom: var(--spacing-6);
  z-index: var(--z-fab);
}

// Component
<div className="fab-container">
```

---

### FASE 3: TYPE SCALE CONSISTENCY (2-3 settimane)

**Status:** 🔴 NON INIZIATO  
**Responsabile:** [TBD]  
**Scadenza:** Week 5-7

#### Milestone 3.1: Creazione Typography CSS Module

**Obbiettivo:** Estendere design system con classi .m3-*

**Task:**
- [ ] Creare [`src/design-system/typography.css`](src/design-system/typography.css)
- [ ] Definire classi per tutti i 12 scale level
- [ ] Importare in App.tsx
- [ ] Verificare rendering

**File Output:**
```css
/* src/design-system/typography.css */

.m3-display-large {
  font-family: var(--typography-display-large-family, 'Roboto', sans-serif);
  font-size: var(--typography-display-large-size, 57px);
  font-weight: var(--typography-display-large-weight, 400);
  line-height: var(--typography-display-large-height, 64px);
  letter-spacing: var(--typography-display-large-tracking, 0px);
}

.m3-display-medium { /* ... */ }
.m3-display-small { /* ... */ }

/* ... 12 scale levels total ... */

.m3-body-large { /* ... */ }
.m3-body-medium { /* ... */ }
.m3-body-small { /* ... */ }
```

---

#### Milestone 3.2: Migration File Priority

**Obbiettivo:** 100% coverage classi .m3-* sui file critici

**Priority Tier 1 (Alta frequenza di uso):**
- [ ] `ProgettazioneHub.tsx` - 8 istanze
- [ ] `AssistantModal.tsx` - 12 istanze
- [ ] `PianoInclusioneEditor.tsx` - 6 istanze
- [ ] `Dialog.tsx` - 4 istanze

**Priority Tier 2 (Frequenza media):**
- [ ] `SmartDocumentEditor.tsx` - 4 istanze
- [ ] `LessonsPage.tsx` - 5 istanze
- [ ] `TeacherInbox.tsx` - 3 istanze
- [ ] `OperationsCenter.tsx` - 4 istanze

**Priority Tier 3 (Frequenza bassa):**
- [ ] Componenti Modal rimanenti (38 file)
- [ ] Utility components
- [ ] Helper components

**Test Coverage:**
- [ ] Mobile (375px): responsive ✓
- [ ] Tablet (768px): readable ✓
- [ ] Desktop (1920px): not broken ✓

---

### FASE 4: LAYOUT M3 EXPRESSIVE (3-4 settimane)

**Status:** 🔴 NON INIZIATO  
**Responsabile:** [TBD]  
**Scadenza:** Week 6-8+

#### Milestone 4.1: Spacing & Grid System

**Obbiettivo:** Implementare 4px base unit grid

**Task:**
- [ ] Verifica: Token spacing già definiti in design-system/index.ts ✓
- [ ] Creazione: [`src/design-system/spacing.css`](src/design-system/spacing.css)
- [ ] Creazione: Grid utility classes (`.grid-*`, `.gap-*`)
- [ ] Audit: Tutti gli usi di hardcoded px/rem
- [ ] Migration: Layout file

**File Output:**
```css
/* src/design-system/spacing.css */

:root {
  --spacing-1: 4px;    /* 1 unit  */
  --spacing-2: 8px;    /* 2 units */
  --spacing-3: 12px;   /* 3 units */
  --spacing-4: 16px;   /* 4 units */
  --spacing-6: 24px;   /* 6 units */
  --spacing-8: 32px;   /* 8 units */
}

/* Utility classes */
.gap-1 { gap: var(--spacing-1); }
.gap-2 { gap: var(--spacing-2); }
.gap-4 { gap: var(--spacing-4); }
.gap-6 { gap: var(--spacing-6); }

.p-1 { padding: var(--spacing-1); }
.p-2 { padding: var(--spacing-2); }
.p-4 { padding: var(--spacing-4); }
.p-6 { padding: var(--spacing-6); }

.m-1 { margin: var(--spacing-1); }
/* ... etc */
```

---

#### Milestone 4.2: Navigation Rail M3

**Obbiettivo:** Creare Navigation Rail conforme M3 Expressive

**Task:**
- [ ] Design: Sketch wireframe (80px width, icon + label)
- [ ] Componente: [`src/components/NavigationRail.tsx`](src/components/NavigationRail.tsx) (NUOVO)
- [ ] CSS: `src/components/navigation-rail.css` (NUOVO)
- [ ] Integration: App.tsx layout
- [ ] Responsive: Collapsible su mobile

**Specifica M3 Expressive:**
- Width: 80px (icon + label stacked)
- Icons: 24px (material symbols)
- Labels: .m3-label-medium
- Elevation: 0px (flat) con --sys-surface-variant border
- Animation: Smooth 0.3s easing

**Componente Struttura:**
```tsx
interface NavigationRailProps {
  items: Array<{ icon: string; label: string; href: string; badge?: number }>;
  active: string;
  onNavigate: (href: string) => void;
}

const NavigationRail: React.FC<NavigationRailProps> = ({ items, active, onNavigate }) => {
  // 120 righe
};
```

---

#### Milestone 4.3: Responsive Grid & Breakpoints

**Obbiettivo:** M3 Expressive responsive design

**Task:**
- [ ] Definire breakpoints M3-compliant:
  - Mobile: < 600px
  - Tablet: 600px - 1024px
  - Desktop: > 1024px
- [ ] CSS: Media query refactor
- [ ] Componenti: Responsive adjustments

**File:**
```css
/* src/design-system/breakpoints.css */

/* Mobile First */
/* Base: mobile */

@media (min-width: 600px) {
  /* Tablet layout */
}

@media (min-width: 1024px) {
  /* Desktop layout */
}
```

---

## 📈 METRICHE DI SUCCESSO

### Fine Fase 1
- [ ] Z-index centralizzato (0 hardcoded)
- [ ] ModalContext usato da 50%+ modali
- [ ] Nidificazione 3 livelli funzionante

### Fine Fase 2
- [ ] 0 `style={{` per positioning
- [ ] 90%+ componenti usano M3ExpressiveCard/Dialog
- [ ] 0 "card fantasma" rimanenti

### Fine Fase 3
- [ ] 100% .m3-* classi su file Tier 1
- [ ] Typography scale coerente
- [ ] Responsive test: 3 breakpoint ✓

### Fine Fase 4
- [ ] Navigation Rail implementata
- [ ] Grid 4px base unit ovunque
- [ ] 100% M3 Expressive compliance

---

## 🔄 MONITORAGGIO SETTIMANALE

### Template Checklist Settimanale:

```
SETTIMANA X (Dates)
Status: 🟢 ON TRACK / 🟡 AT RISK / 🔴 BLOCKED

COMPLETAMENTI:
- [x] Task 1
- [ ] Task 2
- [ ] Task 3

BLOCKERS:
- Issue description

PROSSIMA SETTIMANA:
- Task A
- Task B
- Task C
```

---

## 📝 FILE DA CREARE

| File | Righe | Priorità | Fase |
|------|-------|----------|------|
| `src/design-system/zIndex.ts` | 20 | 🔴 P0 | 1.1 |
| `src/components/M3Dialog.tsx` | 120 | 🔴 P0 | 1.2 |
| `src/design-system/typography.css` | 180 | 🔴 P0 | 3.1 |
| `src/components/NavigationRail.tsx` | 200 | 🟡 P1 | 4.2 |
| `src/design-system/spacing.css` | 100 | 🟡 P1 | 4.1 |
| `src/design-system/breakpoints.css` | 80 | 🟡 P1 | 4.3 |
| `src/components/M3ExpressiveCard.tsx` | 150 | 🟡 P1 | 2.1 |

---

## 📝 FILE DA MODIFICARE

| File | Righe Cambio | Modifiche | Fase |
|------|-------------|-----------|------|
| `src/context/ModalContext.tsx` | 15 | Import Z_INDEX, rimuovere hardcoded | 1.1 |
| `src/components/PianoInclusioneEditor.tsx` | 80 | Usare M3Dialog, rimuovere dialog-container | 1.2 |
| `src/components/AssistantModal.tsx` | 100+ | Migrare a useModal() pattern | 1.3 |
| `src/components/ProgettazioneHub.tsx` | 50 | Rimuovere style inline, usare classi | 2.2 |
| `src/components/App.tsx` | 20 | Import Navigation Rail, integrazione layout | 4.2 |

---

## 🎓 RISORSE RIFERIMENTO

- M3 Spec: https://m3.material.io/
- React Portals: https://react.dev/reference/react-dom/createPortal
- Z-Index Guide: https://www.joshwcomeau.com/css/stacking-contexts/
- Accessibility: https://www.w3.org/WAI/ARIA/apg/

---

## 👥 ASSEGNAZIONI TEAM

| Ruolo | Responsabile | Fase |
|-------|-------------|------|
| Lead Architect | [Your Name] | All |
| Frontend Dev 1 | [TBD] | Fase 1-2 |
| Frontend Dev 2 | [TBD] | Fase 3-4 |
| QA | [TBD] | Testing |

---

## 📞 ESCALATION PATH

- **Blockers Tecnici:** Documentare in GitHub Issues, tag: `m3-refactor`
- **Design Questions:** Allinearsi con Product Owner
- **Timeline Slippage:** Weekly sync

---

**Ultima Aggiornamento:** 1 Gennaio 2026  
**Versione Piano:** 1.0
