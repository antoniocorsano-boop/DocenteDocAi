# Consolidamento Design System - DocenteDoc AI

**Versione:** 1.0  
**Data:** 5 Gennaio 2026  
**Stato:** Analisi completata, implementazione in corso

---

## 📋 Riepilogo Esecutivo

DocenteDoc AI utilizza un'architettura ibrida:
- **MD3 token system**: colori, tipografia, spacing (CSS variables)
- **Componenti custom M3**: bottoni, dialoghi, card (no MUI)
- **Tailwind**: utility classes per layout e responsive
- **Legacy CSS**: alcune transizioni ancora in corso

### ✅ Decisione Architetturale

**MUI sarà il principale per componenti critici**, mentre manteniamo i custom M3 per casi specifici.

---

## 1️⃣ Componenti Attualmente Implementati

### Componenti Custom M3 (Consigliati)
| Componente | File | Stato | Approccio |
|---|---|---|---|
| **Button** | `M3Button.tsx` | ✅ Stabile | Varianti: filled, outlined, text, tonal, elevated |
| **Dialog** | `M3Dialog.tsx` | ✅ Stabile | Custom con close, headline, footer |
| **Card** | `M3Card.tsx` | ✅ Stabile | Elevation + outline MD3 |
| **ListItem** | `M3ListItem.tsx` | ✅ Stabile | Primary + secondary text |
| **TextField** | `TextField.tsx` | ✅ Stabile | Custom input con errori |
| **SelectField** | `SelectField.tsx` | ✅ Stabile | Dropdown wrapper |
| **TextArea** | `TextArea.tsx` | ✅ Stabile | Componente nativo |
| **ChoiceCard** | `M3ChoiceCard.tsx` | ✅ Stabile | Card selezionabile |
| **ExpressiveCard** | `M3ExpressiveCard.tsx` | ✅ Stabile | Card con colori custom |
| **BadgedIcon** | `M3BadgedIcon.tsx` | ✅ Stabile | Icon con badge |

### Componenti In Transizione
| Componente | Uso | Stato Attuale | Azione Consigliata |
|---|---|---|---|
| **Modali business** | ~80 modali | Custom HTML | Standardizzare su M3Dialog |
| **Popover** | Events, Quick Note | Custom div | Considerare MUI Popover |
| **Menu** | Navigation | Custom | Considerare MUI Menu |

### Supporto di Librerie Esterne
- **@dnd-kit**: drag-and-drop (no conflitti)
- **@emotion**: emotion per stile dinamico (no conflitti con MD3)
- **@fontsource/roboto**: Roboto font (✅ coerente con MD3)

---

## 2️⃣ Token CSS e Theme Attuale

### Colori MD3 (Definiti in `src/design-system/index.ts`)

**Colori Semantici:**
```css
--sys-primary        /* #6750a4 */
--sys-on-primary     /* #fff */
--sys-primary-container /* #eaddff */
--sys-on-primary-container /* #21005d */

--sys-secondary      /* #625b71 */
--sys-on-secondary   /* #fff */
--sys-secondary-container /* #e8def8 */
--sys-on-secondary-container /* #1d192b */

--sys-tertiary       /* #7d5260 */
--sys-error          /* #f2b8b5 */
--sys-background     /* #fffbfe */
--sys-surface        /* #fff */
--sys-surface-container /* #f3eff4 */
--sys-outline        /* #79747e */
```

**Elevazione (Surface Tiers):**
```css
--sys-surface-container-lowest  /* no elevation */
--sys-surface-container-low     /* elevation 1 */
--sys-surface-container         /* elevation 2 */
--sys-surface-container-high    /* elevation 3 */
--sys-surface-container-highest /* elevation 4 */
```

### Tipografia MD3

```css
--typography-display-large      /* 57px, 400, Roboto */
--typography-headline-large     /* 32px, 400, Roboto */
--typography-title-large        /* 22px, 400, Roboto */
--typography-body-large         /* 16px, 400, Roboto */
--typography-label-large        /* 14px, 500, Roboto */
--typography-body-medium        /* 14px, 400, Roboto */
--typography-body-small         /* 12px, 400, Roboto */
```

### Spacing MD3

```css
--spacing-1  /* 4px  (0.25rem) */
--spacing-2  /* 8px  (0.5rem)  */
--spacing-3  /* 12px (0.75rem) */
--spacing-4  /* 16px (1rem)    */
--spacing-6  /* 24px (1.5rem)  */
--spacing-8  /* 32px (2rem)    */
```

---

## 3️⃣ Analisi Transizioni da Tailwind/Custom

### Tailwind Attualmente Usato

