# DocenteDoc AI - Guida Material Design 3

> **Guida Design System** - Implementazione MD3, design tokens e best practices

## 📋 Panoramica

Questa guida documenta l'implementazione di **Material Design 3 (MD3)** in **DocenteDoc AI**, fornendo linee guida complete per design consistente, accessibilità e user experience eccellente.

### 🎯 Principi MD3

- **Custom-First**: Implementare componenti custom prima di usare librerie
- **Token-Only**: Usare esclusivamente design tokens, no CSS arbitrario
- **Tailwind Layout-Only**: Tailwind solo per layout, MD3 per componenti
- **Accessibility-First**: Design accessibile per tutti gli utenti

---

## 🎨 Design Tokens Architecture

### Color System MD3

#### Primary Colors
```css
/* Design Tokens - Primary */
:root {
  /* Primary */
  --md-sys-color-primary: #6750a4;
  --md-sys-color-on-primary: #ffffff;
  --md-sys-color-primary-container: #eaddff;
  --md-sys-color-on-primary-container: #21005d;

  /* Primary Variants */
  --md-sys-color-primary-hover: #7b58c7;
  --md-sys-color-primary-active: #8b66d1;
  --md-sys-color-primary-disabled: #cac4d0;
}
```

#### Secondary Colors
```css
/* Design Tokens - Secondary */
:root {
  --md-sys-color-secondary: #625b71;
  --md-sys-color-on-secondary: #ffffff;
  --md-sys-color-secondary-container: #e8def8;
  --md-sys-color-on-secondary-container: #1d192b;
}
```

#### Semantic Colors
```css
/* Design Tokens - Semantic */
:root {
  /* Success */
  --md-sys-color-success: #146c2e;
  --md-sys-color-on-success: #ffffff;
  --md-sys-color-success-container: #a6f5b8;
  --md-sys-color-on-success-container: #002108;

  /* Error */
  --md-sys-color-error: #ba1a1a;
  --md-sys-color-on-error: #ffffff;
  --md-sys-color-error-container: #ffdad6;
  --md-sys-color-on-error-container: #410002;

  /* Warning */
  --md-sys-color-warning: #7d5800;
  --md-sys-color-on-warning: #ffffff;
  --md-sys-color-warning-container: #ffdf9e;
  --md-sys-color-on-warning-container: #271900;
}
```

### Typography Scale
```css
/* Design Tokens - Typography */
:root {
  /* Display */
  --md-sys-typescale-display-large: 3.5rem;      /* 57px */
  --md-sys-typescale-display-medium: 2.8125rem;  /* 45px */
  --md-sys-typescale-display-small: 2rem;        /* 36px */

  /* Headline */
  --md-sys-typescale-headline-large: 2rem;       /* 32px */
  --md-sys-typescale-headline-medium: 1.75rem;   /* 28px */
  --md-sys-typescale-headline-small: 1.5rem;     /* 24px */

  /* Title */
  --md-sys-typescale-title-large: 1.375rem;      /* 22px */
  --md-sys-typescale-title-medium: 1rem;         /* 16px */
  --md-sys-typescale-title-small: 0.875rem;      /* 14px */

  /* Body */
  --md-sys-typescale-body-large: 1rem;           /* 16px */
  --md-sys-typescale-body-medium: 0.875rem;      /* 14px */
  --md-sys-typescale-body-small: 0.75rem;        /* 12px */

  /* Label */
  --md-sys-typescale-label-large: 0.875rem;      /* 14px */
  --md-sys-typescale-label-medium: 0.75rem;      /* 12px */
  --md-sys-typescale-label-small: 0.6875rem;     /* 11px */
}
```

### Shape System
```css
/* Design Tokens - Shape */
:root {
  /* Corner */
  --md-sys-shape-corner-extra-small: 4px;
  --md-sys-shape-corner-small: 8px;
  --md-sys-shape-corner-medium: 12px;
  --md-sys-shape-corner-large: 16px;
  --md-sys-shape-corner-extra-large: 28px;
  --md-sys-shape-corner-full: 1000px; /* Fully rounded */

  /* Border Width */
  --md-sys-shape-border-width-thin: 1px;
  --md-sys-shape-border-width-thick: 2px;
}
```

