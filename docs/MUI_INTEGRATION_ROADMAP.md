# MUI Integration Roadmap - DocenteDoc AI

**Status:** Planning  
**Priority:** Medium (Fase 2, dopo consolidamento current M3)  
**Timeline:** Settimane 3-4

---

## 1. Popover Components (Quick Wins)

### Candidati per Migrazione a MUI Popover

| Componente | Uso Attuale | Complessità | Stima Effort |
|---|---|---|---|
| `EventActionPopover` | Azioni su eventi (edit, delete, assign) | Media | 2-3h |
| `QuickNotePopover` | Note rapide su studenti | Media | 2-3h |
| `NotificationsPopover` | Notification dropdown | Alta | 3-4h |

### Approccio Migrazione
```tsx
// PRIMA (Custom)
<div className="absolute top-12 right-0 bg-surface ...">
  {children}
</div>

// DOPO (MUI)
import { Popover } from '@mui/material';

<Popover
  open={open}
  anchorEl={anchorEl}
  onClose={onClose}
  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
  PaperProps={{ sx: { backgroundColor: 'var(--sys-surface)', ... } }}
>
  {children}
</Popover>
```

### Vantaggi MUI Popover
✅ Scroll handling automatico  
✅ Positioning intelligente (viewport edges)  
✅ Keyboard support (ESC to close)  
✅ Accessibility WCAG compliant  

---

## 2. Menu Component (Navigation)

### Menu.tsx Migration
**Attualmente:** Custom implementation con vanilla JavaScript  
**Problema:** Keyboard navigation incompleta, no submenu support  

### Soluzione MUI Menu
```tsx
import { Menu, MenuItem } from '@mui/material';

<Menu
  id="main-menu"
  anchorEl={anchorEl}
  open={Boolean(anchorEl)}
  onClose={handleClose}
  MenuListProps={{ 'aria-labelledby': 'menu-button' }}
>
  <MenuItem onClick={handleClose}>Profilo</MenuItem>
  <MenuItem onClick={handleClose}>Impostazioni</MenuItem>
  <MenuItem onClick={handleClose}>Logout</MenuItem>
</Menu>
```

### Styling con MD3
```tsx
<Menu
  PaperProps={{
    sx: {
      backgroundColor: 'var(--sys-surface)',
      border: '1px solid var(--sys-outline-variant)',
      borderRadius: 'calc(var(--shape-md) * var(--sys-radius-multiplier))',
      boxShadow: '0 5px 10px rgba(0,0,0,0.1)', // elevation-1
    }
  }}
>
  {/* items */}
</Menu>
```

---

## 3. Autocomplete (Futura)

### Candidati per Integrazione

- `SelectField` (simple select) — → MUI Select
- Search fields con suggestions
- Student/Class selection dropdowns

### Esempio MUI Autocomplete
```tsx
import { Autocomplete, TextField } from '@mui/material';

<Autocomplete
  disablePortal
  options={students}
  getOptionLabel={(option) => option.nome}
  renderInput={(params) => <TextField {...params} label="Seleziona studente" />}
  onInputChange={(event, value, reason) => {}}
  // MD3 styling via sx prop
  slotProps={{
    paper: {
      sx: {
        backgroundColor: 'var(--sys-surface)',
        border: '1px solid var(--sys-outline)',
      }
    }
  }}
/>
```

---

## 4. DataGrid (Large Data Tables)

### Dove Serve DataGrid
- Reportistica (grade tables, attendance)
- Archivio con sorting/filtering
- Bulk operations

### Approccio Graduale
**Fase 1:** MUI DataGrid per tabelle non-PWA (full-sync cloud)  
**Fase 2:** Custom table per local data (offline-first)  

```tsx
import { DataGrid } from '@mui/x-data-grid';

const columns = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'name', headerName: 'Nome', width: 130 },
  { field: 'grade', headerName: 'Voto', width: 100 },
];

<DataGrid
  rows={students}
  columns={columns}
  pageSizeOptions={[5, 10, 25]}
  paginationModel={paginationModel}
  onPaginationModelChange={setPaginationModel}
  sx={{
    backgroundColor: 'var(--sys-background)',
    '& .MuiDataGrid-cell': {
      borderColor: 'var(--sys-outline-variant)',
    },
  }}
/>
```

---

## 5. Dialog (Possible Replacement)

### Considerazione: M3Dialog vs MUI Dialog

| Aspetto | M3Dialog Custom | MUI Dialog |
|---|---|---|
| Size | ~2KB | ~15KB |
| MD3 Support | Native | Via sx prop |
| Features | Semplice | Complesso (fullscreen, scroll, etc.) |
| Keyboard | Basic | Pieno (ESC, Tab trap) |
| Accessibility | Manuale | WCAG AA built-in |

### Decisione
**✅ Mantenere M3Dialog** per dialoghi semplici (alert, confirm, form modal).  
**🔄 Considera MUI Dialog** solo se occorrono fullscreen, scrollable body, complex layout.

---

## 6. Stepper (Multi-step Workflows)

### Candidati Attuali
- `AnnualPlanningWizard` — 5+ step
- `BatchExportWizard` — 3 step
- `ConsiglioClasseWizard` — 4 step
- `PassaggioAnnoWizard` — 3 step

### Problema Attuale
Custom implementation, no visual feedback chiaro.

