# MD3_LAYOUT_CONTRACT.md

## Contratto vincolante di layout — Material Design 3 (MD3) Gold Compliance

---

### 1. Struttura dei ruoli

- **App.tsx**: esclusivamente shell root e surface MD3. Nessuna responsabilità di layout verticale, larghezza, padding, o min-height.
- **AppLayout.md3.tsx**: unico responsabile di:
  - min-height del layout
  - gestione verticale della pagina
  - max-width del contenuto
  - padding orizzontale e verticale principali
- **ViewManager**: gestisce solo il routing/stack delle view. Nessuna responsabilità di layout root.
- **View**: non deve mai comportarsi da layout root. Vietato impostare minHeight, maxWidth, padding globale.

---

### 2. Regole vincolanti

- Vietato avere più di un componente che imposta `minHeight: 100vh`.
- Vietato impostare `maxWidth` al di fuori di AppLayout.md3.tsx.
- Vietato introdurre container annidati con responsabilità di layout sovrapposte.
- Vietato usare valori hardcoded (`px`, `rem`, `%`, `vh`, `vw`, `hex`, `rgba`).
- Consentiti solo token MD3 (`var(--md-sys-*)`).

---

### 3. Regole per fullWidth (AuraView)

- `fullWidth` può essere usato **solo** quando il parent:
  - non impone `maxWidth`
  - non introduce overflow orizzontale
- Usare `fullWidth` in modo consapevole e documentato.
- Segnalare i rischi di overflow se usato in contesti errati (aggiungere TODO commentato).

---

### 4. Pattern consentiti / vietati

**Pattern consentiti:**

- App.tsx → AppLayout.md3.tsx → ViewManager → View
- AppLayout.md3.tsx imposta minHeight, maxWidth, padding. Nessun altro componente impone questi stili.
- AuraView con `fullWidth` solo se il parent non impone limiti di larghezza.

**Anti-pattern vietati:**

- Doppio layout root: App.tsx e AppLayout.md3.tsx entrambi con minHeight/maxWidth/padding.
- Padding duplicato: container annidati con padding orizzontale/verticale sovrapposto.
- View che imposta minHeight: 100vh o maxWidth.
- Uso di valori hardcoded per layout.

---

### 5. Obiettivo

- Prevenire doppio scroll.
- Prevenire layout instabile.
- Garantire coerenza MD3 Gold nel tempo.

---

**Questo documento è vincolante. Ogni violazione è da considerarsi bug bloccante.**
