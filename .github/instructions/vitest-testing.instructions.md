---
applyTo: "src/**/*.test.tsx,src/**/*.test.ts,src/**/__tests__/**"
---

# Vitest + Testing Library — DocenteDoc AI

Ogni test in questo progetto usa **Vitest** con **@testing-library/react** e il wrapper `M3ThemeProvider`.

---

## 1. Setup obbligatorio

### Importazioni standard

```tsx
// MD3 Compliant
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MyComponent } from "../MyComponent";
```

> `render` è automaticamente wrappato con `M3ThemeProvider` tramite `vitest.setup.tsx`.  
> Per render esplicito con tema, importare `renderWithM3Theme` da `./test-utils` o `../test-utils`.

### Render con tema esplicito

```tsx
import { renderWithM3Theme } from "./test-utils"; // o '../test-utils'

renderWithM3Theme(<MyComponent {...props} />);
```

---

## 2. Struttura del file di test

```tsx
// MD3 Compliant
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ComponentName } from "./ComponentName";

// Props base condivise tra i test (evita duplicazioni)
const baseProps = {
  // props obbligatorie del componente
};

describe("ComponentName", () => {
  it("renders correctly", () => {
    render(<ComponentName {...baseProps} />);
    expect(screen.getByText("...")).toBeInTheDocument();
  });

  it("handles user interaction", () => {
    const onAction = vi.fn();
    render(<ComponentName {...baseProps} onAction={onAction} />);
    fireEvent.click(screen.getByLabelText("..."));
    expect(onAction).toHaveBeenCalled();
  });
});
```

---

## 3. Regole di query — priorità obbligatoria

Usare le query nell'ordine di priorità definito da Testing Library:

| Priorità | Query                  | Quando usarla                              |
| -------- | ---------------------- | ------------------------------------------ |
| 1°       | `getByRole`            | Elementi con ruolo ARIA semantico          |
| 2°       | `getByLabelText`       | Form input con label                       |
| 3°       | `getByText`            | Testo visibile all'utente                  |
| 4°       | `getByPlaceholderText` | Solo se non c'è label                      |
| Ultimo   | `getByTestId`          | Solo se non ci sono alternative semantiche |

```tsx
// ✅ Preferire
screen.getByRole("button", { name: /salva/i });
screen.getByLabelText("Nome studente");

// ❌ Evitare
screen.getByTestId("save-button");
```

---

## 4. Mock di funzioni

```tsx
// ✅ Corretto — vi.fn() per callback props
const onBack = vi.fn();
render(<Header {...baseProps} onBack={onBack} />);
fireEvent.click(screen.getByLabelText("Indietro"));
expect(onBack).toHaveBeenCalled();

// ✅ Mock di moduli
vi.mock("../services/ai", () => ({
  analyzeDocument: vi.fn().mockResolvedValue({ result: "ok" }),
}));
```

---

## 5. Snapshot test (`.stories.test.tsx`)

I file `*.stories.test.tsx` usano **esclusivamente snapshot**. Non aggiungere logica comportamentale in questi file.

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

> Aggiornare gli snapshot con `vitest --update-snapshots` solo dopo verifica visiva.

---

## 6. Accessibilità nei test

- Verificare sempre che gli elementi interattivi abbiano `aria-label` rilevabile:
  ```tsx
  expect(screen.getByLabelText("Aggiungi studente")).toBeInTheDocument();
  ```
- Verificare che le icone decorative NON siano accessibili (non devono apparire nelle query per ruolo).

---

## 7. Regole da non violare

- Non usare `document.querySelector` o accesso diretto al DOM: usare le query di Testing Library.
- Non usare `setTimeout` / `sleep` nei test: usare `waitFor` o `findBy*`.
- Non esportare componenti solo per il testing: testare il comportamento visibile, non gli internals.
- Il file deve iniziare con `// MD3 Compliant`.
