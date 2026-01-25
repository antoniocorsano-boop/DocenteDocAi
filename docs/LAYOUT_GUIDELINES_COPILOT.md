# Layout Guidelines for Copilot

## Home

- Use AppLayout with single-column main content
- NavigationRail on desktop; BottomNav placeholder for mobile
- FAB in bottom-right for primary action: variant="filled"
- Section order: Hero → Quick Actions → Metrics → Next Lesson → Recent Activity → AI Suggestions
- All spacing via MD3 tokens (--md-sys-spacing-\*)
- All typography via MD3 tokens (--md-sys-typescale-\*)
- Ensure no overlap between NavigationRail and content
- Interactive elements must have aria-label
- Remove empty placeholders or explain why they remain
