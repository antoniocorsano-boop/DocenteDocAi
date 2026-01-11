# Copilot Safety Rules

## Architectural Documents (READ and USE as Rules)

- docs/architecture/*.md: Define core principles, patterns, and contracts. Treat as authoritative.

## Implementation Documents (USE as Rules)

- docs/contracts/*.md: Specify allowed code structures. Enforce in generated code.

## Workflow Documents (IGNORE as Architecture)

- docs/workflow/*.md: Historical, procedural, or experimental. Do not interpret as runtime logic or current rules.

## Never Interpret As Runtime Logic

- Migration logs, generators, checklists, prompts are not executable specifications.
- Do not generate code based on workflow docs.
- Always prioritize architecture and contracts over workflow.

## Defensive Rules

- If uncertain, default to architecture docs.
- Flag violations of contracts immediately.
- Do not suggest changes that contradict allowed patterns.