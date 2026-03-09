# Design System Handoff — DocenteDoc AI

**Data:** 2026-03-08  
**Stato:** Fondamenta stabili — in transizione da token CSS inline → MUI v7 nativo  
**Target:** App mobile-first PWA, moderna, coerente, piacevole su ogni schermo

---

## 1. Contesto: cosa è successo

L'app ha attraversato **tre mesi di migrazioni parziali** verso MD3 personalizzato con token CSS custom (`var(--md-sys-*)`). Il risultato è un sistema **ibrido** che funziona ma ha due problemi strutturali:

1. **Inline styles ovunque** — quasi tutti i componenti definiscono stili con `style={{...}}` usando i token CSS. Questo è tecnicamente corretto ma non è come si usa MUI v7: rende il codice verboso, difficile da leggere e da mantenere, e impedisce di sfruttare le feature del tema MUI (responsive breakpoints, theme overrides, sx shorthand).

2. **Componenti custom legacy** ancora presenti (`M3Typography`, `M3Surface`, `M3Dialog`, ecc.) che wrappano MUI in modo inutile — MUI v7 è già MD3-compliant nativamente.

**Il stack attuale è:**

- MUI v7 (`@mui/material ^7.3.9`) installato e funzionante
- `src/theme/muiTheme.ts` — tema centralizzato con palette MD3, tipografia, shape, spacing
- `src/theme/M3ThemeProvider.tsx` — provider attivo nell'albero React
- Token CSS `var(--md-sys-*)` definiti in `src/theme.css` (colori, spacing, typescale, motion, elevation)
- Spacing base = 4px (coerente con MD3 e con `theme.spacing()` MUI)

---

## 2. Stato attuale di Settings.tsx (file pilota)

**Settings.tsx è il file più avanzato dell'app** — è stato riscritto interamente con la struttura corretta, tutti i bug principali corretti, ed è il modello di riferimento per la migrazione degli altri.

### Struttura ✅

```
Settings (pagina full-screen)
├── Paper (shell verticale, height: 100dvh)
│   ├── Paper (top app bar con back button + SectionHeader)
│   └── div[flex:1, overflow:auto] (scrollable content)
│       ├── SettingsGroup id="interface_experience" variant="primary"
│       ├── SettingsGroup id="profile"              variant="surface"
│       ├── SettingsGroup id="ai_didattica"         variant="secondary"
│       ├── SettingsGroup id="ai_suggestions"       variant="tertiary"
│       ├── SettingsGroup id="cloud"                variant="primary"
│       ├── SettingsGroup id="debug_logging"        variant="surface"
│       ├── SettingsGroup id="advanced"             variant="surface"
│       └── div (footer: versione + logout)
└── ResetConfirmModal (portale)
```

### `SettingsGroup` component ✅

**È il pattern accordion corretto per MUI v7 + MD3.** Implementa:

- `<Paper elevation={1|2}>` come container
- `<button>` nativo HTML come trigger (accessibile, `aria-expanded`, `aria-controls`)
- Icon container colorato dal `variant` (primary/secondary/tertiary/surface)
- Panel con `maxHeight` + `opacity` transition (CSS, non JS)
- Stato open/closed persistito in `localStorage`

### Bug corretti (2026-03-08) ✅

| Bug                                                     | Fix                                                               |
| ------------------------------------------------------- | ----------------------------------------------------------------- |
| 3 icone Material Symbols renderizzate come testo        | Aggiunta `className="material-symbols-outlined"`                  |
| Storage progress bar invisibile (height 0)              | Aggiunta `height`, `backgroundColor`, `overflow: hidden` al track |
| Encoding corrotto `gi<0xFFFD>`                          | → `già`                                                           |
| Import file rotto (FileReader duplicato)                | `handleFileChange` passa `File` direttamente a `onImportData`     |
| `onImportData: (data: string)` incompatibile con engine | → `(file: File)` in `SettingsProps` e `SettingsViewsProps`        |
| Token CSS rotto `var(--md-sys-color-error)-container`   | → `var(--md-sys-color-error-container)`                           |
| Logout button con `height: 16px` (inutilizzabile)       | Rimosso height fisso                                              |
| Delete classe button 16×16px                            | Rimosso size fisso, padding adeguato                              |
| Input ore `width: 16px` (inutilizzabile)                | → `44px`                                                          |
| Typography con `<div>` child (HTML invalido)            | Aggiunto `component="div"`                                        |
| `variant="contained"` → non in union type               | → `variant="primary"`                                             |

