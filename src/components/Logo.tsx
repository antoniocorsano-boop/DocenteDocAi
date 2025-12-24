import React, { useState, useCallback } from 'react';
import ReactDOM from 'react-dom';

interface LogoProps {
  title?: string; // FIX: Added title to LogoProps
  isAiThinking?: boolean;
}

type AnimationState = 'idle' | 'chaos' | 'implosion' | 'peace';

const Logo: React.FC<LogoProps> = ({ title, isAiThinking = false }) => { // FIX: Destructured title
  const [animState, setAnimState] = useState<AnimationState>('idle');

  const triggerBigBang = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (animState !== 'idle') return;

    setAnimState('chaos');
    setTimeout(() => {
      setAnimState('implosion');
      setTimeout(() => {
        setAnimState('peace');
        setTimeout(() => setAnimState('idle'), 2500);
      }, 300); 
    }, 1800); 
  }, [animState]);

  return (
    <>
      {animState !== 'idle' && animState !== 'peace' && document.body && ReactDOM.createPortal(
        <div className={`universe-overlay ${animState}`}></div>,
        document.body
      )}

      <div 
        className={`app-logo-container ${animState} ${isAiThinking ? 'thinking' : ''}`} 
        onClick={triggerBigBang}
      >
        <svg width="220" height="44" viewBox="0 0 220 44" fill="none" xmlns="http://www.w3.org/2000/svg" className="overflow-visible">
          {/* Simbolo D Geometrica */}
          <g transform="translate(2, 2)">
            <path d="M12 4 H 24 C 36 4, 42 12, 42 20 C 42 28, 36 36, 24 36 H 12 V 4 Z" className="logo-d-ring" />
            <path d="M14 8 H 22 C 28 8, 31 12, 31 20 C 31 28, 28 32, 22 32 H 14 V 8 Z" className="logo-d-body" />
            <rect x="4" y="6" width="7" height="28" rx="2" className="logo-d-stem" />
            
            {/* Gemma AI */}
            <g transform="translate(38, 4)">
                <path d="M0 -5 L1.5 -1.5 L5 0 L1.5 1.5 L0 5 L-1.5 1.5 L-5 0 L-1.5 -1.5 Z" className="logo-sparkle" />
            </g>
          </g>
          
          {/* Brand Text */}
          <text x="54" y="32" className="logo-main-text" fill="currentColor">DocenteDoc</text>
          
          {/* Badge AI */}
          <text x="188" y="18" className="logo-ai-text" fill="currentColor">AI</text>
        </svg>
      </div>
    </>
  );
};

export default Logo;
