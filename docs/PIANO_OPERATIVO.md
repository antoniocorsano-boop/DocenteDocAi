# 📋 PIANO OPERATIVO - Consolidamento Design System

**Inizio:** 5 Gennaio 2026  
**Fine Target:** 28 Febbraio 2026  
**Status:** 🎯 Pianificazione in corso

---

## 📊 Panoramica Fasi

```
FASE 1: COMPLETATA ✅
  Design system analysis + documentation
  
FASE 2A: SETUP & CLEANUP (6-21 Gennaio)
  Team alignment, code audit, ESLint setup
  
FASE 2B: POPOVER MIGRATION (15-21 Gennaio)
  EventActionPopover + QuickNotePopover
  
FASE 2C: MENU & STEPPER (22-28 Gennaio)
  Menu.tsx migration + Stepper evaluation
  
FASE 3: ADVANCED (29 Gennaio - 28 Febbraio)
  DataGrid, full rollout, production ready
```

---

## 🔴 FASE 2A: SETUP & CLEANUP (6-14 Gennaio)

### Task 2A.1: Team Alignment & Approval
**Deadline:** 10 Gennaio  
**Owner:** Anton (organizzare riunione)  
**Effort:** 1-2 ore

**Checklist:**
```
[ ] Crea invito riunione (30 min):
    - Invitati: Architecture lead, Design lead, Senior dev
    - Agenda: DESIGN_SYSTEM_CONSOLIDATION.md overview
    - Documenti: Tutti 7 files in docs/
    
[ ] Presenta findings (20 min):
    - Current state: 10+ M3 custom components
    - Decision: Hybrid (M3 primary, MUI for complexity)
    - Phase timeline: Jan-Feb 2026
    
[ ] Q&A + Approval (30 min):
    - Token-first approach → OK?
    - Custom M3 by default → OK?
    - Phase 2A kickoff Feb 15 → OK?
    
[ ] Registra decisioni:
    - Update CONSOLIDAMENTO_DESIGN_SYSTEM_SUMMARY.md
    - Commit: "docs: team approval recorded"
```

**Output:** Consenso del team, OK per procedere

---

### Task 2A.2: Code Audit - Baseline Conformità
**Deadline:** 12 Gennaio  
**Owner:** Copilot  
**Effort:** 3-4 ore

**Checklist:**
```
[ ] Scan hardcoded colors:
    grep -r "#[0-9a-fA-F]\{6\}" src/ --include="*.tsx"
    → Report in: audit/hardcoded_colors.txt
    
[ ] Scan inline styles:
    grep -r "style={{" src/ --include="*.tsx"
    → Report in: audit/inline_styles.txt
    
[ ] Audit token usage:
    grep -r "var(--sys-" src/ --include="*.tsx" | wc -l
    → Report: X components use tokens
    
[ ] Dark mode test (manual):
    - Open 10 key components
    - Toggle [data-theme="dark"]
    - Document: dark_mode_audit.txt
    
[ ] Component checklist:
    - Sample 5 components
    - Apply DESIGN_TOKENS_AND_CHECKLIST.md § 4
    - Document: component_compliance.txt

[ ] Genera report:
    Create: audit/BASELINE_AUDIT_REPORT.md
    Include: findings, severity, priority to fix
```

**Output:** Baseline audit report, non-conformities identified

---

### Task 2A.3: ESLint Custom Rules Setup
**Deadline:** 14 Gennaio  
**Owner:** Copilot  
**Effort:** 3-4 ore

