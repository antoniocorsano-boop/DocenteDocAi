---
applyTo: "src/**/*.css"
---

# MD3 CSS Authoring — DocenteDoc AI

Ogni file CSS in `src/` è parte del design system MD3 e deve usare **esclusivamente token `var(--md-sys-*)`**.

---

## 1. Regole assolute

| ❌ Vietato                                            | ✅ Obbligatorio                                                     |
| ----------------------------------------------------- | ------------------------------------------------------------------- |
| Valori numerici diretti: `16px`, `1rem`, `50%`        | `var(--md-sys-spacing-*)`                                           |
| Colori hardcoded: `#6750a4`, `rgba(0,0,0,0.5)`        | `var(--md-sys-color-*)`                                             |
| `box-shadow` custom                                   | `var(--md-sys-elevation-level*)`                                    |
| `border-radius` numerico                              | `var(--md-sys-shape-corner-*)`                                      |
| `font-size`, `font-weight`, `line-height` numerici    | `var(--md-sys-typescale-*-font-size/weight/line-height)`            |
| `transition` con valori numerici (`200ms`, `ease-in`) | `var(--md-sys-motion-duration-*)` + `var(--md-sys-motion-easing-*)` |
| `z-index` numerico                                    | Token `--md-sys-z-index-*` dal layer centralizzato                  |

---

## 2. Spacing

```css
/* ✅ Corretto */
.container {
  padding: var(--md-sys-spacing-4);
  gap: var(--md-sys-spacing-2);
  margin-bottom: var(--md-sys-spacing-6);
}

/* ❌ Vietato */
.container {
  padding: 16px;
  gap: 8px;
  margin-bottom: 24px;
}
```

Token spacing disponibili: `--md-sys-spacing-1` … `--md-sys-spacing-16` (e oltre).

---

## 3. Colori

```css
/* ✅ Corretto */
.card {
  background-color: var(--md-sys-color-surface-container);
  color: var(--md-sys-color-on-surface);
  border: 1px solid var(--md-sys-color-outline-variant);
}

/* ❌ Vietato */
.card {
  background-color: #f3edf7;
  color: #1c1b1f;
}
```

---

## 4. Shape / border-radius

```css
/* ✅ Corretto */
.chip {
  border-radius: var(--md-sys-shape-corner-small);
}
.card {
  border-radius: var(--md-sys-shape-corner-medium);
}
.fab {
  border-radius: var(--md-sys-shape-corner-extra-large);
}
.pill {
  border-radius: var(--md-sys-shape-corner-full);
}

/* ❌ Vietato */
.chip {
  border-radius: 8px;
}
```

---

## 5. Elevation / shadow

```css
/* ✅ Corretto */
.elevated-card {
  box-shadow: var(--md-sys-elevation-level2);
}

/* ❌ Vietato */
.elevated-card {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}
```

---

## 6. Motion / transizioni

```css
/* ✅ Corretto */
.interactive {
  transition: background-color var(--md-sys-motion-duration-short-2)
    var(--md-sys-motion-easing-standard);
}

/* ❌ Vietato */
.interactive {
  transition: all 200ms ease-in-out;
}
```

---

## 7. Override locali

- Gli override locali (component-scoped CSS) sono **consentiti** se scoped con selettore preciso, ma **devono usare solo token MD3**.
- Non introdurre utility CSS custom globali in `global.css` senza approvazione del Design System Architect.
- Classi utility strutturali (flex, grid, gap) in `ui-components.css` sono consentite solo se usano token MD3.

---

## 8. Dark mode

- Non scrivere MAI valori alternativi per dark mode inline.
- Il tema scuro è gestito dal `M3ThemeProvider` tramite variabili CSS a livello `:root` / `[data-theme="dark"]`.
- I token `var(--md-sys-color-*)` si aggiornano automaticamente al cambio tema.

---

## 9. Intestazione obbligatoria per ogni file CSS

```css
/* MD3 Compliant — [nome componente/area] */
```
