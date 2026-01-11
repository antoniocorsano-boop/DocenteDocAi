# DocenteDoc AI – Copilot & Contributor Instructions
(Authoritative – Material Design 3 Enforced)

## Purpose

This document defines the technical, architectural, and design intent of the DocenteDoc AI project.

It is the single source of truth for:
- GitHub Copilot
- VS Code Agent Mode
- Other AI coding agents
- Human contributors and reviewers

Clarity, consistency, architectural safety, and explainability are prioritized over cleverness or premature optimization.

---

## Project Overview

DocenteDoc AI is a Progressive Web App (PWA) designed for Italian teachers.

Core characteristics:
- Local-First architecture
- Sensitive data remains on the user’s device
- Cloud services are optional and user-controlled (BYOC)
- Educational and production-grade at the same time
- Explicit, explainable, and auditable codebase

This project is both a real application and a didactic artifact.

---

## Core Principles

- Local-first and privacy by design
- Explicit and documented architecture
- Readable and explainable code
- Safe and guided collaboration
- Strict Material Design 3 (MD3) compliance

---

## Tech Stack (Non-Negotiable)

Core:
- React 18 – functional components only
- TypeScript – strict mode enabled
- Vite – build tool and dev server
- Zustand – global state management

State management rules:
- Zustand is the only allowed state management solution
- No Redux
- No React Context for application state

Example:
```ts
const students = useDataStore(state => state.studenti);
