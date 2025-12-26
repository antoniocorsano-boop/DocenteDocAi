# Guida Migrazione Componenti Custom a Material Design 3 (M3)

Questa guida aiuta a migrare componenti React custom DocenteDoc AI agli standard Material Design 3 (Expressive/Web).

---

## 1. Aggiorna Design Tokens
- Usa solo variabili CSS definite in `src/theme.css` (colori, tipografia, spacing, shape, elevation)
- Rimuovi riferimenti a vecchi colori o classi legacy

## 2. Refactoring Componenti
- Converti tutti i componenti a **funzionali** (React.FC)
- Usa solo props tipizzate (TypeScript, interfacce in `types.ts`)
- Sostituisci classi legacy con classi M3 (`surface-container-high`, `button-filled`, ecc.)
- Per pulsanti/icona, usa `<M3IconButton />` e `<M3AnimatedIcon />`

## 3. Accessibilità
- Aggiungi sempre `aria-label` a pulsanti/icon-button
- Gestisci focus visibile e tabIndex coerente
- Usa ruoli semantici (`role="dialog"`, `role="status"`, ecc.)
- Verifica contrasto colori (WCAG 2.1 AA)

## 4. Micro-interazioni
- Per tooltip, avvolgi le azioni in `<Tooltip label="...">...</Tooltip>`
- Per feedback, usa `<Snackbar />` e `<Loader />` globali

## 5. Responsive
- Usa layout mobile-first, breakpoint e touch target M3
- Testa su dispositivi reali e simulati

## 6. Testing
- Aggiorna/aggiungi test in `__tests__/` e `e2e/`
- Verifica Problems panel: nessun errore/warning

## 7. Esempio Migrazione
```tsx
// Prima
<button className="btn-old" onClick={...}>Salva</button>

// Dopo
<M3IconButton icon="save" ariaLabel="Salva" onClick={...} />
```

---

## Risorse
- [Material Design 3 Guidelines](https://m3.material.io/)
- `src/design-system/`, `src/theme.css`, `src/components/M3Components.tsx`

---

Ultimo aggiornamento: 26/12/2025
