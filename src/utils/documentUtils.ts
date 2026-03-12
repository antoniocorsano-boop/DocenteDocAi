/* eslint-disable @typescript-eslint/no-unused-vars, no-empty */
// Heavy libraries are loaded dynamically to reduce initial bundle size
// Lazily load PDF.js to avoid bundling it in the initial chunk

// Safety check: ensure we're in a browser environment
if (typeof window === 'undefined' || typeof document === 'undefined') {
  logger.warn('documentUtils: Browser APIs not available, some features will be disabled');
}

import { Uda, Lezione, Competenza, TimetableSettings, Studente, Valutazione, ValutazioneCompetenza, GiudizioPeriodico, PeriodoValutazione, TechnicalDocumentContent, EssayContent, FaqItem, VocalAssistantGuide, BrochureContent } from '../types';
import { calculatePerformance } from './evaluationUtils';
import { logger } from './logger';

const loadPdfLib = async () => await import('pdf-lib');
const loadMammoth = async () => await import('mammoth');
const loadDocx = async () => await import('docx');
const loadJsPdf = async () => await import('jspdf');

// MD3 compliant PDF colors (normalized 0-1 range)
const PDF_COLOR_GRAY_DARK = [0.4, 0.4, 0.4] as const;
const PDF_COLOR_PURPLE_LIGHT = [0.4, 0.3, 0.65] as const;
const PDF_COLOR_GRAY_LIGHT = [0.8, 0.8, 0.8] as const;
const PDF_COLOR_CREAM = [0.95, 0.95, 0.98] as const;
const PDF_COLOR_GRAY_MEDIUM = [0.5, 0.5, 0.5] as const;
const PDF_COLOR_BLACK = [0, 0, 0] as const;
const PDF_COLOR_BLUE_LIGHT = [0, 0, 1] as const;
const PDF_COLOR_GREEN_LIGHT = [0.2, 0.5, 0.2] as const;
const PDF_COLOR_RED_LIGHT = [0.5, 0.1, 0.1] as const;
const PDF_COLOR_BLUE_DARK = [0.1, 0.1, 0.4] as const;
const PDF_COLOR_GREEN_LEVEL_A = [0.8, 0.9, 0.8] as const;
const PDF_COLOR_YELLOW_LEVEL_B = [0.9, 0.9, 0.8] as const;
const PDF_COLOR_ORANGE_LEVEL_C = [1, 0.9, 0.8] as const;
const PDF_COLOR_RED_LEVEL_D = [1, 0.8, 0.8] as const;

// --- NATIVE SAVEAS IMPLEMENTATION ---
export const saveAs = (blob: Blob | string, name: string): void => {
    try {
        const blobObj = blob instanceof Blob ? blob : new Blob([blob]);
        const url = window.URL.createObjectURL(blobObj);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = name;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
            window.URL.revokeObjectURL(url);
            if (document.body.contains(a)) document.body.removeChild(a);
        }, 100);
    } catch (e) {
        logger.error("Errore download:", e);
        window.alert('Errore durante il download del file.');
    }
};

// ... (Existing text extraction and helper functions remain unchanged)
let cachedPdfJs: unknown = null;
const getPdfJs = async () => {
    if (cachedPdfJs) return cachedPdfJs;
    // @ts-expect-error - `pdfjs-dist` legacy bundle has incomplete/incorrect types
    const mod = await import('pdfjs-dist/legacy/build/pdf');
    const pdfJsObj = (mod && (mod as { default?: unknown }).default) ? (mod as { default: unknown }).default : mod;
    if (pdfJsObj && typeof pdfJsObj === 'object' && 'GlobalWorkerOptions' in pdfJsObj) {
        const pjs = pdfJsObj as { GlobalWorkerOptions: { workerSrc: string } };
        if (!pjs.GlobalWorkerOptions.workerSrc) {
            pjs.GlobalWorkerOptions.workerSrc = 'https://unpkg.com/pdfjs-dist@5.4.449/build/pdf.worker.min.js';
        }
    }
    cachedPdfJs = pdfJsObj;
    return cachedPdfJs;
};

const extractTextFromPdfClientSide = async (file: File): Promise<string> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pdfJsObj = await getPdfJs() as any;
    if (!pdfJsObj) throw new Error('PDF.js not available');
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfJsObj.getDocument({ data: new Uint8Array(arrayBuffer) });
    const pdf = await loadingTask.promise;
    let fullText = '';
    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item: unknown) => {
            const itemObj = item as { str?: string };
            return 'str' in itemObj ? itemObj.str : '';
        }).join(' ');
        fullText += pageText + '\n';
    }
    return fullText;
};

/**
 * Estrae il testo da un file caricato (PDF, DOCX, TXT, ecc.).
 * Utilizza librerie client-side per il parsing.
 * @param file Il file da processare
 * @returns Il testo estratto
 */
