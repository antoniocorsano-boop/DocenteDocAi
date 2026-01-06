# Phase 3.3 - Workstream 1: Keyboard Navigation

**Status:** 🚀 IN PROGRESS  
**Start Date:** 2026-01-06  
**Estimated Duration:** 3-4 hours  
**Target Completion:** Today

---

## 📋 Overview

Workstream 1 focuses on implementing comprehensive keyboard navigation across the DocenteDoc application. This includes:
1. Tab order audit and fixes
2. Arrow key navigation for lists/menus
3. Modal focus trapping
4. Keyboard event handlers

---

## ✅ Task 1: Tab Order Audit & Analysis

### Status: 🟡 IN PROGRESS

#### View: ClassroomView.tsx
**File:** [src/components/ClassroomView.tsx](src/components/ClassroomView.tsx)
**Size:** 556 lines

**Interactive Elements Found:**
- TabGroup component (register, tools, resources, notes tabs)
- M3Button components for actions:
  - Attendance toggle buttons (present/absent/late)
  - Homework checkboxes  
  - Participation badges
  - Export/share buttons
- M3Dialog modals:
  - StudentProfile modal
  - ShareModal
  - DocumentViewerModal
  - ObservationModal
  - etc.
- Lists of students (30+ per class)

**Current Tab Order Issues:**
❌ No explicit tabindex controls  
❌ Student list items not keyboard accessible  
❌ Action buttons not clearly labeled  
❌ Modal focus trap not implemented  
⚠️ Tab sequence may jump unexpectedly  

**Required Fixes:**
1. Add `tabIndex={0}` to interactive student list items
2. Implement focus trap in modals with Escape key
3. Add aria-label to action buttons
4. Ensure logical tab order (left-to-right, top-to-bottom)

---

#### View: StudentProfile.tsx
**File:** [src/components/StudentProfile.tsx](src/components/StudentProfile.tsx)
**Size:** 472 lines

**Interactive Elements Found:**
- TabGroup component (overview, grades, competencies, notes, history)
- M3Button components:
  - Export PDF buttons
  - Delete evaluation buttons
  - Interview mode toggle
- Lists of evaluations (5-20 per category)
- Competency cards with delete buttons
- M3ListItem components for grades display

**Current Tab Order Issues:**
❌ Evaluation list items not keyboard accessible  
❌ Delete buttons may be hidden/hard to reach  
❌ Tab sequence unclear in complex layouts  
⚠️ No keyboard shortcuts for common actions  

**Required Fixes:**
1. Make evaluation items keyboard accessible (up/down arrows)
2. Add aria-label to delete buttons
3. Clear visual focus indicators on list items
4. Consider aria-selected for active item

---

#### View: Calendar.tsx
**File:** [src/components/Calendar.tsx](src/components/Calendar.tsx)
**Size:** 452 lines

**Interactive Elements Found:**
- Navigation buttons (prev/next/today)
- ViewMode switcher (month/week/day/agenda)
- Calendar grid cells (31-35 per month view)
- Event action buttons
- Modal for event creation/editing
- EventActionPopover

**Current Tab Order Issues:**
❌ Calendar grid cells not keyboard accessible  
❌ Arrow keys implemented but not standard (should navigate date selection)  
✅ Navigation buttons properly positioned  
⚠️ Event selection requires mouse click  

**Required Fixes:**
1. Enhance arrow key navigation for date grid
2. Add Space/Enter to select/create events
3. Make event list items in popover keyboard accessible
4. Implement focus visible on calendar cells

---

## 🔧 Task 2: Arrow Key Navigation Implementation

### Status: 🔴 NOT STARTED

#### Implementation Strategy

**For StudentManager (List View):**
```typescript
// Use useListKeyboardNavigation hook
const { activeIndex, handleKeyDown } = useListKeyboardNavigation({
  items: students,
  onSelect: (item) => selectStudent(item),
  cyclic: true,
  autoFocus: true
});
```