```tsx
// Utility classes in componenti
className="p-8 md:p-6"           // padding responsive
className="w-10 h-10"             // size fixed
className="rounded-full"          // shape
className="border border-outline" // borders
className="flex items-center"     // flexbox
className="text-on-surface"       // color text
className="bg-surface-container"  // background
className="hover:shadow-lg"       // interactions
className="gap-6"                 // spacing
```

### Problemi Identificati

1. **Mixing token CSS + Tailwind**: alcuni componenti usano entrambi
2. **Inconsistenza shape**: `rounded-full`, `rounded-xl` vs `--shape-lg`, `--shape-xl`
3. **Hardcoded breakpoints**: `md:` instead of breakpoint tokens
4. **Opacity inline**: `.opacity-80` instead of semantic color

### Transizione Consigliata

```tsx
// ❌ Attuale
className="p-8 md:p-6 text-on-surface-variant opacity-80"

// ✅ Migliore
className="p-8 md:p-6 text-on-surface-variant"
// + color opacity nel token CSS
style={{ opacity: 0.8 }} // se strettamente necessario
```

---

## 4️⃣ Decisione: MUI vs Custom M3

### Strategia Ibrida Raccomandata

| Componente | Soluzione | Motivazione |
|---|---|---|
| **Button** | M3Button custom | ✅ MD3-native, semplice, lightweight |
| **TextField** | M3TextField custom | ✅ Controllo pieno, accessibility nativa |
| **Dialog** | M3Dialog custom | ✅ Semantica esplicita (headline, footer) |
| **Card** | M3Card custom | ✅ Lightweight, focus su MD3 |
| **List** | M3ListItem custom | ✅ Semplice, two-line layout |
| **Popover** | **MUI Popover** | 🔄 Complex positioning, scroll handling |
| **Menu** | **MUI Menu** | 🔄 Keyboard navigation, submenus |
| **Autocomplete** | **MUI Autocomplete** | 🔄 Complex filtering + virtualization |
| **DataGrid** | **MUI DataGrid** | 🔄 Sorting, pagination, 100+ rows |
| **Stepper** | **MUI Stepper** | 🔄 Multi-step workflows |

### Motivazione della Scelta

✅ **Custom M3 è preferibile per:**
- Bottoni, card, input semplici
- Quando necessario controllo pieno su markup
- Componenti che servono come fondazione per altre UI
- Quando la payload JS è critica (PWA local-first)

🔄 **MUI è preferibile per:**
- Popover/dropdown con positioning complesso
- Tabelle grandi con filtri/sort/paginazione
- Autocomplete con virtulizzazione
- Stepper, Timeline, Tree (multi-step)
- Quando la complessità interna è significativa

---

## 5️⃣ Override MD3 Documentati

### Casi Legittimi di Customizzazione

#### 1. **Colore dinamico (Expressive Mode)**
```tsx
// M3ExpressiveCard.tsx
<div style={{
  backgroundColor: palette.bg,  // colore dinamico
  color: palette.fg,            // foreground dinamico
  borderRadius: 'calc(var(--shape-xl) * var(--sys-radius-multiplier))'
}}>

// ✅ DOCUMENTATO: Questo è l'unico override di colore consentito
// perché serve per l'Expressive Card (non è MD3-standard)
```

#### 2. **Proprietà Accessibility**
```tsx
// M3Dialog.tsx
<button
  onClick={onClose}
  aria-label="Chiudi"  // ✅ accessibility override (non styling)
  className="..."
>
```

#### 3. **Responsive Spacing**
```tsx
// ✅ CONSENTITO: responsive design con Tailwind utility
className="p-8 md:p-6 sm:p-4"
// 8px desktop, 6px tablet, 4px mobile
```

#### 4. **State Interactions**
```tsx
// ✅ CONSENTITO: hover/focus/active usando token
className="hover:bg-surface-container-high active:scale-[0.98]"
```

### ❌ Override NON Consentiti

```tsx
// ❌ VIETATO: colori hardcoded
style={{ color: '#ff6b6b' }}

// ❌ VIETATO: spacing arbitrario
className="p-5"  // invece di spacing-4, spacing-6, spacing-8

// ❌ VIETATO: shape non documentato
style={{ borderRadius: '24px' }}  // invece di --shape-lg, --shape-xl

// ❌ VIETATO: opacity inline senza motivazione
style={{ opacity: 0.5 }}  // deve essere in token CSS
```

---

## 6️⃣ Plan di Implementazione Immediata

### Fase 1: Consolidamento Attuale (Settimana 1-2)

