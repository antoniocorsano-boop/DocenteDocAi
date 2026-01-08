# Phase 3.3 - Accessibility Issues Tracker
## WCAG 2.1 AA Compliance Issues

**Document Type:** Issue Tracking & Resolution Log  
**Phase:** 3.3 (January 6-15, 2026)  
**Target:** 95%+ WCAG 2.1 AA Compliance  

---

## Issue Categories & Status

### 🔴 Critical Issues (Must Fix)
- Blocking major functionality
- Affects accessibility fundamentally
- Required for WCAG AA compliance

### 🟠 Major Issues (Should Fix)
- Affects multiple areas
- Impacts user experience
- Part of compliance path

### 🟡 Minor Issues (Nice to Have)
- Affects edge cases
- Low user impact
- Can be deferred

### ✅ Fixed / Resolved
- Completed issues
- Verified working
- Tested for regression

---

## Keyboard Navigation Issues

### KBD-001: Tab Order Not Logical
**Status:** 🔴 PENDING AUDIT  
**Severity:** Critical  
**Area:** Multiple views  

**Description:**
Tab navigation may not follow logical reading order in some complex views (ClassroomView, StudentProfile, Calendar).

**Impact:**
- Users cannot navigate efficiently with keyboard
- Difficult for keyboard-only users

**Resolution Steps:**
- [ ] Audit tab order in each view
- [ ] Document current order
- [ ] Implement proper tabindex values
- [ ] Test with keyboard
- [ ] Verify with screen reader

**Files Affected:**
- `src/components/ClassroomView.tsx`
- `src/components/StudentProfile.tsx`
- `src/components/Calendar.tsx`

**Assigned To:** TBD  
**Priority:** High  
**Estimated Time:** 2 hours

---

### KBD-002: No Skip Links
**Status:** 🟠 IN PROGRESS  
**Severity:** Major  
**Area:** App.tsx / Layout  

**Description:**
No "Skip to main content" link available. Users must tab through navigation to reach main content.

**Impact:**
- Keyboard users must tab multiple times
- WCAG 2.4.1 violation

**Resolution Steps:**
- [x] Create SkipLink component
- [x] Add styling (SkipLink.css)
- [ ] Integrate into App.tsx layout
- [ ] Test functionality
- [ ] Verify with keyboard

**Files Created:**
- `src/components/accessibility/SkipLink.tsx` ✅
- `src/components/accessibility/SkipLink.css` ✅

**Next Action:** Integrate SkipLink into App.tsx  
**Estimated Time:** 1 hour

---

### KBD-003: Arrow Keys Not Working in Lists
**Status:** 🔴 PENDING AUDIT  
**Severity:** Major  
**Area:** StudentManager, Calendar, Lists  

**Description:**
Arrow keys don't navigate list items (Down/Up/Home/End).

**Impact:**
- Not discoverable for keyboard users
- Expected behavior in accessibility

**Resolution Steps:**
- [ ] Create useKeyboardNavigation hook
- [ ] Implement in StudentManager list
- [ ] Implement in Calendar
- [ ] Implement in other list components
- [ ] Test with keyboard

**Estimated Time:** 3 hours

---

### KBD-004: Escape Key Not Closing Dialogs
**Status:** 🔴 PENDING AUDIT  
**Severity:** Critical  
**Area:** Modals, Popovers  

**Description:**
Pressing ESC may not close all modals/dialogs properly.

**Impact:**
- Keyboard users trapped
- Expected keyboard pattern violation

**Resolution Steps:**
- [ ] Audit all modals/popovers
- [ ] Verify ESC handling
- [ ] Test with multiple nested dialogs
- [ ] Fix any issues

**Estimated Time:** 1 hour

---

## Focus Management Issues

### FOCUS-001: No Visible Focus Indicators
**Status:** 🔴 PENDING AUDIT  
**Severity:** Critical  
**Area:** Entire app  

**Description:**
Focus indicators may not be visible or too subtle (especially in light theme).

