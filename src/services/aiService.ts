import { GoogleGenAI, Type } from "@google/genai";
import { AiSettings, Lezione, Uda, Valutazione, ValutazioneCompetenza, Competenza, Studente, Livello, KnowledgeBaseEntry, AiSuggestion, PianoInclusione, CircularAnalysisResult, EventoCalendario, ChatMessage, GeneratedQuiz, LessonAnalysisResult, CurriculumSubject, TechnicalDocumentContent, EssayContent } from '../types';
import { getGoogleAIClient, callAiWithRetry } from './aiClient';
import * as Prompts from './aiPrompts';

const SYSTEM_PERSONA_TEACHER = `SEI UN ASSISTANTE DIDATTICO ESPERTO (Target: Scuola Italiana).
RUOLO: Pedagogista digitale, esperto in normative MIUR, didattica per competenze e inclusione (BES/DSA).
FORMATO: Rispetta rigorosamente i formati richiesti (JSON/Markdown).`;

export const buildSystemInstruction = (
    userContext?: { classContext?: string; subject?: string; schoolType?: string; teacherName?: string },
    systemInstructionOverride?: string
): string => {
    let persona = systemInstructionOverride || SYSTEM_PERSONA_TEACHER;
    if (userContext) {
        if (userContext.classContext) persona += `\nClasse Target: ${String(userContext.classContext)}`;
        if (userContext.subject) persona += `\nMateria: ${String(userContext.subject)}`;
    }
    return persona;
};

export const cleanAndParseJson = <T>(text: string): T => {
    let cleanedText = text.trim();
    const match = cleanedText.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
    if (match && match[1]) {
        cleanedText = match[1].trim();
    } else {
        const firstBrace = cleanedText.indexOf('{');
        const firstBracket = cleanedText.indexOf('[');
        let startIndex = -1;
        if (firstBrace !== -1 && (firstBracket === -1 || firstBrace < firstBracket)) startIndex = firstBrace;
        else if (firstBracket !== -1) startIndex = firstBracket;
        if (startIndex !== -1) {
            const lastBrace = cleanedText.lastIndexOf('}');
            const lastBracket = cleanedText.lastIndexOf(']');
            const endIndex = Math.max(lastBrace, lastBracket);
            if (endIndex > startIndex) cleanedText = cleanedText.substring(startIndex, endIndex + 1);
        }
    }
    try {
        return JSON.parse(cleanedText) as T;
    } catch (e) {
        throw new Error("Il formato della risposta AI non è valido. Riprova.");
    }
};

// --- CORE FUNCTIONS (FIXED & EXPORTED) ---

export const analyzeCircularDocument = async (aiSettings: AiSettings, source: { fileContent?: string }): Promise<CircularAnalysisResult> => {
    return callAiWithRetry(async () => {
        const ai = await getGoogleAIClient();
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: Prompts.getCircularAnalysisPrompt(source.fileContent || '', new Date().toISOString()), // FIX: Ensure content is a string.
            config: { responseMimeType: 'application/json', systemInstruction: buildSystemInstruction() }
        });
        return cleanAndParseJson<CircularAnalysisResult>(response.text || '{}');
    });
};

export const performWebSearch = async (aiSettings: AiSettings, query: string): Promise<{ text: string; sources: { title: string; uri: string }[] }> => {
    return callAiWithRetry(async () => {
        const ai = await getGoogleAIClient();
        const response = await ai.models.generateContent({
            model: aiSettings?.model || 'gemini-3-flash-preview',
            contents: String(query),
            config: { tools: [{ googleSearch: {} }] }
        });
        const sources: { title: string; uri: string }[] = [];
        if (response.candidates?.[0]?.groundingMetadata?.groundingChunks) {
            response.candidates[0].groundingMetadata.groundingChunks.forEach((chunk: any) => {
                if (chunk.web?.uri && chunk.web?.title) sources.push({ title: chunk.web.title, uri: chunk.web.uri });
            });
        }
        return { text: response.text || 'No sources found.', sources };
    });
};

export const getLessonSuggestion = async (aiSettings: AiSettings, context: any): Promise<Partial<Lezione>> => {
    return callAiWithRetry(async () => {
        const ai = await getGoogleAIClient();
        const response = await ai.models.generateContent({
            model: aiSettings?.model || 'gemini-3-flash-preview',
            contents: Prompts.getLessonSuggestionPrompt(context),
            config: { responseMimeType: 'application/json' }
        });
        try {
            return cleanAndParseJson(response.text || '{}');
        } catch {
            return { contenuto: "L'AI non ha fornito una risposta valida." };
        }
    });
};

