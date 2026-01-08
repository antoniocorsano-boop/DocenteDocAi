# Phase 3.3 - Accessibility Action Plan
## WCAG 2.1 AA Compliance (95%+ Target)

**Start Date:** January 6, 2026  
**Target Completion:** January 10-15, 2026 (1-2 weeks)  
**Current Status:** 🚀 IN PROGRESS  

---

## Executive Summary

Phase 3.3 focuses on systematic accessibility improvements to achieve 95%+ WCAG 2.1 AA compliance. The approach is divided into 6 major work streams, each with specific, measurable tasks.

### Current State
- **Estimated Compliance:** ~70-75% WCAG 2.1 AA
- **Test Infrastructure:** ✅ Set up (axe-core, vitest)
- **Tools Installed:** ✅ axe-core, axe-cli, @axe-core/playwright
- **Baseline Tests:** ✅ Created (09 test categories)
- **Next:** Systematic auditing and fixes

---

## Phase 3.3 Workstreams

### Workstream 1: Keyboard Navigation ⌨️
**Estimated Time:** 3-4 hours  
**Priority:** 🔴 HIGH (foundational)

#### Tasks

**1.1: Verify Tab Order** (1 hour)
- [ ] Test Tab navigation in all major views
  - [ ] Home/FlowMode
  - [ ] ClassDashboard
  - [ ] ClassroomView
  - [ ] StudentProfile
  - [ ] Forms (Register, Evaluations)
- [ ] Verify logical reading order (left-to-right, top-to-bottom)
- [ ] Document any tab order issues

**1.2: Test Escape Key Handling** (45 min)
- [ ] ESC closes all modals/popovers
- [ ] ESC closes all drawers
- [ ] Verify in all dialog types
- [ ] Test nested dialogs (if applicable)

**1.3: Implement Arrow Key Navigation** (1.5 hours)
- [ ] List/Menu navigation with Arrow keys
  - [ ] Down Arrow: next item
  - [ ] Up Arrow: previous item
  - [ ] Home/End: first/last item
- [ ] Test in StudentManager list
- [ ] Test in Calendar
- [ ] Test in any list-based views

**1.4: Test for Keyboard Traps** (1 hour)
- [ ] Run automated tests with axe-core
- [ ] Manual testing: ensure user can always escape
- [ ] Document any traps found
- [ ] Plan fixes

#### Success Criteria
- ✅ All interactive elements reachable via keyboard
- ✅ No keyboard traps identified
- ✅ Escape key closes modals/dialogs
- ✅ Tab order follows logical flow

---

### Workstream 2: Focus Management 👁️
**Estimated Time:** 2-3 hours  
**Priority:** 🔴 HIGH (visibility critical)

#### Tasks

**2.1: Add Visible Focus Indicators** (1 hour)
- [ ] Update CSS for focus styles (`:focus-visible`)
- [ ] Ensure 3:1 contrast on focus indicators
- [ ] Test on light & dark themes
- [ ] Verify visible in all views

