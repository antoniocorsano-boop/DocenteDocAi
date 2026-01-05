# Phase 2B - MUI Popover & Menu Migration

**Date:** January 5, 2026 (Early Start - Scheduled: January 15)  
**Status:** IN PROGRESS  
**Duration:** 2-3 days (accelerated)

---

## Overview

Phase 2B focuses on migrating custom Popover and Menu components to Material-UI (MUI) implementations, improving accessibility, keyboard navigation, and viewport handling.

### Why Now?
- Phase 2A fully validated (98.1% violation reduction)
- Team momentum is high
- Dependencies are stable
- No blocking issues

---

## Scope

### Components to Migrate

#### Popovers (3 components)
| Component | Current File | Usage | Complexity | Status |
|-----------|-------------|-------|-----------|--------|
| EventActionPopover | `src/components/EventActionPopover.tsx` | Event edit/delete actions | Medium | Queued |
| NotificationsPopover | `src/components/NotificationsPopover.tsx` | Notification dropdown | High | Queued |
| QuickNotePopover | `src/components/QuickNotePopover.tsx` | Quick notes on students | Medium | Queued |

#### Menus (2 components)
| Component | Current File | Usage | Complexity | Status |
|-----------|-------------|-------|-----------|--------|
| Menu.tsx | `src/components/Menu.tsx` | Main navigation menu | Medium | Queued |
| StudentActionMenu | `src/components/StudentActionMenu.tsx` | Student context actions | Medium | Queued |

**Total Components:** 5  
**Total Estimated Effort:** 10-14 hours  
**Target:** Complete by EOD January 6, 2026

---

## Technical Approach

### Step 1: MUI Setup Validation
- [x] Check package.json for @mui/material version
- [ ] Verify MUI is already installed
- [ ] Check theme provider setup

### Step 2: Component Analysis
- [ ] Document current behavior of each Popover
- [ ] Document current behavior of each Menu
- [ ] Identify anchor element patterns
- [ ] List click-outside handlers

### Step 3: Migration Pattern
```typescript
// BEFORE (Custom Implementation)
interface PopoverProps {
  anchorEl: HTMLElement;
  onClose: () => void;
  children: React.ReactNode;
}

const CustomPopover = ({ anchorEl, onClose, children }: PopoverProps) => {
  const popoverRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);
  
  // Manual positioning logic...
  return <div ref={popoverRef} className="m3-popup-menu" style={...}>{children}</div>;
};

// AFTER (MUI Popover)
import { Popover, Box } from '@mui/material';

const MUIPopover = ({ anchorEl, onClose, children }: PopoverProps) => {
  return (
    <Popover
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      PaperProps={{
        sx: {
          backgroundColor: 'var(--sys-surface)',
          border: '1px solid var(--sys-outline-variant)',
          borderRadius: 'var(--shape-xl)',
          boxShadow: 'var(--elevation-3)',
        }
      }}
    >
      <Box sx={{ p: 2 }}>{children}</Box>
    </Popover>
  );
};
```

### Step 4: Preserve Design System
- Use CSS variables for colors/spacing
- Maintain M3 token compliance
- Preserve animations (fade-in, slide-up)
- Keep accessibility features

### Step 5: Testing Strategy
- Manual testing each migrated component
- Keyboard navigation (ESC to close)
- Scroll behavior in constrained viewports
- Mobile responsiveness
- Click-outside behavior

---

## Migration Tasks

### Phase 2B.1 - Analysis & Setup
- [ ] Task 2B.1a: Analyze EventActionPopover
- [ ] Task 2B.1b: Analyze NotificationsPopover
- [ ] Task 2B.1c: Analyze QuickNotePopover
- [ ] Task 2B.1d: Analyze Menu.tsx
- [ ] Task 2B.1e: Analyze StudentActionMenu
- [ ] Task 2B.1f: Verify MUI installation

### Phase 2B.2 - Popover Migrations
- [ ] Task 2B.2a: Migrate EventActionPopover
- [ ] Task 2B.2b: Migrate NotificationsPopover
- [ ] Task 2B.2c: Migrate QuickNotePopover
- [ ] Task 2B.2d: Test all Popovers
- [ ] Task 2B.2e: Commit Popover migrations

### Phase 2B.3 - Menu Migrations
- [ ] Task 2B.3a: Migrate Menu.tsx
- [ ] Task 2B.3b: Migrate StudentActionMenu
- [ ] Task 2B.3c: Test all Menus
- [ ] Task 2B.3d: Commit Menu migrations

### Phase 2B.4 - Validation & Polish
- [ ] Task 2B.4a: Full test suite execution
- [ ] Task 2B.4b: Build production bundle
- [ ] Task 2B.4c: Visual regression testing
- [ ] Task 2B.4d: Accessibility audit
- [ ] Task 2B.4e: Create Phase 2B completion document
- [ ] Task 2B.4f: Final commit and push

---

## Key Decisions

### 1. Keep Custom Implementation for Complex Cases?
**Decision:** Migrate all to MUI first. If MUI limitations are found, create wrapper components.

### 2. Animation Preservation
**Decision:** Use MUI's TransitionComponent prop to maintain M3 animations (aura-slide-up, fade-in).

### 3. Styling Approach
**Decision:** Use `PaperProps.sx` with CSS variables to maintain design system compliance.

### 4. Backwards Compatibility
**Decision:** No breaking changes. All props remain the same to parent components.

---

## Success Criteria

✅ All 5 components migrated to MUI  
✅ Zero test failures  
✅ Keyboard navigation working (ESC closes all popovers/menus)  
✅ Viewport edge handling automatic (MUI handles positioning)  
✅ Mobile responsiveness maintained  
✅ M3 design tokens applied  
✅ Production build successful  
✅ No accessibility regressions  
✅ All changes committed to main branch  

---

## Estimated Timeline

| Phase | Task | Effort | Status |
|-------|------|--------|--------|
| 2B.1 | Analysis & Setup | 2h | Queued |
| 2B.2 | Popover Migrations | 6h | Queued |
| 2B.3 | Menu Migrations | 4h | Queued |
| 2B.4 | Validation & Polish | 2-4h | Queued |
| **Total** | | **14-16h** | **In Progress** |

**Expected Completion:** January 6-7, 2026

---

## Dependencies

- [x] Phase 2A complete & validated
- [x] Design system tokens established
- [x] ESLint rules enforced
- [ ] MUI installation verified
- [ ] Team alignment confirmed

---

## Documentation

**Documents Created Today:**
- [x] PHASE_2A_VALIDATION_COMPLETE.md
- [ ] PHASE_2B_PLAN.md (this file)
- [ ] PHASE_2B_COMPONENT_ANALYSIS.md (in progress)
- [ ] PHASE_2B_MIGRATION_DETAILS.md (pending)
- [ ] PHASE_2B_COMPLETION_REPORT.md (pending)

---

## Next Steps

1. ✅ Create Phase 2B plan (THIS DOCUMENT)
2. → Analyze all 5 components (EventActionPopover, NotificationsPopover, QuickNotePopover, Menu, StudentActionMenu)
3. → Migrate Popovers to MUI
4. → Migrate Menus to MUI
5. → Full validation (tests, build, accessibility)
6. → Create completion report

**Starting:** Phase 2B.1 - Component Analysis
