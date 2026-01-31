# Fix Prioritization Checklist

Generated: 2026-01-31T10:14:47.100Z

Strategy: prioritize critical UI surfaces (Header, Navigation, Home, Cards, Forms), then files with highest violation counts. Prefer token fallbacks and AST-aware edits for code files.

## Top 50 prioritized files

1. **src/components/navigation-rail.css** — violations: 8 — surface: Header/Home/Top Nav — priority boost: 200
   - Suggested fix: Replace hardcoded values with MD3 tokens (e.g. use var(--md-sys-\*) with a token fallback).

2. **src/components/accessibility/SkipLink.css** — violations: 1 — surface: Accessibility — priority boost: 180
   - Suggested fix: Replace hardcoded values with MD3 tokens (e.g. use var(--md-sys-\*) with a token fallback).

3. **src/theme.css** — violations: 157
   - Suggested fix: Replace hardcoded values with MD3 tokens (e.g. use var(--md-sys-\*) with a token fallback).

4. **src/global.css** — violations: 136
   - Suggested fix: Replace hardcoded values with MD3 tokens (e.g. use var(--md-sys-\*) with a token fallback).

5. **src/layout.css** — violations: 130
   - Suggested fix: Replace hardcoded values with MD3 tokens (e.g. use var(--md-sys-\*) with a token fallback).

6. **src/modules.css** — violations: 89
   - Suggested fix: Replace hardcoded values with MD3 tokens (e.g. use var(--md-sys-\*) with a token fallback).

7. **src/constants.ts** — violations: 34
   - Suggested fix: Use AST-aware transformer to replace literal occurrences inside string/template literals, or update component props to use tokens.

8. **src/components/components.css** — violations: 28
   - Suggested fix: Replace hardcoded values with MD3 tokens (e.g. use var(--md-sys-\*) with a token fallback).

9. **src/components/EvaluationModule.css** — violations: 21
   - Suggested fix: Replace hardcoded values with MD3 tokens (e.g. use var(--md-sys-\*) with a token fallback).

10. **src/components.css** — violations: 20

- Suggested fix: Replace hardcoded values with MD3 tokens (e.g. use var(--md-sys-\*) with a token fallback).

11. **src/components/ui/ui-components.css** — violations: 19

- Suggested fix: Replace hardcoded values with MD3 tokens (e.g. use var(--md-sys-\*) with a token fallback).

12. **src/stories/DesignSystem/Colors.stories.tsx** — violations: 16

- Suggested fix: Use AST-aware transformer to replace literal occurrences inside string/template literals, or update component props to use tokens.

13. **src/components/Menu.css** — violations: 4

- Suggested fix: Replace hardcoded values with MD3 tokens (e.g. use var(--md-sys-\*) with a token fallback).

14. **src/nka/nka.css** — violations: 3

- Suggested fix: Replace hardcoded values with MD3 tokens (e.g. use var(--md-sys-\*) with a token fallback).

15. **src/components/TeacherInbox.tsx** — violations: 2

- Suggested fix: Use AST-aware transformer to replace literal occurrences inside string/template literals, or update component props to use tokens.

16. **src/components/Timetable.tsx** — violations: 2

- Suggested fix: Use AST-aware transformer to replace literal occurrences inside string/template literals, or update component props to use tokens.

17. **src/logo.css** — violations: 2

- Suggested fix: Replace hardcoded values with MD3 tokens (e.g. use var(--md-sys-\*) with a token fallback).

18. **src/nka/NKABottomSheet.tsx** — violations: 2

- Suggested fix: Use AST-aware transformer to replace literal occurrences inside string/template literals, or update component props to use tokens.

19. **src/styles/md3-z-index.css** — violations: 2

- Suggested fix: Replace hardcoded values with MD3 tokens (e.g. use var(--md-sys-\*) with a token fallback).

20. **src/components/Logo.tsx** — violations: 1

- Suggested fix: Use AST-aware transformer to replace literal occurrences inside string/template literals, or update component props to use tokens.

21. **src/components/VoiceNoteRecorder.tsx** — violations: 1

- Suggested fix: Use AST-aware transformer to replace literal occurrences inside string/template literals, or update component props to use tokens.

22. **src/stories/DesignSystem/Typography.stories.tsx** — violations: 1

- Suggested fix: Use AST-aware transformer to replace literal occurrences inside string/template literals, or update component props to use tokens.

23. **src/styles/m3-interactive.css** — violations: 1

- Suggested fix: Replace hardcoded values with MD3 tokens (e.g. use var(--md-sys-\*) with a token fallback).

---

Suggested rollout plan:

1. Create sandbox branch and apply a sample patch for one high-priority file.
2. Run visual diff on Header/Home/Nav/Card pages.
3. If safe, run batch transformer with narrow scope per surface.
4. Submit tranche PR per surface and obtain Governance approval.

Quick commands:

```bash
# create sandbox branch
git checkout -b md3/fix-sample-<file>
# apply manual edits or patch
# run tests and visual diffs
npm ci && npm test
# run governance check for path
node scripts/governance-check.cjs src/components/<path>
```
