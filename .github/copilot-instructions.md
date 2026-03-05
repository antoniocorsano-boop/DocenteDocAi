# Copilot Instructions — DocenteDoc AI

## Contesto del Progetto

Questa è un'app React con Material Design 3 (MD3). Ogni modifica UI deve rispettare integralmente il contratto MD3 Governance & Compliance riportato di seguito.

## Regole di Comportamento per Copilot/Claude

- Prima di ogni modifica UI, verifica la conformità MD3 del file target.
- Ogni fix deve essere atomico: una violazione alla volta, un file alla volta.
- Non introdurre mai dipendenze di stile non tracciate a token MD3.
- Dopo ogni modifica, elenca esplicitamente le violazioni corrette e quelle ancora aperte.
- Aggiorna `MD3_AUDIT.md` dopo ogni sessione di lavoro.
- Se una correzione richiede un'eccezione al contratto, segnalala esplicitamente e non procedere senza approvazione.

---

## MD3 Governance & Compliance Contract

### 1. Scope e Autorità

- Material Design 3 (MD3) è l'unica fonte normativa per la progettazione visiva, semantica e accessibile dell'app DocenteDoc AI.
- Il presente documento è vincolante per ogni sviluppo, revisione, refactor e automazione.
- Ogni violazione è da considerarsi bug bloccante e deve essere corretta senza eccezioni.

### 2. Principi Non Negoziabili

- È obbligatoria la separazione tra logica applicativa e semantica visiva.
- L'uso di token MD3 non costituisce conformità se la struttura o il significato non sono MD3.
- È vietato ogni layout basato su `<div>` generici per scopi visivi o semantici.
- È vietato ogni override locale di stile non documentato e non tracciato.

### 3. Regole sui Container Visivi

- È obbligatorio l'uso esclusivo di `M3Surface`, `AppLayout` o wrapper MD3 per ogni container visivo.
- È vietato l'uso di `<div>` per shell, card, banner, layout, surface o contenitori di stato.
- Padding, background ed elevation devono essere gestiti solo tramite componenti MD3 e relativi token.
- Ogni eccezione (es. FAB, overlay) deve essere esplicitamente documentata e approvata.

### 4. Tipografia e Gerarchia

- È obbligatorio l'uso di `M3Typography` per ogni testo significativo.
- È vietato l'uso di `fontSize`, `fontWeight` o proprietà tipografiche inline su testo semantico.
- La gerarchia tipografica deve riflettere i livelli MD3 senza eccezioni.

### 5. Spacing, Layout e Responsive

- È obbligatorio l'uso esclusivo di token MD3 per ogni spacing, margin, padding, gap.
- È vietato ogni spacing arbitrario, hardcoded o non tracciato a token MD3.
- La gestione responsive è consentita solo tramite layout MD3 o utilità centralizzate approvate.
- È vietato l'uso di breakpoint, media query o logica responsive "ad hoc".

### 6. Elevation, Z-Index e Surface

- L'elevation è consentita solo se semanticamente necessaria secondo MD3.
- È vietato l'uso di `box-shadow` manuali o custom elevation.
- Z-Index ed elevation devono essere centralizzati e gestiti tramite provider MD3.

### 7. Componenti Interattivi e Accessibilità

- Button, IconButton, FAB e ogni componente interattivo devono essere MD3 o wrapper MD3.
- Ogni elemento interattivo deve avere `aria-label` esplicito e univoco.
- L'ordine di focus, tab order e navigazione da tastiera devono essere garantiti.
- Le icone decorative devono essere `aria-hidden`; le icone interattive devono essere accessibili.

### 8. Errori, Loader e Stati Transitori

- È obbligatorio l'uso di componenti MD3 dedicati per errori, loader, warning, info e stati transitori.
- È vietato ogni fallback visivo basato su `<div>` stilizzati o container generici.

### 9. Eccezioni Consentite

- Sono consentite solo le eccezioni esplicitamente elencate e documentate in questo documento.
- Ogni eccezione deve essere motivata, tracciata e approvata dal Design System Architect.

### 10. Processo di Verifica

- Ogni modifica deve essere verificata tramite checklist di conformità MD3.
- Ogni violazione comporta il rifiuto automatico in code review.
- L'assenza di violazioni automatiche non implica conformità se la semantica MD3 non è rispettata.

### 11. Dichiarazione Finale di Compliance

- "MD3 Gold Compliant" significa aderenza totale, strutturale e semantica a tutte le regole di questo documento.
- La responsabilità della compliance è condivisa da tutto il team di sviluppo, revisione e governance.
