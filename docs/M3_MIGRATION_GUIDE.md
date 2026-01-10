# Guida alla Migrazione M3 - DocenteDoc AI

## Panoramica

Questa guida documenta la migrazione completata da Tailwind CSS a Material Design 3 (M3) per DocenteDoc AI, inclusi token applicati, best practices e linee guida per lo sviluppo futuro.

## Token M3 Applicati

### Colori (8 token)

- `--sys-primary`: Colore primario principale
- `--sys-on-primary`: Testo su sfondo primario
- `--sys-surface`: Sfondo principale dell'app
- `--sys-on-surface`: Testo su sfondo surface
- `--md-sys-color-primary-container`: Contenitore primario
- `--md-sys-color-on-primary-container`: Testo su contenitore primario
- `--md-sys-color-secondary-container`: Contenitore secondario
- `--md-sys-color-surface-variant`: Variante surface

### Spaziatura (6 token)

- `--md-sys-spacing-1`: 4px
- `--md-sys-spacing-2`: 8px
- `--md-sys-spacing-3`: 12px
- `--md-sys-spacing-4`: 16px
- `--md-sys-spacing-6`: 24px
- `--md-sys-spacing-8`: 32px

### Tipografia (2 token)

- `--md-sys-typescale-title-medium`: Titoli medi (24px)
- `--md-sys-typescale-label-large-font-size`: Etichette grandi

### Forma (3 token)

- `--md-sys-shape-corner-small`: Angoli piccoli
- `--md-sys-shape-corner-medium`: Angoli medi
- `--md-sys-shape-corner-large`: Angoli grandi
- `--md-sys-shape-corner-extra-large`: Angoli extra large

### Elevazione (2 token)

- `--md-sys-elevation-level1`: Ombra livello 1
- `--md-sys-elevation-level2`: Ombra livello 2

### Motion (2 token)

- `--motion-easing-standard`: Easing standard
- `--motion-duration-short`: Durata corta (0.18s)

## Best Practices per Sviluppo M3

### 1. Uso dei Token

```css
/* ✅ CORRETTO: Usa sempre token M3 */
.my-component {
  background-color: var(--sys-surface);
  color: var(--sys-on-surface);
  padding: var(--md-sys-spacing-4);
  border-radius: var(--md-sys-shape-corner-medium);
}

/* ❌ SBAGLIATO: Non usare valori hardcoded */
.my-component {
  background-color: #fffbfe;
  color: #1c1b1f;
  padding: 16px;
  border-radius: 12px;
}
```

### 2. Componenti M3

- Usa componenti esistenti come `M3Button`, `M3Card`, `M3Chip`
- Estendi componenti base invece di crearne di nuovi
- Mantieni consistenza nell'API dei componenti

### 3. Accessibilità

- Tutti i componenti devono supportare `aria-label` e focus keyboard
- Mantieni contrasti di colore WCAG 2.1 AA
- Testa con screen reader

### 4. Responsive Design

- Usa breakpoint M3 per layout adattivi
- Testa su dispositivi mobili e desktop
- Considera touch targets di almeno 44px

## Struttura dei File

```
src/
├── design-system/
│   ├── m3-interactive.css    # Token interattivi M3
│   ├── motion.css           # Animazioni M3
│   └── legacyStyles.css     # Stili legacy (da rimuovere)
├── components/ui/
│   ├── M3Button.tsx         # Componenti M3
│   ├── M3Card.tsx
│   └── ...
└── styles/
    └── m3-interactive.css   # Stili aggiuntivi M3
```

## Testing M3

### Test di Regressione

- Esegui `npm test __tests__/m3-regression.test.ts` per verificare token
- Controlla che tutti i 28 token siano applicati

### Test di Accessibilità

- Esegui `npm test __tests__/m3-accessibility.test.ts` per controlli WCAG
- Verifica componenti con axe-core

### Test Visivi

- Usa Storybook per test visivi dei componenti M3
- Confronta snapshot prima/dopo migrazione

## Troubleshooting

### Token non applicati

1. Verifica che il token sia definito in `theme.css`
2. Controlla che il componente importi correttamente i CSS
3. Usa DevTools per ispezionare valori CSS

### Problemi di contrasto

1. Usa sempre coppie colore-on-colore M3
2. Testa con strumenti di contrasto online
3. Segui le specifiche M3 per combinazioni di colore

### Performance

1. Evita overuse di `var()` in animazioni
2. Usa CSS custom properties per temi dinamici
3. Monitora bundle size con Webpack Analyzer

## Roadmap Futuro

- [ ] Implementare componenti M3 mancanti (Badge, Tooltip, FAB)
- [ ] Aggiungere motion system completo
- [ ] Migliorare supporto temi scuri
- [ ] Ottimizzare performance caricamento CSS

## Risorse

- [Material Design 3 Guidelines](https://material.io/design)
- [M3 Design Tokens](https://github.com/material-components/material-design-tokens)
- [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)

---

**Ultimo aggiornamento**: 10 gennaio 2026
**Versione M3**: Completata
**Responsabile**: Team DocenteDoc AI
