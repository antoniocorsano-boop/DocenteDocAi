File target: [INSERISCI IL NOME DEL FILE, es. Header.tsx]

Contesto: Il file è parte dell'app DocenteDoc AI e deve rispettare il "MD3 Governance & Compliance Contract". L'obiettivo è ottenere MD3 Gold Compliance: layout, container visivi, tipografia, spacing, elevation, componenti interattivi e fallback visivi devono usare **solo componenti MD3 o wrapper MD3** (AppLayout, M3Surface, M3Card, M3Typography, M3Button, M3FAB, ecc.) e **token MD3**.

Istruzioni per la rifattorizzazione:

1. Sostituire tutti i container visivi (<div>, <section>, <li>, ecc.) con wrapper MD3 equivalenti (M3Surface, M3Card, AppLayout).
2. Tutti i testi significativi devono usare M3Typography; rimuovere ogni fontSize, fontWeight, fontFamily inline.
3. Rimuovere stili inline che rappresentano padding, margin, gap, background o elevation; usare solo token MD3 tramite componenti.
4. Tutti i bottoni e componenti interattivi devono essere MD3 (M3Button, M3FAB, IconButton, ecc.) con aria-label chiari. Icone decorative: aria-hidden.
5. Elevation e zIndex devono essere centralizzati tramite provider MD3; rimuovere box-shadow inline o valori hardcoded.
6. Fallback visivi, loader, empty state, errori devono usare componenti MD3 dedicati.
7. Non modificare logica applicativa, routing, o dati; solo layout, container e styling.
8. Commentare eventuali eccezioni documentate (es. FAB floating) con riferimento alla policy.
9. Eliminare righe vuote superflue o codice non necessario.
10. Output finale: file completo pronto per compilazione, MD3 Gold compliant, con commenti sulle eccezioni se presenti.

Risultato atteso: Un file React TypeScript **MD3 Gold compliant**, senza modifiche logiche, pronto per integrazione.
