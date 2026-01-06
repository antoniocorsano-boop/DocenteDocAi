# Phase 2B - Component Analysis

**Date:** January 5, 2026  
**Analysis Phase:** 2B.1

---

## 1. EventActionPopover

**File:** `src/components/EventActionPopover.tsx` (60 lines)

### Current Implementation
```
- Custom positioning with rect.getBoundingClientRect()
- Manual boundary adjustment logic
- Manual click-outside detection
- Fixed positioning to viewport
- CSS class: m3-popup-menu
```

### Props Interface
```typescript
interface EventActionPopoverProps {
  event: EventoCalendario;
  anchorEl: HTMLElement;
  onClose: () => void;
  onEdit: (event: EventoCalendario) => void;
  onDelete: (eventId: string) => void;
}
```
\    ``typescript\```   
### Content Structure
- Header: Event title, date, time, description
- Button 1: "Modifica" (Edit) - triggers onEdit + onClose
- Button 2: "Elimina" (Delete) - with confirmation, triggers onDelete + onClose

### Migration Pattern
```typescript
// BEFORE
const style: React.CSSProperties = {};
if (anchorEl) {
  const rect = anchorEl.getBoundingClientRect();
  style.position = 'fixed';
  let top = rect.bottom + 8;
  let left = rect.left;
  if (top + 200 > window.innerHeight) top = rect.top - 200;
  if (left + 280 > window.innerWidth) left = window.innerWidth - 280 - 16;
  style.top = `${top}px`;
  style.left = `${left}px`;
}

// AFTER: Use MUI Popover with anchorEl
<Popover
  open={Boolean(anchorEl)}
  anchorEl={anchorEl}
  onClose={onClose}
  anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
  transformOrigin={{ vertical: 'top', horizontal: 'left' }}
/>
```

### Complexity: **MEDIUM**
- Simple content (title, description, 2 buttons)
- No scrolling needed
- No special positioning
- **Effort:** 2-3 hours

---

## 2. NotificationsPopover

**File:** `src/components/NotificationsPopover.tsx` (133 lines)

### Current Implementation
```
- Custom positioning with rect.getBoundingClientRect()
- Manual click-outside detection
- Scroll handling with custom-scrollbar class
- Fixed positioning with max-height and overflow-y-auto
- CSS class: m3-popup-menu header-notifications-popover
- Complex content: scrollable list of 15-100 notifications
```

### Props Interface
```typescript
interface NotificationsPopoverProps {
  notifiche: Notifica[];
  onClose: () => void;
  onMarkAsRead: (notificationId: string) => void;
  onMarkAllAsRead: () => void;
  onNavigate: (view: View) => void;
  onOpenCircularAnalysis: (url: string, title: string) => void;
}
```

### Content Structure
- Header: Title "Notifiche", "Segna lette" button, close button
- Scrollable list:
  - Notification cards (InfoCard component)
  - Each has icon, title, message, date, actions
  - Clickable items that mark as read and navigate
  - Different styling for read vs unread
- Footer: Possibly showing "No notifications" state

### Special Handling
- Sticky header during scroll
- Unread count badge (red dot)
- Circular notifications with action buttons
- Event/reminder notifications with navigation

### Migration Pattern
```typescript
// Use MUI Popover with PaperProps for custom scrolling
<Popover
  open={Boolean(anchorEl)}
  anchorEl={anchorEl}
  onClose={onClose}
  PaperProps={{
    sx: {
      maxHeight: '80vh',
      width: '384px', // w-96
      overflowY: 'auto',
      '&::-webkit-scrollbar': { /* custom scrollbar */ }
    }
  }}
/>
```

### Complexity: **HIGH**
- Complex content with scrolling
- Header + list + footer layout
- Multiple event types (circular, reminder, notification)
- Click handlers on items, buttons
- **Effort:** 3-4 hours

---

## 3. QuickNotePopover

**File:** `src/components/QuickNotePopover.tsx` (80 lines)

### Current Implementation
```
- Custom positioning with rect.getBoundingClientRect()
- Manual click-outside detection
- Fixed positioning
- CSS class: m3-popup-menu
- Contains: VoiceNoteRecorder component
```

### Props Interface
```typescript
interface QuickNotePopoverProps {
  anchorEl: HTMLElement | null;
  initialValue: string;
  onSave: (note: string) => void;
  onClose: () => void;
}
```

### Content Structure
- Header: Title "Nota Rapida", VoiceNoteRecorder, close button
- Content: Textarea for note input
- Footer: "Salva Nota" button

### Special Handling
- VoiceNoteRecorder component (transcription support)
- Textarea with focus on mount
- Simple save/close flow

### Migration Pattern
```typescript
// Simple content, good MUI Popover candidate
<Popover
  open={Boolean(anchorEl)}
  anchorEl={anchorEl}
  onClose={onClose}
  anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
  transformOrigin={{ vertical: 'top', horizontal: 'left' }}
