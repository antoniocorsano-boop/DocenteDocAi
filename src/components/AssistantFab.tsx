// MD3 Compliant - Block I Migration (6 violations eliminated)

import React from 'react';
import { useUIStore } from '../stores/useUIStore';
import { Z_INDEX } from '../design-system/zIndex';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface AssistantFabProps {}

const ACTIONS: Array<{ key: AssistantMode; label: string; icon: string; description: string }> = [
  { key: 'chat', label: 'Chat & Suggerimenti', icon: 'chat_bubble', description: 'Dialogo e azioni consigliate' },
  { key: 'docs', label: 'Documenti AI', icon: 'description', description: 'Genera relazioni e UDA' },
  { key: 'tools', label: 'Analisi & Strumenti', icon: 'psychology', description: 'Analisi rapide e insight' },
  { key: 'backup', label: 'Backup & Drive', icon: 'cloud_sync', description: 'Backup e sincronizzazione' },
];

type AssistantMode = 'chat' | 'docs' | 'tools' | 'backup';

const AssistantFab: React.FC<AssistantFabProps> = () => {
  // Helper to suppress logs in test/instrumented runs
  const safeConsole = React.useCallback((method: 'log' | 'info' | 'warn' | 'error' | 'debug', ...args: unknown[]) => {
    try {
      if (typeof window === 'undefined') return;
      const silent = (window.__TEST_MODE === true) || (window.__SILENCE_ASSISTANT_LOGS === true);
      if (silent) return;
       
      const fn = (console as unknown as Record<'log'|'info'|'warn'|'error'|'debug', (...a: unknown[]) => void>)[method];
      fn?.(...args);
    } catch {
      // swallow
    }
  }, []);
  // Stato globale modale

  const isAssistantOpen = useUIStore(s => s.modals.isLiveAssistantModalOpen);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [mode, setMode] = React.useState<AssistantMode>('chat');
  const [isCompactLayout, setIsCompactLayout] = React.useState(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth <= 640;
  });

  // Chiudi menu quando il modale assistant si apre o si chiude
  React.useEffect(() => {
    if (isAssistantOpen && menuOpen) setMenuOpen(false);
  }, [isAssistantOpen, menuOpen]);

  // Log ad ogni render per debug profondo, saltato in test-mode
  safeConsole('info', '[AssistantFab][RENDER]', `menuOpen: ${menuOpen}, mode: ${mode}`);

  // Use store hook for modal toggle and reduce noisy logging during tests
  const toggleModal = useUIStore(state => state.actions.toggleModal);

  // Reduce debug logging and skip during test mode to avoid noisy console output
  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const isTest = window.__TEST_MODE === true;
    if (isTest) return; // skip logging in test runs

    const intervalDom = setInterval(() => {
      const fabs = document.querySelectorAll('.assistant-fab-root');
      safeConsole('debug', '[AssistantFab][DOM] .assistant-fab-root count:', fabs.length);
    }, 3000);
    const intervalMenu = setInterval(() => {
      const menus = document.querySelectorAll('.assistant-fab-menu');
      safeConsole('debug', '[AssistantFab][DOM] .assistant-fab-menu count:', menus.length, 'menuOpen:', menuOpen);
    }, 3000);
    return () => {
      clearInterval(intervalDom);
      clearInterval(intervalMenu);
    };
  }, [menuOpen]);


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
      const actionsHeight = ACTIONS.length * 80 + 64; // 80px per azione, 64px FAB
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
    // Open the global Assistant modal when an action is selected
    try {
      // Emit a concise runtime warning so Playwright traces capture the user action
       
      console.warn('[E2E][AssistantFab] action selected', { key: action.key, label: action.label });
    } catch {
      // ignore
    }
    if (toggleModal) toggleModal('isLiveAssistantModalOpen', true);
    // Close the FAB menu
    setMenuOpen(false);
  };

  React.useEffect(() => {
    if (window.__TEST_MODE === true) return;
    if (menuOpen) {
      safeConsole('info', '[AssistantFab] MENU FAB APERTO', { menuOpen, mode, stack: new Error().stack });
    } else {
      safeConsole('info', '[AssistantFab] MENU FAB CHIUSO', { menuOpen, mode, stack: new Error().stack });
    }
  }, [menuOpen, mode]);

  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleResize = () => setIsCompactLayout(window.innerWidth <= 640);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      <div
        
        ref={fabRef}
        style={{ touchAction: 'none' }}
      >
        <button
          
          aria-label="Assistente AI"
          onClick={handleFabClick}
        >
          <span style={{ fontFamily: 'Material Symbols Outlined' }}>auto_mode</span>
        </button>
        {menuOpen && (
          <>
            {isCompactLayout && (
              <>
                <div  role="presentation" onClick={() => setMenuOpen(false)} />
                <div  role="dialog" aria-modal="true" aria-label="Azioni assistente">
                  <div >
                    <div>
                      <p >Assistente AI</p>
                      <p >Azioni rapide</p>
                    </div>
                    <button
                      
                      aria-label="Chiudi menu assistente"
                      onClick={() => setMenuOpen(false)}
                    >
                      <span style={{ fontFamily: 'Material Symbols Outlined' }}>close</span>
                    </button>
                  </div>
                  <div >
                    {ACTIONS.map((action) => (
                      <button
                        key={action.key}
                        
                        onClick={() => handleAction(action)}
                        aria-label={action.label}
                      >
                        <span style={{ fontFamily: 'Material Symbols Outlined' }}>{action.icon}</span>
                        <div >
                          <p >{action.label}</p>
                          <p >{action.description}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
            {!isCompactLayout && (
              <div >
                {/* Close menu / quick close modal button */}
                <button
                  aria-label="Chiudi menu"
                  title="Chiudi menu"
                  
                  onClick={() => setMenuOpen(false)}
                >
                  <span style={{ fontFamily: 'Material Symbols Outlined' }}>close</span>
                </button>
                {ACTIONS.map((a, i) => {
                  const offset = (i + 1) * 72; // spacing between actions
                  const posStyle: React.CSSProperties = menuDirection === 'up'
                    ? { bottom: `${offset}px` }
                    : { top: `${offset}px` };
                  return (
                    <button
                      key={a.key}
                      
                      style={{
                        ...posStyle,
                        zIndex: Z_INDEX.assistant.fab + 1 - i,
                      }}
                      onClick={() => handleAction(a)}
                      aria-label={a.label}
                    >
                      <span style={{ fontFamily: 'Material Symbols Outlined' }}>{a.icon}</span>
                      <span >{a.label}</span>
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
          right: 'var(--md-sys-spacing-6)';
          bottom: var(--md-sys-spacing-12);
          z-index: ${Z_INDEX.assistant.fab};
          transition: box-shadow 0.2s;
        }
        .mui-fab-expressive.assistant-fab {
          background: 'var(--md-sys-color-primary)';
          color: 'var(--md-sys-color-on-primary)';
          border: none;
          border-radius: var(--md-sys-shape-corner-full);
          width: var(--md-sys-spacing-10);
          height: var(--md-sys-spacing-10);
          box-shadow: var(--md-sys-elevation-level-3);
          font-size: var(--md-sys-typescale-display-small-font-size);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: box-shadow 0.2s, background 0.2s;
        }
        .mui-fab-expressive.assistant-fab:hover {
          background: 'var(--md-sys-color-primaryContainer)';
          box-shadow: var(--md-sys-elevation-level-2);
        }
        .assistant-fab-menu {
          position: absolute;
          right: 0;
          bottom: 0;
          width: max-content;
          min-width: var(--md-sys-spacing-11);
          pointer-events: auto;
          display: block;
          padding: 'var(--md-sys-spacing-2)' 0;
        }
        .assistant-fab-menu-close {
          position: absolute;
          right: 'var(--md-sys-spacing-2)';
          top: 'var(--md-sys-spacing-2)';
          background: rgba(0,0,0,0.04);
          border: none;
          border-radius: var(--md-sys-shape-corner-full);
          width: var(--md-sys-spacing-9);
          height: var(--md-sys-spacing-9);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 1300;
        }
        .mui-fab-expressive.assistant-fab-secondary {
          position: absolute;
          right: 0;
          background: 'var(--md-sys-color-surface)';
          color: 'var(--md-sys-color-onSurface)';
          border: none;
          border-radius: var(--md-sys-shape-corner-medium);
          box-shadow: var(--md-sys-elevation-level-2);
          padding: var(--md-sys-spacing-3) var(--md-sys-spacing-5);
          font-size: var(--md-sys-typescale-body-large-font-size);
          display: flex;
          align-items: center;
          min-width: var(--md-sys-spacing-11);
          cursor: pointer;
          pointer-events: auto;
          transition: var(--md-easing-standard);
        }
        .mui-fab-expressive.assistant-fab-secondary:hover {
          background: 'var(--md-sys-color-surface-variant)';
          box-shadow: var(--md-sys-elevation-level-3);
        }
        .assistant-fab-sheet-scrim {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.35);
          z-index: 1198;
          backdrop-filter: blur(2px);
        }
        .assistant-fab-sheet {
          position: fixed;
          inset: auto var(--md-sys-spacing-3) var(--md-sys-spacing-3);
          /* On mobile, ensure it's above the bottom nav (64px + var(--md-sys-spacing-3) margin) */
          bottom: calc(var(--bottom-nav-height, 64px) + var(--md-sys-spacing-3));
          right: 0;
          left: 0;
          margin: 0 auto;
          max-width: 520px;
          background: 'var(--md-sys-color-surface)';
          border-radius: var(--md-sys-shape-corner-extra-large);
          padding: 1.1rem 1.5rem 1.5rem;
          box-shadow: var(--md-sys-elevation-level-3);
          display: flex;
          flex-direction: column;
          gap: 1rem;
          z-index: 1199;
          animation: assistant-sheet-enter 0.25s ease-out;
        }
        @media (min-width: 600px) {
          .assistant-fab-sheet {
            bottom: 'var(--md-sys-spacing-6)';
          }
        }
        .assistant-fab-sheet-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
        }
        .assistant-fab-sheet-close {
          width: 40px;
          height: 40px;
          border-radius: var(--md-sys-shape-corner-full);
          border: none;
          background: 'var(--md-sys-color-surface-variant)';
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
          background: 'var(--md-sys-color-surfaceContainerHigh)';
          display: flex;
          align-items: center;
          gap: var(--md-sys-spacing-3);
          box-shadow: var(--md-sys-elevation-level-2);
          cursor: pointer;
          transition: transform 0.2s var(--motion-easing-standard), box-shadow 0.2s var(--motion-easing-standard);
          text-align: left;
        }
        .assistant-fab-sheet-action:hover {
          transform: translateY(calc(-1 * var(--md-sys-spacing-1)));
          box-shadow: var(--md-sys-elevation-level-3);
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







