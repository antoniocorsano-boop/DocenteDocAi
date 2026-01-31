MD3 Governance — Top 20 Violating Files (prioritized)

Generated: 2026-01-31
Scope: `src/components/**/*.ts(x)` (mode=warn)

Priority list (file — violations — first example)

1. src/components/Settings.tsx — 13 violations
   - Example: line 114 — hardcoded unit `0.025em`
   - Suggested fix: replace small typography/spacing tokens with MD3 tokens or use `var(--md-sys-typescale-*)` / `var(--md-sys-spacing-*)` consistent mapping.

2. src/components/StudentClassroomView.tsx — 6 violations
   - Example: line 149 — hardcoded unit `0.1em`
   - Suggested fix: map to appropriate typescale tokens or remove overly-precise em values.

3. src/components/Timetable.tsx — 2 violations
   - Example: line 227 — hardcoded unit `0.1em`
   - Suggested fix: use token-driven spacing/typography.

4. src/components/ui/M3Typography.tsx — 2 violations
   - Example: line 123 — hardcoded unit `0.1em`
   - Suggested fix: centralize typographic tokens in `M3Typography` and reference them.

5. src/components/ui/M3Menu.test.tsx — 2 violations (tests)
   - Example: line 319 — `300px`
   - Suggested fix: leave tests for separate snapshot updates; do not auto-change snapshots in this pass.

6. src/components/WelcomeScreen.tsx — 1 violation
   - Example: line 155 — `0.1em`

7. src/components/VoiceNoteRecorder.tsx — 1 violation
   - Example: line 255 — `0.1em`

8. src/components/UnifiedEvaluationModal.tsx — 1 violation
   - Example: line 103 — `0.005em`

9. src/components/TeacherPresentationView.tsx — 1 violation
   - Example: line 2 — `100vh`
   - Suggested fix: replace with `var(--md-sys-breakpoint-*)` or layout token, or use viewport-safe tokens.

10. src/components/StudentLoginScreen.tsx — 1 violation
    - Example: line 158 — `0.1em`

11. src/components/ui/SectionHeader.tsx — 1 violation
    - Example: line 64 — `0.5em`

12. src/components/ui/M3Popover.test.tsx — 1 violation (test)
    - Example: line 228 — `300px`

13. src/components/ui/M3ExpressiveCard.tsx — 1 violation
    - Example: line 207 — `0.005em`

14. src/components/ui/M3ChoiceCard.tsx — 1 violation
    - Example: line 103 — `0.2em`

15. src/components/ui/EmptyState.tsx — 1 violation
    - Example: line 57 — `0.025em`

16. src/components/ui/CategoryCard.tsx — 1 violation
    - Example: line 110 — `0.025em`

17. src/components/ui/AiMemoryChip.tsx — 1 violation
    - Example: line 50 — `0.15em`

18. src/components/ui/ActionTile.tsx — 1 violation
    - Example: line 161 — `0.08em`

19. src/components/ui/M3Menu.test.tsx (duplicate entry covered above) — (see #5)

20. src/components/ui/M3Typography.tsx (duplicate entry covered above) — (see #4)

Recommendations

- Triage order: focus on `Settings.tsx` and `StudentClassroomView.tsx` first (largest counts). These are high-impact and likely quick wins.
- Avoid changing test snapshots automatically; prepare a separate PR for snapshot updates if necessary.
- For small `em`/`rem` values used for tracking (0.005em etc.), prefer mapping to typographic token families or remove where not visually necessary.
- After manual fixes for top files, re-run `node scripts/governance-check.cjs --path "src/components/**/*.ts?(x)" --mode fail` to confirm blocking violations cleared.

Next actions I can take for you (pick one):

- A: Auto-apply conservative replacements to `Settings.tsx` and `StudentClassroomView.tsx` only (creates .preappfix.bak backups).
- B: Produce a patch file (`reports/governance-top20.patch`) with suggested edits for reviewer review (no-verify commit optional).
- C: Provide step-by-step manual fix snippets for each top file for a reviewer to apply.
