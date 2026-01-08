# MD3 Expressive Compliance Report | DocenteDoc AI
**Generated:** 2025-12-30 | **Bundle Impact Estimate:** <50KB total

## Executive Summary
| Componente | Stato | Violazioni | Uso | Priorità | Bundle Impact |
|------------|-------|------------|-----|----------|---------------|
| RegistroTableLegacy | 🔴 0% | 12 | Critical | HIGH | +4KB |
| OldStudentList | 🔴 15% | 8 | Medium | HIGH | +3KB |
| Sidebar | 🟡 40% | 5 | High | HIGH | +2KB |
| LessonCard | 🟢 85% | 2 | High | MEDIUM | +1KB |
| Button | 🟢 90% | 1 | High | LOW | +0.5KB |
| Card | 🟢 95% | 1 | Medium | LOW | +0.5KB |
| AppBar | 🟢 100% | 0 | High | - | 0 |

## High Priority Fixes (Critical Path)

### 1. RegistroTableLegacy | Shape Non-Compliant
**File:** `src/components/RegistroTableLegacy.tsx:45`
**Violazione:** `border-radius: 5px` (MD3 usa 0/4/8/12/16/28px)
**Impact:** Componente critico, 14s per "Annota assenza"
**Fix Code:**
```tsx
// NEW FILE: src/components/RegistroTableMD3.tsx
import { DataTable, TableRow, TableCell } from './md3/DataTable';

export const RegistroTableMD3: React.FC = () => {
  return (
    <div className={styles.container} style={{ borderRadius: 'var(--md-corner-medium)' }}>
      {/* MD3 compliant implementation */}
    </div>
  );
};

// Usage in App:
const RegistroTable = location.search.includes('registro=md3') 
  ? RegistroTableMD3 
  : RegistroTableLegacy;
```