**Checklist:**
```
[ ] Create ESLint rule: no-hardcoded-colors
    File: eslint-rules/no-hardcoded-colors.js
    Check: hex/rgb colors in tsx files
    Message: "Use --sys-* token instead"
    
[ ] Create ESLint rule: enforce-token-usage
    File: eslint-rules/enforce-token-usage.js
    Check: padding/margin should use --spacing-*
    Message: "Use --spacing-4, --spacing-6, --spacing-8"
    
[ ] Create ESLint rule: no-new-css-files
    File: eslint-rules/no-new-css-files.js
    Check: prevent new .css files (legacy migration only)
    Exception: component-scoped .module.css
    
[ ] Update eslint.config.mjs:
    - Import 3 custom rules
    - Enable in src/ with proper severity
    
[ ] Run ESLint audit:
    npm run lint > audit/eslint_baseline.txt
    → Document current violations
    
[ ] Create GitHub Actions workflow:
    File: .github/workflows/design-system-lint.yml
    On: PR, commit to main
    Check: no-hardcoded-colors, no-arbitrary-spacing
    
[ ] Commit:
    "chore: add ESLint custom rules for design system enforcement"
```

**Output:** ESLint rules live, automated validation in CI/CD

---

## 🟠 FASE 2B: POPOVER MIGRATION (15-21 Gennaio)

### Task 2B.1: Migrate EventActionPopover → MUI Popover
**Deadline:** 17 Gennaio  
**Owner:** Copilot  
**Effort:** 2-3 ore

**Checklist (from MUI_INTEGRATION_ROADMAP.md § 1):**
```
[ ] Analyze current EventActionPopover.tsx:
    - Current props interface
    - Event action buttons (edit, delete, assign)
    - Current positioning logic
    - Accessibility status
    
[ ] Design new implementation:
    - MUI Popover wrapper
    - MD3 styling via sx prop
    - Preserve existing props API
    
[ ] Implement:
    - Import { Popover } from '@mui/material'
    - Apply sx prop: backgroundColor: var(--sys-surface), etc.
    - Keyboard handling (ESC to close)
    - ARIA labels complete
    
[ ] Test:
    - Unit tests (Vitest): render, open/close, keyboard
    - Component test (Testing Library): click actions
    - A11y test: axe, keyboard nav, color contrast
    - Dark mode: toggle [data-theme="dark"]
    - Responsive: mobile, tablet, desktop
    - Coverage: ≥80%
    
[ ] Performance:
    - Bundle size before/after
    - Render performance (React DevTools)
    - Document findings
    
[ ] Commit:
    "feat: migrate EventActionPopover to MUI with MD3 styling"
    - Issue link: closes #XXXX (if exists)
    - Breaking changes: none (API preserved)
```

**Output:** EventActionPopover migrated, all tests passing

---

### Task 2B.2: Migrate QuickNotePopover → MUI Popover
**Deadline:** 18 Gennaio  
**Owner:** Copilot  
**Effort:** 2-3 ore

**Same process as 2B.1**
- Analyze current
- Design new (MUI)
- Implement
- Test (unit + component + a11y + dark mode)
- Performance
- Commit

**Output:** QuickNotePopover migrated, all tests passing

---

### Task 2B.3: Phase 2A Integration Test & Optimization
**Deadline:** 21 Gennaio  
**Owner:** Copilot  
**Effort:** 2 ore

**Checklist:**
```
[ ] Integration test:
    - Both popovers open in same page
    - No conflicts with other components
    - Keyboard nav works across multiple popovers
    
[ ] Bundle size analysis:
    - MUI Popover impact: ?KB added
    - Tree-shaking effective?
    - Recommend: lazy-load if > 50KB
    
[ ] Performance profiling:
    - React DevTools Profiler: render time
    - Chrome DevTools: paint/layout time
    - Document: bundle_impact_report.md
    
[ ] Accessibility full test:
    - WAVE tool: 0 errors
    - axe-core: all checks pass
    - Keyboard: Tab, Escape, Arrow keys
    - Screen reader: NVDA/JAWS
    
[ ] Dark mode full test:
    - All color tokens correct
    - Text contrast ≥ 4.5:1
    - Icons/images readable
    
[ ] Commit:
    "test: add integration tests for MUI Popover migration"
    "perf: document bundle impact and optimization"
```

**Output:** Phase 2A validation complete, ready for Phase 2B

---

## 🟡 FASE 2C: MENU & STEPPER (22-28 Gennaio)

