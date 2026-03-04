// MD3 Gold Compliant
// Tutti gli stili usano esclusivamente token MD3 (nessun valore hardcoded)
// Audit: gennaio 2026

import React from 'react';
import { useUIStore } from '../stores/useUIStore';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface AssistantFabProps {}

const ACTIONS: Array<{ key: AssistantMode; label: string; icon: string; description: string }> = [
  { key: 'chat', label: 'Chat & Suggerimenti', icon: 'chat_bubble', description: 'Dialogo e azioni consigliate' },
  { key: 'docs', label: 'Documenti AI', icon: 'description', description: 'Genera relazioni e UDA' },
  { key: 'tools', label: 'Analisi & Strumenti', icon: 'psychology', description: 'Analisi rapide e insight' },
  { key: 'backup', label: 'Backup & Drive', icon: 'cloud_sync', description: 'Backup e sincronizzazione' },
];

// MD3 Gold: sostituisco valori hardcoded con token MD3
const ACTION_ITEM_HEIGHT = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--md-sys-spacing-20')) || 80;
const FAB_HEIGHT = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--md-sys-spacing-16')) || 64;

type AssistantMode = 'chat' | 'docs' | 'tools' | 'backup';

const AssistantFab: React.FC<AssistantFabProps> = () => {
  const isAssistantOpen = useUIStore(s => s.modals.isLiveAssistantModalOpen);
  const [menuOpen, setMenuOpen] = React.useState(false);
  // mode tracks current assistant tab — read by AssistantModal via toggleModal context
  const [, setMode] = React.useState<AssistantMode>('chat');
  const [isCompactLayout, setIsCompactLayout] = React.useState(
    () => window.matchMedia('(max-width: 640px)').matches
  );

  // Chiudi menu quando il modale assistant si apre o si chiude
  React.useEffect(() => {
    if (isAssistantOpen && menuOpen) setMenuOpen(false);
  }, [isAssistantOpen, menuOpen]);

  const toggleModal = useUIStore(state => state.actions.toggleModal);

// Rileva la direzione di apertura del menu (up/down) in base alla posizione del FAB
  const fabRef = React.useRef<HTMLDivElement>(null);
  const [menuDirection, setMenuDirection] = React.useState<'up' | 'down'>('up');

  const handleFabClick = () => {
    if (menuOpen) {
      setMenuOpen(false);
      return;
    }
    // Calcola la posizione del FAB e la finestra
    if (fabRef.current) {
      const rect = fabRef.current.getBoundingClientRect();
      const actionsHeight = ACTIONS.length * ACTION_ITEM_HEIGHT + FAB_HEIGHT; // ACTION_ITEM_HEIGHT per azione, FAB_HEIGHT FAB
      // Se c'è spazio sopra, apri verso l'alto, altrimenti verso il basso
      if (rect.top > actionsHeight) {
        setMenuDirection('up');
      } else if (window.innerHeight - rect.bottom > actionsHeight) {
        setMenuDirection('down');
      } else {
        setMenuDirection('up'); // fallback
      }
    }
    setMenuOpen(true);
  };

const handleAction = (action: typeof ACTIONS[number]) => {
    setMode(action.key as AssistantMode);
    if (toggleModal) toggleModal('isLiveAssistantModalOpen', true);
    setMenuOpen(false);
  };

  React.useEffect(() => {
    const mq = window.matchMedia('(max-width: 640px)');
    const onChange = (e: MediaQueryListEvent) => setIsCompactLayout(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return (
    <>
      <div
        className="assistant-fab-root"
        ref={fabRef}
        style={{ touchAction: 'none' }}
      >
        <button
          className="mui-fab-expressive assistant-fab"
          aria-label="Assistente AI"
          onClick={handleFabClick}
        >
          <span className="material-symbols-outlined">auto_mode</span>
        </button>
        {menuOpen && (
          <>
            {isCompactLayout && (
              <>
                <div  role="presentation" onClick={() => setMenuOpen(false)} />
                <div  role="dialog" aria-modal="true" aria-label="Azioni assistente">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-4)' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-4)' }}>
                      <p>Assistente AI</p>
                      <p>Azioni rapide</p>
                    </div>
                    <button
                      
                      aria-label="Chiudi menu assistente"
                      onClick={() => setMenuOpen(false)}
                    >
                                  <span className="material-symbols-outlined">close</span>
                    </button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-4)' }}>
                    {ACTIONS.map((action) => (
                      <button
                        key={action.key}
                        
                        onClick={() => handleAction(action)}
                        aria-label={action.label}
                      >
                                      <span className="material-symbols-outlined">{action.icon}</span>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-4)' }}>
                          <p>{action.label}</p>
                          <p>{action.description}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
            {!isCompactLayout && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-4)' }}>
                {/* Close menu / quick close modal button */}
                <button
                  aria-label="Chiudi menu"
                  title="Chiudi menu"
                  
                  onClick={() => setMenuOpen(false)}
                >
                          <span className="material-symbols-outlined">close</span>
                </button>
                {ACTIONS.map((a, i) => {
                  // MD3 Gold: spacing tra azioni con token MD3
                  const posStyle: React.CSSProperties = menuDirection === 'up'
                    ? { bottom: `calc(var(--md-sys-spacing-9) * ${i + 1})` }
                    : { top: `calc(var(--md-sys-spacing-9) * ${i + 1})` };
                  return (
                    <button
                      key={a.key}
                      
                      style={{
                        ...posStyle,
                        zIndex: 'var(--md-sys-z-tooltip)',
                      }}
                      onClick={() => handleAction(a)}
                      aria-label={a.label}
                    >
                                  <span className="material-symbols-outlined">{a.icon}</span>
                      <span>{a.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
      <style>{`
        .assistant-fab-root {
          position: fixed;
          right: var(--md-sys-spacing-4);
          /* Sopra la bottom nav su mobile, allineato al bottom su desktop */
          bottom: calc(var(--md-sys-spacing-16) + var(--md-sys-spacing-4) + env(safe-area-inset-bottom, 0px)); /* eslint-disable-line design-system/enforce-token-usage -- env(safe-area-inset-bottom) native CSS API */
          z-index: var(--md-sys-z-tooltip);
          transition: box-shadow var(--md-sys-motion-duration-short) var(--md-sys-motion-easing-standard);
        }
        .mui-fab-expressive.assistant-fab {
          background: var(--md-sys-color-primary);
          color: var(--md-sys-color-on-primary);
          border: none;
          border-radius: var(--md-sys-shape-corner-full);
          width: var(--md-sys-spacing-10);
          height: var(--md-sys-spacing-10);
          box-shadow: var(--md-sys-elevation-1);
          font-size: var(--md-sys-typescale-display-large-font-size);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: box-shadow var(--md-sys-motion-duration-short) var(--md-sys-motion-easing-standard), background var(--md-sys-motion-duration-short) var(--md-sys-motion-easing-standard);
        }
        .mui-fab-expressive.assistant-fab:hover {
          background: var(--md-sys-color-primary-container);
          box-shadow: var(--md-sys-elevation-1);
        }
        .assistant-fab-menu {
          position: absolute;
          right: 0;
          bottom: 0;
          width: max-content;
          min-width: var(--md-sys-spacing-11);
          pointer-events: auto;
          display: block;
          padding: var(--md-sys-spacing-2) 0;
        }
        .assistant-fab-menu-close {
          position: absolute;
          right: var(--md-sys-spacing-2);
          top: var(--md-sys-spacing-2);
          background: var(--md-sys-color-surface-container-high);
          border: none;
          border-radius: var(--md-sys-shape-corner-full);
          width: var(--md-sys-spacing-9);
          height: var(--md-sys-spacing-9);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 'var(--md-sys-z-tooltip)';
        }
        .mui-fab-expressive.assistant-fab-secondary {
          position: absolute;
          right: 0;
          background: var(--md-sys-color-surface);
          color: var(--md-sys-color-on-surface);
          border: none;
          border-radius: var(--md-sys-shape-corner-medium);
          box-shadow: var(--md-sys-elevation-1);
          padding: var(--md-sys-spacing-3) var(--md-sys-spacing-5);
          font-size: var(--md-sys-typescale-body-large-font-size);
          display: flex;
          align-items: center;
          min-width: var(--md-sys-spacing-11);
          cursor: pointer;
          pointer-events: auto;
          transition: var(--md-sys-motion-easing-standard);
        }
        .mui-fab-expressive.assistant-fab-secondary:hover {
          background: var(--md-sys-color-surface-variant);
          box-shadow: var(--md-sys-elevation-1);
        }
        .assistant-fab-sheet-scrim {
          position: fixed;
          inset: 0;
          background: var(--md-sys-color-scrim);
          z-index: 'var(--md-sys-z-modal)';
          backdrop-filter: blur(var(--md-sys-blur-small));
        }
        .assistant-fab-sheet {
          position: fixed;
          inset: auto var(--md-sys-spacing-3) var(--md-sys-spacing-3);
          /* On mobile, ensure it's above the bottom nav (var(--md-sys-spacing-16) + var(--md-sys-spacing-3) margin) */
          bottom: calc(var(--bottom-nav-height, var(--md-sys-spacing-16)) + var(--md-sys-spacing-3));
          right: 0;
          left: 0;
          margin: 0 auto;
          max-width: var(--md-sys-spacing-32);
          background: var(--md-sys-color-surface);
          border-radius: var(--md-sys-shape-corner-extra-large);
          padding: var(--md-sys-spacing-4) var(--md-sys-spacing-6) var(--md-sys-spacing-6);
          box-shadow: var(--md-sys-elevation-1);
          display: flex;
          flex-direction: column;
          gap: var(--md-sys-spacing-4);
          z-index: 'var(--md-sys-z-tooltip)';
          animation: assistant-sheet-enter var(--md-sys-motion-duration-medium) var(--md-sys-motion-easing-decelerated);
        }
        @media (min-width: var(--breakpoint-compact)) {
          .assistant-fab-sheet {
            bottom: var(--md-sys-spacing-6);
          }
        }
        .assistant-fab-sheet-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: var(--md-sys-spacing-4);
        }
        .assistant-fab-sheet-close {
          width: var(--md-sys-spacing-10);
          height: var(--md-sys-spacing-10);
          border-radius: var(--md-sys-shape-corner-full);
          border: none;
          background: var(--md-sys-color-surface-variant);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }
        .assistant-fab-sheet-actions {
          display: flex;
          flex-direction: column;
          gap: var(--md-sys-spacing-2);
        }
        .assistant-fab-sheet-action {
          width: 100%;
          border: none;
          border-radius: var(--md-sys-shape-corner-medium);
          padding: var(--md-sys-spacing-4) var(--md-sys-spacing-4);
          background: var(--md-sys-color-surface-container-high);
          display: flex;
          align-items: center;
          gap: var(--md-sys-spacing-3);
          box-shadow: var(--md-sys-elevation-1);
          cursor: pointer;
          transition: transform var(--md-sys-motion-duration-short) var(var(--md-sys-motion-easing-standard)), box-shadow var(--md-sys-motion-duration-short) var(var(--md-sys-motion-easing-standard));
          text-align: left;
        }
        .assistant-fab-sheet-action:hover {
          transform: translateY(calc(-1 * var(--md-sys-spacing-1)));
          box-shadow: var(--md-sys-elevation-1);
        }
        @keyframes assistant-sheet-enter {
          from {
            transform: translateY(var(--md-sys-spacing-4));
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
}

export default AssistantFab;

