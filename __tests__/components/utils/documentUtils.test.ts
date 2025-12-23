
// @ts-nocheck
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generateHtmlDocxBlob, extractTextFromFile } from '../../../src/utils/documentUtils';
import * as pdfLib from 'pdf-lib';
import * as docx from 'docx';
import mammoth from 'mammoth';

// Mock delle dipendenze esterne
vi.mock('pdf-lib', () => ({
  PDFDocument: {
    create: vi.fn(() => ({
      embedFont: vi.fn(),
      addPage: vi.fn(() => ({
        getSize: vi.fn(() => ({ width: 600, height: 800 })),
        drawText: vi.fn(),
        drawLine: vi.fn(),
      })),
      save: vi.fn(() => new Uint8Array()),
    })),
  },
  StandardFonts: { Helvetica: 'Helvetica', HelveticaBold: 'Helvetica-Bold' },
  rgb: vi.fn(),
  PageSizes: { A4: [595.28, 841.89] },
}));

vi.mock('docx', () => ({
  Document: vi.fn(),
  Packer: {
    toBlob: vi.fn(() => Promise.resolve(new Blob(['docx content'], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }))),
  },
  Paragraph: vi.fn(),
  TextRun: vi.fn(),
  HeadingLevel: { TITLE: 'title', HEADING_1: 'heading1', HEADING_2: 'heading2' },
  AlignmentType: { CENTER: 'center' },
}));

vi.mock('mammoth', () => ({
  default: {
    extractRawText: vi.fn(),
  }
}));

describe('documentUtils', () => {
  
  describe('generateHtmlDocxBlob', () => {
    it('dovrebbe generare un Blob DOCX da HTML semplice', async () => {
      const htmlContent = '<h1>Titolo</h1><p>Paragrafo</p>';
      const title = 'Test Doc';
      
      const blob = await generateHtmlDocxBlob(htmlContent, title);
      
      expect(docx.Document).toHaveBeenCalled();
      expect(docx.Packer.toBlob).toHaveBeenCalled();
      expect(blob).toBeInstanceOf(Blob);
    });

    it('dovrebbe gestire liste non ordinate', async () => {
      const htmlContent = '<ul><li>Item 1</li><li>Item 2</li></ul>';
      await generateHtmlDocxBlob(htmlContent);
      // Verifica indiretta: se non crasha, il parsing dei nodi funziona
      expect(docx.Paragraph).toHaveBeenCalled();
    });
  });

  describe('extractTextFromFile', () => {
    it('dovrebbe estrarre testo da un file .txt', async () => {
      const mockFile = {
        name: 'test.txt',
        type: 'text/plain',
        text: vi.fn().mockResolvedValue('contenuto testo'),
      };
      const text = await extractTextFromFile(mockFile as any);
      expect(text).toBe('contenuto testo');
    });

    it('dovrebbe usare mammoth per file .docx', async () => {
      const mockFile = {
        name: 'test.docx',
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        arrayBuffer: vi.fn().mockResolvedValue(new ArrayBuffer(10)),
      };
      (mammoth.extractRawText as vi.Mock).mockResolvedValue({ value: 'Testo estratto da DOCX' });
      
      const text = await extractTextFromFile(mockFile as any);
      expect(mammoth.extractRawText).toHaveBeenCalled();
      expect(text).toBe('Testo estratto da DOCX');
    });

    it('dovrebbe lanciare errore per tipi non supportati', async () => {
      const mockFile = {
        name: 'test.exe',
        type: 'application/x-msdownload',
      };
      await expect(extractTextFromFile(mockFile as any)).rejects.toThrow(/file non supportato/i);
    });
  });
});