---

## 🧩 Componenti MD3

### Button Component

#### Variants
```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'text'
  size?: 'small' | 'medium' | 'large'
  disabled?: boolean
  loading?: boolean
  children: React.ReactNode
  onClick?: () => void
}
```

#### Implementation
```typescript
// components/ui/Button.tsx
import React from 'react'
import { cn } from '../../utils/cn'

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'medium', disabled, loading, children, onClick, className, ...props }, ref) => {
    const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none'

    const variantClasses = {
      primary: 'bg-primary text-on-primary hover:bg-primary-hover focus:ring-primary',
      secondary: 'bg-secondary text-on-secondary hover:bg-secondary-hover focus:ring-secondary',
      outline: 'border border-outline bg-transparent text-on-surface hover:bg-surface-variant focus:ring-primary',
      text: 'bg-transparent text-primary hover:bg-primary-container focus:ring-primary'
    }

    const sizeClasses = {
      small: 'h-8 px-3 text-sm',
      medium: 'h-10 px-4 text-base',
      large: 'h-12 px-6 text-lg'
    }

    return (
      <button
        ref={ref}
        className={cn(baseClasses, variantClasses[variant], sizeClasses[size], className)}
        disabled={disabled || loading}
        onClick={onClick}
        {...props}
      >
        {loading && <Spinner className="mr-2 h-4 w-4" />}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
```

### Card Component

#### Variants
```typescript
interface CardProps {
  variant?: 'elevated' | 'filled' | 'outlined'
  padding?: 'none' | 'small' | 'medium' | 'large'
  children: React.ReactNode
  className?: string
}
```

#### Implementation
```typescript
// components/ui/Card.tsx
import React from 'react'
import { cn } from '../../utils/cn'

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'elevated', padding = 'medium', children, className, ...props }, ref) => {
    const baseClasses = 'rounded-large bg-surface text-on-surface shadow-sm'

    const variantClasses = {
      elevated: 'shadow-elevation-1 hover:shadow-elevation-2',
      filled: 'bg-surface-variant',
      outlined: 'border border-outline'
    }

    const paddingClasses = {
      none: 'p-0',
      small: 'p-3',
      medium: 'p-4',
      large: 'p-6'
    }

    return (
      <div
        ref={ref}
        className={cn(baseClasses, variantClasses[variant], paddingClasses[padding], className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'
```

### Input Field Component

#### Implementation
```typescript
// components/ui/Input.tsx
import React from 'react'
import { cn } from '../../utils/cn'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  startAdornment?: React.ReactNode
  endAdornment?: React.ReactNode
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, startAdornment, endAdornment, className, ...props }, ref) => {
    const hasError = Boolean(error)

    return (
      <div className="space-y-1">
        {label && (
          <label className="text-sm font-medium text-on-surface">
            {label}
          </label>
        )}

        <div className="relative">
          {startAdornment && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">
              {startAdornment}
            </div>
          )}

          <input
            ref={ref}
            className={cn(
              'w-full rounded-small border border-outline bg-surface px-3 py-2 text-on-surface placeholder:text-on-surface-variant focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary',
              hasError && 'border-error focus:border-error focus:ring-error',
              startAdornment && 'pl-10',
              endAdornment && 'pr-10',
              className
            )}
            {...props}
          />

          {endAdornment && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant">
              {endAdornment}
            </div>
          )}
        </div>

        {(error || helperText) && (
          <p className={cn('text-sm', hasError ? 'text-error' : 'text-on-surface-variant')}>
            {error || helperText}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
```

---

## 🎭 Theme System

### Dynamic Theme Generation