### Soluzione MUI Stepper
```tsx
import { Stepper, Step, StepLabel, StepContent } from '@mui/material';

<Stepper activeStep={activeStep} orientation="vertical">
  {steps.map((label, index) => (
    <Step key={label}>
      <StepLabel>{label}</StepLabel>
      <StepContent>
        {/* Step content */}
      </StepContent>
    </Step>
  ))}
</Stepper>
```

**Timeline:** Fase 3 (bassa priorità, funziona già)

---

## 7. Installation & Configuration

### Step 1: Install MUI Core
```bash
npm install @mui/material @emotion/react @emotion/styled
```
*(Already in package.json, v7.3.6)*

### Step 2: Setup Theme Provider (Optional)
```tsx
import { ThemeProvider, createTheme } from '@mui/material/styles';

const muiTheme = createTheme({
  palette: {
    primary: { main: 'var(--sys-primary)' },
    secondary: { main: 'var(--sys-secondary)' },
    background: { default: 'var(--sys-background)' },
  },
  typography: {
    fontFamily: "'Roboto', sans-serif",
  },
});

// App.tsx
<ThemeProvider theme={muiTheme}>
  {/* app */}
</ThemeProvider>
```

### Step 3: Icons (Optional)
```bash
npm install @mui/icons-material
```
*Already available*

---

## 8. Testing Strategy

### Unit Tests (Vitest)
```tsx
import { render, screen } from '@testing-library/react';
import { Popover } from '@mui/material';

describe('MUI Popover Integration', () => {
  it('should open popover on click', () => {
    render(<EventActionPopover onClose={jest.fn()} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('should close on ESC key', () => {
    render(<EventActionPopover onClose={mockClose} />);
    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' });
    expect(mockClose).toHaveBeenCalled();
  });
});
```

### E2E Tests (Playwright)
```typescript
test('EventActionPopover opens and closes', async ({ page }) => {
  await page.click('[data-testid="event-action-btn"]');
  await expect(page.locator('[role="dialog"]')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('[role="dialog"]')).not.toBeVisible();
});
```

---

## 9. Performance Considerations

### Bundle Impact
- MUI Material: ~450KB (before tree-shaking)
- After tree-shaking: ~50-80KB (only used components)
- With CSS-in-JS: ~15KB additional

### Optimization Strategy
```tsx
// ✅ GOOD: Code splitting
const Popover = lazy(() => import('@mui/material/Popover'));

// ✅ GOOD: Only import used components
import { Popover, Menu } from '@mui/material';
// NOT: import * from '@mui/material'

// ✅ GOOD: Use sx prop instead of makeStyles
<Box sx={{ color: 'var(--sys-primary)' }} />
```

### PWA Local-First Impact
- No impact (components render client-side)
- CSS-in-JS might increase cache size by ~20KB
- Mitigation: lazy-load MUI components

---

## 10. Rollout Plan

### Phase 2a (Week 3): Popover
- [ ] Install & test MUI Popover
- [ ] Migrate `EventActionPopover`
- [ ] Migrate `QuickNotePopover`
- [ ] Update styles to use MD3 tokens
- [ ] Test accessibility
- [ ] Benchmark performance

### Phase 2b (Week 4): Menu + Stepper
- [ ] Migrate `Menu.tsx`
- [ ] Evaluate Stepper (decision: adopt or keep custom)
- [ ] Update docs

### Phase 3 (Week 5+): DataGrid (Conditional)
- [ ] Evaluate need for full DataGrid
- [ ] Prototype with test data
- [ ] Performance profiling

---

## 11. Compatibility Matrix

### What Works Together

| Library | MUI | Custom M3 | Tailwind | Status |
|---|---|---|---|---|
| @dnd-kit (drag-drop) | ✅ | ✅ | ✅ | OK |
| @emotion (CSS-in-JS) | ✅ | ✅ | ⚠️ Conflict possible | Monitor |
| Zustand (state) | ✅ | ✅ | ✅ | OK |
| Tailwind | ⚠️ Scope carefully | ✅ | ✅ | Use for layout only |
| OpenTelemetry (tracing) | ✅ | ✅ | ✅ | OK |

**⚠️ Nota:** Emotion potrebbe conflare con Tailwind if both use CSS-in-JS. Soluzione: use MUI `sx` prop instead of Tailwind inside MUI components.

---

## 12. Decision Log

### Decision 1: Popover First
**Date:** 5 Gennaio 2026  
**Rationale:** Quick win, clear benefits (accessibility, positioning), low risk  
**Owner:** Architecture Review

### Decision 2: Keep M3Dialog
**Date:** 5 Gennaio 2026  
**Rationale:** Custom M3Dialog è semplice, leggero, MD3-native. MUI Dialog aggiunge overhead.  
**Owner:** Design System Team

### Decision 3: Lazy-load MUI Components
**Date:** 5 Gennaio 2026  
**Rationale:** Reduce bundle size per PWA local-first requirements  
**Owner:** Performance Team

---

## 13. Links & References

- [MUI Popover Docs](https://mui.com/material-ui/react-popover/)
- [MUI Menu Docs](https://mui.com/material-ui/react-menu/)
- [MUI DataGrid Docs](https://mui.com/x/react-data-grid/)
- [MUI Stepper Docs](https://mui.com/material-ui/react-stepper/)
- [MUI Theming](https://mui.com/material-ui/customization/theming/)

---

**Version:** 1.0  
**Last Updated:** 5 Gennaio 2026  
**Next Review:** 12 Gennaio 2026
