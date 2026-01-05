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

The project is in **active design system consolidation**. Architecture decision:

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

#### ✅ MUST DO

```tsx
// Colors: use CSS variables
color: 'var(--sys-primary)'
backgroundColor: 'var(--sys-surface-container)'

// Typography: use CSS variables or classes
className="m3-body-large"
className="m3-label-small"

// Spacing: use token variables (4, 8, 12, 16, 24, 32px)
padding: 'var(--spacing-4)'
gap: 'var(--spacing-6)'

// Border radius: use shape variables
borderRadius: 'calc(var(--shape-lg) * var(--sys-radius-multiplier))'

// Shadows: use elevation variables
boxShadow: 'var(--elevation-2)'

// Semantic classNames
className="m3-button m3-button-filled m3-button-primary"
className="m3-dialog-content m3-dialog-actions"
className="m3-card"

// Tailwind for layout only
className="flex gap-6 p-8 md:p-6 grid grid-cols-3"

// Dark mode support (automatic via token values)
// No additional code needed — tokens handle it
```

#### ❌ NEVER DO

```tsx
// ❌ Hardcoded colors
color: '#6750a4'
style={{ backgroundColor: '#f3eff4' }}

// ❌ Arbitrary spacing
padding: '20px'
className="p-5"  // not in spacing scale
margin: '15px'

// ❌ Arbitrary border-radius
borderRadius: '24px'
className="rounded-md"

// ❌ Opacity without token
opacity: 0.5
className="opacity-50"

// ❌ New CSS files for styling
// (exceptions: component-scoped CSS, legacy gradual migration)

// ❌ MUI-first for simple components
// Use custom M3Button, not MUI Button (unless complex)

// ❌ Hardcoded dark mode detection
if (isDark) { color = '...' }  // use CSS variables instead
```

### Dark Mode

- All token values support dark mode automatically
- Tokens apply via `[data-theme="dark"]` selector
- Test EVERY component with dark mode enabled
- Do NOT hardcode colors for light/dark logic

### Component Override (Documented Exceptions)

Only **M3ExpressiveCard** is allowed custom colors (documented in DESIGN_SYSTEM_CONSOLIDATION.md § 5.

All other overrides require:
1. Approval from architecture team
2. Issue link in code comment
3. Entry in DESIGN_SYSTEM_CONSOLIDATION.md "Override MD3 Documentati" section

---

## Accessibility (WCAG 2.1 AA)

- ✅ Follow WCAG 2.1 AA guidelines
- ✅ Ensure keyboard navigation (Tab, Enter, Space, Escape)
- ✅ Use semantic HTML: `<button>`, `<input>`, `<form>`, `<nav>`
- ✅ Add ARIA labels when needed: `aria-label`, `aria-labelledby`, `role`
- ✅ Color contrast ≥ 4.5:1 for normal text, ≥ 3:1 for large text
- ✅ Visible focus indicator on all interactive elements
- ✅ Proper heading hierarchy: `<h1>`, `<h2>`, `<h3>`

Accessibility is part of code quality, not optional.

---

## Critical Files Protection

The following files are architecturally critical and must be modified with care:

- `vite.config.ts`
- `tsconfig.json`
- `src/design-system/` (all files)
- `src/types.ts`
- `src/stores/` (Zustand store definitions)
- `.github/copilot-instructions.md` (this file)

### Rules for Critical Files

- Modify only if strictly necessary
- Justify and document changes
- Run the full test suite after modifications
- Get approval before pushing

---

## Testing

- **Unit Tests:** Vitest (`npm run test`)
- **Component Tests:** Testing Library (React Testing Library)
- **E2E Tests:** Playwright (`npm run test:e2e` — when available)
- **Coverage Goal:** ≥ 80% for business logic

All tests must pass before merging changes.

```bash
npm run test               # Run all tests
npm run test:coverage     # Check coverage
npm run lint:fix          # Auto-fix linting
```

---

## Git & Commits

### Commit Messages

Follow conventional commits:

```
feat: add M3Button component with MD3 styling
refactor: consolidate design system tokens
docs: update styling guidelines
fix: dark mode color token issue
chore: update dependencies
```

### Before Pushing

1. ✅ All tests pass (`npm run test`)
2. ✅ No linting errors (`npm run lint`)
3. ✅ Changes are properly staged (`git status`)
4. ✅ Commit message is clear and descriptive
5. ✅ No hardcoded colors or arbitrary styling

---

## Rules for AI Agents (Copilot)

- Treat this document as the source of truth
- Read relevant design system docs before coding
- Proceed step by step (don't refactor everything at once)
- Do not refactor outside the stated scope
- Prefer explicit, readable solutions over clever tricks
- If uncertain, stop and explain instead of guessing
- AI agents are collaborators, not decision-makers

### Before Creating/Modifying Components

1. Check if token exists in `src/design-system/index.ts`
2. Verify component matches M3 or MUI pattern
3. Test dark mode support
4. Add TypeScript interfaces + JSDoc
5. Add accessibility (aria-*, role=, tabIndex)
6. Write tests (unit + component)
7. Check bundle size impact

---

## Educational Context

This project values:

- 📖 **Readability** over cleverness
- 🎯 **Explicit decisions** over hidden magic
- 📝 **Documented trade-offs** over silent assumptions
- 🧠 **The process** is part of the learning experience

Code should be written so a junior developer can understand and modify it after 3 months.

---

## Useful Commands

```bash
# Development
npm run dev              # Start Vite dev server
npm run build            # Build for production
npm run serve            # Preview production build

# Testing & Linting
npm run test             # Run all tests
npm run test:coverage    # Coverage report
npm run lint             # Check linting
npm run lint:fix         # Auto-fix linting issues

# Deployment
npm run vercel:deploy    # Deploy to Vercel (production)
```

---

## Resources

- [Material Design 3 Official](https://m3.material.io)
- [MUI Documentation](https://mui.com/material-ui/getting-started/)
- [React 18 Documentation](https://react.dev)
- [Zustand Documentation](https://zustand-demo.vercel.app/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

## Version & Updates

- **Version:** 2.0 (Design System Consolidation Phase)
- **Last Updated:** 5 Gennaio 2026
- **Next Review:** 12 Gennaio 2026
- **Maintained By:** Design System & Architecture Team

**Status:** ✅ Active, Enforced in CI/CD