#### Theme Context
```typescript
// contexts/ThemeContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark' | 'auto'

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  resolvedTheme: 'light' | 'dark'
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('auto')
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    const updateResolvedTheme = () => {
      if (theme === 'auto') {
        setResolvedTheme(mediaQuery.matches ? 'dark' : 'light')
      } else {
        setResolvedTheme(theme)
      }
    }

    updateResolvedTheme()
    mediaQuery.addEventListener('change', updateResolvedTheme)

    return () => mediaQuery.removeEventListener('change', updateResolvedTheme)
  }, [theme])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', resolvedTheme)
  }, [resolvedTheme])

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
```

#### Theme Tokens Application
```css
/* Light Theme */
[data-theme="light"] {
  --md-sys-color-surface: #fef7ff;
  --md-sys-color-on-surface: #1d1b20;
  --md-sys-color-surface-variant: #e7e0ec;
  --md-sys-color-on-surface-variant: #49454f;
}

/* Dark Theme */
[data-theme="dark"] {
  --md-sys-color-surface: #141218;
  --md-sys-color-on-surface: #e6e1e5;
  --md-sys-color-surface-variant: #49454f;
  --md-sys-color-on-surface-variant: #cac4d0;
}
```

---

## ♿ Accessibility (A11y)

### Color Contrast Requirements
- **Normal Text**: Contrasto minimo 4.5:1
- **Large Text**: Contrasto minimo 3:1
- **Interactive Elements**: Contrasto minimo 3:1

### Focus Management
```typescript
// hooks/useFocusTrap.ts
import { useEffect, useRef } from 'react'

export const useFocusTrap = (isActive: boolean) => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isActive || !containerRef.current) return

    const container = containerRef.current
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    const firstElement = focusableElements[0] as HTMLElement
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus()
          e.preventDefault()
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus()
          e.preventDefault()
        }
      }
    }

    container.addEventListener('keydown', handleTabKey)
    firstElement?.focus()

    return () => container.removeEventListener('keydown', handleTabKey)
  }, [isActive])

  return containerRef
}
```

### Screen Reader Support
```typescript
// components/ui/ScreenReaderOnly.tsx
import React from 'react'
import { cn } from '../../utils/cn'

interface ScreenReaderOnlyProps {
  children: React.ReactNode
  className?: string
}

export const ScreenReaderOnly: React.FC<ScreenReaderOnlyProps> = ({
  children,
  className
}) => {
  return (
    <span
      className={cn(
        'absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0',
        className
      )}
      style={{ clip: 'rect(0, 0, 0, 0)' }}
    >
      {children}
    </span>
  )
}
```

---

## 📱 Responsive Design

### Breakpoint System
```css
/* Design Tokens - Breakpoints */
:root {
  --md-sys-breakpoint-xs: 0px;
  --md-sys-breakpoint-sm: 600px;
  --md-sys-breakpoint-md: 904px;
  --md-sys-breakpoint-lg: 1240px;
  --md-sys-breakpoint-xl: 1440px;
}
```

### Responsive Utilities
```typescript
// utils/responsive.ts
export const breakpoints = {
  xs: 0,
  sm: 600,
  md: 904,
  lg: 1240,
  xl: 1440,
} as const

export type Breakpoint = keyof typeof breakpoints

export const mediaQuery = (breakpoint: Breakpoint, direction: 'up' | 'down' = 'up') => {
  const value = breakpoints[breakpoint]
  if (direction === 'up') {
    return `@media (min-width: ${value}px)`
  }
  return `@media (max-width: ${value - 1}px)`
}
```

### Responsive Components
```typescript
// components/ui/Hidden.tsx
import React from 'react'
import { cn } from '../../utils/cn'

interface HiddenProps {
  children: React.ReactNode
  breakpoint: Breakpoint
  direction?: 'up' | 'down'
  className?: string
}

export const Hidden: React.FC<HiddenProps> = ({
  children,
  breakpoint,
  direction = 'down',
  className
}) => {
  const mediaQuery = direction === 'up'
    ? `(min-width: ${breakpoints[breakpoint]}px)`
    : `(max-width: ${breakpoints[breakpoint] - 1}px)`

  return (
    <div
      className={cn(className)}
      style={{
        display: 'block',
        [`@media ${mediaQuery}`]: {
          display: 'none'
        }
      }}
    >
      {children}
    </div>
  )
}
```

