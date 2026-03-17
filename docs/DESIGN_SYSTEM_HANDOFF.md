# Design System Handoff — DocenteDoc AI

**Data ultimo aggiornamento:** 2026-03-17  
**Stato:** ✅ Stabile — token canonici, enforcement ESLint attivo, 0 violazioni  
**Target:** App mobile-first PWA, MD3 Gold Compliant

---

## 1. Source of truth

| Layer                | File                                    | Contenuto                                                                     |
| -------------------- | --------------------------------------- | ----------------------------------------------------------------------------- |
| **Token CSS**        | `src/theme.css`                         | Unica fonte autoritativa di tutti i `--md-sys-*` custom properties            |
| **Tema MUI**         | `src/theme/muiTheme.ts`                 | `createTheme()` con palette hex (no CSS var — MUI Error #9), spacing base 4px |
| **Provider**         | `src/theme/M3ThemeProvider.tsx`         | Provider attivo nell'albero React; gestisce dark mode e visual style          |
| **TypeScript types** | `src/theme/tokens.ts`                   | Interfacce `SysLayer / RefLayer / CompLayer`, usate nei test                  |
| **DS primitives**    | `src/design-system/index.ts`            | `baseDesignSystem` (frozen object) con cssVar references                      |
| **Typography CSS**   | `src/design-system/typography.css`      | 15 classi `.m3-{role}` pronte all'uso su qualsiasi elemento                   |
| **Spacing CSS**      | `src/design-system/spacing.css`         | Classi utility `.m3-p-*`, `.m3-gap-*`                                         |
| **Semantic tokens**  | `src/design-system/semantic-tokens.css` | Alias semantici di alto livello                                               |

---

## 2. Token inventory completo

### Colori — `--md-sys-color-*`

95+ token. Categorie principali:

| Categoria  | Token                                                                        |
| ---------- | ---------------------------------------------------------------------------- |
| Primary    | `primary`, `on-primary`, `primary-container`, `on-primary-container`         |
| Secondary  | `secondary`, `on-secondary`, `secondary-container`, `on-secondary-container` |
| Tertiary   | `tertiary`, `on-tertiary`, `tertiary-container`, `on-tertiary-container`     |
| Semantic   | `error`, `on-error`, `error-container`, `success`, `warning`                 |
| Surface    | `surface`, `on-surface`, `surface-variant`, `on-surface-variant`             |
| Container  | `surface-container-lowest/low/[default]/high/highest`                        |
| Outline    | `outline`, `outline-variant`                                                 |
| Background | `background`, `on-background`                                                |
| RGB        | tutti i precedenti con suffisso `-rgb` per `rgba(var(...), alpha)`           |

### Spacing — `--md-sys-spacing-*`

Base 4px. Scale: `0, 0.5, 1–20, 24, 28, 32, 35, 42, 56, 64, 80`  
→ `spacing-1 = 4px`, `spacing-2 = 8px`, `spacing-3 = 12px`, `spacing-4 = 16px`, ecc.  
`theme.spacing(1) = 4px` in MUI — numericamente allineati, strutturalmente separati.

### Tipografia — `--md-sys-typescale-*`

15 ruoli tipografici:

| Ruolo             | Font-size token                               |
| ----------------- | --------------------------------------------- |
| `display-large`   | 56px                                          |
| `display-medium`  | 45px                                          |
| `display-small`   | 36px                                          |
| `headline-large`  | 32px                                          |
| `headline-medium` | 28px                                          |
| `headline-small`  | 24px                                          |
| `title-large`     | 24px                                          |
| `title-medium`    | 20px                                          |
| `title-small`     | 16px                                          |
| `body-large`      | 16px                                          |
| `body-medium`     | 14px                                          |
| `body-small`      | 12px                                          |
| `label-large`     | 14px                                          |
| `label-medium`    | 12px                                          |
| `label-small`     | **11px** (MD3 spec, distinto da label-medium) |

Token speciali:

- `--md-sys-typescale-footnote-size: 10px` — footnote nei template
- `--md-sys-typescale-code-font-size: 11px` — snippet monospace / hint CSV/JSON

Font weight (7 livelli):

```
--md-sys-typescale-weight-black:     900
--md-sys-typescale-weight-extrabold: 800
--md-sys-typescale-weight-bold:      700
--md-sys-typescale-weight-semibold:  600
--md-sys-typescale-weight-medium:    500
--md-sys-typescale-weight-regular:   400
--md-sys-typescale-weight-light:     300
```

### Icone — `--md-sys-icon-size-*` ✨ (aggiunto 2026-03-17)

| Token                    | Valore | Uso                    |
| ------------------------ | ------ | ---------------------- |
| `--md-sys-icon-size-xs`  | 14px   | tiny status / badge    |
| `--md-sys-icon-size-sm`  | 16px   | small action / chip    |
| `--md-sys-icon-size-md`  | 20px   | default UI icon        |
| `--md-sys-icon-size-lg`  | 24px   | prominent action       |
| `--md-sys-icon-size-xl`  | 28px   | hero / dialog          |
| `--md-sys-icon-size-2xl` | 36px   | display / illustration |

### Shape — `--md-sys-shape-corner-*`

`none` → `extra-small` → `small` → `medium` → `large` → `extra-large` → `full`

### Elevation — `--md-sys-elevation-{0-5}`

Box-shadow values MD3. Usare solo tramite `Paper elevation={n}` o il token diretto.

### Z-index — `--md-sys-z-*`

Definiti in `src/styles/md3-z-index.css`. Centralizzati e governance tramite provider.

### Motion — `--md-sys-motion-*`

Durations e easing MD3 (`short1/2/3/4`, `medium1/2/3/4`, `long1/2/3/4`).

---

## 3. Enforcement durante lo sviluppo

### ESLint — unico gate attivo e funzionante

Tutte le violazioni MD3 sono intercettate automaticamente da 4 regole `no-restricted-syntax` in `eslint.config.mjs` (applicate a `src/**/*.tsx`, escluse le Storybook):

| Regola              | Pattern bloccato                                     | Correzione                                                                         |
| ------------------- | ---------------------------------------------------- | ---------------------------------------------------------------------------------- |
| **fontWeight**      | `fontWeight: 700` o `fontWeight: 'bold'` in sx/style | `fontWeight: 'var(--md-sys-typescale-weight-bold)'`                                |
| **fontSize string** | `fontSize: '0.875rem'` o `'14px'` in sx/style        | `fontSize: 'var(--md-sys-typescale-body-medium-font-size)'` o numero raw per icone |
| **style su MUI**    | `<Button style={{...}}>`                             | `<Button sx={{...}}>`                                                              |
| **nested var**      | `'var(var(--token))'`                                | `'var(--token)'`                                                                   |

```bash
npm run lint            # audit MD3 + lint generale (alias md3:audit, md3:scan, md3:check)
npm run md3:scan:strict # 0 warning tollerati
npm run md3:audit:all   # lint + tsc (gate completo)
npm run md3:validate    # lint + build (gate pre-deploy)
```

**Stato corrente:** 0 errori · 0 warning (verificato 2026-03-17)

### Cosa NON cattura ESLint (pattern da controllare in review)

- `<div>` usati come container visivi al posto di `M3Surface` / `Box` (strutturale, non sintattico)
- Spacing MUI numerico (`sx={{ p: 2 }}`) mescolato con token CSS (`var(--md-sys-spacing-2)`) — stesso valore ma percorsi diversi
- `Paper elevation={n}` che genera box-shadow MUI bypassando i token MD3

---

## 4. Come usare i token nei componenti

### Tipografia — modo corretto

```tsx
// ✅ Componente MUI con variant MD3
<Typography variant="bodyMedium">Testo</Typography>

// ✅ Token CSS su un elemento non-Typography
<Box sx={{ fontSize: 'var(--md-sys-typescale-label-small-font-size)' }}>11px</Box>

// ✅ Monospace / codice
<Box sx={{ fontFamily: 'monospace', fontSize: 'var(--md-sys-typescale-code-font-size)' }}>CSV</Box>

// ❌ Vietato
<Box sx={{ fontSize: '0.75rem', fontWeight: 500 }}>...</Box>
```

### Icone Material Symbols — modo corretto

```tsx
// ✅ Token icon-size
<Box component="span" className="material-symbols-outlined" aria-hidden="true"
  sx={{ fontSize: 'var(--md-sys-icon-size-md)' }}>
  home
</Box>

// ❌ Vietato — numero raw in stringa
<Box sx={{ fontSize: '20px' }}>home</Box>

// ⚠️ Tollerato — numero raw senza unità (non bloccato da ESLint, ma usa token)
<Box sx={{ fontSize: 20 }}>home</Box>
```

### Spacing — modo corretto

```tsx
// ✅ Token CSS (esplicito, tracciabile)
<Box sx={{ p: 'var(--md-sys-spacing-4)', gap: 'var(--md-sys-spacing-3)' }}>

// ✅ MUI numerico (allineato: spacing(1) = 4px = spacing-1)
<Box sx={{ px: 2, py: 1 }}>

// ❌ Vietato — hardcoded non tracciato
<Box sx={{ padding: '16px' }}>
```

### Surface / container — modo corretto

```tsx
// ✅ Componenti DS
<M3Surface elevation={1}>...</M3Surface>
<Paper elevation={2} sx={{ bgcolor: 'var(--md-sys-color-surface-container)' }}>

// ❌ Vietato per layout shell/card/banner
<div style={{ background: '...' }}>
```

---

## 5. Stato compliance (2026-03-17)

| Area                       | Stato       | Note                                                               |
| -------------------------- | ----------- | ------------------------------------------------------------------ | ---- | ------- | ------------------- |
| Token CSS (theme.css)      | ✅ Completo | 95+ color, spacing, typescale, icon-size, shape, elevation, motion |
| Typography tokens          | ✅ Completo | 15 ruoli + footnote + code-font-size                               |
| Icon size tokens           | ✅ Completo | 6 livelli xs→2xl (aggiunto 2026-03-17)                             |
| ESLint enforcement         | ✅ Attivo   | 4 regole no-restricted-syntax, 0 errori 0 warning                  |
| Modali (53 file)           | ✅ 53/53    | Tutti usano M3Dialog                                               |
| Componenti journey/copilot | ✅ Conformi | Icon sizes migrati a token                                         |
| MUI muiTheme.ts            | ✅ Stabile  | Raw hex (no CSS var), spacing base 4px                             |
| Dark mode                  | ✅ Attivo   | `.theme-dark` class su body + `global.css`                         |
| Visual styles              | ✅ Attivo   | `[data-visual-style="aura                                          | flat | minimal | ..."]` in theme.css |

---

## 6. Gotchas e pattern da evitare

- **`label-small-font-size = 11px`** (non 12px come label-medium) — da usare per label compatte, non per codice (usare `code-font-size`)
- **MUI `elevation={n}` genera box-shadow propria** — i token `--md-sys-elevation-*` sono fallback CSS, non si agganciano automaticamente
- **`theme.spacing(1) = 4px` e `var(--md-sys-spacing-1) = 4px`** coincidono ma non sono connessi — se cambia uno, l'altro non scala
- **Icon size ESLint**: i numeri raw (es. `fontSize: 20`) sono tollerati da ESLint (non stringe con unità), ma usa sempre il token `var(--md-sys-icon-size-md)` per tracciabilità
- **fontWeight `black` e `extrabold`** esistono (900/800) ma sono raramente MD3-semantici — usarli solo per display su titoli promozionali

---

## 7. Comandi di riferimento rapido

```bash
npm run lint              # ← esegui dopo ogni modifica UI — deve restare 0/0
npm run md3:scan:strict   # ← CI gate — 0 warning tollerati
npm run md3:audit:all     # ← lint + tsc completo (pre-PR)
npm run md3:validate      # ← lint + build (pre-deploy)
npx tsc -b --noEmit       # ← check tipi standalone
```

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
