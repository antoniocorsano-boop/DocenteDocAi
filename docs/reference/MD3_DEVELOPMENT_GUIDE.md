# Guida Sviluppo MD3 - DocenteDoc AI

## 🎨 Material Design 3 Implementation Guide

Questa guida fornisce le best practices per sviluppare componenti conformi a Material Design 3 nel progetto DocenteDoc AI.

### 📋 Indice
- [Principi Fondamentali](#principi-fondamentali)
- [Design Tokens](#design-tokens)
- [Componenti Base](#componenti-base)
- [Pattern Comuni](#pattern-comuni)
- [Testing e QA](#testing-e-qa)
- [CI/CD Integration](#cicd-integration)

---

## 🏗️ Principi Fondamentali

### 1. Design Tokens First
**Sempre** utilizzare i design tokens MD3 invece di valori hardcoded:

```typescript
// ✅ CORRETTO - Usa design tokens
const styles = {
  backgroundColor: 'var(--md-sys-color-primary-container)',
  padding: 'var(--md-sys-spacing-4)',
  borderRadius: 'var(--md-sys-shape-corner-large)',
  boxShadow: 'var(--md-sys-elevation-level1)'
};

// ❌ SBAGLIATO - Valori hardcoded
const styles = {
  backgroundColor: '#6750A4',
  padding: '16px',
  borderRadius: '16px',
  boxShadow: '0 1px 3px rgba(0,0,0,0.12)'
};
```

### 2. Typography con M3Typography
Utilizzare sempre il componente `M3Typography` per il testo:

```typescript
// ✅ CORRETTO
import M3Typography from './ui/M3Typography';

<M3Typography variant="title-large" style={{ color: 'var(--md-sys-color-on-surface)' }}>
  Titolo Componente
</M3Typography>

// ❌ SBAGLIATO
<h1 style={{ color: '#1C1B1F', fontSize: '57px', fontWeight: 400 }}>
  Titolo Componente
</h1>
```

### 3. Variants per Componenti
Implementare variants usando i ruoli colore MD3:

```typescript
interface ComponentProps {
  variant?: 'primary' | 'secondary' | 'surface';
}

const getVariantColors = (variant: string) => {
  switch (variant) {
    case 'primary':
      return {
        background: 'var(--md-sys-color-primary-container)',
        onBackground: 'var(--md-sys-color-on-primary-container)'
      };
    case 'secondary':
      return {
        background: 'var(--md-sys-color-secondary-container)',
        onBackground: 'var(--md-sys-color-on-secondary-container)'
      };
    default:
      return {
        background: 'var(--md-sys-color-surface-container)',
        onBackground: 'var(--md-sys-color-on-surface)'
      };
  }
};
```

---

## 🎨 Design Tokens

### Colori
```css
/* Primary */
--md-sys-color-primary
--md-sys-color-primary-container
--md-sys-color-on-primary
--md-sys-color-on-primary-container

/* Secondary */
--md-sys-color-secondary
--md-sys-color-secondary-container
--md-sys-color-on-secondary
--md-sys-color-on-secondary-container

/* Surface */
--md-sys-color-surface
--md-sys-color-surface-container
--md-sys-color-on-surface
--md-sys-color-on-surface-variant

/* Outline */
--md-sys-color-outline
--md-sys-color-outline-variant
```

### Spacing
```css
--md-sys-spacing-1   /* 4px  */
--md-sys-spacing-2   /* 8px  */
--md-sys-spacing-3   /* 12px */
--md-sys-spacing-4   /* 16px */
--md-sys-spacing-5   /* 20px */
--md-sys-spacing-6   /* 24px */
--md-sys-spacing-8   /* 32px */
--md-sys-spacing-10  /* 40px */
--md-sys-spacing-12  /* 48px */
```

### Shape
```css
--md-sys-shape-corner-none
--md-sys-shape-corner-extra-small    /* 4px  */
--md-sys-shape-corner-small          /* 8px  */
--md-sys-shape-corner-medium         /* 12px */
--md-sys-shape-corner-large          /* 16px */
--md-sys-shape-corner-extra-large    /* 28px */
--md-sys-shape-corner-full           /* 1000px */
```

### Elevation
```css
--md-sys-elevation-level0
--md-sys-elevation-level1
--md-sys-elevation-level2
--md-sys-elevation-level3
--md-sys-elevation-level4
--md-sys-elevation-level5
```

---

## 🧩 Componenti Base

### M3Typography
Componente per tutta la tipografia:

```typescript
<M3Typography variant="display-large">Display Large</M3Typography>
<M3Typography variant="headline-medium">Headline Medium</M3Typography>
<M3Typography variant="title-large">Title Large</M3Typography>
<M3Typography variant="body-medium">Body Medium</M3Typography>
<M3Typography variant="label-small">Label Small</M3Typography>
```

### M3Button
Bottoni conformi MD3:

```typescript
<M3Button variant="filled" onClick={handleClick}>
  Azione Primaria
</M3Button>

<M3Button variant="outlined" onClick={handleClick}>
  Azione Secondaria
</M3Button>
```

### M3Card Variants
Carte per diversi usi:

```typescript
<M3ExpressiveCard
  icon="school"
  title="Titolo Card"
  description="Descrizione"
  color="primary"
>
  Contenuto della card
</M3ExpressiveCard>
```

---

## 🔄 Pattern Comuni

### Interactive States
Implementare sempre hover, focus e active states:

```typescript
const handleMouseEnter = (e: React.MouseEvent) => {
  e.currentTarget.style.boxShadow = 'var(--md-sys-elevation-level2)';
  e.currentTarget.style.transform = 'translateY(-2px)';
};

const handleMouseLeave = (e: React.MouseEvent) => {
  e.currentTarget.style.boxShadow = 'var(--md-sys-elevation-level1)';
  e.currentTarget.style.transform = 'translateY(0)';
};

const handleFocus = (e: React.FocusEvent) => {
  e.currentTarget.style.outline = `2px solid var(--md-sys-color-primary)`;
  e.currentTarget.style.outlineOffset = '2px';
};

return (
  <div
    onMouseEnter={handleMouseEnter}
    onMouseLeave={handleMouseLeave}
    onFocus={handleFocus}
    onBlur={(e) => e.currentTarget.style.outline = 'none'}
    // ... altri props
  >
    Contenuto
  </div>
);
```

### Responsive Design
Usare spacing tokens per responsività:

```typescript
style={{
  padding: 'var(--md-sys-spacing-4)',
  gap: 'var(--md-sys-spacing-3)',

  // Media queries con custom properties
  '@media (min-width: 768px)': {
    padding: 'var(--md-sys-spacing-6)',
    gap: 'var(--md-sys-spacing-4)'
  }
}}
```

### Accessibility
Sempre includere attributi di accessibilità:

```typescript
<button
  onClick={handleClick}
  aria-label={ariaLabel || `${title}${subtitle ? ` - ${subtitle}` : ''}`}
  type="button"
>
  Contenuto
</button>
```

---

## 🧪 Testing e QA

### Unit Tests
```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ActionTile from './ActionTile';

describe('ActionTile', () => {
  it('renders with correct title', () => {
    render(<ActionTile title="Test Title" icon="star" onClick={() => {}} />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const mockClick = jest.fn();
    const user = userEvent.setup();

    render(<ActionTile title="Test" icon="star" onClick={mockClick} />);
    await user.click(screen.getByRole('button'));

    expect(mockClick).toHaveBeenCalledTimes(1);
  });
});
```

### Visual Regression Tests
```typescript
// __tests__/visual-regression/component.spec.ts
import { test, expect } from '@playwright/test';

test('component visual regression', async ({ page }) => {
  await page.goto('/component-story');
  await expect(page).toHaveScreenshot('component.png');
});
```

### MD3 Compliance Audit
```bash
# Controllo compliance completo
npm run md3:audit

# Controllo CI/CD (soglia 70%)
npm run md3:check
```

---

## 🔄 CI/CD Integration

### GitHub Actions
Le PR vengono automaticamente controllate per compliance MD3:

```yaml
# .github/workflows/md3-audit.yml
- name: Run MD3 Compliance Audit
  run: node md3-audit.js check ./src/components 70
```

### Pre-commit Hooks
Controllo automatico prima di ogni commit:

```bash
# .husky/pre-commit
npx lint-staged
node md3-audit.js check ./src/components 70
```

### Scripts Disponibili
```json
{
  "md3:audit": "Genera report completo compliance MD3",
  "md3:check": "Controllo compliance per CI/CD",
  "test:visual": "Test di regressione visiva",
  "test:visual:update": "Aggiorna snapshot visuali"
}
```

---

## 📚 Risorse Aggiuntive

- [Material Design 3 Guidelines](https://m3.material.io)
- [Component Templates](./templates/)
- [Audit Reports](./audit/)
- [Storybook](http://localhost:6006)
- [Visual Regression Tests](./__tests__/visual-regression/)

## 🤝 Contributi

1. **Prima di sviluppare**: Consulta questa guida
2. **Durante lo sviluppo**: Usa i template forniti
3. **Prima del commit**: Verifica compliance MD3
4. **Dopo il merge**: Controlla report visual regression

### Checklist Pre-Commit
- [ ] Componente usa design tokens MD3
- [ ] Test unitari passati
- [ ] Audit MD3 superato (70%+)
- [ ] Stories Storybook aggiornate
- [ ] Documentazione aggiornata

---

*Questa guida è in evoluzione. Contributi e suggerimenti sono benvenuti!* 🚀