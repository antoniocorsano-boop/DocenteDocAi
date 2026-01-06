# Storybook Migration Plan - M3 Components

**Obiettivo**: Creare stories per 7 componenti M3 mancanti senza causare errori di build.

**Status**: ✅ ALL PHASES COMPLETE (7/7 Stories Created) - Ready for Deployment

---

## 📋 Componenti da Documentare

### Current Status

| # | Componente | Props Definiti | Risk Level | Priority | Status |
|---|---|---|---|---|---|
| 1 | **M3Card** | ✅ semplici | 🟢 Basso | P1 | ✅ Done |
| 2 | **M3ListItem** | ✅ well-defined | 🟢 Basso | P1 | ✅ Done |
| 3 | **M3RatingBar** | ✅ semplici | 🟢 Basso | P1 | ✅ Done |
| 4 | **M3ChoiceCard** | ✅ ben definiti | 🟢 Basso | P2 | ✅ Done |
| 5 | **M3ExpressiveCard** | ✅ ben definiti | 🟢 Basso | P2 | ✅ Done |
| 6 | **M3DatePicker** | ✅ estende input | 🟢 Basso | P2 | ✅ Done |
| 7 | **M3Dialog** | ✅ complex ma chiare | 🟡 Medio | P3 | ✅ Done |

---

## ⚠️ Regole Fondamentali

Per **evitare il loop della sessione precedente**:

1. ✅ **USA SOLO I PROPS DEFINITI** nell'interfaccia TypeScript del componente
2. ✅ **NON inventare props** (es. `variant`, `open`, `icon` dove non definiti)
3. ✅ **TEST DOPO OGNI STORY**: esegui `npm run build` per validare
4. ✅ **Mantieni stories semplici**: focus su casi d'uso principali
5. ✅ **Evita conflicts**: se errori, cancella story e rianalizza il componente

---

## 📝 Props Audit (Verified)

### M3Card
```tsx
interface M3CardProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
}
```

### M3ListItem
```tsx
interface M3ListItemProps {
    headline: React.ReactNode;           // REQUIRED
    headlineSize?: 'small' | 'medium' | 'large';
    supportingText?: React.ReactNode;
    leadingElement?: React.ReactNode;
    trailingElement?: React.ReactElement;
    onClick?: () => void;
    className?: string;
    children?: React.ReactNode;
}
```

### M3RatingBar
```tsx
type M3RatingBarProps = {
    max?: number;                        // default: 5
    value?: number;                      // default: 0
    disabled?: boolean;                  // default: false
    readonly?: boolean;                  // default: false
    onChange?: (rating: number) => void;
}
```

### M3ChoiceCard
```tsx
interface M3ChoiceCardProps {
    icon: string;                        // REQUIRED (Material icon name)
    label: string;                       // REQUIRED
    onClick: () => void;                 // REQUIRED (callback)
    selected: boolean;                   // REQUIRED (state)
    className?: string;
}
```

### M3ExpressiveCard
```tsx
interface M3ExpressiveCardProps {
    icon: string;                        // REQUIRED (Material icon name)
    title: string;                       // REQUIRED
    description: string;                 // REQUIRED
    color?: 'primary' | 'secondary' | 'tertiary' | 'surface' | 'surfaceVariant' | string;
    onClick?: () => void;
    className?: string;
    children?: React.ReactNode;
}
```

### M3DatePicker
```tsx
type M3DatePickerProps = React.InputHTMLAttributes<HTMLInputElement> & {
    label?: string;
    helperText?: string;
    error?: string | boolean;
}
```

### M3Dialog
```tsx
interface M3DialogProps {
    id?: string;
    level?: number;
    title: React.ReactNode;              // REQUIRED
    headline?: string;
    children: React.ReactNode;           // REQUIRED
    buttons?: React.ReactNode;
    mode?: 'modal' | 'fullscreen';
    onClose: () => void;                 // REQUIRED (callback)
    className?: string;
    backdropClickable?: boolean;
}
```

---

## 🎯 Execution Plan

### Phase 1: Simple Components (P1) ✅ DONE
- ✅ M3Card (4 stories: Default, WithContent, Clickable, WithCustomClass)
- ✅ M3ListItem (7 stories: Default, WithSupport, Size variants, Leading/Trailing, Full)
- ✅ M3RatingBar (7 stories: Default, Partial, Full, Interactive, ReadOnly, Disabled, 3/10-star)

### Phase 2: Medium Components (P2) ✅ DONE
- ✅ M3ChoiceCard (7 stories: Default, Selected, Different icons, Interactive, Group)
- ✅ M3ExpressiveCard (8 stories: Color variants, Clickable, Children support, ColorGrid)
- ✅ M3DatePicker (8 stories: Default, WithHelper, WithError, Disabled, FormExample, States)

### Phase 3: Complex Components (P3) ✅ DONE
- ✅ M3Dialog (6 stories: Default, WithHeadline, WithButtons, Fullscreen, RichContent, SmallDialog)

---

## 🔍 Build Validation

After each story creation:
```bash
npm run build
```

Expected output: **No errors**

If errors occur:
1. Check error message
2. Verify props against interface
3. Delete story file
4. Re-analyze component
5. Re-create with corrections

---

## 📊 Progress Tracking

- **Session Start**: 4 stories exist, 27 components without stories
- **M3 Components**: 10 missing stories
- **Current Plan**: Restore 7 M3 stories (highest priority)
- **Remaining**: 20 UI components (lower priority, can defer)

---

## 📅 Session History

### Session Date: January 6, 2026

**Previous Issues (Session N-1)**:
- ❌ M3Card.stories.tsx: Referenced non-existent `variant` prop
- ❌ M3Dialog.stories.tsx: Referenced non-existent `open` prop (12 errors)
- ❌ M3ListItem.stories.tsx: Referenced non-existent `icon` prop (13 errors)
- ❌ M3ExpressiveCard.stories.tsx: Referenced non-existent props (8 errors)
- ❌ M3RatingBar.stories.tsx: Import path error (5 type errors)
- ❌ M3DatePicker.stories.tsx: Import path error

**Solution Applied**: Deleted 6 broken story files (43 total errors removed)

**Current Session**: Systematic story recreation with prop validation

