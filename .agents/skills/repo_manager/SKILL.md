---
name: repo_manager
description: Governs repository analysis, change planning, implementation, validation, and controlled promotion. Use for repo-wide work, multi-file changes, architecture-sensitive refactors, repeated repository workflows, and semantic compilation pipelines that should be automated instead of executed block by block.
priority: HIGH
use_when:
  - The user asks to manage, evolve, refactor, validate, or systematically extend a repository
  - A workflow is being repeated manually across branches, files, PRs, or content units
  - Changes cross architecture, domain, CI, persistence, runtime, or deployment boundaries
  - The user asks to turn a repeated repository workflow into a reusable skill or compiler
  - A canonical source -> derived artifact -> review -> promotion process must become deterministic
avoid_when:
  - The user only wants a quick answer about one known file
  - The user only wants repository documentation without changes; use repository-analyzer
  - The task is a narrow bug fix with no architectural or workflow impact
---

# Repo Manager

## Purpose

`repo_manager` is the repository-governance skill. It reduces artisanal repository work by turning repeated change sequences into explicit contracts, deterministic checks, reusable profiles, and controlled promotion pipelines.

It is not a generic code generator and it is not a replacement for repository-specific architecture. Its job is to understand the repository first, preserve its laws, identify the smallest safe mechanism for the goal, automate the mechanical work, and escalate only real semantic decisions to a human.

The default principle is:

> **Automate mechanics; surface decisions; fail closed on ambiguity.**

A second principle applies to repeated work:

> **If the same repository decision is being reconstructed several times, stop adding cases and encode the decision as a reusable contract, classifier, manifest, or skill profile.**

---

## Activation triggers

Use this skill when the user says or implies:

- "gestisci il repo", "repo manager", "procedi sul repository"
- "rendiamo questo processo meno manuale/artigianale"
- "trasformiamolo in una skill"
- "compila la prossima tranche"
- "porta questa pipeline a regime"
- "fai avanzare il progetto mantenendo i contratti"
- "analizza impatto e poi implementa"
- "automatizza branch -> test -> PR -> merge -> deploy"

When the user requests a repository-specific compiler, use the appropriate profile. For semantic teaching-content compilation, use the `human_task_content_compiler` profile defined in `HUMAN_TASK_CONTENT_COMPILER.md`.

---

# 1. Repository law boot sequence

Before proposing or writing changes, inspect repository law.

Read these files first **when present**, in this order:

1. `AGENTS.md`
2. `agent.md`
3. `CLAUDE.md`
4. `.claude/commands/repo_manager.md`
5. repository-specific contributor, architecture, governance, and CI instructions referenced by the files above

Rules:

- Treat repository law as higher-priority than generic conventions in this skill.
- If one of the expected law files is missing, report the absence. **Do not invent its contents.**
- If two law files conflict, stop destructive or architectural writes and surface the conflict before proceeding.
- Never use a stale copy of a law file from another branch when operating on the current target branch unless the user explicitly requests that comparison.
- Never commit secrets, credentials, local environment files, tokens, or private keys.

Repository law is not merely documentation. It is part of the executable governance context.

---

# 2. Inspect before changing

Build a current-state repository map before proposing structural changes.

Minimum inspection:

- repository and target branch
- current HEAD / base commit
- working branch strategy
- application type:
  - Next.js / React application
  - static application
  - Python service
  - Node service
  - mixed / monorepo
  - other, explicitly identified
- package/dependency manifests
- source roots and runtime entry points
- persistence and migration layer
- tests and CI workflows
- deployment target(s)
- canonical architecture / contracts / decision records
- generated artifacts and files that must not be edited manually
- repository-local skills and agent instructions

Do not infer architecture from names alone. Verify the relevant files.

### Required outputs of inspection

Produce internally, and surface when useful:

**Dependency map**

`source/contract -> compiler/domain -> runtime -> persistence -> CI -> deployment`

