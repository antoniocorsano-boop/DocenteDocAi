# DocenteDoc AI - Copilot Instructions

## Project Overview

DocenteDoc AI è un ecosistema didattico intelligente per docenti italiani. È una PWA (Progressive Web App) con architettura **Local-First** - tutti i dati sensibili rimangono sul dispositivo dell'utente.

### Caratteristiche Principali
- 📚 Gestione studenti, valutazioni, lezioni
- 📅 Calendario e orario scolastico
- 🤖 Assistente AI integrato (Google Gemini)
- 📝 Generazione documenti (UDA, PDP, relazioni)
- 💾 Backup su Google Drive (BYOC - Bring Your Own Cloud)
- 🔒 Crittografia locale dei dati sensibili
- 🛠️ **Gestione Suggerimenti AI**: Logica per suggerimenti personalizzati e gestione dei suggerimenti ignorati.

---

## Tech Stack

### Core
- **React 18.2** - Functional components only, no class components
- **TypeScript 5.2** - Strict mode enabled
- **Vite 5.2** - Build tool and dev server
- **Zustand 4.4** - State management

### AI & Documents
- **@google/genai** - Google Gemini AI integration
- **docx** - Word document generation
- **jspdf** - PDF generation
- **pdf-lib** - PDF manipulation
- **mammoth** - Word document parsing

### Testing
- **Vitest** - Unit testing
- **Playwright** - E2E testing
- **@testing-library/react** - Component testing

---

## Architecture

### Directory Structure
```
src/
├── components/     # React components (120+ components)
├── stores/         # Zustand stores (useDataStore, useUIStore, useSettingsStore)
├── services/       # Business logic (AI, backup, Google Drive)
├── hooks/          # Custom React hooks
├── utils/          # Utility functions
├── design-system/  # Theme tokens and design system
└── types.ts        # TypeScript interfaces (central type definitions)
```

### State Management Pattern
```typescript
// Use Zustand stores - NO Redux, NO Context for state
import { useDataStore } from '../stores/useDataStore';
import { useUIStore } from '../stores/useUIStore';
import { useSettingsStore } from '../stores/useSettingsStore';

// Access state
const students = useDataStore(state => state.studenti);
const { showToast } = useUIStore(state => state.actions);
```

### Component Pattern
```typescript
// Always use functional components with TypeScript
interface MyComponentProps {
  title: string;
  onAction: () => void;
}

const MyComponent: React.FC<MyComponentProps> = ({ title, onAction }) => {
  // Component logic
  return <div>{title}</div>;
};

export default MyComponent;
```

---

## Coding Standards

### TypeScript
- Always define interfaces for props and complex objects
- Use `types.ts` for shared interfaces
- Prefer `interface` over `type` for object shapes
- Use strict null checks

### React
- Functional components only
- Use hooks (useState, useEffect, useMemo, useCallback)
- Memoize expensive computations
- Keep components focused and small

### Styling
- Use CSS variables from `theme.css`
- Follow Material Design 3 Expressive guidelines
- Use semantic color tokens: `var(--sys-primary)`, `var(--sys-surface)`
- Responsive design with mobile-first approach

### Naming Conventions
- Components: PascalCase (`StudentProfile.tsx`)
- Hooks: camelCase with `use` prefix (`useAppEngine.ts`)
- Utils: camelCase (`documentUtils.ts`)
- Constants: SCREAMING_SNAKE_CASE
- Interfaces: PascalCase with descriptive names

---

## Key Interfaces

### Student (Studente)
```typescript
interface Studente {
  id: string;
  nome: string;
  cognome: string;
  classe: string;
  email?: string;
  hasBES?: boolean;
  hasDSA?: boolean;
  has104?: boolean;
}
```

### Evaluation (Valutazione)
```typescript
interface Valutazione {
  id: string;
  studenteId: string;
  materia: string;
  data: string;
  tipo: 'Scritto' | 'Orale' | 'Pratico' | 'Test' | 'Verifica';
  voto: string;
  argomento?: string;
  note?: string;
}
```

### Lesson (Lezione)
```typescript
interface Lezione {
  id: string;
  slotKey: string;
  data: string;
  materia: string;
  classe: string;
  contenuto: string;
  tipoLezione: 'frontale' | 'laboratorio' | 'verifica' | 'recupero' | 'altro';
  obiettivi?: string;
}
```

---

## Testing Guidelines

### Unit Tests
```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

describe('ComponentName', () => {
  it('should render correctly', () => {
    render(<ComponentName />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });
});
```

### Run Tests
```bash
npm test           # Watch mode
npm run test:unit  # Single run
npm run e2e        # Playwright E2E
```

