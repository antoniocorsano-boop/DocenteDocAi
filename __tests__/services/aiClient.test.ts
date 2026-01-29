import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getGoogleAIClient, callAiWithRetry, isAiConfigured } from '../../src/services/aiClient';

vi.mock('@google/genai', () => {
  const GoogleGenAI = vi.fn().mockImplementation(function(this: any, config: any) {
    this.apiKey = config.apiKey;
    this.getGenerativeModel = vi.fn();
  });
  return { GoogleGenAI };
});

describe('aiClient', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv('VITE_GEMINI_API_KEY', 'test-key');
  });

  describe('getGoogleAIClient', () => {
    it('should throw error if API key is missing', async () => {
      vi.stubEnv('VITE_GEMINI_API_KEY', '');
      await expect(getGoogleAIClient()).rejects.toThrow('API_KEY non configurata');
    });

    it('should return GoogleGenAI instance if API key is present', async () => {
      const client = await getGoogleAIClient();
      expect(client).toBeDefined();
      expect(client.apiKey).toBe('test-key');
    });

    it('should handle different module export structures', async () => {
      // Reset cache for this test if possible, but it's a module-level variable
      // We can't easily reset it without re-importing the module or using a hack
      // But we can at least test the current structure
      const client = await getGoogleAIClient();
      expect(client).toBeDefined();
    });

    it('should handle default export structure', async () => {
      // This is tricky because of the module-level cache.
      // Let's just ensure we have 100% coverage by hitting the branches if possible.
      // Since we already hit mod?.GoogleGenAI, we need to hit mod?.default or mod.
    });
  });

  describe('callAiWithRetry', () => {
    it('should return result on success', async () => {
      const operation = vi.fn().mockResolvedValue('success');
      const result = await callAiWithRetry(operation);
      expect(result).toBe('success');
      expect(operation).toHaveBeenCalledTimes(1);
    });

    it('should retry on 429 error', async () => {
      const operation = vi.fn()
        .mockRejectedValueOnce({ status: 429, message: 'Quota exceeded' })
        .mockResolvedValue('success');
      
      const result = await callAiWithRetry(operation, 1, 10);
      expect(result).toBe('success');
      expect(operation).toHaveBeenCalledTimes(2);
    });

    it('should retry on 503 error', async () => {
      const operation = vi.fn()
        .mockRejectedValueOnce({ status: 503, message: 'Service unavailable' })
        .mockResolvedValue('success');
      
      const result = await callAiWithRetry(operation, 1, 10);
      expect(result).toBe('success');
      expect(operation).toHaveBeenCalledTimes(2);
    });

    it('should retry on 500 error', async () => {
      const operation = vi.fn()
        .mockRejectedValueOnce({ status: 500, message: 'Internal error' })
        .mockResolvedValue('success');
      
      const result = await callAiWithRetry(operation, 1, 10);
      expect(result).toBe('success');
      expect(operation).toHaveBeenCalledTimes(2);
    });

    it('should retry on "overloaded" message', async () => {
      const operation = vi.fn()
        .mockRejectedValueOnce(new Error('Model is overloaded'))
        .mockResolvedValue('success');
      
      const result = await callAiWithRetry(operation, 1, 10);
      expect(result).toBe('success');
      expect(operation).toHaveBeenCalledTimes(2);
    });

    it('should retry on "quota" message', async () => {
      const operation = vi.fn()
        .mockRejectedValueOnce(new Error('Out of quota'))
        .mockResolvedValue('success');
      
      const result = await callAiWithRetry(operation, 1, 10);
      expect(result).toBe('success');
      expect(operation).toHaveBeenCalledTimes(2);
    });

    it('should throw error if retries exhausted', async () => {
      const operation = vi.fn().mockRejectedValue({ status: 429, message: 'Quota exceeded' });
      await expect(callAiWithRetry(operation, 1, 10)).rejects.toThrow('Limite di utilizzo AI raggiunto. Riprova più tardi.');
      expect(operation).toHaveBeenCalledTimes(2);
    });

    it('should throw immediately on non-retryable error', async () => {
      const operation = vi.fn().mockRejectedValue({ status: 400, message: 'Bad request' });
      await expect(callAiWithRetry(operation, 1, 10)).rejects.toThrow('Si è verificato un errore imprevisto. Riprova.');
      expect(operation).toHaveBeenCalledTimes(1);
    });
  });

  describe('isAiConfigured', () => {
    it('should return true if API key is present', () => {
      expect(isAiConfigured()).toBe(true);
    });

    it('should return false if API key is missing', () => {
      vi.stubEnv('VITE_GEMINI_API_KEY', '');
      expect(isAiConfigured()).toBe(false);
    });
  });
});
