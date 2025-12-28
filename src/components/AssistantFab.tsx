import React, { useState } from 'react';
import AssistantModal from './AssistantModal';

interface AssistantFabProps {}


const ACTIONS = [
  { key: 'chat', label: 'Chat & Suggerimenti', icon: 'chat_bubble' },
  { key: 'docs', label: 'Documenti AI', icon: 'description' },
  { key: 'tools', label: 'Analisi & Strumenti', icon: 'psychology' },
  { key: 'backup', label: 'Backup & Drive', icon: 'cloud_sync' },
];


type AssistantMode = 'chat' | 'docs' | 'tools' | 'backup';

const AssistantFab: React.FC<AssistantFabProps> = () => {
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mode, setMode] = useState<AssistantMode>('chat');

  const handleFabClick = () => setMenuOpen((v) => !v);
  const handleAction = (action: typeof ACTIONS[number]) => {
    setMode(action.key as AssistantMode);
    setOpen(true);
    setMenuOpen(false);
  };
  const handleClose = () => setOpen(false);

  return (
    <>
      <div className="assistant-fab-root">
        <button
          className="mui-fab-expressive assistant-fab"
          aria-label="Assistente AI"
          onClick={handleFabClick}
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
      <AssistantModal open={open} onClose={handleClose} mode={mode} />
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
