# GitHub Copilot Instructions — DocenteDoc AI

> **AI-powered teaching assistant for Italian educators**  
> Local-first architecture with React, TypeScript, Vite, and Material Design 3 (MD3) Expressive Gold

---

## 📋 Project Overview

DocenteDoc AI is an intelligent assistant that helps Italian teachers manage their educational workflows, including lesson planning, student evaluation, class management, and administrative tasks. The application runs entirely client-side with optional AI integration via Google Gemini.

**Key Features:**
- 📚 Lesson planning and curriculum management
- 👥 Student evaluation and progress tracking
- 📊 Analytics dashboard with data visualization
- 📝 Document generation (PDF, DOCX)
- 🎨 Full MD3 Expressive Gold design system implementation
- ♿ WCAG 2.1 AA accessibility compliance

---

## 🛠️ Tech Stack

### Core Technologies
- **Frontend Framework:** React 18.2 (JSX, Hooks, Context API)
- **Language:** TypeScript 5.x (strict mode enabled)
- **Build Tool:** Vite 5.x
- **Styling:** CSS Custom Properties (MD3 tokens only)
- **State Management:** React Context + Zustand stores

### Design System
- **Material Design 3 Expressive Gold** (mandatory, zero violations)
- All visual properties MUST use MD3 CSS custom properties (`var(--md-sys-*)`)
- Custom MD3 components in `src/design-system/`
- Token-based spacing, typography, motion, and elevation

### Key Libraries
- **UI Components:** Custom MD3 wrapper components (M3Surface, M3Typography, M3Button, etc.)
- **Charts:** Recharts for data visualization
- **File Generation:** jsPDF, docx, pdf-lib
- **Testing:** Vitest (unit), Playwright (visual regression)
- **AI Integration:** @google/genai for Gemini API

### Path Aliases
- `@/*` → `./src/*`
- `@/types` → `./src/types.ts`

---

## 🏗️ Architecture

### Directory Structure
```
src/
├── components/        # React components (MD3 compliant)
├── design-system/     # MD3 tokens, theme, utilities
├── contexts/          # React Context providers
├── hooks/             # Custom React hooks
├── services/          # API services, data layer
├── stores/            # Zustand state stores
├── types/             # TypeScript type definitions
├── utils/             # Helper functions
└── theme.css          # MD3 token definitions
```

### Component Architecture
- All visual containers MUST use MD3 wrapper components (M3Surface, M3Card, AppLayout)
- All text MUST use M3Typography component
- All interactive elements MUST be MD3 components (M3Button, M3FAB, IconButton)
- No generic `<div>`, `<section>`, or `<span>` for visual layout/styling

---

## 🎨 MD3 GOVERNANCE & COMPLIANCE — BINDING CONTRACT

### ⚠️ CRITICAL: Zero-Tolerance Policy

**Material Design 3 Expressive Gold** is the ONLY design system for this project.  
**Every violation is a blocking bug and must be fixed immediately.**

### 📜 Governance Documents (MANDATORY READING)
1. **[MD3 Gold Manifesto](../docs/governance/MD3_GOLD_MANIFESTO.md)** — Permanent governance framework
2. **[MD3 Governance & Compliance Contract](../docs/governance/MD3_GOVERNANCE_COMPLIANCE_CONTRACT.md)** — Binding rules
3. **[Design System Policy](./DESIGN_SYSTEM_POLICY_MD3.md)** — Operational guidelines

### ❌ ABSOLUTELY FORBIDDEN (Zero Exceptions)

#### Hardcoded Values
- **Layout/Spacing:** `px`, `rem`, `em`, `%`, `vh`, `vw`, `auto`, `margin: 0`
- **Motion/Animation:** `0.2s`, `200ms`, `ease`, `ease-in-out`, `linear`
- **Typography:** `font-size: 14px`, `font-weight: 700`, `line-height: 1.5`
- **Colors:** `#hexcode`, `rgb()`, `rgba()`
- **Z-Index:** Numeric values (`z-index: 10`)
- **Shadows:** Custom `box-shadow` values
- **Utility Classes:** Tailwind or any non-MD3 utility CSS

#### Forbidden Patterns
- Using `className` for layout/styling (except documented MD3 icon exceptions)
- Generic HTML elements as visual containers (`<div>`, `<section>`, `<li>`)
- Inline styles for visual properties
- Local component style overrides
- Ad-hoc breakpoints or media queries