- [ ] **Audit M3 Components**: verificare che tutti usino token CSS
- [ ] **Verify Tailwind Usage**: documentare tutti gli usi di utility
- [ ] **Remove Hardcoded Colors**: scan per hardcoded hex/rgb
- [ ] **Add Breakpoint Tokens**: formalizzare breakpoints (sm, md, lg, xl)

### Fase 2: Migrazione Graduale (Settimana 3-4)

- [ ] **Popover → MUI Popover** (EventActionPopover.tsx, QuickNotePopover.tsx)
- [ ] **Menu → MUI Menu** (Menu.tsx) con MD3 styling
- [ ] **Standardize Modals** su M3Dialog pattern
- [ ] **Add Form Validation** con feedback MD3

### Fase 3: Documentazione e Training (Settimana 5+)

- [ ] **Component Storybook** con esempi
- [ ] **Guidelines per nuovi componenti**
- [ ] **Testing per Accessibility**
- [ ] **Performance benchmarking** (bundle size, rendering)

---

## 7️⃣ Checklist di Conformità

### Per Ogni Nuovo Componente

```markdown
- [ ] Usa token CSS per colori (--sys-*)
- [ ] Usa token CSS per spacing (--spacing-*)
- [ ] Usa token CSS per tipografia (--typography-*)
- [ ] Shape coerente con MD3 (--shape-sm, lg, xl)
- [ ] Accessibility completa (aria-*, role=, tabIndex)
- [ ] Responsive design con breakpoints
- [ ] Dark mode supportato
- [ ] TypeScript con Props interface
- [ ] JSDoc/commenti per decision
- [ ] Test coverage > 80%
```

### Per Ogni Override Documentato

```markdown
- [ ] Commento chiaro nel codice
- [ ] Motivazione esplicita nel commit
- [ ] Link a issue/task nel copilot-instructions
- [ ] Verificato con Designer (se applicabile)
```

---

## 8️⃣ Risorse e Riferimenti

### File Chiave del Design System
- `src/design-system/index.ts` — Token master
- `src/design-system/utils.ts` — Helper functions
- `src/design-system/typography.css` — Tipografia
- `src/components/ui/` — Componenti M3 custom
- `src/theme.css` — CSS variables globali

### Documentazione MD3
- [Material Design 3 Official](https://m3.material.io)
- [Color System](https://m3.material.io/styles/color/the-color-system/key-colors-tones)
- [Typography](https://m3.material.io/styles/typography/overview)
- [Shape](https://m3.material.io/styles/shape/shape-scale-tokens)

### Come Usare i Token nel Codice

```tsx
// React component
import { baseDesignSystem } from '../design-system';

const MyComponent = () => {
  const primaryColor = baseDesignSystem.colors.primary.value;
  return <div style={{ color: primaryColor }}>...</div>;
};

// CSS
.my-element {
  color: var(--sys-primary);
  padding: var(--spacing-4);
  font-size: var(--typography-body-large);
  border-radius: calc(var(--shape-lg) * var(--sys-radius-multiplier));
}

// Tailwind (utility classes from tokens)
className="text-primary bg-surface-container p-4 text-body-large rounded-lg"
```

---

## 9️⃣ FAQ e Troubleshooting

### D: Perché non usare MUI per tutto?
**R:** MUI aggiunge 500KB (minified), DocenteDoc è PWA local-first. Custom M3 è più leggero e ha controllo pieno.

### D: Come conciliare Tailwind + token CSS?
**R:** Tailwind per layout/responsive, token CSS per colori/tipografia/spacing semantici. Separazione chiara.

### D: Dark mode è supportato?
**R:** Sì, via `defaultDarkTheme` nel `design-system/utils.ts`. Applica automaticamente token scuri.

### D: Posso usare colori hex custom?
**R:** No, a meno che non sia documentato come override (es. Expressive Card). Usa `baseDesignSystem.colors.*`.

### D: Qual è il breakpoint di default?
**R:** `md: 768px` (da Tailwind). Custom breakpoint tokens sono in `src/design-system/breakpoints.css`.

---

## 🔟 Firma e Approvazione

- **Autore Analysis:** GitHub Copilot
- **Data Analysis:** 5 Gennaio 2026
- **Status:** ✅ Pronto per implementazione
- **Prossimo Checkpoint:** 12 Gennaio 2026

---

## Allegati

- [Appendice A: Componenti MUI da Integrare](docs/MUI_INTEGRATION_ROADMAP.md) *(da creare)*
- [Appendice B: Token CSS Export](docs/DESIGN_TOKENS_EXPORT.json) *(da creare)*
- [Appendice C: Testing Strategy](docs/DESIGN_SYSTEM_TESTING.md) *(da creare)*
