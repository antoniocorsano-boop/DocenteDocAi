// LEGACY - MD3 Non-compliant
import React, { useState } from 'react';
import { useTheme, ThemeOverrides } from '../../theme/theme';
import { M3Button } from '../M3Button';

interface ThemeSettingsPanelProps {
  onClose?: () => void;
}

export const ThemeSettingsPanel: React.FC<ThemeSettingsPanelProps> = ({ onClose }) => {
  const { colors, typography, spacing, motion, isDark, toggleDarkMode, overrides, updateOverrides, resetOverrides } = useTheme();
  const [tempOverrides, setTempOverrides] = useState<ThemeOverrides>(overrides);

  const handleColorChange = (key: keyof typeof colors, value: string) => {
    setTempOverrides(prev => ({
      ...prev,
      colors: { ...prev.colors, [key]: value }
    }));
  };

  const handleTypographyChange = (key: keyof typeof typography, value: string) => {
    setTempOverrides(prev => ({
      ...prev,
      typography: { ...prev.typography, [key]: value }
    }));
  };

  const handleSpacingChange = (key: keyof typeof spacing, value: string) => {
    setTempOverrides(prev => ({
      ...prev,
      spacing: { ...prev.spacing, [key]: value }
    }));
  };

  const handleMotionChange = (key: keyof typeof motion, value: string) => {
    setTempOverrides(prev => ({
      ...prev,
      motion: { ...prev.motion, [key]: value }
    }));
  };

  const applyChanges = () => {
    updateOverrides(tempOverrides);
  };

  const resetToDefaults = () => {
    resetOverrides();
    setTempOverrides({});
  };

  return (
    <div style={{
      padding: spacing['4'],
      backgroundColor: colors.surface,
      color: colors.onSurface,
      borderRadius: spacing['1'],
      boxShadow: `0 4px 6px ${colors.shadow}`,
      maxWidth: ref.spacing[600],
      margin: '0 auto'
    }}>
      <h2 style={{ ...typography.heading1, marginBottom: spacing['4'] }}>Theme Settings</h2>

      {/* Dark Mode Toggle */}
      <div style={{ marginBottom: spacing['6'] }}>
        <label style={{ ...typography.body1, display: 'flex', alignItems: 'center', gap: spacing['2'] }}>
          <input
            type="checkbox"
            checked={isDark}
            onChange={toggleDarkMode}
          />
          Dark Mode
        </label>
      </div>

      {/* Color Overrides */}
      <div style={{ marginBottom: spacing['6'] }}>
        <h3 style={typography.heading2}>Color Overrides</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: spacing['2'] }}>
          {Object.entries(colors).slice(0, 6).map(([key, value]) => (
            <div key={key}>
              <label style={typography.body2}>{key}</label>
              <input
                type="color"
                value={tempOverrides.colors?.[key as keyof typeof colors] || value}
                onChange={(e) => handleColorChange(key as keyof typeof colors, e.target.value)}
                style={{ width: '100%', height: ref.spacing[32], border: `1px solid ${colors.outline}`, borderRadius: spacing['1'] }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Typography Overrides */}
      <div style={{ marginBottom: spacing['6'] }}>
        <h3 style={typography.heading2}>Typography Overrides</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: spacing['2'] }}>
          {Object.entries(typography).slice(0, 4).map(([key, value]) => (
            <div key={key}>
              <label style={typography.body2}>{key}</label>
              <input
                type="text"
                value={tempOverrides.typography?.[key as keyof typeof typography] ? JSON.stringify(tempOverrides.typography[key as keyof typeof typography]) : (typeof value === 'object' ? JSON.stringify(value) : value)}
                onChange={(e) => handleTypographyChange(key as keyof typeof typography, e.target.value)}
                style={{ width: '100%', padding: spacing['1'], border: `1px solid ${colors.outline}`, borderRadius: spacing['1'] }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Spacing Overrides */}
      <div style={{ marginBottom: spacing['6'] }}>
        <h3 style={typography.heading2}>Spacing Overrides</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: spacing['2'] }}>
          {Object.entries(spacing).slice(0, 6).map(([key, value]) => (
            <div key={key}>
              <label style={typography.body2}>{key}</label>
              <input
                type="text"
                value={tempOverrides.spacing?.[key as keyof typeof spacing] || value}
                onChange={(e) => handleSpacingChange(key as keyof typeof spacing, e.target.value)}
                style={{ width: '100%', padding: spacing['1'], border: `1px solid ${colors.outline}`, borderRadius: spacing['1'] }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Motion Overrides */}
      <div style={{ marginBottom: spacing['6'] }}>
        <h3 style={typography.heading2}>Motion Overrides</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: spacing['2'] }}>
          {Object.entries(motion).slice(0, 4).map(([key, value]) => (
            <div key={key}>
              <label style={typography.body2}>{key}</label>
              <input
                type="text"
                value={tempOverrides.motion?.[key as keyof typeof motion] ? JSON.stringify(tempOverrides.motion[key as keyof typeof motion]) : (typeof value === 'object' ? JSON.stringify(value) : value)}
                onChange={(e) => handleMotionChange(key as keyof typeof motion, e.target.value)}
                style={{ width: '100%', padding: spacing['1'], border: `1px solid ${colors.outline}`, borderRadius: spacing['1'] }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: spacing['2'], justifyContent: 'flex-end' }}>
        <M3Button onClick={resetToDefaults} variant="secondary">
          Reset to Defaults
        </M3Button>
        <M3Button onClick={applyChanges} variant="primary">
          Apply Changes
        </M3Button>
        {onClose && (
          <M3Button onClick={onClose} variant="secondary">
            Close
          </M3Button>
        )}
      </div>
    </div>
  );
};

