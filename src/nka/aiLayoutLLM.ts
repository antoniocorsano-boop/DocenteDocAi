/* eslint-disable @typescript-eslint/no-explicit-any */
// LLM integration for AI-driven neural map layout (async, ready for Gemini/OpenAI)
import { NKANode } from './types';
import { NodePosition } from './aiLayout';
import { buildLayoutPrompt } from './aiPromptTemplates';
import { generateContent } from '../services/aiService';

/**
 * Call an LLM to get optimal node positions for the neural map.
 * Replace fetch logic with your preferred AI service (Gemini, OpenAI, etc).
 */
export async function getLLMNeuralLayout(nodes: readonly NKANode[], width: number, height: number, userContext: any): Promise<NodePosition[]> {
  const prompt = buildLayoutPrompt(nodes, userContext);
  try {
    const response = await generateContent(prompt, { temperature: 0.3, maxTokens: 2000 });
    const positions = JSON.parse(response.content.trim());
    // Merge positions with node data
    return nodes.map(node => {
      const pos = positions.find((p: any) => p.id === node.id);
      return {
        ...node,
        x: pos ? Math.max(0, Math.min(width, pos.x)) : width / 2,
        y: pos ? Math.max(0, Math.min(height, pos.y)) : height / 2,
      };
    });
  } catch (error) {
    console.error('Failed to get LLM layout, falling back to spiral:', error);
    // Fallback to spiral demo
    const angleStep = (2 * Math.PI) / Math.max(nodes.length, 1);
    return nodes.map((node, i) => ({
      ...node,
      x: width / 2 + Math.cos(i * angleStep) * (width / 3) * (1 + i * 0.1),
      y: height / 2 + Math.sin(i * angleStep) * (height / 3) * (1 + i * 0.1),
    }));
  }
}