**Impact:**
- Users cannot see where focus is
- WCAG 2.4.7 violation

**Resolution Steps:**
- [ ] Add focus styles to CSS
- [ ] Ensure 3:1 contrast on indicator
- [ ] Test on light/dark themes
- [ ] Test in high contrast mode

**CSS Changes Needed:**
```css
:focus-visible {
  outline: 2px solid #6750a4;
  outline-offset: 2px;
}
```

**Estimated Time:** 1 hour

---

### FOCUS-002: Focus Not Trapped in Modals
**Status:** 🟠 PENDING AUDIT  
**Severity:** Major  
**Area:** Modals  

**Description:**
Tab key may escape from modal, allowing focus on background elements.

**Impact:**
- Users confused when focus leaves modal
- WCAG 2.4.3 issue

**Resolution Steps:**
- [ ] Identify all modals
- [ ] Implement focus trap using react-focus-lock or similar
- [ ] Test with keyboard
- [ ] Verify focus returns on close

**Estimated Time:** 1 hour

---

### FOCUS-003: Focus Not Managed on Page Navigation
**Status:** 🟠 PENDING AUDIT  
**Severity:** Major  
**Area:** ViewManager  

**Description:**
When navigating between views, focus is not moved to new content (stays on button/link that triggered nav).

**Impact:**
- Users need to tab back to content
- Not obvious new content is available

**Resolution Steps:**
- [ ] Update ViewManager navigation handler
- [ ] Move focus to main content after nav
- [ ] Add aria-live announcement
- [ ] Test keyboard and screen reader

**Estimated Time:** 1 hour

---

## ARIA & Label Issues

### ARIA-001: Form Inputs Missing Labels
**Status:** 🔴 PENDING AUDIT  
**Severity:** Critical  
**Area:** StudentManager, Settings, Forms  

**Description:**
Some form inputs don't have associated `<label>` elements or `aria-label` attributes.

**Impact:**
- Screen readers can't identify input purpose
- WCAG 1.3.1 violation

**Resolution Steps:**
- [ ] Audit all forms
- [ ] Add label elements where needed
- [ ] Or add aria-label attributes
- [ ] Test with screen reader

**Forms to Audit:**
- StudentManager (student name, email, etc.)
- Settings form
- Lesson creation form
- Event creation form

**Estimated Time:** 2 hours

---

### ARIA-002: Buttons Missing Accessible Labels
**Status:** 🟠 PENDING AUDIT  
**Severity:** Major  
**Area:** Entire app  

**Description:**
Icon-only buttons don't have aria-label or title attributes.

**Impact:**
- Screen readers announce "button" instead of action
- Users don't know what button does

**Resolution Steps:**
- [ ] Identify all icon-only buttons
- [ ] Add aria-label to each
- [ ] Examples: Delete, Edit, More, etc.
- [ ] Test with screen reader

**Estimated Time:** 1 hour

---

### ARIA-003: No Live Regions for Updates
**Status:** 🟠 PENDING AUDIT  
**Severity:** Major  
**Area:** Notifications, Status updates  

**Description:**
Dynamic content updates (messages, errors, etc.) not announced to screen readers.

**Impact:**
- Screen reader users miss important updates
- WCAG 4.1.3 violation

**Resolution Steps:**
- [ ] Identify update areas
- [ ] Add aria-live="polite" regions
- [ ] Add aria-live="assertive" for errors
- [ ] Test with screen reader

**Estimated Time:** 1.5 hours

---

## Color & Contrast Issues

### COLOR-001: Color Contrast Verification
**Status:** 🟡 LIKELY COMPLIANT  
**Severity:** Medium  
**Area:** Design system  

**Description:**
Need to verify all text meets 4.5:1 contrast ratio for normal text, 3:1 for large text.

**Impact:**
- Low vision users may not read text
- WCAG 1.4.3 violation

**Resolution Steps:**
- [ ] Run Lighthouse contrast audit
- [ ] Review any failures
- [ ] Run axe-core contrast check
- [ ] Document results

