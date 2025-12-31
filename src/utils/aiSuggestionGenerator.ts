import { AiSuggestion, AppState } from '../types';
import { generateContent } from '../services/aiService';

const CACHE_KEY = 'ai_suggestions_cache';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

interface CachedSuggestions {
    suggestions: AiSuggestion[];
    timestamp: number;
    userId: string;
}

/**
 * Generates personalized AI suggestions based on user data
 * Uses caching (24h), AI scoring for prioritization, and graceful error handling
 */
export const generateAiSuggestions = async (appState: AppState): Promise<AiSuggestion[]> => {
    try {
        // Check cache first
        const cached = getCachedSuggestions(appState.user?.id);
        if (cached) {
            return cached;
        }

        // Prepare context data for AI
        const context = buildSuggestionContext(appState);

        // Generate suggestions using AI
        const prompt = buildSuggestionPrompt(context);

        const response = await generateContent(prompt, {
            temperature: 0.7,
            maxTokens: 1500
        });

        const rawSuggestions = parseAiResponse(response.content);

        // Score and prioritize suggestions
        const scoredSuggestions = await scoreSuggestions(rawSuggestions, context);

        // Sort by score and take top 5
        const prioritizedSuggestions = scoredSuggestions
            .sort((a, b) => b.score - a.score)
            .slice(0, 5)
            .map(({ suggestion }) => suggestion);

        // Cache the results
        setCachedSuggestions(prioritizedSuggestions, appState.user?.id);

        return prioritizedSuggestions;

    } catch (error) {
        console.error('[aiSuggestionGenerator] Error generating suggestions:', error);
        // Graceful fallback: return system suggestions if AI fails
        return getFallbackSuggestions(appState);
    }
};

const getCachedSuggestions = (userId?: string): AiSuggestion[] | null => {
    try {
        const cached = localStorage.getItem(CACHE_KEY);
        if (!cached) return null;

        const parsed: CachedSuggestions = JSON.parse(cached);
        const now = Date.now();

        if (parsed.userId !== userId || (now - parsed.timestamp) > CACHE_DURATION) {
            localStorage.removeItem(CACHE_KEY);
            return null;
        }

        return parsed.suggestions;
    } catch (error) {
        console.error('[aiSuggestionGenerator] Cache read error:', error);
        return null;
    }
};

const setCachedSuggestions = (suggestions: AiSuggestion[], userId?: string): void => {
    try {
        const cacheData: CachedSuggestions = {
            suggestions,
            timestamp: Date.now(),
            userId: userId || 'anonymous'
        };
        localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
    } catch (error) {
        console.error('[aiSuggestionGenerator] Cache write error:', error);
    }
};

const buildSuggestionContext = (appState: AppState) => {
    const { students, lessons, evaluations, uda, settings, knowledgeBase } = appState;

    return {
        studentCount: students.length,
        lessonCount: Object.keys(lessons).length,
        evaluationCount: evaluations.length,
        udaCount: uda.length,
        kbEntriesCount: knowledgeBase.length,
        recentActivity: getRecentActivitySummary(appState),
        schoolInfo: {
            schoolName: settings.nomeIstituto,
            teacherName: settings.nomeInsegnante,
            currentYear: settings.annoScolasticoCorrente
        }
    };
};

const getRecentActivitySummary = (appState: AppState) => {
    const { evaluations, lessons, uda } = appState;
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);

    const recentEvals = evaluations.filter(e => new Date(e.data) > lastWeek).length;
    const recentLessons = Object.keys(lessons).length; // Count all lessons since no direct date
    const recentUda = uda.filter(u => u.startDate && new Date(u.startDate) > lastWeek).length;

    return { recentEvals, recentLessons, recentUda };
};

interface SuggestionContext {
    studentCount: number;
    lessonCount: number;
    evaluationCount: number;
    udaCount: number;
    kbEntriesCount: number;
    recentActivity: {
        recentEvals: number;
        recentLessons: number;
        recentUda: number;
    };
    schoolInfo: {
        schoolName: string;
        teacherName: string;
        currentYear: string;
    };
}

