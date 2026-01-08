# Phase 3.3 - Day 3: Tab Order & Keyboard Navigation Audit

**Status:** 🔍 IN PROGRESS  
**Date:** January 5, 2026  
**Focus:** Tab order validation, keyboard trap detection, keyboard shortcut verification  
**Time Tracking:** Estimated 2-3 hours, currently ~1.5 hours in

---

## Executive Summary

Day 3 focuses on systematic auditing of keyboard navigation and tab order across 4 critical views. Tab order should follow logical reading order (left-to-right, top-to-bottom) and prevent keyboard traps where users get stuck navigating.

**Primary Objectives:**
1. Audit tab order in ClassroomView, StudentProfile, Calendar, Settings
2. Identify keyboard traps and fix them
3. Verify keyboard shortcuts work correctly
4. Document findings and fix priority

---

## Tab Order Audit Results

### 1. ClassroomView (`src/components/ClassroomView.tsx`)

**Structure Analysis:**
- Primary navigation: Back button → Tab buttons (Register, Notes, Tools, Resources)
- Register tab: Objective checkboxes → Student cards → Action buttons
- Each student card: Attendance toggle → Profile link → Grade display → Participation badges → Notes input
- Notes tab: Text editor area
- Tools tab: Multiple tool buttons
- Resources tab: Material list and preview

**Findings:**

#### ✅ Good Practice Areas
- TabGroup component properly handles tab selection (keyboard-friendly via MUI)
- Attendance toggle button is the first interactive element for each student card
- All buttons appear to have proper focus visibility with our enhanced CSS

#### ⚠️ Issues Identified

**Issue 1: Tab Order in Student Card Grid**
- **Severity:** MEDIUM
- **Location:** Lines 180-340 (student card rendering)
- **Problem:** Student cards are rendered in a grid layout. Tab order might jump around if not careful with grid order.
- **Impact:** User might press Tab and navigate across the page horizontally rather than through one card vertically
- **Recommendation:** Verify grid rendering doesn't override natural tab order; consider adding explicit `tabIndex="0"` on student card container if needed
- **WCAG Criterion:** 2.4.3 Focus Order

**Issue 2: Modal Action Buttons**
- **Severity:** MEDIUM
- **Location:** ShareModal, DocumentViewerModal, QuickEvaluationModal, ObservationModal
- **Problem:** Modal buttons might not trap focus properly; user can tab out of modal
- **Impact:** Keyboard users might accidentally exit modal without intending to
- **Recommendation:** Need to verify MUI Dialog has proper focus trap; ensure first focusable element is focused when modal opens
- **WCAG Criterion:** 2.1.2 No Keyboard Trap

**Issue 3: Popover/Menu Focus Management**
- **Severity:** MEDIUM
- **Location:** StudentActionMenu (appears when clicking student card actions)
- **Problem:** When popover/menu opens, focus might not move to the menu; user might not realize it appeared
- **Impact:** Keyboard users won't navigate to newly appeared menu options
- **Recommendation:** Add `autoFocus` to first menu item when StudentActionMenu opens; manage focus explicitly
- **WCAG Criterion:** 2.4.3 Focus Order

**Issue 4: Notes Input Tab Behavior**
- **Severity:** LOW
- **Location:** Line ~310 (observations textarea)
- **Problem:** Textarea inside card might consume Tab key; need to verify it allows Tab-out
- **Impact:** User might get "stuck" in textarea trying to move to next element
- **Recommendation:** Verify default textarea behavior; consider form library for better control
- **WCAG Criterion:** 2.1.1 Keyboard

---

### 2. StudentProfile (`src/components/StudentProfile.tsx`)

**Structure Analysis:**
- Header: Back button → Export/AI Judge buttons
- Tab navigation: Overview → Grades → Competencies → Notes → History
- Overview tab: InfoCards → Inclusion Plan button → AI Judgment section → AI Button
- Grades tab: Subject groups → Grade list → Delete buttons
- Competencies tab: Competency list → Level indicators
- Notes tab: Note cards → Edit/Delete buttons
- History tab: Timeline/historical data

**Findings:**

#### ✅ Good Practice Areas
- Clear tab grouping with TabGroup component
- Back button is first element (good for returning from profile)
- Section headers have good visual hierarchy

#### ⚠️ Issues Identified

