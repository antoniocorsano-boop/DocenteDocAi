# MD3 Migration Crisis Analysis - RegisterImportDialog.tsx

## 🚨 SITUAZIONE IDENTIFICATA
- **File**: RegisterImportDialog.tsx (351 righe)
- **Violazioni Trovate**: 46 violazioni totali
- **ESLint Status**: ✅ Non rileva valori hardcoded come violazioni
- **Contesto**: Componente per importazione registri studenti
- **Stato**: RICHIEDE MIGRAZIONE COMPLETA valori hardcoded e className

## 📊 ANALISI DETTAGLIATA

### 1. Stato Attuale del File
- **Righe Totali**: 351
- **Funzionalità**: Dialog per importazione dati registri con mapping colonne
- **Dipendenze**: M3Dialog, M3Button, SelectField, ImportService
- **Pattern**: Mix di inline styles MD3 e hardcoded values + className

### 2. Violazioni Identificate (46 totali)

#### A. Hardcoded Typography Values
**FontSize hardcoded trovati:**
- `fontSize: "0.75rem"` → dovrebbe essere `--md-sys-typescale-label-small-font-size`
- `fontSize: "0.875rem"` → dovrebbe essere `--md-sys-typescale-body-medium-font-size`
- **Occorrenze**: ~12+ valori fontSize hardcoded in labels e inputs

#### B. Hardcoded Border Values
**Border hardcoded:**
- `border: "1px solid var(--md-sys-color-outline)"` → dovrebbe usare `--md-sys-border-width-thin`
- **Occorrenze**: Multiple in table cells e form elements

#### C. ClassName Usage (Tailwind)
**Classi Tailwind residue:**
- `text-5xl` → dovrebbe essere inline style con MD3 token
- `text-primary` → dovrebbe essere `var(--md-sys-color-primary)`
- `text-[var(--md-sys-color-onSurface)]-variant` → syntax errata, dovrebbe essere corretta

#### D. Pattern Systematico
- **Typography**: 12+ hardcoded fontSize values
- **Borders**: Multiple `1px solid` declarations
- **Tailwind Classes**: 2 className usages con utility classes
- **Form Styling**: Consistent pattern di hardcoded values in input fields

### 3. Pattern di Migrazione Necessari
- ✅ **Colori:** Principalmente OK (--md-sys-color-*)
- ✅ **Spacing:** Già migrati (--md-sys-spacing-*)
- ❌ **Typography:** RICHIEDE MIGRAZIONE COMPLETA hardcoded → token
- ❌ **Borders:** RICHIEDE STANDARDIZZAZIONE 1px solid → border tokens
- ❌ **ClassName:** RICHIEDE RIMOZIONE Tailwind → inline styles
- ✅ **Layout:** Principalmente OK

## 🔍 TASK DI MIGRAZIONE

### A. Typography Migration
- [ ] Sostituire `fontSize: "0.75rem"` → `fontSize: 'var(--md-sys-typescale-label-small-font-size)'`
- [ ] Sostituire `fontSize: "0.875rem"` → `fontSize: 'var(--md-sys-typescale-body-medium-font-size)'`
- [ ] Applicare a tutti i labels e input fields (~12 occorrenze)

### B. Border Standardization
- [ ] Sostituire `border: "1px solid var(--md-sys-color-outline)"` → `border: 'var(--md-sys-border-width-thin) solid var(--md-sys-color-outline)'`
- [ ] Applicare a table cells e form elements

### C. ClassName Removal
- [ ] Rimuovere `className={`text-5xl ${...}`}` → inline style con MD3 token
- [ ] Correggere syntax errata `text-[var(--md-sys-color-onSurface)]-variant`
- [ ] Convertire a `color: 'var(--md-sys-color-on-surface-variant)'`

### D. Validation & Testing
- [ ] Build verification dopo migrazione
- [ ] Visual regression testing import dialog
- [ ] Funzionalità import (upload, mapping, preview)
- [ ] Form validation e user interactions

## 🎯 STRATEGIA MIGRAZIONE

### Fase 1: Typography Token Migration
```typescript
// DA:
<label style={{fontSize: "0.75rem", fontWeight: "bold"}}>

// A:
<label style={{fontSize: 'var(--md-sys-typescale-label-small-font-size)', fontWeight: "bold"}}>
```

### Fase 2: Border Token Standardization
```typescript
// DA:
style={{border: "1px solid var(--md-sys-color-outline)"}}

// A:
style={{border: 'var(--md-sys-border-width-thin) solid var(--md-sys-color-outline)'}}
```

### Fase 3: ClassName → Inline Styles
```typescript
// DA:
<span className={`material-symbols-outlined text-5xl ${isDragActive ? 'text-primary' : 'text-[var(--md-sys-color-onSurface)]-variant'}`}>

// A:
<span style={{
    fontFamily: 'Material Symbols Outlined',
    fontSize: 'var(--md-sys-typescale-display-small-font-size)',
    color: isDragActive ? 'var(--md-sys-color-primary)' : 'var(--md-sys-color-on-surface-variant)'
}}>
```

## 📈 METRICHE PREVISTE

- **Violazioni Attuali**: 46 (typography hardcoded + borders + className)
- **Riduzione Target**: 100% (0 violazioni finali)
- **Complessità**: Media (pattern ripetitivi in form elements)
- **Impatto**: Alto (import dialog è funzionalità critica)

## 🔧 PIANO ESECUZIONE

1. **Analisi Dettagliata**: Mappare tutte le occorrenze hardcoded
2. **Backup**: Creare RegisterImportDialog.tsx.backup
3. **Fase 1**: Migrare typography tokens
4. **Fase 2**: Standardizzare border declarations
5. **Fase 3**: Convertire className a inline styles
6. **Validation**: Build + visual testing + funzionalità import
7. **Completion**: Aggiornamento report compliance

## 📝 NOTE TECNICHE

- **File**: src/components/RegisterImportDialog.tsx
- **Righe**: 351 (componente form-focused)
- **Sezioni**: upload, mapping, preview steps
- **Token Da Usare**: --md-sys-typescale-*-font-size, --md-sys-border-width-*
- **Pattern**: Form styling patterns ripetitivi
- **Testing**: Focus su import workflow e form interactions

## 🎯 PROSSIMI PASSI

**RegisterImportDialog.tsx** è il prossimo target prioritario dopo HelpModal.tsx completato.

Questa migrazione è focalizzata su pulizia form styling e rimozione className, mantenendo consistenza nell'import experience.