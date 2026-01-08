
# DocenteDoc AI - Architettura Sistema

> **Documento Architetturale** - Design patterns, decisioni tecniche e struttura del sistema

## 📋 Panoramica

Questo documento descrive l'architettura del sistema **DocenteDoc AI**, fornendo una visione completa dei componenti, pattern utilizzati e decisioni tecniche che guidano lo sviluppo.

### 🏛️ Principi Architetturali

- **Component-Driven Development**: Tutto costruito attorno a componenti riutilizzabili
- **Local-First Architecture**: Dati prioritariamente locali con backup cloud opzionale
- **Progressive Enhancement**: Funzionalità core funzionanti senza JavaScript avanzato
- **Performance-First**: Ottimizzazioni per caricamento rapido e responsività

---

## 🏗️ Architettura Generale

### Stack Tecnologico

```
Frontend: React 18 + TypeScript + Vite
Styling: Material Design 3 + Tailwind CSS (Layout-only)
State: Zustand (Lightweight, TypeScript-first)
Storage: LocalStorage + IndexedDB (Local-first)
Build: Vite (Fast HMR, optimized builds)
Deployment: Vercel (CDN, Edge functions)
```

### Pattern Architetturali

#### 1. Component Architecture
```
Atomic Design Pattern:
├── Atoms (Button, Input, Icon)
├── Molecules (Form Field, Card)
├── Organisms (Header, Sidebar, Modal)
└── Templates (Page layouts)
```

#### 2. State Management
```typescript
// Store pattern con Zustand
interface AppState {
  user: User | null
  classes: Class[]
  students: Student[]
  // Actions
  setUser: (user: User) => void
  addClass: (classData: Class) => void
}
```

#### 3. Data Flow
```
User Action → Component → Store Action → State Update → Re-render
                                      ↓
                               LocalStorage Sync
                                      ↓
                             IndexedDB Backup
```

---

## 🔧 Componenti Core

### UI Components System

#### Design Tokens Architecture
```css
/* MD3 Design Tokens */
:root {
  /* Color System */
  --md-sys-color-primary: #6750a4;
  --md-sys-color-on-primary: #ffffff;

  /* Typography Scale */
  --md-sys-typescale-display-large: 3.5rem;
  --md-sys-typescale-body-large: 1rem;

  /* Shape System */
  --md-sys-shape-corner-extra-small: 4px;
  --md-sys-shape-corner-small: 8px;
}
```

#### Component Composition
```typescript
// Esempio Button component
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
  onClick?: () => void
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  onClick
}) => {
  const baseClasses = 'rounded-md font-medium transition-colors'
  const variantClasses = {
    primary: 'bg-primary text-on-primary hover:bg-primary-hover',
    secondary: 'bg-secondary text-on-secondary',
    outline: 'border border-outline text-on-surface'
  }
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  }

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]}`}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
```

### State Management Layer

#### Store Structure
```typescript
// stores/appStore.ts
interface AppStore {
  // State
  isLoading: boolean
  error: string | null
  theme: 'light' | 'dark' | 'auto'

  // Actions
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setTheme: (theme: Theme) => void
}

export const useAppStore = create<AppStore>((set) => ({
  isLoading: false,
  error: null,
  theme: 'auto',

  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  setTheme: (theme) => set({ theme })
}))
```

#### Data Persistence
```typescript
// hooks/useLocalStorage.ts
function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      return initialValue
    }
  })

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      console.error('Error saving to localStorage:', error)
    }
  }

  return [storedValue, setValue] as const
}
```

---

## 📊 Data Architecture

### Storage Strategy

#### Local-First Approach
```
Priority: LocalStorage → IndexedDB → Cloud Backup
- Small data (< 5MB): LocalStorage
- Large data (> 5MB): IndexedDB
- Backup: Google Drive (OAuth 2.0)
```

#### Data Models
```typescript
// Core data types
interface User {
  id: string
  name: string
  school: string
  preferences: UserPreferences
}