### Difetti residui (da fare nel prossimo step)

- Tutti gli stili sono ancora **`style={{}}`** con token CSS inline → da migrare a `sx` MUI
- `SettingsGroup.variant` union type ha ancora `contained | tonal | elevated | outlined` inutilizzati
- La matrice cattedra (`<table>`) usa `<button>` nativo senza `type="button"` (può triggerare submit)

---

## 3. Visione: dove dobbiamo andare

### Il principio guida

> **MUI v7 è già Material Design 3.** Non serve bridgare con token CSS inline. Si usa il tema e `sx`.

```tsx
// ❌ PATTERN ATTUALE (verboso, non mantenibile)
<Typography
  variant="body2"
  style={{ color: 'var(--md-sys-color-on-surface-variant)' }}
>

// ✅ PATTERN TARGET (conciso, tema-aware, responsive)
<Typography variant="body2" color="text.secondary">
```

```tsx
// ❌ PATTERN ATTUALE
<div style={{
  display: 'flex',
  gap: 'var(--md-sys-spacing-4)',
  padding: 'var(--md-sys-spacing-5)',
  backgroundColor: 'var(--md-sys-color-surface-container)',
  borderRadius: 'var(--md-sys-shape-corner-large)',
}}>

// ✅ PATTERN TARGET
<Box sx={{
  display: 'flex',
  gap: 1,
  p: 1.5,
  bgcolor: 'grey.100',        // oppure palette token se definito
  borderRadius: 3,            // theme.shape.borderRadius × 3 = 36px
}}>
```

### Stack design definitivo

| Layer      | Tecnologia                                                         | Uso                                                                                                                                                  |
| ---------- | ------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| Componenti | **MUI v7**                                                         | `Button`, `Typography`, `Paper`, `Box`, `Card`, `List`, `TextField`, `Select`, `Dialog`, `Tabs`, `Chip`, `LinearProgress`, `IconButton`, `Accordion` |
| Icone      | **Material Symbols Outlined** (font)                               | `<span className="material-symbols-outlined">icon_name</span>` oppure **`@mui/icons-material`** per icone statiche                                   |
| Layout     | **MUI `Box` + `Stack` + `Grid`**                                   | No `<div>` visivi, no `display: flex` inline                                                                                                         |
| Tipografia | **`<Typography>`** MUI                                             | Nessun `style={{ fontSize, fontWeight }}` diretto                                                                                                    |
| Colori     | **Palette MUI** (`color="primary"`, `bgcolor="background.paper"`)  | Solo per eccezioni: `sx={{ color: 'var(--md-sys-color-*)' }}`                                                                                        |
| Spacing    | **`theme.spacing()`** via `sx={{ p: 2, gap: 1 }}`                  | Unità base 4px, mai valori px hardcoded                                                                                                              |
| Responsive | **MUI breakpoints** `sx={{ display: { xs: 'none', md: 'flex' } }}` | Mobile-first — default xs, eccezioni md/lg                                                                                                           |

---

## 4. Regole di migrazione (non negoziabili)

### Regola 1 — `sx` sempre, `style` mai

```tsx
// ✅
<Box sx={{ p: 2, borderRadius: 2, bgcolor: 'background.paper' }}>
// ❌
<div style={{ padding: '8px', borderRadius: '8px', backgroundColor: 'var(--md-sys-color-surface)' }}>
```

### Regola 2 — Mai valori hardcoded in `sx`

```tsx
// ✅ Usa valori semantici del tema
sx={{ color: 'text.secondary', bgcolor: 'action.hover', borderRadius: 3 }}
// ❌ Valori pixel o hex diretti
sx={{ color: '#49454F', bgcolor: 'rgba(0,0,0,0.08)', borderRadius: '12px' }}
```

### Regola 3 — Typography semantica

```tsx
// ✅ Usa la gerarchia MUI che mappa su MD3
<Typography variant="titleLarge">     → h6 MUI (1.5rem, headline-small)
<Typography variant="labelLarge">     → overline MUI (0.875rem)
<Typography variant="bodyMedium">     → body2 MUI (0.875rem)
<Typography variant="bodySmall">      → caption MUI (0.75rem)
// ❌ Mai sovrascrivere con style inline
<Typography style={{ fontSize: '14px', fontWeight: 500 }}>
```