export const extractTextFromFile = async (file: File): Promise<string> => {
    const parts = file.name.split('.');
    const fileExtension = parts.length > 1 ? parts.pop()?.toLowerCase() : '';
    const supportedTextExtensions = ['txt', 'md', 'markdown', 'json', 'csv', 'xml', 'html', 'js', 'ts', 'jsx', 'tsx', 'css', 'scss', 'yaml', 'yml'];
    
    if (file.type.startsWith('text/') || supportedTextExtensions.includes(fileExtension || '')) {
        return await file.text();
    }
    if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || fileExtension === 'docx') {
        try {
            const arrayBuffer = await file.arrayBuffer();
            const mammothModule = await loadMammoth();
            const mammothLib = (mammothModule && mammothModule.default) ? mammothModule.default : mammothModule;
            const result = await mammothLib.extractRawText({ arrayBuffer });
            return result.value;
        } catch (e: unknown) {
            throw new Error(`Errore DOCX: ${e instanceof Error ? e.message : String(e)}`);
        }
    }
    if (file.type === 'application/pdf' || fileExtension === 'pdf') {
        try { return await extractTextFromPdfClientSide(file); } catch(e: unknown) { throw new Error(`Errore PDF: ${e instanceof Error ? e.message : String(e)}`); }
    }
    if (file.size < 2 * 1024 * 1024) { 
        try {
            const text = await file.text();
            if (text && !text.includes('\0')) return text;
        } catch (e) {}
    }
    throw new Error(`Tipo file non supportato: ${file.name}`);
};

export const blobToBase64Parts = (blob: Blob): Promise<{ mimeType: string; data: string }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      if (!result || !result.includes(',')) { reject(new Error("File error")); return; }
      const parts = result.split(',');
      const [header, data] = parts;
      const mimeType = header.match(/:(.*?);/)?.[1] || blob.type;
      resolve({ mimeType, data });
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(blob);
  });
};

export const base64ToBlob = (base64: string, mimeType: string): Blob => {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) byteNumbers[i] = byteCharacters.charCodeAt(i);
    return new Blob([new Uint8Array(byteNumbers)], { type: mimeType });
};

export const viewPdfInNewTab = (blob: Blob): void => {
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
    setTimeout(() => URL.revokeObjectURL(url), 60000);
};

// ... (Existing DOCX generation, PDF text wrapping, etc. remain unchanged)
export const generateHtmlDocxBlob = async (htmlContent: string, title?: string): Promise<Blob> => {
    try {
        // Safety check for browser environment
        if (typeof document === 'undefined' || typeof DOMParser === 'undefined') {
            throw new Error('Document API not available - DOCX generation requires browser environment');
        }
        
        // Load docx dynamically to avoid bundling it in the initial chunk
        const docxModule = await loadDocx();
        const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } = docxModule;
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlContent, 'text/html');
        const body = doc.body;

        const children: (import('docx').Paragraph | import('docx').Table)[] = [];
        if (title) {
            children.push(new Paragraph({ 
                text: title, 
                heading: HeadingLevel.TITLE, 
                alignment: AlignmentType.CENTER, 
                spacing: { after: 300 } 
            }));
        }

        const extractTextRuns = (container: HTMLElement): import('docx').TextRun[] => {
            const runs: import('docx').TextRun[] = [];
            container.childNodes.forEach(child => {
                if (child.nodeType === Node.TEXT_NODE) {
                    const txt = child.textContent || '';
                    if (txt) runs.push(new TextRun(txt));
                } else if (child.nodeType === Node.ELEMENT_NODE) {
                    const childEl = child as HTMLElement;
                    const childTag = childEl.tagName.toLowerCase();
                    if (childTag === 'strong' || childTag === 'b') {
                        runs.push(new TextRun({ text: childEl.textContent || '', bold: true }));
                    } else if (childTag === 'em' || childTag === 'i') {
                        runs.push(new TextRun({ text: childEl.textContent || '', italics: true }));
                    } else if (childTag === 'br') {
                        runs.push(new TextRun({ text: "\n" }));
                    } else {
                        runs.push(new TextRun(childEl.textContent || ''));
                    }
                }
            });
            return runs;
        };

        const processNode = (node: Node): (import('docx').Paragraph | import('docx').Table)[] => {
            if (!node) return [];
            const nodes: (import('docx').Paragraph | import('docx').Table)[] = [];
            const nodeType = node.nodeType;
            const nodeName = (node.nodeName || "").toLowerCase();

            if (nodeType === 3) { // Node.TEXT_NODE
                const text = node.textContent?.trim();
                if (text) nodes.push(new Paragraph({ children: [new TextRun(text)] }));
            } else if (nodeType === 1) { // Node.ELEMENT_NODE
                const el = node as HTMLElement;
                if (['h1', 'h2', 'h3', 'p', 'div'].includes(nodeName)) {
                    const runs = extractTextRuns(el);
                    if (runs.length) {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        const options: any = { children: runs };
                        if (nodeName === 'h1') options.heading = HeadingLevel.HEADING_1;
                        else if (nodeName === 'h2') options.heading = HeadingLevel.HEADING_2;
                        else if (nodeName === 'h3') options.heading = HeadingLevel.HEADING_3;
                        nodes.push(new Paragraph(options));
                    }
                } else if (nodeName === 'ul' || nodeName === 'ol') {
                    const childrenArr = node.childNodes ? Array.from(node.childNodes) : [];
                    childrenArr.forEach(li => {
                        if (li && li.nodeType === 1 && li.nodeName.toLowerCase() === 'li') {
                            const runs = extractTextRuns(li as HTMLElement);
                            if (runs.length) {
                                nodes.push(new Paragraph({ 
                                    children: runs, 
                                    bullet: { level: 0 } 
                                }));
                            }
                        }
                    });
                } else {
                    // For other elements, try to process children
                    const childrenArr = node.childNodes ? Array.from(node.childNodes) : [];
                    childrenArr.forEach(child => {
                        nodes.push(...processNode(child));
                    });
                }
            }
            return nodes;
        };

        Array.from(body.childNodes).forEach(node => {
            children.push(...processNode(node));
        });
        
        const docx = new Document({ 
            sections: [{ 
                properties: {}, 
                children: children 
            }] 
        });
        return await Packer.toBlob(docx);
    } catch (error) {
        logger.error('Error generating DOCX:', error);
        // Fallback: return empty blob
        return new Blob(['Unable to generate DOCX file'], { type: 'text/plain' });
    }
};

