MD3 Governance — Git Hook Recommendation

Purpose
- Run MD3 governance checks locally before commits to prevent token violations from entering branches.

Recommended tools
- Husky: manage git hooks
- lint-staged: run checks only on staged files

Recommended package.json scripts

{
  "scripts": {
    "check:md3": "node scripts/governance-check.cjs --mode warn",
    "precommit:md3": "npm run check:md3"
  }
}

Husky + lint-staged example (setup):

1. Install: `npm install -D husky lint-staged`
2. Enable husky: `npx husky install`
3. Add hook: `npx husky add .husky/pre-commit "npx lint-staged"`
4. Add lint-staged config in package.json:

"lint-staged": {
  "src/**/*.{ts,tsx,js,jsx,css,scss}": [
    "npm run check:md3",
    "git add"
  ]
}

Notes
- Keep the check in "warn" mode for local development to reduce friction; CI should run in "fail" mode.
- For governance-only exceptions (PDF utilities, story snapshots, legacy palette files), add explicit ignore patterns to `scripts/governance-check.cjs` and document them in the PR/RFC.
- Do not bypass pre-commit checks on merge — use draft PRs for early review when needed.
