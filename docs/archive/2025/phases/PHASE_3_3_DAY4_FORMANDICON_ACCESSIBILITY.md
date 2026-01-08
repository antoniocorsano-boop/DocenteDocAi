# Phase 3.3 - Day 4: Icon Accessibility Implementation

**Status:** 🔍 IN PROGRESS  
**Date:** January 5, 2026  
**Focus:** Form labels and icon accessibility  
**Time Tracking:** ~2 hours estimated, implementing now

---

## Task Completion Status

### ✅ Completed (Day 4.1)
- [x] StudentManager form labels added
  - TextField now has proper `label` prop
  - SelectField has proper `label` prop
  - Both have `aria-label` for screen reader backup
  - Search input: "Cerca studente per nome..."
  - Filter dropdown: "Seleziona classe"
  - Archive toggle: "Mostra studenti archiviati"

- [x] StudentManager button icon accessibility
  - All icon buttons now have descriptive `aria-label`
  - Icon span elements now have `aria-hidden="true"`
  - Examples:
    - "Ripristina {nome} {cognome} come studente attivo"
    - "Cambia classe per {nome} {cognome}"
    - "Modifica dati per {nome} {cognome}"
    - "Elimina {nome} {cognome} dal sistema"

### ⏳ Pending (Day 4.2 - Icon Accessibility Strategy)

#### Icon Accessibility Classification

**Type 1: Decorative Icons (aria-hidden="true")**
- Icons that only provide visual styling
- No additional information beyond the accompanying text
- Examples:
  - Chevron icons in navigation
  - Loading spinners
  - Decorative bullets
- Strategy: Add `aria-hidden="true"` to `<span className="material-symbols-outlined">`

**Type 2: Semantic Icons with Adjacent Text**
- Icons that reinforce meaning but have text next to them
- Examples:
  - "✓ Save" button (checkmark icon + text)
  - "🗑️ Delete" button (trash icon + text)
- Strategy: Keep parent button/link with `aria-label`; add `aria-hidden="true"` to icon span

**Type 3: Icon-Only Buttons (No Adjacent Text)**
- Standalone icon buttons (no visible text label)
- Examples:
  - Close button (X icon only)
  - Expand/collapse button (chevron only)
  - Action menu button (three dots only)
- Strategy: Add `aria-label` to button element
  - Example: `<button aria-label="Close dialog">×</button>`

**Type 4: Status Indicators**
- Icons that communicate state or status
- Examples:
  - Check mark for "completed"
  - Warning triangle for "attention needed"
  - Red circle for "error"
- Strategy: Either:
  - Add `aria-label` to parent container, OR
  - Use `aria-label` on icon itself with explanation

---

## Implementation Plan

### Phase 1: Add aria-hidden to Decorative Icons (Current)

In progress - adding `aria-hidden="true"` to:
- Navigation chevrons (left/right arrows)
- Loading spinners
- Decorative Material Symbols

### Phase 2: Fix Icon-Only Buttons (To do)

Focus areas:
1. **ClassroomView icons**
   - Back button (arrow_back)
   - Attendance toggle (check/close/schedule)
   - Add buttons
   - Action menu buttons

2. **Calendar icons**
   - Chevron navigation buttons
   - View mode buttons
   - Event action buttons

3. **Settings icons**
   - Collapse/expand toggles
   - Settings icons in headers

4. **General icon buttons across app**
   - Close buttons in modals
   - Delete/edit buttons
   - Share/export buttons

### Phase 3: Verify Form Labels (To do)

Audit all form components:
- [ ] StudentManager ✅ DONE
- [ ] AddStudentModal
- [ ] Settings form fields
- [ ] Calendar event form
- [ ] All other form inputs

---

## Current Examples

### Good Pattern (StudentManager)
```tsx
<M3Button 
    onClick={() => onEdit(student)} 
    variant="icon" 
    className="hover:bg-surface-container-highest" 
    title="Modifica dati studente"
    aria-label={`Modifica dati per ${student.cognome} ${student.nome}`}
>
    <span className="material-symbols-outlined" aria-hidden="true">
        edit
    </span>
</M3Button>
```

### Good Pattern (Form Labels)
```tsx
<TextField
    id="student-search"
    label="Cerca studente per nome..."
    placeholder="Digita nome o cognome..."
    value={searchTerm}
    onChange={e => setSearchTerm(e.target.value)}
    leadingIcon="search"
    aria-label="Ricerca studenti per nome o cognome"
/>
```

---

## WCAG Criteria Addressed

- **1.1.1 Non-text Content (Level A):** All images and icons have text alternatives
- **1.3.1 Info and Relationships (Level A):** Form labels properly associated with inputs
- **2.4.4 Link Purpose (Level A):** All links have clear purpose descriptions
- **4.1.2 Name, Role, Value (Level A):** All UI components have accessible names

---

## Build & Test Status

- Build: [Pending - will run after implementation]
- Tests: [Pending - will run after implementation]
- Regressions: [Pending - will check after implementation]

---

## Next Steps (Immediate)

1. Continue adding aria-hidden to all decorative icons in critical components
2. Ensure all icon-only buttons have aria-label
3. Run build validation
4. Run test validation
5. Git commit

---

## Notes

- Using `title` attributes alongside `aria-label` for better UX
- `aria-hidden="true"` on icons ensures screen readers skip purely decorative elements
- Form labels use existing TextField/SelectField infrastructure
- No breaking changes - all additions are attributes