---

## 🎨 Design Patterns

### Layout Patterns

#### Container-Query Based Layout
```typescript
// components/layout/Container.tsx
import React from 'react'
import { cn } from '../../utils/cn'

interface ContainerProps {
  children: React.ReactNode
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  padding?: 'none' | 'small' | 'medium' | 'large'
  className?: string
}

const maxWidthClasses = {
  sm: 'max-w-2xl',
  md: 'max-w-4xl',
  lg: 'max-w-6xl',
  xl: 'max-w-7xl',
  full: 'max-w-full'
}

const paddingClasses = {
  none: 'px-0',
  small: 'px-4',
  medium: 'px-6',
  large: 'px-8'
}

export const Container: React.FC<ContainerProps> = ({
  children,
  maxWidth = 'lg',
  padding = 'medium',
  className
}) => {
  return (
    <div
      className={cn(
        'mx-auto w-full',
        maxWidthClasses[maxWidth],
        paddingClasses[padding],
        className
      )}
    >
      {children}
    </div>
  )
}
```

#### Grid System
```typescript
// components/layout/Grid.tsx
import React from 'react'
import { cn } from '../../utils/cn'

interface GridProps {
  children: React.ReactNode
  columns?: 1 | 2 | 3 | 4 | 6 | 12
  gap?: 'small' | 'medium' | 'large'
  className?: string
}

const columnsClasses = {
  1: 'grid-cols-1',
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
  6: 'grid-cols-6',
  12: 'grid-cols-12'
}

const gapClasses = {
  small: 'gap-2',
  medium: 'gap-4',
  large: 'gap-6'
}

export const Grid: React.FC<GridProps> = ({
  children,
  columns = 1,
  gap = 'medium',
  className
}) => {
  return (
    <div
      className={cn(
        'grid',
        columnsClasses[columns],
        gapClasses[gap],
        className
      )}
    >
      {children}
    </div>
  )
}
```

---

## 🧪 Testing Design System

### Visual Regression Testing
```typescript
// e2e/visual-regression.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Visual Regression', () => {
  test('Button variants match design', async ({ page }) => {
    await page.goto('/design-system')

    await expect(page.locator('[data-testid="button-primary"]')).toHaveScreenshot('button-primary.png')
    await expect(page.locator('[data-testid="button-secondary"]')).toHaveScreenshot('button-secondary.png')
  })

  test('Card components match design', async ({ page }) => {
    await page.goto('/design-system')

    await expect(page.locator('[data-testid="card-elevated"]')).toHaveScreenshot('card-elevated.png')
    await expect(page.locator('[data-testid="card-outlined"]')).toHaveScreenshot('card-outlined.png')
  })
})
```

### Accessibility Testing
```typescript
// __tests__/accessibility.test.tsx
import { render } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'

expect.extend(toHaveNoViolations)

test('Button is accessible', async () => {
  const { container } = render(<Button>Click me</Button>)
  const results = await axe(container)
  expect(results).toHaveNoViolations()
})
```

---

## 📚 Riferimenti

### Documenti Correlati
- [**DEVELOPMENT.md**](./DEVELOPMENT.md) - Workflow e best practices
- [**ARCHITECTURE.md**](./ARCHITECTURE.md) - Architettura componenti
- [**TESTING.md**](./TESTING.md) - Testing design system

### MD3 Resources
- [Material Design 3 Guidelines](https://material.io/design)
- [MD3 Color Tool](https://material.io/design/color)
- [MD3 Typography](https://material.io/design/typography)

---

*Il design system MD3 evolve con il progetto. Modifiche ai token richiedono review di design e testing completo.*