### Regola 4 — Mobile-first nei breakpoint

```tsx
// ✅ Mobile default, poi md/lg
sx={{ flexDirection: { xs: 'column', md: 'row' }, gap: { xs: 1, md: 2 } }}
// ❌ Desktop default poi ridotto
sx={{ flexDirection: 'row', '@media (max-width: 600px)': { flexDirection: 'column' } }}
```

### Regola 5 — Touch targets ≥ 48px

Il tema MUI è già configurato con `MuiButtonBase.defaultProps`. Non sovrascrivere mai con `height` inferiore a 48px su elementi interattivi. Per icone piccole usare `IconButton` che gestisce automaticamente il touch target.

### Regola 6 — Icone accessibili

```tsx
// ✅ Decorativa in un bottone con label
<IconButton aria-label="Elimina materia">
  <span className="material-symbols-outlined" aria-hidden="true">delete</span>
</IconButton>
// ❌ span nu interattivo senza ruolo
<span onClick={...}>delete</span>
```

### Regola 7 — Accordion = MUI `Accordion`

Il pattern `SettingsGroup` in Settings.tsx ha una buona struttura ma usa HTML nativo. Nel resto dell'app usare direttamente:

```tsx
import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
<Accordion>
  <AccordionSummary expandIcon={<ExpandMoreIcon />}>…</AccordionSummary>
  <AccordionDetails>…</AccordionDetails>
</Accordion>;
```

---

## 5. Priorità di migrazione

### Tier 1 — Fondamenta (ogni altra view li usa)

| File                                  | Problema principale                                  |
| ------------------------------------- | ---------------------------------------------------- |
| `src/components/AppLayout.tsx`        | Shell dell'app — se usa px inline lo propagano tutti |
| `src/components/Header.tsx`           | Top bar — visibile sempre                            |
| `src/components/BottomNav.tsx`        | Navigazione primaria mobile                          |
| `src/components/NavigationRail.tsx`   | Navigazione desktop                                  |
| `src/components/ui/SectionHeader.tsx` | Usato in Settings e molte views                      |
| `src/components/ui/InfoCard.tsx`      | Usato ovunque                                        |
| `src/components/ui/EmptyState.tsx`    | Usato in tutte le liste vuote                        |

### Tier 2 — Views principali (accesso quotidiano)

| File                                  | Note                                   |
| ------------------------------------- | -------------------------------------- |
| `src/components/Home.tsx`             | Homepage — LCP critico per performance |
| `src/components/Timetable.tsx`        | Vista orario — matrice scrollabile     |
| `src/components/EvaluationModule.tsx` | Flusso valutazione                     |
| `src/components/LessonsPage.tsx`      | Lista lezioni                          |
| `src/components/StudentManager.tsx`   | Gestione studenti                      |

### Tier 3 — Modali (molti, ma isolati)

Tutti i file `*Modal.tsx` — attualmente usano ancora `M3Dialog`. Migrare a `Dialog` MUI nativo.

### Tier 4 — Settings.tsx (è già Tier 1, ma da affinare)

- Migrare `style={{}}` inline → `sx`
- Sostituire `<table>` cattedra con `Stack` + `Grid` responsive (la matrice non funziona su mobile)
- Valutare uso di `MUI Accordion` al posto del custom `SettingsGroup`

---

## 6. Pattern mobile-first per Settings (e tutte le views full-screen)

```tsx
// Shell pagina full-screen (corretto)
<Paper
  sx={{
    display: "flex",
    flexDirection: "column",
    height: "100dvh",
    overflow: "hidden",
    bgcolor: "background.default",
  }}
>
  {/* Top app bar */}
  <Box
    component="header"
    sx={{
      display: "flex",
      alignItems: "center",
      flexShrink: 0,
      px: 1,
      py: 1.5,
      borderBottom: 1,
      borderColor: "divider",
      gap: 1,
    }}
  >
    <IconButton aria-label="Torna indietro" onClick={onClose}>
      <span className="material-symbols-outlined" aria-hidden="true">
        arrow_back
      </span>
    </IconButton>
    <Typography variant="h6" component="h1">
      Impostazioni
    </Typography>
  </Box>

  {/* Scrollable content */}
  <Box sx={{ flex: 1, overflowY: "auto", p: { xs: 1.5, md: 3 } }}>
    <Stack spacing={2}>{/* Sezioni accordion */}</Stack>
  </Box>
</Paper>
```