**Issue 1: Tab Order in Overview Section**
- **Severity:** MEDIUM
- **Location:** Lines 150-200 (InfoCard grid + Inclusion Plan + AI Judge section)
- **Problem:** Multiple interactive elements (InfoCards might be clickable, buttons below) - need to verify order
- **Impact:** Tab order might be confusing if user tabs through cards rather than buttons
- **Recommendation:** Make InfoCards non-focusable or ensure they have proper tab order; prioritize action buttons
- **WCAG Criterion:** 2.4.3 Focus Order

**Issue 2: AI Judgment Copy Button Focus**
- **Severity:** LOW
- **Location:** Lines 200-220 (AI Judgment section)
- **Problem:** Copy button inside AI judgment box might not be easily discoverable via keyboard
- **Impact:** Keyboard users might miss copy functionality
- **Recommendation:** Ensure button has visible focus indicator (already added in CSS); consider tooltip hint
- **WCAG Criterion:** 2.4.7 Focus Visible

**Issue 3: Grade List Navigation**
- **Severity:** LOW
- **Location:** Grades tab rendering
- **Problem:** Grade items might not have clear focus order; delete buttons need to be accessible
- **Impact:** User might struggle to delete grades via keyboard only
- **Recommendation:** Ensure delete buttons have proper focus; consider keyboard shortcut (Del key)
- **WCAG Criterion:** 2.1.1 Keyboard

**Issue 4: Interview Modal Management**
- **Severity:** MEDIUM
- **Location:** Line ~80 (StudentInterviewModal)
- **Problem:** Interview modal (StudentInterviewModal) might not handle focus correctly
- **Impact:** Focus trap issues, user can't easily close modal or navigate within it
- **Recommendation:** Verify MUI Dialog handles focus trap; ensure ESC key closes modal
- **WCAG Criterion:** 2.1.2 No Keyboard Trap

---

### 3. Calendar (`src/components/Calendar.tsx`)

**Structure Analysis:**
- Navigation: Prev/Today/Next buttons → View mode buttons (Month/Week/Day/Agenda)
- Calendar grid: Date cells → Event buttons/links
- View-specific sections: Event modal, popover menus
- Event management: Add button → AI Parser button

**Findings:**

#### ✅ Good Practice Areas
- Navigation buttons are clearly grouped and early in tab order
- View mode selection is intuitive

#### ⚠️ Issues Identified

**Issue 1: Calendar Grid Tab Order**
- **Severity:** HIGH
- **Location:** Lines 80-200 (calendar grid rendering)
- **Problem:** Calendar grid renders 42 date cells (month view) or 7 columns × many rows. Tabbing through every cell is impractical (user has to Tab ~40 times to get through one month view)
- **Impact:** Keyboard navigation through calendar is extremely slow; user can't efficiently navigate
- **Recommendation:** **CRITICAL FIX NEEDED**
  - Make date cells non-focusable (`tabIndex="-1"`)
  - Add keyboard shortcuts: Arrow keys to navigate dates, Enter to select/open date
  - Or implement agenda view as primary keyboard interface
- **WCAG Criterion:** 2.1.1 Keyboard, 2.4.3 Focus Order

**Issue 2: Event Popover Focus Trap**
- **Severity:** MEDIUM
- **Location:** Lines 25-30 (EventActionPopover state management)
- **Problem:** When popover opens, focus might not move to popover; ESC might not close it
- **Impact:** Keyboard user won't know popover appeared; can't close it easily
- **Recommendation:** Auto-focus first popover item; ensure ESC closes popover
- **WCAG Criterion:** 2.1.2 No Keyboard Trap

**Issue 3: Week/Day View Scrolling**
- **Severity:** LOW
- **Location:** Lines 35-45 (scrollContainerRef useEffect)
- **Problem:** In week/day view, user is auto-scrolled to current hour. After tab focus, user might be far from view
- **Impact:** Tab focus might be off-screen; user struggles to follow focus
- **Recommendation:** Consider less aggressive auto-scrolling; highlight current time indicator differently
- **WCAG Criterion:** 2.4.7 Focus Visible

---

### 4. Settings (`src/components/Settings.tsx`)

