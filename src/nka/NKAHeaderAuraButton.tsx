// Aura button for header (M3 icon button + glow + coachmark primo accesso)
import * as React from 'react';
import { playNkaSound } from './sound';

const NKA_COACHMARK_KEY = 'nka_coachmark_seen_v1';

interface NKAHeaderAuraButtonProps {
  hasNewNode: boolean;
  onClick: () => void;
  onLongPress: () => void;
}

const NKAHeaderAuraButton: React.FC<NKAHeaderAuraButtonProps> = ({ hasNewNode, onClick, onLongPress }: NKAHeaderAuraButtonProps) => {
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);
  const [showCoachmark, setShowCoachmark] = React.useState(false);

  // Mostra coachmark solo al primo accesso, chiude automaticamente dopo 6s
  React.useEffect(() => {
    if (!localStorage.getItem(NKA_COACHMARK_KEY)) {
      const show = setTimeout(() => setShowCoachmark(true), 1200);
      return () => clearTimeout(show);
    }
  }, []);

  React.useEffect(() => {
    if (!showCoachmark) return;
    localStorage.setItem(NKA_COACHMARK_KEY, '1');
    const hide = setTimeout(() => setShowCoachmark(false), 6000);
    return () => clearTimeout(hide);
  }, [showCoachmark]);

  const handlePointerDown = () => {
    timerRef.current = setTimeout(() => {
      playNkaSound('badge');
      onLongPress();
      if (window.navigator.vibrate) window.navigator.vibrate(30);
    }, 500);
  };
  const handlePointerUp = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };
  const handleClick = () => {
    playNkaSound('action');
    setShowCoachmark(false);
    onClick();
  };

  return (
    <div style={{ position: 'relative', display: 'inline-flex' }}>
      <button
        aria-label="Apri mappa neurale Aura — tieni premuto per opzioni avanzate"
        title="Mappa Neurale Aura"
        tabIndex={0}
        onClick={handleClick}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleClick();
            e.preventDefault();
          }
          if (e.key === 'ArrowRight') {
            (e.currentTarget.nextElementSibling as HTMLElement)?.focus();
          }
          if (e.key === 'ArrowLeft') {
            (e.currentTarget.previousElementSibling as HTMLElement)?.focus();
          }
        }}
        aria-haspopup="dialog"
        aria-expanded="false"
        style={{
          background: 'var(--md-sys-color-primary)',
          color: 'var(--md-sys-color-on-primary)',
          border: 'none',
          borderRadius: 'var(--md-sys-shape-corner-full)',
          boxShadow: '0 0 0 var(--md-sys-spacing-1) var(--md-sys-color-primary-container)',
          width: 'var(--md-sys-spacing-12)',
          height: 'var(--md-sys-spacing-12)',
          minWidth: 'var(--md-sys-spacing-11)',
          minHeight: 'var(--md-sys-spacing-11)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          outline: 'none',
          cursor: 'pointer',
          transition: 'box-shadow var(--md-sys-motion-duration-short) var(--md-sys-motion-easing-standard)',
        }}
      >
        <span
          aria-hidden="true"
          style={{
            fontSize: 'calc(var(--md-sys-spacing-7))',
            color: 'var(--md-sys-color-on-primary)',
            filter: 'drop-shadow(0 0 var(--md-sys-spacing-2) var(--md-sys-color-primary))',
            userSelect: 'none',
          }}
        >auto_awesome</span>
        {hasNewNode && (
          <span
            role="status"
            aria-label="Nuovo nodo disponibile"
            style={{
              position: 'absolute',
              top: 'var(--md-sys-spacing-1)',
              right: 'var(--md-sys-spacing-1)',
              width: 'var(--md-sys-spacing-3)',
              height: 'var(--md-sys-spacing-3)',
              borderRadius: 'var(--md-sys-percent-50)',
              background: 'var(--md-sys-color-tertiary)',
              boxShadow: '0 0 0 var(--md-sys-border-width-thick) var(--md-sys-color-surface)',
              border: 'var(--md-sys-border-width-thick) solid var(--md-sys-color-surface)',
              display: 'inline-block',
            }}
          />
        )}
      </button>

      {/* Coachmark — primo accesso */}
      {showCoachmark && (
        <div
          role="tooltip"
          aria-live="polite"
          style={{
            position: 'absolute',
            top: 'calc(var(--md-sys-spacing-12) + var(--md-sys-spacing-3))',
            right: 0,
            zIndex: 'var(--md-sys-z-tooltip)' as React.CSSProperties['zIndex'],
            backgroundColor: 'var(--md-sys-color-inverse-surface)',
            color: 'var(--md-sys-color-inverse-on-surface)',
            borderRadius: 'var(--md-sys-shape-corner-medium)',
            padding: 'var(--md-sys-spacing-3) var(--md-sys-spacing-4)',
            fontSize: 'var(--md-sys-typescale-body-small-font-size)',
            fontWeight: 'var(--md-sys-typescale-weight-medium)',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            boxShadow: 'var(--md-sys-elevation-level2)',
            animation: 'none',
          }}
        >
          <span aria-hidden="true" style={{ marginRight: 'var(--md-sys-spacing-2)', verticalAlign: 'middle', fontSize: 'var(--md-sys-typescale-body-medium-font-size)' }}>auto_awesome</span>
          Mappa Neurale: esplora la tua conoscenza
        </div>
      )}
    </div>
  );
};

export default NKAHeaderAuraButton;