**2.2: Implement Focus Trapping in Modals** (1 hour)
- [ ] When modal opens: focus moves to modal
- [ ] Tab cycles within modal only (doesn't escape)
- [ ] When modal closes: focus returns to trigger button
- [ ] Test with multiple nested modals

**2.3: Fix Focus on Page Navigation** (1 hour)
- [ ] When navigating between views: focus moves to main content
- [ ] Announce view change to screen readers
- [ ] Test with keyboard and screen reader

#### Success Criteria
- ✅ Focus indicators visible on all interactive elements
- ✅ Focus properly managed in modals
- ✅ Focus not stuck or lost on navigation
- ✅ Min 3:1 contrast on focus indicators

---

### Workstream 3: ARIA Labels & Semantic HTML 🏷️
**Estimated Time:** 4-5 hours  
**Priority:** 🟠 MEDIUM-HIGH (screen reader support)

#### Tasks

**3.1: Add Labels to Form Fields** (1.5 hours)
- [ ] Audit all form inputs
- [ ] Add associated `<label>` elements
- [ ] Or add `aria-label` attributes
- [ ] Mark required fields with `aria-required="true"`
- [ ] Test in forms:
  - [ ] Student Manager
  - [ ] Settings
  - [ ] Lesson Creation
  - [ ] Event Creation

**3.2: Add Accessible Button Labels** (1 hour)
- [ ] Icon-only buttons need `aria-label` or `title`
- [ ] Check all action buttons
- [ ] Test with screen reader
- [ ] Examples: Delete, Edit, Save, Cancel

**3.3: Implement Live Regions** (1 hour)
- [ ] Add `aria-live="polite"` for notifications
- [ ] Add `aria-live="assertive"` for errors
- [ ] Test with screen reader
- [ ] Verify announcements work

**3.4: Fix Semantic HTML** (1 hour)
- [ ] Verify proper heading hierarchy (h1 → h2 → h3)
- [ ] Use semantic elements: `<main>`, `<nav>`, `<footer>`
- [ ] Use `<button>` for buttons (not `<div>`)
- [ ] Use `<input>` with proper type attributes

#### Success Criteria
- ✅ All form inputs have associated labels
- ✅ All buttons have accessible labels
- ✅ Proper semantic HTML used throughout
- ✅ Live regions announce updates
- ✅ Screen readers can navigate all content

---

### Workstream 4: Color Contrast & Visual Design 🎨
**Estimated Time:** 2-3 hours  
**Priority:** 🟠 MEDIUM (most likely already compliant)

#### Tasks

**4.1: Verify Color Contrast** (1 hour)
- [ ] Run Lighthouse accessibility audit
- [ ] Use axe-core to check color contrast
- [ ] Verify 4.5:1 ratio for normal text
- [ ] Verify 3:1 ratio for large text & UI components
- [ ] Generate report of any issues

**4.2: Don't Rely on Color Alone** (1 hour)
- [ ] Status indicators use icons + color
- [ ] Errors have icons/symbols + text
- [ ] Required fields: * + text (not just red)
- [ ] Test in monochrome to verify

**4.3: High Contrast Mode Support** (1 hour)
- [ ] Test with Windows High Contrast mode
- [ ] Ensure borders/outlines visible in HC mode
- [ ] Icons should work in HC mode
- [ ] Text remains readable

#### Success Criteria
- ✅ All text meets WCAG AA contrast requirements
- ✅ Information not conveyed by color alone
- ✅ Supports high contrast mode

---

### Workstream 5: Images, Icons & Media 🖼️
**Estimated Time:** 2-3 hours  
**Priority:** 🟠 MEDIUM

#### Tasks

**5.1: Add Alt Text to Images** (1 hour)
- [ ] Audit all `<img>` tags
- [ ] Add descriptive alt text
- [ ] Decorative images: `alt=""`
- [ ] Linked images: describe link target
- [ ] Test with screen reader

**5.2: Handle Icon Accessibility** (1 hour)
- [ ] Icons-only buttons: `aria-label` required
- [ ] Decorative icons: `aria-hidden="true"`
- [ ] Material Symbols review:
  - [ ] Buttons using icons: need labels
  - [ ] Decorative: mark as hidden
  - [ ] Inline icons in text: verify readable

**5.3: Test with Screen Readers** (1 hour)
- [ ] Test with NVDA (free, Windows)
- [ ] Verify icons announced correctly
- [ ] Verify images described properly
- [ ] Test link text clarity

#### Success Criteria
- ✅ All images have appropriate alt text
- ✅ Icons properly labeled or hidden
- ✅ Screen reader can navigate all content
- ✅ No screen reader errors

---

### Workstream 6: Mobile & Touch Accessibility 📱
**Estimated Time:** 1-2 hours  
**Priority:** 🟡 MEDIUM (lower priority than keyboard)

#### Tasks

**6.1: Verify Touch Target Sizes** (45 min)
- [ ] All interactive elements: min 48x48 CSS pixels
- [ ] Check buttons, form controls, links
- [ ] Increase size if needed (padding or min-width/height)
- [ ] Test on mobile viewport

**6.2: Screen Reader on Mobile** (45 min)
- [ ] Test with TalkBack (Android)
- [ ] Test with VoiceOver (iOS)
- [ ] Verify labels work on mobile
- [ ] Check gesture support

#### Success Criteria
- ✅ Touch targets meet 48x48 minimum
- ✅ Mobile screen readers work
- ✅ Gestures accessible

---

## Implementation Sequence

### Day 1-2: Keyboard Navigation
1. Run keyboard navigation tests
2. Fix tab order issues
3. Implement arrow keys in lists
4. Test escape key handling
5. Document findings

### Day 2-3: Focus & Modals
1. Add visible focus indicators
2. Implement focus trap in modals
3. Fix focus on navigation
4. Test with keyboard

### Day 3-4: ARIA & Semantic HTML
1. Add form labels
2. Add button labels
3. Implement live regions
4. Fix semantic HTML

### Day 4-5: Visual & Testing
1. Run color contrast audit
2. Test high contrast mode
3. Add alt text
4. Test with screen readers

### Day 5: Mobile & Refinement
1. Check touch target sizes
2. Test on mobile devices
3. Final screen reader validation
4. Generate compliance report

---

## Testing Checklist

### Automated Tests
- [ ] Run axe-core scan (`npx axe http://localhost:5173`)
- [ ] Run Lighthouse audit
- [ ] Run vitest accessibility suite
- [ ] Generate accessibility report

### Manual Tests - Keyboard

#### Windows
- [ ] Tab key navigation
- [ ] Shift+Tab backwards
- [ ] Enter key activation
- [ ] Space key activation
- [ ] Escape key close
- [ ] Arrow keys (lists)

#### Mac
- [ ] Same as above
- [ ] Test with VoiceOver (Cmd+F5)

### Manual Tests - Screen Reader

#### NVDA (Windows)
- [ ] Install NVDA (free, open-source)
- [ ] Enable NVDA
- [ ] Navigate using arrow keys
- [ ] Check form labels announced
- [ ] Check button labels announced
- [ ] Check error messages announced

#### VoiceOver (Mac/iOS)
- [ ] Enable VoiceOver (Cmd+F5)
- [ ] Navigate pages
- [ ] Verify announcements

### Manual Tests - Visual

- [ ] Check focus indicators visible
- [ ] Check color contrast (light/dark mode)
- [ ] Check high contrast mode (Windows)
- [ ] Check with zoom (up to 200%)
- [ ] Check with browser text scaling

---

## Resources & Tools

### Automated Testing
```bash
# Install tools (already done)
npm install --save-dev @axe-core/cli axe-core @axe-core/playwright

# Run axe CLI scan
npx axe http://localhost:5173

# Run Lighthouse
npx lighthouse http://localhost:5173 --view

# Run vitest accessibility suite
npm test -- __tests__/accessibility/a11y-baseline.test.ts
```

### Screen Readers
- **NVDA** (Windows): https://www.nvaccess.org/
- **JAWS** (Windows, commercial): https://www.freedomscientific.com/products/software/jaws/
- **VoiceOver** (Mac/iOS): Built-in
- **TalkBack** (Android): Built-in

### Browser Tools
- Chrome DevTools → Lighthouse
- Chrome DevTools → Accessibility Inspector
- Firefox Accessibility Inspector
- axe DevTools browser extension

### Documentation
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/)
- [WebAIM](https://webaim.org/)
- [Deque University](https://dequeuniversity.com/)

---

## Compliance Targets

### WCAG 2.1 AA Requirements (All Must Meet)

| Requirement | Current | Target | Status |
|-------------|---------|--------|--------|
| Level A Compliance | ~95% | 100% | ✓ |
| Level AA Compliance | ~70-75% | 95%+ | 🚀 |
| Keyboard Navigation | ~80% | 100% | ⏳ |
| Focus Management | ~70% | 100% | ⏳ |
| ARIA & Labels | ~60% | 100% | ⏳ |
| Color Contrast | ~95% | 100% | ✓ |
| Screen Reader | ~60% | 100% | ⏳ |

---

## Success Metrics

### Quantitative
- [ ] 0 critical accessibility violations
- [ ] < 5 major violations
- [ ] < 10 minor violations
- [ ] Lighthouse accessibility score > 90
- [ ] All automated tests passing

### Qualitative
- [ ] Can navigate entire app with keyboard only
- [ ] Screen reader can announce all content
- [ ] Focus indicators visible everywhere
- [ ] No cognitive overload
- [ ] Touch targets accessible

---

## Risk Mitigation

### Potential Issues
1. **Performance Impact:** ARIA and semantic HTML have minimal perf impact ✓
2. **Breaking Changes:** Keyboard nav changes are additive ✓
3. **Inconsistency:** Use consistent patterns across app ✓
4. **Testing:** Run full test suite after each change ✓

### Rollback Plan
- Git commits for each workstream
- Can revert if issues found
- Maintain test coverage

---

## Next Phase (3.4)

After Phase 3.3 completes:
- Developer Experience improvements (Storybook setup)
- Testing expansion (E2E coverage)
- Code quality refinement (hooks, types)

---

**Ready to Start Phase 3.3? 🚀**

Next action: Begin Workstream 1 - Keyboard Navigation
