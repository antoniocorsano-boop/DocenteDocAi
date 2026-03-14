/**
 * Vercel Serverless Function — AI proxy for Google Gemini
 *
 * This proxy keeps the GEMINI_API_KEY on the server (never bundled in client JS).
 * Set GEMINI_API_KEY as a Vercel environment variable (without the VITE_ prefix).
 *
 * POST /api/ai
 * Body: { model, contents, config? }
 * Response: { text: string }
 */
import type { VercelRequest, VercelResponse } from '@vercel/node';

const GOOGLE_AI_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';

// Rate-limit safeguard: reject payloads over 1MB
const MAX_BODY_BYTES = 1_000_000;

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check server-side key
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(503).json({ error: 'AI service not configured on server' });
  }

  const { model, contents, config } = req.body as {
    model: string;
    contents: string | unknown[];
    config?: {
      responseMimeType?: string;
      systemInstruction?: string;
      generationConfig?: {
        temperature?: number;
        maxOutputTokens?: number;
        stopSequences?: string[];
      };
      tools?: unknown[];
    };
  };

  // Input validation
  if (!model || typeof model !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid model' });
  }
  if (!contents) {
    return res.status(400).json({ error: 'Missing contents' });
  }

  // Sanitize model name: only allow alphanumeric, dash, dot, underscore
  const safeModel = model.replace(/[^a-zA-Z0-9\-_.]/g, '');
  if (!safeModel) {
    return res.status(400).json({ error: 'Invalid model name' });
  }

  // Build request body for Google REST API
  type GeminiContent = { role: string; parts: { text: string }[] };
  const geminiContents: GeminiContent[] = Array.isArray(contents)
    ? (contents as GeminiContent[])
    : [{ role: 'user', parts: [{ text: String(contents) }] }];

  // Reject if body is too large
  const bodySize = JSON.stringify(geminiContents).length;
  if (bodySize > MAX_BODY_BYTES) {
    return res.status(413).json({ error: 'Request payload too large' });
  }

  const requestBody: Record<string, unknown> = { contents: geminiContents };

  if (config?.generationConfig) {
    requestBody.generationConfig = config.generationConfig;
  }
  if (config?.responseMimeType) {
    // Merge into generationConfig
    requestBody.generationConfig = {
      ...(requestBody.generationConfig as object | undefined ?? {}),
      responseMimeType: config.responseMimeType,
    };
  }
  if (config?.systemInstruction) {
    requestBody.systemInstruction = {
      parts: [{ text: String(config.systemInstruction) }],
    };
  }
  if (config?.tools) {
    requestBody.tools = config.tools;
  }

  const url = `${GOOGLE_AI_BASE}/${safeModel}:generateContent?key=${apiKey}`;

  let googleResponse: Response;
  try {
    googleResponse = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });
  } catch (err) {
    return res.status(502).json({ error: 'Failed to reach AI service', detail: String(err) });
  }

  if (!googleResponse.ok) {
    const errText = await googleResponse.text();
    return res.status(googleResponse.status).json({ error: errText });
  }

  const data = (await googleResponse.json()) as {
    candidates?: { content?: { parts?: { text?: string }[] } }[];
  };

  const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
  return res.status(200).json({ text });
}
