# ✅ DocenteDoc AI – Copilot Instructions (MD3 Compliant)

**VINCOLANTE – Material Design 3 è OBBLIGATORIO**

Data ultimo allineamento: 22 gennaio 2026

## REGOLA FONDAMENTALE

Material Design 3 (MD3) è il **singolo source of truth** per design. Tutti i colori, tipografia, spacing, shape ed elevation devono derivare da token MD3 (`var(--md-sys-*)`). Le eccezioni sono documentate e giustificate.

## PROIBITO (Blocca immediatamente)

- ❌ `className` – Vietato categoricamente (usa `style` con token MD3)
- ❌ Tailwind CSS o utility CSS – Vietato per colori, tipografia, spacing, shadow
- ❌ CSS legacy o design-system precedenti – Vietato
- ❌ Valori hardcoded (px, rem, %, hex, rgba) – Vietato, eccetto eccezioni documentate
- ❌ `style` senza token MD3 – Vietato
- ❌ Test che non wrappano componenti con `M3ThemeProvider` – Vietato
- ❌ Bypass di CI o regression test – Vietato
- ❌ Introduzione di nuove varianti design senza token MD3 – Vietato

## CONSENTITO (Solo questo)

- ✅ `style` inline con token MD3: `var(--md-sys-color-primary)`
- ✅ `M3Typography` per TUTTO il testo visibile
- ✅ Componenti M3 esistenti (M3Button, M3Card, M3Dialog, etc.)
- ✅ Stati interattivi con token MD3 (hover, focus, active)
- ✅ ARIA solo su nodi DOM reali
- ✅ Pattern WAI-ARIA corretti
- ✅ Focus visibile e token-based
- ✅ Eccezioni documentate (vedi sotto)

## ECCEZIONI DOCUMENTATE (Consentite)

### 1. Palette Avatar (`src/utils/colorUtils.ts`)
- **Cosa**: Colori hex hardcoded per generazione avatar
- **Perché**: Accessibilità - contrasto garantito Dark Text on Light Background
- **Regola**: NON usare per styling componenti, solo per avatar
- **Documento**: `docs/DESIGN_SYSTEM_CONSOLIDATION.md § 5`

### 2. Box-Shadow RGBA (`src/layout.css`)
- **Cosa**: `rgba(0, 0, 0, 0.1)` per elevation shadows
- **Perché**: Valori standard MD3 per box-shadow
- **Regola**: Usare solo valori MD3 standard, non custom

### 3. Inline Styles Minori
- **Cosa**: `font-size: 0.9em` in generazione HTML dinamica
- **Perché**: Impatto minimo, generazione contenuto dinamico
- **Regola**: Evitare quando possibile, preferire classi

## ACCESSIBILITÀ (Obbligatoria)

- ARIA labels obbligatorie su tutti i controlli interattivi
- Focus indicator visibili con token MD3
- Keyboard navigation completa
- Touch targets >= 44px
- Error messages accessibili con M3Typography

## TESTING (Vincolante)

- Tutti i test devono wrappano componenti che usano `useTheme()` con `M3ThemeProvider`
- `vitest run` deve sempre passare – blocco PR se fallisce
- `playwright test` deve sempre passare – blocco PR se fallisce
- Regressione visiva deve bloccare la PR

## CI AWARENESS

- Qualsiasi PR che introduce `className` viene bloccata automaticamente
- Qualsiasi PR che reintroduce utility CSS viene bloccata automaticamente
- Qualsiasi PR che fallisce `vitest run` viene bloccata automaticamente
- Qualsiasi PR che fallisce `playwright test` viene bloccata automaticamente
- Qualsiasi regressione visiva blocca la PR
- Qualsiasi violazione eccezioni non documentate blocca la PR

## PATTERN OBBLIGATORIO

```tsx
// ✅ CORRETTO - Usa token MD3
<div
  style={{
    backgroundColor: 'var(--md-sys-color-surface)',
    padding: 'var(--md-sys-spacing-4)',
    borderRadius: 'var(--md-sys-shape-corner-medium)',
    fontSize: 'var(--md-sys-typescale-body-large-size)'
  }}
>
  <M3Typography variant="body-large">
    Testo accessibile
  </M3Typography>
</div>

// ✅ CORRETTO - Eccezione documentata per avatar
const avatarColors = getAvatarColors(userId); // Usa palette hardcoded

// ❌ VIETATO - BLOCCA LA PR
<div className="bg-blue-500 p-4 rounded">
  <span>Testo non accessibile</span>
</div>

// ❌ VIETATO - BLOCCA LA PR (hardcoded non eccezione)
<div style={{ backgroundColor: '#ff0000', fontSize: '14px' }}>
  <span>Testo</span>
</div>
```

## DECISIONI ARCHITETTUREALI

- MD3 è il singolo source of truth per design
- Eccezioni solo se documentate e giustificate (accessibilità, standard MD3)
- Violazioni richiedono rollback immediato
- Reviewers devono bloccare PR non conformi
- Nuovo codice deve seguire pattern MD3 senza eccezioni

## REPORT E MONITORAGGIO

- **[Piano Allineamento MD3](MD3_Alignment_Plan.md)** - Strategia
- **[Report Analisi](MD3_Analysis_Report.md)** - Risultati scansione
- **[Report Finale](MD3_Alignment_Final_Report.md)** - Stato attuale
- **Lint Rules**: `design-system/no-hardcoded-colors` attivo
- **Build Status**: ✅ Verde dopo allineamento

**RICORDA**: MD3 è obbligatorio. Eccezioni sono rare e documentate. Qualsiasi dubbio? Consulta i report di allineamento.</content>
<parameter name="filePath">c:\Users\anton\DocenteDocAI-Flowise\docentedoc-ai\.github\copilot-instructions.md
