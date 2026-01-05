# Piano di Rifacimento del Presentation Layer - DocenteDoc AI

## Obiettivo
Centralizzare e rendere pervasiva la gestione degli stili attraverso il Design System, eliminando stili inline, valori hardcoded e frammentazione visiva.

## Fasi Operative

### Fase 1: Foundation & Tokenization (Settimana 1)
- [x] **Consolidamento AppThemeState**: Estendere l'interfaccia in `src/types.ts` per includere `fontScale`, `contrastLevel` e parametri di glassmorphism.
- [x] **Potenziamento applyTheme**: Aggiornare la logica in `src/design-system/index.ts` per gestire dinamicamente tutti i nuovi token.
- [x] **Mappatura Variabili CSS**: Verificare che ogni proprietà del design system sia mappata a una variabile `--sys-*`.

### Fase 2: App Shell Refactoring (Settimana 1-2)
- [x] **Header & Navigation**: Rimuovere stili inline da `Header.tsx` e `NavigationRail.tsx`.
- [x] **ViewManager**: Assicurarsi che tutte le transizioni e i layout di base utilizzino esclusivamente token CSS.
- [x] **AuraView**: Ottimizzare il wrapper per supportare i diversi `visualStyle` (aura, flat, minimal, etc.).

### Fase 3: Standardizzazione Componenti Atomici e Modali (Settimana 2)
- [x] **Z-Index & Breakpoints**: Sostituire valori numerici con costanti da `src/design-system/zIndex.ts` e `breakpoints.css`.
- [ ] **Tipografia M3**: Migrare tutti i testi alle classi `.m3-headline-*`, `.m3-body-*`, etc. (In corso: icone e label standardizzate)
- [x] **Modali**: Refactoring di `AssistantModal.tsx` e altri modali per conformità totale a Material 3 Expressive.

### Fase 4: Cleanup Globale e Validazione (Settimana 3)
- [ ] **Audit Regex**: Ricerca globale di `#`, `rgb`, `px` hardcoded e `style={{`.
- [ ] **Accessibilità**: Verifica contrasto WCAG 2.1 AA su tutti i temi generati.
- [ ] **Test di Regressione**: Verifica del corretto funzionamento del cambio tema in tempo reale.

## Linee Guida per lo Sviluppo
1. **No Inline Styles**: Usare classi CSS o variabili CSS nel file `.css` associato.
2. **Token First**: Se un valore non è nel design system, aggiungerlo ai token prima di usarlo.
3. **Responsive**: Usare sempre i breakpoint centralizzati.
4. **Type Safety**: Mantenere aggiornate le interfacce in `src/types.ts`.
