/*
=== COPILOT INSTRUCTIONS – MD3 GUARDRAILS ===

Usa queste regole e checklist per qualsiasi operazione su componenti UI:

1️⃣ Obiettivo:
- Creare o migrare componenti secondo Material Design 3 puro (MD3).
- Usare solo token MD3 centralizzati (colors, typography, spacing, motion, elevation, shape).
- Rimuovere CSS custom e valori hardcoded.
- Usare componenti base M3Components (M3Button, M3Card, M3Dialog, M3TextField, M3ListItem, ecc.).
- Tailwind SOLO per layout/flex/grid/breakpoints, mai per colori, tipografia, spacing o shadow.

2️⃣ Typography:
- Variants MD3 obbligatori:
  - Titoli: label-large / headline-small
  - Sottotitoli: body-small
  - Testo input: body-large
  - Badge/error: body-small o label-small
- Mantieni gerarchia visiva e leggibilità.

3️⃣ Spacing & Layout:
- Usare solo spacing tokens (spacing['1'] … spacing['10'])
- Container, gap, padding/margin devono derivare da token
- Responsive con breakpoints MD3

4️⃣ Colors & Shapes:
- Background, borders, elevation: solo token MD3
- Icone: usare primary/on-primary, on-surface, error
- Corner-radius: corner-medium, corner-full, ecc.

5️⃣ Motion & Feedback:
- Easing curves e duration MD3
- Hover/focus/active devono rispettare token
- Micro-interazioni basate su motion tokens

6️⃣ Accessibility:
- ARIA labels obbligatorie
- Focus indicator visibili
- Keyboard navigation completa
- Touch targets >= 44px
- Error messages accessibili

7️⃣ Migrazione Componenti Legacy:
- Analizza struttura e props
- Mantieni API compatibile se possibile
- Sostituisci CSS custom con token MD3
- Sostituisci Tailwind non consentito con token MD3
- Documenta breaking changes

8️⃣ Template Operativo (da seguire per ogni componente):
- Analizza componente attuale
- Identifica props principali e opzionali
- Sostituisci tipografia con M3Typography + variant corretto
- Sostituisci layout e spacing con token MD3
- Sostituisci colori e elevation con token MD3
- Rimuovi CSS custom / Tailwind non consentito
- Mantieni API e accessibility
- Test TypeScript e compilazione
- Documenta cambiamenti / breaking changes
- Segnala ambiguità o decisioni aperte

9️⃣ Output richiesto:
- Componente MD3 puro
- Accessibile (ARIA + focus + keyboard)
- Token-based (no hardcoded)
- API compatibile
- Documentazione interna dei cambiamenti

ESEMPIO DI USO:
@copilot Use these MD3 guardrails to migrate TextField, SelectField, SectionHeader, TabGroup or any new component.
*/