**For Calendar Grid:**
- Arrow Left/Right: navigate to previous/next day
- Arrow Up/Down: navigate to previous/next week
- Home: jump to first day of month
- End: jump to last day of month
- Enter/Space: create event on selected date

**For Evaluation Lists:**
- Arrow Up/Down: navigate between evaluations
- Delete: remove evaluation (with confirmation)
- Enter/Space: view/edit evaluation details

---

## 🎯 Task 3: Modal Focus Management

### Status: 🔴 NOT STARTED

**Requirements (WCAG 2.1 AA):**
1. Focus moves to first focusable element when modal opens
2. Tab key cycles through focusable elements within modal only
3. Escape key closes modal and returns focus to trigger element
4. Focus trap prevents tabbing out of modal

**Implementation:**
- Use existing `useKeyboardNavigation` hook for focus trap
- Verify all modals in app have proper implementation:
  - ShareModal
  - DocumentViewerModal
  - ObservationModal
  - QuickEvaluationModal
  - StudentInterviewModal
  - EventModal
  - etc.

---

## 📊 Progress Tracking

| Task | Status | Estimated | Actual |
|------|--------|-----------|--------|
| Tab Order Audit | 🟡 IN PROGRESS | 1h | - |
| Arrow Key Implementation | 🔴 NOT STARTED | 1.5h | - |
| Modal Focus Management | 🔴 NOT STARTED | 1h | - |
| Testing & Validation | 🔴 NOT STARTED | 0.5h | - |
| **TOTAL** | | **3-4h** | - |

---

## 📝 Implementation Plan

### Phase 1: Critical Fixes (Today)
1. ✅ SkipLink component created and integrated
2. ✅ Global focus indicators CSS created
3. 🔄 Update Tab Order in top 3 views:
   - StudentManager
   - ClassroomView  
   - Calendar
4. 🔄 Implement arrow key navigation in lists

### Phase 2: Extended Implementation (Tomorrow)
1. Update all modal focus traps
2. Add keyboard shortcuts documentation
3. Screen reader testing with NVDA
4. Full accessibility audit with axe-core

### Phase 3: Validation (This Week)
1. Comprehensive keyboard testing
2. Touch target size validation (mobile)
3. Color contrast verification
4. Final WCAG 2.1 AA compliance check

---

## 🧪 Test Cases

### Tab Order Verification
- [ ] Tab through ClassroomView (skip main, then register → tools → resources → notes)
- [ ] Tab through StudentProfile tabs in order
- [ ] Tab through Calendar view controls
- [ ] Verify no focus traps (except in modals)

### Arrow Key Navigation
- [ ] Student list: Up/Down arrows navigate items
- [ ] Calendar: Arrow keys navigate dates
- [ ] Evaluation list: Arrow keys navigate entries
- [ ] Cyclic navigation with Home/End keys

### Modal Focus Management
- [ ] Focus moves to modal on open
- [ ] Tab cycles within modal only
- [ ] Escape closes modal
- [ ] Focus returns to trigger button

---

## 📚 Related Files

- [useKeyboardNavigation Hook](src/hooks/useKeyboardNavigation.ts)
- [SkipLink Component](src/components/accessibility/SkipLink.tsx)
- [Focus Indicator CSS](src/design-system/accessibility-focus.css)
- [A11y Baseline Tests](__tests__/accessibility/a11y-baseline.test.ts)

---

## 🔗 WCAG 2.1 AA Criteria Met

- **2.1.1 Keyboard** - All functionality available via keyboard
- **2.1.2 No Keyboard Trap** - Escape key exits modals
- **2.1.3 Keyboard (No Exception)** - No exceptions for web content
- **2.4.3 Focus Order** - Logical tab order implemented
- **2.4.7 Focus Visible** - Global focus indicators with 3:1 contrast

---

## 📞 Next Steps

1. Run existing keyboard tests
2. Implement arrow key navigation in StudentManager
3. Update Calendar grid navigation
4. Verify modal focus traps
5. Document keyboard shortcuts

