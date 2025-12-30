# MD3 Expressive Fix Plan - DocenteDoc AI

## Step 1: Fix prioritari (severity: high)
- Sostituisci tutti i valori non conformi di `border-radius` con il token MD3 più vicino (`var(--md-corner-*)`)
- Sostituisci tutti i valori custom di `box-shadow` con il token MD3 appropriato (`var(--md-elevation-*)`)
- Sostituisci tutti i colori hardcoded (`#888`, `#b00020`, `#2E74B5`, `#333`, `#f2f2f2`, `#f0f0f0`) con i token MD3 (`var(--sys-primary)`, `var(--sys-surface)`)

## Step 2: Fix medi (severity: medium)
- Sostituisci easing custom con `var(--md-easing-standard)`
- Correggi padding/margin non multipli di 4px

## Step 3: File da aggiornare
- src/components/AssistantFab.tsx
- src/components/AssistantModal.tsx
- src/components/ConsiglioClasse.tsx
- src/components/Dialog.tsx
- src/components/Header.test.tsx
- src/components/ImprovementGuide.tsx
- src/components/LiveAssistant.tsx
- src/components/NotebookView.tsx
- src/components/SmartDocumentEditor.tsx
- src/components/Snackbar.tsx
- src/components/TeacherInbox.tsx
- src/components/Tooltip.tsx

## Note operative
- Applicare fix direttamente nei file sorgente.
- Validare con lo script di audit dopo ogni batch di fix.
- Priorità: risolvere prima le violazioni "high".
- Documentare ogni fix con commento `// MD3 fix`.