### Task 2C.1: Migrate Menu.tsx → MUI Menu
**Deadline:** 25 Gennaio  
**Owner:** Copilot  
**Effort:** 3-4 ore

**From MUI_INTEGRATION_ROADMAP.md § 2:**
```
[ ] Analyze current Menu.tsx:
    - Navigation structure
    - Keyboard support current status
    - Mobile vs desktop behavior
    
[ ] Design MUI Menu impl:
    - MUI Menu + MenuItem
    - Submenu support (if needed)
    - MD3 styling (--sys-surface, outline, radius)
    
[ ] Implement:
    - Replace custom div with <Menu>
    - Add keyboard accessibility
    - Test mobile: touch, long-press
    
[ ] Test:
    - Unit: Vitest
    - Component: Testing Library
    - A11y: keyboard, ARIA
    - Dark mode + responsive
    - Coverage ≥80%
    
[ ] Commit:
    "feat: migrate Menu.tsx to MUI with full keyboard support"
```

**Output:** Menu.tsx migrated with improved accessibility

---

### Task 2C.2: Stepper Evaluation
**Deadline:** 26 Gennaio  
**Owner:** Copilot  
**Effort:** 2-3 ore

**From MUI_INTEGRATION_ROADMAP.md § 5:**
```
[ ] Audit current wizards:
    - AnnualPlanningWizard (5 steps)
    - BatchExportWizard (3 steps)
    - ConsiglioClasseWizard (4 steps)
    - PassaggioAnnoWizard (3 steps)
    
[ ] Decision: Keep custom or use MUI Stepper?
    Criteria:
    - Visual feedback clarity?
    - Code complexity?
    - PWA implications?
    - User experience improvement?
    
[ ] If Keep Custom:
    - Document rationale in copilot-instructions_v2
    - Ensure MD3 compliance
    
[ ] If Use MUI:
    - Design prototype
    - Test accessibility
    - Performance impact
    - Plan migration (Phase 3+)
    
[ ] Commit:
    "docs: stepper evaluation - decision recorded"
```

**Output:** Decision recorded, path forward clear

---

### Task 2C.3: Phase 2B Wrap-up
**Deadline:** 28 Gennaio  
**Owner:** Copilot  
**Effort:** 2 ore

**Checklist:**
```
[ ] Test all Phase 2B changes together:
    - Popover + Menu + Stepper (if migrated)
    - No conflicts, smooth interactions
    
[ ] Update documentation:
    - MUI_INTEGRATION_ROADMAP.md: mark Phase 2 complete
    - Add performance metrics
    - Update decision log
    
[ ] Performance report:
    - Bundle size impact (total)
    - Performance metrics (before/after)
    - Accessibility score
    - Document: phase_2_performance_report.md
    
[ ] Create Phase 3 preparation:
    - DataGrid scope definition
    - Timeline refinement
    - Resource allocation
    
[ ] Commit:
    "docs: Phase 2B completion and Phase 3 planning"
```

**Output:** Phase 2 complete, Phase 3 ready to start

---

## 🟢 FASE 3: ADVANCED (29 Gennaio - 28 Febbraio)

### Task 3.1: DataGrid Prototype (Week 1)
**Deadline:** 4 Febbraio  
**Owner:** TBD (Copilot + Senior Dev)  
**Effort:** 4-6 ore

```
[ ] Analyze use cases:
    - Reportistica (grades, attendance)
    - Archivio (search, filter, sort)
    - Bulk operations?
    
[ ] Prototype MUI DataGrid:
    - Sample data setup
    - Columns definition
    - Sorting + pagination
    - MD3 styling
    
[ ] Performance test:
    - 100 rows rendering
    - Sorting performance
    - Filter performance
    
[ ] Decision:
    - Full DataGrid vs custom table?
    - Timeline for rollout
```

---

### Task 3.2: Full Rollout & Validation (Week 2-4)
**Deadline:** 28 Febbraio  
**Owner:** Team  
**Effort:** 8-12 ore

