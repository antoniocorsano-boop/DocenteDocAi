// Single source of truth for MD3 Platinum governance rules
export const MD3_PLATINUM_RULES = Object.freeze({
  tokensOnly: true, // allow only --md-sys-* and --app-*
  allowedTokenPrefixes: ['--md-sys-', '--app-'],
  noHardcoded: ['px', 'rem', '%', 'vh', 'vw', '#', 'rgb', 'rgba'],
  minTouchTarget: 44,
  typography: {
    greeting: { small: 'headline-small', large: 'headline-large' },
  },
  accessibility: 'WCAG 2.1 AA',
  responsive: true,
  header: 'navigation + actions only, teacher identity in Home.tsx',
});

export default MD3_PLATINUM_RULES;