// ... (PDF Generation Helpers) ...
const cleanTextForWinAnsi = (text: string) => {
    if (!text) return '';
    let out = '';
    for (let i = 0; i < text.length; i++) {
        const code = text.charCodeAt(i);
        out += code <= 0xFF ? text.charAt(i) : '?';
    }
    return out;
};
const wrapText = (text: string, font: { widthOfTextAtSize: (t: string, s: number) => number }, size: number, maxWidth: number) => {
    // Simplified wrapping logic
    const words = text.split(' ');
    const lines = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
        const word = words[i];
        const width = font.widthOfTextAtSize(currentLine + " " + word, size);
        if (width < maxWidth) {
            currentLine += " " + word;
        } else {
            lines.push(currentLine);
            currentLine = word;
        }
    }
    lines.push(currentLine);
    return lines;
};

interface PdfContext {
    doc: import('pdf-lib').PDFDocument;
    page: import('pdf-lib').PDFPage;
    y: number;
    font: import('pdf-lib').PDFFont;
    boldFont: import('pdf-lib').PDFFont;
    width: number;
    height: number;
    margin: number;
    fontSize: number;
}
const addNewPageIfNeeded = (ctx: PdfContext, spaceNeeded: number) => {
    if (ctx.y - spaceNeeded < ctx.margin) {
        ctx.page = ctx.doc.addPage();
        ctx.y = ctx.height - ctx.margin;
    }
};
type DrawTextOptions = {
    isBold?: boolean;
    size?: number;
    color?: import('pdf-lib').RGB | null;
    indent?: number;
    align?: 'left' | 'center' | 'right';
    maxWidth?: number;
};
const drawTextSafe = (ctx: PdfContext, text: string, options: DrawTextOptions = {}) => {
    const safeText = cleanTextForWinAnsi(text || '');
    const { isBold = false, size = 11, color = null, indent = 0, align = 'left', maxWidth } = options;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const resolvedColor = color || { type: 'RGB', red: 0, green: 0, blue: 0 } as any;
    
    if (maxWidth) {
        const font = isBold ? ctx.boldFont : ctx.font;
        const lines = wrapText(safeText, font, size, maxWidth);
        lines.forEach(line => {
            addNewPageIfNeeded(ctx, size + 2);
            ctx.page.drawText(line, { x: ctx.margin + indent, y: ctx.y, font, size, color: resolvedColor });
            ctx.y -= size + 4;
        });
    } else {
        addNewPageIfNeeded(ctx, size + 2);
        ctx.page.drawText(safeText, { x: ctx.margin + indent, y: ctx.y, font: isBold ? ctx.boldFont : ctx.font, size, color: resolvedColor });
        ctx.y -= size * 1.5;
    }
};
const drawSectionTitle = (ctx: PdfContext, title: string) => {
    ctx.y -= 10;
    drawTextSafe(ctx, title, { isBold: true, size: 14 });
};

// --- NEW FUNCTION: SCHEDA COMPITI PDF ---
/**
 * Genera un file PDF con la scheda compiti e materiali per una lezione.
 * @param lesson Dati della lezione
 * @param settings Impostazioni istituto/docente
 * @returns Blob del PDF generato
 */
