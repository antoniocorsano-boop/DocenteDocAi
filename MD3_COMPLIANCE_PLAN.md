# Piano MD3 Compliance — Google-Level

> Obiettivo: rendere l'app indistinguibile da una Google MD3 app (Gmail, Keep, Drive, Classroom).

## Stato iniziale (analisi 3 marzo 2026)

| Metrica                 | Valore         |
| ----------------------- | -------------- |
| Token MD3 usati         | 5.556          |
| Semantic token adoption | 0.7%           |
| Hardcoded violations    | 2.619          |
| Legacy warnings totali  | 1.382          |
| Deprecated `--sys-*`    | 454 occorrenze |
| Hardcoded hex color     | 438            |
| Hardcoded typography    | 273            |
| Hardcoded spacing       | 161            |

---

## FASE B — Migrazione `--sys-*` → `--md-sys-*` [FOUNDATIONAL]

**Priorità:** 1 — tutto il resto dipende da questo.  
**Tipo:** automatizzabile con regex  
**Impatto:** 454 occorrenze in `global.css`, `modules.css`, `components.css`, `layout.css`, `theme-dark.css`

### Mapping deprecato → corretto

| Deprecato                         | Corretto                                   |
| --------------------------------- | ------------------------------------------ |
| `--sys-surface`                   | `--md-sys-color-surface`                   |
| `--sys-on-surface`                | `--md-sys-color-on-surface`                |
| `--sys-primary`                   | `--md-sys-color-primary`                   |
| `--sys-on-primary`                | `--md-sys-color-on-primary`                |
| `--sys-secondary`                 | `--md-sys-color-secondary`                 |
| `--sys-on-secondary`              | `--md-sys-color-on-secondary`              |
| `--sys-tertiary`                  | `--md-sys-color-tertiary`                  |
| `--sys-on-tertiary`               | `--md-sys-color-on-tertiary`               |
| `--sys-surface-variant`           | `--md-sys-color-surface-variant`           |
| `--sys-on-surface-variant`        | `--md-sys-color-on-surface-variant`        |
| `--sys-surface-container`         | `--md-sys-color-surface-container`         |
| `--sys-surface-container-low`     | `--md-sys-color-surface-container-low`     |
| `--sys-surface-container-high`    | `--md-sys-color-surface-container-high`    |
| `--sys-surface-container-highest` | `--md-sys-color-surface-container-highest` |
| `--sys-outline`                   | `--md-sys-color-outline`                   |
| `--sys-outline-variant`           | `--md-sys-color-outline-variant`           |
| `--sys-error`                     | `--md-sys-color-error`                     |
| `--sys-on-error`                  | `--md-sys-color-on-error`                  |
| `--sys-error-container`           | `--md-sys-color-error-container`           |
| `--sys-background`                | `--md-sys-color-background`                |
| `--sys-on-background`             | `--md-sys-color-on-background`             |
| `--sys-inverse-surface`           | `--md-sys-color-inverse-surface`           |
| `--sys-inverse-on-surface`        | `--md-sys-color-inverse-on-surface`        |
| `--sys-scrim`                     | `--md-sys-color-scrim`                     |
| `--sys-shadow`                    | `--md-sys-color-shadow`                    |

### File da aggiornare (in ordine)

1. `src/global.css`
2. `src/layout.css`
3. `src/modules.css`
4. `src/components/components.css`
5. `src/components.css`
6. `src/design-system/theme-dark.css`
7. `src/design-system/theme-high-contrast.css`
8. `src/design-system/semantic-tokens.css`
9. `src/design-system/legacyStyles.css`
10. Tutti i file TSX/TS con inline style `var(--sys-*)`

**Status:** ⬜ Non iniziato

---

## FASE C — Typography: layout.css → MD3 type scale

**Priorità:** 2  
**Impatto:** 98 hardcoded typography in `layout.css`, 273 totali

### MD3 Type Scale (da usare)

| Ruolo           | Token                                  |
| --------------- | -------------------------------------- |
| Display Large   | `--md-sys-typescale-display-large-*`   |
| Display Medium  | `--md-sys-typescale-display-medium-*`  |
| Display Small   | `--md-sys-typescale-display-small-*`   |
| Headline Large  | `--md-sys-typescale-headline-large-*`  |
| Headline Medium | `--md-sys-typescale-headline-medium-*` |
| Headline Small  | `--md-sys-typescale-headline-small-*`  |
| Title Large     | `--md-sys-typescale-title-large-*`     |
| Title Medium    | `--md-sys-typescale-title-medium-*`    |
| Title Small     | `--md-sys-typescale-title-small-*`     |
| Body Large      | `--md-sys-typescale-body-large-*`      |
| Body Medium     | `--md-sys-typescale-body-medium-*`     |
| Body Small      | `--md-sys-typescale-body-small-*`      |
| Label Large     | `--md-sys-typescale-label-large-*`     |
| Label Medium    | `--md-sys-typescale-label-medium-*`    |
| Label Small     | `--md-sys-typescale-label-small-*`     |

### Mapping font-size → MD3 type role