### ✅ REQUIRED PRACTICES

#### Use Only MD3 Tokens
```css
/* ✅ CORRECT */
padding: var(--md-sys-spacing-4);
font-size: var(--md-sys-typescale-body-large-font-size);
transition: opacity var(--md-sys-motion-duration-short) var(--md-sys-motion-easing-standard);
color: var(--md-sys-color-primary);

/* ❌ WRONG */
padding: 16px;
font-size: 14px;
transition: opacity 0.2s ease;
color: #6750A4;
```

#### Use Only MD3 Components
```tsx
// ✅ CORRECT
<M3Surface elevation="1" padding="4">
  <M3Typography variant="headline-medium">Title</M3Typography>
  <M3Button variant="filled">Action</M3Button>
</M3Surface>

// ❌ WRONG
<div className="card">
  <h2 style={{ fontSize: '24px' }}>Title</h2>
  <button className="btn">Action</button>
</div>
```

### 🎭 MD3 Expressive Style Guidelines

**Expressive is OPT-IN ONLY** — Never enabled by default.

#### When to Use Expressive
- ✅ Narrative cards, data visualization dashboards
- ✅ Achievement/feedback screens (positive reinforcement)
- ✅ Non-critical, exploratory UI sections

#### When NOT to Use Expressive
- ❌ Primary navigation
- ❌ Critical forms (authentication, evaluation, grades)
- ❌ Administrative workflows
- ❌ Error states or warnings

**Rule of thumb:** If the user can make a mistake or needs focus, use standard motion.

---

## 🚀 Build, Test, and Development

### Development Server
```bash
npm run dev           # Start Vite dev server on http://localhost:5173
```

### Build
```bash
npm run build         # Production build with Vite
npm run serve         # Preview production build
```

### Linting & Code Quality
```bash
npm run lint          # ESLint (includes MD3 design system rules)
npm run lint:fix      # Auto-fix ESLint issues
npm run lint:md3      # MD3-specific linting rules
```

**⚠️ All MD3 ESLint rules must pass before committing.**

### MD3 Compliance Audits
```bash
npm run md3:scan              # Scan for MD3 violations
npm run md3:scan:strict       # Fail build on violations
npm run md3:theme:audit       # Audit theme token usage
npm run md3:motion:audit      # Audit motion token usage
npm run md3:component:audit   # Audit component compliance
npm run md3:audit:all         # Run all MD3 audits
```

**Use `.github/prompt-audit-critico-md3.md` for critical MD3 audits.**

### Testing
```bash
npm test              # Run Vitest tests (watch mode)
npm run test:unit     # Run unit tests once
npm run test:coverage # Generate coverage report
npm run test:ci       # CI test run

# Visual Regression (Playwright)
npm run test:visual:md3               # Run MD3 visual tests
npm run test:visual:md3:components    # Test MD3 components
npm run test:visual:md3:screens       # Test MD3 screens
npm run test:visual:md3:update        # Update snapshots
npm run test:visual:md3:debug         # Debug visual tests

# E2E Tests
npm run test:e2e      # Run Playwright E2E tests
```

---

## 📝 Coding Conventions

### TypeScript
- **Strict mode enabled** — All types must be explicit
- Use interfaces for object shapes, types for unions/intersections
- Avoid `any` — Use `unknown` if type is truly unknown
- Prefer functional components with typed props

### React
- **Functional components only** (no class components)
- Use React Hooks (useState, useEffect, useContext, custom hooks)
- Prop destructuring at function signature
- Always provide `aria-label` for interactive elements
- Decorative icons must have `aria-hidden="true"`

### Component Structure
```tsx
// ✅ Standard component pattern
interface ComponentNameProps {
  title: string;
  onAction: () => void;
  variant?: 'default' | 'expressive';
}

export const ComponentName: React.FC<ComponentNameProps> = ({
  title,
  onAction,
  variant = 'default'
}) => {
  return (
    <M3Surface elevation="1" padding="4">
      <M3Typography variant="headline-small">{title}</M3Typography>
      <M3Button 
        variant="filled" 
        onClick={onAction}
        aria-label={`Action for ${title}`}
      >
        Confirm
      </M3Button>
    </M3Surface>
  );
};
```

