# DocenteDoc AI – Morning Checklist

## 🌅 Routine Domattina

Segui questa checklist passo passo per riprendere il controllo del progetto:

---

### 1. Apri le istruzioni aggiornate
- Percorso: `/mnt/data/COPILOT_INSTRUCTIONS.md`
- Leggi rapidamente le sezioni:
  - **How to use v2 with the assistant**
  - **Component Rules**
- Identifica eventuali note o componenti su cui lavorare oggi.

### 2. Verifica lo stato del progetto
```bash
npm run dev
```
- Assicurati che la build principale parta senza errori.
- Controlla eventuali warning o errori critici.

### 3. Definisci uno scope di lavoro limitato
- Scegli 1-2 componenti o pagine.
- Applica le regole di **token MD3**, **componenti M3**, **MUI solo quando complesso**.
- Evita refactor globale.

### 4. Usa Copilot come assistente
- Procedi **step by step**.
- Convalida ogni suggerimento:
  - Token corretti (colori, spacing, typography)
  - Dark mode support automatico
  - Accessibilità (ARIA, focus, tab order)

### 5. Testa subito dopo le modifiche
- Unit + Component Tests con **Vitest** e **React Testing Library**
- E2E con **Playwright** se necessario
- Copertura target ≥ 80% per logica business
```bash
npm run test
npm run test:coverage
```

### 6. Commit & Push
- Segui **conventional commits**:
  ```
  feat: add/update M3 component
  fix: correct dark mode token usage
  refactor: consolidate spacing tokens
  ```
- Verifica:
```bash
npm run lint:fix
npm run test
```
- Solo dopo che tutto è verde, esegui push.

### 7. Documenta decisioni & override
- Annota override o dubbi in `DESIGN_SYSTEM_CONSOLIDATION.md`
- Commenti chiari nel codice

### ✅ Checklist Visiva
- [ ] Apri istruzioni v2 + design docs
- [ ] Verifica build dev
- [ ] Definisci componenti su cui lavorare
- [ ] Applica regole styling MD3 + MUI + Tailwind layout
- [ ] Test unit/component/E2E
- [ ] Commit chiari + push sicuro
- [ ] Aggiorna documentazione override

---
**Consiglio:** Procedi lentamente, ogni step chiaro e validato, così il progetto rimane coerente e manutenibile.

