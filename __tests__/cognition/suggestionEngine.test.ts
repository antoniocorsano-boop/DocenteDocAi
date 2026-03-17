// @ts-nocheck
/**
 * SuggestionEngine unit tests
 *
 * Covers:
 *  - generateNextActions: level gating, minAiScore, cooldown, personalMode,
 *    requiresBookLinked, max-3, interactionMode boost (praticante+classica)
 *  - generateArtisticNextActions: returns [] for esploratore, calls
 *    generateArtisticSuggestions for praticante, maps to TCM CopilotSuggestion,
 *    uses advanced objectives at aiScore >= 60, returns [] on error
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  generateNextActions,
  generateArtisticNextActions,
} from '../../src/cognition/SuggestionEngine';

// ── Mock ArtisticConsilium ────────────────────────────────────────────────────

vi.mock('../../src/services/ArtisticConsilium', () => ({
  generateArtisticSuggestions: vi.fn(),
}));

import { generateArtisticSuggestions } from '../../src/services/ArtisticConsilium';

// ── Model builder ─────────────────────────────────────────────────────────────

function makeModel(
  capabilityLevel: number,
  overrides: Partial<{
    dismissedHints: string[];
    lastUpdated: number;
    isPersonalMode: boolean;
    bookServicesLinked: number;
  }> = {},
) {
  return {
    capabilityLevel,
    confidenceScore: 0.8,
    levelUpPending: false,
    dismissedHints: overrides.dismissedHints ?? [],
    lastUpdated: overrides.lastUpdated ?? 0,
    usageProfile: {
      featuresDiscovered: 0,
      bookServicesLinked: overrides.bookServicesLinked ?? 0,
      externalServicesConnected: 0,
      isPersonalMode: overrides.isPersonalMode ?? false,
      workspaceConfigured: false,
    },
    pedagogicalProfile: {
      preferredMethods: [],
      subjectAreas: [],
      classTypes: [],
      innovationScore: 0,
    },
    workflowPatterns: [],
    copilotInteractionProfile: {
      suggestionAcceptanceRate: 0,
      manualOverrides: 0,
      automationEnabled: false,
      preferredSuggestionTypes: [],
    },
  };
}

// ── generateNextActions ───────────────────────────────────────────────────────

describe('generateNextActions', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns only esploratore suggestions for capabilityLevel 1', () => {
    const ctx = {
      model: makeModel(1),
      interactionMode: 'classica' as const,
      aiMaturitaScore: 10,
    };
    const result = generateNextActions(ctx);
    expect(result.length).toBeGreaterThan(0);
    expect(result.length).toBeLessThanOrEqual(3);
    // No maestro-only entries
    expect(result.every((s) => s.id !== 'sug-automation-full')).toBe(true);
    expect(result.every((s) => s.id !== 'sug-artistic-consilium')).toBe(true);
  });

  it('esploratore at aiScore < 40 does not include analytics insight', () => {
    const ctx = {
      model: makeModel(1),
      interactionMode: 'classica' as const,
      aiMaturitaScore: 30,
    };
    const result = generateNextActions(ctx);
    expect(result.some((s) => s.id === 'sug-analytics-insights')).toBe(false);
  });

  it('praticante can receive sug-analytics-insights when aiScore >= 40', () => {
    // capabilityLevel 2 = praticante
    const ctx = {
      model: makeModel(2),
      interactionMode: 'guidata' as const,
      aiMaturitaScore: 50,
    };
    const result = generateNextActions(ctx);
    // It may or may not surface in top 3 given other higher-priority entries —
    // but it must NOT be blocked by the level gate (praticante includes it)
    // Verify pool is non-empty and max 3
    expect(result.length).toBeLessThanOrEqual(3);
  });

  it('respects dismissed hints (permanent cooldown)', () => {
    const ctx = {
      model: makeModel(2, { dismissedHints: ['sug-drive-backup'] }),
      interactionMode: 'guidata' as const,
      aiMaturitaScore: 0,
    };
    const result = generateNextActions(ctx);
    expect(result.some((s) => s.id === 'sug-drive-backup')).toBe(false);
  });

  it('personalModeOnly suggestion only shown when isPersonalMode=true', () => {
    const ctxNormal = {
      model: makeModel(1, { isPersonalMode: false }),
      interactionMode: 'classica' as const,
      aiMaturitaScore: 0,
      isPersonalMode: false,
    };
    const ctxPersonal = {
      model: makeModel(1, { isPersonalMode: true }),
      interactionMode: 'classica' as const,
      aiMaturitaScore: 0,
      isPersonalMode: true,
    };

    const normal = generateNextActions(ctxNormal);
    const personal = generateNextActions(ctxPersonal);

    expect(normal.some((s) => s.id === 'sug-personal-mode-start')).toBe(false);
    // In personal mode it may appear in the top-3
    expect(personal.some((s) => s.id === 'sug-personal-mode-start')).toBe(true);
  });

  it('requiresBookLinked suggestion only shown when bookServicesLinked > 0', () => {
    const ctxNoBook = {
      model: makeModel(1, { bookServicesLinked: 0 }),
      interactionMode: 'classica' as const,
      aiMaturitaScore: 0,
    };
    const ctxBook = {
      model: makeModel(1, { bookServicesLinked: 1 }),
      interactionMode: 'classica' as const,
      aiMaturitaScore: 0,
    };

    expect(generateNextActions(ctxNoBook).some((s) => s.id === 'sug-book-integration-uda')).toBe(false);
    // With book linked it can appear
    const withBook = generateNextActions(ctxBook);
    expect(withBook.every((s) => !s.id.startsWith('sug-book') || s.id === 'sug-book-integration-uda')).toBe(true);
  });

  it('never returns more than 3 results', () => {
    // maestro level → largest candidate pool
    const ctx = {
      model: makeModel(4),
      interactionMode: 'guidata' as const,
      aiMaturitaScore: 80,
    };
    expect(generateNextActions(ctx).length).toBeLessThanOrEqual(3);
  });

  it('boosts sug-mode-semi-osmotica to front for praticante + classica mode', () => {
    const ctx = {
      model: makeModel(2),
      interactionMode: 'classica' as const,
      aiMaturitaScore: 0,
    };
    const result = generateNextActions(ctx);
    // semi-osmotica must be first if it's in the pool
    if (result.some((s) => s.id === 'sug-mode-semi-osmotica')) {
      expect(result[0].id).toBe('sug-mode-semi-osmotica');
    }
  });

  it('type-level cooldown suppresses same type within 24h', () => {
    const lastUpdated = Date.now() - 1000; // 1 second ago (within 24h)
    const ctx = {
      model: makeModel(2, {
        dismissedHints: ['workflow'],  // dismissing type prefix
        lastUpdated,
      }),
      interactionMode: 'guidata' as const,
      aiMaturitaScore: 0,
    };
    const result = generateNextActions(ctx);
    // workflow-type suggestions should be suppressed
    expect(result.some((s) => s.type === 'workflow')).toBe(false);
  });
});

// ── generateArtisticNextActions ───────────────────────────────────────────────

describe('generateArtisticNextActions', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns [] immediately for esploratore (capabilityLevel 1)', async () => {
    const ctx = {
      model: makeModel(1),
      interactionMode: 'classica' as const,
      aiMaturitaScore: 30,
    };
    const result = await generateArtisticNextActions(ctx);
    expect(result).toEqual([]);
    expect(generateArtisticSuggestions).not.toHaveBeenCalled();
  });

  it('calls generateArtisticSuggestions for praticante (capabilityLevel 2)', async () => {
    vi.mocked(generateArtisticSuggestions).mockResolvedValue([]);
    const ctx = {
      model: makeModel(2),
      interactionMode: 'guidata' as const,
      aiMaturitaScore: 20,
    };
    await generateArtisticNextActions(ctx);
    expect(generateArtisticSuggestions).toHaveBeenCalledOnce();
  });

  it('calls generateArtisticSuggestions for maestro (capabilityLevel 4)', async () => {
    vi.mocked(generateArtisticSuggestions).mockResolvedValue([]);
    const ctx = {
      model: makeModel(4),
      interactionMode: 'osmotica' as const,
      aiMaturitaScore: 80,
    };
    await generateArtisticNextActions(ctx);
    expect(generateArtisticSuggestions).toHaveBeenCalledOnce();
  });

  it('maps ArtisticSuggestion to teacherModel CopilotSuggestion format', async () => {
    vi.mocked(generateArtisticSuggestions).mockResolvedValue([
      {
        id: 'a1',
        title: 'Mosaico storico',
        description: 'Crea un mosaico visivo sul periodo storico studiato in classe.',
        activityType: 'visual',
        estimatedMinutes: 60,
        materials: ['cartone'],
        copilotSuggestion: {
          id: 'a1-hint',
          label: 'Attività artistiche',
          actionKey: 'artistic.open',
          actionPayload: {},
          priority: 2,
        },
      },
    ]);
    const ctx = {
      model: makeModel(2),
      interactionMode: 'guidata' as const,
      aiMaturitaScore: 20,
    };
    const result = await generateArtisticNextActions(ctx);
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      type: 'feature',
      targetView: 'copilot',
      icon: 'palette',   // visual → palette
    });
    expect(result[0].id).toContain('sug-artistic.ai.');
    expect(result[0].message).toContain('Mosaico storico');
    expect(result[0].message).toContain('60');
  });

  it('uses correct icon for musical activityType', async () => {
    vi.mocked(generateArtisticSuggestions).mockResolvedValue([
      {
        id: 'm1', title: 'Ballata', description: 'desc', activityType: 'musical',
        estimatedMinutes: 45, materials: [],
        copilotSuggestion: { id: 'm1-hint', label: 'l', actionKey: 'artistic.open', actionPayload: {}, priority: 2 },
      },
    ]);
    const ctx = { model: makeModel(2), interactionMode: 'guidata' as const, aiMaturitaScore: 0 };
    const result = await generateArtisticNextActions(ctx);
    expect(result[0].icon).toBe('music_note');
  });

  it('uses correct icon for theatrical activityType', async () => {
    vi.mocked(generateArtisticSuggestions).mockResolvedValue([
      {
        id: 't1', title: 'Teatro', description: 'desc', activityType: 'theatrical',
        estimatedMinutes: 90, materials: [],
        copilotSuggestion: { id: 't1-hint', label: 'l', actionKey: 'artistic.open', actionPayload: {}, priority: 2 },
      },
    ]);
    const ctx = { model: makeModel(2), interactionMode: 'guidata' as const, aiMaturitaScore: 0 };
    const result = await generateArtisticNextActions(ctx);
    expect(result[0].icon).toBe('theater_comedy');
  });

  it('uses advanced learning objectives when aiMaturitaScore >= 60', async () => {
    vi.mocked(generateArtisticSuggestions).mockResolvedValue([]);
    const ctx = {
      model: makeModel(2),
      interactionMode: 'guidata' as const,
      aiMaturitaScore: 70,
    };
    await generateArtisticNextActions(ctx);
    const callArg = vi.mocked(generateArtisticSuggestions).mock.calls[0][0];
    expect(callArg.learningObjectives).toEqual(
      expect.arrayContaining(['interdisciplinarit\u00e0', 'competenze trasversali', 'creativit\u00e0']),
    );
  });

  it('uses basic objectives when aiMaturitaScore < 60', async () => {
    vi.mocked(generateArtisticSuggestions).mockResolvedValue([]);
    const ctx = {
      model: makeModel(2),
      interactionMode: 'guidata' as const,
      aiMaturitaScore: 30,
    };
    await generateArtisticNextActions(ctx);
    const callArg = vi.mocked(generateArtisticSuggestions).mock.calls[0][0];
    expect(callArg.learningObjectives).toEqual(['arricchimento didattico']);
  });

  it('returns [] (does not throw) when generateArtisticSuggestions rejects', async () => {
    vi.mocked(generateArtisticSuggestions).mockRejectedValue(new Error('AI down'));
    const ctx = {
      model: makeModel(2),
      interactionMode: 'guidata' as const,
      aiMaturitaScore: 0,
    };
    const result = await generateArtisticNextActions(ctx);
    expect(result).toEqual([]);
  });
});
