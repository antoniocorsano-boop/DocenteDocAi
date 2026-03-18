/**
 * documentAI/index.ts — Public barrel for the Document AI pipeline.
 *
 * Full pipeline:
 *   ExtendedInput (image)
 *     → extractText()      ocrService
 *     → parseDocument()    documentParser
 *     → detectDocumentIntent()  intentDetector
 *     → DocumentIntent     → returned to actionRouter
 *
 * Usage:
 *   import { processImageInput } from '@/services/documentAI';
 *   const intent = await processImageInput(input);
 *   // then route via actionRouter
 */

export type { ExtendedInput, DocumentType, ParsedDocument, DocumentIntent, OcrResult } from './types';
export { extractText } from './ocrService';
export { parseDocument } from './documentParser';
export { detectDocumentIntent } from './intentDetector';

import type { ExtendedInput, DocumentIntent } from './types';
import { extractText } from './ocrService';
import { parseDocument } from './documentParser';
import { detectDocumentIntent } from './intentDetector';

/**
 * Full Document AI pipeline: image input → DocumentIntent.
 *
 * This is the single entry point for image-based inputs.
 * Never throws — returns a show_next_step intent on unrecoverable failure.
 */
export async function processImageInput(input: Extract<ExtendedInput, { type: 'image' }>): Promise<DocumentIntent> {
  const ocr = await extractText(input.content, input.mimeType);
  const doc = parseDocument(ocr.rawText, ocr.confidence);
  return detectDocumentIntent(doc);
}
