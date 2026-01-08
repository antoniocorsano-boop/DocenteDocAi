// Settings toggle for enabling/disabling NKA
import React from 'react';
import { useNKAStore } from './useNKAStore';

const NKASettingsToggle: React.FC = () => {
  const enabled = useNKAStore((s) => s.enabled);
  const setEnabled = useNKAStore((s) => s.setEnabled);
  const settings = useNKAStore((s) => s.settings);
  const setSettings = useNKAStore((s) => s.setSettings);
  return (
    <div className="nka-settings-toggle">
      <label htmlFor="nka-toggle">Neural Knowledge Aura</label>
      <input
        id="nka-toggle"
        type="checkbox"
        checked={enabled}
        onChange={(e) => setEnabled(e.target.checked)}
      />
      <span className="nka-settings-subtitle">Attiva l’aura neurale nell’header</span>
      <label htmlFor="nka-sound-toggle">Suoni NKA</label>
      <input
        id="nka-sound-toggle"
        type="checkbox"
        checked={settings.sound}
        onChange={e => setSettings({ ...settings, sound: e.target.checked })}
      />
      <span className="nka-settings-subtitle">Abilita feedback sonori</span>
      <label htmlFor="nka-motion-toggle">Motion ridotto</label>
      <input
        id="nka-motion-toggle"
        type="checkbox"
        checked={settings.reducedMotion}
        onChange={e => setSettings({ ...settings, reducedMotion: e.target.checked })}
      />
      <span className="nka-settings-subtitle">Riduci animazioni per accessibilità</span>
    </div>
  );
};

export default NKASettingsToggle;


