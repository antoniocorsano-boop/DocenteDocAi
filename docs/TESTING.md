# DocenteDoc AI - Strategia Testing

> **Documento Testing** - Coverage, qualità del codice e processi di testing

## 📋 Panoramica

Questa guida definisce la strategia di testing completa per **DocenteDoc AI**, assicurando qualità del codice, affidabilità e manutenibilità attraverso testing sistematico e automatizzato.

### 🎯 Obiettivi Testing

- **Coverage ≥80%**: Target minimo per tutto il codebase
- **Zero Bug Critical**: Nessun bug critico in produzione
- **Fast Feedback**: Test suite che gira in < 5 minuti
- **Maintainable Tests**: Test chiari, documentati e facili da modificare

---

## 🧪 Testing Pyramid

```
E2E Tests (5%)     - Flussi utente completi
Integration (15%)  - Interazioni tra componenti
Unit Tests (80%)   - Componenti e funzioni isolate
```

### Coverage Targets Dettagliati

| Tipo | Target | Descrizione |
|------|--------|-------------|
| **Line Coverage** | ≥80% | Ogni linea di codice testata |
| **Branch Coverage** | ≥75% | Tutti i path condizionali coperti |
| **Function Coverage** | ≥85% | Ogni funzione chiamata almeno una volta |
| **Statement Coverage** | ≥80% | Ogni statement eseguito |

---

## 🛠️ Setup Testing Environment

### Dipendenze Testing
```json
{
  "devDependencies": {
    "@testing-library/react": "^14.0.0",
    "@testing-library/jest-dom": "^6.0.0",
    "@testing-library/user-event": "^14.0.0",
    "jest": "^29.0.0",
    "jest-environment-jsdom": "^29.0.0",
    "jsdom": "^22.0.0"
  }
}
```

### Configurazione Jest
```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/test/setupTests.ts'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/test/**',
    '!src/index.tsx'
  ],
  coverageThreshold: {
    global: {
      branches: 75,
      functions: 85,
      lines: 80,
      statements: 80
    }
  },
  coverageReporters: [
    'text',
    'lcov',
    'html'
  ]
}
```

### Setup File
```typescript
// src/test/setupTests.ts
import '@testing-library/jest-dom'

// Mock di localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
global.localStorage = localStorageMock

// Mock di indexedDB
global.indexedDB = {
  open: jest.fn(),
  deleteDatabase: jest.fn(),
}

// Mock di fetch
global.fetch = jest.fn()
```

---

## 🔧 Unit Testing

### Testing Componenti React

#### Pattern Base per Componenti
```typescript
// __tests__/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from '../Button'

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click me</Button>)

    fireEvent.click(screen.getByText('Click me'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('applies correct variant classes', () => {
    render(<Button variant="primary">Primary</Button>)
    const button = screen.getByText('Primary')

    expect(button).toHaveClass('bg-primary')
    expect(button).toHaveClass('text-on-primary')
  })
})
```

#### Testing Componenti con State
```typescript
// __tests__/Counter.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { Counter } from '../Counter'

describe('Counter', () => {
  it('increments count', () => {
    render(<Counter />)

    const incrementButton = screen.getByText('+')
    fireEvent.click(incrementButton)

    expect(screen.getByText('Count: 1')).toBeInTheDocument()
  })

  it('decrements count', () => {
    render(<Counter />)

    const decrementButton = screen.getByText('-')
    fireEvent.click(decrementButton)

    expect(screen.getByText('Count: -1')).toBeInTheDocument()
  })
})
```

### Testing Custom Hooks

#### Hook Testing con react-hooks-testing-library
```typescript
// __tests__/useLocalStorage.test.ts
import { renderHook, act } from '@testing-library/react'
import { useLocalStorage } from '../useLocalStorage'

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('returns initial value', () => {
    const { result } = renderHook(() => useLocalStorage('key', 'initial'))

    expect(result.current[0]).toBe('initial')
  })

  it('persists value to localStorage', () => {
    const { result } = renderHook(() => useLocalStorage('key', 'initial'))

    act(() => {
      result.current[1]('new value')
    })

    expect(localStorage.setItem).toHaveBeenCalledWith('key', '"new value"')
    expect(result.current[0]).toBe('new value')
  })
})
```

### Testing Utilities e Helper Functions

#### Pure Functions Testing
```typescript
// __tests__/utils.test.ts
import { calculateAverage, formatGrade } from '../utils'

describe('calculateAverage', () => {
  it('calculates average correctly', () => {
    expect(calculateAverage([10, 20, 30])).toBe(20)
  })

  it('returns 0 for empty array', () => {
    expect(calculateAverage([])).toBe(0)
  })
})

describe('formatGrade', () => {
  it('formats grade with one decimal', () => {
    expect(formatGrade(8.5)).toBe('8.5')
  })

  it('formats integer grades', () => {
    expect(formatGrade(9)).toBe('9.0')
  })
})
```

---

## 🔗 Integration Testing

### Testing Interazioni tra Componenti

#### Form Testing
```typescript
// __tests__/StudentForm.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { StudentForm } from '../StudentForm'

describe('StudentForm', () => {
  it('submits form with valid data', async () => {
    const handleSubmit = jest.fn()
    const user = userEvent.setup()

    render(<StudentForm onSubmit={handleSubmit} />)

    // Fill form
    await user.type(screen.getByLabelText('Name'), 'John Doe')
    await user.type(screen.getByLabelText('Email'), 'john@example.com')
    await user.click(screen.getByText('Submit'))

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com'
      })
    })
  })

  it('shows validation errors', async () => {
    const user = userEvent.setup()

    render(<StudentForm onSubmit={jest.fn()} />)

    // Try to submit empty form
    await user.click(screen.getByText('Submit'))

    expect(screen.getByText('Name is required')).toBeInTheDocument()
    expect(screen.getByText('Email is required')).toBeInTheDocument()
  })
})
```

