// LEGACY - MD3 Non-compliant (1 functional exception remaining)

// MD3 Migration: Partially migrated - replaced border with --md-sys-border-width-thick token
// Still uses legacy useTheme system - requires full migration to inline MD3 tokens
// Functional exception: grid minmax(calc(var(--md-sys-spacing-20) * 3.125), 1fr) for responsive card layout
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
          surfaceContainerHigh: 'var(--md-sys-color-surface-container-high)',
          outlineVariant: 'var(--md-sys-color-outline-variant)',
          error: 'var(--md-sys-color-error)',
          onError: 'var(--md-sys-color-on-error)',
          errorContainer: 'var(--md-sys-color-error-container)',
          onErrorContainer: 'var(--md-sys-color-on-error-container)',
          primaryContainer: 'var(--md-sys-color-primary-container)',
          onPrimaryContainer: 'var(--md-sys-color-on-primary-container)',
          primaryHover: 'var(--md-sys-color-primary)',
          scrim: 'var(--md-sys-color-scrim)',
          surfaceVariant: 'var(--md-sys-color-surface-variant)',
          onSurfaceVariant: 'var(--md-sys-color-on-surface-variant)'
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
          primary: 'ff5722',
          onPrimary: 'ffffff',
          secondary: '03dac6',
          onSecondary: '000000',
          tertiary: '3700b3',
          onTertiary: 'ffffff',
          surface: 'ffffff',
          onSurface: '000000',
          background: 'f5f5f5',
          onBackground: '000000',
          secondaryContainer: 'e0f7fa',
          onSecondaryContainer: '000000',
          outline: 'bdbdbd',
          surfaceContainerLow: 'f5f5f5',
          surfaceContainerHigh: 'var(--md-sys-color-surface-container-high)',
          outlineVariant: 'var(--md-sys-color-outline-variant)',
          error: 'var(--md-sys-color-error)',
          onError: 'var(--md-sys-color-on-error)',
          errorContainer: 'var(--md-sys-color-error-container)',
          onErrorContainer: 'var(--md-sys-color-on-error-container)',
          primaryContainer: 'var(--md-sys-color-primary-container)',
          onPrimaryContainer: 'var(--md-sys-color-on-primary-container)',
          primaryHover: 'var(--md-sys-color-primary)',
          scrim: 'var(--md-sys-color-scrim)',
          surfaceVariant: 'var(--md-sys-color-surface-variant)',
          onSurfaceVariant: 'var(--md-sys-color-on-surface-variant)'
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
          primary: 'var(--md-sys-color-tertiary)',
          onPrimary: 'var(--md-sys-color-on-tertiary)',
          secondary: 'var(--md-sys-color-secondary)',
          onSecondary: 'var(--md-sys-color-on-secondary)',
          tertiary: 'var(--md-sys-color-primary)',
          onTertiary: 'var(--md-sys-color-on-primary)',
          surface: 'var(--md-sys-color-surface)',
          onSurface: 'var(--md-sys-color-on-surface)',
          background: 'var(--md-sys-color-background)',
          onBackground: 'var(--md-sys-color-on-background)',
          secondaryContainer: 'var(--md-sys-color-secondary-container)',
          onSecondaryContainer: 'var(--md-sys-color-on-secondary-container)',
          outline: 'var(--md-sys-color-outline)',
          surfaceContainerLow: 'var(--md-sys-color-surface-container-low)',
          surfaceContainerHigh: 'var(--md-sys-color-surface-container-high)',
          outlineVariant: 'var(--md-sys-color-outline-variant)',
          error: 'var(--md-sys-color-error)',
          onError: 'var(--md-sys-color-on-error)',
          errorContainer: 'var(--md-sys-color-error-container)',
          onErrorContainer: 'var(--md-sys-color-on-error-container)',
          primaryContainer: 'var(--md-sys-color-tertiary-container)',
          onPrimaryContainer: 'var(--md-sys-color-on-tertiary-container)',
          primaryHover: 'var(--md-sys-color-tertiary)',
          scrim: 'var(--md-sys-color-scrim)',
          surfaceVariant: 'var(--md-sys-color-surface-variant)',
          onSurfaceVariant: 'var(--md-sys-color-on-surface-variant)'
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
          surfaceContainerHigh: 'var(--md-sys-color-surface-container-high)',
          outlineVariant: 'var(--md-sys-color-outline-variant)',
          error: 'var(--md-sys-color-error)',
          onError: 'var(--md-sys-color-on-error)',
          errorContainer: 'var(--md-sys-color-error-container)',
          onErrorContainer: 'var(--md-sys-color-on-error-container)',
          primaryContainer: 'var(--md-sys-color-primary-container)',
          onPrimaryContainer: 'var(--md-sys-color-on-primary-container)',
          primaryHover: 'var(--md-sys-color-primary)',
          scrim: 'var(--md-sys-color-scrim)',
          surfaceVariant: 'var(--md-sys-color-surface-variant)',
          onSurfaceVariant: 'var(--md-sys-color-on-surface-variant)'
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
          primary: sys.colors["8bc34a"],
          onPrimary: sys.colors["000000"],
          secondary: sys.colors["009688"],
          onSecondary: sys.colors["ffffff"],
          tertiary: sys.colors["795548"],
          onTertiary: sys.colors["ffffff"],
          surface: sys.colors["ffffff"],
          onSurface: sys.colors["000000"],
          background: sys.colors["e8f5e8"],
          onBackground: sys.colors["000000"],
          secondaryContainer: sys.colors["e0f2f1"],
          onSecondaryContainer: sys.colors["000000"],
          outline: sys.colors["c8e6c9"],
          surfaceContainerLow: sys.colors["e8f5e8"],
          surfaceContainerHigh: sys.colors["c8e6c9"],
          outlineVariant: sys.colors["a5d6a7"],
          error: sys.colors["d32f2f"],
          onError: sys.colors["ffffff"],
          errorContainer: sys.colors["ffcdd2"],
          onErrorContainer: sys.colors["000000"],
          primaryContainer: sys.colors["e8f5e8"],
          onPrimaryContainer: sys.colors["000000"],
          primaryHover: sys.colors["689f38"],
          scrim: sys.colors["000000"],
          surfaceVariant: sys.colors["e8f5e8"],
          onSurfaceVariant: sys.colors["000000"]
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
          primary: sys.colors["212121"],
          onPrimary: sys.colors["ffffff"],
          secondary: sys.colors["757575"],
          onSecondary: sys.colors["ffffff"],
          tertiary: sys.colors["424242"],
          onTertiary: sys.colors["ffffff"],
          surface: sys.colors["ffffff"],
          onSurface: sys.colors["000000"],
          background: sys.colors["fafafa"],
          onBackground: sys.colors["000000"],
          secondaryContainer: sys.colors["f5f5f5"],
          onSecondaryContainer: sys.colors["000000"],
          outline: sys.colors["bdbdbd"],
          surfaceContainerLow: sys.colors["fafafa"],
          surfaceContainerHigh: sys.colors["f0f0f0"],
          outlineVariant: sys.colors["9e9e9e"],
          error: sys.colors["d32f2f"],
          onError: sys.colors["ffffff"],
          errorContainer: sys.colors["ffcdd2"],
          onErrorContainer: sys.colors["000000"],
          primaryContainer: sys.colors["e0e0e0"],
          onPrimaryContainer: sys.colors["000000"],
          primaryHover: sys.colors["000000"],
          scrim: sys.colors["000000"],
          surfaceVariant: sys.colors["f5f5f5"],
          onSurfaceVariant: sys.colors["000000"]
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
          primary: sys.colors["ff4081"],
          onPrimary: sys.colors["ffffff"],
          secondary: sys.colors["ffeb3b"],
          onSecondary: sys.colors["000000"],
          tertiary: sys.colors["e91e63"],
          onTertiary: sys.colors["ffffff"],
          surface: sys.colors["ffffff"],
          onSurface: sys.colors["000000"],
          background: sys.colors["fce4ec"],
          onBackground: sys.colors["000000"],
          secondaryContainer: sys.colors["fffde7"],
          onSecondaryContainer: sys.colors["000000"],
          outline: sys.colors["f8bbd9"],
          surfaceContainerLow: sys.colors["fce4ec"],
          surfaceContainerHigh: sys.colors["f8bbd9"],
          outlineVariant: sys.colors["f06292"],
          error: sys.colors["d32f2f"],
          onError: sys.colors["ffffff"],
          errorContainer: sys.colors["ffcdd2"],
          onErrorContainer: sys.colors["000000"],
          primaryContainer: sys.colors["fce4ec"],
          onPrimaryContainer: sys.colors["000000"],
          primaryHover: sys.colors["e91e63"],
          scrim: sys.colors["000000"],
          surfaceVariant: sys.colors["fce4ec"],
          onSurfaceVariant: sys.colors["000000"]
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
          primary: sys.colors["000000"],
          onPrimary: sys.colors["ffffff"],
          secondary: sys.colors["ffffff"],
          onSecondary: sys.colors["000000"],
          tertiary: sys.colors["f5f5f5"],
          onTertiary: sys.colors["000000"],
          surface: sys.colors["ffffff"],
          onSurface: sys.colors["000000"],
          background: sys.colors["ffffff"],
          onBackground: sys.colors["000000"],
          secondaryContainer: sys.colors["f5f5f5"],
          onSecondaryContainer: sys.colors["000000"],
          outline: sys.colors["e0e0e0"],
          surfaceContainerLow: sys.colors["ffffff"],
          surfaceContainerHigh: sys.colors["f5f5f5"],
          outlineVariant: sys.colors["bdbdbd"],
          error: sys.colors["d32f2f"],
          onError: sys.colors["ffffff"],
          errorContainer: sys.colors["ffcdd2"],
          onErrorContainer: sys.colors["000000"],
          primaryContainer: sys.colors["f5f5f5"],
          onPrimaryContainer: sys.colors["000000"],
          primaryHover: sys.colors["333333"],
          scrim: sys.colors["000000"],
          surfaceVariant: sys.colors["f5f5f5"],
          onSurfaceVariant: sys.colors["000000"]
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
        backgroundColor: layers.sys.color.surface,
        padding: spacing['4'],
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(calc(var(--md-sys-spacing-20) * 3.125), 1fr))',
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
              border: isSelected ? `var(--md-sys-border-width-thick) solid ${layers.sys.color.primary}` : 'none',
              opacity: isHovered ? 0.8 : 1,
              backgroundColor: layers.sys.color.surfaceContainerLow,
              boxShadow: isSelected ? layers.elevation.level2 : layers.elevation.level1
            }}
            onMouseEnter={() => setHoveredPreset(presetKey)}
            onMouseLeave={() => setHoveredPreset(null)}
            onClick={() => handleSelect(presetKey)}
            aria-selected={isSelected}
          >
            <M3Typography variant="title-medium" style={{ marginBottom: spacing['2'], color: layers.sys.color.onSurface }}>
              {preset.name}
            </M3Typography>
            <M3Typography variant="body-medium" style={{ marginBottom: spacing['3'], color: layers.sys.color.onSurface }}>
              {preset.description}
            </M3Typography>
            {isSelected ? (
              <M3Typography variant="body-large" style={{ color: layers.sys.color.primary }}>
                Selected
              </M3Typography>
            ) : (
              <M3Button variant="outlined" style={{ color: layers.sys.color.primary }}>
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





