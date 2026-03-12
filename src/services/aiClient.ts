import { logger } from '../utils/logger';

/* eslint-disable @typescript-eslint/no-explicit-any */
// Lazy-load the Google GenAI SDK to avoid bundling it in the main chunk
let _cachedGenAiModule: any = null;
export const getGoogleAIClient = async (): Promise<any> => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
        throw new Error('API_KEY non configurata. Assicurati che VITE_GEMINI_API_KEY sia presente in .env.local.');
    }

    if (!_cachedGenAiModule) {
        _cachedGenAiModule = await import('@google/genai');
    }
    const mod = _cachedGenAiModule;
    const GoogleGenAI = mod?.GoogleGenAI || mod?.default || mod;
    return new GoogleGenAI({ apiKey });
};

/**
 * Esegue un'operazione AI con logica di Retry (Exponential Backoff), Timeout e limite tempo totale.
 */
export async function callAiWithRetry<T>(operation: () => Promise<T>, retries = 3, delay = 1000, timeoutMs = 30000, maxTotalTimeMs = 60000): Promise<T> {
    const startTime = Date.now();

    const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('La richiesta AI ha impiegato troppo tempo. Riprova più tardi.')), timeoutMs)
    );

    const operationWithTimeout = async (): Promise<T> => {
        return Promise.race([operation(), timeoutPromise]);
    };

    const attempt = async (remainingRetries: number, currentDelay: number): Promise<T> => {
        try {
            return await operationWithTimeout();
        } catch (error: any) {
            const elapsed = Date.now() - startTime;
            if (elapsed >= maxTotalTimeMs) {
                throw new Error('Tempo totale di retry superato. Riprova più tardi.');
            }

            let isRetryable = false;
            let userMessage = 'Si è verificato un errore imprevisto. Riprova.';

            if (error?.status === 429 || error?.message?.includes('quota')) {
                userMessage = 'Limite di utilizzo AI raggiunto. Riprova più tardi.';
                isRetryable = true;
            } else if (error?.status === 503 || error?.status === 500 || error?.message?.includes('overloaded')) {
                userMessage = 'Servizio AI temporaneamente non disponibile. Riprova.';
                isRetryable = true;
            } else if (error?.message?.includes('Richiesta AI scaduta') || error?.message?.includes('troppo tempo')) {
                userMessage = 'La richiesta AI ha impiegato troppo tempo. Riprova più tardi.';
                isRetryable = true;
            } else if (error?.message?.includes('API_KEY')) {
                userMessage = 'Configurazione AI non valida. Contatta il supporto.';
                isRetryable = false;
            }

        if (remainingRetries > 0 && isRetryable) {
            if (import.meta.env.DEV) {
                logger.warn(`AI API Warning: ${error.message}. Riprovo tra ${currentDelay}ms...`);
            }
            await new Promise(res => setTimeout(res, currentDelay));
            return attempt(remainingRetries - 1, currentDelay * 2);
        }

            throw new Error(userMessage);
        }
    };

    return attempt(retries, delay);
}

export const isAiConfigured = (): boolean => !!import.meta.env.VITE_GEMINI_API_KEY;

