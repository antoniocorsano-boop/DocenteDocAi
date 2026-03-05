---
applyTo: "src/components/**,src/nka/**"
---

# MD3 Component Authoring — DocenteDoc AI

Ogni componente React in questo progetto DEVE essere pienamente conforme al [MD3_GOVERNANCE_COMPLIANCE_CONTRACT](../../../docs/governance/MD3_GOVERNANCE_COMPLIANCE_CONTRACT.md).

---

## 1. Styling — regole assolute

| ❌ Vietato                                        | ✅ Obbligatorio                                                     |
| ------------------------------------------------- | ------------------------------------------------------------------- |
| Valori hardcoded: `px`, `rem`, `%`, `hex`, `rgba` | Token MD3: `var(--md-sys-color-*)`, `var(--md-sys-spacing-*)`, etc. |
| `className` per styling (eccetto icone MD3)       | `style={{ ... }}` con token MD3                                     |
| `box-shadow` custom                               | `var(--md-sys-elevation-level*)`                                    |
| Breakpoint / media query ad-hoc                   | Layout MD3 o utilità centralizzate approvate                        |
| Utility CSS custom                                | Nessuna; solo token MD3                                             |
| `fontSize`, `fontWeight` inline                   | `var(--md-sys-typescale-*-font-*)`                                  |

**Esempio corretto:**

```tsx
const style: CSSProperties = {
  backgroundColor: "var(--md-sys-color-surface-container)",
  padding: "var(--md-sys-spacing-4)",
  borderRadius: "var(--md-sys-shape-corner-medium)",
  color: "var(--md-sys-color-on-surface)",
};
```

---

## 2. Componenti container visivi

- Usare **`M3Surface`**, **`AppLayout`** o wrapper MD3 approvati per ogni container visivo.
- **Vietato** usare `<div>` generici per shell, card, banner, surface o stati.
- Padding, background ed elevation: solo tramite componenti MD3 e relativi token.

---

## 3. Tipografia

- Usare **`M3Typography`** per ogni testo significativo (titoli, body, label, helper).
- Varianti MD3 obbligatorie:
  - Titoli: `headline-small` / `headline-medium`
  - Sottotitoli: `body-small` / `title-medium`
  - Label/form: `label-large`
  - Badge/error: `label-small`

```tsx
// ✅ Corretto
import { M3Typography } from './ui/M3Typography';

<M3Typography variant="headline-small">{title}</M3Typography>
<M3Typography variant="body-large" as="p">{description}</M3Typography>
<M3Typography variant="label-large" as="label" htmlFor="input-id">{label}</M3Typography>

// ❌ Vietato
<h1 style={{ fontSize: '1.5rem' }}>{title}</h1>
<p style={{ fontWeight: 600 }}>{text}</p>
```

**Tutte le varianti disponibili:** `display-large/medium/small`, `headline-large/medium/small`, `title-large/medium/small`, `body-large/medium/small`, `label-large/medium/small`

---

## 4. Componenti interattivi

Usare **esclusivamente** i componenti MD3 o wrapper MD3 approvati:

| Scopo             | Componente                                                                  |
| ----------------- | --------------------------------------------------------------------------- |
| Pulsante          | `M3Button` (variant: `filled` / `tonal` / `outlined` / `text` / `elevated`) |
| FAB               | `M3Fab` / `GlobalFab`                                                       |
| Dialog / Modal    | `UniversalModal` o wrapper MD3 approvato                                    |
| Input testuale    | `TextField` (`src/components/ui/TextField.tsx`)                             |
| Card              | `M3Surface` con elevation token                                             |
| Rating/Score      | `M3RatingBar` (`src/components/M3RatingBar.tsx`)                            |
| Chip / tag        | `M3Chip` / `M3ChipGroup`                                                    |
| Lista             | `M3ListItem`                                                                |
| Icona interattiva | `M3IconButton`                                                              |

---

## 5. Accessibilità — obbligatoria

- Ogni elemento interattivo DEVE avere `aria-label` esplicito e univoco.
- Icone decorative: `aria-hidden={true}`.
- Icone interattive (`<span role="button">`): `aria-label` obbligatorio.
- Touch target minimo: `minHeight: 'var(--md-sys-spacing-11)'` (≈ 44px).
- Garantire `tabIndex` e focus order coerenti.

---

## 6. Motion / Transizioni

```tsx
// ✅ Corretto
transition: "background-color var(--md-sys-motion-duration-short-2) var(--md-sys-motion-easing-standard)";

// ❌ Vietato
transition: "all 200ms ease";
```

---

## 7. Dichiarazione MD3 nel file

Ogni componente MD3 conforme deve iniziare con un commento:

```tsx
// MD3 Gold Compliant
```

Ogni file che NON è ancora migrato deve avere:

```tsx
// TODO: MD3 migration pending
```

---

## 8. Eccezioni consentite

- `className` è consentito **solo** per classi di icone MD3 Material Symbols (es. `"material-symbols-outlined"`).
- Override locali sono **vietati** senza documentazione e approvazione del Design System Architect.

---

## 9. Checklist pre-commit per ogni componente

- [ ] Nessun valore hardcoded (px, rem, %, hex, rgba)
- [ ] Nessun `className` fuori dalle eccezioni
- [ ] Container visivi con componenti MD3 (no `<div>` generici)
- [ ] Tipografia con `M3Typography` e variante corretta
- [ ] Ogni interattivo ha `aria-label`
- [ ] Transizioni con token motion MD3
- [ ] File inizia con `// MD3 Gold Compliant`
