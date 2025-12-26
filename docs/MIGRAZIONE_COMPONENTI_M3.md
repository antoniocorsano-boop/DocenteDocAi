## Riepilogo Migrazione M3 (Dicembre 2025)

La migrazione dei pulsanti legacy ai componenti Material Design 3 è stata completata seguendo la checklist ingegnerizzata:

- Analisi e mappatura pattern legacy
- Definizione componenti M3 standard
- Stima effort e priorità per file
- Checklist di refactoring per ogni file
- Automatizzazione con codemod/script
- Refactoring manuale dove necessario
- Aggiornamento e verifica test
- Verifica accessibilità e responsive
- Aggiornamento documentazione e comunicazione novità

### Stato checklist (Dicembre 2025)

| Step | Stato |
|------|-------|
| Analizza pattern legacy | ✅ |
| Definisci componenti M3 | ✅ |
| Mappa file/pattern | ✅ |
| Stima effort/priorità | ✅ |
| Checklist refactoring | ✅ |
| Automatizza sostituzione | ✅ |
| Refactoring manuale | ✅ |
| Aggiorna test | ✅ |
| Verifica accessibilità/responsive | ✅ |
| Aggiorna documentazione/checklist | ✅ |

---

## Comunicazione Novità e Aggiornamento Modali Workflow

- Aggiorna la sezione "Guida e Novità" dell’app per informare gli utenti:
	- Tutti i pulsanti ora seguono Material Design 3
	- Migliorata accessibilità, responsive e coerenza visiva
	- Nuove varianti: filled, tonal, outlined, icon, segmented
	- Focus visibile, aria-label obbligatorio, test aggiornati
- Aggiorna il modale dei workflow per riflettere:
	- Nuovi pattern di interazione con pulsanti M3
	- Esempi di utilizzo e best practice
	- Link alla guida aggiornata

---

## Prossimi Step

- Monitoraggio feedback utenti
- Ottimizzazione UI/UX su base reale
- Aggiornamento continuo della documentazione
## Checklist di refactoring per file prioritari

Esegui i seguenti step per ogni file elencato (adatta se necessario):

### Esempio: `Settings.tsx`
- [ ] Individua tutti i `<button>` e pattern legacy (`button-filled`, `button-text`, `icon-button`, ...)
- [ ] Sostituisci con `<M3Button />`, `<M3IconButton />` o `<M3SegmentedButton />` secondo le linee guida
- [ ] Aggiorna le props (`variant`, `color`, `aria-label`, ecc.)
- [ ] Rimuovi classi CSS legacy non più necessarie
- [ ] Verifica che la logica (onClick, disabled, ecc.) sia mantenuta
- [ ] Aggiorna/aggiungi test relativi ai pulsanti
- [ ] Verifica accessibilità (focus, aria-label, contrasto)
- [ ] Controlla responsive e layout

Ripeti la checklist per ogni file prioritario:

| File                        | Pattern legacy rilevati                        | Effort | Priorità |
|-----------------------------|-----------------------------------------------|--------|----------|
| Settings.tsx                | button, button-filled, button-text, ...        | MEDIO  | ALTA     |
| SmartDocumentEditor.tsx     | icon-button, button-tonal, button-filled, ...  | MEDIO  | ALTA     |
| StudentLoginScreen.tsx      | button, button-filled, button-text, ...        | BASSO  | ALTA     |
| StudentManager.tsx          | button, button-filled, button-tonal, ...       | MEDIO  | ALTA     |
| StudentProfile.tsx          | icon-button, button-tonal, button-filled       | BASSO  | ALTA     |
| ...                         | ...                                           | ...    | ...      |

Per file a priorità MEDIA/BASSA, applica la stessa checklist adattando effort e urgenza.
# Guida Migrazione Componenti Custom a Material Design 3 (M3)

Questa guida aiuta a migrare componenti React custom DocenteDoc AI agli standard Material Design 3 (Expressive/Web).


## 1. Aggiorna Design Tokens

## Componenti M3 standard da usare

Per la sostituzione sistematica dei pattern legacy, utilizzare esclusivamente i seguenti componenti M3 customizzati e le relative linee guida:

### 1. M3Button
- **Uso:** Sostituisce tutti i `<button>` con classi legacy `button button-filled`, `button button-text`, `button button-tonal`, ecc.
- **Props principali:**
	- `variant`: "filled" | "tonal" | "outlined" | "text"
	- `color`: "primary" | "secondary" | "error" | "surface"
	- `disabled`, `onClick`, `children`
- **Esempio:**
	```tsx
	<M3Button variant="filled" color="primary" onClick={...}>Salva</M3Button>
	```

### 2. M3IconButton
- **Uso:** Sostituisce `<button>` con classi `icon-button`, `button-icon`, o `<IconButton>` legacy.
- **Props principali:**
	- `icon`: ReactNode (icona da visualizzare)
	- `ariaLabel`, `onClick`, `disabled`
- **Esempio:**
	```tsx
	<M3IconButton icon={<EditIcon />} ariaLabel="Modifica" onClick={...} />
	```

### 3. M3SegmentedButton
- **Uso:** Sostituisce pattern legacy come `segmented-button`, gruppi di toggle button, ecc.
- **Props principali:**
	- `options`: array di opzioni
	- `value`, `onChange`
- **Esempio:**
	```tsx
	<M3SegmentedButton options={[...]} value={...} onChange={...} />
	```

### 4. Tooltip, Snackbar, Loader
- **Uso:** Usare i componenti M3 custom già presenti per tooltip, snackbar e loader, sostituendo pattern legacy equivalenti.

### 5. Linee guida generali
- **Non usare più classi CSS legacy per i pulsanti** (`button button-filled`, ecc.).
- **Tutti i pulsanti devono essere accessibili** (`aria-label`, focus visibile, ecc.).
- **Seguire le varianti e i colori previsti da Material 3**.
- **Aggiornare i test dopo la migrazione**.

## 2. Refactoring Componenti

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
