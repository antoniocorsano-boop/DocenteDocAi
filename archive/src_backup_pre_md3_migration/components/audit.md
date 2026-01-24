Analizza tutti i file JSX/TSX in src/components e src/pages e individua tutti i componenti che definiscono stili visivi inline o className legacy (bg, border, border-radius, box-shadow) che possono causare incoerenza visiva. Per ciascun componente, crea un oggetto con:

- file: percorso completo del file
- componente: nome del componente
- pattern: descrizione breve dello stile inline/className
- suggerimento: quale nuovo componente base M3*Card usare (M3SurfaceCard, M3HeroCard, M3SuggestionCard, M3ActivityItem, M3EmptyStateCard)
- props aggiuntive necessarie: eventuali props per replicare effetti personalizzati (hover, glass, tonalità, opacity)

Salva tutta l’analisi in un file JSON (o Markdown) chiamato src/docs/legacy-component-audit.json con struttura document-driven:

[
  {
    "file": "src/pages/Home.tsx",
    "componente": "HeroCard",
    "pattern": "bg-glass, rounded-[calc(56px * var(--sys-radius-multiplier))], shadow-[var(--md-sys-elevation-level2)]",
    "suggerimento": "M3HeroCard",
    "props": { "glassEffect": true }
  },
  ...
]

Fornisci anche un riepilogo con il numero totale di componenti da aggiornare, e raggruppali per tipo di base component target. Mantieni TypeScript types e commenti JSDoc dove possibile. 
