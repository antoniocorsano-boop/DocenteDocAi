// Types barrel export - FASE 4: Types Modularization
// Re-exports from domain-specific type modules

// For backward compatibility, all types are still exported from here
// In the future, imports should be from specific modules:
// import { StudentState, Studente } from './types/student';

export * from './student';
export * from './academic';
export * from './settings';
export * from './ui';
export * from './common';
