import React from 'react';
import { useNKAStore } from './useNKAStore';
import { M3Typography } from '../components/ui/M3Typography';
import M3Surface from '../components/ui/M3Surface';

const NKASettingsToggle: React.FC = () => {
  const enabled = useNKAStore((s) => s.enabled);
  const setEnabled = useNKAStore((s) => s.setEnabled);
  const settings = useNKAStore((s) => s.settings);
  const setSettings = useNKAStore((s) => s.setSettings);

  return (
    <M3Surface
      level={1}
      style={{
        padding: 'var(--md-sys-spacing-4)',
        maxWidth: 420,
        borderRadius: 'var(--md-sys-shape-corner-medium)',
      }}
      role="region"
      aria-labelledby="nka-settings-title"
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--md-sys-spacing-4)',
        }}
      >
        <M3Typography
          id="nka-settings-title"
          variant="title-medium"
          style={{ marginBottom: 'var(--md-sys-spacing-2)' }}
        >
          Impostazioni Neural Knowledge Aura
        </M3Typography>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-3)' }}>
          <label style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--md-sys-spacing-3)', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={enabled}
              onChange={(e) => setEnabled(e.target.checked)}
              aria-label="Abilita Neural Knowledge Aura"
              aria-describedby="nka-toggle-desc"
            />
            <div>
              <M3Typography variant="body-large">
                Neural Knowledge Aura
              </M3Typography>
              <M3Typography
                id="nka-toggle-desc"
                variant="body-small"
                color="var(--md-sys-color-on-surface-variant)"
                style={{ display: 'block', marginTop: 'var(--md-sys-spacing-1)' }}
              >
                Attiva l'aura neurale nell'header
              </M3Typography>
            </div>
          </label>

          <label style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--md-sys-spacing-3)', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={settings.sound}
              onChange={(e) => setSettings({ ...settings, sound: e.target.checked })}
              aria-label="Abilita feedback sonori"
              aria-describedby="nka-sound-desc"
            />
            <div>
              <M3Typography variant="body-large">
                Suoni NKA
              </M3Typography>
              <M3Typography
                id="nka-sound-desc"
                variant="body-small"
                color="var(--md-sys-color-on-surface-variant)"
                style={{ display: 'block', marginTop: 'var(--md-sys-spacing-1)' }}
              >
                Abilita feedback sonori
              </M3Typography>
            </div>
          </label>

          <label style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--md-sys-spacing-3)', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={settings.reducedMotion}
              onChange={(e) => setSettings({ ...settings, reducedMotion: e.target.checked })}
              aria-label="Riduci animazioni per accessibilità"
              aria-describedby="nka-motion-desc"
            />
            <div>
              <M3Typography variant="body-large">
                Motion ridotto
              </M3Typography>
              <M3Typography
                id="nka-motion-desc"
                variant="body-small"
                color="var(--md-sys-color-on-surface-variant)"
                style={{ display: 'block', marginTop: 'var(--md-sys-spacing-1)' }}
              >
                Riduci animazioni per accessibilità
              </M3Typography>
            </div>
          </label>
        </div>
      </div>
    </M3Surface>
  );
};

export default NKASettingsToggle;
