# ESLint Responsibility Boundaries

## ESLint Rules

ESLint must enforce:
- No className usage.
- Token-only styles.
- M3 component imports.
- ARIA requirements.

Boundaries:
- Does not validate token values.
- Does not enforce theme manager behavior.
- Focuses on code patterns.

## DO / DO NOT

| DO | DO NOT |
|----|--------|
| Flag forbidden patterns | Validate runtime behavior |
| Enforce import rules | Replace theme manager logic |
| Block PRs on violations | Allow architectural deviations |

## Rationale

ESLint prevents pattern violations at code level. It complements but does not replace architectural contracts.