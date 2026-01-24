// LEGACY - MD3 Non-compliant
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

const presets: Record<EmotionalPreset, { name: string; description: string; overrides: PresetOverrides } | undefined> = {
  calm: {
    name: 'Calm',
    description: 'Soft colors, generous spacing, slow motion, gentle typography for relaxation.',
    overrides: {
      sys: {
        colors: {
          primary: sys.colors.2196f3,
          onPrimary: sys.colors.ffffff,
          secondary: sys.colors.4caf50,
          onSecondary: sys.colors.ffffff,
          tertiary: sys.colors.ff9800,
          onTertiary: sys.colors.000000,
          surface: sys.colors.ffffff,
          onSurface: sys.colors.000000,
          background: sys.colors.f5f5f5,
          onBackground: sys.colors.000000,
          secondaryContainer: sys.colors.e8f5e8,
          onSecondaryContainer: sys.colors.000000,
          outline: sys.colors.bdbdbd,
          surfaceContainerLow: sys.colors.f5f5f5,
          surfaceContainerHigh: sys.colors.e0e0e0,
          outlineVariant: sys.colors.d0d0d0,
          error: sys.colors.d32f2f,
          onError: sys.colors.ffffff,
          errorContainer: sys.colors.ffcdd2,
          onErrorContainer: sys.colors.000000,
          primaryContainer: sys.colors.e3f2fd,
          onPrimaryContainer: sys.colors.000000,
          primaryHover: sys.colors.1976d2,
          scrim: sys.colors.000000,
          surfaceVariant: sys.colors.f5f5f5,
          onSurfaceVariant: sys.colors.000000
        },
      }
    },
  },
  energetic: {
    name: 'Energetic',
    description: 'Vibrant colors, tight spacing, fast motion, bold typography for an exciting vibe.',
    overrides: {
      sys: {
        colors: {
          primary: sys.colors.ff5722,
          onPrimary: sys.colors.ffffff,
          secondary: sys.colors.03dac6,
          onSecondary: sys.colors.000000,
          tertiary: sys.colors.3700b3,
          onTertiary: sys.colors.ffffff,
          surface: sys.colors.ffffff,
          onSurface: sys.colors.000000,
          background: sys.colors.f5f5f5,
          onBackground: sys.colors.000000,
          secondaryContainer: sys.colors.e0f7fa,
          onSecondaryContainer: sys.colors.000000,
          outline: sys.colors.bdbdbd,
          surfaceContainerLow: sys.colors.f5f5f5,
          surfaceContainerHigh: sys.colors.e0e0e0,
          outlineVariant: sys.colors.d0d0d0,
          error: sys.colors.d32f2f,
          onError: sys.colors.ffffff,
          errorContainer: sys.colors.ffcdd2,
          onErrorContainer: sys.colors.000000,
          primaryContainer: sys.colors.ffcc02,
          onPrimaryContainer: sys.colors.000000,
          primaryHover: sys.colors.e64a19,
          scrim: sys.colors.000000,
          surfaceVariant: sys.colors.f5f5f5,
          onSurfaceVariant: sys.colors.000000
        },
      }
    },
  },
  creative: {
    name: 'Creative',
    description: 'Colorful and spacious for creativity.',
    overrides: {
      sys: {
        colors: {
          primary: sys.colors.9c27b0,
          onPrimary: sys.colors.ffffff,
          secondary: sys.colors.ff9800,
          onSecondary: sys.colors.000000,
          tertiary: sys.colors.4caf50,
          onTertiary: sys.colors.ffffff,
          surface: sys.colors.ffffff,
          onSurface: sys.colors.000000,
          background: sys.colors.f3e5f5,
          onBackground: sys.colors.000000,
          secondaryContainer: sys.colors.fff3e0,
          onSecondaryContainer: sys.colors.000000,
          outline: sys.colors.ce93d8,
          surfaceContainerLow: sys.colors.f3e5f5,
          surfaceContainerHigh: sys.colors.e1bee7,
          outlineVariant: sys.colors.ba68c8,
          error: sys.colors.d32f2f,
          onError: sys.colors.ffffff,
          errorContainer: sys.colors.ffcdd2,
          onErrorContainer: sys.colors.000000,
          primaryContainer: sys.colors.f3e5f5,
          onPrimaryContainer: sys.colors.000000,
          primaryHover: sys.colors.7b1fa2,
          scrim: sys.colors.000000,
          surfaceVariant: sys.colors.f3e5f5,
          onSurfaceVariant: sys.colors.000000
        },
      }
    },
  },
  focused: {
    name: 'Focused',
    description: 'Neutral colors, standard spacing, clear typography for concentration.',
    overrides: {
      sys: {
        colors: {
          primary: sys.colors.1976d2,
          onPrimary: sys.colors.ffffff,
          secondary: sys.colors.757575,
          onSecondary: sys.colors.ffffff,
          tertiary: sys.colors.607d8b,
          onTertiary: sys.colors.ffffff,
          surface: sys.colors.ffffff,
          onSurface: sys.colors.000000,
          background: sys.colors.fafafa,
          onBackground: sys.colors.000000,
          secondaryContainer: sys.colors.f5f5f5,
          onSecondaryContainer: sys.colors.000000,
          outline: sys.colors.bdbdbd,
          surfaceContainerLow: sys.colors.fafafa,
          surfaceContainerHigh: sys.colors.f0f0f0,
          outlineVariant: sys.colors.9e9e9e,
          error: sys.colors.d32f2f,
          onError: sys.colors.ffffff,
          errorContainer: sys.colors.ffcdd2,
          onErrorContainer: sys.colors.000000,
          primaryContainer: sys.colors.e3f2fd,
          onPrimaryContainer: sys.colors.000000,
          primaryHover: sys.colors.1565c0,
          scrim: sys.colors.000000,
          surfaceVariant: sys.colors.fafafa,
          onSurfaceVariant: sys.colors.000000
        },
      }
    },
  },
  relaxed: {
    name: 'Relaxed',
    description: 'Soft colors, generous spacing, light typography for calm.',
    overrides: {
      sys: {
        colors: {
          primary: sys.colors.8bc34a,
          onPrimary: sys.colors.000000,
          secondary: sys.colors.009688,
          onSecondary: sys.colors.ffffff,
          tertiary: sys.colors.795548,
          onTertiary: sys.colors.ffffff,
          surface: sys.colors.ffffff,
          onSurface: sys.colors.000000,
          background: sys.colors.e8f5e8,
          onBackground: sys.colors.000000,
          secondaryContainer: sys.colors.e0f2f1,
          onSecondaryContainer: sys.colors.000000,
          outline: sys.colors.c8e6c9,
          surfaceContainerLow: sys.colors.e8f5e8,
          surfaceContainerHigh: sys.colors.c8e6c9,
          outlineVariant: sys.colors.a5d6a7,
          error: sys.colors.d32f2f,
          onError: sys.colors.ffffff,
          errorContainer: sys.colors.ffcdd2,
          onErrorContainer: sys.colors.000000,
          primaryContainer: sys.colors.e8f5e8,
          onPrimaryContainer: sys.colors.000000,
          primaryHover: sys.colors.689f38,
          scrim: sys.colors.000000,
          surfaceVariant: sys.colors.e8f5e8,
          onSurfaceVariant: sys.colors.000000
        },
      }
    },
  },
  professional: {
    name: 'Professional',
    description: 'Conservative colors, balanced spacing, formal typography for business.',
    overrides: {
      sys: {
        colors: {
          primary: sys.colors.212121,
          onPrimary: sys.colors.ffffff,
          secondary: sys.colors.757575,
          onSecondary: sys.colors.ffffff,
          tertiary: sys.colors.424242,
          onTertiary: sys.colors.ffffff,
          surface: sys.colors.ffffff,
          onSurface: sys.colors.000000,
          background: sys.colors.fafafa,
          onBackground: sys.colors.000000,
          secondaryContainer: sys.colors.f5f5f5,
          onSecondaryContainer: sys.colors.000000,
          outline: sys.colors.bdbdbd,
          surfaceContainerLow: sys.colors.fafafa,
          surfaceContainerHigh: sys.colors.f0f0f0,
          outlineVariant: sys.colors.9e9e9e,
          error: sys.colors.d32f2f,
          onError: sys.colors.ffffff,
          errorContainer: sys.colors.ffcdd2,
          onErrorContainer: sys.colors.000000,
          primaryContainer: sys.colors.e0e0e0,
          onPrimaryContainer: sys.colors.000000,
          primaryHover: sys.colors.000000,
          scrim: sys.colors.000000,
          surfaceVariant: sys.colors.f5f5f5,
          onSurfaceVariant: sys.colors.000000
        },
      }
    },
  },
  playful: {
    name: 'Playful',
    description: 'Bright colors, varied spacing, fun typography for enjoyment.',
    overrides: {
      sys: {
        colors: {
          primary: sys.colors.ff4081,
          onPrimary: sys.colors.ffffff,
          secondary: sys.colors.ffeb3b,
          onSecondary: sys.colors.000000,
          tertiary: sys.colors.e91e63,
          onTertiary: sys.colors.ffffff,
          surface: sys.colors.ffffff,
          onSurface: sys.colors.000000,
          background: sys.colors.fce4ec,
          onBackground: sys.colors.000000,
          secondaryContainer: sys.colors.fffde7,
          onSecondaryContainer: sys.colors.000000,
          outline: sys.colors.f8bbd9,
          surfaceContainerLow: sys.colors.fce4ec,
          surfaceContainerHigh: sys.colors.f8bbd9,
          outlineVariant: sys.colors.f06292,
          error: sys.colors.d32f2f,
          onError: sys.colors.ffffff,
          errorContainer: sys.colors.ffcdd2,
          onErrorContainer: sys.colors.000000,
          primaryContainer: sys.colors.fce4ec,
          onPrimaryContainer: sys.colors.000000,
          primaryHover: sys.colors.e91e63,
          scrim: sys.colors.000000,
          surfaceVariant: sys.colors.fce4ec,
          onSurfaceVariant: sys.colors.000000
        },
      }
    },
  },
  minimal: {
    name: 'Minimal',
    description: 'Monochrome colors, minimal spacing, simple typography for clarity.',
    overrides: {
      sys: {
        colors: {
          primary: sys.colors.000000,
          onPrimary: sys.colors.ffffff,
          secondary: sys.colors.ffffff,
          onSecondary: sys.colors.000000,
          tertiary: sys.colors.f5f5f5,
          onTertiary: sys.colors.000000,
          surface: sys.colors.ffffff,
          onSurface: sys.colors.000000,
          background: sys.colors.ffffff,
          onBackground: sys.colors.000000,
          secondaryContainer: sys.colors.f5f5f5,
          onSecondaryContainer: sys.colors.000000,
          outline: sys.colors.e0e0e0,
          surfaceContainerLow: sys.colors.ffffff,
          surfaceContainerHigh: sys.colors.f5f5f5,
          outlineVariant: sys.colors.bdbdbd,
          error: sys.colors.d32f2f,
          onError: sys.colors.ffffff,
          errorContainer: sys.colors.ffcdd2,
          onErrorContainer: sys.colors.000000,
          primaryContainer: sys.colors.f5f5f5,
          onPrimaryContainer: sys.colors.000000,
          primaryHover: sys.colors.333333,
          scrim: sys.colors.000000,
          surfaceVariant: sys.colors.f5f5f5,
          onSurfaceVariant: sys.colors.000000
        },
      }
    },
  }
};

