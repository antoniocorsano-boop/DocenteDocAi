# TASK — Implement AI Context Engine (DocenteDoc)

You are acting as a **senior software engineer** working on the DocenteDoc application.

The project is already stable:

- all tests pass
- lint is clean
- routing and context navigation are working
- dashboard and analytics already exist

Your task is to **implement the AI Context Engine** WITHOUT breaking the existing architecture.

You must follow these rules strictly.

---

# RULES

1. **Do not modify existing working modules unless necessary.**
2. **Add new modules under `src/ai/`.**
3. **All logic must be pure functions first (testable).**
4. **UI integration comes later.**
5. **All code must pass lint and tests.**
6. **Use TypeScript strictly.**
7. **Avoid `any`.**

---

# GOAL

Create an **AI engine that analyzes classroom data and generates teaching insights**.

The engine must read:

- students
- lessons
- evaluations
- competencies

and generate **suggestions**.

Example output:

```ts
{
 type: "student_at_risk",
 studentId: "123",
 confidence: 0.82,
 message: "Student shows declining competence trend"
}
```

---

# STEP 1 — Folder Structure

Create:

```
src/ai/contextEngine/
```

Files:

```
contextBuilder.ts
suggestionEngine.ts
riskAnalyzer.ts
excellenceAnalyzer.ts
types.ts
```

---

# STEP 2 — Define Types

Create `types.ts`

```ts
export type SuggestionType =
  | "student_at_risk"
  | "student_excellence"
  | "missing_assessment"
  | "learning_gap";

export interface AISuggestion {
  id: string;
  type: SuggestionType;
  message: string;
  confidence: number;
  studentId?: string;
  classId?: string;
}
```

---

# STEP 3 — Context Builder

`contextBuilder.ts`

Goal: assemble all data required by AI.

```ts
export interface AIContext {
  students: Student[];
  lessons: Lesson[];
  evaluations: Evaluation[];
}
```

Function:

```ts
export function buildAIContext(
  students: Student[],
  lessons: Lesson[],
  evaluations: Evaluation[],
): AIContext;
```

This must be a pure function.

---

# STEP 4 — Risk Analyzer

File:

```
riskAnalyzer.ts
```

Goal: detect **students with declining performance**.

Example logic:

- average score dropping
- repeated low evaluations
- missing competency coverage

Output:

```
AISuggestion[]
```

Example suggestion:

```
{
 type: "student_at_risk",
 studentId: "marco",
 confidence: 0.76,
 message: "Marco shows declining performance in reading comprehension"
}
```

---

# STEP 5 — Excellence Analyzer

File:

```
excellenceAnalyzer.ts
```

Detect:

- consistently high scores
- fast competency acquisition

Output:

```
AISuggestion[]
```

Example:

```
{
 type: "student_excellence",
 studentId: "anna",
 confidence: 0.91,
 message: "Anna consistently exceeds competency expectations"
}
```

---

# STEP 6 — Suggestion Engine

File:

```
suggestionEngine.ts
```

Main orchestrator.

Function:

```ts
export function generateAISuggestions(context: AIContext): AISuggestion[];
```

Pipeline:

```
context
 ↓
riskAnalyzer
 ↓
excellenceAnalyzer
 ↓
merge suggestions
```

---

# STEP 7 — Unit Tests

Create:

```
src/ai/contextEngine/__tests__/
```

Test cases:

- student with declining scores → risk suggestion
- high performing student → excellence suggestion
- empty data → no suggestions

Use existing test framework (Vitest).

---

# STEP 8 — Do NOT Yet

Do NOT implement:

- UI
- dashboard integration
- live updates

This task is **engine only**.

---

# SUCCESS CRITERIA

The implementation is correct if:

- TypeScript compiles
- tests pass
- lint passes
- suggestionEngine returns meaningful suggestions

---

# END TASK
