# Documentation Reorganization Plan

**Date:** January 11, 2026  
**Status:** In Progress  
**Responsible:** AI Assistant  

## Objective
Reorganize all .md files from the repository root into a logical `docs/` structure with categories: guides/, reference/, workflow/, archive/.

## Steps

### Phase 1: Infrastructure Setup ✅
- [x] Create `docs/` folder structure (guides, reference, workflow, archive)
- [x] Create this plan document in `docs/workflow/`

### Phase 2: File Movement ✅
- [x] Move guide documents to `docs/guides/`
- [x] Move reference documents to `docs/reference/`
- [x] Move workflow documents to `docs/workflow/`
- [x] Move archive documents to `docs/archive/`

### Phase 3: Content Updates ✅
- [x] Add `<!-- AUTO-GENERATED, DO NOT EDIT -->` to workflow docs (LINT_SESSION_STATUS.md, TEST_SUITE_SUMMARY.md)
- [x] Create `docs/README.md` with index of all documents

### Phase 4: Validation ✅
- [x] Verify all files moved correctly
- [x] Update main README.md links if needed
- [x] Test that no broken links exist

### Phase 5: Cleanup ✅
- [x] Remove any empty folders in root (none found)
- [x] Commit changes with descriptive message (documentation reorganization complete)

## File Lists

### Guides (14 files)
CONTRIBUTING.md, CONTRIBUTING_STYLING.md, DEMO_PLAYBOOK.md, E2E_SPA_TESTING_GUIDE.md, LINT_EXECUTION_GUIDE.md, ONBOARDING_GUIDE_COMPLEX_APPS.md, PRESENTATION_README.md, QUICK_DEPLOY.md, QUICK_REFERENCE.md, README_DEPLOYMENT.md, README_PHASE_3.4.md, STORYBOOK_DEPLOYMENT.md, STORYBOOK_MIGRATION_PLAN.md, TYPOGRAPHY_ELEVATION_REFACTOR_GUIDE.md, UI_STACK_MIGRATION_PLAN.md

### Reference (8 files)
DESIGN_TOKEN_MAP_M3.md, FILE_FONDAMENTALI.md, M3_HOME_REF.md, MD3_DEVELOPMENT_GUIDE.md, ROADMAP_2026.md, UI_STACK_ANTIPATTERNS.md, UI_STACK_CRITICAL_REVIEW.md, UI_UNIFORMITY_AUDIT_POST_M3_MIGRATION.md

### Workflow (18 files)
CHECKLIST_MODALS_M3.md, CHECKLIST_POST_M3.md, CONFIGURAZIONE_APP.md, FINAL_POLISH_CSS_INTERACTIONS.md, LINT_REFACTOR_PLAN.md, LINT_SESSION_STATUS.md, M3_EXPRESSIVE_HARMONIZATION_PLAN.md, M3_MIGRATION_CHECKLIST.md, PIANO_M3_EXPRESSIVE_REFACTOR.md, PIANO_MIGLIORAMENTO.md, PLAN_EMOTIONAL_PRESETS.md, SETTINGS_REDESIGN_DOCUMENT_DRIVE.md, TEST_SUITE_SUMMARY.md, TOKEN_IMPACT_REPORT.md, TODO.md, TODO_E2E_SPA_PLAN.md, TODO_EMOTIONAL_PRESETS_FIX.md, TODO_PRIORITARI.md

### Archive (13 files)
ANALISI_CONTESTO_DOCENTEDOC.md, BUNDLE_BASELINE_ANALYSIS.md, BUNDLE_SIZE_METRICS.md, CHANGELOG.md, HOTFIX_404_STORYBOOK.md, HOTFIX_SCHEDULER.md, HOTFIX_WHITSCREEN_FIXED.md, Home_Landing_Page_Analysis.md, STATO_ATTUALE.md, STATUS.md, design_foundation.md, DESIGN_PERVASIVENESS_TODO.md, md_3_stato_dellarte_roadmap_e_tracciamento.md

## Notes
- Keep README.md in root
- Move copilot-instructions.md to docs/guides/ or keep in .github/
- Total files to move: 53</content>
<parameter name="filePath">c:\Users\anton\DocenteDocAI-Flowise\docentedoc-ai\docs\workflow\DOCUMENTATION_REORGANIZATION_PLAN.md