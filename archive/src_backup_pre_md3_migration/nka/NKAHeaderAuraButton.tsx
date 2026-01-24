// Aura button for header (M3 icon button + glow)
import * as React from 'react';
import './nka.css';
import './nka-responsive.css';
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
      className="nka-aura-btn aura-glow"
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
    >
      <span className="material-symbols-outlined" aria-hidden="true">auto_awesome</span>
      {hasNewNode && <span className="nka-badge" aria-label="Nuovo nodo disponibile" />}
    </button>
  );
};

export default NKAHeaderAuraButton;