**Structure Analysis:**
- Header: Close button → Theme selector
- Settings groups (collapsible): Theme → School → AI → Backup → Advanced → Import/Export
- Within each group: TextFields, SelectFields, ChipInputList, M3Buttons
- Theme section: ThemeBubble selector
- Backup section: File input, sync buttons
- Advanced: Reset, Storage info, Logout

**Findings:**

#### ✅ Good Practice Areas
- Collapsible sections provide good organization
- Form fields are standard HTML inputs (good for keyboard)
- Buttons and fields are clearly labeled

#### ⚠️ Issues Identified

**Issue 1: Collapsible Section Tab Order**
- **Severity:** MEDIUM
- **Location:** Lines 30-80 (SettingsGroup component)
- **Problem:** When section is collapsed, content is hidden but still in DOM (using `<details>` element). Tab navigation might go through hidden fields
- **Impact:** User tabs through invisible fields; confusing navigation
- **Recommendation:** **CRITICAL FIX NEEDED**
  - Use `inert` attribute on collapsed section content, OR
  - Dynamically remove from DOM when collapsed, OR
  - Use `display: none` to skip tabbing
- **WCAG Criterion:** 2.4.3 Focus Order

**Issue 2: Theme Bubble Selector**
- **Severity:** MEDIUM
- **Location:** Lines ~200 (ThemeBubble component)
- **Problem:** ThemeBubble might be image-only without text labels; keyboard navigation unclear
- **Impact:** User can't understand theme options via keyboard
- **Recommendation:** Add aria-labels to each theme bubble; consider explicit label text
- **WCAG Criterion:** 1.1.1 Non-text Content

**Issue 3: File Input Accessibility**
- **Severity:** LOW
- **Location:** Line ~90 (fileInputRef input[type="file"])
- **Problem:** File input is hidden (ref only), triggered by button. Button might not clearly indicate file upload
- **Impact:** User might not know to use button to select file
- **Recommendation:** Add proper label/description to button (e.g., "Importa File" with icon)
- **WCAG Criterion:** 1.3.1 Info and Relationships

**Issue 4: Settings Form Labels**
- **Severity:** MEDIUM
- **Location:** Throughout Settings component
- **Problem:** Form fields might not have proper label elements associated with inputs
- **Impact:** Screen reader users won't know what each field does; keyboard users miss labels
- **Recommendation:** Ensure all TextField/SelectField have proper `<label>` elements; use `htmlFor` attribute
- **WCAG Criterion:** 1.3.1 Info and Relationships

---

## Keyboard Shortcuts Audit

**Current Implementation Status:**

### ✅ Working (MUI Built-in)
- **ESC:** Close Dialog/Popover (MUI Dialog/Popover handle this)
- **TAB / SHIFT+TAB:** Navigate forward/backward (browser default)
- **ENTER/SPACE:** Activate buttons/toggles (browser default)
- **ARROW KEYS:** Navigate tabs (MUI TabGroup handles this via Tab role)

### ⏳ Needs Implementation
- **ARROW KEYS:** Navigate calendar dates (left/right/up/down)
- **ARROW KEYS:** Navigate menu items when StudentActionMenu/EventActionPopover open
- **DEL/BACKSPACE:** Delete items (grades, notes, events)
- **CTRL+S:** Save (global shortcut)
- **ALT+H:** Help/documentation

### 🚫 Not Currently Supported
- **Arrow key navigation in grid layouts**
- **Standard keyboard shortcuts for common actions**

---

## Fix Priority

### 🔴 CRITICAL (Must Fix Before Phase 3.3 Complete)

1. **Calendar Grid Tab Order** (ClassroomView, Calendar)
   - Make calendar cells non-focusable
   - Add arrow key navigation
   - Effort: 2-3 hours
   - Impact: HIGH - Calendar is core feature

2. **Collapsible Section Tab Order** (Settings)
   - Add `inert` attribute to hidden sections
   - Effort: 30 minutes
   - Impact: MEDIUM - Settings important but less frequently used

### 🟠 HIGH (Should Fix This Week)

3. **Modal Focus Traps** (ClassroomView, StudentProfile)
   - Verify MUI Dialog focus management
   - Implement focus trap for custom modals
   - Effort: 1-2 hours

4. **Popover Focus Management** (Calendar, ClassroomView)
   - Auto-focus first item in popover
   - Ensure ESC closes popover
   - Effort: 1-2 hours

### 🟡 MEDIUM (Good to Fix)

