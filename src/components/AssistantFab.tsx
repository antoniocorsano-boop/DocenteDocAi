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
  // Stato globale modale

  const isAssistantOpen = useUIStore(s => s.modals.isLiveAssistantModalOpen);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [mode, setMode] = React.useState<AssistantMode>('chat');

  // Chiudi menu quando il modale assistant si apre o si chiude
  React.useEffect(() => {
    if (isAssistantOpen && menuOpen) setMenuOpen(false);
  }, [isAssistantOpen, menuOpen]);

  // Log ad ogni render per debug profondo, saltato in test-mode
  if (typeof window === 'undefined' || (window as any).__TEST_MODE !== true) {
    console.info('[AssistantFab][RENDER]', { menuOpen, mode });
  }

  // Use store hook for modal toggle and reduce noisy logging during tests
  const toggleModal = useUIStore(state => state.actions.toggleModal);

  // Reduce debug logging and skip during test mode to avoid noisy console output
  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const isTest = (window as any).__TEST_MODE === true;
    if (isTest) return; // skip logging in test runs

    const intervalDom = setInterval(() => {
      const fabs = document.querySelectorAll('.assistant-fab-root');
      console.debug('[AssistantFab][DOM] .assistant-fab-root count:', fabs.length);
    }, 3000);
    const intervalMenu = setInterval(() => {
      const menus = document.querySelectorAll('.assistant-fab-menu');
      console.debug('[AssistantFab][DOM] .assistant-fab-menu count:', menus.length, 'menuOpen:', menuOpen);
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
    if (toggleModal) toggleModal('isLiveAssistantModalOpen', true);
    // Close the FAB menu
    setMenuOpen(false);
  };

  React.useEffect(() => {
    if ((window as any).__TEST_MODE === true) return;
    if (menuOpen) {
      console.info('[AssistantFab] MENU FAB APERTO', { menuOpen, mode, stack: new Error().stack });
    } else {
      console.info('[AssistantFab] MENU FAB CHIUSO', { menuOpen, mode, stack: new Error().stack });
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
          <div className="assistant-fab-menu" style={{ pointerEvents: 'none' }}>
            {ACTIONS.map((a, i) => {
              const offset = (i + 1) * 80;
              const transform = menuDirection === 'up'
                ? `translateY(-${offset}px)`
                : `translateY(${offset}px)`;
              return (
                <button
                  key={a.key}
                  className="mui-fab-expressive assistant-fab-secondary"
                  style={{
                    transform,
                    zIndex: 1201 - i,
                    transition: 'transform 0.25s cubic-bezier(.4,2,.6,1), box-shadow 0.2s',
                    right: 0,
                    bottom: 0,
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
          border-radius: 50%;
          width: 64px;
          height: 64px;
          box-shadow: 0 6px 24px rgba(0,0,0,0.18);
          font-size: 2.2rem;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: box-shadow 0.2s, background 0.2s;
        }
        .mui-fab-expressive.assistant-fab:hover {
          background: var(--sys-primary-container, #1565c0);
          box-shadow: 0 10px 32px rgba(0,0,0,0.22);
        }
        .assistant-fab-menu {
          position: absolute;
          right: 0;
          bottom: 0;
          width: 100%;
          pointer-events: none;
        }
        .mui-fab-expressive.assistant-fab-secondary {
          background: var(--sys-surface, #fff);
          color: var(--sys-on-surface, #222);
          border: none;
          border-radius: 1.2rem;
          box-shadow: 0 4px 16px rgba(0,0,0,0.13);
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
          box-shadow: 0 8px 24px rgba(0,0,0,0.18);
        }
        @media (max-width: 600px) {
          .assistant-fab-root { bottom: 1.1rem; right: 1.1rem; }
        }
      `}</style>
    </>
  );
}

export default AssistantFab;