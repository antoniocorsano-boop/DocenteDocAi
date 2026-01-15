# MD3 Hybrid Components Migration Plan

| Nome componente | Tipo di violazioni | Azioni consigliate | Priorità | Note |
|------------------|---------------------|---------------------|----------|------|
| src\components\accessibility\SkipLink | className (1) | Rimuovere il className e sostituirlo con style inline utilizzando token MD3 per padding, colori e altri stili. Verificare l'accessibilità dopo la migrazione. | Media | Componente di accessibilità; priorità media per garantire compliance senza rompere funzionalità. |
| src\components\AddEvaluationModal | Runtime mutation (1) | Evitare mutazioni runtime dello stile; utilizzare stati React gestiti per aggiornamenti dinamici e applicare token MD3 staticamente. | Alta | Runtime mutations possono causare problemi di performance; priorità alta per componenti modali critici. |
| src\components\AssistantDevTools | className (2) | Sostituire tutti i className con style inline usando token MD3 per colori, spacing e tipografia. | Media | Componente di sviluppo; priorità media. |
| src\components\AuraView | className (1) | Rimuovere className e applicare stili MD3 inline per bordi, sfondi e animazioni. | Bassa | Componente visuale semplice; priorità bassa. |
| src\components\charts\AdvancedCharts | className (3), Hardcoded (1) | Sostituire className con style MD3 e hardcoded values con token MD3 per dimensioni e colori. | Alta | Componente di charting; priorità alta per consistenza visiva. |
| src\components\DemoGantt | className (4) | Migrare tutti i className a style inline con token MD3 per layout e colori. | Media | Componente demo; priorità media. |
| src\components\DocumentGeneratorModal | className (1) | Sostituire className con style MD3 per pulsanti e layout. | Media | Modale; priorità media. |
| src\components\DraggableFab | Runtime mutation (2), className (1) | Eliminare mutazioni runtime e usare stati React; sostituire className con style MD3. | Alta | FAB interattivo; runtime mutations critici, priorità alta. |
| src\components\GanttBar | className (2) | Applicare style inline MD3 per barre e colori. | Bassa | Componente semplice; priorità bassa. |
| src\components\GlobalFab | Runtime mutation (2), className (2) | Gestire stati senza mutazioni runtime; migrare className a MD3. | Alta | FAB globale; priorità alta per interazioni. |
| src\components\Home.integration.test | CSS vars (1) | Verificare e sostituire CSS vars con token MD3 completi se necessario. | Bassa | File di test; priorità bassa. |
| src\components\Home.test | CSS vars (1) | Verificare e sostituire CSS vars con token MD3 completi se necessario. | Bassa | File di test; priorità bassa. |
| src\components\LiveAssistantModal | CSS vars (1), className (1) | Sostituire className e verificare CSS vars per compliance MD3. | Media | Modale assistente; priorità media. |
| src\components\M3RatingBar | CSS vars (1) | Assicurare che CSS vars siano token MD3 validi. | Bassa | Componente rating; priorità bassa. |
| src\components\ManualSection | CSS vars (1), Hardcoded (2) | Sostituire hardcoded con token MD3 e verificare CSS vars. | Media | Sezione manuale; priorità media. |
| src\components\PinPad | Hardcoded (1) | Sostituire valori hardcoded con token MD3 per pulsanti e layout. | Bassa | Componente input; priorità bassa. |
| src\components\QuizSkeleton | CSS vars (2), Hardcoded (2) | Migrare hardcoded e verificare CSS vars per scheletri. | Media | Skeleton loader; priorità media. |
| src\components\TabGroup | Hardcoded (3) | Sostituire tutti valori hardcoded con token MD3 per tabs. | Media | Gruppo tabs; priorità media. |
| src\components\UniversalModalDemo | CSS vars (1), className (2) | Sostituire className e verificare CSS vars. | Media | Demo modale; priorità media. |
| src\components\ui\ActionTile.stories | Hardcoded (3) | Sostituire hardcoded values con token MD3 in stories. | Bassa | File stories; priorità bassa. |
| src\components\ui\Avatar.stories | Hardcoded (2) | Applicare token MD3 per avatar in stories. | Bassa | File stories; priorità bassa. |
| src\components\ui\CategoryCard | Hardcoded (4) | Sostituire valori hardcoded con token MD3 per carte categorie. | Media | Componente UI; priorità media. |
| src\components\ui\EmptyState | Hardcoded (1) | Sostituire hardcoded con token MD3 per stati vuoti. | Bassa | Componente semplice; priorità bassa. |
| src\components\ui\M3BadgedIcon | Hardcoded (1) | Applicare token MD3 per icone con badge. | Bassa | Icona; priorità bassa. |
| src\components\ui\M3Card | Hardcoded (1) | Sostituire hardcoded con token MD3 per carte. | Bassa | Carta base; priorità bassa. |
| src\components\ui\M3ChoiceCard.stories | Hardcoded (1) | Sostituire in stories con token MD3. | Bassa | File stories; priorità bassa. |
| src\components\ui\M3Dialog | Hardcoded (1) | Applicare token MD3 per dialoghi. | Bassa | Dialogo; priorità bassa. |
| src\components\ui\M3ExpressiveCard.stories | CSS vars (1), Hardcoded (2) | Verificare CSS vars e sostituire hardcoded in stories. | Bassa | File stories; priorità bassa. |
| src\components\ui\M3HeroCard | className (1) | Sostituire className con style MD3. | Bassa | Carta hero; priorità bassa. |
| src\components\ui\M3IconButton | Hardcoded (1) | Sostituire hardcoded con token MD3 per pulsanti icona. | Bassa | Pulsante; priorità bassa. |
| src\components\ui\M3Menu.test | CSS vars (1), Hardcoded (2) | Verificare CSS vars e sostituire hardcoded in test. | Bassa | File test; priorità bassa. |
| src\components\ui\M3RatingBar.stories | CSS vars (1), Hardcoded (1) | Applicare token MD3 in stories. | Bassa | File stories; priorità bassa. |
| src\components\ui\PinPad | Hardcoded (1) | Sostituire hardcoded con token MD3. | Bassa | PinPad UI; priorità bassa. |
| src\components\ui\QuizSkeleton | CSS vars (2), Hardcoded (2) | Migrare come sopra per skeleton quiz. | Media | Skeleton; priorità media. |
| src\components\ui\TabGroup | Hardcoded (3) | Sostituire hardcoded con token MD3. | Media | TabGroup UI; priorità media. |
| src\components\ui\UseCaseCard.stories | Hardcoded (1) | Sostituire in stories. | Bassa | File stories; priorità bassa. |
| src\components\nka\NKAHeaderAuraButton | className (3) | Sostituire className con style MD3 per pulsanti aura. | Media | Pulsante header; priorità media. |
| src\components\nka\NKASettingsToggle | className (4) | Migrare className a MD3 per toggle impostazioni. | Media | Toggle; priorità media. |
| src\components\ui\M3Menu.test | CSS vars (1), Hardcoded (2) | Verificare e sostituire in test. | Bassa | File test; priorità bassa. |