**Impact map**

For the requested change, classify each affected boundary as:

- `UNCHANGED`
- `READ_ONLY_DEPENDENCY`
- `MODIFIED`
- `MIGRATION_REQUIRED`
- `REVIEW_REQUIRED`
- `OUT_OF_SCOPE`

**Inconsistency report**

Report contradictions before modifying them. Do not silently normalize competing canonical sources.

---

# 3. Architecture preservation policy

Preserve the existing architecture unless migration is explicitly requested or the current architecture prevents the stated goal and the user approves a migration.

Hard rules:

- Never blindly flatten directories.
- Never reorganize merely to match a preferred template.
- Never delete files, branches, data, migrations, or canonical artifacts without approval when deletion is materially destructive.
- For repository moves, use `git mv` or the repository/provider equivalent so history remains intelligible.
- Do not replace a stable domain model with a second parallel representation for convenience.
- Do not add a database schema merely because generated code would be easier; first test whether existing canonical storage can support the derived artifact.
- Keep canonical ownership explicit: a projection, cache, manifest, or generated view must not become a competing source of truth.
- Do not weaken authentication, RLS, access control, validation, or fail-closed behavior to make a pipeline easier to run.

---

# 4. Standard Repo Manager workflow

## Phase A — Intake

Resolve:

- target repository
- target branch/base
- user goal
- success condition
- whether the user authorized implementation, merge, deployment, or only analysis

Do not ask for information that repository inspection can resolve directly.

## Phase B — Law and state

Read repository law and inspect current state.

Output a concise state model:

- canonical authority
- derived artifacts
- runtime consumers
- current validation gates
- current unresolved risks

## Phase C — Dependency and impact analysis

Before editing, identify:

- direct files
- transitive consumers
- persistence implications
- test implications
- CI/deploy implications
- backward-compatibility constraints

## Phase D — Detect repetition

Ask of the workflow, not necessarily of the user:

1. Are we repeating a previous sequence of edits?
2. Are block/item-specific constants accumulating?
3. Are tests mostly restating the same invariant for new instances?
4. Is human work mainly selecting among already-known patterns?
5. Are source identity/provenance and promotion rules stable?

If several answers are yes, prefer a **compiler/profile/manifest pipeline** over another artisanal slice.

## Phase E — Choose the smallest reusable mechanism

Choose one of:

- simple patch
- reusable helper
- deterministic validator
- classifier
- manifest / declarative artifact
- repository skill profile
- compiler pipeline

Do not introduce a new abstraction merely because it is possible. Introduce it when it removes repeated decisions while preserving source authority.

## Phase F — Execute on a branch

For material changes:

1. branch from verified target HEAD
2. make the smallest coherent change
3. add/update tests for the **general rule**, not only the current example
4. run the repository's real validation commands
5. open a PR describing decisions, invariants, risks, and non-goals

Prefer one coherent PR over a long sequence of microscopic PRs when the work is generated by one validated manifest/compiler run.

## Phase G — Gate

A change is not ready because code was written.

Required gate categories, as applicable:

- deterministic tests
- type check
- lint/static analysis
- production build
- migration validation
- security/policy checks
- source-generation binding checks
- runtime fail-closed checks
- deployment status on the exact merged commit

A CI failure is evidence. Fix the cause; do not weaken the gate or rewrite the test merely to obtain green status.

## Phase H — Review and promotion

Separate:

- **generated proposal**
- **human-approved artifact**
- **runtime-active artifact**

Promotion must be explicit when semantic or institutional meaning is involved.

A URL parameter, generated file, candidate object, or AI suggestion is not by itself proof of completed work or approval.

## Phase I — Merge and deploy

Merge only when:

- required gates are green
- the expected head SHA has not drifted
- blocking review findings are resolved
- user authorization covers merge

For deployment-sensitive tasks, verify the deployment against the **exact merge commit**, not merely the latest deploy timestamp.

---

