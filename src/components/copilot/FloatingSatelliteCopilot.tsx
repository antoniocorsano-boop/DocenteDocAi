/**
 * FloatingSatelliteCopilot — Global one-touch cognitive guidance system.
 *
 * Architecture rules (STRICT):
 *   - ZERO business / decision logic in this file.
 *   - Reads ONLY from hooks: useNextAction, useJourneyProgress.
 *   - No local "next step" computation.
 *
 * Behaviour:
 *   - Draggable floating button, bottom-right, safe-area aware.
 *   - Badge pulses when the nextAction.id changes.
 *   - Tap → sliding overlay panel with NextStepBanner, mini progress,
 *     capability-gated quick actions, and optional decision explanation.
 *   - Swipe-down or backdrop tap → close overlay.
 *   - Long-press FAB → dismiss badge (future: open preferences).
 *
 * MD3 Gold Compliant — all sizing/spacing via tokens.
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import Collapse from '@mui/material/Collapse';
import M3Surface from '../ui/M3Surface';
import NextStepBanner from '../journey/NextStepBanner';
import { useNextAction } from '../../hooks/useNextAction';
import { useJourneyProgress } from '../../hooks/useJourneyProgress';
import { useGuidedExecutionStore } from '../../stores/useGuidedExecutionStore';
import { buildExecutionPlan } from '../../cognition/guidedExecution';
import GuidedStepOverlay from './GuidedStepOverlay';
import MolecularActionTree from './MolecularActionTree';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface Props {
  /** Navigation callback — receives an app-level view key */
  onNavigate?: (view: string) => void;
}

interface FabPosition { x: number; y: number }

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const STORAGE_KEY = 'satellite-copilot-position';

const LEVEL_LABELS: Record<string, string> = {
  esploratore: 'Esploratore',
  praticante: 'Praticante',
  maestro: 'Maestro',
};

const NEXT_LEVEL_LABELS: Record<string, string | null> = {
  esploratore: 'Praticante',
  praticante: 'Maestro',
  maestro: null,
};

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function readToken(token: string, fallback: number): number {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(token).trim();
  const n = parseFloat(raw);
  return isNaN(n) ? fallback : n;
}

function loadPosition(): FabPosition | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const p = JSON.parse(raw) as FabPosition;
    if (typeof p.x === 'number' && typeof p.y === 'number') return p;
  } catch { /* ignore */ }
  return null;
}