interface Class {
  id: string
  name: string
  subject: string
  students: Student[]
  schedule: Schedule[]
}

interface Student {
  id: string
  name: string
  email?: string
  grades: Grade[]
  competencies: Competency[]
}
```

### API Architecture

#### Service Layer Pattern
```typescript
// services/api.ts
class ApiService {
  private baseURL: string

  constructor(baseURL: string) {
    this.baseURL = baseURL
  }

  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return response.json()
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    return response.json()
  }
}
```

---

## 🚀 Performance Architecture

### Bundle Optimization

#### Code Splitting Strategy
```typescript
// Lazy loading per route
const Home = lazy(() => import('./pages/Home'))
const Classes = lazy(() => import('./pages/Classes'))
const Students = lazy(() => import('./pages/Students'))

// Component lazy loading
const HeavyComponent = lazy(() => import('./components/HeavyComponent'))
```

#### Bundle Analysis
```javascript
// vite.config.js
import { defineConfig } from 'vite'
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [
    visualizer({
      filename: 'dist/bundle-analysis.html',
      open: true,
      gzipSize: true,
      brotliSize: true,
    }),
  ],
})
```

### Caching Strategy

#### Service Worker
```typescript
// public/sw.js
const CACHE_NAME = 'docentedoc-v1'
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json'
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  )
})

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response
        }
        return fetch(event.request)
      })
  )
})
```

---

## 🔒 Security Architecture

### Authentication & Authorization
- **OAuth 2.0**: Google Drive integration
- **Token-based**: JWT per sessioni API
- **Local-only**: No server-side auth required

### Data Protection
- **Encryption**: Dati sensibili criptati localmente
- **No External APIs**: Tutto processato client-side
- **Privacy-First**: Zero tracking, zero analytics esterni

### Content Security Policy
```html
<!-- index.html -->
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  connect-src 'self' https://*.googleapis.com;
">
```

---

## 🧪 Testing Architecture

### Testing Pyramid
```
Unit Tests (80%): Componenti isolati
Integration Tests (15%): Interazioni componenti
E2E Tests (5%): Flussi utente completi
```

### Test Structure
```typescript
// __tests__/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from '../Button'

describe('Button', () => {
  it('renders with text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    fireEvent.click(screen.getByText('Click me'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
```

---

## 📈 Monitoring & Analytics

### Performance Monitoring
- **Core Web Vitals**: Tracciamento Lighthouse
- **Bundle Size**: Monitoraggio automated
- **Memory Usage**: Leak detection
- **Runtime Performance**: React DevTools

### Error Tracking
```typescript
// utils/errorBoundary.tsx
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    // Log to external service or local storage
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback />
    }
    return this.props.children
  }
}
```

---

## 🔄 Evoluzione Architetturale

### Migration Strategy
- **Incremental Adoption**: Nuove feature seguono nuovi pattern
- **Backward Compatibility**: Legacy code supportato durante transizione
- **Refactoring Windows**: Dedicati periodi per pulizia architetturale

### Technical Debt Management
- **Debt Tracking**: Documentato in issue dedicate
- **Regular Cleanup**: Sessioni settimanali di refactoring
- **Code Quality Gates**: PR bloccate se debt aumenta significativamente

---

## 📚 Riferimenti

### Documenti Correlati
- [**DEVELOPMENT.md**](./DEVELOPMENT.md) - Workflow operativo
- [**TESTING.md**](./TESTING.md) - Strategia testing
- [**DEPLOYMENT.md**](./DEPLOYMENT.md) - Deployment procedures

### Risorse Esterne
- [Material Design 3 Guidelines](https://material.io/design)
- [React Best Practices](https://react.dev/learn)
- [Web Performance](https://web.dev/performance)

---

*Questa architettura evolve con il progetto. Modifiche significative richiedono review architetturale e documentazione aggiornata.*