# 5. Human Task Content Compiler profile

Profile ID: `human_task_content_compiler`

Full contract: `HUMAN_TASK_CONTENT_COMPILER.md`.

This profile is used when a repository contains canonical planning/content sources and a runtime-facing task model that is currently being populated manually.

The profile turns:

`canonical sources -> structured evidence -> classified recipe -> candidate -> draft -> deterministic checks -> human review -> approved manifest -> runtime`

into one managed repository operation.

The profile's goal is specifically to avoid:

`read source -> write one TypeScript object -> write one block-specific test -> PR -> repeat`

### Core responsibilities

Repo Manager must automatically:

1. discover the next uncovered unit/tranche;
2. locate current canonical sources and their generation/revision identities;
3. extract structured source evidence;
4. compare structural granularity across sources;
5. classify the unit into an existing recipe family;
6. generate draft projections/manifests;
7. run deterministic invariants;
8. surface only ambiguities and semantic decisions for human review;
9. materialize approved manifests without hand-writing one runtime constant per unit;
10. run CI and promotion gates;
11. verify runtime/deploy only after approval.

### Known recipe families

The classifier may select:

- `DIRECT`
- `PACK_COMPOSED`
- `UDA_ONLY`
- `PLAN_GUIDED_UDA`

If none satisfy the contract, return:

`UNRESOLVED — HUMAN DESIGN REQUIRED`

Do **not** invent a fifth recipe automatically.

A new recipe family is justified only when a repeated unresolved source relationship has been observed and explicitly designed.

---

# 6. Compiler decision policy

The profile must distinguish **binding** from **didactic/operational provenance**.

A source may be required because the canonical plan binds it to a segment, while contributing nothing to the current operational view.

Therefore:

> **Bound source != displayed source != content-generating source.**

Do not expose a long canonical document in the runtime merely because it exists or is bound to the segment.

Do not derive duration from a support document when the canonical plan/UDA owns duration.

Do not copy stale or broader project timings into a narrower canonical block.

Do not invent internal minute allocations when the source specifies only block duration.

Do not invent worksheets, assessment questions, local rules, materials, transitions, or preparation steps.

---

# 7. Candidate, draft, manifest, runtime

Treat these as distinct states.

## Candidate

Evidence-bearing machine result. Contains:

- target unit identity
- canonical structural binding
- current source identities / generations
- extracted evidence
- classifier result
- warnings / blocking issues

Candidate is never runtime-active.

## Draft

A task projection produced by a recipe from a valid candidate.

Draft may contain source-derived editorial proposals but remains unapproved.

## Approved manifest

The canonical derived artifact for runtime consumption.

Prefer a declarative manifest over hand-written per-unit runtime code.

Minimum manifest fields:

- manifest version
- projection ID
- target grade/class/context
- canonical unit/block ID
- recipe family
- plan binding
- source-generation bindings
- contributing-source provenance
- duration and timing specificity
- operational steps
- resource bindings
- evidence
- observation/assessment fields
- editorial fields and their provenance class
- approval status and approval timestamp/reference
- invalidation/fingerprint data

## Runtime

Runtime loads only approved manifests and validates their binding against the current canonical structure.

If binding or source identity drifts, runtime must fail closed and return the unit to review rather than silently serving stale content.

---

# 8. Human review contract

The compiler should minimize review burden.

Do not ask the reviewer to reread every source document.

Present a review table such as:

| Unit | Proposed recipe | Operational sources | Coverage | Ambiguity | Decision |
|---|---|---|---|---|---|
| X01 | DIRECT | Plan + UDA + Pack | exact | none | approve |
| X02 | PLAN_GUIDED_UDA | Plan + UDA | exact | none | approve |
| X03 | PACK_COMPOSED | Plan + UDA + support Pack | exact | one uncertain resource | review |
| X04 | UNRESOLVED | sources available | incomplete | structural | design required |

Human actions should be limited to:

