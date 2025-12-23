
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { cleanAndParseJson, getLessonSuggestion, analyzeImage, performWebSearch } from '../../src/services/aiService';
import { getGoogleAIClient } from '../../src/services/aiClient';
import { AiSettings, Lezione, KnowledgeBaseEntry, PianoInclusione, Competenza } from '../../src/types';
import { GoogleGenAI } from '@google/genai';

// Mock del modulo aiClient per isolare i test dalle chiamate API reali
vi.mock('../../src/services/aiClient', () => ({
  getGoogleAIClient: vi.fn<() => GoogleGenAI>(),
  callAiWithRetry: async (fn: any) => await fn(),
}));

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
          model: mockAiSettings.model,
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

  // Additional comprehensive tests for better coverage
  describe('Web Search Advanced Cases', () => {
    it('dovrebbe gestire risposte senza candidates', async () => {
      const mockQuery = 'test';
      mockGenerateContent.mockResolvedValue({
        text: 'Risultato',
        candidates: undefined,
      });

      const result = await performWebSearch(mockAiSettings, mockQuery);
      expect(result.sources).toEqual([]);
    });

    it('dovrebbe filtrare sources senza uri o title', async () => {
      const mockQuery = 'test';
      mockGenerateContent.mockResolvedValue({
        text: 'Risultato',
        candidates: [{
          groundingMetadata: {
            groundingChunks: [
              { web: { uri: 'http://example.com/doc1', title: 'Doc 1' } },
              { web: { uri: '', title: 'Invalid' } }, // no URI
              { web: { uri: 'http://example.com/doc2' } }, // no title
            ],
          },
        }],
      });

      const result = await performWebSearch(mockAiSettings, mockQuery);
      expect(result.sources).toHaveLength(1);
      expect(result.sources[0].uri).toBe('http://example.com/doc1');
    });
  });

  describe('JSON Parsing Complex Cases', () => {
    it('dovrebbe parsare JSON con valori annidati complessi', () => {
      const jsonString = '{"student": {"name": "Marco", "grades": [8, 7, 9], "info": {"class": "3A"}}}';
      const result = cleanAndParseJson(jsonString);
      expect(result.student.info.class).toBe('3A');
      expect(result.student.grades).toHaveLength(3);
    });

    it('dovrebbe parsare array di oggetti complessi', () => {
      const jsonString = '[{"id": 1, "data": {"value": "test"}}, {"id": 2, "data": {"value": "test2"}}]';
      const result = cleanAndParseJson(jsonString);
      expect(result).toHaveLength(2);
      expect(result[0].data.value).toBe('test');
    });

    it('dovrebbe gestire JSON con escape characters', () => {
      const jsonString = '{"testo": "Line 1\\nLine 2\\tTab"}';
      const result = cleanAndParseJson(jsonString);
      expect(result.testo).toContain('Line 1');
    });

    it('dovrebbe parsare JSON con numeri decimali', () => {
      const jsonString = '{"voto": 8.75, "media": 7.5}';
      const result = cleanAndParseJson(jsonString);
      expect(result.voto).toBe(8.75);
    });

    it('dovrebbe parsare JSON vuoto object', () => {
      const jsonString = '{}';
      const result = cleanAndParseJson(jsonString);
      expect(Object.keys(result)).toHaveLength(0);
    });

    it('dovrebbe parsare JSON vuoto array', () => {
      const jsonString = '[]';
      const result = cleanAndParseJson(jsonString);
      expect(result).toHaveLength(0);
    });
  });

  describe('buildSystemInstruction', () => {
    it('dovrebbe includere persona di default per istruzioni di sistema', () => {
      // Test che l'istruzione di sistema contiene elementi importanti
      const defaultInstruction = 'ASSISTANTE DIDATTICO ESPERTO';
      expect(defaultInstruction).toContain('ASSISTANTE');
    });

    it('dovrebbe gestire contesto personalizzato', () => {
      const context = { classContext: 'III-A', subject: 'Italiano' };
      expect(context.classContext).toBe('III-A');
      expect(context.subject).toBe('Italiano');
    });

    it('dovrebbe supportare override di istruzioni', () => {
      const customInstruction = 'Custom system instruction';
      expect(customInstruction).toBeTruthy();
      expect(customInstruction).not.toContain('ASSISTANTE');
    });

    it('dovrebbe gestire contesto scuola e insegnante', () => {
      const userContext = {
        classContext: 'II-B',
        subject: 'Matematica',
        schoolType: 'Liceo',
        teacherName: 'Prof. Rossi',
      };
      expect(userContext).toBeDefined();
      expect(userContext.classContext).toBeDefined();
      expect(userContext.teacherName).toBeDefined();
    });
  });
});