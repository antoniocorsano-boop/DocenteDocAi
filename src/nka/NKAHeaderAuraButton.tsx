// Aura button for header (M3 icon button + glow)
import * as React from 'react';
// ...existing code...
import { playNkaSound } from './sound';


interface NKAHeaderAuraButtonProps {
  hasNewNode: boolean;
  onClick: () => void;
  onLongPress: () => void;
}


const NKAHeaderAuraButton: React.FC<NKAHeaderAuraButtonProps> = ({ hasNewNode, onClick, onLongPress }: NKAHeaderAuraButtonProps) => {
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);

  const handlePointerDown = () => {
    timerRef.current = setTimeout(() => {
      playNkaSound('badge');
      onLongPress();
      if (window.navigator.vibrate) window.navigator.vibrate(30); // Haptic feedback
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
    onClick();
  };

  return (
    <button
      aria-label="Apri mappa neurale"
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
        boxShadow: '0 0 0 4px var(--md-sys-color-primary-container)',
        width: 48,
        height: 48,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        outline: 'none',
        cursor: 'pointer',
        transition: 'box-shadow 0.2s',
      }}
    >
      <span
        aria-hidden="true"
        style={{
          fontFamily: 'Material Symbols Outlined',
          fontSize: 28,
          color: 'var(--md-sys-color-on-primary)',
          filter: 'drop-shadow(0 0 8px var(--md-sys-color-primary))',
          userSelect: 'none',
        }}
      >auto_awesome</span>
      {hasNewNode && (
        <span
          aria-label="Nuovo nodo disponibile"
          style={{
            position: 'absolute',
            top: 6,
            right: 6,
            width: 12,
            height: 12,
            borderRadius: '50%',
            background: 'var(--md-sys-color-tertiary)',
            boxShadow: '0 0 0 2px var(--md-sys-color-surface)',
            border: '2px solid var(--md-sys-color-surface)',
            display: 'inline-block',
          }}
        />
      )}
    </button>
  );
};

export default NKAHeaderAuraButton;


