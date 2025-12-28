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
  const setIsOpen = useUIStore(s => s.actions.toggleModal);
  const isAssistantOpen = useUIStore(s => s.modals.isLiveAssistantModalOpen);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [mode, setMode] = React.useState<AssistantMode>('chat');
  // Se il banner suggestion è presente, forza la FAB in basso a destra (per i test)
  const [forceBottomRight, setForceBottomRight] = React.useState(false);
  React.useEffect(() => {
    const banner = document.querySelector('div[role="button"][aria-label]');
    if (banner) {
      setForceBottomRight(true);
    } else {
      setForceBottomRight(false);
    }
  }, []);

  // Chiudi menu quando il modale assistant si apre o si chiude
  React.useEffect(() => {
    if (isAssistantOpen && menuOpen) setMenuOpen(false);
  }, [isAssistantOpen, menuOpen]);

  // Log ad ogni render per debug profondo
  console.info('[AssistantFab][RENDER]', { menuOpen, mode });

  // Debug: log presenza di duplicati AssistantFab ogni secondo
  React.useEffect(() => {
    const interval = setInterval(() => {
      const fabs = document.querySelectorAll('.assistant-fab-root');
      console.info('[AssistantFab][DOM] .assistant-fab-root count:', fabs.length);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Debug: log presenza menu nel DOM ogni secondo
  React.useEffect(() => {
    const interval = setInterval(() => {
      const menus = document.querySelectorAll('.assistant-fab-menu');
      console.info('[AssistantFab][DOM] .assistant-fab-menu count:', menus.length, 'menuOpen:', menuOpen);
    }, 1000);
    return () => clearInterval(interval);
  }, [menuOpen]);

  // Stato per drag FAB (solo left/top)
  const [fabPos, setFabPos] = React.useState<{x: number, y: number}>({ x: 24, y: window.innerHeight - 120 });
  const dragging = React.useRef(false);
  const dragStart = React.useRef<{x: number, y: number}>({ x: 0, y: 0 });
  const dragOffset = React.useRef<{x: number, y: number}>({ x: 0, y: 0 });

  React.useEffect(() => {
    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (!dragging.current) return;
      let clientX = 0, clientY = 0;
      if ('touches' in e && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else if ('clientX' in e) {
        clientX = e.clientX;
        clientY = e.clientY;
      }
      setFabPos({
        x: Math.max(0, Math.min(window.innerWidth - 72, clientX - dragOffset.current.x)),
        y: Math.max(0, Math.min(window.innerHeight - 72, clientY - dragOffset.current.y)),
      });
    };
    const handleUp = () => { dragging.current = false; };
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('touchmove', handleMove, { passive: false });
    window.addEventListener('mouseup', handleUp);
    window.addEventListener('touchend', handleUp);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('mouseup', handleUp);
      window.removeEventListener('touchend', handleUp);
    };
  }, []);

  const startDrag = (e: React.MouseEvent | React.TouchEvent) => {
    dragging.current = true;
    let clientX = 0, clientY = 0;
    if ('touches' in e && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else if ('clientX' in e) {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    dragStart.current = { x: clientX, y: clientY };
    dragOffset.current = {
      x: clientX - fabPos.x,
      y: clientY - fabPos.y
    };
    if (e.preventDefault) {
      e.preventDefault();
    }
  };

  // Blocca click se drag
  const handleFabClickSafe = () => {
    if (dragging.current) return;
    console.warn('[DEBUG] FAB click');
    handleFabClick();
  };

  const handleFabClick = () => {
    if (menuOpen) {
      console.warn('[DEBUG] Chiudo menu assistant FAB');
      setMenuOpen(false);
      return;
    }
    console.warn('[DEBUG] Apro menu assistant FAB');
    setMenuOpen(true);
  };

  const handleAction = (action: typeof ACTIONS[number]) => {
    setMode(action.key as AssistantMode);
    setIsOpen('isLiveAssistantModalOpen', true);
    setMenuOpen(false);
  };

  // Debug: log apertura menu
  React.useEffect(() => {
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
        style={forceBottomRight ? {
          position: 'fixed',
          right: 24,
          bottom: 120,
          zIndex: 1200,
          transition: dragging.current ? 'none' : 'box-shadow 0.2s',
          touchAction: 'none',
        } : {
          position: 'fixed',
          left: fabPos.x,
          top: fabPos.y,
          zIndex: 1200,
          transition: dragging.current ? 'none' : 'box-shadow 0.2s',
          touchAction: 'none',
        }}
        onMouseDown={startDrag}
        onTouchStart={startDrag}
      >
        <button
          className="mui-fab-expressive assistant-fab"
          aria-label="Assistente AI"
          onClick={handleFabClickSafe}
        >
          <span className="material-symbols-outlined">smart_toy</span>
        </button>
        {menuOpen && (
          <div className="assistant-fab-menu">
            {ACTIONS.map((a, i) => (
              <button
                key={a.key}
                className="mui-fab-expressive assistant-fab-secondary"
                style={{
                  transform: `translateY(-${(i + 1) * 80}px)`,
                  zIndex: 1201 - i,
                  transition: 'transform 0.25s cubic-bezier(.4,2,.6,1)',
                  position: 'absolute',
                  right: 0,
                  bottom: 0
                }}
                onClick={() => handleAction(a)}
                aria-label={a.label}
              >
                <span className="material-symbols-outlined">{a.icon}</span>
                <span style={{marginLeft: 8, fontWeight: 500}}>{a.label}</span>
              </button>
            ))}
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
};

export default AssistantFab;