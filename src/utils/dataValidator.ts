/**
 * Validatore di dati per il backup
 * Verifica che i dati caricati siano validi e li normalizza
 */

import { Uda, Report } from '../types';

export interface ValidatedBackupData {
  user: unknown | null;
  students: unknown[];
  lessons: unknown[];
  slots: unknown[];
  evaluations: unknown[];
  competencyEvals: unknown[];
  uda: Uda[];
  eventi: unknown[];
  knowledgeBase: unknown[];
  corpora: unknown[];
  notifiche: unknown[];
  rubriche: unknown[];
  pianiInclusione: Record<string, unknown>;
  giudizi: Record<string, unknown>;
  reportistica: Report[];
  feedSources: unknown[];
  draftRegister: Record<string, unknown>;
  finalizedRegister: unknown[];
  notebookNotes: Record<string, unknown[]>;
  memos: unknown[];
  curricula: unknown[];
  submissions: unknown[];
  suggestions: unknown[];
  dismissedSuggestions: string[];
  settings: unknown | null;
  aiSettings: unknown | null;
  themeState: unknown | null;
  navigationHistory: unknown[];
  backupState: unknown | null;
  driveSyncState: unknown | null;
// ---
}

/**
 * Valida e normalizza i dati del backup
 * Ritorna dati sicuri da usare, con valori di default per campi mancanti
 */
export function validateBackupData(data: unknown): ValidatedBackupData | null {
  if (!data || typeof data !== 'object') {
    console.warn('[DataValidator] Invalid backup data: not an object');
    return null;
  }

  const backup = data as Record<string, unknown>;

  // Funzione helper per validare array
  const ensureArray = (value: unknown): unknown[] => {
    if (Array.isArray(value)) return value;
    return [];
  };

  // Funzione helper per validare oggetto
  const ensureObject = (value: unknown): Record<string, unknown> => {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      return value as Record<string, unknown>;
    }
    return {};
  };

  // Funzione helper per validare Set serializzato come array di stringhe
  const ensureStringArray = (value: unknown): string[] => {
    if (Array.isArray(value)) {
      return value.filter((item): item is string => typeof item === 'string');
    }
    return [];
  };

  try {
    const validated: ValidatedBackupData = {
      user: backup.user ?? null,
      students: ensureArray(backup.students),
      lessons: ensureArray(backup.lessons),
      slots: ensureArray(backup.slots),
      evaluations: ensureArray(backup.evaluations),
      competencyEvals: ensureArray(backup.competencyEvals),
      uda: ensureArray(backup.uda) as Uda[],
      eventi: ensureArray(backup.eventi),
      knowledgeBase: ensureArray(backup.knowledgeBase),
      corpora: ensureArray(backup.corpora),
      notifiche: ensureArray(backup.notifiche),
      rubriche: ensureArray(backup.rubriche),
      pianiInclusione: ensureObject(backup.pianiInclusione),
      giudizi: ensureObject(backup.giudizi),
      reportistica: ensureArray(backup.reportistica) as Report[],
      feedSources: ensureArray(backup.feedSources),
      draftRegister: ensureObject(backup.draftRegister),
      finalizedRegister: ensureArray(backup.finalizedRegister),
      notebookNotes: ensureObject(backup.notebookNotes) as Record<string, unknown[]>,
      memos: ensureArray(backup.memos),
      curricula: ensureArray(backup.curricula),
      submissions: ensureArray(backup.submissions),
      suggestions: ensureArray(backup.suggestions),
      dismissedSuggestions: ensureStringArray(backup.dismissedSuggestions),
      settings: backup.settings ?? null,
      aiSettings: backup.aiSettings ?? null,
      themeState: backup.themeState ?? null,
      navigationHistory: ensureArray(backup.navigationHistory),
      backupState: backup.backupState ?? null,
      driveSyncState: backup.driveSyncState ?? null,
    };

    console.log('[DataValidator] Backup data validated successfully');
    return validated;
  } catch (error) {
    console.error('[DataValidator] Validation failed:', error);
    return null;
  }
}

/**
 * Verifica se il backup è recente (meno di 24 ore)
 */
export function isBackupRecent(data: unknown): boolean {
  if (!data || typeof data !== 'object') return false;
  
  const backup = data as Record<string, unknown>;
  const savedAt = backup._savedAt;
  
  if (typeof savedAt !== 'string') return false;
  
  try {
    const savedDate = new Date(savedAt);
    const now = new Date();
    const hoursDiff = (now.getTime() - savedDate.getTime()) / (1000 * 60 * 60);
    return hoursDiff < 24;
  } catch {
    return false;
  }
}

/**
 * Verifica integrità minima dei dati (ha almeno user o è vuoto)
 */
export function hasMinimumData(data: ValidatedBackupData): boolean {
  // Se c'è un user, i dati sono validi
  if (data.user) return true;
  
  // Altrimenti controlla se c'è almeno qualche dato significativo
  const hasStudents = data.students.length > 0;
  const hasLessons = data.lessons.length > 0;
  const hasSlots = data.slots.length > 0;
  
  return hasStudents || hasLessons || hasSlots;
}