export const generateHomeworkPdf = async (lesson: Lezione, settings: TimetableSettings): Promise<Blob> => {
    const pdfLib = await loadPdfLib();
    const { PDFDocument, rgb, StandardFonts, PageSizes } = pdfLib;
    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const page = pdfDoc.addPage(PageSizes.A4);
    const { width, height } = page.getSize();
    const ctx: PdfContext = { doc: pdfDoc, page, y: height - 50, font, boldFont, width, height, margin: 50, fontSize: 11 };

    // --- Header ---
    drawTextSafe(ctx, settings.nomeIstituto || 'Istituto Scolastico', { isBold: true, size: 10, color: rgb(...PDF_COLOR_GRAY_DARK) });
    drawTextSafe(ctx, 'SCHEDA COMPITI & MATERIALI', { isBold: true, size: 22, color: rgb(...PDF_COLOR_PURPLE_LIGHT) }); // Primary Brand Color
    ctx.page.drawLine({ start: { x: 50, y: ctx.y + 10 }, end: { x: width - 50, y: ctx.y + 10 }, thickness: 2, color: rgb(...PDF_COLOR_GRAY_LIGHT) });
    ctx.y -= 20;

    // --- Lesson Meta ---
    const dateStr = new Date().toLocaleDateString();
    drawTextSafe(ctx, `Classe: ${lesson.classe}   |   Materia: ${lesson.materia}`, { size: 12 });
    drawTextSafe(ctx, `Docente: ${settings.nomeInsegnante}   |   Data Assegnazione: ${dateStr}`, { size: 12 });
    ctx.y -= 10;

    // --- Lesson Topic ---
    drawSectionTitle(ctx, 'Argomento della Lezione');
    drawTextSafe(ctx, lesson.contenuto, { maxWidth: width - 100 });
    
    if (lesson.obiettivi) {
        ctx.y -= 10;
        drawTextSafe(ctx, 'Obiettivi Didattici:', { isBold: true, size: 11 });
        drawTextSafe(ctx, lesson.obiettivi.replace(/•/g, '-'), { maxWidth: width - 100, indent: 10, size: 10 });
    }

    // --- HOMEWORK SECTION (Highlighted) ---
    ctx.y -= 20;
    const boxTop = ctx.y;
    // Draw background for homework box later or assume white. Let's just use text.
    
    ctx.page.drawRectangle({
        x: 40, y: ctx.y - 100, width: width - 80, height: 120,
        color: rgb(...PDF_COLOR_CREAM), // Light purple bg
        borderColor: rgb(...PDF_COLOR_PURPLE_LIGHT),
        borderWidth: 1
    });
    
    ctx.y -= 20;
    drawTextSafe(ctx, 'COMPITI PER CASA', { isBold: true, size: 14, color: rgb(...PDF_COLOR_PURPLE_LIGHT), indent: 10 });
    ctx.y -= 10;
    
    if (lesson.compiti) {
        drawTextSafe(ctx, lesson.compiti, { size: 12, maxWidth: width - 120, indent: 10 });
    } else {
        drawTextSafe(ctx, 'Nessun compito specifico assegnato.', { size: 12, indent: 10, color: rgb(...PDF_COLOR_GRAY_MEDIUM) });
    }
    
    // Reset Y after box (approximate manual spacing since we drew box blindly)
    ctx.y = boxTop - 140;

    // --- Materials & Notes ---
    if (lesson.materialiDidattici && lesson.materialiDidattici.length > 0) {
        drawSectionTitle(ctx, 'Materiali di Studio');
        lesson.materialiDidattici.forEach(mat => {
            const label = mat.label || mat.fileName || (mat.file && mat.file.name) || 'Materiale';
            const type = mat.type === 'link' ? '(Link)' : mat.type === 'kb' ? '(Documento KB)' : '(File)';
            drawTextSafe(ctx, `• ${label} ${type}`, { indent: 10 });
            if (mat.type === 'link' && mat.url) {
                drawTextSafe(ctx, mat.url, { indent: 25, size: 9, color: rgb(...PDF_COLOR_BLUE_LIGHT) });
            }
        });
    }

    // --- Footer / Student Section ---
    ctx.y -= 40;
    addNewPageIfNeeded(ctx, 100);
    
    ctx.page.drawLine({ start: { x: 50, y: ctx.y }, end: { x: width - 50, y: ctx.y }, thickness: 1, color: rgb(...PDF_COLOR_GRAY_LIGHT), dashArray: [5, 5] });
    ctx.y -= 20;
    drawTextSafe(ctx, 'Spazio Studente / Note Famiglia:', { size: 10, color: rgb(...PDF_COLOR_GRAY_MEDIUM) });
    ctx.page.drawRectangle({ x: 50, y: ctx.y - 60, width: width - 100, height: 60, borderWidth: 1, borderColor: rgb(...PDF_COLOR_GRAY_LIGHT) });

    const pdfBytes = await pdfDoc.save();
    return new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
};