export const analyzeLessonPedagogy = async (aiSettings: AiSettings, lesson: any): Promise<LessonAnalysisResult> => {
    return callAiWithRetry(async () => {
        const ai = await getGoogleAIClient();
        const response = await ai.models.generateContent({
            model: "gemini-3-pro-preview",
            contents: Prompts.getPedagogicalAnalysisPrompt(lesson), // FIX: Ensure content is a string.
            config: { responseMimeType: "application/json", systemInstruction: buildSystemInstruction() }
        });
        return cleanAndParseJson<LessonAnalysisResult>(response.text || '{}');
    });
};

export const generateLessonFromIdea = async (aiSettings: AiSettings, ideaText: string, targetClass: string, kbContent?: string): Promise<{ title: string; htmlContent: string }> => {
    return callAiWithRetry(async () => {
        const ai = await getGoogleAIClient();
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: Prompts.getLessonFromIdeaPrompt(ideaText, kbContent), // FIX: Ensure content is a string.
            config: { responseMimeType: 'application/json', systemInstruction: buildSystemInstruction({ classContext: targetClass }) }
        });
        return cleanAndParseJson(response.text || '{}');
    });
};

export const generateSituazionePartenza = async (aiSettings: AiSettings, params: any) => {
    return callAiWithRetry(async () => {
        const ai = await getGoogleAIClient();
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: `Analisi situazione partenza per classe ${String(params.classe)}. Tags: ${params.tags.join(',')}`, // FIX: Ensure content is a string.
            config: { systemInstruction: buildSystemInstruction() }
        });
        return response.text || "";
    });
};

export const generateMethodologyStrategies = async (aiSettings: AiSettings, ctx: string) => {
    return callAiWithRetry(async () => {
        const ai = await getGoogleAIClient();
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Suggerisci metodologie per: ${ctx}`, // FIX: Ensure content is a string.
            config: { systemInstruction: buildSystemInstruction() }
        });
        return response.text || "";
    });
};

export const suggestAnnualPlan = async (aiSettings: AiSettings, kb: string, subj: string, cls: string) => {
    return callAiWithRetry(async () => {
        const ai = await getGoogleAIClient();
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: `Genera piano annuale UDA da:\n${kb}`, // FIX: Ensure content is a string.
            config: { responseMimeType: "application/json", systemInstruction: buildSystemInstruction({ classContext: cls, subject: subj }) }
        });
        return cleanAndParseJson<any[]>(response.text || '[]');
    });
};

export const generateClassPlanningDocument = async (aiSettings: AiSettings, data: any): Promise<string> => {
    return callAiWithRetry(async () => {
        const ai = await getGoogleAIClient();
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: `Genera documento programmazione: ${JSON.stringify(data)}`, // FIX: Ensure content is a string.
            config: { systemInstruction: buildSystemInstruction() }
        });
        return response.text || "";
    });
};

export const generateAnswerFromCorpus = async (aiSettings: AiSettings, corpus: string, q: string): Promise<ChatMessage> => {
    return callAiWithRetry(async () => {
        const ai = await getGoogleAIClient();
        const r = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Rispondi a: ${q}\n\nFonti:\n${corpus}`, // FIX: Ensure content is a string.
            config: { systemInstruction: buildSystemInstruction() }
        });
        return { role: 'model', text: r.text || "" };
    });
};

export const generateTechnicalDocumentContent = async (aiSettings: AiSettings): Promise<TechnicalDocumentContent | null> => {
    return callAiWithRetry(async () => {
        const ai = await getGoogleAIClient();
        const r = await ai.models.generateContent({
            model: "gemini-3-pro-preview",
            contents: "Genera schema tecnico JSON per manuale", // FIX: Ensure content is a string.
            config: { responseMimeType: "application/json" }
        });
        return cleanAndParseJson<TechnicalDocumentContent>(r.text || '{}');
    });
};

export const generateAcademicEssayContent = async (aiSettings: AiSettings): Promise<EssayContent | null> => {
    return callAiWithRetry(async () => {
        const ai = await getGoogleAIClient();
        const r = await ai.models.generateContent({
            model: "gemini-3-pro-preview",
            contents: "Genera saggio accademico JSON su innovazione", // FIX: Ensure content is a string.
            config: { responseMimeType: "application/json" }
        });
        return cleanAndParseJson<EssayContent>(r.text || '{}');
    });
};

export const getPeriodicJudgmentSuggestion = async (aiSettings: AiSettings, s: Studente, per: string, evals: Valutazione[], cEvals: ValutazioneCompetenza[], comps: Competenza[]) => {
    return callAiWithRetry(async () => {
        const ai = await getGoogleAIClient();
        const r = await ai.models.generateContent({
            model: "gemini-3-pro-preview",
            contents: `Scrivi giudizio sintetico ${String(per)} per ${String(s.cognome)}`  // FIX: Ensure content is a string.
        });
        return r.text || "";
    });
};

