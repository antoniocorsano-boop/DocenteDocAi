# Human Task Content Compiler Profile

Profile ID: `human_task_content_compiler`
Parent skill: `repo_manager`
Status: CANONICAL PROFILE CONTRACT

## Goal

Turn a repository that currently materializes task-oriented content one unit at a time into a compiler-driven workflow where the system discovers source evidence, classifies source relationships, generates reviewable drafts, and materializes approved declarative manifests.

The target operating loop is:

`canonical sources -> structured evidence -> classifier -> candidate -> recipe -> draft -> deterministic validation -> human approval -> manifest -> runtime`

The anti-pattern this profile replaces is:

`read documents -> hand-write one runtime object -> add one specific test -> PR -> repeat`

---

## 1. Required project adapter

The compiler is repository-agnostic. Each project must expose or identify these roles:

### Canonical structure authority
Defines order, unit identity, duration, source binding, and progression.

Examples:
- annual plan
- curriculum sequence
- workflow specification
- release plan
- canonical queue

### Semantic source
Defines domain meaning, objectives, outcomes, evidence, constraints, phases, or content semantics.

### Operational source
Defines activities, procedures, worksheets, resources, checklists, rubrics, prompts, or execution guidance.

### Runtime projection contract
Defines the task-facing object consumed by the product/runtime.

### Current-source identity
A revision, generation ID, hash, commit, document revision, or other stable identity that lets the compiler invalidate derived artifacts after source drift.

The project adapter must identify which source owns which property. In particular, duration ownership must be explicit.

---

## 2. Discovery algorithm

When invoked without an explicit range:

1. read the canonical structure;
2. find the first unit not covered by an active approved manifest;
3. extend the tranche to a coherent semantic boundary such as one UDA/module/segment;
4. discover all canonical and support sources referenced by that tranche;
5. resolve the current revision/generation of each source;
6. report missing or duplicate current sources before classification.

The discovery pass should load each source once per tranche whenever possible.

Output:

```text
tranche
  startUnit
  endUnit
  structuralSource
  semanticSources[]
  operationalSources[]
  supportSources[]
  currentSourceIdentities{}
  uncoveredUnits[]
```

---

## 3. Structured extraction

Extract structure, not just text.

Possible semantic objects:

```text
CanonicalPlan
Module/UDA
Phase
Lesson/Block
ActivityStep
Resource
Evidence
Assessment
Adaptation
Constraint
SourceReference
```

Each extracted object must retain source identity and a locator sufficient for later verification.

Do not create a second archive. Reuse the repository's existing KB/index/normalized-source layer when available.

A source that cannot be parsed sufficiently should produce an extraction issue, not guessed structure.

---

## 4. Recipe classifier

The classifier uses deterministic invariants before editorial similarity.

### DIRECT

Choose `DIRECT` when an operational source contains a guide or lesson that directly corresponds to the canonical unit and does not conflict with the structure/duration owner.

Required evidence:
- canonical unit identified;
- matching semantic context;
- direct operational section identified;
- source identities current;
- no duration conflict.

### PACK_COMPOSED

Choose `PACK_COMPOSED` when multiple operational/support sections must be combined to execute the canonical unit.

Required evidence:
- each contributing source is explicitly bound or justified;
- the canonical structure remains the owner of unit identity/duration;
- contribution of each source is explicit;
- logistics-only sources are not presented as semantic/didactic sources.

### UDA_ONLY

Choose `UDA_ONLY` when no direct operational guide is required because one semantic phase already contains enough explicit action to support the unit.

Required evidence:
- one semantic phase matches the canonical unit duration exactly;
- the phase contains explicit operational action, not only abstract goals;
- evidence/observation can be selected from the same canonical semantic source;
- no resource or procedure is fabricated to make the lesson look complete.

### PLAN_GUIDED_UDA

Choose `PLAN_GUIDED_UDA` when the canonical structure disambiguates a semantic source whose granularity differs from the runtime unit.

Supported relationships include:
- one canonical block -> one exact semantic phase;
- multiple consecutive semantic phases -> one canonical block when durations sum exactly;
- one broader semantic phase -> multiple canonical blocks when the canonical structure explicitly differentiates their tasks and the complete phase duration is accounted for.

Required evidence:
- current structural source identity;
- explicit canonical activity/evidence for the block where needed;
- full duration accounting;
- no inferred split absent from the canonical structure.

### UNRESOLVED

Return `UNRESOLVED — HUMAN DESIGN REQUIRED` when none of the above can satisfy the invariants.