| Valore hardcoded | MD3 type role                |
| ---------------- | ---------------------------- |
| 57px / 3.5625rem | Display Large size           |
| 45px / 2.8125rem | Display Medium size          |
| 36px / 2.25rem   | Display Small size           |
| 32px / 2rem      | Headline Large size          |
| 28px / 1.75rem   | Headline Medium size         |
| 24px / 1.5rem    | Headline Small / Title Large |
| 22px / 1.375rem  | Title Large size             |
| 16px / 1rem      | Title Medium / Body Large    |
| 14px / 0.875rem  | Body Medium / Label Large    |
| 12px / 0.75rem   | Body Small / Label Medium    |
| 11px / 0.6875rem | Label Small size             |

### File da aggiornare

1. `src/layout.css` (98 violations)
2. `src/modules.css` (typography violations)
3. `src/global.css` (typography violations)
4. `src/components/components.css`

**Status:** ⬜ Non iniziato

---

## FASE A — Rimozione glassmorphism → Surface Tones MD3

**Priorità:** 3  
**Impatto:** Design visivo — rimozione blur/trasparenza non-MD3

### Cosa rimuovere / sostituire

| Custom (non-MD3)                         | MD3 corretto                                            |
| ---------------------------------------- | ------------------------------------------------------- |
| `--glass-bg: rgba(surface-rgb, opacity)` | `background: var(--md-sys-color-surface-container)`     |
| `--glass-blur: blur(px)`                 | Rimuovere — elevation overlay invece di blur            |
| `--glass-border: rgba(outline-rgb, 0.3)` | `border: 1px solid var(--md-sys-color-outline-variant)` |
| `backdrop-filter: blur(...)`             | Rimuovere completamente                                 |
| `-webkit-backdrop-filter: blur(...)`     | Rimuovere completamente                                 |

### Principio MD3 corretto per le superfici:

- Elevation 0 → `surface` (#FFFBFE)
- Elevation 1 → `surface-container-low` (tinted 5% primary)
- Elevation 2 → `surface-container` (tinted 8% primary)
- Elevation 3 → `surface-container-high` (tinted 11% primary)
- Elevation 4 → `surface-container-highest` (tinted 12% primary)
- Elevation 5 → `surface-container-highest` (tinted 14% primary — per Modal/Dialog)

**Status:** ⬜ Non iniziato

---

## FASE D — Layout variables custom → MD3 spacing tokens

**Priorità:** 4

| Variabile custom         | Token MD3                                                         |
| ------------------------ | ----------------------------------------------------------------- |
| `--header-height: 64px`  | `--md-sys-spacing-16` o custom ma con valore MD3                  |
| `--content-padding`      | `--md-sys-spacing-4` / `--md-sys-spacing-6`                       |
| `--content-padding-md`   | `--md-sys-spacing-8`                                              |
| `--aura-gradient`        | Rimuovere — usare surface tones con elevation                     |
| `--nav-rail-width: 88px` | Valore MD3 spec corretto (80dp per collapsed, 256dp per expanded) |
| `--sidebar-width`        | Mantenere se necessario ma usare spacing tokens per il valore     |

**Status:** ⬜ Non iniziato

---

## FASE E — constants.ts & utils.ts: hardcoded colors

**Priorità:** 5 (delicato — usato da PDF/chart)

### Approccio

- `src/constants.ts` (34 violations): colori per PDF generation e chart rendering — necessitano di esportare valori CSS risolti a runtime da `getComputedStyle`
- `src/design-system/utils.ts` (64 violations): color utilities — refactoring per derivare da token anziché hardcoded

### Strategia

```typescript
// Invece di:
export const CHART_COLOR_PRIMARY = "#6750A4";

// Usare:
export function getChartColorPrimary(): string {
  return (
    getComputedStyle(document.documentElement)
      .getPropertyValue("--md-sys-color-primary")
      .trim() || "#6750A4"
  );
}
```

**Status:** ⬜ Non iniziato

---

## Checklist finale conformità Google MD3

- [ ] Zero `--sys-*` attivi (solo `--md-sys-*`)
- [ ] Zero glassmorphism / backdrop-filter
- [ ] Zero font-size hardcoded in layout/modules/global CSS
- [ ] Zero colori hex nel codice (eccetto fallback documentato)
- [ ] Navigation Rail: labels visibili sempre, active indicator 64×84dp
- [ ] FAB: bottom-right, non sovrapposto alla nav
- [ ] Top App Bar: center-aligned mobile, small su scroll
- [ ] State layers: 8% hover, 12% focus/pressed, 38% disabled
- [ ] Shape scale: ExtraSmall=4dp → ExtraLarge=28dp → Full=50%
- [ ] Dark theme: zero value hardcoded, tutti da dark palette MD3

---

## Log delle fasi completate

| Data           | Fase    | Note                                               |
| -------------- | ------- | -------------------------------------------------- |
| Pre-2026-03-03 | Fase 0  | 93 motion audit violations fixate, commit 457e6c7a |
| 2026-03-03     | Analisi | Gap analysis completa vs Google MD3                |
