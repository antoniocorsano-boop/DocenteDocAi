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

import React, { useState } from 'react';
import M3Typography from '../ui/M3Typography';
import M3Card from '../ui/M3Card';
import M3Button from '../ui/M3Button';
import { EmotionalPreset } from '../../types';

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
  const [previewPreset, setPreviewPreset] = useState<EmotionalPreset | undefined>(selectedPreset);

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
    setPreviewPreset(preset);
    onPresetChange(preset);
  };

  const handleClearPreset = () => {
    setPreviewPreset(undefined);
    onPresetChange(undefined);
  };

  return (
    <div className={`emotional-presets-manager ${className}`}>
      <div className="presets-header" style={{ marginBottom: 'var(--md-sys-spacing-6)' }}>
        <M3Typography variant="headline-small" style={{ marginBottom: 'var(--md-sys-spacing-2)' }}>
          Stile Emozionale
        </M3Typography>
        <M3Typography variant="body-medium" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
          Scegli come l'interfaccia dovrebbe adattarsi al tuo stato d'animo
        </M3Typography>
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
            style={{
              padding: 'var(--md-sys-spacing-4)',
              cursor: 'pointer',
              transition: 'all var(--md-sys-motion-duration-medium2) var(--md-sys-motion-easing-standard)',
              border: selectedPreset === preset.id ? `2px solid ${preset.color}` : 'none'
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
                  fontSize: '24px'
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>
                  {preset.icon}
                </span>
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