Examples:
- ambiguous unit boundaries;
- source duration conflicts with no clear authority;
- operational source belongs to a broader project with no canonical split;
- evidence required by runtime is absent;
- resource identity cannot be extracted reliably;
- two canonical sources claim incompatible ownership.

The classifier must not invent a new recipe family by itself.

---

## 5. Candidate contract

A candidate is a machine-generated evidence bundle.

Suggested schema:

```json
{
  "candidateVersion": 1,
  "candidateId": "...",
  "target": {
    "context": "...",
    "unitId": "...",
    "segmentId": "...",
    "title": "...",
    "durationMinutes": 120
  },
  "binding": {
    "structuralSource": "...",
    "semanticSource": "...",
    "primaryOperationalSource": "...",
    "supportSources": []
  },
  "sourceIdentities": {},
  "evidence": {
    "semantic": [],
    "operational": [],
    "resources": [],
    "assessment": []
  },
  "classification": {
    "recipe": "PLAN_GUIDED_UDA",
    "reasons": [],
    "issues": []
  },
  "gate": "READY_FOR_HUMAN_REVIEW"
}
```

Candidate IDs should change when source identities relevant to the candidate change.

---

## 6. Draft generation

A valid candidate plus recipe produces a draft runtime projection.

Draft generation may:
- select source-supported steps;
- select source-supported resources;
- select source-supported evidence/observation criteria;
- create concise human labels;
- create source-derived editorial synthesis.

Draft generation may not:
- invent duration;
- assign internal minutes absent from source;
- invent worksheets;
- invent assessment questions;
- invent local rules/data;
- promote a support source to canonical authority;
- silently omit a blocking source conflict.

Draft status maximum before review:

`READY_FOR_HUMAN_APPROVAL`

Never `AUTO_APPROVED` for semantic professional content unless the project explicitly adopts a separate policy authorizing it.

---

## 7. Editorial synthesis classes

Every generated field should have one provenance class:

- `CANONICAL_EXACT`
- `SOURCE_SELECTED`
- `SOURCE_DERIVED_EDITORIAL`
- `TECHNICAL_METADATA`

Examples:

`title` may be `CANONICAL_EXACT`.

`step.instruction` may be `SOURCE_SELECTED`.

`why` may be `SOURCE_DERIVED_EDITORIAL`.

`generationId` is `TECHNICAL_METADATA`.

The runtime human view should primarily expose human labels and task content. Technical metadata remains available for verification/diagnostics.

---

## 8. Human review package

Generate one review package per tranche.

Summary example:

```text
Tranche: B28-B33
Sources current: 4/4
Candidates: 6
DIRECT: 2
PLAN_GUIDED_UDA: 3
PACK_COMPOSED: 0
UDA_ONLY: 0
UNRESOLVED: 1
Ready for approval: 5
Blocking decisions: 1
```

For each unit show:
- human title;
- proposed recipe;
- structural/semantic/operational sources;
- coverage/duration account;
- resources included/excluded;
- editorial fields proposed;
- warnings;
- source excerpts/locators only where needed to decide.

Do not default to rendering full normalized documents.

Human actions:
- APPROVE
- CORRECT
- BLOCK
- DESIGN NEW RECIPE

Corrections that change source meaning must either update the canonical source or be explicitly recorded as an approved derived/editorial decision. Do not silently mutate provenance.

---

## 9. Approved Manifest contract

The approved manifest should be declarative and data-oriented.

Suggested schema:

```json
{
  "manifestVersion": 1,
  "projectionId": "...",
  "status": "APPROVED",
  "target": {
    "context": "...",
    "unitId": "...",
    "segmentId": "..."
  },
  "recipe": "PLAN_GUIDED_UDA",
  "planBinding": {},
  "sourceBindings": [],
  "contributingSources": [],
  "duration": {
    "totalMinutes": 120,
    "specificity": "BLOCK_ONLY"
  },
  "steps": [],
  "resources": [],
  "evidence": "...",
  "observation": [],
  "assessment": {},
  "editorial": {},
  "approval": {
    "approvedAt": "...",
    "approvalRef": "..."
  },
  "fingerprint": "..."
}
```

The exact project schema may differ, but the distinction among structural binding, contributing provenance, task data, and approval must remain.

---

## 10. Runtime materialization

Preferred architecture:

`manifest registry/loader -> generic resolver -> task workspace`

Avoid:

```text
if unit === B28 return projection28
if unit === B29 return projection29
...
```

The generic resolver should validate:
- target identity;
- structural binding;
- source-generation fingerprint if available at runtime or build time;
- support-source binding where relevant;
- resource integrity;
- approved status.

