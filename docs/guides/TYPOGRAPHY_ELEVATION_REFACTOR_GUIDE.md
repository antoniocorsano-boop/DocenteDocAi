# Typography & Elevation Refactoring Guide

## Obiettivo
Uniformare la gestione di font-size, font-weight ed elevation in tutta la codebase, eliminando valori hardcoded e preferendo token CSS custom o classi standardizzate.

---

## Typography (P7)

### Token CSS consigliati (esempi)
- `var(--md-sys-typescale-body-medium-size)`
- `var(--md-sys-typescale-title-large-weight)`

### Classi consigliate
- `.m3-body-medium` (font-size, font-weight, line-height)
- `.m3-title-large`

### Refactoring automatico
- Sostituire fontSize/fontWeight hardcoded con token CSS o classi.
- Esempio:
  ```js
  // Prima
  style={{ fontSize: '14px', fontWeight: 500 }}
  // Dopo
  className="m3-body-medium"
  // oppure
  style={{ fontSize: 'var(--md-sys-typescale-body-medium-size)', fontWeight: 'var(--md-sys-typescale-body-medium-weight)' }}
  ```

---

## Elevation (P8)

### Token CSS consigliati
- `var(--md-sys-elevation1)` ... `var(--md-sys-elevation5)`

### Classi consigliate
- `.elevation-1`, `.elevation-2`, ...

### Refactoring automatico
- Sostituire boxShadow/shadow-* hardcoded con token CSS o classi.
- Esempio:
  ```js
  // Prima
  style={{ boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
  // Dopo
  className="elevation-1"
  // oppure
  style={{ boxShadow: 'var(--md-sys-elevation1)' }}
  ```

---

## Component Documentation (P9)

- Aggiungere JSDoc a tutti i componenti principali.
- Aggiornare le storie Storybook con esempi di typography/elevation uniformi.

---

## Script base per sostituzione automatica (PowerShell)

```powershell
# typography-elevation-migration.ps1
Get-ChildItem -Recurse -Include *.tsx,*.ts | ForEach-Object {
    (Get-Content $_.FullName) -replace "fontSize: ?'?(\\d+)(px|rem)'?", "fontSize: 'var(--md-sys-typescale-body-medium-size)'" \
                              -replace "fontWeight: ?'?(400|500|700|900)'?", "fontWeight: 'var(--md-sys-typescale-body-medium-weight)'" \
                              -replace "boxShadow: ?'[^']*'", "boxShadow: 'var(--md-sys-elevation1)'" \
                              | Set-Content $_.FullName
}
```

> **Nota:** Lo script è un punto di partenza: va adattato per coprire tutte le varianti e testato su un branch separato.

---

## Prossimi passi
1. Eseguire lo script su un branch di test.
2. Completare manualmente i casi non coperti.
3. Aggiornare la documentazione componenti.
4. Verificare il build e la UI.
