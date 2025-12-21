
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { cleanAndParseJson, getLessonSuggestion, analyzeImage, performWebSearch } from '../../services/aiService';
import { getGoogleAIClient } from '../../services/aiClient';
import { AiSettings, Lezione, KnowledgeBaseEntry, PianoInclusione, Competenza } from '../../types';
import { GoogleGenAI } from '@google/genai';

// Mock del modulo aiClient per isolare i test dalle chiamate API reali
vi.mock('../../services/aiClient', () => ({
  getGoogleAIClient: vi.fn<() => GoogleGenAI>(),
}));

// Mock del modulo aiService per le funzioni di tool calling
vi.mock('../../services/aiService', async (importActual) => {
  const actual = await importActual() as typeof import('../../services/aiService');
  return {
    ...actual,
    performWebSearch: vi.fn(),
    cleanAndParseJson: vi.fn(actual.cleanAndParseJson), // Re-export actual cleanAndParseJson as a mock spy
  };
});

describe('aiService - cleanAndParseJson', () => {
  it('dovrebbe parsare un JSON semplice', () => {
    const jsonString = '{"key": "value"}';
    expect(cleanAndParseJson(jsonString)).toEqual({ key: 'value' });
  });

  it('dovrebbe parsare un JSON racchiuso in un blocco markdown', () => {
    const jsonString = '```json\n{"key": "value"}\n```';
    expect(cleanAndParseJson(jsonString)).toEqual({ key: 'value' });
  });

  it('dovrebbe parsare un JSON racchiuso in un blocco markdown senza specificare "json"', () => {
    const jsonString = '```\n{"key": "value"}\n```';
    expect(cleanAndParseJson(jsonString)).toEqual({ key: 'value' });
  });

  it('dovrebbe parsare un JSON con testo extra prima e dopo', () => {
    const jsonString = 'Some text before. {"key": "value"} text after.';
    expect(cleanAndParseJson(jsonString)).toEqual({ key: 'value' });
  });

  it('dovrebbe parsare un array JSON', () => {
    const jsonString = '[{"item": 1}, {"item": 2}]';
    expect(cleanAndParseJson(jsonString)).toEqual([{ item: 1 }, { item: 2 }]);
  });

  it('dovrebbe lanciare un errore per JSON non valido', () => {
    const jsonString = '{"key": "value"';
    expect(() => cleanAndParseJson(jsonString)).toThrow("Il formato della risposta AI non è valido. Riprova.");
  });

  it('dovrebbe lanciare un errore per JSON vuoto', () => {
    const jsonString = '';
    expect(() => cleanAndParseJson(jsonString)).toThrow("Il formato della risposta AI non è valido. Riprova.");
  });
});

describe('aiService - AI Generation Functions', () => {
  const mockGenerateContent = vi.fn();
  const mockAiClient = {
    models: {
      generateContent: mockGenerateContent,
    },
  };

  const mockAiSettings: AiSettings = { model: 'gemini-2.5-flash' };

  beforeEach(() => {
    // Corrected: Cast getGoogleAIClient to vi.Mock without redundant type arguments.
    (getGoogleAIClient as vi.Mock).mockReturnValue(mockAiClient);
    mockGenerateContent.mockClear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('getLessonSuggestion', () => {
    const mockLessonContext = {
      classe: '3A',
      materia: 'Storia',
      existingLessonsInUda: [],
      allCompetenze: [],
      topic: 'Rivoluzione Francese',
      pianiInclusione: [],
    };

    it('dovrebbe generare un suggerimento di lezione correttamente', async () => {
      const mockApiResponse = { text: '{"contenuto": "La Rivoluzione", "tipoLezione": "Teoria", "obiettivi": "- Obiettivo 1", "compiti": "Studio pp. 1-10", "adattamenti": ""}' };
      mockGenerateContent.mockResolvedValue(mockApiResponse);

      const result = await getLessonSuggestion(mockAiSettings, mockLessonContext);

      expect(mockGenerateContent).toHaveBeenCalledTimes(1);
      expect(mockGenerateContent).toHaveBeenCalledWith(
        expect.objectContaining({
          model: mockAiSettings.model,
          contents: expect.any(String),
          config: { responseMimeType: 'application/json' },
        })
      );
      expect(result).toEqual({ contenuto: 'La Rivoluzione', tipoLezione: 'Teoria', obiettivi: '- Obiettivo 1', compiti: 'Studio pp. 1-10', adattamenti: '' });
    });

    it('dovrebbe gestire risposte AI non valide per i suggerimenti di lezione', async () => {
      mockGenerateContent.mockResolvedValue({ text: 'Testo non JSON' });

      const result = await getLessonSuggestion(mockAiSettings, mockLessonContext);

      expect(result).toEqual({ contenuto: "L'AI non ha fornito una risposta valida." });
    });
  });

  describe('analyzeImage', () => {
    it('dovrebbe analizzare un\'immagine con un prompt', async () => {
      const mockImageDataUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
      const mockPrompt = 'Cosa c\'è in questa immagine?';
      const mockApiResponse = { text: 'Una singola immagine a pixel.' };
      mockGenerateContent.mockResolvedValue(mockApiResponse);

      const result = await analyzeImage(mockAiSettings, mockImageDataUrl, mockPrompt);

      expect(mockGenerateContent).toHaveBeenCalledTimes(1);
      expect(mockGenerateContent).toHaveBeenCalledWith(
        expect.objectContaining({
          model: 'gemini-2.5-flash',
          contents: {
            parts: [
              { inlineData: { data: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=', mimeType: 'image/png' } },
              { text: mockPrompt },
            ],
          },
        })
      );
      expect(result).toBe('Una singola immagine a pixel.');
    });

    it('dovrebbe lanciare un errore per URL immagine non valido', async () => {
      await expect(analyzeImage(mockAiSettings, 'invalid-data-url', 'prompt')).rejects.toThrow('Invalid image data URL provided for analysis.');
    });
  });

  describe('performWebSearch', () => {
    it('dovrebbe eseguire una ricerca web e estrarre le fonti', async () => {
      const mockQuery = 'ultime normative GDPR scuola';
      const mockApiResponse = {
        text: 'Sintesi delle normative GDPR.',
        candidates: [{
          groundingMetadata: {
            groundingChunks: [
              { web: { uri: 'http://example.com/doc1', title: 'Doc 1' } },
              { web: { uri: 'http://example.com/doc2', title: 'Doc 2' } },
            ],
          },
        }],
      };
      mockGenerateContent.mockResolvedValue(mockApiResponse);

      const result = await performWebSearch(mockAiSettings, mockQuery);

      expect(mockGenerateContent).toHaveBeenCalledTimes(1);
      expect(mockGenerateContent).toHaveBeenCalledWith(
        expect.objectContaining({
          model: 'gemini-2.5-flash',
          contents: expect.any(String),
          config: {
            tools: [{ googleSearch: {} }],
          },
        })
      );
      expect(result.text).toBe('Sintesi delle normative GDPR.');
      expect(result.sources).toEqual([
        { title: 'Doc 1', uri: 'http://example.com/doc1' },
        { title: 'Doc 2', uri: 'http://example.com/doc2' },
      ]);
    });

    it('dovrebbe restituire nessuna fonte se groundingMetadata è assente', async () => {
      const mockQuery = 'query';
      const mockApiResponse = { text: 'No sources found.' };
      mockGenerateContent.mockResolvedValue(mockApiResponse);

      const result = await performWebSearch(mockAiSettings, mockQuery);

      expect(result.sources).toEqual([]);
      expect(result.text).toBe('No sources found.');
    });
  });
});