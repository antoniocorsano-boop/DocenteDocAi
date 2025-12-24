# 🛠️ Piano Fix UX/UI - DocenteDoc AI
> Data: 24 Dicembre 2025

## 📊 RIEPILOGO PROBLEMI

| Severità | Conteggio | Stato |
|----------|-----------|-------|
| 🔴 Critico | 5 | ✅ Completato |
| 🟡 Alta | 14 | ⏳ Da fare |
| 🟠 Media | 9 | ⏳ Da fare |

---

## FASE 1: Fix Critici Layout ✅ COMPLETATA
**Priorità: MASSIMA**

- [x] 1.1 Correggere safe-area-bottom in layout.css ✅
- [x] 1.2 Normalizzare z-index stack (Header: 1100, Nav: 1000, Modal: 2000) ✅
- [x] 1.3 Aggiungere hamburger menu responsive ✅
- [x] 1.4 Fixare popover con max-width dinamico ✅

### Dettagli Tecnici Fase 1:

**1.1 Safe Area Bottom**
- File: `src/layout.css`
- Problema: `--safe-area-bottom: 100px` ma nav reale è 108px (84px + 24px offset)
- Fix: Calcolare correttamente e applicare padding-bottom consistente

**1.2 Z-Index Stack**
- Header: z-index: 1100 ✓
- Bottom Nav: z-index: 1000 (abbassare da 1100)
- Popup Menu: z-index: 2000
- Modal Backdrop: z-index: 2500
- Modal Content: z-index: 2600
- Toast: z-index: 3000

**1.3 Hamburger Menu**
- File: `src/components/Header.tsx`
- Collapsare azioni in menu su viewport < 640px
- Mantenere solo logo + hamburger + avatar

**1.4 Popover Responsive**
- File: `src/components/Header.tsx`
- Cambiare `!w-80` a `max-w-[calc(100vw-32px)] w-80`

---

## FASE 2: Sistema Design Tokens ⏳
**Priorità: ALTA**

- [ ] 2.1 Completare variabili typography CSS
- [ ] 2.2 Completare dark mode tokens
- [ ] 2.3 Sostituire colori hardcoded con tokens
- [ ] 2.4 Unificare border-radius a sistema M3

### Dettagli Tecnici Fase 2:

**2.1 Typography Tokens**
- File: `src/theme.css`
- Aggiungere: `--typography-display-large-fontFamily`, etc.

**2.2 Dark Mode**
- File: `src/theme.css`
- Completare `.dark` class con tutti i tokens

**2.3 Colori Tokens**
- Sostituire `rgba(103, 80, 164, 0.08)` con `var(--sys-primary-container)`
- File: `src/components.css`, componenti TSX

**2.4 Border Radius**
- Definire: `--shape-xs: 4px`, `--shape-s: 8px`, `--shape-m: 12px`, `--shape-l: 16px`, `--shape-xl: 28px`
- Applicare consistentemente

---

## FASE 3: Responsive Unificato ⏳
**Priorità: MEDIA**

- [ ] 3.1 Definire breakpoint standard
- [ ] 3.2 Applicare mobile-first approach
- [ ] 3.3 Fixare timetable grid overflow
- [ ] 3.4 Ottimizzare touch targets a 44px minimo

### Breakpoint Standard:
```css
/* Mobile First */
sm: 640px   /* Small tablets */
md: 768px   /* Tablets */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large desktop */
```

---

## FASE 4: Accessibilità ⏳
**Priorità: MEDIA**

- [ ] 4.1 Aggiungere focus states consistenti
- [ ] 4.2 Fixare contrasti WCAG AA
- [ ] 4.3 Aggiungere aria-labels mancanti

---

## 📝 LOG MODIFICHE

| Data | Fase | Task | File Modificati | Stato |
|------|------|------|-----------------|-------|
| 24/12/24 | 1 | 1.1 safe-area | theme.css | ✅ |
| 24/12/24 | 1 | 1.2 z-index | layout.css | ✅ |
| 24/12/24 | 1 | 1.3 hamburger | Header.tsx | ✅ |
| 24/12/24 | 1 | 1.4 popover responsive | components.css, Header.tsx | ✅ |

---

## 🎯 OBIETTIVI

1. **Usabilità Mobile**: App completamente funzionale su viewport 320px+
2. **Consistenza Visiva**: Design system M3 applicato uniformemente
3. **Accessibilità**: WCAG 2.1 AA compliance
4. **Performance**: No layout shift, no flickering
