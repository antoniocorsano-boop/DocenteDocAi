/* eslint-disable @typescript-eslint/no-explicit-any */
// LLM integration for AI-generated wizard steps (Gemini/OpenAI ready)
import { NKANode } from './types';
import { NKAWizardStep } from './wizardAI';
import { buildWizardPrompt } from './wizardAIPromptTemplates';
import { generateContent } from '../services/aiService';

export async function generateWizardForNodeLLM(node: NKANode, userContext: any): Promise<NKAWizardStep[]> {
  const prompt = buildWizardPrompt(node, userContext);
  const response = await generateContent(prompt, {
    temperature: 0.5,
    maxTokens: 900,
    stop: undefined
  });
  try {
    return JSON.parse(response.content) as NKAWizardStep[];
  } catch (e) {
    // Fallback: single step
    return [{
      id: node.id + '-fallback',
      title: `Esplora ${node.label}`,
      description: 'Step generato automaticamente. (Parsing fallito)',
      actions: node.actions
    }];
  }
}
