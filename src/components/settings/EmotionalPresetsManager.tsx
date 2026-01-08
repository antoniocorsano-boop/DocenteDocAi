/**
 * EmotionalPresetsManager Component - Phase 1 Foundation
 *
 * Manages the selection and preview of emotional style presets.
 * Provides an intuitive interface for users to choose how the UI should adapt
 * to their emotional state, with live preview capabilities.
 *
 * @version 1.0.0 - Phase 1 Implementation
 * @since 2026-01-08
 */

import React, { useState, useCallback } from 'react';
import M3Typography from '../ui/M3Typography';
import M3Card from '../ui/M3Card';
import M3Button from '../ui/M3Button';
import { EmotionalPreset } from '../../types';
import { ThemeService } from '../../services/ThemeService';

interface EmotionalPresetOption {
  id: EmotionalPreset;
  name: string;
  description: string;
  icon: string;
  color: string;
}

interface EmotionalPresetsManagerProps {
  selectedPreset?: EmotionalPreset;
  onPresetChange: (preset: EmotionalPreset | undefined) => void;
  className?: string;
}

const EmotionalPresetsManager: React.FC<EmotionalPresetsManagerProps> = ({
  selectedPreset,
  onPresetChange,
  className = ''
}) => {
  const [previewPreset, setPreviewPreset] = useState<EmotionalPreset | undefined>(undefined);
  const [isPreviewing, setIsPreviewing] = useState(false);

  const handlePresetHover = useCallback((preset: EmotionalPreset) => {
    if (isPreviewing) return; // Prevent multiple previews
    
    setPreviewPreset(preset);
    setIsPreviewing(true);
    
    // Apply preview theme
    const previewState = {
      mode: 'light' as const,
      visualStyle: 'aura' as const,
      customizationName: 'Preview',
      uiMode: 'classic' as const,
      emotionalPreset: preset
    };
    
    ThemeService.applyThemeState(previewState);
  }, [isPreviewing]);

  const handlePresetLeave = useCallback(() => {
    if (!isPreviewing) return;
    
    setIsPreviewing(false);
    setPreviewPreset(undefined);
    
    // Restore original theme
    const originalState = {
      mode: 'light' as const,
      visualStyle: 'aura' as const,
      customizationName: 'Default',
      uiMode: 'classic' as const,
      emotionalPreset: selectedPreset
    };
    
    ThemeService.applyThemeState(originalState);
  }, [isPreviewing, selectedPreset]);

  const presetOptions: EmotionalPresetOption[] = [
    {
      id: 'calm',
      name: 'Calmo',
      description: 'Toni rilassanti, spaziatura ampia, movimenti fluidi',
      icon: 'spa',
      color: 'var(--md-sys-color-primary-light)'
    },
    {
      id: 'energetic',
      name: 'Energico',
      description: 'Colori vivaci, contrasto alto, animazioni dinamiche',
      icon: 'flash_on',
      color: 'var(--md-sys-color-primary)'
    },
    {
      id: 'creative',
      name: 'Creativo',
      description: 'Colori caldi, forme morbide, ispirazione artistica',
      icon: 'palette',
      color: 'var(--md-sys-color-tertiary)'
    },
    {
      id: 'focused',
      name: 'Concentrato',
      description: 'Contrasto elevato, colori neutri, distrazioni minime',
      icon: 'center_focus_strong',
      color: 'var(--md-sys-color-outline)'
    },
    {
      id: 'relaxed',
      name: 'Rilassato',
      description: 'Colori pastello, spaziatura generosa, atmosfera tranquilla',
      icon: 'self_improvement',
      color: 'var(--md-sys-color-secondary-light)'
    },
    {
      id: 'professional',
      name: 'Professionale',
      description: 'Colori formali, equilibrio perfetto, affidabilità',
      icon: 'business_center',
      color: 'var(--md-sys-color-primary)'
    },
    {
      id: 'playful',
      name: 'Giocoso',
      description: 'Colori brillanti, forme irregolari, energia positiva',
      icon: 'celebration',
      color: 'var(--md-sys-color-tertiary)'
    },
    {
      id: 'minimal',
      name: 'Minimale',
      description: 'Colori monocromatici, pulizia essenziale, semplicità',
      icon: 'remove',
      color: 'var(--md-sys-color-on-surface)'
    }
  ];

  const handlePresetSelect = (preset: EmotionalPreset) => {
    setPreviewPreset(undefined);
    setIsPreviewing(false);
    onPresetChange(preset);
  };

  const handleClearPreset = () => {
    setPreviewPreset(undefined);
    setIsPreviewing(false);
    onPresetChange(undefined);
  };

  return (
    <div className={`emotional-presets-manager ${className}`}>
      <div className="presets-header" style={{ marginBottom: 'var(--md-sys-spacing-6)' }}>
        <M3Typography variant="headline-small" style={{ marginBottom: 'var(--md-sys-spacing-2)' }}>
          Stile Emozionale
        </M3Typography>
        <M3Typography variant="body-medium" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
          Passa il mouse sui preset per vedere un'anteprima dal vivo. Clicca per applicare permanentemente.
        </M3Typography>
        {isPreviewing && (
          <div style={{
            marginTop: 'var(--md-sys-spacing-3)',
            padding: 'var(--md-sys-spacing-2) var(--md-sys-spacing-4)',
            backgroundColor: 'var(--md-sys-color-primary-container)',
            borderRadius: 'var(--md-sys-shape-corner-large)',
            border: '1px solid var(--md-sys-color-primary)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--md-sys-spacing-2)'
          }}>
            <span className="material-symbols-outlined" style={{ 
              fontSize: '16px', 
              color: 'var(--md-sys-color-on-primary-container)' 
            }}>
              visibility
            </span>
            <M3Typography variant="label-small" style={{ 
              color: 'var(--md-sys-color-on-primary-container)',
              fontWeight: '600'
            }}>
              Anteprima: {presetOptions.find(p => p.id === previewPreset)?.name}
            </M3Typography>
          </div>
        )}
      </div>

      <div
        className="presets-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 'var(--md-sys-spacing-4)',
          marginBottom: 'var(--md-sys-spacing-6)'
        }}
      >
        {presetOptions.map((preset) => (
          <M3Card
            key={preset.id}
            variant="elevated"
            onClick={() => handlePresetSelect(preset.id)}
            onMouseEnter={() => handlePresetHover(preset.id)}
            onMouseLeave={handlePresetLeave}
            style={{
              padding: 'var(--md-sys-spacing-4)',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              border: selectedPreset === preset.id ? `2px solid ${preset.color}` : 
                     previewPreset === preset.id ? `2px solid ${preset.color}60` : '1px solid var(--md-sys-color-outline-variant)',
              backgroundColor: selectedPreset === preset.id ? 
                             'var(--md-sys-color-primary-container)' :
                             previewPreset === preset.id ? 
                             'var(--md-sys-color-secondary-container)' : 
                             'var(--md-sys-color-surface-container)',
              transform: previewPreset === preset.id ? 'scale(1.02)' : 'scale(1)',
              boxShadow: previewPreset === preset.id ? 
                        `var(--md-sys-elevation-level-3), 0 0 20px ${preset.color}30` : 
                        selectedPreset === preset.id ?
                        'var(--md-sys-elevation-level-2)' :
                        'var(--md-sys-elevation-level-1)',
              position: 'relative',
              overflow: 'hidden',
              filter: previewPreset === preset.id ? 'brightness(1.05)' : 'brightness(1)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--md-sys-spacing-3)' }}>
              <div
                className="preset-icon"
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: 'var(--md-sys-shape-corner-large)',
                  backgroundColor: preset.color,
                  color: 'var(--md-sys-color-on-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  transform: previewPreset === preset.id ? 'scale(1.1) rotate(5deg)' : 'scale(1) rotate(0deg)',
                  boxShadow: previewPreset === preset.id ? 
                           `0 4px 12px ${preset.color}40` : 
                           'none',
                  position: 'relative'
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>
                  {preset.icon}
                </span>
                {selectedPreset === preset.id && (
                  <div style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-4px',
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--md-sys-color-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px solid var(--md-sys-color-surface)'
                  }}>
                    <span className="material-symbols-outlined" style={{ 
                      fontSize: '12px', 
                      color: 'var(--md-sys-color-on-primary)' 
                    }}>
                      check
                    </span>
                  </div>
                )}
              </div>

              <div style={{ flex: 1 }}>
                <M3Typography variant="title-medium" style={{ marginBottom: 'var(--md-sys-spacing-1)' }}>
                  {preset.name}
                </M3Typography>
                <M3Typography variant="body-small" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
                  {preset.description}
                </M3Typography>
              </div>
            </div>
          </M3Card>
        ))}
      </div>

      <div className="presets-actions" style={{ display: 'flex', gap: 'var(--md-sys-spacing-3)' }}>
        <M3Button
          variant="outlined"
          onClick={handleClearPreset}
          disabled={!selectedPreset}
        >
          Ripristina Predefinito
        </M3Button>

        {selectedPreset && (
          <M3Typography variant="label-medium" style={{ alignSelf: 'center', color: 'var(--md-sys-color-on-surface-variant)' }}>
            Stile attivo: {presetOptions.find(p => p.id === selectedPreset)?.name}
          </M3Typography>
        )}
      </div>
    </div>
  );
};

export default EmotionalPresetsManager;