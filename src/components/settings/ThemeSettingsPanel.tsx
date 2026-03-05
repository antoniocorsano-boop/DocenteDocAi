// MD3 Gold Compliant
import React from 'react';
import { M3Button } from '../M3Button';
import { M3Surface, M3Typography } from '../ui';

interface ThemeSettingsPanelProps {
  onClose?: () => void;
}

export const ThemeSettingsPanel: React.FC<ThemeSettingsPanelProps> = ({ onClose }) => {
  return (
    <M3Surface
      level={2}
      shape="corner-large"
      style={{
        padding: 'var(--md-sys-spacing-4)',
        maxWidth: 'var(--md-sys-layout-panel-max-width)',
        margin: `0 var(--md-sys-margin-auto)`,
      }}
    >
      <M3Typography variant="headline-small" style={{ marginBottom: 'var(--md-sys-spacing-4)', color: 'var(--md-sys-color-on-surface)' }}>
        Theme Settings
      </M3Typography>

      {/* Dark Mode note */}
      <M3Surface
        level={1}
        shape="corner-medium"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--md-sys-spacing-3)',
          padding: 'var(--md-sys-spacing-4)',
          marginBottom: 'var(--md-sys-spacing-6)',
        }}
      >
        <span className="material-symbols-outlined" aria-hidden="true" style={{ color: 'var(--md-sys-color-on-surface-variant)', fontSize: 'var(--md-sys-typescale-body-large-font-size)' }}>brightness_auto</span>
        <M3Typography variant="body-medium" style={{ color: 'var(--md-sys-color-on-surface-variant)', margin: 0 }}>
          Dark Mode — tema gestito dal sistema operativo (MD3 Compliant)
        </M3Typography>
      </M3Surface>

      {/* Color Overrides */}
      <M3Typography variant="title-large" style={{ marginBottom: 'var(--md-sys-spacing-2)', color: 'var(--md-sys-color-on-surface)' }}>
        Color Overrides (MD3 System Colors)
      </M3Typography>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(var(--md-sys-layout-grid-min-wide), var(--md-sys-grid-fr-1)))',
        gap: 'var(--md-sys-spacing-2)',
        marginBottom: 'var(--md-sys-spacing-6)',
      }}>
        {[
          { key: 'primary',    label: 'Primary',    value: 'var(--md-sys-color-primary)' },
          { key: 'secondary',  label: 'Secondary',  value: 'var(--md-sys-color-secondary)' },
          { key: 'tertiary',   label: 'Tertiary',   value: 'var(--md-sys-color-tertiary)' },
          { key: 'error',      label: 'Error',      value: 'var(--md-sys-color-error)' },
          { key: 'surface',    label: 'Surface',    value: 'var(--md-sys-color-surface)' },
          { key: 'background', label: 'Background', value: 'var(--md-sys-color-background)' },
        ].map(({ key, label, value }) => (
          <M3Surface key={key} level={1} shape="corner-medium" style={{ padding: 'var(--md-sys-spacing-2)' }}>
            <M3Typography variant="label-large" as="span" style={{ display: 'block', marginBottom: 'var(--md-sys-spacing-1)', color: 'var(--md-sys-color-on-surface)' }}>{label}</M3Typography>
            <div style={{
              width: 'var(--md-sys-percent-100)',
              height: 'var(--md-sys-spacing-6)',
              backgroundColor: value,
              border: 'var(--md-sys-border-width-thin) solid var(--md-sys-color-outline)',
              borderRadius: 'var(--md-sys-shape-corner-small)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <M3Typography variant="label-medium" style={{ color: 'var(--md-sys-color-on-surface)' }}>{value}</M3Typography>
            </div>
          </M3Surface>
        ))}
      </div>

      {/* Typography Scale */}
      <M3Typography variant="title-large" style={{ marginBottom: 'var(--md-sys-spacing-2)', color: 'var(--md-sys-color-on-surface)' }}>
        Typography Scale (MD3 System)
      </M3Typography>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(var(--md-sys-layout-grid-min-wide), var(--md-sys-grid-fr-1)))',
        gap: 'var(--md-sys-spacing-2)',
        marginBottom: 'var(--md-sys-spacing-6)',
      }}>
        {(['display-large', 'headline-large', 'title-large', 'body-large'] as const).map(variant => (
          <M3Surface key={variant} level={1} shape="corner-medium" style={{ padding: 'var(--md-sys-spacing-2)' }}>
            <M3Typography variant="label-large" as="span" style={{ display: 'block', marginBottom: 'var(--md-sys-spacing-1)', color: 'var(--md-sys-color-on-surface-variant)' }}>{variant}</M3Typography>
            <M3Typography variant={variant} style={{ color: 'var(--md-sys-color-on-surface)' }}>Aa</M3Typography>
          </M3Surface>
        ))}
      </div>

      {/* Spacing Scale */}
      <M3Typography variant="title-large" style={{ marginBottom: 'var(--md-sys-spacing-2)', color: 'var(--md-sys-color-on-surface)' }}>
        Spacing Scale (MD3 System)
      </M3Typography>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(var(--md-sys-layout-grid-min), var(--md-sys-grid-fr-1)))',
        gap: 'var(--md-sys-spacing-2)',
        marginBottom: 'var(--md-sys-spacing-6)',
      }}>
        {[1, 2, 3, 4, 5, 6].map(n => (
          <M3Surface key={n} level={1} shape="corner-medium" style={{ padding: 'var(--md-sys-spacing-2)' }}>
            <M3Typography variant="label-large" as="span" style={{ display: 'block', marginBottom: 'var(--md-sys-spacing-1)', color: 'var(--md-sys-color-on-surface-variant)' }}>spacing-{n}</M3Typography>
            <div style={{
              width: 'var(--md-sys-percent-100)',
              height: `var(--md-sys-spacing-${n})`,
              backgroundColor: 'var(--md-sys-color-primary)',
              borderRadius: 'var(--md-sys-shape-corner-small)',
              minHeight: 'var(--md-sys-spacing-2)',
            }} />
          </M3Surface>
        ))}
      </div>

      {/* Motion Scale */}
      <M3Typography variant="title-large" style={{ marginBottom: 'var(--md-sys-spacing-2)', color: 'var(--md-sys-color-on-surface)' }}>
        Motion &amp; Easing (MD3 System)
      </M3Typography>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(var(--md-sys-layout-grid-min), var(--md-sys-grid-fr-1)))',
        gap: 'var(--md-sys-spacing-2)',
        marginBottom: 'var(--md-sys-spacing-6)',
      }}>
        {[
          { label: 'Standard',        value: 'var(--md-sys-motion-easing-standard)' },
          { label: 'Emphasized',      value: 'var(--md-sys-motion-easing-emphasized)' },
          { label: 'Short Duration',  value: 'var(--md-sys-motion-duration-short2)' },
          { label: 'Medium Duration', value: 'var(--md-sys-motion-duration-medium2)' },
        ].map(({ label, value }) => (
          <M3Surface key={label} level={1} shape="corner-medium" style={{ padding: 'var(--md-sys-spacing-2)' }}>
            <M3Typography variant="label-large" as="span" style={{ display: 'block', marginBottom: 'var(--md-sys-spacing-1)', color: 'var(--md-sys-color-on-surface-variant)' }}>{label}</M3Typography>
            <M3Typography variant="body-medium" style={{ color: 'var(--md-sys-color-on-surface)', wordBreak: 'break-all' }}>{value}</M3Typography>
          </M3Surface>
        ))}
      </div>

      {/* Actions */}
      <div style={{
        display: 'flex',
        gap: 'var(--md-sys-spacing-2)',
        justifyContent: 'flex-end',
        paddingTop: 'var(--md-sys-spacing-4)',
        borderTop: 'var(--md-sys-border-width-thin) solid var(--md-sys-color-outline-variant)',
      }}>
        <M3Button variant="outlined" disabled>
          Reset to MD3 Defaults
        </M3Button>
        <M3Button variant="filled" disabled>
          Apply Changes
        </M3Button>
        {onClose && (
          <M3Button onClick={onClose} variant="tonal">
            Chiudi
          </M3Button>
        )}
      </div>
    </M3Surface>
  );
};


