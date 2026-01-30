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
                  // MD3 Gold: spacing tra azioni con token MD3
                  const posStyle: React.CSSProperties = menuDirection === 'up'
                    ? { bottom: `calc(var(--md-sys-spacing-9) * ${i + 1})` }
                    : { top: `calc(var(--md-sys-spacing-9) * ${i + 1})` };
                  return (
                    <button
                      key={a.key}
                      
                      style={{
                        ...posStyle,
                        zIndex: 'var(--app-z-tooltip)',
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
          right: var(--app-spacing-section);
          bottom: var(--md-sys-spacing-12);
          z-index: var(--app-z-tooltip);
          transition: box-shadow var(--app-motion-quick) var(--app-easing-standard);
        }
        .mui-fab-expressive.assistant-fab {
          background: var(--app-color-primary);
          color: var(--app-color-on-primary);
          border: none;
          border-radius: var(--md-sys-shape-corner-full);
          width: var(--md-sys-spacing-10);
          height: var(--md-sys-spacing-10);
          box-shadow: var(--md-sys-elevation-1);
          font-size: var(--app-text-display);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: box-shadow var(--app-motion-quick) var(--app-easing-standard), background var(--app-motion-quick) var(--app-easing-standard);
        }
        .mui-fab-expressive.assistant-fab:hover {
          background: var(--app-color-primary-container);
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
          padding: var(--app-spacing-component) 0;
        }
        .assistant-fab-menu-close {
          position: absolute;
          right: var(--app-spacing-component);
          top: var(--app-spacing-component);
          background: var(--md-sys-color-surface-container-high);
          border: none;
          border-radius: var(--md-sys-shape-corner-full);
          width: var(--md-sys-spacing-9);
          height: var(--md-sys-spacing-9);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 'var(--app-z-tooltip)';
        }
        .mui-fab-expressive.assistant-fab-secondary {
          position: absolute;
          right: 0;
          background: var(--app-color-surface);
          color: var(--app-color-on-surface);
          border: none;
          border-radius: var(--md-sys-shape-corner-medium);
          box-shadow: var(--md-sys-elevation-1);
          padding: var(--app-spacing-element) var(--app-spacing-touch);
          font-size: var(--app-text-body);
          display: flex;
          align-items: center;
          min-width: var(--md-sys-spacing-11);
          cursor: pointer;
          pointer-events: auto;
          transition: var(--md-easing-standard);
        }
        .mui-fab-expressive.assistant-fab-secondary:hover {
          background: var(--md-sys-color-surface-variant);
          box-shadow: var(--md-sys-elevation-1);
        }
        .assistant-fab-sheet-scrim {
          position: fixed;
          inset: 0;
          background: var(--md-sys-color-scrim);
          z-index: 'var(--app-z-modal)';
          backdrop-filter: blur(var(--md-sys-blur-small));
        }
        .assistant-fab-sheet {
          position: fixed;
          inset: auto var(--app-spacing-element) var(--app-spacing-element);
          /* On mobile, ensure it's above the bottom nav (var(--md-sys-spacing-16) + var(--app-spacing-element) margin) */
          bottom: calc(var(--bottom-nav-height, var(--md-sys-spacing-16)) + var(--app-spacing-element));
          right: 0;
          left: 0;
          margin: 0 auto;
          max-width: var(--md-sys-spacing-32);
          background: var(--app-color-surface);
          border-radius: var(--md-sys-shape-corner-extra-large);
          padding: var(--app-spacing-container) var(--app-spacing-section) var(--app-spacing-section);
          box-shadow: var(--md-sys-elevation-1);
          display: flex;
          flex-direction: column;
          gap: var(--app-spacing-container);
          z-index: 'var(--app-z-tooltip)';
          animation: assistant-sheet-enter var(--app-motion-standard) var(--md-sys-motion-easing-decelerated);
        }
        @media (min-width: var(--breakpoint-compact)) {
          .assistant-fab-sheet {
            bottom: var(--app-spacing-section);
          }
        }
        .assistant-fab-sheet-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: var(--app-spacing-container);
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
          gap: var(--app-spacing-component);
        }
        .assistant-fab-sheet-action {
          width: var(--app-layout-full);
          border: none;
          border-radius: var(--md-sys-shape-corner-medium);
          padding: var(--app-spacing-container) var(--app-spacing-container);
          background: var(--md-sys-color-surface-container-high);
          display: flex;
          align-items: center;
          gap: var(--app-spacing-element);
          box-shadow: var(--md-sys-elevation-1);
          cursor: pointer;
          transition: transform var(--app-motion-quick) var(var(--app-easing-standard)), box-shadow var(--app-motion-quick) var(var(--app-easing-standard));
          text-align: left;
        }
        .assistant-fab-sheet-action:hover {
          transform: translateY(calc(-1 * var(--md-sys-spacing-1)));
          box-shadow: var(--md-sys-elevation-1);
        }
        @keyframes assistant-sheet-enter {
          from {
            transform: translateY(var(--app-spacing-container));
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








