// MD3 Gold Compliant
// Esportazione hooks custom per applicazione
// Audit: febbraio 2026

// Core Engine Hooks
export { useDataLoader } from './useDataLoader';
export { useTestMode } from './useTestMode';
export { useAiSuggestions } from './useAiSuggestions';

// Integration Hooks
export { useGoogleDriveSync } from './useGoogleDriveSync';
export { useDemoData } from './useDemoData';

// Feature Hooks
export { useAppNavigation } from './useAppNavigation';
export { useLessonManagement } from './useLessonManagement';
export { useEvaluationManagement } from './useEvaluationManagement';
export { useUdaManagement } from './useUdaManagement';
export { useBackupManagement } from './useBackupManagement';

// Legacy Hook (to be refactored)
export { useAppEngine } from './useAppEngine';
export { usePersistence } from './usePersistence';

// Default exports
export { default as useDataLoaderDefault } from './useDataLoader';
export { default as useTestModeDefault } from './useTestMode';
export { default as useAiSuggestionsDefault } from './useAiSuggestions';
export { default as useGoogleDriveSyncDefault } from './useGoogleDriveSync';
export { default as useDemoDataDefault } from './useDemoData';
export { default as useAppNavigationDefault } from './useAppNavigation';
export { default as useLessonManagementDefault } from './useLessonManagement';
export { default as useEvaluationManagementDefault } from './useEvaluationManagement';
export { default as useUdaManagementDefault } from './useUdaManagement';
export { default as useBackupManagementDefault } from './useBackupManagement';
export { default as useAppEngineDefault } from './useAppEngine';
export { default as usePersistenceDefault } from './usePersistence';
