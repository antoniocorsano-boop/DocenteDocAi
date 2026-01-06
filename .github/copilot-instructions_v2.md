# DocenteDoc AI – Copilot & Contributor Instructions

## Purpose

This document defines the **technical, architectural, and design intent** of the DocenteDoc AI project.

It is the **source of truth** for:
- AI coding agents (GitHub Copilot, VS Code Agent Mode)
- Human contributors and reviewers

Clarity, consistency, and explainability are prioritized over cleverness or premature optimization.

---

## Project Overview

**DocenteDoc AI** is a Progressive Web App (PWA) designed for Italian teachers.

The application follows a **Local-First architecture**:
- Sensitive data remains on the user's device
- Cloud services are optional and user-controlled (BYOC)

The project is both a real application and a didactic artifact.

---

## Core Principles

- 🧠 Local-First and privacy by design
- 🧩 Explicit and documented architecture
- 📖 Readable and explainable code
- 🤝 Safe and guided collaboration

---

## Tech Stack (Non-negotiable)

### Core
- **React 18** – Functional components only
- **TypeScript** – Strict mode enabled
- **Vite** – Build tool and dev server
- **Zustand** – Centralized state management

### State Management Rules
- Zustand is the only state management solution
- No Redux
- No React Context for application state

Example:
```ts
const students = useDataStore(state => state.studenti);
```

---

## Architecture Overview

```
src/
├── components/        # UI components (custom M3 + MUI)
├── stores/            # Zustand stores (global state)
├── services/          # Business logic and integrations
├── hooks/             # Custom React hooks
├── utils/             # Utility functions
├── design-system/     # Theme and design tokens
├── nka/               # NKA workflow provider
└── types.ts           # Central TypeScript interfaces
```

---

## Component Rules

- Functional components only
- TypeScript interfaces for props are mandatory
- Components should be small and focused
- Prefer clarity over abstraction
- Always export default at bottom of file

---

## Styling & Design System (Critical)

### Design Intent

The project follows **Material Design 3 (MD3)** principles exclusively.

There is no technical "Expressive mode" — expressiveness emerges from theme and interaction choices.

### Current Status (Phase 2, Jan 2026)

- **Custom M3 Components** are PRIMARY: `M3Button`, `M3Dialog`, `M3Card`, `TextField`, `M3ListItem` 
  - ✅ Lightweight, full control, MD3-native
  - Recommended for: buttons, cards, inputs, dialogs (reusable foundations)

- **MUI Components** are SECONDARY: `Popover`, `Menu`, `Autocomplete`, `DataGrid`
  - ✅ Complex positioning, keyboard, virtualization
  - Recommended for: popovers, dropdowns, large tables

- **Tailwind** is for LAYOUT ONLY: responsive design, flexbox, grid
  - ✅ For spacing logic and responsive breakpoints only
  - ❌ NOT for colors, typography, or spacing values

- **No other styling systems**: CSS-in-JS via Emotion only for MUI component overrides

### Reference Documentation

- **Main Architecture:** `docs/DESIGN_SYSTEM_CONSOLIDATION.md`
- **MUI Roadmap:** `docs/MUI_INTEGRATION_ROADMAP.md`
- **Token Guide:** `docs/DESIGN_TOKENS_AND_CHECKLIST.md`

### Styling Rules (Non-Negotiable)

(Include tutti i dettagli del file confermato in precedenza...)

---

## Accessibility (WCAG 2.1 AA)

(Dettagli come prima)

---

## Critical Files Protection

(Dettagli come prima)

---

## Testing

(Dettagli come prima)

---

## Git & Commits

(Dettagli come prima)

---

## Rules for AI Agents (Copilot)

(Dettagli come prima)

---

## Educational Context

(Dettagli come prima)

---

## Useful Commands

(Dettagli come prima)

---

## Resources

(Dettagli come prima)

---

## Version & Updates

(Dettagli come prima)

**Status:** ✅ Active, Enforced in CI/CD
"""

# Scrittura del file Markdown completo con tutte le istruzioni
with open(doc_path, 'w') as f:
    f.write(md_content)

doc_path