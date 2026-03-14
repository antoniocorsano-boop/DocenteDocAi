# TASK — Implement Teacher Copilot (DocenteDoc)

You are acting as a **senior TypeScript / React engineer** working on the DocenteDoc project.

The application already contains a working AI analysis layer:

```
src/ai/contextEngine/
```

Modules available:

- contextBuilder.ts
- riskAnalyzer.ts
- excellenceAnalyzer.ts
- suggestionEngine.ts

These modules must be **reused**, not modified.

Your task is to implement a **Teacher Copilot** that allows the teacher to query the system for insights about a class.

The Copilot must follow **Italian school grading rules (1–10 scale)**.

The AI **never makes decisions** — it only provides insights.

---

# RULES

1. Do NOT modify existing `contextEngine` files.
2. Add new logic under:

```
src/ai/copilot
```

3. All functions must be **pure and testable**.
4. Avoid `any`.
5. Maintain TypeScript strictness.
6. Add unit tests.
7. UI integration comes later.

---

# STEP 1 — Create Folder

Create:

```
src/ai/copilot
```

Files:

```
types.ts
copilotCommands.ts
copilotContextBuilder.ts
copilotEngine.ts
classSummary.ts
```

---

# STEP 2 — Define Copilot Types

Create `types.ts`

```ts
export type CopilotCommand =
  | "students_at_risk"
  | "top_students"
  | "class_summary"
  | "missing_assessments";

export interface CopilotResponse {
  command: CopilotCommand;
  message: string;
  data?: unknown;
}
```

---

# STEP 3 — Copilot Context Builder

File:

```
copilotContextBuilder.ts
```

Purpose:

Collect all data required by the Copilot.

Use the same structure used by `AIContext`.

Example:

```ts
export function buildCopilotContext(
  students: Student[],
  lessons: Lesson[],
  evaluations: Evaluation[],
): AIContext;
```

Reuse:

```
buildAIContext()
```

from `contextEngine`.

---

# STEP 4 — Class Summary Generator

File:

```
classSummary.ts
```

Create function:

```ts
export function generateClassSummary(context: AIContext);
```

Compute:

- number of students
- class average
- students at risk
- excellent students

Example output:

```
Classe 3A

Studenti: 24
Media classe: 6.7

Studenti a rischio: 3
Studenti eccellenti: 2
```

Use:

```
analyzeRisk()
analyzeExcellence()
```

---

# STEP 5 — Copilot Commands

File:

```
copilotCommands.ts
```

Map commands to actions.

Example:

```ts
export function runCopilotCommand(
  command: CopilotCommand,
  context: AIContext,
): CopilotResponse;
```

Implement:

students_at_risk → run riskAnalyzer

top_students → run excellenceAnalyzer

class_summary → run generateClassSummary

missing_assessments → reuse suggestionEngine

---

# STEP 6 — Copilot Engine

File:

```
copilotEngine.ts
```

Main function:

```ts
export function askCopilot(
  command: CopilotCommand,
  context: AIContext,
): CopilotResponse;
```

Pipeline:

```
input command
 ↓
copilotCommands
 ↓
structured response
```

---

# STEP 7 — Unit Tests

Create:

```
src/ai/copilot/__tests__
```

Tests must cover:

- class summary generation
- students_at_risk command
- top_students command
- missing_assessments command

---

# STEP 8 — Success Criteria

Implementation is correct if:

- TypeScript compiles
- ESLint passes
- tests pass
- copilotEngine returns meaningful responses

---

# IMPORTANT

Do NOT implement UI yet.

Only implement the **Copilot reasoning engine**.

---

# END TASK