```
[ ] Code audit Phase 2-3:
    - All components use tokens
    - No hardcoded colors remain
    - ESLint: 0 violations
    
[ ] Test coverage:
    - Unit tests ≥80%
    - Accessibility WCAG 2.1 AA
    - Dark mode on all components
    - Responsive all breakpoints
    
[ ] Performance validation:
    - Bundle size < 500KB (goal)
    - Lighthouse: ≥90 all categories
    - PWA: offline functionality OK
    
[ ] Production readiness:
    - All docs updated
    - Team training complete
    - Deployment checklist passed
    
[ ] Final commit:
    "docs: Design system consolidation Phase 3 complete - production ready"
```

**Output:** Full design system consolidation complete, production ready

---

## 📅 Timeline Calendario

```
GEN 2026
────────────────────────────────────────────
5   10  15  20  25  30
│   │   │   │   │   │
┌─  └─  ┬─  ┬─  ┬─  └─
│       │   │   │
Phase1  2A  2B  2C
Docs    Aud Pop Menu
        it  +Note+Step
        ESL
        int
        
FEB 2026
────────────────────────────────────────────
5   10  15  20  25
│   │   │   │   │
├─  ┬─  ┬─  └─  ┘
│   │   │
Phase3  Full
Proto   Rollout
```

---

## 🎯 Success Criteria per Fase

### ✅ Phase 2A (Setup)
- [ ] Team approval recorded
- [ ] Baseline audit report generated
- [ ] ESLint rules live + CI/CD integrated
- [ ] 0 critical violations in audit

### ✅ Phase 2B (Popover & Menu)
- [ ] 2 popovers migrated to MUI
- [ ] Menu.tsx migrated + tested
- [ ] Stepper decision recorded
- [ ] All tests passing (≥80% coverage)
- [ ] Dark mode verified on all
- [ ] Accessibility: WCAG 2.1 AA passed

### ✅ Phase 2C (Validation)
- [ ] No new hardcoded colors in codebase
- [ ] ESLint: 0 violations
- [ ] Bundle size < 550KB
- [ ] All Phase 2 components stable

### ✅ Phase 3 (Advanced)
- [ ] DataGrid evaluated + decision made
- [ ] Full compliance audit passed
- [ ] Production deployment checklist OK
- [ ] Team trained + confident

---

## 📊 Tracking & Status

### Weekly Standup Format
```
Week X Summary:
  ✅ Completed: [task, task]
  ⏳ In Progress: [task]
  🚧 Blockers: [issue]
  📊 Metrics: bundle +5KB, a11y 95/100
  Next: [tasks for next week]
```

### Status Dashboard (aggiorna in questo file)
```
FASE 2A: SETUP & CLEANUP
  [━━━━━━━━━━        ] 40% (Team approval done, audit in progress)
  
FASE 2B: POPOVER & MENU
  [               ] 0% (Starts 15 Gen)
  
FASE 2C: VALIDATION
  [               ] 0% (Starts 22 Gen)
  
FASE 3: ADVANCED
  [               ] 0% (Starts 29 Gen)
```

---

## 🔗 Riferimenti Documentazione

- **Architecture:** docs/DESIGN_SYSTEM_CONSOLIDATION.md
- **MUI Plan:** docs/MUI_INTEGRATION_ROADMAP.md
- **Tokens:** docs/DESIGN_TOKENS_AND_CHECKLIST.md
- **Guidelines:** .github/copilot-instructions_v2.md
- **Visual:** docs/VISUAL_ARCHITECTURE_SUMMARY.md

---

## 📌 Note Importanti

1. **Token-First Approach** — Tutte le decisioni partono dalla documentazione
2. **Dark Mode è Automatic** — Niente special code needed
3. **Accessibility is Non-Negotiable** — WCAG 2.1 AA on tutto
4. **Incremental** — Una cosa alla volta, validated prima di procedere
5. **Documentation is Source of Truth** — Copilot legge docs prima di agire

---

**Created:** 5 Gennaio 2026  
**Last Updated:** -  
**Owner:** Design System Team + Copilot  
**Status:** 🎯 Ready to Execute

