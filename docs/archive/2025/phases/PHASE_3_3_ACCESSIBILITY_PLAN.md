# Phase 3.3 - Accessibility Audit & Implementation Plan
## WCAG 2.1 AA Compliance Initiative

**Status:** 🚀 IN PROGRESS  
**Date:** January 5, 2026  
**Phase:** 3.3 (Week 1 of Phase 3)  
**Timeline:** 8-12 hours over 1-2 weeks  

---

## Executive Summary

Phase 3.3 focuses on systematic accessibility auditing and compliance improvements to achieve 95%+ WCAG 2.1 AA compliance. The audit is divided into 4 major areas with specific tasks for implementation.

### Current State Assessment
- **Base Accessibility:** ~70-75% (estimated)
- **MUI Foundation:** Good (MUI v7.3.6 provides WCAG baseline)
- **Keyboard Navigation:** Partial (MUI helps, but gaps remain)
- **Color Contrast:** Likely compliant (M3 design tokens)
- **ARIA Labels:** Incomplete (requires audit + fixes)
- **Screen Reader:** Untested (needs validation)

### Target State
- **WCAG 2.1 AA:** >95% compliance
- **Keyboard Navigation:** Complete across all views
- **Screen Reader:** Fully compatible (tested with NVDA/JAWS)
- **Focus Indicators:** Visible and styled per spec
- **Form Accessibility:** All inputs properly labeled
- **Automated Testing:** Baseline established

---

## Phase 3.3.1 - Accessibility Audit Preparation

### Step 1: Install Audit Tools

**Tool 1: axe DevTools CLI (for CI/CD)**
```bash
npm install --save-dev @axe-core/cli
```

**Tool 2: axe-core (for testing)**
```bash
npm install --save-dev axe-core
```

**Tool 3: axe Playwright Integration**
```bash
npm install --save-dev @axe-core/playwright
```

**Manual Tools:**
- Chrome Lighthouse (built-in)
- Firefox Accessibility Inspector (built-in)
- NVDA Screen Reader (open-source, Windows)

### Step 2: Create Accessibility Test Baseline

**Create:** `__tests__/a11y/accessibility-baseline.test.ts`

```typescript
import { test, expect } from '@playwright/test';
import { injectAxe, checkA11y } from 'axe-playwright';

test.describe('Accessibility Baseline', () => {
  test('should have no accessibility violations on home view', async ({ page }) => {
    await page.goto('/');
    await injectAxe(page);
    await checkA11y(page, null, {
      detailedReport: true,
      detailedReportOptions: { html: true }
    });
  });

  // Add tests for each major view
  test('should have no accessibility violations on student profile', async ({ page }) => {
    await page.goto('/student/123');
    await injectAxe(page);
    await checkA11y(page);
  });

  // ... more views
});
```

### Step 3: Run Lighthouse Audit

**Command:**
```bash
npm run build && npx lighthouse http://localhost:5173 --view
```

**Metrics to Track:**
- Accessibility score (target: >90)
- Performance score (target: >80)
- Best Practices score (target: >90)

---

## Phase 3.3.2 - Keyboard Navigation Audit

### Areas to Assess

#### 2.1: Tab Order

