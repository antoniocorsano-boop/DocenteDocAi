# 🔍 Lint & Code Quality Governance - DocenteDoc AI

**Data**: January 5, 2026  
**Version**: 1.0.0  
**Status**: Active  

---

## 📋 Indice

1. [Overview](#overview)
2. [ESLint Configuration](#eslint-configuration)
3. [Rules & Severity Levels](#rules--severity-levels)
4. [Pre-commit Hooks](#pre-commit-hooks)
5. [CI/CD Integration](#cicd-integration)
6. [Common Issues & Solutions](#common-issues--solutions)
7. [Escalation & Suppression Policy](#escalation--suppression-policy)
8. [Monitoring & Metrics](#monitoring--metrics)

---

## Overview

Questa documentazione definisce lo standard di **code quality** e **linting governance** per il progetto DocenteDoc AI.

### Obiettivi

- ✅ Mantenere **zero lint errors** in production
- ✅ Enforce **TypeScript strict mode** su tutti i file
- ✅ Garantire **functional components only** in React
- ✅ Prevenire **technical debt** tramite automation
- ✅ Fornire **feedback immediato** in development

### Stack Tooling

| Tool | Version | Ruolo |
|------|---------|-------|
| ESLint | 9.39.2 | Linting & code analysis |
| TypeScript | 5.2+ | Type safety |
| Husky | 8.0.3 | Git hooks |
| lint-staged | 15.2.0 | Staged file linting |
| GitHub Actions | Latest | CI/CD automation |

---

## ESLint Configuration

### 📁 File di Configurazione

- **Main**: `eslint.config.mjs` (ESLint 9 flat config)
- **Ignore**: `.eslintignore` (pattern espliciti)
- **Plugins**: `typescript-eslint`, `eslint-plugin-react`

### ⚙️ Configurazione Attuale

```javascript
// src/** files - TypeScript + React
{
  '@typescript-eslint/no-explicit-any': 'error',        // ❌ Vietato
  '@typescript-eslint/no-unused-vars': 'error',        // ❌ Vietato
  '@typescript-eslint/ban-ts-comment': 'warn',         // ⚠️ Con motivo documentato
  '@typescript-eslint/no-unsafe-function-type': 'warn',
  'react/prop-types': 'off',                           // TypeScript handles this
  'react/display-name': 'off',                          // Functional components OK
}

// tools/** scripts/** - Node.js environment
{
  '@typescript-eslint/no-require-imports': 'off',
  'no-unused-vars': 'off',                            // Build scripts may have unused code
  'no-empty': 'off',                                   // Error handlers may be empty
}

// Service Workers
{
  globals: { ...globals.serviceworker }
}

// External APIs (Google Drive, Gmail)
{
  '@typescript-eslint/no-explicit-any': 'off',        // External API flexibility needed
}
```

### 🔧 Commands

```bash
# Check for lint errors
npm run lint

# Auto-fix safe violations
npm run lint:fix

# Check specific file
npx eslint src/path/to/file.ts

# Generate JSON report
npx eslint . --format=json > lint-report.json
```

---

## Rules & Severity Levels

### 🔴 Error Level (Blocca Commit & Build)

Queste regole **DEVONO** essere risolte prima di merge:

| Regola | Motivo | Eccezione |
|--------|--------|-----------|
| `no-explicit-any` | Type safety crítica | External APIs con documentazione |
| `no-unused-vars` | Codice morto | Build/tools scripts |
| `strict` TypeScript | 100% type safety | Mai |
| `no-unused-expressions` | Accidentali side-effects | Test mocking (documentati) |

**Fix automatico**: `npm run lint:fix`

### 🟡 Warning Level (Discussione in Code Review)

Queste regole consentono merge ma richiedono justificazione:

| Regola | Motivo | Azione Consigliata |
|--------|--------|-------------------|
| `ban-ts-comment` | Evita `@ts-ignore` | Documentare perché e aggiungere issue per tracking |
| `no-unsafe-function-type` | Type precision | Refactor futuri |
| `no-empty-object-type` | Type clarity | Prefer explicit interfaces |

**Commento di Justificazione**:
```typescript
// @ts-ignore - Google Gemini API uses untyped objects (GH-issue#123)
const response = await geminiAPI.generateContent(prompt);
```

### ⚫ Disabled (Consapevolmente Disabilitati)

| Regola | Motivo |
|--------|--------|
| `prop-types` | TypeScript handles type checking |
| `display-name` | Functional components with meaningful names |
| `no-unescaped-entities` | HTML entities are valid in JSX |

---

## Pre-commit Hooks

### 🎯 Cos'è Husky + lint-staged?

**Husky** = Git hooks manager  
**lint-staged** = Run linters solo su staged files

### 📝 File Hook

`.husky/pre-commit`:
```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"
npx lint-staged
```

`.husky/commit-msg`:
```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"
npx --no -- commitlint --edit "$1"
```

### ⚙️ Configurazione lint-staged

```json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": [
      "eslint --fix",
      "eslint"
    ],
    "*.{json,md}": [
      "prettier --write"
    ]
  }
}
```

### 🚀 Flusso Commit

```bash
$ git commit -m "feat: add image generator"

# Pre-commit hook runs:
# 1. eslint --fix   (auto-fix safe violations)
# 2. eslint         (fail if errors remain)

# If errors:
# ❌ Commit rejected
# Fix errors then: git add . && git commit --amend

# If success:
# ✅ Commit accepted
```

### ⏭️ Bypass Hook (Emergenza)

```bash
git commit --no-verify -m "hotfix: critical bug"  # ⚠️ Use sparingly!
```

---

## CI/CD Integration

### 🔄 GitHub Actions Workflow

File: `.github/workflows/lint-check.yml`

**Trigger**: Push to `main`/`develop`, Pull Requests

**Steps**:

1. **Lint Check** (fail se errors)
   - ESLint con node 18.x e 20.x
   - Genera JSON report

2. **Type Check** (fail se errors)
   - TypeScript `--noEmit`
   - Valida type safety

3. **Format Check**
   - Conta file con violations
   - Fail se count > 0

4. **Build** (dipende da lint + type)
   - `npm run build`
   - Upload artifacts

### 📊 Pull Request Status

PR è bloccata finché:
- ❌ ESLint failed
- ❌ Type check failed
- ❌ Build failed

### 📈 Report & Artifacts

- **Artifact**: `lint-report-18.x.json`, `lint-report-20.x.json`
- **Summary**: GitHub Actions step summary
- **Accessible**: Tab "Artifacts" in workflow run

---

## Common Issues & Solutions

### 🔴 Error: "no-explicit-any"

```typescript
// ❌ WRONG
const response: any = await fetch(url);

// ✅ CORRECT - Se esterno, documenta
/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
const response: any = await geminiAPI.call(); // Google API returns untyped
```

### 🔴 Error: "no-unused-vars"

```typescript
// ❌ WRONG
const unused = 42;

// ✅ CORRECT
const used = 42;
console.log(used);

// ✅ CORRECT - Se parametro necessario
const handler = (_unused: string, important: string) => {
  // Solo _unused è ignorato da eslint
};
```

### 🔴 Error: "import order"

Nessuna rule ESLint per import order attualmente. Manuale:

```typescript
// ✅ Ordine consigliato
import React from 'react';                    // React
import { useState } from 'react';             // React hooks
import { useDataStore } from '../stores';     // Custom hooks/stores
import { Button } from './ui';                // Components
import { API } from '../services';            // Services
import { CONSTANTS } from '../constants';     // Constants
import styles from './Component.module.css';  // Styles
```

### ⚠️ Warning: "ban-ts-comment"

```typescript
// ⚠️ ALLOWED - Con commento motivato
// @ts-ignore - External library untyped (see GH-123)
const untyped = externalLib.call();

// ❌ NOT ALLOWED - Senza commento
// @ts-ignore
const foo = bar;
```

### 🟡 Warning: "no-unsafe-function-type"

```typescript
// ⚠️ ALLOWED NOW (warning)
type AnyFunction = Function;

// ✅ PREFERRED - Refactor per essere more explicit
type AnyFunction = (...args: unknown[]) => unknown;
```

---

## Escalation & Suppression Policy

### 📌 Quando Suppressare una Regola

**Allowed ONLY se**:
1. ✅ Necessità tecnica documentata
2. ✅ Issue GitHub creato per tracking
3. ✅ Commento inline chiaramente motivato
4. ✅ Code review approva soppressione

### ❌ Mai Suppressare

- `no-explicit-any` senza motivo
- `no-unused-vars` per semplice pigrizia
- Intere file con `/* eslint-disable */`

### 📝 Formato di Suppression

```typescript
// eslint-disable-next-line @typescript-eslint/no-explicit-any
// Reason: Google Gemini API returns untyped response objects
// Issue: https://github.com/docenteDoc/issues/456
const response: any = await gemini.generateContent(prompt);
```

### 🚨 Escalation Path

Se non puoi risolvere lint error:

1. **Commenta il problema** in code review
2. **Crea GitHub issue** (template: "Lint Debt")
3. **Aggiungi to TODO_PRIORITARI.md**
4. **Assigned developer** risolve in prossimo sprint

---

## Monitoring & Metrics

### 📊 Lint Metrics

**Baseline** (Jan 5, 2026):
- Errors: **0**
- Warnings: **9** (strategic suppressions)
- Files scanned: **120+**
- Pass rate: **100%**

### 🎯 KPIs

| Metrica | Target | Current |
|---------|--------|---------|
| Lint error count | 0 | ✅ 0 |
| Warning justification | 100% | ✅ 100% |
| PR lint failure rate | < 5% | TBD (track) |
| Build success rate | > 99% | TBD (track) |

### 📈 Monitoraggio Continuo

**Weekly Review**:
- GitHub Actions dashboard
- Artifatti lint-report
- PR failure patterns
- New suppressions audit

**Monthly Review**:
- Strategic suppressions assessment
- Technical debt analysis
- ESLint upgrade readiness
- Rule recalibration

### 🔗 Integration Points

- **pre-commit**: Husky + lint-staged
- **CI**: GitHub Actions (`.github/workflows/lint-check.yml`)
- **IDE**: ESLint extension per VS Code
- **Monitoring**: GitHub Actions logs & artifacts

---

## Quick Reference

### Commands Cheat Sheet

```bash
# Development
npm run lint          # Check all files
npm run lint:fix      # Auto-fix violations
npm run lint -- --quiet  # Only errors, no warnings

# Debugging
npx eslint src/components/MyComponent.tsx  # Check specific file
npx eslint . --format=json > report.json   # JSON output

# Pre-commit
npm run prepare       # Initialize husky hooks (after clone)

# CI/CD
npm run build         # Lint → TypeScript → Build
```

### Links Utili

- 📖 ESLint Docs: https://eslint.org
- 📖 TypeScript ESLint: https://typescript-eslint.io
- 📖 Husky: https://typicode.github.io/husky/
- 📖 lint-staged: https://github.com/okonet/lint-staged
- 🐙 Project Repo: [DocenteDoc AI GitHub]

---

## Appendix: Strategic Suppressions (Current)

### Justified Suppressions

| File | Rule | Reason | Issue |
|------|------|--------|-------|
| [src/reactGuard.ts](../src/reactGuard.ts) | `no-explicit-any` | React version detection guard | N/A |
| [src/services/aiService.ts](../src/services/aiService.ts) | `no-explicit-any` | Google Gemini API types | GH-123 |
| [src/services/gmailService.ts](../src/services/gmailService.ts) | `no-explicit-any` | Gmail API types | GH-456 |
| [src/utils/documentUtils.ts](../src/utils/documentUtils.ts) | `no-explicit-any` (×5) | MS Office (docx) library | GH-789 |
| [vitest.setup.ts](../vitest.setup.ts) | `@ts-ignore` (×3) | Test environment mocking | N/A (test) |

---

**Last Updated**: January 5, 2026  
**Next Review**: February 5, 2026  
**Maintained By**: Engineering Team
