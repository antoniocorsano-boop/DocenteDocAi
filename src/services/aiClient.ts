
import { GoogleGenAI } from "@google/genai";

/**
 * Inizializza il client Google GenAI.
 * Seguendo le istruzioni di sistema:
 * - Usa ESCLUSIVAMENTE process.env.API_KEY.
 * - Non genera UI per l'inserimento della chiave.
 * - Utilizza il parametro nominato { apiKey }.
 */
export const getGoogleAIClient = (): GoogleGenAI => {
    // Vite uses import.meta.env for environment variables. 
    // We expect VITE_GEMINI_API_KEY to be defined in .env.local
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

    if (!apiKey) {
        throw new Error('API_KEY non configurata. Assicurati che VITE_GEMINI_API_KEY sia presente in .env.local.');
    }

    return new GoogleGenAI({ apiKey });
};

/**
 * Esegue un'operazione AI con logica di Retry (Exponential Backoff).
 */
export async function callAiWithRetry<T>(operation: () => Promise<T>, retries = 3, delay = 1000): Promise<T> {
    try {
        return await operation();
    } catch (error: any) {
        const isRetryable =
            error?.status === 429 ||
            error?.status === 503 ||
            error?.status === 500 ||
            error?.message?.includes('overloaded') ||
            error?.message?.includes('quota');

        if (retries > 0 && isRetryable) {
            console.warn(`AI API Warning: ${error.message}. Riprovo tra ${delay}ms...`);
            await new Promise(res => setTimeout(res, delay));
            return callAiWithRetry(operation, retries - 1, delay * 2);
        }
        throw error;
    }
}

export const isAiConfigured = (): boolean => !!import.meta.env.VITE_GEMINI_API_KEY;
