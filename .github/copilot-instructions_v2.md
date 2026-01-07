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
- Sensitive data remains on the user’s device
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
├── nka/               # Workflow / agent logic
└── types.ts           # Central TypeScript interfaces
```

---

## Component Rules

- Functional components only  
- TypeScript interfaces for props are mandatory  
- Components should be small and focused  
- Prefer clarity over abstraction  
- Always export default at the bottom of the file  

---

## Styling & Design System (CRITICAL)

### Design Intent

The project follows **Material Design 3 (MD3)** principles exclusively.

There is **no technical “Expressive mode”**.  
Expressiveness, when present, emerges naturally from:
- theme tokens
- motion
- spacing
- hierarchy

---

### Styling Hierarchy (STRICT)

1. **Custom M3 components** (PRIMARY)
2. **MUI components** (SECONDARY, only when needed)
3. **Tailwind** (LAYOUT ONLY)

No other styling systems are allowed.

---

### Custom M3 Components (Primary)

Examples:
- `M3Button`
- `M3Card`
- `M3Dialog`
- `M3TextField`
- `M3ListItem`

Characteristics:
- Lightweight
- Token-driven
- Fully MD3-aligned
- Preferred for all standard UI

---

### MUI Components (Secondary)

Allowed only for **complex behavior**, not for basic UI.

Examples:
- `Popover`
- `Menu`
- `Autocomplete`
- `DataGrid`

Reasons:
- Keyboard navigation
- Virtualization
- Advanced positioning

---

### Tailwind Usage (Restricted)

Tailwind is allowed **ONLY** for:
- layout
- flex/grid
- responsive breakpoints

❌ NOT allowed:
- colors
- typography
- spacing values
- shadows
- borders

---

### Styling Rules (Non-Negotiable)

- No hardcoded colors
- No hardcoded spacing
- No inline styles
- All visual values come from `design-system`
- Transitional or legacy styles must be documented

---

## Login Screen – Mandatory Requirements

Any login-related code MUST respect the following:

- Fully usable on:
  - mobile
  - tablet
  - notebook
  - desktop
- No fixed widths or heights
- Uses responsive layout (flex / grid)
- Content must always remain reachable (no overflow traps)
- Keyboard accessible
- Visual hierarchy clear on small screens

The login screen is considered **architecturally critical**.

---

## Accessibility (WCAG 2.1 AA)

- Keyboard navigation required
- Focus states visible
- Labels for all inputs
- Color contrast must meet AA standards

Accessibility is part of code quality, not an optional feature.

---

## Critical Files Protection

The following files are architecturally critical:

- `vite.config.ts`
- `tsconfig.json`
- `src/design-system/*`
- `src/types.ts`
- Zustand store files

Rules:
- Modify only if strictly necessary
- Always document why
- Never refactor casually

---

## Testing

- Unit tests: Vitest  
- Component tests: Testing Library  
- E2E tests: Playwright  

All tests must pass before merging.

---

## Git & Commits

- Small, focused commits
- Clear commit messages
- No mixed refactors + features

---

## Rules for AI Agents (Copilot)

- Treat this document as the source of truth
- Proceed step by step
- Do not refactor outside the stated scope
- Prefer explicit and readable solutions
- If uncertain, stop and explain instead of guessing

AI agents are collaborators, not decision-makers.

---

## Educational Context

This project values:

- Readability over cleverness
- Explicit decisions over hidden magic
- Documented trade-offs over silent assumptions

The process is part of the learning experience.

---

## Version & Updates

This document is **living**, but changes must be intentional.

**Status:** ✅ Active and enforced