- `APPROVE`
- `CORRECT`
- `BLOCK`
- `DESIGN NEW RECIPE`

The agent must not convert `BLOCK` into a guessed implementation.

---

# 9. Editorial content policy

Fields such as `why`, `objective`, `assessmentNote`, `continuation`, labels, and microcopy may be generated as source-derived editorial proposals.

Rules:

- preserve the meaning of selected source evidence;
- never present editorial synthesis as a direct quote or canonical datum;
- mark it internally as `SOURCE_DERIVED_EDITORIAL`;
- require human approval before semantic promotion when the field affects teaching/professional interpretation;
- technical IDs remain provenance, not primary human UI labels.

---

# 10. Generic compiler invariants

Prefer generic tests over one test per unit.

At minimum validate:

1. every approved manifest has current source identities;
2. every approved manifest matches current canonical structural binding;
3. selected source coverage accounts for the canonical duration when duration is claimed;
4. internal timings are absent when not source-supported;
5. resources refer to extracted resources, never invented IDs;
6. no orphan resource binding exists;
7. contributing sources are distinguished from merely bound sources;
8. no support source overrides the canonical duration owner;
9. no technical identifier is required from the end user to complete the task;
10. ambiguous classification never auto-promotes;
11. changed source generations invalidate dependent drafts/manifests;
12. runtime uses approved manifests only;
13. canonical source ownership remains outside the manifest;
14. full source documents remain available for verification but are secondary to task-specific operational rendering.

Block-specific tests should be added only for genuine exceptional semantics or regression-prone historical decisions.

---

# 11. Batch execution mode

When asked to "compile the next tranche" or equivalent:

1. find the first uncovered canonical unit;
2. determine a coherent tranche boundary, preferably one UDA/module/segment;
3. discover all required current sources in one pass;
4. parse them once;
5. classify all units;
6. build all candidates/drafts;
7. run generic invariants as a batch;
8. surface only units needing review;
9. promote approved units to manifests in one coherent change;
10. run repository CI once on the complete tranche;
11. open/update one PR for the tranche unless repository law requires otherwise.

Do not create one PR per unit merely because the old manual workflow did so.

---

# 12. Status vocabulary

Use stable status terms:

- `DISCOVERED`
- `CANDIDATE_READY`
- `BLOCKED_SOURCE`
- `UNRESOLVED`
- `READY_FOR_HUMAN_REVIEW`
- `READY_FOR_HUMAN_APPROVAL`
- `APPROVED`
- `MANIFEST_MATERIALIZED`
- `CI_FAILED`
- `READY_TO_MERGE`
- `MERGED`
- `DEPLOY_PENDING`
- `DEPLOY_READY`
- `INVALIDATED_BY_SOURCE_DRIFT`

Do not describe a candidate as completed or published.

---

# 13. Output format

For substantial Repo Manager operations, report compactly:

**State** — current repository/base/target.

**Decision** — mechanism/profile selected and why.

**Impact** — modified boundaries and explicitly unchanged boundaries.

**Automation result** — counts of discovered / generated / approved / blocked / unresolved units.

**Gates** — tests/type/lint/build/migrations/security/deploy as applicable.

**Residual decisions** — only items requiring human input.

**Next operation** — one recommended repository-level action, not a long list of micro-edits.

---

# 14. Success criteria

The skill succeeds when:

- repository law is respected;
- architecture is preserved unless migration was approved;
- dependency and impact analysis precede material changes;
- repeated mechanics are automated;
- semantic decisions remain reviewable;
- source provenance is explicit;
- ambiguity fails closed;
- CI validates general invariants;
- approved derived artifacts are declarative where practical;
- runtime does not depend on hand-written per-unit cases;
- merge and deployment are tied to exact commits;
- the amount of human work decreases as coverage increases.

For the Human Task Content Compiler specifically, success means that adding the next coherent tranche is primarily a **compile/review operation**, not a new programming exercise.