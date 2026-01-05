---
name: Lint Debt - Type Safety
about: Track TypeScript type safety and linting issues
labels: ['lint-debt', 'medium-priority', 'refactor']
assignees: ''
---

## 📋 Description

<!-- Describe the lint issue clearly -->
This issue tracks a TypeScript/ESLint violation that affects code quality.

## 🎯 Rule Violated

<!-- Select one or more -->
- [ ] `@typescript-eslint/no-explicit-any` - Unsafe `any` type
- [ ] `@typescript-eslint/no-unused-vars` - Unused variable/import
- [ ] `@typescript-eslint/explicit-function-return-type` - Missing return type
- [ ] `@typescript-eslint/explicit-module-boundary-types` - Missing boundary types
- [ ] Other: ________________

## 📁 File(s) Affected

<!-- List the files with line numbers if possible -->
- `src/path/to/file.ts:42`

## 📊 Current State (❌ Problem)

```typescript
// Current problematic code
```

## ✅ Target State (Goal)

```typescript
// Desired state after fix
```

## 🔍 Impact Analysis

- **Severity**: `[ ] Critical (blocks) | [ ] High (affects safety) | [ ] Medium (quality)`
- **Blocks Deployment**: `[ ] Yes | [ ] No`
- **Affects Tests**: `[ ] Yes | [ ] No`
- **Files to Modify**: ___

## 📝 Implementation Notes

<!-- Add notes about how to fix this -->
1. Step 1
2. Step 2
3. Step 3

## ✅ Definition of Done

- [ ] Lint error resolved
- [ ] All tests pass
- [ ] Pre-commit hook accepts
- [ ] Code review approved

## 🔗 Related Issues

<!-- Link to other related issues -->
- Relates to: #___
- Blocks: #___

---

**Priority**: Medium  
**Status**: Open  
**Assignee**: @team-member