const EmotionalPresetsManager: React.FC<EmotionalPresetsManagerProps> = ({ selectedPreset, onPresetChange }) => {
  const { layers, updateOverrides, resetOverrides } = useTheme();
  const { spacing } = layers.ref;
  const [hoveredPreset, setHoveredPreset] = useState<EmotionalPreset | null>(null);

  useEffect(() => {
    const activePreset = hoveredPreset || selectedPreset;
    if (activePreset && presets[activePreset]) {
      updateOverrides(presets[activePreset]!.overrides);
    } else {
      resetOverrides();
    }
  }, [hoveredPreset, selectedPreset, updateOverrides, resetOverrides]);

  const handleSelect = (preset: EmotionalPreset) => {
    onPresetChange(preset);
  };

  return (
    <div
      style={{
        backgroundColor: layers.sys.colors.surface,
        padding: spacing['4'],
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: spacing['4']
      }}
    >
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
              border: isSelected ? `2px solid ${layers.sys.colors.primary}` : 'none',
              opacity: isHovered ? 0.8 : 1,
              backgroundColor: layers.sys.colors.surfaceContainerLow,
              boxShadow: isSelected ? layers.elevation.level2 : layers.elevation.level1
            }}
            onMouseEnter={() => setHoveredPreset(presetKey)}
            onMouseLeave={() => setHoveredPreset(null)}
            onClick={() => handleSelect(presetKey)}
            aria-selected={isSelected}
          >
            <M3Typography variant="title-medium" style={{ marginBottom: spacing['2'], color: layers.sys.colors.onSurface }}>
              {preset.name}
            </M3Typography>
            <M3Typography variant="body-medium" style={{ marginBottom: spacing['3'], color: layers.sys.colors.onSurface }}>
              {preset.description}
            </M3Typography>
            {isSelected ? (
              <M3Typography variant="body-large" style={{ color: layers.sys.colors.primary }}>
                Selected
              </M3Typography>
            ) : (
              <M3Button variant="outlined" style={{ color: layers.sys.colors.primary }}>
                Select
              </M3Button>
            )}
          </M3Card>
        );
      })}
    </div>
  );
}

export default EmotionalPresetsManager;