**What to check:**
1. Tab order follows logical reading order (left-to-right, top-to-bottom)
2. No keyboard traps (user can't get stuck)
3. Skip links present (skip to main content)

**Implementation Tasks:**

**Task 2.1.1: Add Skip Links** (1 hour)
```typescript
// src/components/SkipLink.tsx
const SkipLink = () => (
  <a href="#main-content" className="sr-only focus:static focus:block">
    Skip to main content
  </a>
);
```

Add to App.tsx layout:
```typescript
<SkipLink />
<header>...</header>
<main id="main-content">...</main>
```

**Task 2.1.2: Audit Tab Order in Key Views** (2-3 hours)
- [ ] ClassroomView tab order
- [ ] StudentProfile tab order
- [ ] Calendar view tab order
- [ ] Settings view tab order
- [ ] StudentManager tab order

**Task 2.1.3: Fix Tab Order Issues** (2-3 hours)
- Add tabIndex where needed
- Remove tabIndex="-1" from focusable elements
- Ensure focus management in modals

#### 2.2: Keyboard Shortcuts

**Required shortcuts:**
- ESC: Close popover/modal ✓ (MUI handles)
- TAB: Navigate forward
- SHIFT+TAB: Navigate backward
- ENTER/SPACE: Activate buttons
- ARROW KEYS: Navigate lists/menus

**Task 2.2.1: List Navigation** (2 hours)
```typescript
// For lists of 5+ items, add arrow key navigation
const ListWithKeyboardNav = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      setSelectedIndex(prev => (prev + 1) % items.length);
    } else if (e.key === 'ArrowUp') {
      setSelectedIndex(prev => (prev - 1 + items.length) % items.length);
    }
  };
  
  return <div onKeyDown={handleKeyDown}>{/* items */}</div>;
};
```

**Task 2.2.2: Menu Navigation** (1-2 hours)
- Implement arrow key navigation in MenuBar
- Add Home/End key support
- Add escape to close

#### 2.3: Focus Management

**Task 2.3.1: Modal Focus Trap** (1 hour)
```typescript
// Ensure focus stays within modal when open
// MUI Dialog provides this, but verify in custom modals
```

**Task 2.3.2: Focus Restoration** (1 hour)
```typescript
// When modal closes, restore focus to trigger element
// Track and restore focus on navigation
```

---

## Phase 3.3.3 - Color Contrast & Visual Accessibility

### Audit Checklist

**Task 3.1: Color Contrast Review** (1 hour)
```bash
# Use WebAIM Contrast Checker
# Check critical text against design tokens
# Verify: Normal text (4.5:1), UI components (3:1)
```

**Expected Result:** ✓ PASS (M3 tokens meet WCAG AA standards)

**Task 3.2: Focus Indicators** (2-3 hours)

**Current State:** MUI provides default focus indicator
**Enhancement:** Add custom focus styling

```typescript
// src/index.css
:focus-visible {
  outline: 3px solid var(--sys-primary);
  outline-offset: 2px;
  border-radius: 2px;
}

// High contrast mode
@media (prefers-contrast: more) {
  :focus-visible {
    outline-width: 4px;
  }
}
```

**Task 3.3: Color Blindness Testing** (1 hour)
- Use Chrome DevTools color blindness simulation
- Check critical UI (status indicators, error messages)
- Verify red/green don't rely on color alone
- Use: patterns, icons, text labels

**Implementation:**
```typescript
// Example: Status indicators
<Box sx={{
  color: 'var(--sys-error)', // Red
  '&::before': { content: '"⚠ "' } // Add icon/symbol
}}>
  Error message
</Box>
```

**Task 3.4: Text Sizing & Zoom** (1 hour)
- Test at 200% zoom level
- Verify no text cutoff
- Check responsive behavior
- Ensure minimum font sizes (12px minimum)

---

## Phase 3.3.4 - ARIA Labels & Semantic HTML

### Task 4.1: Form Accessibility** (2 hours)

**Current Issues to Fix:**
1. Input fields missing associated labels
2. Required indicators not announced
3. Error messages not linked to inputs

**Implementation:**
```typescript
// src/components/AccessibleFormField.tsx
const AccessibleFormField = ({ label, error, required }: Props) => (
  <Box>
    <label htmlFor="input-id" className="form-label">
      {label}
      {required && <span aria-label="required">*</span>}
    </label>
    <input
      id="input-id"
      aria-required={required}
      aria-invalid={!!error}
      aria-describedby={error ? 'error-id' : undefined}
    />
    {error && <div id="error-id" role="alert">{error}</div>}
  </Box>
);
```

### Task 4.2: Icon Accessibility** (1-2 hours)

**Issue:** Material Symbols don't have alt text
**Solution:** Add aria-label to icons

```typescript
// BEFORE (inaccessible)
<span className="material-symbols-outlined">close</span>

// AFTER (accessible)
<span 
  className="material-symbols-outlined" 
  aria-label="Close notification"
  role="img"
>
  close
</span>
```

**Audit all icon usages:**
- [ ] EventActionPopover buttons
- [ ] NotificationsPopover close button
- [ ] Menu items
- [ ] Status indicators
- [ ] Form validation icons

### Task 4.3: Live Region Announcements** (2 hours)

**When to use:**
1. Notification display
2. Form submission results
3. Loading states
4. Data updates

**Implementation:**
```typescript
const NotificationCenter = () => {
  const [message, setMessage] = useState('');
  
  return (
    <>
      <div 
        role="status" 
        aria-live="polite" 
        aria-atomic="true"
        className="sr-only"
      >
        {message}
      </div>
      {/* Notification UI */}
    </>
  );
};
```

### Task 4.4: Landmark Navigation** (1 hour)

**Implement semantic landmarks:**
```typescript
// src/App.tsx
<>
  <SkipLink />
  <header role="banner">
    {/* Navigation */}
  </header>
  <nav>
    {/* Main navigation */}
  </nav>
  <main id="main-content">
    {/* Page content */}
  </main>
  <aside role="complementary">
    {/* Sidebar */}
  </aside>
  <footer role="contentinfo">
    {/* Footer */}
  </footer>
</>
```

---

## Phase 3.3.5 - Screen Reader Testing

### Task 5.1: NVDA Testing Plan** (3 hours)

**Setup:**
1. Download NVDA (free, open-source)
2. Install on Windows test machine
3. Start NVDA and navigate app

**Test Checklist:**
- [ ] Page title announced
- [ ] Navigation structure understood
- [ ] Form labels announced correctly
- [ ] Error messages announced
- [ ] Dynamic content updates announced
- [ ] Links have meaningful text
- [ ] Buttons purpose clear

**Critical Views to Test:**
1. Home page
2. Student list/profile
3. Evaluation form
4. Calendar view
5. Settings

### Task 5.2: Mobile Screen Reader** (1 hour)

**iOS:** Use built-in VoiceOver
**Android:** Use built-in TalkBack

Test on mobile:
- [ ] Touch targets >44x44px ✓ (MUI handles)
- [ ] Swipe gestures work
- [ ] Focus order logical
- [ ] Content readable

---

## Implementation Schedule (Week 1)

### Day 1 (2 hours)
- [ ] Install accessibility testing tools
- [ ] Create baseline accessibility test suite
- [ ] Run Lighthouse audit
- [ ] Document current state

### Day 2 (2 hours)
- [ ] Implement skip links
- [ ] Add focus-visible styles
- [ ] Review color contrast
- [ ] Fix critical violations

### Day 3 (2 hours)
- [ ] Add ARIA labels to forms
- [ ] Fix icon accessibility
- [ ] Implement live regions
- [ ] Add landmarks

### Day 4 (2 hours)
- [ ] Manual keyboard testing
- [ ] Test tab order in all views
- [ ] Fix keyboard navigation issues
- [ ] Screen reader spot-check

### Day 5 (2 hours)
- [ ] NVDA testing (if available)
- [ ] Final validation
- [ ] Documentation
- [ ] Commit changes

**Total Week 1:** ~10 hours

---

## Critical Issues Priority Matrix

### Priority 1 (Fix This Week)
- Keyboard navigation broken ❌ (audit ongoing)
- Form labels missing ❌ (audit ongoing)
- Icon text missing ❌ (audit ongoing)
- Color contrast failing ❌ (expected: PASS)

### Priority 2 (This Month)
- Skip links missing ✓ (Task 2.1.1)
- Focus indicators poor ⏳ (Task 3.2)
- Live regions missing ⏳ (Task 4.3)
- ARIA attributes incomplete ⏳ (Tasks 4.1, 4.2)

### Priority 3 (Next Quarter)
- Screen reader testing (limited)
- Mobile accessibility refinement
- Advanced keyboard shortcuts

---

## Success Criteria for Phase 3.3

**Code Level:**
- ✅ All form inputs have associated labels
- ✅ All interactive elements have accessible names
- ✅ Tab order logical in all views
- ✅ Skip links implemented
- ✅ Focus indicators visible and styled
- ✅ Live regions for dynamic content

**Testing Level:**
- ✅ Axe audit: 0 violations
- ✅ Lighthouse accessibility: >90
- ✅ Manual keyboard testing: Complete
- ✅ Screen reader testing: Critical paths work

**Compliance Level:**
- ✅ WCAG 2.1 AA: >95% coverage
- ✅ No critical violations
- ✅ No accessibility blockers

---

## Tools & Resources

### Free Tools
- Chrome DevTools Lighthouse ✓
- Firefox Accessibility Inspector ✓
- NVDA (Windows) - Download free
- WebAIM Contrast Checker (online)
- Axe DevTools Browser Extension

### Automation
- axe-core (automated testing)
- @axe-core/playwright (test integration)
- Lighthouse CI (continuous monitoring)

### Documentation
- [WCAG 2.1 Guide](https://www.w3.org/WAI/WCAG21/quickref/)
- [MUI Accessibility](https://mui.com/material-ui/guides/accessibility/)
- [WebAIM Articles](https://webaim.org/)

---

## Risk Assessment

### Potential Issues
1. **Breaking Changes:** Focus/keyboard changes might affect existing behavior
   - **Mitigation:** Test thoroughly before committing
   - **Contingency:** Use feature flags for major changes

2. **Screen Reader Compatibility:** Hard to test without users
   - **Mitigation:** Follow WCAG guidelines strictly
   - **Contingency:** Get feedback from accessibility expert

3. **Performance Impact:** ARIA attributes might add overhead
   - **Mitigation:** Minimal (mostly attributes, no JS changes)
   - **Contingency:** None needed (expected zero impact)

---

## Next Steps

### Immediate (Today)
1. ✅ Create audit plan (DONE)
2. ⏳ Install testing tools
3. ⏳ Run baseline assessments
4. ⏳ Document current state

### This Week
1. ⏳ Implement Priority 1 fixes
2. ⏳ Add ARIA labels and semantic HTML
3. ⏳ Keyboard navigation testing
4. ⏳ Commit and push changes

### Next Week
1. ⏳ Screen reader testing
2. ⏳ Final validation
3. ⏳ Phase 3.3 completion report
4. ⏳ Move to Phase 3.2 (Performance)

---

**Status:** 🚀 Phase 3.3 Ready to Begin  
**Next Action:** Install tools and run baseline audit

---

## Appendix: Accessibility Checklist

### Form Accessibility
- [ ] All inputs have labels
- [ ] Labels associated via htmlFor
- [ ] Required fields marked
- [ ] Error messages linked to inputs
- [ ] Form validation messages in real-time

### Keyboard Navigation
- [ ] Tab moves focus forward
- [ ] Shift+Tab moves focus backward
- [ ] Focus visible at all times
- [ ] No keyboard traps
- [ ] Skip links present

### Visual
- [ ] Color contrast 4.5:1 for text
- [ ] Color contrast 3:1 for UI
- [ ] Color not sole means of info
- [ ] Text zoom to 200% works
- [ ] Focus indicators clear

### Content
- [ ] Page titles descriptive
- [ ] Headers in logical order
- [ ] Links have meaningful text
- [ ] Lists structured properly
- [ ] Images have alt text

### ARIA
- [ ] Form labels correct
- [ ] Buttons have accessible names
- [ ] Icons labeled
- [ ] Live regions for updates
- [ ] Landmarks present

### Mobile
- [ ] Touch targets 44x44px minimum
- [ ] Screen reader works
- [ ] Zoom functionality intact
- [ ] Orientation not locked
- [ ] Gestures documented

---

**Document Version:** 1.0  
**Created:** January 5, 2026  
**Status:** IN PROGRESS - Ready for implementation
