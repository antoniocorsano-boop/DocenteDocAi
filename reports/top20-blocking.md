# Top 20 Blocking MD3 Theme Violations

Extracted from `audit/theme-violations.json` (most immediate blocking items).

1. src/components/accessibility/SkipLink.css:22 - hardcodedTypography - font-weight: 500
2. src/components/components.css:485 - hardcodedSpacing - width: 100%
3. src/components/components.css:976 - hardcodedSpacing - width: 100%
4. src/components/components.css:1099 - hardcodedSpacing - width: 40%
5. src/components/components.css:1100 - hardcodedSpacing - height: 40%
6. src/components/components.css:1112 - hardcodedSpacing - width: 40%
7. src/components/components.css:1113 - hardcodedSpacing - height: 40%
8. src/components/components.css:1216 - hardcodedSpacing - width: 100%
9. src/components/components.css:94 - hardcodedTypography - font-weight: 500
10. src/components/components.css:113 - hardcodedTypography - font-weight: 500
11. src/components/components.css:141 - hardcodedTypography - font-weight: 900
12. src/components/components.css:157 - hardcodedTypography - font-weight: 500
13. src/components/components.css:236 - hardcodedTypography - font-weight: 500
14. src/components/components.css:243 - hardcodedTypography - font-weight: 900
15. src/components/components.css:254 - hardcodedTypography - font-weight: 500
16. src/components/components.css:281 - hardcodedTypography - font-weight: 900
17. src/components/components.css:852 - hardcodedTypography - font-weight: 900
18. src/components/components.css:859 - hardcodedTypography - font-weight: 900
19. src/components/components.css:914 - hardcodedTypography - font-weight: 900
20. src/components/components.css:929 - hardcodedTypography - font-weight: 900

---

Suggested prioritization criteria

- Surface impact: prioritize files used in Header, Navigation, Home, Card, and Form UIs.
- Blocking frequency: files with many violations should be grouped higher.
- Risk of behavior change: prefer fixes using token fallbacks rather than direct value replacements.

Next actions available:

- I can generate a CSV of all blocking violations to help triage.
- I can create issue templates for the top 5 files with suggested fixes.
- I can prepare a PR template and example patch for a single low-risk file to demonstrate the process.
