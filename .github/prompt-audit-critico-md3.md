# Prompt di Audit Critico MD3

Agisci come auditor senior MD3. Analizza il file [NOME_FILE] senza modificarlo.
Produci un audit critico document-driven per MD3 Gold Compliance, includendo:

1. Conformità generale (MD3 Gold compliant / Approvato con riserve / Non conforme)
2. Violazioni rilevate, con descrizione e motivazione
3. Suggerimenti minimi per compliance completa
4. Checklist operativa per portare il componente a 100% MD3 Gold

Controlla:

- Container visivi: solo M3Surface, AppLayout, M3Card o wrapper MD3; vietato <div>, <section>, <li> usati come layout o surface
- Tipografia: tutti i testi significativi devono usare M3Typography; vietato fontSize/fontWeight/fontFamily inline
- Spacing/Layout/Responsive: padding, margin, gap devono essere gestiti via componenti MD3 o utility centralizzate; vietato style inline o breakpoint ad-hoc
- Elevation/Z-Index: solo tramite provider MD3; vietato box-shadow o border-radius manuali
- Componenti interattivi e accessibilità: Button/IconButton/FAB/icone devono essere MD3; ogni elemento interattivo deve avere aria-label univoco; icone decorative aria-hidden
- Errori/Loader/Stati transitori: usare solo componenti MD3 dedicati; vietato fallback <div> stilizzati

Nessuna assunzione superficiale. Nessuna modifica eseguita. Documenta chiaramente eventuali eccezioni.
