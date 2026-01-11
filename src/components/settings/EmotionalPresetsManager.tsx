import React, { useState, useEffect } from 'react';
import { useTheme, PresetOverrides } from '../../theme/theme';
import M3Typography from '../ui/M3Typography';
import M3Card from '../ui/M3Card';
import { M3Button } from '../M3Button';
import { EmotionalPreset } from '../../types';

interface EmotionalPresetsManagerProps {
  selectedPreset: EmotionalPreset | null;
  onPresetChange: (preset: EmotionalPreset) => void;
}

interface PresetDefinition {
  name: string;
  description: string;
  overrides: PresetOverrides;
}

// Define all emotional presets
const presets: Record<EmotionalPreset, PresetDefinition | undefined> = {
  calm: {
    name: 'Calm',
    description: 'Soft colors, generous spacing, slow motion, relaxed typography for a serene experience.',
    overrides: {
      sys: {
        colors: {
          primary: 'var(--md-sys-color-primary)',
          onPrimary: 'var(--md-sys-color-on-primary)',
          secondary: 'var(--md-sys-color-secondary)',
          onSecondary: 'var(--md-sys-color-on-secondary)',
          tertiary: 'var(--md-sys-color-tertiary)',
          onTertiary: 'var(--md-sys-color-on-tertiary)',
          surface: 'var(--md-sys-color-surface)',
          onSurface: 'var(--md-sys-color-on-surface)',
          background: 'var(--md-sys-color-background)',
          onBackground: 'var(--md-sys-color-on-background)',
          secondaryContainer: 'var(--md-sys-color-secondary-container)',
          onSecondaryContainer: 'var(--md-sys-color-on-secondary-container)',
          outline: 'var(--md-sys-color-outline)',
          surfaceContainerLow: 'var(--md-sys-color-surface-container-low)',
          primaryHover: 'var(--md-sys-color-primary)',
        },
      },
      ref: {
        spacing: {
          '1': 'var(--md-sys-spacing-1)',
          '2': 'var(--md-sys-spacing-2)',
          '3': 'var(--md-sys-spacing-3)',
          '4': '20px',
          '5': '24px',
          '6': '32px',
          '7': 'var(--md-sys-spacing-7)',
          '8': 'var(--md-sys-spacing-8)',
          '9': 'var(--md-sys-spacing-9)',
          '10': 'var(--md-sys-spacing-10)',
          '11': 'var(--md-sys-spacing-11)',
          '12': 'var(--md-sys-spacing-12)',
        },
        typography: {
          body1: { fontSize: '16px', lineHeight: '24px', fontWeight: '300', letterSpacing: 'var(--md-sys-typography-body1-letter-spacing)' },
          body2: { fontSize: '14px', lineHeight: '20px', fontWeight: '300', letterSpacing: 'var(--md-sys-typography-body2-letter-spacing)' },
          heading1: { fontSize: '32px', lineHeight: '40px', fontWeight: '300', letterSpacing: 'var(--md-sys-typography-heading1-letter-spacing)' },
          heading2: { fontSize: '24px', lineHeight: '32px', fontWeight: '300', letterSpacing: 'var(--md-sys-typography-heading2-letter-spacing)' },
          caption: { fontSize: '12px', lineHeight: '16px', fontWeight: '400', letterSpacing: 'var(--md-sys-typography-caption-letter-spacing)' },
          labelSmall: { fontSize: 'var(--md-sys-typography-label-small-size)', lineHeight: 'var(--md-sys-typography-label-small-line-height)', fontWeight: 'var(--md-sys-typography-label-small-weight)', letterSpacing: 'var(--md-sys-typography-label-small-letter-spacing)' },
          labelMedium: { fontSize: 'var(--md-sys-typography-label-medium-size)', lineHeight: 'var(--md-sys-typography-label-medium-line-height)', fontWeight: 'var(--md-sys-typography-label-medium-weight)', letterSpacing: 'var(--md-sys-typography-label-medium-letter-spacing)' },
          labelLarge: { fontSize: 'var(--md-sys-typography-label-large-size)', lineHeight: 'var(--md-sys-typography-label-large-line-height)', fontWeight: 'var(--md-sys-typography-label-large-weight)', letterSpacing: 'var(--md-sys-typography-label-large-letter-spacing)' },
        },
        shape: {
          small: 'var(--md-sys-shape-small)',
          medium: 'var(--md-sys-shape-medium)',
          large: 'var(--md-sys-shape-large)',
        },
      },
      motion: {
        easing: {
          standard: 'cubic-bezier(0.4, 0, 0.6, 1)',
          emphasized: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        },
        duration: {
          short1: '50ms',
          short2: 'var(--md-sys-motion-short2)',
          short3: 'var(--md-sys-motion-short3)',
          short4: 'var(--md-sys-motion-short4)',
          medium1: 'var(--md-sys-motion-medium1)',
          medium2: '400ms',
          medium3: '550ms',
          medium4: 'var(--md-sys-motion-medium4)',
        },
      },
    },
  },
  energetic: {
    name: 'Energetic',
    description: 'Vibrant colors, tight spacing, fast motion, bold typography for an exciting vibe.',
    overrides: {
      sys: {
        colors: {
          primary: 'var(--md-sys-color-primary)',
          onPrimary: 'var(--md-sys-color-on-primary)',
          secondary: 'var(--md-sys-color-secondary)',
          onSecondary: 'var(--md-sys-color-on-secondary)',
          tertiary: 'var(--md-sys-color-tertiary)',
          onTertiary: 'var(--md-sys-color-on-tertiary)',
          surface: 'var(--md-sys-color-surface)',
          onSurface: 'var(--md-sys-color-on-surface)',
          background: 'var(--md-sys-color-background)',
          onBackground: 'var(--md-sys-color-on-background)',
          secondaryContainer: 'var(--md-sys-color-secondary-container)',
          onSecondaryContainer: 'var(--md-sys-color-on-secondary-container)',
          outline: 'var(--md-sys-color-outline)',
          surfaceContainerLow: 'var(--md-sys-color-surface-container-low)',
          primaryHover: 'var(--md-sys-color-primary)',
        },
      },
      ref: {
        spacing: {
          '1': '2px',
          '2': '6px',
          '3': '10px',
          '4': '12px',
          '5': 'var(--md-sys-spacing-5)',
          '6': 'var(--md-sys-spacing-6)',
          '7': 'var(--md-sys-spacing-7)',
          '8': 'var(--md-sys-spacing-8)',
          '9': 'var(--md-sys-spacing-9)',
          '10': 'var(--md-sys-spacing-10)',
          '11': 'var(--md-sys-spacing-11)',
          '12': 'var(--md-sys-spacing-12)',
        },
        typography: {
          body1: { fontSize: '16px', lineHeight: '24px', fontWeight: '600', letterSpacing: 'var(--md-sys-typography-body1-letter-spacing)' },
          body2: { fontSize: '14px', lineHeight: '20px', fontWeight: '600', letterSpacing: 'var(--md-sys-typography-body2-letter-spacing)' },
          heading1: { fontSize: '32px', lineHeight: '40px', fontWeight: '700', letterSpacing: 'var(--md-sys-typography-heading1-letter-spacing)' },
          heading2: { fontSize: '24px', lineHeight: '32px', fontWeight: '700', letterSpacing: 'var(--md-sys-typography-heading2-letter-spacing)' },
          caption: { fontSize: '12px', lineHeight: '16px', fontWeight: '400', letterSpacing: 'var(--md-sys-typography-caption-letter-spacing)' },
          labelSmall: { fontSize: 'var(--md-sys-typography-label-small-size)', lineHeight: 'var(--md-sys-typography-label-small-line-height)', fontWeight: 'var(--md-sys-typography-label-small-weight)', letterSpacing: 'var(--md-sys-typography-label-small-letter-spacing)' },
          labelMedium: { fontSize: 'var(--md-sys-typography-label-medium-size)', lineHeight: 'var(--md-sys-typography-label-medium-line-height)', fontWeight: 'var(--md-sys-typography-label-medium-weight)', letterSpacing: 'var(--md-sys-typography-label-medium-letter-spacing)' },
          labelLarge: { fontSize: 'var(--md-sys-typography-label-large-size)', lineHeight: 'var(--md-sys-typography-label-large-line-height)', fontWeight: 'var(--md-sys-typography-label-large-weight)', letterSpacing: 'var(--md-sys-typography-label-large-letter-spacing)' },
        },
        shape: {
          small: 'var(--md-sys-shape-small)',
          medium: 'var(--md-sys-shape-medium)',
          large: 'var(--md-sys-shape-large)',
        },
      },
      motion: {
        easing: {
          standard: 'cubic-bezier(0.4, 0, 0.2, 1)',
          emphasized: 'cubic-bezier(0.05, 0.7, 0.1, 1.0)',
        },
        duration: {
          short1: '25ms',
          short2: 'var(--md-sys-motion-short2)',
          short3: 'var(--md-sys-motion-short3)',
          short4: '200ms',
          medium1: 'var(--md-sys-motion-medium1)',
          medium2: '300ms',
          medium3: 'var(--md-sys-motion-medium3)',
          medium4: 'var(--md-sys-motion-medium4)',
        },
      },
    },
  },
  creative: undefined,
  focused: undefined,
  relaxed: undefined,
  professional: undefined,
  playful: undefined,
  minimal: undefined
};

