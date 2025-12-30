# Analisi Applicabilità Material 3 (MD3) - DocenteDoc AI

## 1. Pulsanti (Button)
- Tutti i pulsanti sono stati migrati a `M3Button` con varianti MD3 (filled, outlined, text, tonal, elevated).
- Consigliato: usare la variante più adatta per ogni azione (filled per primaria, outlined/tonal per secondarie, icon per azioni rapide, FAB per azioni flottanti).
- Possibile estensione: aggiungere componenti dedicati per IconButton, FAB, SegmentedButton.

## 2. Card
- Usare Card MD3 per visualizzare studenti, valutazioni, lezioni, documenti.
- Applicare elevation, outline e shape MD3.

## 3. Dialog
- Allineare padding, shape e bottoni secondo MD3.
- Usare bottoni text/tonal per azioni secondarie.

## 4. Text Field
- Usare varianti MD3 (filled, outlined) per tutti gli input.
- Applicare label, helper text, icon, error state.

## 5. Navigation Bar / Drawer
- Navigation Bar per mobile, Navigation Drawer per desktop/tablet.
- Implementare secondo specifiche MD3.

## 6. Top App Bar
- Usare App Bar MD3 per header principale, titolo pagina, azioni globali.

## 7. FAB (Floating Action Button)
- Usare per azioni primarie contestuali (es. “Aggiungi”).

## 8. Chip
- Usare per filtri, tag, stato (es. “BES”, “DSA”, materia).

## 9. Snackbar
- Usare per notifiche rapide (es. “Salvato”, “Errore”).

## 10. Menu, List, Segmented Button
- Menu per azioni contestuali, List per elenchi, Segmented Button per selezione multipla.

## 11. Switch, Checkbox, Radio
- Usare solo varianti MD3 per preferenze, filtri, selezioni.

## 12. Progress, Slider
- Usare per caricamenti, voti numerici, range.

---

## Tabella Orario (Orario settimanale)
- Le tabelle complesse sono difficili da rendere MD3 pura.
- Soluzione: mantenere la tabella oraria come eccezione, ma:
  - Usare colori MD3 per celle, header, bordi.
  - Usare bottoni MD3 per azioni (es. modifica, aggiungi).
  - Applicare shape e spacing coerenti dove possibile.
- Se si vuole una UX 100% MD3, valutare una visualizzazione “card per slot” o “list” invece di tabella.

---

## Sintesi
- Tutti i componenti (liste, modali, card, input, pulsanti, chip, snackbar, ecc.) devono essere MD3.
- Tabella orario può restare tabellare, ma con palette e bottoni MD3.
- Consigliato mappare ogni funzione/azione dell’app al componente MD3 più adatto.
- Aggiornare il design system per coprire tutte le varianti MD3 necessarie.
- Aggiornare i componenti custom per rispettare padding, shape, colori e interazioni MD3.

---

**Stato attuale:**
- Migrazione pulsanti completata.
- CSS legacy rimosso.
- Tutti i componenti principali sono MD3, tranne la tabella orario (eccezione giustificata).

**Prossimi passi:**
- Estendere MD3 a tutti i componenti secondari.
- Valutare refactoring della tabella orario in chiave card/list MD3 se richiesto.
