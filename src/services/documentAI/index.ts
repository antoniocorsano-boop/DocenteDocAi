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
import { processDocumentIntoGraph } from '../knowledgeGraph/pipeline';
import type { DocumentGraphResult } from '../knowledgeGraph/pipeline';

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

/**
 * Extended pipeline: image input → DocumentIntent + Knowledge Graph result.
 *
 * Runs the same Document AI pipeline as `processImageInput`, and additionally:
 *   1. Creates/updates the document KGNode
 *   2. Stores/versions the DocumentMemory (rawText + structuredData + confidence)
 *   3. Auto-links to known students and classes via name similarity
 *
 * @param input     - Image input (base64 + mimeType)
 * @param sourceKey - Optional stable deduplication key (file name, SHA, etc.).
 *                    When provided, re-processing results in a versioned update
 *                    rather than a new document node.
 */
export async function processImageInputWithGraph(
  input: Extract<ExtendedInput, { type: 'image' }>,
  sourceKey?: string,
): Promise<{ intent: DocumentIntent; graphResult: DocumentGraphResult }> {
  const ocr = await extractText(input.content, input.mimeType);
  const doc = parseDocument(ocr.rawText, ocr.confidence);
  const intent = detectDocumentIntent(doc);
  const graphResult = processDocumentIntoGraph(intent, ocr.rawText, ocr.confidence, sourceKey);
  return { intent, graphResult };
}

export type { DocumentGraphResult };