export const generateMarkdownReport = async (aiSettings: AiSettings, type: string, data: any) => {
    return callAiWithRetry(async () => {
        const ai = await getGoogleAIClient();
        const r = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: `Crea report professionale markdown per ${String(type)}`  // FIX: Ensure content is a string.
        });
        return r.text || "";
    });
};

export const validateUdaVerticalCurriculum = async (aiSettings: AiSettings, uda: Uda, kb: KnowledgeBaseEntry[]) => {
    return callAiWithRetry(async () => {
        const ai = await getGoogleAIClient();
        const r = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: `Valida coerenza UDA ${String(uda.title)}`  // FIX: Ensure content is a string.
        });
        return r.text || "";
    });
};

export const generateLessonSequenceForClass = async (aiSettings: AiSettings, udas: Uda[], cls: string, kb: string) => {
    return callAiWithRetry(async () => {
        const ai = await getGoogleAIClient();
        const r = await ai.models.generateContent({
            model: "gemini-3-pro-preview",
            contents: `Crea sequenza lezioni strutturata`,  // FIX: Ensure content is a string.
            config: { responseMimeType: "application/json" }
        });
        return cleanAndParseJson<any[]>(r.text || '[]');
    });
};

export const getPIPSuggestion = async (aiSettings: AiSettings, s: Studente, evals: Valutazione[], cEvals: ValutazioneCompetenza[], comps: Competenza[], sec: string) => {
    return callAiWithRetry(async () => {
        const ai = await getGoogleAIClient();
        const r = await ai.models.generateContent({
            model: "gemini-3-pro-preview",
            contents: `Suggerimento PDP sezione ${String(sec)} per ${String(s.cognome)}`  // FIX: Ensure content is a string.
        });
        return r.text || "";
    });
};

export const generateCompetencyNote = async (aiSettings: AiSettings, s: Studente, c: Competenza, l: Livello) => {
    return callAiWithRetry(async () => {
        const ai = await getGoogleAIClient();
        const r = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Nota competenza ${String(c.nome)} per ${String(s.cognome)}`  // FIX: Ensure content is a string.
        });
        return r.text || "";
    });
};

export const getAIPedagogicalAdvice = async (aiSettings: AiSettings, data: any, type: string, comps: Competenza[]) => {
    return callAiWithRetry(async () => {
        const ai = await getGoogleAIClient();
        const r = await ai.models.generateContent({
            model: "gemini-3-pro-preview",
            contents: `Consiglio pedagogico ${String(type)}`,  // FIX: Ensure content is a string.
            config: { responseMimeType: "application/json" }
        });
        return cleanAndParseJson<any>(r.text || '{}');
    });
};

export const generateFormattedDocument = async (aiSettings: AiSettings, corpus: string, prompt: string) => {
    return callAiWithRetry(async () => {
        const ai = await getGoogleAIClient();
        const r = await ai.models.generateContent({
            model: "gemini-3-pro-preview",
            contents: String(prompt)  // FIX: Ensure content is a string.
        });
        return r.text || "";
    });
};

export const generateQuiz = async (aiSettings: AiSettings, corpus: string, config: any) => {
    return callAiWithRetry(async () => {
        const ai = await getGoogleAIClient();
        const r = await ai.models.generateContent({
            model: "gemini-3-pro-preview",
            contents: "Genera quiz didattico", // FIX: Ensure content is a string.
            config: { responseMimeType: "application/json" }
        });
        return cleanAndParseJson<GeneratedQuiz>(r.text || '{}');
    });
};

export const generateStudioOutput = async (aiSettings: AiSettings, corpus: string, task: string) => {
    return callAiWithRetry(async () => {
        const ai = await getGoogleAIClient();
        const r = await ai.models.generateContent({
            model: "gemini-3-pro-preview",
            contents: String(task)  // FIX: Ensure content is a string.
        });
        return r.text || "";
    });
};

export const addContextToLesson = async (aiSettings: AiSettings, lesson: any) => {
    return callAiWithRetry(async () => {
        const ai = await getGoogleAIClient();
        const r = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Arricchisci lezione`  // FIX: Ensure content is a string.
        });
        return r.text || "";
    });
};

