# Analisi Applicabilità Foundations Material 3 (MD3)
**DocenteDoc AI**

## 1. Adaptive Design
- L’app deve essere completamente responsive (mobile-first).
- Layout e componenti si adattano a schermi piccoli, medi e grandi.
- Usa media query e breakpoint MD3.
- Elementi touch-friendly, spaziatura minima 48x48dp per azioni.

## 2. Layout
- Usa la griglia 8dp MD3 per spacing, padding e margin.
- Allinea contenuti e componenti secondo le regole di layout MD3.
- Applica layout flessibili (flexbox, grid) per adattabilità.

## 3. Environment
- Supporta modalità chiara/scura (light/dark theme).
- Rileva preferenze di sistema per il tema.
- Considera safe area (notch, status bar) su mobile.

## 4. Interaction
- Tutti i componenti interattivi (button, chip, card, ecc.) devono fornire feedback visivo MD3 (hover, focus, pressed, disabled).
- Usa state layer MD3 per overlay e feedback.
- Garantire accessibilità (focus ring, aria-label, ecc.).

## 5. Motion
- Usa animazioni e transizioni MD3 per cambi di stato, apertura/chiusura dialog, snackbar, ecc.
- Applica easing e duration MD3.
- Evita animazioni eccessive che possono disturbare l’utente.

## 6. Shape & Elevation
- Applica shape MD3 (radius, cut, rounded) a tutti i componenti.
- Usa elevation MD3 per profondità e layering.

## 7. Accessibility
- Rispetta WCAG 2.1 AA.
- Contrasto colori, focus visibile, navigazione da tastiera.
- Usa ruoli ARIA e label descrittivi.

---

## Conclusione
Tutti i componenti, layout e interazioni dell’app devono:
- Essere responsive e adattivi.
- Usare la griglia, spacing, shape, elevation e motion MD3.
- Fornire feedback visivo e accessibilità secondo le foundations MD3.

**Eccezione:**
La tabella orario può mantenere una struttura tabellare, ma deve comunque adottare palette, tipografia, shape e spacing MD3 dove possibile.