// --- NEW FUNCTION: CERTIFICAZIONE COMPETENZE ---
/**
 * Genera il documento di certificazione delle competenze in formato PDF.
 * @param student Dati dello studente
 * @param competencyData Array di competenze e relativi livelli raggiunti
 * @param settings Impostazioni globali
 * @returns Blob del PDF generato
 */
export const generateCertificazioneCompetenzePdf = async (student: Studente, competencyData: { competencyName: string; level: string }[], settings: TimetableSettings): Promise<Blob> => {
    const pdfLib = await loadPdfLib();
    const { PDFDocument, rgb, StandardFonts, PageSizes } = pdfLib;
    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const page = pdfDoc.addPage(PageSizes.A4);
    const { width, height } = page.getSize();
    const ctx: PdfContext = { doc: pdfDoc, page, y: height - 50, font, boldFont, width, height, margin: 50, fontSize: 11 };

    // Header
    drawTextSafe(ctx, 'CERTIFICAZIONE DELLE COMPETENZE', { isBold: true, size: 16, align: 'center' });
    drawTextSafe(ctx, 'Al termine del primo ciclo di istruzione', { size: 12, align: 'center' });
    ctx.y -= 20;

    // Student Info
    drawTextSafe(ctx, `L'alunno/a: ${student.cognome} ${student.nome}`, { isBold: true });
    drawTextSafe(ctx, `Nato/a il: ${student.dataNascita || '__________'}`, { indent: 0 });
    drawTextSafe(ctx, `Classe: ${student.classe} - Anno Scolastico: ${settings.annoScolasticoCorrente}`);
    ctx.y -= 20;

    // Introduction
    drawTextSafe(ctx, "Visti gli atti d'ufficio relativi alle valutazioni espresse dagli insegnanti,");
    drawTextSafe(ctx, "si certifica che l'alunno/a ha raggiunto i seguenti livelli di competenza:");
    ctx.y -= 15;

    // Table Header
    const col1X = 50;
    const col2X = 350;
    ctx.page.drawText("Competenza Chiave Europea", { x: col1X, y: ctx.y, font: boldFont, size: 10 });
    ctx.page.drawText("Livello (A-D)", { x: col2X, y: ctx.y, font: boldFont, size: 10 });
    ctx.y -= 15;
    ctx.page.drawLine({ start: { x: col1X, y: ctx.y + 10 }, end: { x: width - 50, y: ctx.y + 10 }, thickness: 1 });

    // Rows
    competencyData.forEach(item => {
        addNewPageIfNeeded(ctx, 30);
        ctx.page.drawText(cleanTextForWinAnsi(item.competencyName), { x: col1X, y: ctx.y, font, size: 10, maxWidth: 280 });
        
        // Draw Level Badge
        const levelBoxColor = item.level === 'A' ? rgb(...PDF_COLOR_GREEN_LEVEL_A) : item.level === 'B' ? rgb(...PDF_COLOR_YELLOW_LEVEL_B) : item.level === 'C' ? rgb(...PDF_COLOR_ORANGE_LEVEL_C) : rgb(...PDF_COLOR_RED_LEVEL_D);
        ctx.page.drawRectangle({ x: col2X - 5, y: ctx.y - 2, width: 30, height: 14, color: levelBoxColor });
        ctx.page.drawText(item.level, { x: col2X + 5, y: ctx.y + 2, font: boldFont, size: 10, color: rgb(...PDF_COLOR_BLACK) });
        
        ctx.y -= 25;
        ctx.page.drawLine({ start: { x: col1X, y: ctx.y + 20 }, end: { x: width - 50, y: ctx.y + 20 }, thickness: 0.5, color: rgb(...PDF_COLOR_GRAY_LIGHT) });
    });

    // Legend
    ctx.y -= 20;
    addNewPageIfNeeded(ctx, 80);
    drawTextSafe(ctx, "Legenda Livelli:", { isBold: true, size: 10 });
    drawTextSafe(ctx, "A - Avanzato: Svolge compiti complessi con padronanza e responsabilità.", { size: 9, indent: 10 });
    drawTextSafe(ctx, "B - Intermedio: Svolge compiti e risolve problemi in situazioni nuove.", { size: 9, indent: 10 });
    drawTextSafe(ctx, "C - Base: Svolge compiti semplici anche in situazioni nuove.", { size: 9, indent: 10 });
    drawTextSafe(ctx, "D - Iniziale: Svolge compiti semplici se guidato.", { size: 9, indent: 10 });

    // Signatures
    ctx.y -= 40;
    addNewPageIfNeeded(ctx, 50);
    drawTextSafe(ctx, `Data: ${new Date().toLocaleDateString()}`);
    ctx.page.drawText("Il Dirigente Scolastico", { x: 350, y: ctx.y + 10, font, size: 11 });
    ctx.page.drawLine({ start: { x: 350, y: ctx.y - 10 }, end: { x: 500, y: ctx.y - 10 }, thickness: 1 });

    const pdfBytes = await pdfDoc.save();
    return new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
};