export const generateInclusivityAdaptations = async (aiSettings: AiSettings, ctx: any, piani: any[]) => {
    return callAiWithRetry(async () => {
        const ai = await getGoogleAIClient();
        const r = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Adattamenti inclusivi`  // FIX: Ensure content is a string.
        });
        return r.text || "";
    });
};

export const getProactiveSuggestions = async (aiSettings: AiSettings, state: any): Promise<AiSuggestion[]> => {
    return callAiWithRetry(async () => {
        const ai = await getGoogleAIClient();
        const r = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: "Analisi proattiva sistema",  // FIX: Ensure content is a string.
            config: { responseMimeType: "application/json" }
        });
        return cleanAndParseJson<AiSuggestion[]>(r.text || '[]');
    });
};

export const generateThemeFromPrompt = async (aiSettings: AiSettings, p: string) => {
    return callAiWithRetry(async () => {
        const ai = await getGoogleAIClient();
        const r = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: String(p),  // FIX: Ensure content is a string.
            config: { responseMimeType: "application/json" }
        });
        return cleanAndParseJson<any>(r.text || '{}');
    });
};

export const generateImageFromPrompt = async (aiSettings: AiSettings, p: string) => {
    return callAiWithRetry(async () => {
        const ai = await getGoogleAIClient();
        const r = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: { parts: [{ text: String(p) }] }  // FIX: Ensure content is a string.
        });
        if (r.candidates?.[0]?.content?.parts) {
            for (const part of r.candidates[0].content.parts) {
                if (part.inlineData) return { data: part.inlineData.data || '', mimeType: part.inlineData.mimeType || 'image/png' };
            }
        }
        throw new Error("Immagine non generata");
    });
};

export const extractEventFromText = async (aiSettings: AiSettings, t: string) => {
    return callAiWithRetry(async () => {
        const ai = await getGoogleAIClient();
        const r = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: String(t),  // FIX: Ensure content is a string.
            config: { responseMimeType: "application/json" }
        });
        return cleanAndParseJson<any>(r.text || '{}');
    });
};

export const refactorProgrammazione = async (aiSettings: AiSettings, t: string) => {
    return callAiWithRetry(async () => {
        const ai = await getGoogleAIClient();
        const r = await ai.models.generateContent({
            model: "gemini-3-pro-preview",
            contents: String(t)  // FIX: Ensure content is a string.
        });
        return r.text || "";
    });
};

export const analyzeImage = async (aiSettings: AiSettings, img: string, p: string) => {
    return callAiWithRetry(async () => {
        const ai = await getGoogleAIClient();
        if (!img.includes(',')) throw new Error("Invalid image data URL provided for analysis.");
        const base64Data = img.split(',')[1];
        const mimeTypeMatch = img.match(/^data:(.*?);base64,/);
        const mimeType = mimeTypeMatch ? mimeTypeMatch[1] : 'image/jpeg'; // Default to jpeg if not found

        const r = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: { parts: [{ inlineData: { data: base64Data, mimeType: mimeType } }, { text: String(p) }] }  // FIX: Ensure content is a string.
        });
        return r.text || "";
    });
};

export const parseCurriculumFromText = async (aiSettings: AiSettings, t: string, s: string, g: string) => {
    return callAiWithRetry(async () => {
        const ai = await getGoogleAIClient();
        const r = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: String(t),  // FIX: Ensure content is a string.
            config: { responseMimeType: "application/json" }
        });
        return cleanAndParseJson<CurriculumSubject>(r.text || '{}');
    });
};

export const refineTextWithAi = async (aiSettings: AiSettings, t: string, i: string) => {
    return callAiWithRetry(async () => {
        const ai = await getGoogleAIClient();
        const r = await ai.models.generateContent({
            model: "gemini-3-pro-preview",
            contents: String(i) + "\n\nTEXT:\n" + String(t)  // FIX: Ensure content is a string.
        });
        return r.text || "";
    });
};

export const generateDocumentTable = async (aiSettings: AiSettings, d: string) => {
    return callAiWithRetry(async () => {
        const ai = await getGoogleAIClient();
        const r = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Genera una tabella HTML basata sulla seguente descrizione: ${String(d)}. La tabella dovrebbe essere ben formattata e usare i tag <table>, <thead>, <tbody>, <tr>, <th>, <td>.`  // FIX: Ensure content is a string.
        });
        return r.text || "";
    });
};

export const discoverAndCreateFeed = async (url: string) => { throw new Error("RSS Disabilitato."); };
export const fetchAndParseRssFeed = async (url: string) => { throw new Error("RSS Disabilitato."); };

export const generateClassCouncilNarrativeReport = async (aiSettings: AiSettings, data: any): Promise<string> => {
    return callAiWithRetry(async () => {
        const ai = await getGoogleAIClient();
        const prompt = `Genera un report narrativo per il consiglio di classe basato sui seguenti dati: ${JSON.stringify(data)}. 
        Il report deve essere formale, professionale e pronto per essere inserito in un verbale di scrutinio o consiglio di classe.`;

        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: String(prompt), // FIX: Ensure content is a string.
            config: {
                systemInstruction: "Sei un esperto segretario di un consiglio di classe della scuola italiana, esperto in redazione di verbali e analisi pedagogiche."
            }
        });
        return response.text || "";
    });
};
