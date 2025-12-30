import React from 'react';
import { useUIStore } from '../stores/useUIStore';

interface AssistantFabProps {}

const ACTIONS = [
  { key: 'chat', label: 'Chat & Suggerimenti', icon: 'chat_bubble' },
  { key: 'docs', label: 'Documenti AI', icon: 'description' },
  { key: 'tools', label: 'Analisi & Strumenti', icon: 'psychology' },
  { key: 'backup', label: 'Backup & Drive', icon: 'cloud_sync' },
];

type AssistantMode = 'chat' | 'docs' | 'tools' | 'backup';

const AssistantFab: React.FC<AssistantFabProps> = () => {
  // Helper to suppress logs in test/instrumented runs
  const safeConsole = React.useCallback((method: 'log' | 'info' | 'warn' | 'error' | 'debug', ...args: unknown[]) => {
    try {
      if (typeof window === 'undefined') return;
      const silent = (window.__TEST_MODE === true) || (window.__SILENCE_ASSISTANT_LOGS === true);
      if (silent) return;
      // eslint-disable-next-line no-console
      const fn = (console as unknown as Record<'log'|'info'|'warn'|'error'|'debug', (...a: unknown[]) => void>)[method];
      fn?.(...args);
    } catch (e) {
      // swallow
    }
  }, []);
  // Stato globale modale

  const isAssistantOpen = useUIStore(s => s.modals.isLiveAssistantModalOpen);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [mode, setMode] = React.useState<AssistantMode>('chat');

  // Chiudi menu quando il modale assistant si apre o si chiude
  React.useEffect(() => {
    if (isAssistantOpen && menuOpen) setMenuOpen(false);
  }, [isAssistantOpen, menuOpen]);

  // Log ad ogni render per debug profondo, saltato in test-mode
  safeConsole('info', '[AssistantFab][RENDER]', { menuOpen, mode });

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
      // eslint-disable-next-line no-console
      console.warn('[E2E][AssistantFab] action selected', { key: action.key, label: action.label });
    } catch (e) {
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

  return (
    <>
      <div
        className="assistant-fab-root"
        ref={fabRef}
        style={{
          position: 'fixed',
          right: 24,
          bottom: 96,
          zIndex: 1200,
          transition: 'box-shadow 0.2s',
          touchAction: 'none',
        }}
      >
        <button
          className="mui-fab-expressive assistant-fab"
          aria-label="Assistente AI"
          onClick={handleFabClick}
        >
          <span className="material-symbols-outlined">smart_toy</span>
        </button>
        {menuOpen && (
          <div className="assistant-fab-menu" style={{ pointerEvents: 'auto' }}>
            {/* Close menu / quick close modal button */}
            <button
              aria-label="Chiudi menu"
              title="Chiudi menu"
              className="assistant-fab-menu-close"
              onClick={() => setMenuOpen(false)}
            >
              <span className="material-symbols-outlined">close</span>
            </button>
            {ACTIONS.map((a, i) => {
              const offset = (i + 1) * 72; // spacing between actions
              const posStyle: React.CSSProperties = menuDirection === 'up'
                ? { bottom: `${offset}px` }
                : { top: `${offset}px` };
              return (
                <button
                  key={a.key}
                  className="mui-fab-expressive assistant-fab-secondary"
                  style={{
                    position: 'absolute',
                    right: 0,
                    ...posStyle,
                    zIndex: 1201 - i,
                    transition: 'var(--md-easing-standard)', // MD3 fix
                    pointerEvents: 'auto',
                  }}
                  onClick={() => handleAction(a)}
                  aria-label={a.label}
                >
                  <span className="material-symbols-outlined">{a.icon}</span>
                  <span style={{marginLeft: 8, fontWeight: 500}}>{a.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
      <style>{`
        .assistant-fab-root {
          position: fixed;
          bottom: 2.2rem;
          right: 2.2rem;
          z-index: 1200;
        }
        .mui-fab-expressive.assistant-fab {
          background: var(--sys-primary, #1976d2);
          color: var(--sys-on-primary, #fff);
          border: none;
          border-radius: var(--md-corner-28); // MD3 fix
          width: 64px;
          height: 64px;
          box-shadow: var(--md-elevation-2); // MD3 fix
          font-size: 2.2rem;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: box-shadow 0.2s, background 0.2s;
        }
        .mui-fab-expressive.assistant-fab:hover {
          background: var(--sys-primary-container, #1565c0);
          box-shadow: var(--md-elevation-0); // MD3 fix
        }
        .assistant-fab-menu {
          position: absolute;
          right: 0;
          bottom: 0;
          width: max-content;
          min-width: 180px;
          pointer-events: auto;
          display: block;
          padding: 8px 0;
        }
        .assistant-fab-menu-close {
          position: absolute;
          right: 8px;
          top: 8px;
          background: rgba(0,0,0,0.04);
          border: none;
          border-radius: var(--md-corner-4); // MD3 fix
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 1300;
        }
        .mui-fab-expressive.assistant-fab-secondary {
          background: var(--sys-surface, #fff);
          color: var(--sys-on-surface, #222);
          border: none;
          border-radius: var(--md-corner-16); // MD3 fix
          box-shadow: var(--md-elevation-2); // MD3 fix
          padding: 0.7rem 1.2rem;
          font-size: 1.1rem;
          display: flex;
          align-items: center;
          min-width: 180px;
          cursor: pointer;
          pointer-events: auto;
          transition: background 0.18s, box-shadow 0.18s;
        }
        .mui-fab-expressive.assistant-fab-secondary:hover {
          background: var(--sys-surface-variant, #f5f5f5);
          box-shadow: var(--md-elevation-2); // MD3 fix
        }
        @media (max-width: 600px) {
          .assistant-fab-root { bottom: 1.1rem; right: 1.1rem; }
        }
      `}</style>
    </>
  );
}

export default AssistantFab;