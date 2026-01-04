
// @ts-nocheck
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { 
  generateHtmlDocxBlob, 
  extractTextFromFile, 
  saveAs, 
  blobToBase64Parts, 
  base64ToBlob, 
  viewPdfInNewTab,
  generateHomeworkPdf,
  generateCertificazioneCompetenzePdf,
  generateUdaPdf,
  generateLessonPdf,
  generateStudentProfilePdf,
  generatePdfBrochure,
  generateCouncilDataPdf,
  generateCouncilTablePdf,
  generateFullAppGuidePdf
} from '../../../src/utils/documentUtils';
import * as pdfLib from 'pdf-lib';
import * as docx from 'docx';
import mammoth from 'mammoth';

// Mock delle dipendenze esterne
vi.mock('pdf-lib', () => {
  const mockFont = {
    widthOfTextAtSize: vi.fn((text) => text.length * 10),
  };
  return {
    PDFDocument: {
      create: vi.fn(() => ({
        embedFont: vi.fn(() => Promise.resolve(mockFont)),
        addPage: vi.fn(() => ({
          getSize: vi.fn(() => ({ width: 600, height: 800 })),
          drawText: vi.fn(),
          drawLine: vi.fn(),
          drawRectangle: vi.fn(),
        })),
        save: vi.fn(() => Promise.resolve(new Uint8Array())),
      })),
    },
    StandardFonts: { Helvetica: 'Helvetica', HelveticaBold: 'Helvetica-Bold' },
    rgb: vi.fn(),
    PageSizes: { A4: [595.28, 841.89] },
  };
});

vi.mock('jspdf', () => {
  class MockJsPDF {
    setFontSize = vi.fn();
    text = vi.fn();
    output = vi.fn(() => new Blob(['pdf content'], { type: 'application/pdf' }));
    autoTable = vi.fn();
  }
  return { jsPDF: MockJsPDF };
});

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

// Mock FileReader
class MockFileReader {
  onloadend: any;
  onerror: any;
  result: string = '';
  readAsDataURL(blob: Blob) {
    setTimeout(() => {
      if (this.onerror && blob.size === 0) {
        this.onerror(new Error('Read error'));
      } else if (this.onloadend) {
        this.result = 'data:text/plain;base64,dGVzdA==';
        this.onloadend();
      }
    }, 0);
  }
}
vi.stubGlobal('FileReader', MockFileReader);

// Mock pdfjs-dist
vi.mock('pdfjs-dist/legacy/build/pdf', () => {
  const mockPdf = {
    numPages: 1,
    getPage: vi.fn(() => Promise.resolve({
      getTextContent: vi.fn(() => Promise.resolve({
        items: [{ str: 'testo pdf' }]
      }))
    }))
  };
  return {
    default: {
      getDocument: vi.fn(() => ({
        promise: Promise.resolve(mockPdf)
      })),
      GlobalWorkerOptions: {}
    },
    getDocument: vi.fn(() => ({
      promise: Promise.resolve(mockPdf)
    })),
    GlobalWorkerOptions: {}
  };
});