// ... (Existing functions: generateUdaPdf, generateLessonPdf, etc. remain unchanged)
export const generateUdaPdf = async (uda: Uda, allCompetenze: Competenza[], settings: TimetableSettings, docType: 'docente' | 'studente'): Promise<Blob> => {
    const pdfLib = await loadPdfLib();
    const { PDFDocument, rgb, StandardFonts, PageSizes } = pdfLib;
    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const page = pdfDoc.addPage(PageSizes.A4);
    const { width, height } = page.getSize();
    const ctx: PdfContext = { doc: pdfDoc, page, y: height - 50, font, boldFont, width, height, margin: 50, fontSize: 11 };

    // Header
    drawTextSafe(ctx, settings.nomeIstituto || 'Istituto Scolastico', { isBold: true, size: 10, color: rgb(...PDF_COLOR_GRAY_DARK) });
    const title = docType === 'docente' ? `PROGETTAZIONE UDA: ${uda.title}` : `GUIDA AL PROGETTO: ${uda.title}`;
    drawTextSafe(ctx, title, { isBold: true, size: 18, color: rgb(...PDF_COLOR_BLUE_DARK) });
    ctx.y -= 10;
    ctx.page.drawLine({ start: { x: 50, y: ctx.y }, end: { x: width - 50, y: ctx.y }, thickness: 1, color: rgb(...PDF_COLOR_GRAY_LIGHT) });
    ctx.y -= 20;

    // Info
    drawTextSafe(ctx, `Classe: ${uda.classe} | Materia: ${uda.materia}`, { size: 12 });
    drawTextSafe(ctx, `Docente: ${settings.nomeInsegnante}`, { size: 12 });
    ctx.y -= 10;

    // Introduction
    drawSectionTitle(ctx, 'Introduzione');
    drawTextSafe(ctx, uda.introduction, { maxWidth: width - 100 });

    // Final Product
    drawSectionTitle(ctx, 'Prodotto Finale');
    drawTextSafe(ctx, uda.finalProduct, { maxWidth: width - 100 });

    // Competenze (only for docente)
    if (docType === 'docente' && uda.competencyIds.length > 0) {
        drawSectionTitle(ctx, 'Competenze Target');
        uda.competencyIds.forEach(id => {
            const comp = allCompetenze.find(c => c.id === id);
            if (comp) {
                drawTextSafe(ctx, `• ${comp.nome} (${comp.codice})`, { indent: 10, maxWidth: width - 110 });
            }
        });
    }

    // Phases
    drawSectionTitle(ctx, 'Fasi di Lavoro');
    uda.phases.forEach((phase, idx) => {
        ctx.y -= 5;
        drawTextSafe(ctx, `Fase ${idx + 1}: ${phase.title} (${phase.duration})`, { isBold: true, size: 12 });
        drawTextSafe(ctx, `Descrizione: ${phase.description}`, { indent: 10, maxWidth: width - 110 });
        drawTextSafe(ctx, `Attività: ${phase.activities}`, { indent: 10, maxWidth: width - 110, size: 10, color: rgb(...PDF_COLOR_GRAY_MEDIUM) });
    });

    // Evaluation (only for docente)
    if (docType === 'docente') {
        drawSectionTitle(ctx, 'Valutazione');
        drawTextSafe(ctx, uda.evaluation, { maxWidth: width - 100 });
    }

    // Tools
    drawSectionTitle(ctx, 'Strumenti e Risorse');
    drawTextSafe(ctx, uda.tools, { maxWidth: width - 100 });

    const pdfBytes = await pdfDoc.save();
    return new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
};
export const generateLessonPdf = async (lesson: Lezione): Promise<Blob> => {
    const pdfLib = await loadPdfLib();
    const { PDFDocument, rgb, StandardFonts, PageSizes } = pdfLib;
    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const page = pdfDoc.addPage(PageSizes.A4);
    const { width, height } = page.getSize();
    const ctx: PdfContext = { doc: pdfDoc, page, y: height - 50, font, boldFont, width, height, margin: 50, fontSize: 11 };

    drawTextSafe(ctx, 'RELAZIONE DI LEZIONE', { isBold: true, size: 18, color: rgb(...PDF_COLOR_GREEN_LIGHT) });
    ctx.y -= 10;
    ctx.page.drawLine({ start: { x: 50, y: ctx.y }, end: { x: width - 50, y: ctx.y }, thickness: 1, color: rgb(...PDF_COLOR_GRAY_LIGHT) });
    ctx.y -= 20;

    drawTextSafe(ctx, `Classe: ${lesson.classe} | Materia: ${lesson.materia}`, { size: 12, isBold: true });
    ctx.y -= 10;

    drawSectionTitle(ctx, 'Argomento');
    drawTextSafe(ctx, lesson.contenuto, { maxWidth: width - 100 });

    if (lesson.obiettivi) {
        drawSectionTitle(ctx, 'Obiettivi');
        drawTextSafe(ctx, lesson.obiettivi, { maxWidth: width - 100 });
    }

    if (lesson.compiti) {
        drawSectionTitle(ctx, 'Compiti Assegnati');
        drawTextSafe(ctx, lesson.compiti, { maxWidth: width - 100 });
    }

    if (lesson.nota) {
        drawSectionTitle(ctx, 'Note Docente');
        drawTextSafe(ctx, lesson.nota, { maxWidth: width - 100 });
    }

    const pdfBytes = await pdfDoc.save();
    return new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
};
export const generateStudentProfilePdf = async (student: Studente, evaluations: Valutazione[], competencyEvaluations: ValutazioneCompetenza[], settings: TimetableSettings): Promise<Blob> => {
    const pdfLib = await loadPdfLib();
    const { PDFDocument, rgb, StandardFonts, PageSizes } = pdfLib;
    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const page = pdfDoc.addPage(PageSizes.A4);
    const { width, height } = page.getSize();
    const ctx: PdfContext = { doc: pdfDoc, page, y: height - 50, font, boldFont, width, height, margin: 50, fontSize: 11 };

    drawTextSafe(ctx, 'PROFILO STUDENTE', { isBold: true, size: 20, color: rgb(...PDF_COLOR_BLUE_LIGHT) });
    ctx.y -= 10;
    ctx.page.drawLine({ start: { x: 50, y: ctx.y }, end: { x: width - 50, y: ctx.y }, thickness: 1, color: rgb(...PDF_COLOR_GRAY_LIGHT) });
    ctx.y -= 20;

    drawTextSafe(ctx, `${student.cognome} ${student.nome}`, { isBold: true, size: 16 });
    drawTextSafe(ctx, `Classe: ${student.classe}`, { size: 12 });
    ctx.y -= 10;

    // Evaluations Summary
    if (evaluations.length > 0) {
        drawSectionTitle(ctx, 'Valutazioni Disciplinari');
        const subjects = Array.from(new Set(evaluations.map(e => e.materia)));
        subjects.forEach(sub => {
            const subEvals = evaluations.filter(e => e.materia === sub);
            const avg = subEvals.reduce((acc, e) => acc + parseFloat(e.voto.replace(',', '.')), 0) / subEvals.length;
            drawTextSafe(ctx, `${sub}: Media ${avg.toFixed(2)} (${subEvals.length} voti)`, { indent: 10 });
        });
    }

    // Competencies
    if (competencyEvaluations.length > 0) {
        drawSectionTitle(ctx, 'Livelli di Competenza');
        competencyEvaluations.forEach(ce => {
            drawTextSafe(ctx, `• ${ce.competenzaId}: Livello ${ce.livelloId} (${ce.materia})`, { indent: 10 });
        });
    }

    const pdfBytes = await pdfDoc.save();
    return new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
};
export const generatePdfBrochure = async (content: BrochureContent): Promise<Blob> => {
    const pdfLib = await loadPdfLib();
    const { PDFDocument, rgb, StandardFonts, PageSizes } = pdfLib;
    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const page = pdfDoc.addPage(PageSizes.A4);
    const { width, height } = page.getSize();
    const ctx: PdfContext = { doc: pdfDoc, page, y: height - 50, font, boldFont, width, height, margin: 50, fontSize: 11 };

    drawTextSafe(ctx, content.brochureTitle, { isBold: true, size: 24, color: rgb(...PDF_COLOR_RED_LIGHT), align: 'center' });
    ctx.y -= 20;
    drawTextSafe(ctx, content.introduction, { maxWidth: width - 100 });
    ctx.y -= 20;

    content.useCases.forEach(section => {
        drawSectionTitle(ctx, section.title);
        section.benefits.forEach(item => {
            drawTextSafe(ctx, `• ${item}`, { indent: 10, maxWidth: width - 110 });
        });
        ctx.y -= 10;
    });

    const pdfBytes = await pdfDoc.save();
    return new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
};
export const generateCouncilDataPdf = async (selectedClass: string, periodo: PeriodoValutazione, students: Studente[], evaluations: Valutazione[], competencyEvaluations: ValutazioneCompetenza[], settings: TimetableSettings): Promise<Blob> => {
    const jsPdfModule = await loadJsPdf();
    const { jsPDF } = jsPdfModule;
    const doc = new jsPDF({ orientation: 'landscape' });
    
    doc.setFontSize(18);
    doc.text(`Dati Consiglio di Classe - ${selectedClass}`, 14, 20);
    doc.setFontSize(12);
    doc.text(`Periodo: ${periodo} | Data: ${new Date().toLocaleDateString()}`, 14, 30);

    const tableData = students.map(s => {
        const studentEvals = evaluations.filter(e => e.studenteId === s.id);
        const avg = studentEvals.length > 0 
            ? (studentEvals.reduce((acc, e) => acc + parseFloat(e.voto.replace(',', '.')), 0) / studentEvals.length).toFixed(2)
            : 'N/A';
        return [s.cognome, s.nome, avg, studentEvals.length];
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (doc as any).autoTable({
        head: [['Cognome', 'Nome', 'Media Generale', 'Num. Valutazioni']],
        body: tableData,
        startY: 40,
    });

    return doc.output('blob');
};
export const generateCouncilTablePdf = async (selectedClass: string, periodo: PeriodoValutazione, annoScolastico: string, students: Studente[], evaluations: Valutazione[], giudizi: Record<string, GiudizioPeriodico>, settings: TimetableSettings, showFinalGrades: boolean): Promise<Blob> => {
    const jsPdfModule = await loadJsPdf();
    const { jsPDF } = jsPdfModule;
    const doc = new jsPDF({ orientation: 'landscape' });

    doc.setFontSize(18);
    doc.text(`Tabellone Scrutinio - ${selectedClass}`, 14, 20);
    doc.setFontSize(12);
    doc.text(`A.S. ${annoScolastico} | Periodo: ${periodo}`, 14, 30);

    const subjects = Array.from(new Set(evaluations.map(e => e.materia)));
    const head = ['Studente', ...subjects];
    if (showFinalGrades) head.push('Media');

    const body = students.map(s => {
        const row = [`${s.cognome} ${s.nome}`];
        let total = 0;
        let count = 0;
        subjects.forEach(sub => {
            const subEvals = evaluations.filter(e => e.studenteId === s.id && e.materia === sub);
            if (subEvals.length > 0) {
                const avg = subEvals.reduce((acc, e) => acc + parseFloat(e.voto.replace(',', '.')), 0) / subEvals.length;
                row.push(avg.toFixed(1));
                total += avg;
                count++;
            } else {
                row.push('-');
            }
        });
        if (showFinalGrades) {
            row.push(count > 0 ? (total / count).toFixed(2) : '-');
        }
        return row;
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (doc as any).autoTable({
        head: [head],
        body: body,
        startY: 40,
        styles: { fontSize: 8 },
    });

    return doc.output('blob');
};
export const generateFullAppGuidePdf = async (
    essayContent: EssayContent | null,
    faqContent: FaqItem[],
    specsContent: TechnicalDocumentContent,
    techInfo: Record<string, unknown>,
    vocalGuide: VocalAssistantGuide
): Promise<Blob> => {
    const pdfLib = await loadPdfLib();
    const { PDFDocument, rgb, StandardFonts, PageSizes } = pdfLib;
    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const page = pdfDoc.addPage(PageSizes.A4);
    const { width, height } = page.getSize();
    const ctx: PdfContext = { doc: pdfDoc, page, y: height - 50, font, boldFont, width, height, margin: 50, fontSize: 11 };

    drawTextSafe(ctx, 'GUIDA COMPLETA DOCENTEDOC AI', { isBold: true, size: 22, color: rgb(...PDF_COLOR_BLUE_DARK), align: 'center' });
    ctx.y -= 20;

    if (essayContent) {
        drawSectionTitle(ctx, essayContent.title);
        drawTextSafe(ctx, essayContent.content, { maxWidth: width - 100 });
    }

    drawSectionTitle(ctx, 'Domande Frequenti (FAQ)');
    faqContent.forEach(faq => {
        drawTextSafe(ctx, `D: ${faq.q}`, { isBold: true, indent: 5, maxWidth: width - 105 });
        drawTextSafe(ctx, `R: ${faq.a}`, { indent: 10, maxWidth: width - 110 });
        ctx.y -= 5;
    });

    drawSectionTitle(ctx, 'Specifiche Tecniche');
    drawTextSafe(ctx, specsContent.title, { isBold: true });
    specsContent.specs.forEach(spec => drawTextSafe(ctx, `• ${spec}`, { indent: 10, maxWidth: width - 110 }));

    drawSectionTitle(ctx, 'Assistente Vocale');
    drawTextSafe(ctx, vocalGuide.title, { isBold: true, size: 16 });
    vocalGuide.sections.forEach(sec => {
        drawTextSafe(ctx, sec.title, { isBold: true, indent: 5 });
        sec.commands.forEach(cmd => drawTextSafe(ctx, `> ${cmd}`, { indent: 10 }));
    });

    const pdfBytes = await pdfDoc.save();
    return new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
};