### Testing con API Calls

#### Mocking API Calls
```typescript
// __tests__/StudentList.test.tsx
import { render, screen, waitFor } from '@testing-library/react'
import { StudentList } from '../StudentList'

// Mock the API service
jest.mock('../api', () => ({
  getStudents: jest.fn()
}))

const mockGetStudents = require('../api').getStudents

describe('StudentList', () => {
  it('loads and displays students', async () => {
    const mockStudents = [
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' }
    ]

    mockGetStudents.mockResolvedValue(mockStudents)

    render(<StudentList />)

    expect(screen.getByText('Loading...')).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getByText('Alice')).toBeInTheDocument()
      expect(screen.getByText('Bob')).toBeInTheDocument()
    })
  })

  it('shows error message on API failure', async () => {
    mockGetStudents.mockRejectedValue(new Error('API Error'))

    render(<StudentList />)

    await waitFor(() => {
      expect(screen.getByText('Failed to load students')).toBeInTheDocument()
    })
  })
})
```

---

## 🌐 End-to-End Testing

### Setup Playwright
```javascript
// playwright.config.js
import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  use: {
    baseURL: 'http://localhost:3000',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] }
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] }
    }
  ]
})
```

### E2E Test Example
```typescript
// e2e/student-management.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Student Management', () => {
  test('should create a new student', async ({ page }) => {
    // Navigate to app
    await page.goto('/')

    // Click "Add Student" button
    await page.click('text=Add Student')

    // Fill form
    await page.fill('[placeholder="Student name"]', 'John Doe')
    await page.fill('[placeholder="Email"]', 'john@example.com')

    // Submit form
    await page.click('text=Save')

    // Verify student appears in list
    await expect(page.locator('text=John Doe')).toBeVisible()
  })

  test('should edit student information', async ({ page }) => {
    // Setup: Create student first
    await page.goto('/')
    await page.click('text=Add Student')
    await page.fill('[placeholder="Student name"]', 'Jane Smith')
    await page.click('text=Save')

    // Edit student
    await page.click('text=Jane Smith')
    await page.click('text=Edit')
    await page.fill('[placeholder="Student name"]', 'Jane Doe')
    await page.click('text=Save')

    // Verify change
    await expect(page.locator('text=Jane Doe')).toBeVisible()
    await expect(page.locator('text=Jane Smith')).not.toBeVisible()
  })
})
```

---

## 📊 Coverage e Quality Metrics

### Coverage Report Analysis
```bash
# Generate coverage report
npm test -- --coverage

# View HTML report
open coverage/lcov-report/index.html
```

### Quality Gates CI/CD
```yaml
# .github/workflows/test.yml
name: Test
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm test -- --coverage --watchAll=false
      - run: npm run lint
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info
```

### Coverage Badge
```markdown
<!-- README.md -->
[![Coverage Status](https://coveralls.io/repos/github/user/repo/badge.svg)](https://coveralls.io/github/user/repo)
```

---

## 🐛 Test Debugging

### Debugging Test Failures
```typescript
// Use debug mode
test('debug example', () => {
  const element = screen.getByText('Click me')
  screen.debug(element) // Print element to console

  // Or debug entire screen
  screen.debug()
})
```

### Common Testing Issues

#### Async Operations
```typescript
// ❌ Wrong - doesn't wait for async operation
test('async test', () => {
  render(<AsyncComponent />)
  expect(screen.getByText('Loaded')).toBeInTheDocument() // Fails
})

// ✅ Correct - wait for async operation
test('async test', async () => {
  render(<AsyncComponent />)
  await waitFor(() => {
    expect(screen.getByText('Loaded')).toBeInTheDocument()
  })
})
```

#### Mock Cleanup
```typescript
// Clean up mocks between tests
beforeEach(() => {
  jest.clearAllMocks()
})

afterEach(() => {
  jest.resetAllMocks()
})
```

---

## 📈 Testing Best Practices

### Test Organization
- **One concept per test**: Ogni test verifica una sola cosa
- **Descriptive names**: Nomi chiari che spiegano cosa testano
- **Arrange-Act-Assert**: Struttura AAA nei test

### Test Maintenance
- **Refactor tests with code**: Quando refactoring, aggiornare i test
- **Avoid brittle tests**: Test che non si rompono per cambiamenti minori
- **Test behavior, not implementation**: Testare cosa fa il codice, non come

### Performance Testing
- **Fast test suite**: Test che girano velocemente
- **Parallel execution**: Test che possono girare in parallelo
- **Selective testing**: Durante sviluppo, girare solo test rilevanti

---

## 📚 Riferimenti

### Documenti Correlati
- [**DEVELOPMENT.md**](./DEVELOPMENT.md) - Workflow e best practices
- [**ARCHITECTURE.md**](./ARCHITECTURE.md) - Pattern architetturali
- [**DEPLOYMENT.md**](./DEPLOYMENT.md) - Deployment procedures

### Testing Resources
- [Testing Library Documentation](https://testing-library.com/)
- [Jest Documentation](https://jestjs.io/)
- [Playwright Documentation](https://playwright.dev/)

---

*La strategia di testing evolve con il progetto. Nuove pratiche vengono aggiunte man mano che il codebase cresce.*