describe('documentUtils', () => {
  
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock browser APIs
    global.URL.createObjectURL = vi.fn(() => 'mock-url');
    global.URL.revokeObjectURL = vi.fn();
    global.open = vi.fn();
    global.Node = {
      ELEMENT_NODE: 1,
      TEXT_NODE: 3
    } as any;
  });

  describe('saveAs', () => {
    it('dovrebbe creare un elemento <a> e simulare il click', () => {
      vi.useFakeTimers();
      const mockAnchor = {
        style: {},
        href: '',
        download: '',
        click: vi.fn(),
      };
      vi.spyOn(document, 'createElement').mockReturnValue(mockAnchor as any);
      vi.spyOn(document.body, 'appendChild').mockImplementation(() => {});
      vi.spyOn(document.body, 'removeChild').mockImplementation(() => {});
      vi.spyOn(document.body, 'contains').mockReturnValue(true);

      saveAs(new Blob(['test']), 'test.txt');

      expect(document.createElement).toHaveBeenCalledWith('a');
      expect(mockAnchor.download).toBe('test.txt');
      expect(mockAnchor.click).toHaveBeenCalled();
      
      vi.advanceTimersByTime(100);
      expect(global.URL.revokeObjectURL).toHaveBeenCalled();
      vi.useRealTimers();
    });

    it('dovrebbe gestire errori e mostrare alert', () => {
      vi.spyOn(document, 'createElement').mockImplementation(() => { throw new Error('Fail'); });
      const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
      
      saveAs('test', 'test.txt');
      expect(alertSpy).toHaveBeenCalled();
    });
  });

  describe('blobToBase64Parts', () => {
    it('dovrebbe convertire un blob in base64', async () => {
      const blob = new Blob(['test'], { type: 'text/plain' });
      const result = await blobToBase64Parts(blob);
      expect(result.mimeType).toBe('text/plain');
      expect(result.data).toBe('dGVzdA==');
    });

    it('dovrebbe gestire errori del FileReader', async () => {
      const blob = new Blob([], { type: 'text/plain' }); // Empty blob to trigger error in mock
      await expect(blobToBase64Parts(blob)).rejects.toThrow('Read error');
    });

    it('dovrebbe gestire risultati malformati', async () => {
      const blob = new Blob(['test']);
      // Temporarily override FileReader for this test
      const MalformedFileReader = class extends MockFileReader {
        readAsDataURL() {
          this.result = 'invalid';
          setTimeout(() => this.onloadend(), 0);
        }
      };
      vi.stubGlobal('FileReader', MalformedFileReader);
      
      await expect(blobToBase64Parts(blob)).rejects.toThrow('File error');
      vi.stubGlobal('FileReader', MockFileReader);
    });
  });

  describe('base64ToBlob', () => {
    it('dovrebbe convertire base64 in Blob', () => {
      const base64 = btoa('test content');
      const blob = base64ToBlob(base64, 'text/plain');
      expect(blob).toBeInstanceOf(Blob);
      expect(blob.type).toBe('text/plain');
    });
  });

  describe('viewPdfInNewTab', () => {
    it('dovrebbe aprire il PDF in un nuovo tab', () => {
      vi.useFakeTimers();
      const blob = new Blob(['pdf'], { type: 'application/pdf' });
      viewPdfInNewTab(blob);
      expect(global.open).toHaveBeenCalledWith('mock-url', '_blank');
      vi.advanceTimersByTime(60000);
      expect(global.URL.revokeObjectURL).toHaveBeenCalled();
      vi.useRealTimers();
    });
  });

  describe('generateHtmlDocxBlob', () => {
    it('dovrebbe generare un Blob DOCX da HTML semplice', async () => {
      const htmlContent = '<h1>Titolo</h1><p>Paragrafo</p>';
      const title = 'Test Doc';
      
      const blob = await generateHtmlDocxBlob(htmlContent, title);
      
      expect(docx.Document).toHaveBeenCalled();
      expect(docx.Packer.toBlob).toHaveBeenCalled();
      expect(blob).toBeInstanceOf(Blob);
    });

    it('dovrebbe gestire tag strong e em', async () => {
      const htmlContent = '<p><strong>Bold</strong> <em>Italic</em></p>';
      await generateHtmlDocxBlob(htmlContent);
      expect(docx.TextRun).toHaveBeenCalledWith(expect.objectContaining({ bold: true }));
      expect(docx.TextRun).toHaveBeenCalledWith(expect.objectContaining({ italics: true }));
    });

    it('dovrebbe gestire tag b, i e br', async () => {
      const htmlContent = '<p><b>Bold</b> <i>Italic</i><br/></p>';
      await generateHtmlDocxBlob(htmlContent);
      expect(docx.TextRun).toHaveBeenCalledWith(expect.objectContaining({ bold: true }));
      expect(docx.TextRun).toHaveBeenCalledWith(expect.objectContaining({ italics: true }));
      expect(docx.TextRun).toHaveBeenCalledWith(expect.objectContaining({ text: "\n" }));
    });

    it('dovrebbe gestire vari tag HTML (h1, h2, h3, div, b, i, br)', async () => {
      const html = '<h1>H1</h1><h2>H2</h2><h3>H3</h3><div>Div</div><b>Bold</b><i>Italic</i><br/>';
      const blob = await generateHtmlDocxBlob(html);
      expect(blob).toBeInstanceOf(Blob);
    });

    it('dovrebbe gestire liste ul e ol', async () => {
      const htmlContent = '<ul><li>Item 1</li></ul><ol><li>Item A</li></ol>';
      await generateHtmlDocxBlob(htmlContent);
      expect(docx.Paragraph).toHaveBeenCalled();
    });

    it('dovrebbe gestire elementi annidati non supportati direttamente', async () => {
      const htmlContent = '<span><p>Nested</p></span>';
      await generateHtmlDocxBlob(htmlContent);
      expect(docx.Paragraph).toHaveBeenCalled();
    });

    it('dovrebbe gestire tag non supportati in extractTextRuns', async () => {
      const htmlContent = '<p><span>Unsupported</span></p>';
      await generateHtmlDocxBlob(htmlContent);
      expect(docx.TextRun).toHaveBeenCalled();
    });

    it('dovrebbe gestire errori nella generazione DOCX', async () => {
      vi.mocked(docx.Packer.toBlob).mockRejectedValue(new Error('Packer error'));
      const blob = await generateHtmlDocxBlob('<p>test</p>');
      expect(blob.type).toBe('text/plain');
    });

    it('dovrebbe lanciare errore se document non è definito', async () => {
      const originalDocument = global.document;
      // @ts-ignore
      delete global.document;
      const blob = await generateHtmlDocxBlob('<p>test</p>');
      expect(blob.type).toBe('text/plain');
      global.document = originalDocument;
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

    it('dovrebbe usare pdfjs per file .pdf', async () => {
      const mockFile = {
        name: 'test.pdf',
        type: 'application/pdf',
        arrayBuffer: vi.fn().mockResolvedValue(new ArrayBuffer(10)),
      };
      const text = await extractTextFromFile(mockFile as any);
      console.log('EXTRACTED TEXT:', JSON.stringify(text));
      expect(typeof text).toBe('string');
      expect(text).toMatch(/testo pdf/);
    });

    it('dovrebbe tentare lettura testo per file piccoli sconosciuti', async () => {
      const mockFile = {
        name: 'test.unknown',
        type: 'application/octet-stream',
        size: 100,
        text: vi.fn().mockResolvedValue('testo fallback'),
      };
      const text = await extractTextFromFile(mockFile as any);
      expect(text).toBe('testo fallback');
    });

    it('dovrebbe lanciare errore per tipi non supportati', async () => {
      const mockFile = {
        name: 'test.exe',
        type: 'application/x-msdownload',
        size: 3 * 1024 * 1024
      };
      await expect(extractTextFromFile(mockFile as any)).rejects.toThrow(/file non supportato/i);
    });
  });

  describe('generateHomeworkPdf', () => {
    it('dovrebbe generare un PDF per i compiti', async () => {
      const lesson = {
        classe: '1A',
        materia: 'Matematica',
        contenuto: 'Equazioni',
        compiti: 'Esercizi 1-10',
        obiettivi: '• Capire le equazioni',
        materialiDidattici: [
          { label: 'Libro', type: 'file' },
          { label: 'Sito', type: 'link', url: 'https://test.com' }
        ]
      };
      const settings = { nomeIstituto: 'Scuola Test', nomeInsegnante: 'Prof. Rossi' };
      
      const blob = await generateHomeworkPdf(lesson as any, settings as any);
      expect(blob).toBeInstanceOf(Blob);
      expect(pdfLib.PDFDocument.create).toHaveBeenCalled();
    });

    it('dovrebbe gestire compiti mancanti', async () => {
      const lesson = {
        classe: '1A',
        materia: 'Matematica',
        contenuto: 'Equazioni',
        compiti: '',
      };
      const blob = await generateHomeworkPdf(lesson as any, {});
      expect(blob).toBeInstanceOf(Blob);
    });

    it('dovrebbe gestire testo lungo con wrapping', async () => {
      const lesson = {
        classe: '1A',
        materia: 'Matematica',
        contenuto: 'Questo è un testo molto lungo che dovrebbe sicuramente superare la larghezza massima della pagina e quindi innescare la logica di wrapping del testo nel PDF generato.',
        compiti: 'Esercizi',
      };
      const blob = await generateHomeworkPdf(lesson as any, {});
      expect(blob).toBeInstanceOf(Blob);
    });
  });

  describe('generateCertificazioneCompetenzePdf', () => {
    it('dovrebbe generare un PDF per la certificazione competenze', async () => {
      const student = { nome: 'Mario', cognome: 'Rossi', classe: '1A' };
      const competencyData = [{ competencyName: 'Comp 1', level: 'A' }];
      const settings = { annoScolasticoCorrente: '2023/24' };
      
      const blob = await generateCertificazioneCompetenzePdf(student as any, competencyData, settings as any);
      expect(blob).toBeInstanceOf(Blob);
    });
  });

  describe('generateUdaPdf', () => {
    it('dovrebbe generare un PDF per UDA (docente)', async () => {
      const uda = {
        title: 'Test UDA',
        classe: '1A',
        materia: 'Italiano',
        introduction: 'Intro',
        finalProduct: 'Prodotto',
        competencyIds: ['c1'],
        phases: [{ title: 'Fase 1', duration: '1h', description: 'Desc', activities: 'Att' }],
        evaluation: 'Val',
        tools: 'Strumenti'
      };
      const competenze = [{ id: 'c1', nome: 'Comp 1', codice: 'C1' }];
      const settings = { nomeIstituto: 'Scuola', nomeInsegnante: 'Docente' };
      
      const blob = await generateUdaPdf(uda, competenze, settings, 'docente');
      expect(blob).toBeInstanceOf(Blob);
    });

    it('dovrebbe generare un PDF per UDA (studente)', async () => {
      const uda = {
        title: 'Test UDA',
        classe: '1A',
        materia: 'Italiano',
        introduction: 'Intro',
        finalProduct: 'Prodotto',
        competencyIds: [],
        phases: [],
        evaluation: 'Val',
        tools: 'Strumenti'
      };
      const blob = await generateUdaPdf(uda, [], {}, 'studente');
      expect(blob).toBeInstanceOf(Blob);
    });

    it('dovrebbe gestire molte righe e creare nuove pagine', async () => {
      const uda = {
        title: 'UDA Lunga',
        classe: '1A',
        materia: 'Italiano',
        introduction: 'Intro',
        finalProduct: 'Prodotto',
        competencyIds: [],
        phases: Array(20).fill({ title: 'Fase', duration: '1h', description: 'Desc', activities: 'Att' }),
        evaluation: 'Val',
        tools: 'Strumenti'
      };
      const blob = await generateUdaPdf(uda as any, [], {}, 'docente');
      expect(blob).toBeInstanceOf(Blob);
    });
  });

  describe('generateLessonPdf', () => {
    it('dovrebbe generare un PDF per la lezione', async () => {
      const lesson = {
        classe: '1A',
        materia: 'Italiano',
        contenuto: 'Argomento',
        obiettivi: 'Obiettivi',
        compiti: 'Compiti',
        nota: 'Nota'
      };
      const blob = await generateLessonPdf(lesson);
      expect(blob).toBeInstanceOf(Blob);
    });
  });

  describe('generateStudentProfilePdf', () => {
    it('dovrebbe generare un PDF per il profilo studente', async () => {
      const student = { nome: 'Mario', cognome: 'Rossi', classe: '1A' };
      const evaluations = [{ materia: 'Italiano', voto: '8' }];
      const competencyEvaluations = [{ competenzaId: 'c1', livelloId: 'A', materia: 'Italiano' }];
      const blob = await generateStudentProfilePdf(student, evaluations, competencyEvaluations, {});
      expect(blob).toBeInstanceOf(Blob);
    });
  });

  describe('generatePdfBrochure', () => {
    it('dovrebbe generare un PDF per la brochure', async () => {
      const content = {
        brochureTitle: 'Brochure',
        introduction: 'Desc',
        useCases: [{ title: 'Sezione', benefits: ['Item 1'] }],
        technicalGuarantees: { title: 'Tech', content: 'Content' },
        roadmap: { title: 'Roadmap', items: [{ title: 'Step 1', description: 'Desc' }] },
        callToAction: 'CTA'
      };
      const blob = await generatePdfBrochure(content as any);
      expect(blob).toBeInstanceOf(Blob);
    });
  });

  describe('generateCouncilDataPdf', () => {
    it('dovrebbe generare un PDF per i dati del consiglio', async () => {
      const students = [{ id: 's1', nome: 'Mario', cognome: 'Rossi' }];
      const evaluations = [{ studenteId: 's1', voto: '8' }];
      const blob = await generateCouncilDataPdf('1A', { nome: 'Trimestre' }, students, evaluations, [], {});
      expect(blob).toBeInstanceOf(Blob);
    });
  });

  describe('generateCouncilTablePdf', () => {
    it('dovrebbe generare un PDF per il tabellone dello scrutinio', async () => {
      const students = [
        { id: 's1', nome: 'Mario', cognome: 'Rossi' },
        { id: 's2', nome: 'Luigi', cognome: 'Verdi' }
      ];
      const evaluations = [
        { studenteId: 's1', materia: 'Italiano', voto: '8' },
        { studenteId: 's2', materia: 'Matematica', voto: '7' }
      ];
      const blob = await generateCouncilTablePdf('1A', { nome: 'Trimestre' }, '2023/24', students, evaluations, {}, {}, true);
      expect(blob).toBeInstanceOf(Blob);
    });

    it('dovrebbe gestire studente senza valutazioni', async () => {
      const students = [{ id: 's3', nome: 'Anna', cognome: 'Bianchi' }];
      const evaluations = [];
      const blob = await generateCouncilTablePdf('1A', { nome: 'Trimestre' }, '2023/24', students, evaluations, {}, {}, true);
      expect(blob).toBeInstanceOf(Blob);
    });
  });

  describe('generateFullAppGuidePdf', () => {
    it('dovrebbe generare un PDF per la guida completa', async () => {
      const essay = { title: 'Titolo', content: 'Contenuto' };
      const faqs = [{ q: 'Q', a: 'A' }];
      const specs = { title: 'Specs', specs: ['I1'] };
      const vocal = { title: 'Vocal', sections: [{ title: 'S1', commands: ['C1'] }] };
      const blob = await generateFullAppGuidePdf(essay, faqs as any, specs as any, {}, vocal as any);
      expect(blob).toBeInstanceOf(Blob);
    });

    it('dovrebbe gestire essayContent nullo', async () => {
      const specs = { title: 'Specs', specs: [] };
      const vocal = { title: 'Vocal', sections: [] };
      const blob = await generateFullAppGuidePdf(null, [], specs as any, {}, vocal as any);
      expect(blob).toBeInstanceOf(Blob);
    });
  });
});

