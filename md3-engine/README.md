# MD3 Migration Engine

## Uso semplice

1️⃣ Genera la lista dei file da migrare
```
node md3-engine/md3-analyzer.js
```

2️⃣ Avvia la migrazione controllata
```
node md3-engine/md3-engine.js
```

3️⃣ Quando lo script si ferma:
- apri il file indicato
- premi TAB su Copilot
- salva
- rilancia il comando

⚠️ NON correggere a mano.
Copilot solo sugli errori ESLint segnalati.