/>
```

### Complexity: **MEDIUM**
- Simple content (header, textarea, button)
- Voice recorder integration
- No scrolling
- **Effort:** 2-3 hours

---

## 4. StudentActionMenu

**File:** `src/components/StudentActionMenu.tsx` (107 lines)

### Current Implementation
```
- Custom positioning with rect.getBoundingClientRect()
- Manual click-outside detection
- Fixed positioning
- CSS class: m3-popup-menu
- Complex header with student avatar and stats
```

### Props Interface
```typescript
interface StudentActionMenuProps {
  student: Studente;
  anchorEl: HTMLElement;
  evaluations: Valutazione[];
  participation: ParticipationEntry[];
  onClose: () => void;
  onAddEvaluation: () => void;
  onViewProfile: () => void;
}
```

### Content Structure
- Header (colored):
  - Avatar with student name
  - Three stats: Media (grade), Trend (icon), Badge (participation count)
  - Stats separated by dividers
- Body:
  - Section label: "Azioni Rapide"
  - Button: "Nuova Valutazione" (Add evaluation)
  - Button: "Profilo Completo" (View full profile)

### Special Handling
- Trend icon color-coded (green = up, red = down, gray = flat)
- Performance calculation from evaluations
- Participation count computation

### Migration Pattern
```typescript
// Can migrate to Popover, keep header styling
<Popover
  open={Boolean(anchorEl)}
  anchorEl={anchorEl}
  onClose={onClose}
  anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
  transformOrigin={{ vertical: 'top', horizontal: 'left' }}
>
  {/* Keep existing header and body structure */}
</Popover>
```

### Complexity: **MEDIUM**
- Custom header layout with avatar + stats
- Simple content (2 buttons)
- No scrolling
- **Effort:** 2-3 hours

---

## 5. Menu.tsx (Navigation)

**File:** `src/components/Menu.tsx` (80 lines)

### Current Implementation
```
- NOT a popover, but a persistent navigation bar
- CSS class: bottom-nav-bar m3-navigation-drawer
- Custom nav-item styling
- No positioning needed (fixed at bottom)
- 5 main menu items with active state
- Active state tracking via parent views
```

### Props Interface
```typescript
interface MenuProps {
  currentView: View;
  onNavigate: (view: View, context?: unknown) => void;
}
```

### Content Structure
- Navigation items (5 total):
  1. Home (home)
  2. Orario (schedule/timetable)
  3. Progetta (design/planning)
  4. Classi (classes)
  5. Calendario (calendar)
- Each item has: icon (filled when active), label

### Active State Logic
```typescript
const parentMap: Partial<Record<View, View[]>> = {
  'progettazione-hub': ['knowledge-base', 'studio', 'lessons', 'uda', 'rubriche', 'reportistica', 'didattica-inclusiva', 'curriculum-manager'],
  'aula': ['evaluations', 'register', 'studenti', 'improvement-guide', 'consiglio-di-classe', 'class-competency-dashboard', 'analytics', 'teacher-inbox'],
};
```

### Migration Consideration
**NOT A POPOVER** - This is a persistent navigation bar. MUI equivalent would be **BottomNavigation** or **Drawer**, but:
- Current implementation is lightweight and specific
- May not benefit from MUI migration as much as popovers
- **Decision:** Keep as-is for now, or migrate to MUI BottomNavigation in Phase 2C

### Complexity: **MEDIUM** (if migrated)
- If moving to MUI BottomNavigation, need to adapt structure
- Simple button list, easy refactor
- **Effort:** 1-2 hours (if needed)

---

## Summary

| Component | Type | Complexity | Effort | Priority |
|-----------|------|-----------|--------|----------|
| EventActionPopover | Popover | Medium | 2-3h | 1 (Quick) |
| QuickNotePopover | Popover | Medium | 2-3h | 1 (Quick) |
| StudentActionMenu | Popover | Medium | 2-3h | 1 (Quick) |
| NotificationsPopover | Popover | High | 3-4h | 2 (Complex) |
| Menu.tsx | Navigation | Medium | 0-2h | 3 (Optional) |

**Total Effort:** 10-15 hours  
**Recommended Order:**
1. EventActionPopover (simplest, good test case)
2. QuickNotePopover (simple, voice integration)
3. StudentActionMenu (medium, header styling)
4. NotificationsPopover (most complex, last)
5. Menu.tsx (optional, keep as fallback)

---

## Key Migration Points

### All Popovers Share
- Custom manual positioning → MUI Popover automatic handling
- Manual click-outside → MUI Popover onClose
- Custom CSS classes → MUI PaperProps.sx
- Fixed positioning → anchorEl + anchorOrigin

### Design System Tokens to Preserve
- Colors: var(--sys-surface), var(--sys-on-surface), etc.
- Spacing: var(--spacing-*) 
- Border radius: var(--shape-*)
- Elevation: var(--elevation-*)
- Animations: aura-slide-up, fade-in

### Testing Requirements
- Keyboard navigation (ESC closes popover)
- Click-outside closes popover
- Focus management
- Viewport edge handling
- Mobile responsiveness
- Animation preservation

---

## Next Steps
1. Verify MUI installation
2. Create migration template component
3. Migrate components in priority order
4. Test each component thoroughly
5. Full test suite execution
6. Build validation
7. Commit and document

---

**Analysis Complete** ✅  
Ready to proceed with Step 2B.2 - Popover Migrations
