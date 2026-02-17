# Component Refactoring Plan

## Current Critical Components

| Component | Lines | Status | Priority |
|-----------|-------|--------|----------|
| Settings.tsx | 1,915 | 🔴 CRITICAL | P0 |
| HelpModal.tsx | 1,174 | 🔴 CRITICAL | P0 |
| Dashboard.tsx | 884 | 🟠 HIGH | P1 |
| ClassroomView.tsx | 830 | 🟠 HIGH | P1 |
| AnalyticsDashboard.tsx | 796 | 🟠 HIGH | P1 |

## Progress

### ✅ Completed

#### HelpModal.tsx (1,174 lines)
**Extracted Components:**
- `src/components/help/ManualSection.tsx` - Collapsible section component ✅
- `src/components/help/UseCaseCard.tsx` - Use case display with sanitization ✅
- `src/components/help/index.ts` - Module exports ✅

**Remaining in HelpModal.tsx:**
- Tab content components (improvements, manual, guide, setup, assistant, faq, specs, normativa)
- PDF generation logic
- AI service integration

#### Settings.tsx (1,915 lines)
**Extracted Components:**
- `src/components/settings/SettingsGroup.tsx` - Collapsible settings group ✅

**TODO - Extract Sections:**
- [ ] `InterfaceSettings.tsx` - UI mode, theme, colors
- [ ] `ProfileSettings.tsx` - AI profile selection
- [ ] `AiDidatticaSettings.tsx` - AI teaching settings
- [ ] `CloudSettings.tsx` - Google Drive, sync
- [ ] `DebugSettings.tsx` - Logging, diagnostics
- [ ] `AdvancedSettings.tsx` - Experimental features

### 📋 Refactoring Strategy

#### Phase 1: Extract Shared Components
1. ✅ SettingsGroup - Reusable collapsible container
2. ✅ ManualSection - Collapsible help section
3. ✅ UseCaseCard - Scenario display component

#### Phase 2: Extract Tab/Section Components
For Settings.tsx:
```
src/components/settings/
├── index.ts
├── SettingsGroup.tsx         ✅
├── InterfaceSettings.tsx     🔄
├── ProfileSettings.tsx       🔄
├── AiDidatticaSettings.tsx   🔄
├── CloudSettings.tsx         🔄
├── DebugSettings.tsx         🔄
└── AdvancedSettings.tsx      🔄
```

For HelpModal.tsx:
```
src/components/help/
├── index.ts
├── ManualSection.tsx         ✅
├── UseCaseCard.tsx          ✅
├── ImprovementsTab.tsx      🔄
├── ManualTab.tsx            🔄
├── GuideTab.tsx             🔄
├── FaqTab.tsx               🔄
└── SpecsTab.tsx             🔄
```

#### Phase 3: Custom Hooks
Extract business logic into hooks:
- `useThemeExport()` - Theme import/export
- `useClassGeneration()` - Class generation logic
- `useSettingsPersistence()` - Settings save/load

### 🎯 Success Metrics

- [x] Componenti estratti: 3/15
- [ ] No component >500 lines
- [ ] All sections in separate files
- [ ] Shared components reusable
- [ ] Tests for extracted components

### 📊 Size Targets

| Component | Current | Target | Status |
|-----------|---------|--------|--------|
| Settings.tsx | 1,915 | <400 | 🔄 |
| HelpModal.tsx | 1,174 | <300 | 🔄 |
| Dashboard.tsx | 884 | <400 | ⏳ |
| ClassroomView.tsx | 830 | <400 | ⏳ |

### 📝 Next Steps

1. **Settings.tsx**: Estrarre InterfaceSettings section (~200 linee)
2. **Settings.tsx**: Estrarre CloudSettings section (~150 linee)
3. **HelpModal.tsx**: Estrarre ManualTab content (~300 linee)
4. **HelpModal.tsx**: Estrarre FaqTab content (~200 linee)

Estimated effort: 2-3 sprints
