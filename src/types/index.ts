/**
 * Type Definitions Index
 * 
 * This module re-exports all types from the monolithic types.ts file.
 * Future refactoring should move types here from types.ts progressively.
 * 
 * TODO: Migrate types from src/types.ts to this directory:
 * - student.ts - StudentState, Studente, PianoInclusione, etc.
 * - academic.ts - AcademicState, Lezione, Slot, Uda, etc.
 * - system.ts - SystemState, UserProfile, Notifica, etc.
 * - settings.ts - SettingsState, TimetableSettings, AiSettings, etc.
 * - ui.ts - UIState, Modals, View, etc.
 * - orientamento.ts - Orientamento types
 * - evaluation.ts - Valutazione types
 * - calendar.ts - EventoCalendario types
 */

// Re-export from existing modular types
export * from './metrics';
export * from './SyncConflictData';

// Legacy types.ts exports (to be migrated)
// NOTE: Import from '../types' for now until migration is complete
