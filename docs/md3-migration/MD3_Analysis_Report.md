# REPORT INTERMEDIO - ANALISI INCOERENZE MD3

## RISULTATI SCANSIONE INIZIALE

### COLORI HARDCODED
- **src/utils/colorUtils.ts**: Colori hex per palette avatar (documentata eccezione design system)
- **src/layout.css**: rgba per ombre (box-shadow) e sfondi overlay (es. rgba(0, 0, 0, 0.2))

### FONT-SIZE HARDCODED
- **src/components/Menu.css**: font-size: 28px; font-size: 10px;
- **src/components/navigation-rail.css**: font-size: 10px;
- **src/components/TestPreviewModal.tsx**: font-size: 0.9em; (in style inline)

### BORDER-RADIUS HARDCODED
- **src/styles/m3-interactive.css**: border-radius: 50%;
- **src/theme.css**: border-radius: 100px;
- **src/nka/nka.css**: border-radius: 50%; border-radius: 999px;

## CLASSIFICAZIONE INCOERENZE

### BLOCCANTI (Correggere subito)
- Font-size hardcoded in componenti (Menu.css, navigation-rail.css): violano gerarchia tipografica MD3
- Border-radius hardcoded non standard (100px, 999px): dovrebbero usare token MD3
- Rgba hardcoded per sfondi overlay in layout.css: sostituire con token MD3 o variabili

### ALTO IMPATTO VISIVO
- Box-shadow rgba hardcoded: uniformare a elevation MD3
- Border-radius 50% per avatar/circle: ok se usato per forme circolari, ma verificare consistenza

### MINORI
- Inline style in TestPreviewModal.tsx: probabilmente per generazione HTML dinamica, valutare se necessario

### LEGACY (Lasciare invariato)
- Palette avatar in colorUtils.ts: eccezione documentata e giustificata per accessibilità

## PROSSIMI PASSI
- Correggere incoerenze bloccanti sostituendo con token MD3
- Verificare build e lint dopo ogni modifica
- Aggiornare questo report con progressi

Data: 22 gennaio 2026