**Estimated Time:** 1 hour

---

## Image & Icon Issues

### IMAGE-001: Missing Alt Text
**Status:** 🟠 PENDING AUDIT  
**Severity:** Major  
**Area:** Images, Icons  

**Description:**
Images and icons may not have alt text or may have inadequate descriptions.

**Impact:**
- Blind users can't understand images
- WCAG 1.1.1 violation

**Resolution Steps:**
- [ ] Audit all `<img>` tags
- [ ] Add descriptive alt text
- [ ] Mark decorative images with `alt=""`
- [ ] Test with screen reader

**Estimated Time:** 1 hour

---

### ICON-001: Material Symbols Icons Not Accessible
**Status:** 🟠 PENDING AUDIT  
**Severity:** Major  
**Area:** Icon buttons  

**Description:**
Material Symbols used as content or buttons need accessibility treatment.

**Impact:**
- Icons may be announced by screen readers
- Decorative icons may cause noise

**Resolution Steps:**
- [ ] Add aria-hidden="true" to decorative icons
- [ ] Add aria-label to icon buttons
- [ ] Test with screen reader

**Estimated Time:** 1 hour

---

## Mobile & Touch Issues

### TOUCH-001: Touch Targets Too Small
**Status:** 🟡 PENDING AUDIT  
**Severity:** Minor  
**Area:** Mobile  

**Description:**
Some interactive elements may be < 48x48px (mobile touch target minimum).

**Impact:**
- Difficult to tap on mobile (especially for motor impairments)
- WCAG 2.5.5 (Level AAA)

**Resolution Steps:**
- [ ] Measure touch targets
- [ ] Increase to 48x48px where needed
- [ ] Test on mobile

**Estimated Time:** 1 hour

---

## Progress Summary

### Issue Statistics

| Category | Critical | Major | Minor | Fixed |
|----------|----------|-------|-------|-------|
| Keyboard Navigation | 2 | 2 | 0 | 0 |
| Focus Management | 1 | 2 | 0 | 0 |
| ARIA & Labels | 1 | 2 | 0 | 0 |
| Color & Contrast | 0 | 0 | 1 | 0 |
| Images & Icons | 0 | 2 | 0 | 0 |
| Mobile | 0 | 0 | 1 | 0 |
| **TOTAL** | **4** | **8** | **2** | **0** |

### Compliance Progress

```
Target: 95%+ WCAG 2.1 AA
Current: ~70-75% (estimated)
Issues Identified: 14
Issues Fixed: 0
Issues In Progress: 2

Progress: ████░░░░░░░░░░░░░░░░░░░░ 15%
```

---

## Resolution Timeline

### Day 1-2 (Jan 6-7): Keyboard Navigation
- Audit tab order
- Add skip links
- Implement arrow key navigation
- Test escape handling

### Day 2-3 (Jan 7-8): Focus Management
- Add focus indicators
- Implement focus trap
- Fix focus on navigation

### Day 3-4 (Jan 8-9): ARIA & Labels
- Add form labels
- Add button labels
- Implement live regions

### Day 4-5 (Jan 9-10): Testing & Refinement
- Run automated audits
- Test with screen readers
- Fix remaining issues

---

## Notes

- **Team:** All developers should review this tracker
- **Communication:** Update status daily
- **Testing:** Peer review all accessibility changes
- **Documentation:** Add comments explaining accessibility fixes
- **Regression:** Run full test suite after each fix

---

## Links & References

- [PHASE_3_3_ACTION_PLAN.md](PHASE_3_3_ACTION_PLAN.md) - Detailed action plan
- [PHASE_3_3_ACCESSIBILITY_PLAN.md](PHASE_3_3_ACCESSIBILITY_PLAN.md) - Overview
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Practices Guide](https://www.w3.org/WAI/ARIA/apg/)

---

**Status:** 🚀 IN PROGRESS (January 6, 2026)  
**Last Updated:** January 6, 2026  
**Next Review:** Daily
