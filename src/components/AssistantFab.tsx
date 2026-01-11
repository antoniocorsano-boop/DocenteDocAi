// M3Expressive refactor: ✅ COMPLETED - Removed inline Tailwind classes, applied dedicated CSS classes with M3 tokens for colors, spacing, typography, elevation. Maintained responsive behavior and animations.
// ...existing code...
// ...existing code...
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
        className="assistant-fab-root"
        ref={fabRef}
        style={{ touchAction: 'none' }}
      >
        <button
          className="mui-fab-expressive assistant-fab"
          aria-label="Assistente AI"
          onClick={handleFabClick}
        >
          <span style={{
  fontFamily: 'Material Symbols Outlined'
}}>auto_mode</span>
        </button>
        {menuOpen && (
          <>
            {isCompactLayout && (
              <>
                <div className="assistant-fab-sheet-scrim" role="presentation" onClick={() => setMenuOpen(false)} />
                <div className="assistant-fab-sheet" role="dialog" aria-modal="true" aria-label="Azioni assistente">
                  <div className="assistant-fab-sheet-header">
                    <div>
                      <p className="assistant-fab-sheet-title">Assistente AI</p>
                      <p className="assistant-fab-sheet-subtitle">Azioni rapide</p>
                    </div>
                    <button
                      className="assistant-fab-sheet-close"
                      aria-label="Chiudi menu assistente"
                      onClick={() => setMenuOpen(false)}
                    >
                      <span style={{
  fontFamily: 'Material Symbols Outlined'
}}>close</span>
                    </button>
                  </div>
                  <div className="assistant-fab-sheet-actions">
                    {ACTIONS.map((action) => (
                      <button
                        key={action.key}
                        className="assistant-fab-sheet-action"
                        onClick={() => handleAction(action)}
                        aria-label={action.label}
                      >
                        <span className="material-symbols-outlined assistant-fab-action-icon">{action.icon}</span>
                        <div className="assistant-fab-action-text">
                          <p className="assistant-fab-action-label">{action.label}</p>
                          <p className="assistant-fab-action-description">{action.description}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
            {!isCompactLayout && (
              <div className="assistant-fab-menu">
                {/* Close menu / quick close modal button */}
                <button
                  aria-label="Chiudi menu"
                  title="Chiudi menu"
                  className="assistant-fab-menu-close"
                  onClick={() => setMenuOpen(false)}
                >
                  <span style={{
  fontFamily: 'Material Symbols Outlined'
}}>close</span>
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
                        ...posStyle,
                        zIndex: Z_INDEX.assistant.fab + 1 - i,
                      }}
                      onClick={() => handleAction(a)}
                      aria-label={a.label}
                    >
                      <span style={{
  fontFamily: 'Material Symbols Outlined'
}}>{a.icon}</span>
                      <span className="assistant-fab-menu-label">{a.label}</span>
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
          right: var(--md-sys-spacing-6);
          bottom: 96px;
          z-index: ${Z_INDEX.assistant.fab};
          transition: box-shadow 0.2s;
        }
        .mui-fab-expressive.assistant-fab {
          background: var(--md-sys-color-primary);
          color: var(--md-sys-color-on-primary);
          border: none;
          border-radius: var(--shape-full);
          width: 64px;
          height: 64px;
          box-shadow: var(--elevation-3);
          font-size: 2.2rem;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: box-shadow 0.2s, background 0.2s;
        }
        .mui-fab-expressive.assistant-fab:hover {
          background: var(--md-sys-color-primary-container);
          box-shadow: var(--elevation-2);
        }
        .assistant-fab-menu {
          position: absolute;
          right: 0;
          bottom: 0;
          width: max-content;
          min-width: 180px;
          pointer-events: auto;
          display: block;
          padding: var(--md-sys-spacing-2) 0;
        }
        .assistant-fab-menu-close {
          position: absolute;
          right: var(--md-sys-spacing-2);
          top: var(--md-sys-spacing-2);
          background: rgba(0,0,0,0.04);
          border: none;
          border-radius: var(--shape-full);
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 1300;
        }
        .mui-fab-expressive.assistant-fab-secondary {
          position: absolute;
          right: 0;
          background: var(--md-sys-color-surface);
          color: var(--md-sys-color-on-surface);
          border: none;
          border-radius: var(--shape-m);
          box-shadow: var(--elevation-2);
          padding: 0.7rem 1.2rem;
          font-size: 1.1rem;
          display: flex;
          align-items: center;
          min-width: 180px;
          cursor: pointer;
          pointer-events: auto;
          transition: var(--md-easing-standard);
        }
        .mui-fab-expressive.assistant-fab-secondary:hover {
          background: var(--md-sys-color-surface-variant);
          box-shadow: var(--elevation-3);
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
          background: var(--md-sys-color-surface);
          border-radius: var(--shape-xl);
          padding: 1.1rem 1.5rem 1.5rem;
          box-shadow: var(--elevation-3);
          display: flex;
          flex-direction: column;
          gap: 1rem;
          z-index: 1199;
          animation: assistant-sheet-enter 0.25s ease-out;
        }
        @media (min-width: 600px) {
          .assistant-fab-sheet {
            bottom: var(--md-sys-spacing-6);
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
          border-radius: 999px;
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
          gap: 0.6rem;
        }
        .assistant-fab-sheet-action {
          width: 100%;
          border: none;
          border-radius: var(--shape-m);
          padding: 0.95rem 1.1rem;
          background: var(--md-sys-color-surface-container-high);
          display: flex;
          align-items: center;
          gap: 0.75rem;
          box-shadow: var(--elevation-2);
          cursor: pointer;
          transition: transform 0.2s var(--motion-easing-standard), box-shadow 0.2s var(--motion-easing-standard);
          text-align: left;
        }
        .assistant-fab-sheet-action:hover {
          transform: translateY(-2px);
          box-shadow: var(--elevation-3);
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


