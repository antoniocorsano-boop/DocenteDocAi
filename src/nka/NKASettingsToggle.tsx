// Settings toggle for enabling/disabling NKA

import React from 'react';
import { useNKAStore } from './useNKAStore';
import { M3Typography } from '../components/ui/M3Typography';

const NKASettingsToggle: React.FC = () => {
  const enabled = useNKAStore((s) => s.enabled);
  const setEnabled = useNKAStore((s) => s.setEnabled);
  const settings = useNKAStore((s) => s.settings);
  const setSettings = useNKAStore((s) => s.setSettings);
  return (
    <div
      style={{
        background: 'var(--md-sys-color-surface)',
        padding: 'var(--md-sys-spacing-4)',
        borderRadius: 'var(--md-sys-shape-corner-medium)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--md-sys-spacing-4)',
        boxShadow: 'var(--md-sys-elevation1)',
        maxWidth: 420,
        margin: '0 auto',
      }}
    >
      <label htmlFor="nka-toggle" style={{ display: 'flex', alignItems: 'center', gap: 'var(--md-sys-spacing-2)' }}>
        <input
          id="nka-toggle"
          type="checkbox"
          checked={enabled}
          onChange={(e) => setEnabled(e.target.checked)}
          aria-label="Abilita Neural Knowledge Aura"
          style={{ accentColor: 'var(--md-sys-color-primary)' }}
        />
        <M3Typography variant="body-large">Neural Knowledge Aura</M3Typography>
      </label>
      <M3Typography variant="body-medium" style={{ color: 'var(--app-color-on-surface-variant)' }}>
        Attiva l’aura neurale nell’header
      </M3Typography>

      <label htmlFor="nka-sound-toggle" style={{ display: 'flex', alignItems: 'center', gap: 'var(--md-sys-spacing-2)' }}>
        <input
          id="nka-sound-toggle"
          type="checkbox"
          checked={settings.sound}
          onChange={e => setSettings({ ...settings, sound: e.target.checked })}
          aria-label="Abilita feedback sonori"
          style={{ accentColor: 'var(--md-sys-color-primary)' }}
        />
        <M3Typography variant="body-large">Suoni NKA</M3Typography>
      </label>
      <M3Typography variant="body-medium" style={{ color: 'var(--app-color-on-surface-variant)' }}>
        Abilita feedback sonori
      </M3Typography>

      <label htmlFor="nka-motion-toggle" style={{ display: 'flex', alignItems: 'center', gap: 'var(--md-sys-spacing-2)' }}>
        <input
          id="nka-motion-toggle"
          type="checkbox"
          checked={settings.reducedMotion}
          onChange={e => setSettings({ ...settings, reducedMotion: e.target.checked })}
          aria-label="Riduci animazioni per accessibilità"
          style={{ accentColor: 'var(--md-sys-color-primary)' }}
        />
        <M3Typography variant="body-large">Motion ridotto</M3Typography>
      </label>
      <M3Typography variant="body-medium" style={{ color: 'var(--app-color-on-surface-variant)' }}>
        Riduci animazioni per accessibilità
      </M3Typography>
    </div>
  );
};

export default NKASettingsToggle;


