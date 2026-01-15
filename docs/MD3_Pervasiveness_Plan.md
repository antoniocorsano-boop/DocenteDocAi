# MD3 Pervasiveness & Compliance Operational Plan

## Executive Summary
- Stato attuale della pervasività MD3: solo core components (M3Button, M3Typography) pienamente compliant; 80%+ componenti legacy
- Obiettivo: MD3 come unica autorità visiva e zero legacy

## Component Analysis
| Component/File | Decision Points | Mechanism Classification | Compliance Score |
|----------------|----------------|------------------------|----------------|
| M3Button.tsx | Colors, Spacing, Typography, Shape, Motion, Interactive States | ✅ MD3-token mediated (all) | 100% |
| M3Typography.tsx | Typography, Colors | ✅ MD3-token mediated (all) | 100% |
| M3Card.tsx | Colors, Spacing, Shape, Elevation, Interactive States | ⚠️ Token + runtime mutations | 40% |
| M3IconButton.tsx | Colors, Spacing, Shape, Interactive States | ❌ CSS vars + runtime mutations | 20% |
| Legacy Components (~80%) | Tutti i punti decisionali | ❌ className/Tailwind + Hardcoded | 0-5% |

## Immediate Actions (Week 1-2)
- Rimuovere tutte le runtime mutation nei componenti interattivi
- Sostituire tutte le CSS variables dirette con useTheme().layers.*
- Applicare linting e CI per enforcement di token-only styling
- Congelare comportamenti ibridi e hardcoded

## Medium-term Actions (Month 1-3)
- Migrazione componente-per-componente da legacy a MD3-compliant
- Risolvere componenti ibridi (token + className/Tailwind)
- Eseguire test di integrazione del tema su tutti i componenti

## Long-term Actions (Month 3-6)
- Obiettivo: 100% componenti MD3-governed
- Automazione governance tramite CI (blocchi per violazioni)
- Aggiornare documentazione, rimuovere esempi legacy

## Governance Compliance Status
- Step 1-5: Token architecture established ✅
- Step 6: Interactive normalization completed ✅
- Step 7: Legacy containment implemented ✅
- Step 8: Full pervasiveness not yet achieved ❌
- Next Critical Action: Migrazione sistematica dei componenti legacy

## Notes
- Tutto il codice deve usare esclusivamente useTheme().layers.* in style statici
- Nessun className, Tailwind, hardcoded px/rem/hex, runtime mutation permesso
- Questo documento è la single source of truth per MD3
- Copilot deve riferirsi a questo piano per suggerimenti e generazione di nuovo codice compliant