On drift, fail closed.

---

## 11. Generic CI contract

The compiler/profile should be validated primarily by general invariants.

### Source gates
- current source uniquely resolved;
- expected source code/identity matches;
- required source exists;
- parse result is non-empty when required.

### Classification gates
- exactly one recipe selected or UNRESOLVED;
- recipe prerequisites satisfied;
- coverage/duration relationship valid;
- no unsupported source promoted.

### Draft gates
- all resource references resolve;
- no invented timing;
- no unsupported resource;
- evidence exists where required;
- editorial provenance tagged;
- technical codes not required in primary user task.

### Manifest gates
- approved status present;
- binding fingerprint current;
- manifest schema valid;
- no duplicate active projection per target unit;
- no gap accidentally skipped between current progress and next active unit unless explicitly permitted.

### Runtime gates
- generic loader can resolve all approved manifests;
- drift returns null/review state rather than stale content;
- next unapproved unit falls back according to project policy;
- recording/persistence behavior remains independent from compiler generation unless explicitly coupled by domain contract.

Specific regression tests remain appropriate for exceptional historical cases, not for every new unit.

---

## 12. Mutation policy

### Allowed automatically after valid user authorization
- create feature branch;
- add compiler/profile code;
- generate candidate/draft artifacts;
- generate/update manifests after explicit approval;
- update registry/loader;
- update tests for generic invariants;
- open PR;
- run/inspect CI;
- merge if user authorization and repository policy allow;
- verify deploy on exact commit.

### Requires explicit semantic approval
- promote draft to approved manifest;
- introduce a new recipe family;
- reinterpret conflicting canonical authorities;
- fill absent assessment/resources with newly authored content;
- change canonical duration or sequence;
- alter institutional/professional meaning.

### Never do silently
- delete canonical source;
- weaken security or RLS;
- use old source revision to make current candidate pass;
- change tests solely to bless an invalid classification;
- publish a candidate as if approved;
- display a whole source document as the operational UI merely because semantic extraction is incomplete.

---

## 13. DOCENTE OS adapter baseline

The profile was derived from the DOCENTE OS Human Task Content work and should recognize this baseline when operating on that repository.

Canonical content architecture:

`CAN-PLAN -> CAN-UDA -> CAN-PACK -> Human Task Projection`

Operational semantic model:

`UDA -> lesson sequence -> activities -> resources -> evidence -> assessment -> adaptations`

Known approved recipe families:
- DIRECT
- PACK_COMPOSED
- UDA_ONLY
- PLAN_GUIDED_UDA

Core UX invariant:

> The canonical document is a preservation/validation/reporting form; it is not automatically a good interaction form.

Primary runtime should therefore show task-specific semantic views rather than normalized-text document dumps when task context is known.

DOCENTE OS-specific fail-closed rules:
- Knowledge tags never define canonical class existence;
- manual timetable presence never creates/links canonical class;
- annual plan owns sequence and hour accounting;
- technical IDs are provenance, not first-level UI;
- support is contextual/progressive;
- feedback is end-of-task and separate from didactic data;
- source-generation drift invalidates dependent derived content;
- do not add a database schema unless the structured extraction/promotion model truly needs one.

This appendix is an adapter baseline, not a reason to hard-code DOCENTE OS concepts into the generic Repo Manager engine.

---

## 14. Command semantics

Examples of user intents the profile should resolve:

### "Compile the next tranche"
Discover next uncovered coherent segment, compile candidates/drafts, validate, and present review package. Do not promote without approval.

### "Approve the tranche"
Validate that the reviewed candidate/draft identities have not drifted, materialize approved manifests, run full gates, prepare PR/merge according to authorization.

### "Continue automatically"
Advance through coherent tranches, stopping only at UNRESOLVED/blocking review conditions or at repository-policy boundaries. Do not treat this as permission to invent semantic decisions.

### "Why is this blocked?"
Return the failed invariant and exact source relationship. Do not respond with generic uncertainty when a deterministic gate explains the block.

---

## 15. Maturity target

The profile is mature when repository effort scales approximately with the number of **new source relationship patterns**, not with the number of units.

A healthy trajectory is:

- early stage: many unit-specific implementations;
- transition: stable recipe families and generic invariants;
- mature stage: whole-module compilation with small review sets;
- steady state: only new source grammars, new recipe relationships, or genuine semantic exceptions require engineering.

For DOCENTE OS, the immediate proof of maturity is that the next annual-plan tranche can be generated primarily through this compiler/review pipeline instead of adding another hand-written block registry.