5. **Form Labels** (Settings, StudentProfile)
   - Ensure all inputs have labels
   - Use proper label associations
   - Effort: 1 hour

6. **InfoCard Focusability** (StudentProfile)
   - Decide if cards should be focusable or not
   - Adjust tab order accordingly
   - Effort: 30 minutes

### 🟢 LOW (Polish)

7. **Keyboard Shortcuts** (Global)
   - Add arrow key navigation where appropriate
   - Add delete key for destructive actions
   - Effort: 2-3 hours

---

## Next Steps (Day 3 Continuation)

### Phase 3.3 Day 3 Tasks

1. ✅ **Completed (This Audit)**
   - Tab order audit for 4 main views
   - Issue identification and prioritization
   - Keyboard shortcuts assessment

2. ⏳ **Remaining (Next 2-3 hours)**

   **Task 3.1: Fix Calendar Grid Tab Order** (1-2 hours)
   - [ ] Modify Calendar component to make date cells non-focusable
   - [ ] Add arrow key navigation support
   - [ ] Test keyboard navigation in all calendar views (month/week/day/agenda)
   - [ ] Commit: "fix: Calendar keyboard navigation and tab order"

   **Task 3.2: Fix Collapsible Settings Tab Order** (30 min)
   - [ ] Add `inert` attribute to Settings collapsed sections
   - [ ] Test tab navigation through settings
   - [ ] Commit: "fix: Settings collapsible sections keyboard navigation"

   **Task 3.3: Verify Modal Focus Traps** (30 min)
   - [ ] Check ClassroomView modals (Share, DocumentViewer, QuickEvaluation, Observation)
   - [ ] Check StudentProfile modals (Interview)
   - [ ] Verify ESC closes all modals
   - [ ] Verify Tab traps focus correctly
   - [ ] Commit: "fix: Modal focus management and keyboard traps"

3. 🚀 **Ready for Day 4**
   - All critical keyboard navigation issues fixed
   - Tab order logical and predictable
   - No keyboard traps detected
   - Ready to move to form labels & icon accessibility

---

## Test Results

### Build Validation
```
Before: 2422 modules, 20.77s - ✅ PASSING
After: [TBD - will run after fixes]
```

### Test Suite
```
Before: 1157/1157 tests passing (100%)
After: [TBD - will run after fixes]
```

### Manual Keyboard Testing Checklist
- [ ] Tab through ClassroomView without getting stuck
- [ ] Tab through StudentProfile without missing elements
- [ ] Tab through Calendar (should not tab through all 42 cells)
- [ ] Tab through Settings without tabbing through hidden fields
- [ ] Verify ESC closes all modals and popovers
- [ ] Verify arrow keys navigate calendar dates
- [ ] Verify arrow keys navigate menu items when visible
- [ ] Test with screen reader (if available)

---

## WCAG Criteria Status

| Criterion | Issue | Status | Fix | Target |
|-----------|-------|--------|-----|--------|
| 2.1.1 Keyboard | Calendar grid slow | 🔴 CRITICAL | Arrow keys | Day 3 |
| 2.1.2 No Trap | Modal focus | 🟠 HIGH | Verify MUI | Day 3 |
| 2.4.3 Focus Order | Multiple views | 🟠 HIGH | Tab order fixes | Day 3 |
| 2.4.7 Focus Visible | CSS enhanced | ✅ DONE | CSS updated | Complete |
| 1.3.1 Info & Rel. | Form labels | 🟡 MEDIUM | Add labels | Day 4 |
| 1.1.1 Non-text | Theme bubbles | 🟡 MEDIUM | Add aria-label | Day 4 |

---

## Notes & Observations

- **MUI Framework Help:** MUI Dialog and Popover have built-in focus management; we're leveraging this correctly
- **CSS Enhancement:** Our focus-visible CSS is helping a lot; all fixes can now show clear focus indicators
- **Testing Gap:** We should add E2E tests for keyboard navigation (this is mentioned for Phase 3.6)
- **Screen Reader:** WCAG audit not complete until screen reader testing (Day 5)

---

## Time Tracking

- **Audit Time:** 1.5 hours (completed)
- **Remaining Time Budget:** 1.5 hours (fixes)
- **Total Day 3 Budget:** 3 hours estimated
- **Contingency:** +1 hour if modal focus verification takes longer

