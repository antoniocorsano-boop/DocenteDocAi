# Analisi Applicabilità Stili Material 3 (MD3)
**DocenteDoc AI**

## 1. Color System
- Usa solo token colore MD3 (`--md-sys-color-primary`, `--md-sys-color-surface`, ecc.) in tutti i componenti.
- Palette dinamica (light/dark/custom) già implementata, da estendere a tutti i layer.
- Evitare colori hardcoded; solo semantic tokens.

## 2. Typography
- Adottare la scala tipografica MD3: `display`, `headline`, `title`, `label`, `body`.
- Usare solo font, pesi e dimensioni previsti da MD3.
- Applicare classi CSS o token per ogni livello tipografico.
- Aggiornare i componenti per usare le classi tipografiche corrette.

## 3. Shape
- Usare i radius MD3: `full`, `large`, `medium`, `small`, `none`.
- Applicare shape MD3 a card, dialog, button, chip, text field, ecc.
- Definire i radius come CSS variables e usarli nei componenti.

## 4. Elevation & Shadow
- Usare solo livelli di elevation MD3 (`0`, `1`, `2`, `3`, `4`, `5`).
- Applicare elevation a card, app bar, fab, menu, dialog, ecc.
- Definire le shadow come token CSS e usarle nei componenti.

## 5. Iconography
- Usare solo icone MD3 (Material Symbols).
- Dimensioni e pesi coerenti con le linee guida MD3.
- Applicare colore e stile tramite token MD3.

## 6. Motion
- Usare animazioni e transizioni MD3 per feedback, dialog, snackbar, fab, ecc.
- Applicare easing e duration MD3 dove previsto.

## 7. Spacing & Layout
- Usare solo spacing MD3 (8dp grid, padding, margin).
- Definire spacing come token CSS e applicarli a tutti i componenti.
- Layout mobile-first, responsive.

## 8. State Layer
- Applicare overlay e feedback visivo MD3 per hover, focus, pressed, disabled.
- Usare solo i colori di stato MD3.

---

## Conclusione
Tutti i componenti e layout dell’app devono:
- Usare solo token e variabili MD3 per colori, tipografia, shape, elevation, spacing.
- Applicare le classi tipografiche e di shape MD3.
- Usare solo icone Material 3.
- Garantire feedback visivo MD3 per ogni stato interattivo.

**Eccezione:**
La tabella orario può mantenere una struttura tabellare, ma deve comunque adottare palette, tipografia, shape e spacing MD3 dove possibile.
