# MD3 Component Inventory

**Date:** January 17, 2026  
**Status:** 📊 ACTIVE - Component Analysis Complete  
**Framework:** PHASE_2_MD3_FRAMEWORK.md

---

## Executive Summary

**Total Components:** 250+ TSX files  
**MD3 Compliant:** ~30% (estimated)  
**Migration Priority:** High-impact user-facing components first

---

## Component Classification

### 🟢 MD3 Compliant Components (Priority: Maintain)

#### Core M3 Components (100% MD3)

- `M3Button.tsx` - Core button component
- `M3Card.tsx` - Surface container component
- `M3Chip.tsx` - Selection component
- `M3Dialog.tsx` - Modal container
- `M3Typography.tsx` - Text styling component
- `M3IconButton.tsx` - Icon action component
- `M3ListItem.tsx` - List item component
- `M3Menu.tsx` - Dropdown menu component
- `M3Popover.tsx` - Floating content
- `M3DatePicker.tsx` - Date selection
- `M3RatingBar.tsx` - Rating input
- `M3BottomAppBar.tsx` - Navigation bar

#### Recently Migrated (Sprint 1.2)

- `ClassPlanningWizard.tsx` - Complex planning interface ✅
- `PassaggioAnnoWizard.tsx` - Year transition wizard ✅
- `VideoAnalysisModal.tsx` - Media analysis modal ✅
- `SlotActionModal.tsx` - Schedule action modal ✅
- `RegisterImportDialog.tsx` - Data import dialog ✅
- `CreateLessonFromAiModal.tsx` - AI lesson creation ✅
- `EditSlotModal.tsx` - Schedule editing ✅
- `Home.tsx` - Main dashboard ✅
- `ClassSelection.tsx` - Class picker ✅
- `ClassCompetencyDashboard.tsx` - Competency view ✅
- `Calendar.tsx` - Date navigation ✅

### 🟡 Mixed Usage Components (Priority: Convert When Modified)

#### High-Priority User-Facing (Convert Next)

- `StudentManager.tsx` - Student administration
- `ClassroomView.tsx` - Main teaching interface
- `AnalyticsHub.tsx` - Data visualization
- `ProgettazioneHub.tsx` - Planning interface
- `ReportisticaHub.tsx` - Reporting system
- `EvaluationModule.tsx` - Assessment system
- `LessonView.tsx` - Lesson display
- `StudentProfile.tsx` - Student details
- `Timetable.tsx` - Schedule display

#### Medium-Priority Utility

- `ImportStudentsModal.tsx` - Data import
- `UdaPlanner.tsx` - Unit planning
- `TemplateManager.tsx` - Template system
- `KnowledgeBase.tsx` - Content management
- `Settings.tsx` - Configuration
- `HelpModal.tsx` - User assistance

#### Low-Priority Internal

- `AssistantModal.tsx` - AI assistant
- `BackupInfoModal.tsx` - System backup
- `ErrorLogsDashboard.tsx` - System monitoring
- `SyncConflictModal.tsx` - Data synchronization

### 🔴 Legacy Components (Priority: Migrate During Refactoring)

#### Complex Layout Components

- `AnnualPlanningWizard.tsx` - Annual planning (high complexity)
- `ConsiglioClasseWizard.tsx` - Council wizard (high complexity)
- `BatchExportWizard.tsx` - Export system (high complexity)
- `PianoInclusioneEditor.tsx` - Inclusion plan editor
- `RubricEditor.tsx` - Assessment rubric editor
- `SmartDocumentEditor.tsx` - Document editor

#### Data Visualization

- `AdvancedCharts.tsx` - Chart components
- `BarChart.tsx` - Data visualization
- `DonutChart.tsx` - Circular charts
- `TimelineView.tsx` - Time-based views
- `GanttBar.tsx` - Project timeline

#### Modal/Dialog Components

- `UnifiedEvaluationModal.tsx` - Assessment modal
- `StudentTransferModal.tsx` - Student transfer
- `UdaExportModal.tsx` - Export modal
- `ImageGeneratorModal.tsx` - AI image generation
- `IdeaGeneratorModal.tsx` - Idea generation
- `TestGeneratorModal.tsx` - Test creation

#### Form Components

- `AddStudentModal.tsx` - Student addition
- `AddProvaModal.tsx` - Assessment addition
- `QuickEvaluationModal.tsx` - Quick assessment
- `CompetencyEvaluationModal.tsx` - Competency assessment

---

## Error Distribution by Component Type

### Components with 1-5 Errors (High Priority - 10 files)

**Target:** Quick wins, migrate this week

