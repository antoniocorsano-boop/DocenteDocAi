import React, { useState, useEffect } from 'react';
import { useTheme, ThemeOverrides } from '../../theme/theme';
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
  overrides: ThemeOverrides;
}

const presets: Record<EmotionalPreset, PresetDefinition> = {
  calm: {
    name: 'Calm',
    description: 'Soft colors, generous spacing, slow motion, relaxed typography for a serene experience.',
    overrides: {
      colors: {
        primary: 'var(--md-sys-color-primary)',
        secondary: 'var(--md-sys-color-secondary)',
        tertiary: 'var(--md-sys-color-tertiary)',
        surface: 'var(--md-sys-color-surface)',
        onSurface: 'var(--md-sys-color-on-surface)',
        background: 'var(--md-sys-color-background)',
        onBackground: 'var(--md-sys-color-on-background)',
      },
      spacing: {
        '4': '20px',
        '5': '24px',
        '6': '32px',
      },
      motion: {
        easing: {
          standard: 'cubic-bezier(0.4, 0, 0.6, 1)',
          standardDecelerate: 'cubic-bezier(0.0, 0.0, 0.0, 1.0)',
          standardAccelerate: 'cubic-bezier(0.3, 0.0, 1.0, 1.0)',
          emphasized: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          emphasizedDecelerate: 'cubic-bezier(0.05, 0.7, 0.1, 1.0)',
          emphasizedAccelerate: 'cubic-bezier(0.3, 0.0, 0.2, 0.8)',
        },
        duration: {
          short1: '50ms',
          short2: '150ms',
          short3: '150ms',
          short4: '200ms',
          medium1: '250ms',
          medium2: '400ms',
          medium3: '350ms',
          medium4: '400ms',
          long1: '450ms',
          long2: '500ms',
          long3: '550ms',
          long4: '600ms',
          extraLong1: '700ms',
          extraLong2: '800ms',
          extraLong3: '900ms',
          extraLong4: '1000ms',
        },
      },
      typography: {
        body1: { fontSize: '16px', lineHeight: '24px', fontWeight: '300' },
        body2: { fontSize: '14px', lineHeight: '20px', fontWeight: '300' },
        heading1: { fontSize: '32px', lineHeight: '40px', fontWeight: '300' },
        heading2: { fontSize: '24px', lineHeight: '32px', fontWeight: '300' },
        caption: { fontSize: '12px', lineHeight: '16px', fontWeight: '400' },
      },
    },
  },
  energetic: {
    name: 'Energetic',
    description: 'Vibrant colors, tight spacing, fast motion, bold typography for an exciting vibe.',
    overrides: {
      colors: {
        primary: 'var(--md-sys-color-primary)',
        secondary: 'var(--md-sys-color-secondary)',
        tertiary: 'var(--md-sys-color-tertiary)',
        surface: 'var(--md-sys-color-surface)',
        onSurface: 'var(--md-sys-color-on-surface)',
        background: 'var(--md-sys-color-background)',
        onBackground: 'var(--md-sys-color-on-background)',
      },
      spacing: {
        '1': '2px',
        '2': '6px',
        '3': '10px',
        '4': '12px',
      },
      motion: {
        easing: {
          standard: 'cubic-bezier(0.4, 0, 0.2, 1)',
          standardDecelerate: 'cubic-bezier(0.0, 0.0, 0.0, 1.0)',
          standardAccelerate: 'cubic-bezier(0.3, 0.0, 1.0, 1.0)',
          emphasized: 'cubic-bezier(0.05, 0.7, 0.1, 1.0)',
          emphasizedDecelerate: 'cubic-bezier(0.05, 0.7, 0.1, 1.0)',
          emphasizedAccelerate: 'cubic-bezier(0.3, 0.0, 0.2, 0.8)',
        },
        duration: {
          short1: '25ms',
          short2: '75ms',
          short3: '150ms',
          short4: '200ms',
          medium1: '200ms',
          medium2: '300ms',
          medium3: '350ms',
          medium4: '400ms',
          long1: '450ms',
          long2: '500ms',
          long3: '550ms',
          long4: '600ms',
          extraLong1: '700ms',
          extraLong2: '800ms',
          extraLong3: '900ms',
          extraLong4: '1000ms',
        },
      },
      typography: {
        body1: { fontSize: '16px', lineHeight: '24px', fontWeight: '600' },
        body2: { fontSize: '14px', lineHeight: '20px', fontWeight: '600' },
        heading1: { fontSize: '32px', lineHeight: '40px', fontWeight: '700' },
        heading2: { fontSize: '24px', lineHeight: '32px', fontWeight: '700' },
        caption: { fontSize: '12px', lineHeight: '16px', fontWeight: '400' },
      },
    },
  },
  creative: {
    name: 'Creative',
    description: 'Playful colors, varied spacing, bouncy motion, artistic typography for inspiration.',
    overrides: {
      colors: {
        primary: 'var(--md-sys-color-primary)',
        secondary: 'var(--md-sys-color-secondary)',
        tertiary: 'var(--md-sys-color-tertiary)',
        surface: 'var(--md-sys-color-surface)',
        onSurface: 'var(--md-sys-color-on-surface)',
        background: 'var(--md-sys-color-background)',
        onBackground: 'var(--md-sys-color-on-background)',
      },
      spacing: {
        '2': '10px',
        '4': '18px',
        '6': '28px',
      },
      motion: {
        easing: {
          standard: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
          standardDecelerate: 'cubic-bezier(0.0, 0.0, 0.0, 1.0)',
          standardAccelerate: 'cubic-bezier(0.3, 0.0, 1.0, 1.0)',
          emphasized: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
          emphasizedDecelerate: 'cubic-bezier(0.05, 0.7, 0.1, 1.0)',
          emphasizedAccelerate: 'cubic-bezier(0.3, 0.0, 0.2, 0.8)',
        },
        duration: {
          short1: '50ms',
          short2: '120ms',
          short3: '150ms',
          short4: '200ms',
          medium1: '250ms',
          medium2: '350ms',
          medium3: '350ms',
          medium4: '400ms',
          long1: '450ms',
          long2: '500ms',
          long3: '550ms',
          long4: '600ms',
          extraLong1: '700ms',
          extraLong2: '800ms',
          extraLong3: '900ms',
          extraLong4: '1000ms',
        },
      },
      typography: {
        body1: { fontSize: '17px', lineHeight: '24px', fontWeight: '400' },
        body2: { fontSize: '15px', lineHeight: '20px', fontWeight: '400' },
        heading1: { fontSize: '34px', lineHeight: '40px', fontWeight: '500' },
        heading2: { fontSize: '26px', lineHeight: '32px', fontWeight: '500' },
        caption: { fontSize: '12px', lineHeight: '16px', fontWeight: '400' },
      },
    },
  },
  focused: {
    name: 'Focused',
    description: 'Neutral colors, compact spacing, precise motion, clear typography for concentration.',
    overrides: {
      colors: {
        primary: 'var(--md-sys-color-primary)',
        secondary: 'var(--md-sys-color-secondary)',
        tertiary: 'var(--md-sys-color-tertiary)',
        surface: 'var(--md-sys-color-surface)',
        onSurface: 'var(--md-sys-color-on-surface)',
        background: 'var(--md-sys-color-background)',
        onBackground: 'var(--md-sys-color-on-background)',
      },
      spacing: {
        '1': '3px',
        '2': '7px',
        '3': '11px',
        '4': '14px',
      },
      motion: {
        easing: {
          standard: 'cubic-bezier(0.4, 0, 0.2, 1)',
          standardDecelerate: 'cubic-bezier(0.0, 0.0, 0.0, 1.0)',
          standardAccelerate: 'cubic-bezier(0.3, 0.0, 1.0, 1.0)',
          emphasized: 'cubic-bezier(0.05, 0.7, 0.1, 1.0)',
          emphasizedDecelerate: 'cubic-bezier(0.05, 0.7, 0.1, 1.0)',
          emphasizedAccelerate: 'cubic-bezier(0.3, 0.0, 0.2, 0.8)',
        },
        duration: {
          short1: '40ms',
          short2: '80ms',
          short3: '150ms',
          short4: '200ms',
          medium1: '220ms',
          medium2: '300ms',
          medium3: '350ms',
          medium4: '400ms',
          long1: '450ms',
          long2: '500ms',
          long3: '550ms',
          long4: '600ms',
          extraLong1: '700ms',
          extraLong2: '800ms',
          extraLong3: '900ms',
          extraLong4: '1000ms',
        },
      },
      typography: {
        body1: { fontSize: '16px', lineHeight: '24px', fontWeight: '500' },
        body2: { fontSize: '14px', lineHeight: '20px', fontWeight: '500' },
        heading1: { fontSize: '32px', lineHeight: '40px', fontWeight: '600' },
        heading2: { fontSize: '24px', lineHeight: '32px', fontWeight: '600' },
        caption: { fontSize: '12px', lineHeight: '16px', fontWeight: '400' },
      },
    },
  },
  relaxed: {
    name: 'Relaxed',
    description: 'Warm colors, comfortable spacing, gentle motion, easy typography for leisure.',
    overrides: {
      colors: {
        primary: 'var(--md-sys-color-primary)',
        secondary: 'var(--md-sys-color-secondary)',
        tertiary: 'var(--md-sys-color-tertiary)',
        surface: 'var(--md-sys-color-surface)',
        onSurface: 'var(--md-sys-color-on-surface)',
        background: 'var(--md-sys-color-background)',
        onBackground: 'var(--md-sys-color-on-background)',
      },
      spacing: {
        '3': '14px',
        '4': '18px',
        '5': '22px',
        '6': '28px',
      },
      motion: {
        easing: {
          standard: 'cubic-bezier(0.4, 0, 0.6, 1)',
          standardDecelerate: 'cubic-bezier(0.0, 0.0, 0.0, 1.0)',
          standardAccelerate: 'cubic-bezier(0.3, 0.0, 1.0, 1.0)',
          emphasized: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          emphasizedDecelerate: 'cubic-bezier(0.05, 0.7, 0.1, 1.0)',
          emphasizedAccelerate: 'cubic-bezier(0.3, 0.0, 0.2, 0.8)',
        },
        duration: {
          short1: '50ms',
          short2: '130ms',
          short3: '150ms',
          short4: '200ms',
          medium1: '250ms',
          medium2: '380ms',
          medium3: '350ms',
          medium4: '400ms',
          long1: '450ms',
          long2: '500ms',
          long3: '550ms',
          long4: '600ms',
          extraLong1: '700ms',
          extraLong2: '800ms',
          extraLong3: '900ms',
          extraLong4: '1000ms',
        },
      },
      typography: {
        body1: { fontSize: '16px', lineHeight: '24px', fontWeight: '400' },
        body2: { fontSize: '14px', lineHeight: '20px', fontWeight: '400' },
        heading1: { fontSize: '32px', lineHeight: '40px', fontWeight: '400' },
        heading2: { fontSize: '24px', lineHeight: '32px', fontWeight: '400' },
        caption: { fontSize: '12px', lineHeight: '16px', fontWeight: '400' },
      },
    },
  },
  professional: {
    name: 'Professional',
    description: 'Subdued colors, balanced spacing, smooth motion, formal typography for business.',
    overrides: {
      colors: {
        primary: 'var(--md-sys-color-primary)',
        secondary: 'var(--md-sys-color-secondary)',
        tertiary: 'var(--md-sys-color-tertiary)',
        surface: 'var(--md-sys-color-surface)',
        onSurface: 'var(--md-sys-color-on-surface)',
        background: 'var(--md-sys-color-background)',
        onBackground: 'var(--md-sys-color-on-background)',
      },
      spacing: {
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '5': '20px',
      },
      motion: {
        easing: {
          standard: 'cubic-bezier(0.4, 0, 0.2, 1)',
          standardDecelerate: 'cubic-bezier(0.0, 0.0, 0.0, 1.0)',
          standardAccelerate: 'cubic-bezier(0.3, 0.0, 1.0, 1.0)',
          emphasized: 'cubic-bezier(0.05, 0.7, 0.1, 1.0)',
          emphasizedDecelerate: 'cubic-bezier(0.05, 0.7, 0.1, 1.0)',
          emphasizedAccelerate: 'cubic-bezier(0.3, 0.0, 0.2, 0.8)',
        },
        duration: {
          short1: '50ms',
          short2: '100ms',
          short3: '150ms',
          short4: '200ms',
          medium1: '250ms',
          medium2: '300ms',
          medium3: '350ms',
          medium4: '400ms',
          long1: '450ms',
          long2: '500ms',
          long3: '550ms',
          long4: '600ms',
          extraLong1: '700ms',
          extraLong2: '800ms',
          extraLong3: '900ms',
          extraLong4: '1000ms',
        },
      },
      typography: {
        body1: { fontSize: '16px', lineHeight: '24px', fontWeight: '400' },
        body2: { fontSize: '14px', lineHeight: '20px', fontWeight: '400' },
        heading1: { fontSize: '32px', lineHeight: '40px', fontWeight: '500' },
        heading2: { fontSize: '24px', lineHeight: '32px', fontWeight: '500' },
        caption: { fontSize: '12px', lineHeight: '16px', fontWeight: '400' },
      },
    },
  },
  playful: {
    name: 'Playful',
    description: 'Fun colors, irregular spacing, lively motion, whimsical typography for joy.',
    overrides: {
      colors: {
        primary: 'var(--md-sys-color-primary)',
        secondary: 'var(--md-sys-color-secondary)',
        tertiary: 'var(--md-sys-color-tertiary)',
        surface: 'var(--md-sys-color-surface)',
        onSurface: 'var(--md-sys-color-on-surface)',
        background: 'var(--md-sys-color-background)',
        onBackground: 'var(--md-sys-color-on-background)',
      },
      spacing: {
        '1': '5px',
        '3': '13px',
        '5': '21px',
      },
      motion: {
        easing: {
          standard: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
          standardDecelerate: 'cubic-bezier(0.0, 0.0, 0.0, 1.0)',
          standardAccelerate: 'cubic-bezier(0.3, 0.0, 1.0, 1.0)',
          emphasized: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
          emphasizedDecelerate: 'cubic-bezier(0.05, 0.7, 0.1, 1.0)',
          emphasizedAccelerate: 'cubic-bezier(0.3, 0.0, 0.2, 0.8)',
        },
        duration: {
          short1: '50ms',
          short2: '110ms',
          short3: '150ms',
          short4: '200ms',
          medium1: '250ms',
          medium2: '330ms',
          medium3: '350ms',
          medium4: '400ms',
          long1: '450ms',
          long2: '500ms',
          long3: '550ms',
          long4: '600ms',
          extraLong1: '700ms',
          extraLong2: '800ms',
          extraLong3: '900ms',
          extraLong4: '1000ms',
        },
      },
      typography: {
        body1: { fontSize: '16px', lineHeight: '24px', fontWeight: '400' },
        body2: { fontSize: '14px', lineHeight: '20px', fontWeight: '400' },
        heading1: { fontSize: '33px', lineHeight: '40px', fontWeight: '600' },
        heading2: { fontSize: '25px', lineHeight: '32px', fontWeight: '600' },
        caption: { fontSize: '12px', lineHeight: '16px', fontWeight: '400' },
      },
    },
  },
  minimal: {
    name: 'Minimal',
    description: 'Monochrome colors, sparse spacing, subtle motion, clean typography for simplicity.',
    overrides: {
      colors: {
        primary: 'var(--md-sys-color-primary)',
        secondary: 'var(--md-sys-color-secondary)',
        tertiary: 'var(--md-sys-color-tertiary)',
        surface: 'var(--md-sys-color-surface)',
        onSurface: 'var(--md-sys-color-on-surface)',
        background: 'var(--md-sys-color-background)',
        onBackground: 'var(--md-sys-color-on-background)',
      },
      spacing: {
        '1': '4px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
      },
      motion: {
        easing: {
          standard: 'cubic-bezier(0.4, 0, 0.2, 1)',
          standardDecelerate: 'cubic-bezier(0.0, 0.0, 0.0, 1.0)',
          standardAccelerate: 'cubic-bezier(0.3, 0.0, 1.0, 1.0)',
          emphasized: 'cubic-bezier(0.05, 0.7, 0.1, 1.0)',
          emphasizedDecelerate: 'cubic-bezier(0.05, 0.7, 0.1, 1.0)',
          emphasizedAccelerate: 'cubic-bezier(0.3, 0.0, 0.2, 0.8)',
        },
        duration: {
          short1: '50ms',
          short2: '100ms',
          short3: '150ms',
          short4: '200ms',
          medium1: '250ms',
          medium2: '300ms',
          medium3: '350ms',
          medium4: '400ms',
          long1: '450ms',
          long2: '500ms',
          long3: '550ms',
          long4: '600ms',
          extraLong1: '700ms',
          extraLong2: '800ms',
          extraLong3: '900ms',
          extraLong4: '1000ms',
        },
      },
      typography: {
        body1: { fontSize: '16px', lineHeight: '24px', fontWeight: '400' },
        body2: { fontSize: '14px', lineHeight: '20px', fontWeight: '400' },
        heading1: { fontSize: '32px', lineHeight: '40px', fontWeight: '400' },
        heading2: { fontSize: '24px', lineHeight: '32px', fontWeight: '400' },
        caption: { fontSize: '12px', lineHeight: '16px', fontWeight: '400' },
      },
    },
  },
};

const EmotionalPresetsManager: React.FC<EmotionalPresetsManagerProps> = ({
  selectedPreset,
  onPresetChange
}) => {
  const { updateOverrides, resetOverrides, spacing } = useTheme();
  const [hoveredPreset, setHoveredPreset] = useState<EmotionalPreset | null>(null);

  useEffect(() => {
    const activePreset = hoveredPreset || selectedPreset;
    if (activePreset) {
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
              <M3Button variant="primary" size="small">
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