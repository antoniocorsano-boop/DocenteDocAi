# M3_MIGRATION_CHECKLIST.md

## Material 3 Expressive Migration Checklist for DocenteDoc

**1. Reference Standard**

- [ ] Consulta sempre M3_HOME_REF.md prima di modificare o creare nuove viste.
- [ ] Tutte le regole di spacing, colore, tipografia, CTA e anti-pattern devono essere rispettate.

**2. Stili e Token**

- [ ] Usa solo token M3 (`var(--md-sys-*)`) per spacing, colori, shape, elevation.
- [ ] Usa utility classi M3 (`m3-p-*`, `m3-m-*`, ecc.) dove possibile.
- [ ] Sposta gli style inline ricorrenti in costanti locali o utilities.
- [ ] Vietato px, rem, %, colori raw, font custom.

**3. Tipografia**

- [ ] Solo M3Typography o classi m3-headline-_, m3-body-_, m3-label-\*.
- [ ] Niente uppercase decorativo o font-weight custom.

**4. Card, Surface, Container**

- [ ] Solo shadow-elevation-1/2 e surface tokens.
- [ ] Niente bordi/ombre custom o decorazioni extra.

**5. CTA Hierarchy**

- [ ] Una sola primary CTA per viewport (M3Button filled).
- [ ] Tutti gli altri bottoni sono secondary/outline/text e non competono visivamente.

**6. Icone**

- [ ] Solo Material Symbols Outlined, solo dove funzionali.

**7. Motion**

- [ ] Solo transizioni funzionali (hover, focus), nessuna animazione decorativa.

**8. Accessibilità**

- [ ] Mantieni aria-label e struttura semantica.

**9. Pulizia e Manutenzione**

- [ ] Rimuovi import, props, variabili e codice morto/non usato.
- [ ] Ordina il file per sezioni logiche.

**10. Validazione**

- [ ] Nessun errore/warning di compilazione, linting o tipizzazione.
- [ ] PR review: confronta sempre con M3_HOME_REF.md.

---

> Usa questa checklist per ogni refactor o nuova feature. Solo se tutte le caselle sono spuntate la vista è pronta per DocenteDoc.
