
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
