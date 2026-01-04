/**
 * Validatore di dati per il backup
 * Verifica che i dati caricati siano validi e li normalizza
 */

import { BackupPayload } from '../types';

/**
 * Valida e normalizza i dati del backup
 * Ritorna dati sicuri da usare, con valori di default per campi mancanti
 */
export function validateBackupData(data: unknown): BackupPayload | null {
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
    const validated: BackupPayload = {
      user: (backup.user as any) ?? null,
      students: ensureArray(backup.students) as any,
      lessons: ensureObject(backup.lessons) as any,
      slots: ensureObject(backup.slots) as any,
      evaluations: ensureArray(backup.evaluations) as any,
      competencyEvals: ensureArray(backup.competencyEvals) as any,
      uda: ensureArray(backup.uda) as any,
      eventi: ensureArray(backup.eventi) as any,
      knowledgeBase: ensureArray(backup.knowledgeBase) as any,
      corpora: ensureArray(backup.corpora) as any,
      notifiche: ensureArray(backup.notifiche) as any,
      rubriche: ensureArray(backup.rubriche) as any,
      pianiInclusione: ensureObject(backup.pianiInclusione) as any,
      giudizi: ensureObject(backup.giudizi) as any,
      reportistica: ensureArray(backup.reportistica) as any,
      feedSources: ensureArray(backup.feedSources) as any,
      draftRegister: ensureObject(backup.draftRegister) as any,
      finalizedRegister: ensureArray(backup.finalizedRegister) as any,
      curricula: ensureArray(backup.curricula) as any,
      submissions: ensureArray(backup.submissions) as any,
      suggestions: ensureArray(backup.suggestions) as any,
      dismissedSuggestions: new Set(ensureStringArray(backup.dismissedSuggestions)),
      settings: (backup.settings as any) ?? null,
      aiSettings: (backup.aiSettings as any) ?? null,
      themeState: (backup.themeState as any) ?? null,
      navigationHistory: ensureArray(backup.navigationHistory) as any,
      backupState: (backup.backupState as any) ?? { status: 'synced', lastBackup: null },
      driveSyncState: (backup.driveSyncState as any) ?? { isAuthenticated: false, isSyncing: false, lastSyncTime: null },
      
      // Fields from BackupPayload
      studentProfileContext: (backup.studentProfileContext as any) ?? null,
      selectedClassForDashboard: (backup.selectedClassForDashboard as any) ?? null,
      orientamentoActivities: ensureArray(backup.orientamentoActivities) as any,
      ePortfolioEntries: ensureArray(backup.ePortfolioEntries) as any,
      studentOrientamentoStates: ensureObject(backup.studentOrientamentoStates) as any,
      analyticsEvents: ensureArray(backup.analyticsEvents) as any,
      analyticsMetrics: (backup.analyticsMetrics as any) ?? {
        totalDocumentsGenerated: 0,
        documentsByType: {},
        featuresUsage: {},
        templatesCreated: 0,
        exportBatchesCount: 0,
        aiInteractionsCount: 0,
        averageSessionDuration: 0,
        lastUpdated: new Date().toISOString()
      },
      analyticsSettings: (backup.analyticsSettings as any) ?? {
        enabled: true,
        collectFeatureUsage: true,
        collectDocumentMetrics: true,
        collectPerformanceMetrics: false,
        retentionDays: 90,
        lastReset: null
      },
      activeSuggestion: (backup.activeSuggestion as any) ?? null,
      templates: ensureArray(backup.templates) as any,
      installPrompt: (backup.installPrompt as any) ?? null,
      canShowInstallPrompt: !!backup.canShowInstallPrompt,
      isGlobalAiLoading: !!backup.isGlobalAiLoading,
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
export function hasMinimumData(data: BackupPayload): boolean {
  // Se c'è un user, i dati sono validi
  if (data.user) return true;
  
  // Altrimenti controlla se c'è almeno qualche dato significativo
  const hasStudents = data.students.length > 0;
  const hasLessons = Object.keys(data.lessons).length > 0;
  const hasSlots = Object.keys(data.slots).length > 0;
  
  return hasStudents || hasLessons || hasSlots;
}