- Files with single errors (easiest to fix)
- Low-risk, high-confidence migrations

### Components with 6-15 Errors (Medium Priority - ~50 files)

**Target:** 1-2 per week ongoing

- Moderate complexity
- Require careful analysis
- Good learning opportunities

### Components with 15+ Errors (Low Priority - ~100 files)

**Target:** Migrate during major refactoring

- High complexity
- Significant testing required
- Batch migration candidates (future)

---

## Migration Priority Matrix

### Priority 1: Critical User Journeys

**Impact:** High | **Risk:** Medium | **Timeline:** Immediate

- `ClassroomView.tsx` - Main teaching interface
- `StudentManager.tsx` - Student administration
- `EvaluationModule.tsx` - Assessment system
- `Home.tsx` - Main dashboard
- `Calendar.tsx` - Navigation

### Priority 2: Core Business Features

**Impact:** High | **Risk:** Medium | **Timeline:** Week 2-4

- `ProgettazioneHub.tsx` - Planning system
- `ReportisticaHub.tsx` - Reporting
- `AnalyticsHub.tsx` - Analytics
- `LessonView.tsx` - Content delivery
- `Timetable.tsx` - Scheduling

### Priority 3: Supporting Features

**Impact:** Medium | **Risk:** Low | **Timeline:** Week 4-6

- Modal components (various)
- Utility components
- Administrative features
- Internal tools

### Priority 4: Advanced Features

**Impact:** Low | **Risk:** High | **Timeline:** Future sprints

- Complex wizards
- Advanced editors
- Specialized tools
- Experimental features

---

## Component Dependencies

### Shared Dependencies (Migration Order Matters)

1. **Base Components** (migrate first)
   - M3\* components (already compliant)
   - Basic form components
   - Layout primitives

2. **Composite Components** (migrate second)
   - Components using base components
   - Feature-specific assemblies
   - Page-level components

3. **Page Components** (migrate last)
   - Full page layouts
   - Complex stateful components
   - Integration-heavy components

### CSS Dependencies

**External Stylesheets:** Some components reference custom CSS classes

- `aura-view-wrapper` (AuraView.tsx)
- `help-modal-*` (HelpModal.tsx)
- `student-profile-*` (StudentProfile.tsx)

**Migration Note:** These require CSS analysis before conversion

---

## Weekly Migration Targets

### Week 1: Framework Setup (Current)

- [ ] Complete component inventory analysis
- [ ] Select 3 pilot components
- [ ] Execute pilot migrations
- [ ] Document lessons learned

### Week 2: Priority 1 Components

**Target:** 2-3 components migrated

- [ ] Select based on error count and impact
- [ ] Migrate with full testing
- [ ] Update inventory
- [ ] Share patterns with team

### Week 3-4: Priority 2 Components

**Target:** 1-2 components per week

- [ ] Continue systematic migration
- [ ] Monitor error reduction
- [ ] Adjust strategy as needed

### Week 5-6: Consolidation

**Target:** Address remaining high-impact components

- [ ] Focus on user-facing components
- [ ] Achieve 50% error reduction goal
- [ ] Prepare for Phase 3 planning

---

## Success Metrics

### Quantitative Metrics

- **Error Reduction:** Target 50% (4,662 errors from 4,842)
- **Component Coverage:** 75% MD3 compliant
- **Migration Velocity:** 1-2 components/week sustained

### Qualitative Metrics

- **Build Stability:** Zero regression incidents
- **Team Adoption:** All new code MD3 compliant
- **Code Quality:** Pre-commit hooks 100% pass rate
- **User Experience:** Visual consistency maintained

---

## Risk Assessment

### Technical Risks

- **Component Breakage:** Mitigated by pre-commit hooks and testing
- **Visual Regression:** Addressed by screenshot comparison
- **Performance Impact:** Monitored via build metrics

### Process Risks

- **Timeline Slippage:** Managed by weekly targets and buffers
- **Team Burnout:** Prevented by sustainable pace
- **Knowledge Gaps:** Addressed by documentation and training

---

## Next Steps

1. **Immediate:** Complete pilot migrations (3 components)
2. **This Week:** Update inventory with migration results
3. **Next Week:** Begin Priority 1 component migration
4. **Ongoing:** Weekly progress tracking and adjustment

---

**Inventory Status:** 📊 ACTIVE - Analysis Complete  
**Last Updated:** January 17, 2026  
**Next Update:** After Week 1 Pilot Migrations</content>
<parameter name="filePath">c:\Users\anton\DocenteDocAI-Flowise\docentedoc-ai\MD3_COMPONENT_INVENTORY.md
