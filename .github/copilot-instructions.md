# DocenteDoc AI – Copilot Instructions (MD3 Enforced)

**VINCOLANTE – Material Design 3 è OBBLIGATORIO**

## REGOLA FONDAMENTALE

Material Design 3 (MD3) NON è una convenzione – è un **requisito tecnico vincolante**. Qualsiasi violazione è considerata un bug critico.

## PROIBITO (Blocca immediatamente)

- ❌ `className` – Vietato categoricamente
- ❌ Tailwind CSS o utility CSS – Vietato per colori, tipografia, spacing, shadow
- ❌ CSS legacy o design-system precedenti – Vietato
- ❌ Valori hardcoded (px, rem, %, hex, rgba) – Vietato
- ❌ `style` senza token MD3 – Vietato
- ❌ Test che non wrappano componenti con `M3ThemeProvider` – Vietato
- ❌ Bypass di CI o regression test – Vietato

## CONSENTITO (Solo questo)

- ✅ `style` inline con token MD3: `var(--md-sys-color-primary)`
- ✅ `M3Typography` per TUTTO il testo visibile
- ✅ Componenti M3 esistenti (M3Button, M3Card, M3Dialog, etc.)
- ✅ Stati interattivi con token MD3 (hover, focus, active)
- ✅ ARIA solo su nodi DOM reali
- ✅ Pattern WAI-ARIA corretti
- ✅ Focus visibile e token-based

## ACCESSIBILITÀ (Obbligatoria)

- ARIA labels obbligatorie su tutti i controlli interattivi
- Focus indicator visibili con token MD3
- Keyboard navigation completa
- Touch targets >= 44px
- Error messages accessibili con M3Typography

## TESTING (Vincolante)

- Tutti i test devono wrappare componenti che usano `useTheme()` con `M3ThemeProvider`
- `vitest run` deve sempre passare – blocco PR se fallisce
- `playwright test` deve sempre passare – blocco PR se fallisce
- Regressione visiva deve bloccare la PR

## CI AWARENESS

- Qualsiasi PR che introduce `className` viene bloccata automaticamente
- Qualsiasi PR che reintroduce utility CSS viene bloccata automaticamente
- Qualsiasi PR che fallisce `vitest run` viene bloccata automaticamente
- Qualsiasi PR che fallisce `playwright test` viene bloccata automaticamente
- Qualsiasi regressione visiva blocca la PR

## PATTERN OBBLIGATORIO

```tsx
// ✅ CORRETTO
<div
  style={{
    backgroundColor: 'var(--md-sys-color-surface)',
    padding: 'var(--md-sys-spacing-4)',
    borderRadius: 'var(--md-sys-shape-corner-medium)'
  }}
>
  <M3Typography variant="body-large">
    Testo accessibile
  </M3Typography>
</div>

// ❌ VIETATO - BLOCCA LA PR
<div className="bg-blue-500 p-4 rounded">
  <span>Testo non accessibile</span>
</div>
```

## DECISIONI ARCHITETTUREALI

- MD3 è il singolo source of truth per design
- Nessuna eccezione concessa
- Violazioni richiedono rollback immediato
- Reviewers devono bloccare PR non conformi

**RICORDA**: MD3 non è opzionale. È il fondamento tecnico del progetto.</content>
<parameter name="filePath">c:\Users\anton\DocenteDocAI-Flowise\docentedoc-ai\.github\copilot-instructions.md
