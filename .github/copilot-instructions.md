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
- Follow Material Design 3 guidelines
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

---

## Common Tasks

### Adding a New Component
1. Create file in `src/components/`
2. Define TypeScript interface for props
3. Export as default
4. Add to `ViewManager.tsx` if it's a view

### Adding a New Store Slice
1. Add to appropriate store (`useDataStore`, `useUIStore`, `useSettingsStore`)
2. Define interface in `types.ts`
3. Add actions in the store's `actions` object

### AI Integration
```typescript
import { generateContent } from '../services/aiService';

const response = await generateContent(prompt, {
  temperature: 0.7,
  maxTokens: 1000
});
```

---

## Important Notes

- 🇮🇹 UI text is in Italian
- 📱 PWA - must work offline
- 🔒 Privacy-first - no data leaves device without user consent
- 🎨 Material Design 3 compliance
- ♿ Accessibility (WCAG 2.1 AA)

---

## Files to Reference

- `src/types.ts` - All TypeScript interfaces
- `src/stores/useDataStore.ts` - Main data store
- `src/stores/useUIStore.ts` - UI state (modals, toasts)
- `src/components/App.tsx` - Main app component
- `src/design-system/theme.ts` - Design tokens