const buildSuggestionPrompt = (context: SuggestionContext): string => {
    return `Sei un assistente didattico AI per docenti italiani. Analizza i dati dell'utente e genera 3-5 suggerimenti personalizzati e utili per migliorare la loro attività didattica.

DATI UTENTE:
- Studenti: ${context.studentCount}
- Lezioni totali: ${context.lessonCount}
- Valutazioni: ${context.evaluationCount}
- Unità Didattiche: ${context.udaCount}
- Voci Knowledge Base: ${context.kbEntriesCount}
- Attività recente (ultima settimana):
  - Valutazioni: ${context.recentActivity.recentEvals}
  - Lezioni: ${context.recentActivity.recentLessons}
  - UDA create: ${context.recentActivity.recentUda}
- Scuola: ${context.schoolInfo.schoolName}
- Anno scolastico: ${context.schoolInfo.currentYear}

GENERA suggerimenti nel seguente formato JSON:
[
  {
    "id": "unique_id",
    "icon": "material_icon_name",
    "title": "Titolo breve e accattivante",
    "description": "Descrizione dettagliata dell'azione suggerita",
    "action": {
      "type": "navigate",
      "payload": {"view": "target_view", "context": {}}
    },
    "relevanceScore": numero_da_1_a_10_basato_sulla_rilevanza
  }
]

I suggerimenti devono essere:
- Personalizzati basati sui dati
- Azioni concrete e utili
- Con icona Material Design appropriata
- Con navigazione a view esistenti (es: 'studenti', 'evaluations', 'uda', 'progettazione-hub', 'calendario', 'analytics-hub')
- Ordinati per rilevanza decrescente

Rispondi solo con il JSON valido.`;
};

const parseAiResponse = (content: string): Array<AiSuggestion & { relevanceScore: number }> => {
    try {
        const cleaned = content.trim().replace(/```json\s*/i, '').replace(/```\s*$/, '');
        const parsed = JSON.parse(cleaned);

        if (!Array.isArray(parsed)) {
            throw new Error('Response is not an array');
        }

        return parsed.map(item => ({
            id: item.id || `suggestion_${Date.now()}_${Math.random()}`,
            icon: item.icon || 'lightbulb',
            title: item.title || 'Suggerimento',
            description: item.description || '',
            action: item.action || { type: 'navigate', payload: { view: 'home' } },
            relevanceScore: item.relevanceScore || 5
        }));
    } catch (error) {
        console.error('[aiSuggestionGenerator] Parse error:', error);
        return [];
    }
};

const scoreSuggestions = async (
    suggestions: Array<AiSuggestion & { relevanceScore: number }>,
    context: SuggestionContext
): Promise<Array<{ suggestion: AiSuggestion; score: number }>> => {
    // Use AI scoring for more accurate prioritization
    try {
        const scoringPrompt = `Valuta questi suggerimenti didattici per un docente italiano e assegna un punteggio da 1 a 10 basato su:
- Urgenza/rilevanza immediata
- Impatto potenziale sulla didattica
- Facilità di implementazione
- Allineamento con best practices scolastiche

Contesto docente:
- Studenti: ${context.studentCount}
- Attività recente: ${JSON.stringify(context.recentActivity)}

Suggerimenti da valutare:
${suggestions.map((s, i) => `${i + 1}. ${s.title}: ${s.description}`).join('\n')}

Rispondi con un array JSON di punteggi [score1, score2, ...]`;

        const response = await generateContent(scoringPrompt, {
            temperature: 0.3,
            maxTokens: 200
        });

        const scores = JSON.parse(response.content.trim());
        return suggestions.map((suggestion, i) => ({
            suggestion,
            score: scores[i] || suggestion.relevanceScore || 5
        }));
    } catch (error) {
        console.error('[aiSuggestionGenerator] Scoring error:', error);
        // Fallback to AI-provided scores
        return suggestions.map(s => ({
            suggestion: s,
            score: s.relevanceScore
        }));
    }
};

const getFallbackSuggestions = (appState: AppState): AiSuggestion[] => {
    // Fallback to system-like suggestions when AI fails
    const suggestions: AiSuggestion[] = [];

    if (appState.students.length === 0) {
        suggestions.push({
            id: 'fallback_import_students',
            icon: 'group_add',
            title: 'Aggiungi Studenti',
            description: 'Inizia importando i tuoi studenti per personalizzare l\'esperienza.',
            action: { type: 'navigate', payload: { view: 'studenti' } }
        });
    }

    if (Object.keys(appState.lessons).length === 0) {
        suggestions.push({
            id: 'fallback_create_lesson',
            icon: 'school',
            title: 'Crea Prima Lezione',
            description: 'Registra la tua prima lezione per iniziare a tracciare l\'attività didattica.',
            action: { type: 'navigate', payload: { view: 'timetable' } }
        });
    }

    if (appState.evaluations.length === 0) {
        suggestions.push({
            id: 'fallback_first_evaluation',
            icon: 'grade',
            title: 'Prima Valutazione',
            description: 'Inserisci la tua prima valutazione per monitorare il progresso degli studenti.',
            action: { type: 'navigate', payload: { view: 'evaluations' } }
        });
    }

    return suggestions.slice(0, 3); // Max 3 fallback suggestions
};