function clamp(x: number, y: number, fabSize: number, margin: number): FabPosition {
  return {
    x: Math.max(margin, Math.min(x, window.innerWidth  - fabSize - margin)),
    y: Math.max(margin, Math.min(y, window.innerHeight - fabSize - margin)),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

const FloatingSatelliteCopilot: React.FC<Props> = ({ onNavigate }) => {
  // ── Decision Engine (read-only) ────────────────────────────────────────────
  const action       = useNextAction();
  const { level, progress, capabilityLevel, confidenceScore } = useJourneyProgress();

  // ── Guided Execution ──────────────────────────────────────────────────────
  const { isGuided, startGuided } = useGuidedExecutionStore(
    (s) => ({ isGuided: s.isActive, startGuided: s.start }),
  );

  // ── Overlay state ──────────────────────────────────────────────────────────
  const [open, setOpen] = useState(false);
  const [showReason, setShowReason] = useState(false);

  // ── Badge: appears when nextAction.id changes ──────────────────────────────
  const [badge, setBadge]     = useState(false);
  const [prevId, setPrevId]   = useState(action.id);

  useEffect(() => {
    if (action.id !== prevId) {
      setBadge(true);
      setPrevId(action.id);
    }
  }, [action.id, prevId]);

  // ── Drag state ─────────────────────────────────────────────────────────────
  const [position, setPosition]         = useState<FabPosition | null>(() => loadPosition());
  const fabRef                           = useRef<HTMLDivElement>(null);
  const dragStartPtr                     = useRef<{ px: number; py: number } | null>(null);
  const dragStartFab                     = useRef<FabPosition | null>(null);
  const isDragging                       = useRef(false);

  // ── Swipe-to-close (gesture layer) ────────────────────────────────────────
  const overlayRef                       = useRef<HTMLDivElement>(null);
  const swipeStartY                      = useRef<number | null>(null);
  const swipeDelta                       = useRef(0);

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleFabPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    isDragging.current = false;
    const rect = fabRef.current!.getBoundingClientRect();
    dragStartPtr.current = { px: e.clientX, py: e.clientY };
    dragStartFab.current = position ?? { x: rect.left, y: rect.top };
  }, [position]);

  const handleFabPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragStartPtr.current || !dragStartFab.current) return;
    const dx = e.clientX - dragStartPtr.current.px;
    const dy = e.clientY - dragStartPtr.current.py;
    if (!isDragging.current && (Math.abs(dx) > 5 || Math.abs(dy) > 5)) {
      isDragging.current = true;
      setOpen(false); // close overlay on drag start
    }
    if (!isDragging.current) return;
    const fab    = readToken('--md-sys-layout-fab-size', 56);
    const margin = readToken('--md-sys-spacing-4', 16);
    setPosition(clamp(dragStartFab.current.x + dx, dragStartFab.current.y + dy, fab, margin));
  }, []);

  const handleFabPointerUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.releasePointerCapture(e.pointerId);
    if (isDragging.current && position) {
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(position)); } catch { /* ignore */ }
    }
    dragStartPtr.current = null;
    dragStartFab.current = null;
    setTimeout(() => { isDragging.current = false; }, 0);
  }, [position]);

  const handleFabClick = useCallback(() => {
    if (isDragging.current) return;
    setBadge(false);
    setOpen((v) => !v);
  }, []);

  const handleOverlayTouchStart = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    swipeStartY.current = e.touches[0].clientY;
    swipeDelta.current = 0;
  }, []);

  const handleOverlayTouchMove = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    if (swipeStartY.current === null) return;
    swipeDelta.current = e.touches[0].clientY - swipeStartY.current;
    // Apply live transform so panel follows finger
    if (overlayRef.current && swipeDelta.current > 0) {
      overlayRef.current.style.transform = `translateY(${swipeDelta.current}px)`;
    }
  }, []);

  const handleOverlayTouchEnd = useCallback(() => {
    if (swipeDelta.current > 60) {
      setOpen(false);
    }
    if (overlayRef.current) {
      overlayRef.current.style.transform = '';
    }
    swipeStartY.current = null;
    swipeDelta.current = 0;
  }, []);

  const handleCta = useCallback(() => {
    // Build execution plan and activate guided mode
    const plan = buildExecutionPlan(action);
    startGuided(plan);
    // Navigate to first step's view if defined
    if (plan.steps[0]?.targetView && onNavigate) {
      onNavigate(plan.steps[0].targetView);
    }
    setOpen(false);
  }, [action, onNavigate, startGuided]);

  // ── Derived display values ─────────────────────────────────────────────────
  const nextLevel   = NEXT_LEVEL_LABELS[level];
  const pct         = Math.round(progress * 100);
  const levelLabel  = LEVEL_LABELS[level] ?? level;
  const fabStyle: React.CSSProperties = position
    ? { position: 'fixed', left: position.x, top: position.y, bottom: 'auto', right: 'auto', touchAction: 'none', zIndex: 1400 }
    : { touchAction: 'none', zIndex: 1400 };

  // ── Vibration feedback (mobile) ────────────────────────────────────────────
  const vibrate = useCallback(() => {
    try { navigator.vibrate?.(10); } catch { /* ignore */ }
  }, []);

  return (
    <>
      {/* ── Floating Button (hidden in guided mode — MolecularActionTree takes over) ── */}
      {!isGuided && (
      <Box
        ref={fabRef}
        role="button"
        aria-label={open ? 'Chiudi assistente copilot' : 'Apri assistente copilot'}
        aria-expanded={open}
        tabIndex={0}
        onPointerDown={handleFabPointerDown}
        onPointerMove={handleFabPointerMove}
        onPointerUp={handleFabPointerUp}
        onClick={() => { vibrate(); handleFabClick(); }}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); vibrate(); handleFabClick(); } }}
        sx={{
          position:    'fixed',
          bottom:      position ? 'auto' : 'max(var(--md-sys-spacing-5), env(safe-area-inset-bottom, 20px))',
          right:       position ? 'auto' : 'var(--md-sys-spacing-4)',
          ...fabStyle,
          width:       56,
          height:      56,
          borderRadius: 'var(--md-sys-shape-corner-full)',
          bgcolor:     open
            ? 'var(--md-sys-color-secondary-container)'
            : 'var(--md-sys-color-primary)',
          color:       open
            ? 'var(--md-sys-color-on-secondary-container)'
            : 'var(--md-sys-color-on-primary)',
          boxShadow:   'var(--md-sys-elevation-3)',
          display:     'flex',
          alignItems:  'center',
          justifyContent: 'center',
          cursor:      'pointer',
          transition:  'background-color var(--md-sys-motion-duration-medium2) var(--md-sys-motion-easing-standard), transform var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard)',
          '&:hover':   { transform: 'scale(1.06)' },
          '&:active':  { transform: 'scale(0.96)' },
          userSelect:  'none',
          WebkitTapHighlightColor: 'transparent',
        }}
      >
        {/* Icon */}
        <Box
          component="span"
          className="material-symbols-outlined"
          aria-hidden="true"
          sx={{ fontSize: 'var(--md-sys-icon-size-lg)', lineHeight: 1 }}
        >
          {open ? 'close' : 'assistant'}
        </Box>

        {/* Badge dot */}
        {badge && !open && (
          <Box
            aria-label="Nuova azione disponibile"
            sx={{
              position:     'absolute',
              top:          6,
              right:        6,
              width:        10,
              height:       10,
              borderRadius: '50%',
              bgcolor:      'var(--md-sys-color-tertiary)',
              border:       '2px solid var(--md-sys-color-surface)',
              animation:    'satellite-pulse 1.8s ease-in-out infinite',
            }}
          />
        )}
      </Box>
      )}  {/* end !isGuided */}

      {/* ── Backdrop ─────────────────────────────────────────────────────── */}
      {open && (
        <Box
          aria-hidden="true"
          onClick={() => setOpen(false)}
          sx={{
            position:   'fixed',
            inset:      0,
            zIndex:     1398,
            bgcolor:    'var(--md-sys-color-scrim)',
            opacity:    0.32,
            animation:  'satellite-fade-in var(--md-sys-motion-duration-medium2) var(--md-sys-motion-easing-standard) forwards',
          }}
        />
      )}

      {/* ── Overlay Panel ─────────────────────────────────────────────────── */}
      {open && (
        <Box
          ref={overlayRef}
          role="dialog"
          aria-modal="false"
          aria-label="Assistente copilot"
          onTouchStart={handleOverlayTouchStart}
          onTouchMove={handleOverlayTouchMove}
          onTouchEnd={handleOverlayTouchEnd}
          sx={{
            position:       'fixed',
            bottom:         position ? 'auto' : 'calc(56px + var(--md-sys-spacing-3) + max(var(--md-sys-spacing-5), env(safe-area-inset-bottom, 20px)))',
            ...(position
              ? { top: (position.y + 64), left: Math.min(position.x, window.innerWidth - 340) }
              : { right: 'var(--md-sys-spacing-4)' }),
            width:          'min(340px, calc(100vw - var(--md-sys-spacing-8)))',
            zIndex:         1399,
            animation:      'satellite-slide-up var(--md-sys-motion-duration-medium2) var(--md-sys-motion-easing-emphasized) forwards',
            willChange:     'transform, opacity',
            transition:     'transform var(--md-sys-motion-duration-short2) linear',
          }}
        >
          <M3Surface
            elevation={3}
            sx={{
              borderRadius: 'var(--md-sys-shape-corner-extra-large)',
              overflow:     'hidden',
              bgcolor:      'var(--md-sys-color-surface-container-high)',
            }}
          >
            {/* Drag handle */}
            <Box sx={{ display: 'flex', justifyContent: 'center', pt: 'var(--md-sys-spacing-2)', pb: 0 }}>
              <Box sx={{ width: 32, height: 4, borderRadius: 2, bgcolor: 'var(--md-sys-color-outline-variant)', flexShrink: 0 }} />
            </Box>

            <Stack sx={{ p: 'var(--md-sys-spacing-4)', gap: 'var(--md-sys-spacing-4)' }}>

              {/* ── Header row ──────────────────────────────────────────── */}
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Stack direction="row" alignItems="center" gap="var(--md-sys-spacing-2)">
                  <Box
                    component="span"
                    className="material-symbols-outlined"
                    aria-hidden="true"
                    sx={{ fontSize: 'var(--md-sys-icon-size-md)', color: 'var(--md-sys-color-primary)' }}
                  >
                    auto_awesome
                  </Box>
                  <Typography
                    variant="titleSmall"
                    sx={{ color: 'var(--md-sys-color-on-surface)' }}
                  >
                    Copilot
                  </Typography>
                </Stack>
                <IconButton
                  size="small"
                  onClick={() => setOpen(false)}
                  aria-label="Chiudi pannello copilot"
                  sx={{ color: 'var(--md-sys-color-on-surface-variant)' }}
                >
                  <Box component="span" className="material-symbols-outlined" aria-hidden="true" sx={{ fontSize: 'var(--md-sys-icon-size-sm)' }}>
                    close
                  </Box>
                </IconButton>
              </Stack>

              {/* ── Next Step (from Decision Engine) ────────────────────── */}
              <NextStepBanner onNavigate={(view) => { onNavigate?.(view); setOpen(false); }} />

              <Divider sx={{ borderColor: 'var(--md-sys-color-outline-variant)' }} />

              {/* ── Mini Progress ────────────────────────────────────────── */}
              <Box>
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 'var(--md-sys-spacing-2)' }}>
                  <Stack direction="row" alignItems="center" gap="var(--md-sys-spacing-2)">
                    <Box
                      component="span"
                      className="material-symbols-outlined"
                      aria-hidden="true"
                      sx={{ fontSize: 'var(--md-sys-icon-size-sm)', color: 'var(--md-sys-color-primary)' }}
                    >
                      trending_up
                    </Box>
                    <Typography variant="labelMedium" sx={{ color: 'var(--md-sys-color-on-surface)' }}>
                      {levelLabel}
                    </Typography>
                  </Stack>
                  <Typography variant="labelSmall" sx={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
                    {pct}%{nextLevel ? ` → ${nextLevel}` : ' — Massimo'}
                  </Typography>
                </Stack>
                <LinearProgress
                  variant="determinate"
                  value={pct}
                  aria-label={`Progresso livello ${levelLabel}: ${pct}%`}
                  sx={{
                    height: 6,
                    borderRadius: 'var(--md-sys-shape-corner-full)',
                    bgcolor: 'var(--md-sys-color-surface-container)',
                    '& .MuiLinearProgress-bar': {
                      bgcolor: 'var(--md-sys-color-primary)',
                      borderRadius: 'var(--md-sys-shape-corner-full)',
                    },
                  }}
                />
                {confidenceScore < 0.4 && (
                  <Typography variant="labelSmall" sx={{ mt: 'var(--md-sys-spacing-1)', color: 'var(--md-sys-color-on-surface-variant)' }}>
                    Livello {capabilityLevel} · Continua ad usare l'app per salire
                  </Typography>
                )}
              </Box>

              {/* ── Quick Actions (capability-gated) ────────────────────── */}
              <Box>
                <Typography variant="labelSmall" sx={{ color: 'var(--md-sys-color-on-surface-variant)', mb: 'var(--md-sys-spacing-2)', display: 'block' }}>
                  Azioni rapide
                </Typography>
                <Stack direction="row" flexWrap="wrap" gap="var(--md-sys-spacing-2)">
                  {/* L1+ always */}
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<Box component="span" className="material-symbols-outlined" aria-hidden="true" sx={{ fontSize: 'var(--md-sys-icon-size-sm)' }}>person_add</Box>}
                    onClick={() => { onNavigate?.('register'); setOpen(false); }}
                    aria-label="Vai agli studenti"
                    sx={{ borderRadius: 'var(--md-sys-shape-corner-full)', fontSize: 'var(--md-sys-typescale-label-small-font-size)' }}
                  >
                    Studenti
                  </Button>

                  {/* L2+ */}
                  {capabilityLevel >= 2 && (
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<Box component="span" className="material-symbols-outlined" aria-hidden="true" sx={{ fontSize: 'var(--md-sys-icon-size-sm)' }}>menu_book</Box>}
                      onClick={() => { onNavigate?.('lessons'); setOpen(false); }}
                      aria-label="Crea una lezione"
                      sx={{ borderRadius: 'var(--md-sys-shape-corner-full)', fontSize: 'var(--md-sys-typescale-label-small-font-size)' }}
                    >
                      Lezione
                    </Button>
                  )}

                  {/* L3+ */}
                  {capabilityLevel >= 3 && (
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<Box component="span" className="material-symbols-outlined" aria-hidden="true" sx={{ fontSize: 'var(--md-sys-icon-size-sm)' }}>auto_stories</Box>}
                      onClick={() => { onNavigate?.('planning'); setOpen(false); }}
                      aria-label="Crea una UDA"
                      sx={{ borderRadius: 'var(--md-sys-shape-corner-full)', fontSize: 'var(--md-sys-typescale-label-small-font-size)' }}
                    >
                      UDA
                    </Button>
                  )}

                  {/* L3+ Copilot */}
                  {capabilityLevel >= 3 && (
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<Box component="span" className="material-symbols-outlined" aria-hidden="true" sx={{ fontSize: 'var(--md-sys-icon-size-sm)' }}>psychology</Box>}
                      onClick={() => { onNavigate?.('copilot'); setOpen(false); }}
                      aria-label="Apri pannello copilot completo"
                      sx={{ borderRadius: 'var(--md-sys-shape-corner-full)', fontSize: 'var(--md-sys-typescale-label-small-font-size)' }}
                    >
                      Copilot
                    </Button>
                  )}
                </Stack>
              </Box>

              {/* ── Decision explanation (collapsible) ────────────────────── */}
              <Box>
                <Button
                  size="small"
                  variant="text"
                  onClick={() => setShowReason((v) => !v)}
                  aria-expanded={showReason}
                  aria-controls="satellite-reason"
                  endIcon={
                    <Box component="span" className="material-symbols-outlined" aria-hidden="true" sx={{ fontSize: 'var(--md-sys-icon-size-sm)' }}>
                      {showReason ? 'expand_less' : 'expand_more'}
                    </Box>
                  }
                  sx={{
                    color: 'var(--md-sys-color-on-surface-variant)',
                    fontSize: 'var(--md-sys-typescale-label-small-font-size)',
                    px: 0,
                  }}
                >
                  Perché questo suggerimento?
                </Button>
                <Collapse in={showReason}>
                  <Box
                    id="satellite-reason"
                    sx={{
                      mt: 'var(--md-sys-spacing-2)',
                      p: 'var(--md-sys-spacing-3)',
                      bgcolor: 'var(--md-sys-color-surface-container)',
                      borderRadius: 'var(--md-sys-shape-corner-medium)',
                    }}
                  >
                    <Typography variant="bodySmall" sx={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
                      {action.reason}
                    </Typography>
                  </Box>
                </Collapse>
              </Box>

              {/* ── Primary CTA ─────────────────────────────────────────── */}
              {action.targetView && (
                <Button
                  variant="contained"
                  onClick={handleCta}
                  fullWidth
                  aria-label={`${action.cta}: ${action.label}`}
                  startIcon={
                    <Box component="span" className="material-symbols-outlined" aria-hidden="true" sx={{ fontSize: 'var(--md-sys-icon-size-sm)' }}>
                      {action.icon}
                    </Box>
                  }
                  sx={{ borderRadius: 'var(--md-sys-shape-corner-full)' }}
                >
                  {action.cta}
                </Button>
              )}

            </Stack>
          </M3Surface>
        </Box>
      )}

      {/* ── CSS Keyframes (injected once) ─────────────────────────────────────── */}
      <style>{`
        @keyframes satellite-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.6; transform: scale(1.3); }
        }
        @keyframes satellite-fade-in {
          from { opacity: 0; }
          to   { opacity: 0.32; }
        }
        @keyframes satellite-slide-up {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* ── Guided Execution Layer ─────────────────────────────────────────── */}
      {isGuided && <MolecularActionTree position={position} />}
      {isGuided && <GuidedStepOverlay onNavigate={onNavigate} />}
    </>
  );
};

export default FloatingSatelliteCopilot;
