// MD3 Gold Compliant
// Accessibility settings panel (contrast, motion)
// Audit: febbraio 2026

import React from 'react';
import { useAppTheme } from '../../contexts/ThemeContext';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';

export const AccessibilitySettings: React.FC = () => {
  const { contrast, setContrast, reducedMotion, setReducedMotion } = useAppTheme();

  return (
    <Paper
      elevation={0}
      sx={{
        padding: 'var(--md-sys-spacing-4)',
        borderRadius: 'var(--md-sys-spacing-3)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--md-sys-spacing-4)',
        bgcolor: 'var(--md-sys-color-surface)',
        color: 'var(--md-sys-color-on-surface)',
      }}
    >
      {/* Header */}
      <div>
        <Typography
          variant="subtitle2"
          sx={{
            color: 'var(--md-sys-color-on-surface)',
            fontWeight: 'var(--md-sys-typescale-weight-semibold)',
            marginBottom: 'var(--md-sys-spacing-1)'
          }}
        >
          Accessibilità
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: 'var(--md-sys-color-on-surface-variant)'
          }}
        >
          Personalizza l'esperienza per le tue esigenze
        </Typography>
      </div>

      {/* High Contrast Toggle */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 'var(--md-sys-spacing-3)',
          borderRadius: 'var(--md-sys-spacing-2)',
          backgroundColor: 'var(--md-sys-color-surface-container-low)'
        }}
      >
        <div style={{ flex: 1 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--md-sys-spacing-2)',
              marginBottom: 'var(--md-sys-spacing-1)'
            }}
          >
            <span
              className="material-symbols-outlined"
              style={{
                fontSize: 'var(--md-sys-typescale-title-small-font-size)',
                color: 'var(--md-sys-color-primary)',
                fontVariationSettings: '"FILL" 1, "wght" 600'
              }}
            >
              contrast
            </span>
            <Typography
              variant="body2"
              sx={{
                color: 'var(--md-sys-color-on-surface)',
                fontWeight: 'var(--md-sys-typescale-weight-medium)'
              }}
            >
              Contrasto elevato
            </Typography>
          </div>
          <Typography
            variant="body2"
            sx={{
              color: 'var(--md-sys-color-on-surface-variant)',
              paddingLeft: 'var(--md-sys-spacing-7)'
            }}
          >
            Aumenta il contrasto per una migliore leggibilità
          </Typography>
        </div>

        {/* Toggle Switch */}
        <button
          role="switch"
          aria-checked={contrast === 'high'}
          onClick={() => setContrast(contrast === 'normal' ? 'high' : 'normal')}
          style={{
            position: 'relative',
            width: 'var(--md-sys-spacing-12)',
            height: 'var(--md-sys-spacing-8)',
            borderRadius: 'var(--md-sys-spacing-4)',
            border: 'none',
            backgroundColor: contrast === 'high'
              ? 'var(--md-sys-color-primary)'
              : 'var(--md-sys-color-surface-variant)',
            cursor: 'pointer',
            transition: 'background-color var(--md-sys-motion-duration-short4)',
            flexShrink: 0
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 'var(--md-sys-percent-50)',
              left: contrast === 'high' ? 'calc(100% - var(--md-sys-spacing-7))' : 'var(--md-sys-spacing-1)',
              transform: 'translateY(-50%)',
              width: 'var(--md-sys-spacing-6)',
              height: 'var(--md-sys-spacing-6)',
              borderRadius: 'var(--md-sys-shape-corner-full)',
              backgroundColor: contrast === 'high'
                ? 'var(--md-sys-color-on-primary)'
                : 'var(--md-sys-color-on-surface-variant)',
              transition: 'left var(--md-sys-motion-duration-short4) var(--md-sys-motion-easing-standard)',
              boxShadow: 'var(--md-sys-elevation-level2)'
            }}
          />
        </button>
      </div>

      {/* Reduced Motion Toggle */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 'var(--md-sys-spacing-3)',
          borderRadius: 'var(--md-sys-spacing-2)',
          backgroundColor: 'var(--md-sys-color-surface-container-low)'
        }}
      >
        <div style={{ flex: 1 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--md-sys-spacing-2)',
              marginBottom: 'var(--md-sys-spacing-1)'
            }}
          >
            <span
              className="material-symbols-outlined"
              style={{
                fontSize: 'var(--md-sys-typescale-title-small-font-size)',
                color: 'var(--md-sys-color-primary)',
                fontVariationSettings: '"FILL" 1, "wght" 600'
              }}
            >
              motion_mode
            </span>
            <Typography
              variant="body2"
              sx={{
                color: 'var(--md-sys-color-on-surface)',
                fontWeight: 'var(--md-sys-typescale-weight-medium)'
              }}
            >
              Riduci movimento
            </Typography>
          </div>
          <Typography
            variant="body2"
            sx={{
              color: 'var(--md-sys-color-on-surface-variant)',
              paddingLeft: 'var(--md-sys-spacing-7)'
            }}
          >
            Minimizza animazioni e transizioni
          </Typography>
        </div>

        {/* Toggle Switch */}
        <button
          role="switch"
          aria-checked={reducedMotion}
          onClick={() => setReducedMotion(!reducedMotion)}
          style={{
            position: 'relative',
            width: 'var(--md-sys-spacing-12)',
            height: 'var(--md-sys-spacing-8)',
            borderRadius: 'var(--md-sys-spacing-4)',
            border: 'none',
            backgroundColor: reducedMotion
              ? 'var(--md-sys-color-primary)'
              : 'var(--md-sys-color-surface-variant)',
            cursor: 'pointer',
            transition: 'background-color var(--md-sys-motion-duration-short4)',
            flexShrink: 0
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 'var(--md-sys-percent-50)',
              left: reducedMotion ? 'calc(100% - var(--md-sys-spacing-7))' : 'var(--md-sys-spacing-1)',
              transform: 'translateY(-50%)',
              width: 'var(--md-sys-spacing-6)',
              height: 'var(--md-sys-spacing-6)',
              borderRadius: 'var(--md-sys-shape-corner-full)',
              backgroundColor: reducedMotion
                ? 'var(--md-sys-color-on-primary)'
                : 'var(--md-sys-color-on-surface-variant)',
              transition: 'left var(--md-sys-motion-duration-short4) var(--md-sys-motion-easing-standard)',
              boxShadow: 'var(--md-sys-elevation-level2)'
            }}
          />
        </button>
      </div>

      {/* Info note */}
      <div
        style={{
          padding: 'var(--md-sys-spacing-3)',
          borderRadius: 'var(--md-sys-spacing-2)',
          backgroundColor: 'var(--md-sys-color-primary-container)',
          border: 'var(--md-sys-border-width-thin) solid var(--md-sys-color-primary)'
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: 'var(--md-sys-spacing-2)',
            alignItems: 'flex-start'
          }}
        >
          <span
            className="material-symbols-outlined"
            style={{
              fontSize: 'var(--md-sys-typescale-body-large-font-size)',
              color: 'var(--md-sys-color-on-primary-container)',
              fontVariationSettings: '"FILL" 1, "wght" 600',
              flexShrink: 0
            }}
          >
            info
          </span>
          <Typography
            variant="body2"
            sx={{
              color: 'var(--md-sys-color-on-primary-container)',
              lineHeight: '1.5'
            }}
          >
            Le impostazioni di accessibilità vengono salvate automaticamente e sincronizzate su tutti i dispositivi.
          </Typography>
        </div>
      </div>
    </Paper>
  );
};

export default AccessibilitySettings;
