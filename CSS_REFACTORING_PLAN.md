# CSS Refactoring Plan

## Current State

| File | Lines | Size | Status |
|------|-------|------|--------|
| `layout.css` | 6,626 | 204 KB | 🔴 CRITICAL |
| `modules.css` | 3,752 | 116 KB | 🟠 HIGH |
| `theme.css` | 1,541 | 67 KB | 🟡 MEDIUM |
| `global.css` | 1,509 | 39 KB | 🟢 OK |
| **Total** | **13,428** | **426 KB** | 🔴 |

## Problems

1. **Monolithic files** - Hard to maintain, cache, and debug
2. **Unused styles** - Legacy CSS from previous iterations
3. **Specificity wars** - Hardcoded selectors conflicting
4. **No tree-shaking** - All CSS loaded even if components not used

## Refactoring Strategy

### Phase 1: Layout System (layout.css)
Split into component-based modules:

```
src/styles/layout/
├── _app-shell.css          # ✅ Done
├── _header.css             # ✅ Done
├── _main-content.css       # TODO: content-container, aura-view
├── _bottom-nav.css         # TODO: bottom-nav-bar, nav-item
├── _navigation-rail.css    # TODO: Navigation rail styles
├── _sidebar.css            # TODO: Sidebar component
├── _grid-system.css        # TODO: Grid and flex utilities
├── _responsive.css         # TODO: All media queries
└── index.css               # ✅ Created
```

### Phase 2: Module System (modules.css)
Split by feature:

```
src/styles/modules/
├── _dashboard.css
├── _calendar.css
├── _evaluation.css
├── _student-profile.css
├── _wizard.css
└── index.css
```

### Phase 3: Component-Level CSS
Each component should have its own CSS file:

```
src/components/ComponentName/
├── ComponentName.tsx
├── ComponentName.css       # Component-specific styles
└── index.ts
```

## Migration Steps

1. **Audit**: Identify which styles are actually used
2. **Extract**: Move component styles to component CSS files
3. **Import**: Add CSS imports to components
4. **Test**: Visual regression testing
5. **Remove**: Delete styles from legacy files once migrated

## Priority Components to Refactor

### High Priority (Used everywhere)
- [ ] `.app-shell` → `_app-shell.css` ✅
- [ ] `.app-header` → `_header.css` ✅
- [ ] `.main-content` → `_main-content.css`
- [ ] `.bottom-nav-bar` → `_bottom-nav.css`

### Medium Priority (Feature-specific)
- [ ] Dashboard grid system
- [ ] Calendar views
- [ ] Evaluation forms
- [ ] Wizard layouts

### Low Priority (One-off)
- [ ] Print styles
- [ ] Animation keyframes
- [ ] Utility classes

## Success Metrics

- [ ] No CSS file >100KB
- [ ] No CSS file >1000 lines
- [ ] All component styles co-located
- [ ] Zero unused CSS in production build
- [ ] Visual regression tests passing

## Timeline Estimate

- Phase 1: 2-3 sprints
- Phase 2: 2 sprints
- Phase 3: Ongoing (per-component basis)
