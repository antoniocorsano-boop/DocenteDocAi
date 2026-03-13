import { logger } from '../utils/logger';

type GenAIModule = { GoogleGenAI?: new (opts: { apiKey: string }) => unknown; default?: unknown };
type GoogleAIClient = { models: { generateContent: (params: { model: string; contents: unknown; config?: unknown }) => Promise<{ text: string }> } };

// ---------------------------------------------------------------------------
// Proxy client — used in production when VITE_GEMINI_API_KEY is not bundled.
// Calls /api/ai (Vercel serverless function) which holds the key server-side.
// ---------------------------------------------------------------------------
const createProxyClient = () => ({
    models: {
        generateContent: async (params: {
            model: string;
            contents: unknown;
            config?: unknown;
        }): Promise<{ text: string }> => {
            const response = await fetch('/api/ai', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(params),
            });
            if (!response.ok) {
                const err = await response.json().catch(() => ({ error: response.statusText }));
                throw Object.assign(new Error(err.error ?? 'AI proxy error'), { status: response.status });
            }
            return response.json();
        },
    },
});

// Lazy-load the Google GenAI SDK to avoid bundling it in the main chunk
let _cachedGenAiModule: GenAIModule | null = null;
export const getGoogleAIClient = async (): Promise<GoogleAIClient> => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

    // Production path: no key in bundle → use server-side proxy
    if (!apiKey) {
        return createProxyClient();
    }

    // Dev path: key available locally → use SDK directly
    if (!_cachedGenAiModule) {
        _cachedGenAiModule = await import('@google/genai');
    }
    const mod = _cachedGenAiModule as GenAIModule;
    const GoogleGenAI = mod?.GoogleGenAI || (mod?.default as (new (opts: { apiKey: string }) => GoogleAIClient) | undefined);
    return new (GoogleGenAI as new (opts: { apiKey: string }) => GoogleAIClient)({ apiKey });
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
        } catch (error: unknown) {
            const elapsed = Date.now() - startTime;
            if (elapsed >= maxTotalTimeMs) {
                throw new Error('Tempo totale di retry superato. Riprova più tardi.');
            }

            let isRetryable = false;
            let userMessage = 'Si è verificato un errore imprevisto. Riprova.';
            const err = error as { status?: number; message?: string };

            if (err?.status === 429 || err?.message?.includes('quota')) {
                userMessage = 'Limite di utilizzo AI raggiunto. Riprova più tardi.';
                isRetryable = true;
            } else if (err?.status === 503 || err?.status === 500 || err?.message?.includes('overloaded')) {
                userMessage = 'Servizio AI temporaneamente non disponibile. Riprova.';
                isRetryable = true;
            } else if (err?.message?.includes('Richiesta AI scaduta') || err?.message?.includes('troppo tempo')) {
                userMessage = 'La richiesta AI ha impiegato troppo tempo. Riprova più tardi.';
                isRetryable = true;
            } else if (err?.message?.includes('API_KEY')) {
                userMessage = 'Configurazione AI non valida. Contatta il supporto.';
                isRetryable = false;
            }

        if (remainingRetries > 0 && isRetryable) {
            if (import.meta.env.DEV) {
                logger.warn(`AI API Warning: ${err.message}. Riprovo tra ${currentDelay}ms...`);
            }
            await new Promise(res => setTimeout(res, currentDelay));
            return attempt(remainingRetries - 1, currentDelay * 2);
        }

            throw new Error(userMessage);
        }
    };

    return attempt(retries, delay);
}

// In dev: check direct key. In production: proxy always available if deployed.
export const isAiConfigured = (): boolean =>
    !!import.meta.env.VITE_GEMINI_API_KEY || !import.meta.env.DEV;