const EmotionalPresetsManager: React.FC<EmotionalPresetsManagerProps> = ({
  selectedPreset,
  onPresetChange
}) => {
  const { layers, updateOverrides, resetOverrides } = useTheme();
  const { spacing } = layers.ref;
  const [hoveredPreset, setHoveredPreset] = useState<EmotionalPreset | null>(null);

  useEffect(() => {
    const activePreset = hoveredPreset || selectedPreset;
    if (activePreset && presets[activePreset]) {
      updateOverrides(presets[activePreset].overrides);
    } else {
      resetOverrides();
    }
  }, [hoveredPreset, selectedPreset, updateOverrides, resetOverrides]);

  const handleSelect = (preset: EmotionalPreset) => {
    onPresetChange(preset);
  };

  return (
    <div style={{ padding: spacing['4'], display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: spacing['4'] }}>
      {(Object.keys(presets) as EmotionalPreset[]).map((presetKey) => {
        const preset = presets[presetKey];
        if (!preset) return null;
        const isSelected = selectedPreset === presetKey;
        const isHovered = hoveredPreset === presetKey;
        return (
          <M3Card
            key={presetKey}
            style={{
              padding: spacing['4'],
              cursor: 'pointer',
              border: isSelected ? `2px solid var(--md-sys-color-primary)` : 'none',
              opacity: isHovered ? 0.8 : 1,
            }}
            onMouseEnter={() => setHoveredPreset(presetKey)}
            onMouseLeave={() => setHoveredPreset(null)}
            onClick={() => handleSelect(presetKey)}
          >
            <M3Typography variant="title-medium" style={{ marginBottom: spacing['2'] }}>
              {preset.name}
            </M3Typography>
            <M3Typography variant="body-medium" style={{ marginBottom: spacing['3'] }}>
              {preset.description}
            </M3Typography>
            {isSelected ? (
              <M3Typography variant="body-large" style={{ color: 'var(--md-sys-color-primary)' }}>
                Selected
              </M3Typography>
            ) : (
              <M3Button>
                Select
              </M3Button>
            )}
          </M3Card>
        );
      })}
    </div>
  );
};

export default EmotionalPresetsManager;
