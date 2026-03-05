---
applyTo: "src/**/*.stories.tsx"
---

# MD3 Storybook Stories — DocenteDoc AI

Ogni file `.stories.tsx` documenta un componente MD3 per Storybook e serve come baseline per i visual regression test.

---

## 1. Struttura obbligatoria

```tsx
// MD3 Compliant
import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { ComponentName } from "./ComponentName";

const meta = {
  title: "M3/Category/ComponentName", // sempre sotto namespace M3/
  component: ComponentName,
  tags: ["autodocs"],
  parameters: {
    layout: "centered", // 'centered' | 'fullscreen' | 'padded'
    docs: {
      description: {
        component: "Describe what this MD3 component does and when to use it.",
      },
    },
  },
  argTypes: {
    // Documentare ogni prop con control, description e table
  },
} satisfies Meta<typeof ComponentName>;

export default meta;
type Story = StoryObj<typeof meta>;
```

---

## 2. Naming delle storie

- **Prima storia** = `Default` — stato base del componente, props minime.
- Le altre storie mostrano varianti o stati specifici con nomi descrittivi in `PascalCase`:
  - `Filled`, `Outlined`, `Disabled`, `Loading`, `WithIcon`, `WithError`, ecc.
- Ogni storia deve avere un commento JSDoc che descrive il caso d'uso.

```tsx
/**
 * Variante primaria per azioni principali dell'interfaccia.
 */
export const Filled: Story = {
  args: {
    variant: "filled",
    children: "Azione primaria",
  },
};
```

---

## 3. Namespace `title`

| Area               | Prefisso                                |
| ------------------ | --------------------------------------- |
| Componenti UI base | `UI/ComponentName` o `M3/ComponentName` |
| Pattern composti   | `M3/Patterns/PatternName`               |
| Schermate / view   | `Screens/ScreenName`                    |

---

## 4. ArgTypes — obbligatori per ogni prop pubblica

```tsx
argTypes: {
  variant: {
    control: 'select',
    options: ['filled', 'outlined', 'text'],
    description: 'Variante visiva del componente',
    table: {
      type: { summary: 'filled | outlined | text' },
      defaultValue: { summary: 'filled' },
    },
  },
  disabled: {
    control: 'boolean',
    description: 'Disabilita il componente',
  },
},
```

---

## 5. Storie di stato obbligatorie (per componenti interattivi)

Ogni componente interattivo deve includere:

- `Default` — stato base
- `Disabled` — stato disabilitato
- (se applicabile) `WithError`, `Loading`, `Empty`

---

## 6. Storie inline: no hardcoded values

Anche dentro gli `args` e i JSX interni delle storie, rispettare i token MD3:

```tsx
// ✅ Corretto
export const WithContent: Story = {
  args: {
    children: (
      <div style={{ marginBottom: "var(--md-sys-spacing-2)" }}>Contenuto</div>
    ),
  },
};

// ❌ Vietato
export const WithContent: Story = {
  args: {
    children: <div style={{ marginBottom: "8px" }}>Contenuto</div>,
  },
};
```

---

## 7. Companion snapshot test

Ogni `ComponentName.stories.tsx` deve avere un `ComponentName.stories.test.tsx` con snapshot della storia `Default`:

```tsx
import { renderWithM3Theme } from "./test-utils";
import React from "react";
import ComponentName from "./ComponentName";

describe("ComponentName Story Snapshots", () => {
  it("renders default story correctly", () => {
    const { container } = renderWithM3Theme(<ComponentName />);
    expect(container).toMatchSnapshot();
  });
});
```

---

## 8. Il file deve iniziare con

```tsx
// MD3 Compliant
```
