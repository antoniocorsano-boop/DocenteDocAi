# Types Refactoring Plan

## Current State

**File:** `src/types.ts`
**Size:** 1,380 lines | 47 KB
**Status:** 🔴 MONOLITHIC

## Problems

1. **Single point of failure** - All types in one file
2. **Circular dependencies** - Hard to track imports
3. **Merge conflicts** - Multiple devs editing same file
4. **Tree-shaking** - Can't eliminate unused types
5. **Discoverability** - Hard to find specific types

## Target Structure

```
src/types/
├── index.ts              # Central exports (already created ✅)
├── student.ts            # StudentState, Studente, evaluations
├── academic.ts           # AcademicState, lessons, UDA
├── system.ts             # SystemState, user, notifications
├── settings.ts           # SettingsState, TimetableSettings
├── ui.ts                 # UIState, Modals, View types
├── evaluation.ts         # Valutazione, Giudizio, Rubrica
├── calendar.ts           # EventoCalendario, Slot
├── orientamento.ts       # OrientamentoActivity, EPortfolio
├── components.ts         # Component-specific props
└── shared.ts             # Shared utility types
```

## Migration Strategy

### Phase 1: Extract State Types (Week 1)
Move state interfaces first (no breaking changes):

1. [ ] `StudentState` → `student.ts`
2. [ ] `AcademicState` → `academic.ts`
3. [ ] `SystemState` → `system.ts`
4. [ ] `SettingsState` → `settings.ts`
5. [ ] `UIState` → `ui.ts`

### Phase 2: Extract Domain Types (Week 2)
Move entity types:

1. [ ] `Studente` and related → `student.ts`
2. [ ] `Lezione`, `Slot`, `Uda` → `academic.ts`
3. [ ] `Valutazione`, `Rubrica` → `evaluation.ts`
4. [ ] `EventoCalendario` → `calendar.ts`

### Phase 3: Extract Component Props (Week 3)
Move component-specific types:

1. [ ] Modal props → `components.ts`
2. [ ] Page props → `components.ts`
3. [ ] Shared props → `shared.ts`

### Phase 4: Clean Up (Week 4)
1. [ ] Remove re-exports from old `types.ts`
2. [ ] Update all imports
3. [ ] Delete `types.ts`

## Import Migration

### Before
```typescript
import { StudentState, AcademicState, UserProfile } from '../types';
```

### After
```typescript
import { StudentState } from '../types/student';
import { AcademicState } from '../types/academic';
import { UserProfile } from '../types/system';
```

Or via index:
```typescript
import { StudentState, AcademicState, UserProfile } from '../types';
```

## Benefits

- ✅ Smaller, focused files
- ✅ Better code splitting
- ✅ Reduced merge conflicts
- ✅ Easier navigation
- ✅ Better tree-shaking

## Success Metrics

- [ ] No type file >200 lines
- [ ] All types co-located with domain
- [ ] Circular dependencies eliminated
- [ ] Import paths simplified
