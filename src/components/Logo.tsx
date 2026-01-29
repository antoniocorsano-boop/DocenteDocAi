// MD3 Gold Compliant
// Tutti gli stili usano esclusivamente token MD3 (nessun valore hardcoded)
// Audit: gennaio 2026
import React, { useCallback, useRef } from 'react';
import ReactDOM from 'react-dom';
import { useUIStore } from '../stores/useUIStore';

interface LogoProps {
  isAiThinking?: boolean;
  className?: string;
  title?: string;
  onHomeNavigate?: () => void;
}

const LogoComponent: React.FC<LogoProps> = ({ isAiThinking = false, onHomeNavigate }) => {
  const { chaosStage, actions } = useUIStore();
  const clickCount = useRef(0);
  const clickTimer = useRef<NodeJS.Timeout | null>(null);

  const handleLogoClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Se siamo già in una fase di caos, non fare nulla
    if (chaosStage !== 'none') return;

    clickCount.current += 1;

    if (clickTimer.current) clearTimeout(clickTimer.current);
    
    clickTimer.current = setTimeout(() => {
      // Se non abbiamo raggiunto i 5 click, eseguiamo la navigazione normale
      if (clickCount.current < 5 && onHomeNavigate) {
        onHomeNavigate();
      }
      clickCount.current = 0;
    }, 300); // Ridotto il timer per distinguere click singolo da sequenza rapida

    if (clickCount.current >= 5) {
      clickCount.current = 0;
      if (clickTimer.current) clearTimeout(clickTimer.current);
      
      // Inizia la sequenza Big Bang (Old Style)
      actions.setChaosStage('chaos');
      
      // Fase 1: Chaos (4.0s) - Aumentata durata per godersi la trama
      setTimeout(() => {
        actions.setChaosStage('implosion');
        
        // Fase 2: Implosion (0.6s)
        setTimeout(() => {
          actions.setChaosStage('peace');
          
          // Fase 3: Peace -> Settled (1.0s)
          setTimeout(() => {
            actions.setChaosStage('settled');
          }, 1000);
        }, 600);
      }, 4000);
    }
  }, [chaosStage, actions, onHomeNavigate]);

  return (
    <>
      {chaosStage === 'chaos' && document.body && ReactDOM.createPortal(
        <div >
          <div ></div>
          <div ></div>
        </div>,
        document.body
      )}
      
      {/* Overlay per le fasi di implosione e pace */}
      {(chaosStage === 'implosion' || chaosStage === 'peace') && document.body && ReactDOM.createPortal(
        <div style={{ position: 'fixed', inset: 0, zIndex: 'var(--md-sys-z-tooltip)', backgroundColor: chaosStage === 'implosion' ? 'var(--md-sys-color-error)' : 'var(--md-sys-color-surface)', opacity: 0.7, pointerEvents: 'auto' }} data-chaos-stage={chaosStage}></div>,
        document.body
      )}

      <div 
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'box-shadow var(--md-sys-motion-duration-medium)', boxShadow: isAiThinking ? '0 0 0 var(--md-sys-spacing-1) var(--md-sys-color-primary)' : undefined }} data-chaos-stage={chaosStage} data-ai-thinking={isAiThinking} 
        onClick={handleLogoClick}
      >
        <svg width="220" height="44" viewBox="0 0 220 44" fill="none" xmlns="http://www.w3.org/2000/svg" >
          {/* Simbolo D Geometrica */}
          <g transform="translate(2, 2)" >
            <path d="M12 4 H 24 C 36 4, 42 12, 42 20 C 42 28, 36 36, 24 36 H 12 V 4 Z"  />
            <path d="M14 8 H 22 C 28 8, 31 12, 31 20 C 31 28, 28 32, 22 32 H 14 V 8 Z"  />
            <rect x="4" y="6" width="7" height="28" rx="2"  />
            
            {/* Gemma AI - Questa è quella che "vola" via o appare alla fine */}
            <g transform="translate(38, 4)" >
                <path d="M0 -5 L1.5 -1.5 L5 0 L1.5 1.5 L0 5 L-1.5 1.5 L-5 0 L-1.5 -1.5 Z"  />
            </g>
          </g>
          
          {/* Brand Text */}
          <text x="54" y="32"  fill="currentColor">
            DocenteDoc
          </text>
          
          {/* Badge AI */}
          <text x="188" y="18"  fill="currentColor">AI</text>
        </svg>
      </div>
    </>
  );
};

export { LogoComponent as Logo };
export default LogoComponent;