---

## 7. Pattern base riutilizzabili

### Card sezione interna

```tsx
<Paper
  variant="outlined"
  sx={{ p: 2, borderRadius: 3, bgcolor: "background.paper" }}
>
  <Stack spacing={1.5}>
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <span
        className="material-symbols-outlined"
        aria-hidden="true"
        style={{ color: "var(--md-sys-color-primary)" }}
      >
        calendar_month
      </span>
      <Typography variant="subtitle2" fontWeight={700}>
        Anno Scolastico
      </Typography>
    </Box>
    {/* content */}
  </Stack>
</Paper>
```

### Grid 2 colonne responsive

```tsx
<Box
  sx={{
    display: "grid",
    gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
    gap: 2,
  }}
>
  <TextField label="Nome" />
  <TextField label="Cognome" />
</Box>
```

### Bottone full-width su mobile, auto su desktop

```tsx
<Button
  variant="contained"
  fullWidth // sempre full width, o:
  sx={{ width: { xs: "100%", sm: "auto" } }}
>
  Salva
</Button>
```

### LinearProgress (sostituisce il progress bar storage manuale)

```tsx
<Box sx={{ mb: 1 }}>
  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
    <Typography variant="caption" color="text.secondary">
      Storage
    </Typography>
    <Typography variant="caption" color="text.secondary">
      {used}MB / {total}MB
    </Typography>
  </Box>
  <LinearProgress
    variant="determinate"
    value={percent}
    color={percent > 80 ? "error" : "primary"}
    sx={{ borderRadius: 1, height: 6 }}
  />
</Box>
```

---

## 8. Cosa NON fare

| Anti-pattern                                                        | Motivo                                                 |
| ------------------------------------------------------------------- | ------------------------------------------------------ |
| `style={{ color: 'var(--md-sys-color-*)' }}`                        | Usare `sx={{ color: 'primary.main' }}` o palette alias |
| `<div>` per layout visivo                                           | Usare `Box` — supporta `sx`, `component`, breakpoint   |
| `style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}` | Usare `<Stack spacing={2}>`                            |
| `style={{ width: 'var(--md-sys-percent-100)' }}`                    | `fullWidth` prop su MUI, o `sx={{ width: '100%' }}`    |
| `height: 'var(--md-sys-spacing-4)'` su bottoni                      | Token spacing-4 = 16px → inutilizzabile → mai su touch |
| `var(--md-sys-grid-fr-1) var(--md-sys-grid-fr-1)`                   | `gridTemplateColumns: '1fr 1fr'` diretto in `sx`       |
| `<table>` per layout non-tabellare                                  | `Stack` + `Grid` — scalano su mobile                   |
| M3\* wrapper non necessari                                          | Usare direttamente il componente MUI nativo            |
| `width: 'var(--md-sys-spacing-4)'` su input                         | 16px inutilizzabile — usare px semantici o proporzioni |

---

## 9. Token CSS residui (quando usarli ancora)

I token `var(--md-sys-*)` sono ancora **necessari** per:

- Colori che non hanno un alias nel tema MUI (es. `--md-sys-color-tertiary`, `--md-sys-color-surface-container-high`)
- Motion/animation (`--md-sys-motion-duration-*`, `--md-sys-motion-easing-*`)
- Elevation custom oltre ai livelli MUI

In questi casi l'uso in `sx` è accettabile:

```tsx
sx={{ bgcolor: 'var(--md-sys-color-tertiary-container)', borderRadius: 'var(--md-sys-shape-corner-full)' }}
```

---

## 10. Checklist per ogni componente migrato

- [ ] Tutti gli `style={{}}` sostituiti con `sx` (o rimossi se ridondanti)
- [ ] Nessun valore px/hex hardcoded in `sx`
- [ ] Nessun `<div>` per layout — usare `Box` o `Stack`
- [ ] Tipografia via `<Typography variant="...">` — senza override `style`
- [ ] `IconButton` ha `aria-label`
- [ ] Icone decorative hanno `aria-hidden="true"`
- [ ] Layout mobile-first: default xs, poi md/lg
- [ ] Touch target ≥ 48px su tutti gli elementi interattivi
- [ ] Zero errori TypeScript dopo la modifica
- [ ] Zero errori console browser dopo la modifica
