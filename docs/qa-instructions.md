# QA Instructions for DocenteDoc-AI Priority 2 Refactors

## Setup
1. Run `npm run dev` to start development server.
2. Open browser to localhost:3000.
3. Open DevTools (F12): Network, Console, React DevTools (if installed).

## Lazy Loading Verification
1. Load a page with modals (e.g., LessonsPage).
2. Check Network tab: No modal JS loaded initially.
3. Open a modal: See deferred JS request for the modal.
4. Suspense fallback should show "Loading..." briefly.

## Memoization Check
1. Use React DevTools Profiler.
2. Interact with components: Filtered lists should not re-render unnecessarily.
3. Check console for debug logs (only in dev mode).

## AI Error Handling
1. Use test-ai-payloads.json to simulate calls.
2. Mock network errors in DevTools.
3. Verify timeout after 30s, retry messages in console (dev only).
4. Check UI shows user-friendly errors.

## Accessibility
1. Use keyboard: Tab through modals, press ESC.
2. Check focus trap and return.
3. Use screen reader (NVDA/VoiceOver) for ARIA labels.

## Performance
1. Monitor FPS in DevTools Performance tab.
2. Check bundle size: Run `npm run build` and compare dist size.
3. Lazy loading should reduce initial load time.

## Student Portal
1. Load StudentClassroomView with mock data.
2. Check list rendering speed.
3. Simulate uploads: Verify loading indicators.

## MD3 Compliance
1. Inspect elements: Ensure only var(--md-sys-*) in styles.
2. No hardcoded px/rem/hex.

## Reporting
- Document any failures with screenshots/logs.
- Confirm all checklist items pass.