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
Architecture Overview
perl
Copia codice
src/
├── components/        # UI components
├── stores/            # Zustand stores (global state)
├── services/          # Business logic and integrations
├── hooks/             # Custom React hooks
├── utils/             # Utility functions
├── design-system/     # Theme and design tokens
└── types.ts           # Central TypeScript interfaces
Component Rules
Functional components only

TypeScript interfaces for props are mandatory

Components should be small and focused

Prefer clarity over abstraction

Styling & Design System (Important)
Design Intent
The project follows Material Design 3 principles

There is no technical “Expressive mode”

Expressiveness, when present, emerges from theme and interaction choices

Current Status
The project is in a design system consolidation phase.

MUI is the intended primary UI component library

MD3 guides visual decisions conceptually

Some legacy or transitional styling may still exist

Visual consistency is prioritized over visual completeness

Styling Rules
Prefer MUI components whenever possible

Use design tokens from src/design-system/

Avoid hardcoded colors, spacing, or typography

Do not introduce new styling systems

Transitional styling must be minimal and documented

Accessibility
Follow WCAG 2.1 AA guidelines

Ensure keyboard navigation

Accessibility is part of code quality

Critical Files Protection
The following files are considered architecturally critical:

vite.config.ts

tsconfig.json

src/design-system 

src/types.ts

Zustand store files

Rules:

Modify only if strictly necessary

Justify and document changes

Run the full test suite after modifications

Testing
Unit tests: Vitest

Component tests: Testing Library

E2E tests: Playwright

All tests must pass before merging changes.

Rules for AI Agents (Copilot)
Treat this document as the source of truth

Proceed step by step

Do not refactor outside the stated scope

Prefer explicit, readable solutions

If uncertain, stop and explain instead of guessing

AI agents are collaborators, not decision-makers.

Educational Context
This project values:

readability over cleverness

explicit decisions over hidden magic

documented trade-offs over silent assumptions

The process is part of the learning experience.