### CSS/Styling
- **Never write custom CSS for layout/spacing** — Use MD3 tokens exclusively
- All styles in `src/theme.css` or `src/design-system/`
- Use CSS custom properties for theming
- Follow CSS naming: `kebab-case` for classes, `--prefix-*` for custom properties

### Accessibility
- All interactive elements need `aria-label` or `aria-labelledby`
- Maintain logical tab order
- Support keyboard navigation (Enter, Space, Arrow keys)
- Test with screen readers
- Follow WCAG 2.1 AA standards

---

## 🔧 MD3 Remediation Workflow (MANDATORY)

When working on DocenteDoc AI code, follow this sequence:

### STEP 1: Hard Violations (ALWAYS FIRST)
**Copilot MUST:**
- Remove ALL hardcoded values (`px`, `rem`, `%`, `hex`, `rgba`, durations, easings)
- Replace with MD3 tokens (`var(--md-sys-*)`)
- **NOT change visual layout or perceived spacing**
- Verify complete compliance with governance contract

**Copilot MUST NOT:**
- Introduce new tokens without declaration and approval
- Change spacing, sizing, or visual appearance
- Violate any MD3 governance rule

### STEP 2: Structural Cleanup (Only if explicitly requested)
- Replace generic HTML elements with MD3 wrapper components
- Consolidate duplicated patterns
- Always respect the governance contract

### STEP 3: Expressive/Motion Enhancements (Only if explicitly requested)
- Apply expressive variants where approved
- Add motion tokens for enhanced interactions
- Always respect the governance contract

**If a required token doesn't exist:** Flag it to design system maintainers. DO NOT create hardcoded workarounds.

---

## 🔍 Troubleshooting & Common Issues

### Build Failures
- Check for MD3 ESLint violations: `npm run lint:md3`
- Run MD3 compliance scan: `npm run md3:scan:strict`
- Verify all imports resolve (check path aliases in `tsconfig.json`)

### Type Errors
- Ensure `@/types` alias points to `./src/types.ts`
- Run `npm run build` to check TypeScript compilation
- Check for missing type definitions in `src/types/`

### Visual Regression Failures
- Review Playwright report: `npx playwright show-report`
- Update snapshots if changes are intentional: `npm run test:visual:md3:update`
- Verify MD3 token usage hasn't changed

### MD3 Compliance Issues
- Use audit prompt: `.github/prompt-audit-critico-md3.md`
- Use refactor prompt: `.github/prompt-refactor-md3-gold.md`
- Check governance docs: `docs/governance/`

---

## 📚 Additional Resources

### Documentation
- [README.md](../README.md) — Project overview and quick start
- [ARCHITECTURE.md](../docs/ARCHITECTURE.md) — System architecture details
- [DEVELOPMENT.md](../docs/DEVELOPMENT.md) — Development workflow
- [TESTING.md](../docs/TESTING.md) — Testing strategy
- [CONTRIBUTING.md](../CONTRIBUTING.md) — Contribution guidelines

### Design System
- [MD3 Tokens](../src/design-system/tokens/) — Token definitions
- [MD3 Components](../src/design-system/) — Component library
- [Theme CSS](../src/theme.css) — Theme configuration

### External References
- [Material Design 3 Guidelines](https://m3.material.io/)
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

## 🚨 Critical Reminders for Copilot

1. **MD3 Governance is NON-NEGOTIABLE** — Treat as binding contract
2. **Zero hardcoded values** — Use MD3 tokens exclusively
3. **Zero utility classes** — Use MD3 components exclusively
4. **Expressive is opt-in** — Never apply by default
5. **Flag missing tokens** — Never create hardcoded workarounds
6. **Accessibility is mandatory** — All interactive elements need ARIA labels
7. **Test before committing** — Run `npm run lint:md3` and `npm run md3:scan`

**When in doubt, consult:**
- MD3 Gold Manifesto: `docs/governance/MD3_GOLD_MANIFESTO.md`
- Governance Contract: `docs/governance/MD3_GOVERNANCE_COMPLIANCE_CONTRACT.md`
- Audit Prompt: `.github/prompt-audit-critico-md3.md`

---

_Last Updated: 2026-02-17_  
_Status: MD3 Expressive Gold Compliant_