### Mocking and Stubbing
- Use `vi.fn()` for mocking functions.
- Use `@testing-library/react` for mocking DOM interactions.
- Mock API calls using libraries like `msw` (Mock Service Worker).

---

## Development Workflow

### Goals
- **Consistency**: Ensure all code adheres to project standards.
- **Error Prevention**: Avoid linting errors, dependency misalignments, and runtime issues.
- **Efficiency**: Streamline the development process with clear steps and automation.

### Workflow Steps

1. **Plan the Change**
   - Clearly define the feature or bug fix.
   - Identify the files and components affected.
   - Check the `copilot-instructions.md` file for relevant guidelines.

2. **Set Up the Environment**
   - Ensure all dependencies are installed:
     ```bash
     npm install
     ```
   - Run the development server:
     ```bash
     npm run dev
     ```
   - Verify the environment is working correctly.

3. **Follow Coding Standards**
   - Use TypeScript for strict typing.
   - Follow the naming conventions and patterns outlined in this document.
   - Write modular, reusable code.

4. **Write and Test Code**
   - Write the code for the feature or fix.
   - Add unit tests using `Vitest`:
     ```bash
     npm run test:unit
     ```
   - If applicable, add E2E tests using `Playwright`:
     ```bash
     npm run e2e
     ```
   - Ensure all tests pass before committing.

5. **Lint and Format Code**
   - Run the linter to check for issues:
     ```bash
     npm run lint
     ```
   - Fix any linting errors before proceeding.

6. **Commit and Push Changes**
   - Write clear, concise commit messages.
   - Push changes to the repository:
     ```bash
     git push origin <branch-name>
     ```

7. **Code Review and Merge**
   - Open a pull request for review.
   - Address any feedback from reviewers.
   - Merge the pull request once approved.

8. **Monitor and Iterate**
   - Monitor the feature or fix in production.
   - Iterate based on user feedback or issues.

### Automation Tools
- **Pre-commit Hooks**: Use tools like `husky` to enforce linting and testing before commits.
- **CI/CD Pipelines**: Automate testing and deployment using GitHub Actions or similar tools.
- **Code Analysis**: Integrate tools like SonarQube for static code analysis.

### Best Practices
- **Document Changes**: Update relevant documentation for every change.
- **Keep Commits Atomic**: Each commit should represent a single, logical change.
- **Refactor Regularly**: Improve code quality and maintainability over time.
- **Communicate Clearly**: Keep the team informed about changes and progress.

---

## Managing the View Layer

When working with the view layer, it is essential to adhere to the following guidelines to maintain consistency and prevent uncontrolled modifiche:

1. **Follow Component Standards**:
   - Ensure all new components are created in the `src/components/` directory.
   - Define TypeScript interfaces for props e export components as default.
   - If the component is a view, register it in `ViewManager.tsx`.

2. **Respect Design Tokens**:
   - Use the design tokens defined in `src/design-system/theme.ts` for styling.
   - Avoid hardcoding colors, spacing, or typography values.

3. **Ensure Accessibility**:
   - Follow WCAG 2.1 AA guidelines to ensure the UI is accessible to all users.
   - Test components with screen readers and keyboard navigation.

4. **Validate Layout Changes**:
   - Before modifying layouts, review the existing structure to avoid breaking changes.
   - Test layout changes across different screen sizes to ensure responsiveness.

5. **Code Review**:
   - All changes to the view layer must undergo a code review to ensure adherence to these standards.

---

## Protecting Critical Files

To ensure the stability and integrity of the project, the following guidelines must be followed when working with critical files:

1. **Identify Critical Files**:
   - Files that define the core architecture, such as `vite.config.ts`, `tsconfig.json`, and `src/design-system/theme.ts`.
   - Files that, if modified incorrectly, could break the application, such as `src/types.ts` and Zustand store files.

2. **Modification Restrictions**:
   - Avoid modifying these files unless absolutely necessary.
   - Any changes must be reviewed and approved by a senior developer.

3. **Testing Requirements**:
   - Ensure comprehensive testing is performed after any changes to critical files.
   - Run all unit and E2E tests to verify stability.

4. **Documentation**:
   - Document the reason for any changes to critical files in the commit message and relevant documentation.

By adhering to these guidelines, you can prevent unintended disruptions and maintain the stability of the project.

---

## Deployment Best Practices

1. **Vercel Deployment**:
   - Use the `vercel deploy` task for production deployments.
   - Ensure all tests pass before deploying.

2. **Environment Variables**:
   - Verify that all required environment variables are set in the Vercel dashboard.

3. **Post-Deployment Checks**:
   - Test the deployed application to ensure it functions as expected.
   - Monitor logs for any runtime errors.

By following these best practices, you can ensure smooth and reliable deployments.
