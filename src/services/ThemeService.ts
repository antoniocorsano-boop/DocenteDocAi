import { createTheme, applyTheme } from '../design-system';
import { generateThemeFromPrompt } from './aiService';
import { AppThemeState, AiSettings, ColorTokens } from '../types';

/**
 * ThemeService centralizes the logic for theme application and generation.
 * It acts as a bridge between the application state (Zustand) and the design system.
 */
export const ThemeService = {
  /**
   * Maps AppThemeState to the design system and applies it to the DOM.
   * This is the primary method for synchronizing the UI with the theme state.
   */
  applyThemeState(state: AppThemeState): void {
    if (!state) return;

    const theme = createTheme({
      name: state.customizationName || state.generatedName || 'Default',
      mode: state.mode === 'system' ? 'light' : state.mode,
      visualStyle: state.visualStyle,
      colors: state.customColors || state.generatedColors,
      glassBlur: state.glassBlur,
      radiusMultiplier: state.radiusMultiplier,
      fontScale: state.fontScale,
      contrastLevel: state.contrastLevel
    });

    applyTheme(theme);
  },

  /**
   * Generates a new theme using AI based on a prompt.
   * Returns the generated name and color tokens.
   */
  async generateViaAi(prompt: string, aiSettings: AiSettings): Promise<{
    name: string;
    colors: Partial<ColorTokens>;
  }> {
    const generated = await generateThemeFromPrompt(aiSettings, prompt);
    
    // Map the AI response to our ColorTokens structure
    return {
      name: generated.name || 'AI Generated',
      colors: {
        primary: generated.primary,
        secondary: generated.secondary,
        tertiary: generated.tertiary
      } as Partial<ColorTokens>
    };
  }
};
