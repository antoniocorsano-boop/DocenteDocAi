// MD3 Gold Compliant
// Tutti gli stili usano esclusivamente token MD3 (nessun valore hardcoded)
// Audit: gennaio 2026 — drag floating: marzo 2026

import React from 'react';
import Box from '@mui/material/Box';
import { useUIStore } from '../stores/useUIStore';

// Legge un token CSS numerico (px) dal root — usato per il calcolo dei boundary durante il drag
function readToken(token: string, fallback: number): number {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(token).trim();
  const n = parseFloat(raw);
  return isNaN(n) ? fallback : n;
}

const STORAGE_KEY = 'assistant-fab-position';

interface FabPosition { x: number; y: number }

function clampPosition(x: number, y: number, fabSize: number, margin: number): FabPosition {
  return {
    x: Math.max(margin, Math.min(x, window.innerWidth  - fabSize - margin)),
    y: Math.max(margin, Math.min(y, window.innerHeight - fabSize - margin)),
  };
}

function loadSavedPosition(): FabPosition | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const p = JSON.parse(raw) as FabPosition;
    if (typeof p.x === 'number' && typeof p.y === 'number') return p;
  } catch { /* ignore */ }
  return null;
}

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

  // ── Drag floating state ──────────────────────────────────────────
  const [position, setPosition] = React.useState<FabPosition | null>(() => loadSavedPosition());
  const fabRef = React.useRef<HTMLDivElement>(null);
  const dragStartPointer = React.useRef<{ px: number; py: number } | null>(null);
  const dragStartFab    = React.useRef<FabPosition | null>(null);
  const isDraggingRef   = React.useRef(false);

  const handlePointerDown = React.useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    // Only drag from the FAB button itself (ignore menu items)
    if ((e.target as HTMLElement).closest('.assistant-fab-sheet, .assistant-fab-menu-popup')) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    isDraggingRef.current = false;
    const rect = fabRef.current!.getBoundingClientRect();
    dragStartPointer.current = { px: e.clientX, py: e.clientY };
    dragStartFab.current = position ?? { x: rect.left, y: rect.top };
  }, [position]);

  const handlePointerMove = React.useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragStartPointer.current || !dragStartFab.current) return;
    const dx = e.clientX - dragStartPointer.current.px;
    const dy = e.clientY - dragStartPointer.current.py;
    if (!isDraggingRef.current && (Math.abs(dx) > 5 || Math.abs(dy) > 5)) {
      isDraggingRef.current = true;
      if (menuOpen) setMenuOpen(false);
    }
    if (!isDraggingRef.current) return;
    const fabSize = readToken('--md-sys-spacing-10', 40);
    const margin  = readToken('--md-sys-spacing-4', 16);
    setPosition(clampPosition(dragStartFab.current.x + dx, dragStartFab.current.y + dy, fabSize, margin));
  }, [menuOpen]);

  const handlePointerUp = React.useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.releasePointerCapture(e.pointerId);
    if (isDraggingRef.current && position) {
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(position)); } catch { /* ignore */ }
    }
    dragStartPointer.current = null;
    dragStartFab.current = null;
    // isDraggingRef is reset after the click event fires (next tick)
    setTimeout(() => { isDraggingRef.current = false; }, 0);
  }, [position]);

  // Dynamic style: absolute position when dragged, else CSS default (fixed bottom-right)
  const rootStyle: React.CSSProperties = position
    ? { position: 'fixed', left: position.x, top: position.y, bottom: 'auto', right: 'auto', touchAction: 'none' }
    : { touchAction: 'none' };
  // ────────────────────────────────────────────────────────────────

  // Chiudi menu quando il modale assistant si apre o si chiude
  React.useEffect(() => {
    if (isAssistantOpen && menuOpen) setMenuOpen(false);
  }, [isAssistantOpen, menuOpen]);

  const toggleModal = useUIStore(state => state.actions.toggleModal);

// Rileva la direzione di apertura del menu (up/down) in base alla posizione del FAB
  const [menuDirection, setMenuDirection] = React.useState<'up' | 'down'>('up');

  const handleFabClick = () => {
    if (isDraggingRef.current) return; // swallow click after drag
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
        style={rootStyle}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <button
          className="mui-fab-expressive assistant-fab"
          aria-label="Assistente AI"
          onClick={handleFabClick}
        >
          <Box component="span" className="material-symbols-outlined" aria-hidden="true">auto_mode</Box>
        </button>
        {menuOpen && (
          <>
            {isCompactLayout && (
              <>
                <div className="assistant-fab-sheet-scrim" role="presentation" onClick={() => setMenuOpen(false)} />
                <div className="assistant-fab-sheet" role="dialog" aria-modal="true" aria-label="Azioni assistente">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-4)' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-4)' }}>
                      <p>Assistente AI</p>
                      <p>Azioni rapide</p>
                    </div>
                    <button
                      className="assistant-fab-sheet-close"
                      aria-label="Chiudi menu assistente"
                      onClick={() => setMenuOpen(false)}
                    >
                                  <Box component="span" className="material-symbols-outlined" aria-hidden="true">close</Box>
                    </button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-4)' }}>
                    {ACTIONS.map((action) => (
                      <button
                        key={action.key}
                        className="assistant-fab-sheet-action"
                        onClick={() => handleAction(action)}
                        aria-label={action.label}
                      >
                                      <Box component="span" className="material-symbols-outlined" aria-hidden="true">{action.icon}</Box>
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
                          <Box component="span" className="material-symbols-outlined" aria-hidden="true">close</Box>
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
                                  <Box component="span" className="material-symbols-outlined" aria-hidden="true">{a.icon}</Box>
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
          bottom: calc(var(--md-sys-spacing-16) + var(--md-sys-spacing-4) + env(safe-area-inset-bottom, 0px));
          z-index: var(--md-sys-z-tooltip);
          transition: box-shadow var(--md-sys-motion-duration-short) var(--md-sys-motion-easing-standard);
          user-select: none;
          -webkit-user-select: none;
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
          cursor: grab;
          transition: box-shadow var(--md-sys-motion-duration-short) var(--md-sys-motion-easing-standard), background var(--md-sys-motion-duration-short) var(--md-sys-motion-easing-standard);
        }
        .mui-fab-expressive.assistant-fab:active {
          cursor: grabbing;
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
          z-index: var(--md-sys-z-tooltip);
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
          z-index: var(--md-sys-z-modal);
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
          z-index: var(--md-sys-z-tooltip);
          animation: assistant-sheet-enter var(--md-sys-motion-duration-medium) var(--md-sys-motion-easing-decelerated);
        }
        /* 640px = compact breakpoint — CSS custom properties cannot be used in @media queries */
        @media (min-width: 640px) {
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
          transition: transform var(--md-sys-motion-duration-short) var(--md-sys-motion-easing-standard), box-shadow var(--md-sys-motion-duration-short) var(--md-sys-motion-easing-standard);
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

