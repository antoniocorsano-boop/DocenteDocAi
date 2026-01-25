MD3 Governance & Compliance Contract

1. Scope e Autorità

- Material Design 3 (MD3) è l’unica fonte normativa per la progettazione visiva, semantica e accessibile dell’app DocenteDoc AI.
- Il presente documento è vincolante per ogni sviluppo, revisione, refactor e automazione.
- Ogni violazione delle regole qui definite è da considerarsi bug bloccante e deve essere corretta senza eccezioni.

2. Principi Non Negoziabili

- È obbligatoria la separazione tra logica applicativa e semantica visiva.
- L’uso di token MD3 non costituisce conformità se la struttura o il significato non sono MD3.
- È vietato ogni layout basato su <div> generici per scopi visivi o semantici.
- È vietato ogni override locale di stile non documentato e non tracciato.

3. Regole sui Container Visivi

- È obbligatorio l’uso esclusivo di M3Surface, AppLayout o wrapper MD3 per ogni container visivo.
- È vietato l’uso di <div> per shell, card, banner, layout, surface o contenitori di stato.
- Padding, background ed elevation devono essere gestiti solo tramite componenti MD3 e relativi token.
- Ogni eccezione (es. FAB, overlay) deve essere esplicitamente documentata e approvata.

4. Tipografia e Gerarchia

- È obbligatorio l’uso di M3Typography per ogni testo significativo, inclusi titoli, body, label, helper.
- È vietato l’uso di fontSize, fontWeight o proprietà tipografiche inline su testo semantico.
- La gerarchia tipografica deve riflettere i livelli MD3 senza eccezioni.

5. Spacing, Layout e Responsive

- È obbligatorio l’uso esclusivo di token MD3 per ogni spacing, margin, padding, gap.
- È vietato ogni spacing arbitrario, hardcoded o non tracciato a token MD3.
- La gestione responsive è consentita solo tramite layout MD3 o utilità centralizzate approvate.
- È vietato l’uso di breakpoint, media query o logica responsive “ad hoc”.

6. Elevation, Z-Index e Surface

- L’elevation è consentita solo se semanticamente necessaria secondo MD3.
- È vietato l’uso di box-shadow manuali o custom elevation.
- Z-Index ed elevation devono essere centralizzati e gestiti tramite provider MD3.
- Ogni uso di elevation o decorazione deve essere chiaramente motivato e tracciato.

7. Componenti Interattivi e Accessibilità

- Button, IconButton, FAB e ogni componente interattivo devono essere MD3 o wrapper MD3.
- Ogni elemento interattivo deve avere aria-label esplicito e univoco.
- L’ordine di focus, il tab order e la navigazione da tastiera devono essere garantiti e verificabili.
- Le icone decorative devono essere aria-hidden; le icone interattive devono essere accessibili.

8. Errori, Loader e Stati Transitori

- È obbligatorio l’uso di componenti MD3 dedicati per errori, loader, warning, info e stati transitori.
- È vietato ogni fallback visivo basato su <div> stilizzati o container generici.
- La semantica di error, warning, info deve essere rispettata tramite componenti MD3.

9. Eccezioni Consentite

- Sono consentite solo le eccezioni esplicitamente elencate e documentate in questo documento.
- Ogni eccezione deve essere motivata, tracciata e approvata dal Design System Architect.
- Nessuna eccezione costituisce precedente o “scuola” per sviluppi futuri.

10. Processo di Verifica

- Ogni modifica deve essere verificata tramite checklist di conformità MD3.
- Ogni violazione comporta il rifiuto automatico in code review.
- L’assenza di violazioni automatiche non implica conformità se la semantica MD3 non è rispettata.
- Copilot, automazioni e refactor devono rispettare integralmente il presente contratto.

11. Dichiarazione Finale di Compliance

- “MD3 Gold Compliant” significa aderenza totale, strutturale e semantica a tutte le regole di questo documento.
- Lo status di compliance è mantenuto solo se ogni modifica futura rispetta integralmente il contratto.
- La responsabilità della compliance è condivisa da tutto il team di sviluppo, revisione e governance.
