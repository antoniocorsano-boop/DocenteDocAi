// MD3 Gold Compliant — nessun valore hardcoded, solo token MD3
// Drawer per la navigazione secondaria: tutte le viste non esposte nel rail/bottom nav
// Accessibile da tastiera, supporta Escape per chiudere, focus trap interno.

import React, { useEffect, useRef } from 'react';
import { View } from '../types';
import { M3Typography } from './ui/M3Typography';
import { VIEW_LABELS } from './viewRegistry';

export interface SecondaryNavGroup {
  label: string;
  icon: string;
  items: { id: View; icon: string }[];
}

export const SECONDARY_NAV_GROUPS: SecondaryNavGroup[] = [
  {
    label: 'Strumenti Classe',
    icon: 'groups',
    items: [
      { id: 'studenti',                   icon: 'person' },
      { id: 'evaluations',                icon: 'grade' },
      { id: 'register',                   icon: 'menu_book' },
      { id: 'analytics',                  icon: 'bar_chart' },
      { id: 'class-competency-dashboard', icon: 'stacked_bar_chart' },
      { id: 'consiglio-di-classe',        icon: 'people' },
      { id: 'teacher-inbox',              icon: 'inbox' },
      { id: 'improvement-guide',          icon: 'trending_up' },
    ],
  },
  {
    label: 'Pianificazione',
    icon: 'edit_document',
    items: [
      { id: 'lessons',             icon: 'library_books' },
      { id: 'uda',                 icon: 'account_tree' },
      { id: 'rubriche',            icon: 'checklist' },
      { id: 'didattica-inclusiva', icon: 'accessibility' },
      { id: 'curriculum-manager',  icon: 'schema' },
      { id: 'competency-levels',   icon: 'leaderboard' },
    ],
  },
  {
    label: 'Risorse & AI',
    icon: 'auto_awesome',
    items: [
      { id: 'studio',         icon: 'science' },
      { id: 'knowledge-base', icon: 'database' },
      { id: 'reportistica',   icon: 'summarize' },
    ],
  },
  {
    label: 'Altre Sezioni',
    icon: 'more_horiz',
    items: [
      { id: 'orientamento', icon: 'explore' },
      { id: 'calendario',   icon: 'calendar_month' },
      { id: 'student-dashboard', icon: 'school' },
    ],
  },
];

interface SecondaryNavDrawerProps {
  open: boolean;
  onClose: () => void;
  onNavigate: (view: View) => void;
  activeView: View;
  isDesktop: boolean;
}

const SecondaryNavDrawer: React.FC<SecondaryNavDrawerProps> = ({
  open,
  onClose,
  onNavigate,
  activeView,
  isDesktop,
}) => {
  const drawerRef = useRef<HTMLDivElement>(null);

  const prefersReducedMotion = React.useMemo(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    []
  );

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  // Focus trap — Tab/Shift+Tab rimane dentro il drawer
  useEffect(() => {
    if (!open) return;
    const container = drawerRef.current;
    if (!container) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const focusable = Array.from(
        container.querySelectorAll<HTMLElement>('button, a, input, [tabindex]:not([tabindex="-1"])')
      ).filter(el => !(el as HTMLButtonElement).disabled);
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    container.addEventListener('keydown', onKey);
    return () => container.removeEventListener('keydown', onKey);
  }, [open]);

  // Focus first focusable element on open
  useEffect(() => {
    if (!open) return;
    const first = drawerRef.current?.querySelector<HTMLElement>('button, a');
    first?.focus();
  }, [open]);

  if (!open) return null;

  const handleItemClick = (view: View) => {
    onNavigate(view);
    onClose();
  };

  // Desktop: panel sliding from left (next to NavigationRail)
  // Mobile: bottom sheet
  const panelStyle: React.CSSProperties = isDesktop
    ? {
        position: 'fixed',
        top: 'var(--md-sys-spacing-16)', // below header height
        left: 'var(--md-sys-spacing-20)', // right of NavigationRail
        bottom: 0,
        width: 'calc(var(--md-sys-spacing-20) * 2)', // ~320px drawer
        background: 'var(--md-sys-color-surface-container-low)',
        borderRight: 'var(--md-sys-border-width-thin) solid var(--md-sys-color-outline-variant)',
        borderTop: 'var(--md-sys-border-width-thin) solid var(--md-sys-color-outline-variant)',
        zIndex: 'var(--md-sys-z-drawer)',
        overflowY: 'auto',
        overflowX: 'hidden',
        padding: 'var(--md-sys-spacing-3) var(--md-sys-spacing-2)',
        boxShadow: 'var(--md-sys-elevation-level3)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--md-sys-spacing-2)',
        animation: prefersReducedMotion ? 'none' : 'drawer-slide-in var(--md-sys-motion-duration-medium2) var(--md-sys-motion-easing-emphasized)',
      }
    : {
        position: 'fixed',
        left: 0,
        right: 0,
        bottom: 'var(--md-sys-bottom-nav-offset)',
        maxHeight: 'var(--md-sys-size-sheet-max-height)',
        background: 'var(--md-sys-color-surface-container-low)',
        borderTop: 'var(--md-sys-border-width-medium) solid var(--md-sys-color-outline-variant)',
        borderRadius: 'var(--md-sys-shape-corner-extra-large) var(--md-sys-shape-corner-extra-large) 0 0',
        zIndex: 'var(--md-sys-z-drawer)',
        overflowY: 'auto',
        overflowX: 'hidden',
        padding: 'var(--md-sys-spacing-3) var(--md-sys-spacing-4)',
        boxShadow: 'var(--md-sys-elevation-level4)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--md-sys-spacing-2)',
        animation: prefersReducedMotion ? 'none' : 'sheet-slide-up var(--md-sys-motion-duration-medium2) var(--md-sys-motion-easing-emphasized)',
      };

  return (
    <>
      <style>{`
        @keyframes drawer-slide-in {
          from { transform: translateX(-100%); opacity: 0; }
          to   { transform: translateX(0);     opacity: 1; }
        }
        @keyframes sheet-slide-up {
          from { transform: translateY(100%); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
      `}</style>

      {/* Backdrop */}
      <div
        aria-hidden="true"
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 'var(--md-sys-z-scrim)',
          background: 'var(--md-sys-color-scrim)',
          opacity: 0.32,
        }}
      />

      {/* Drawer panel */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Tutte le sezioni"
        style={panelStyle}
      >
        {/* style tag solo per @keyframes */}
        {/* Handle bar (mobile only) */}
        {!isDesktop && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: 'var(--md-sys-spacing-1)',
          }}>
            <span aria-hidden="true" style={{
              width: 'var(--md-sys-spacing-8)',
              height: 'var(--md-sys-spacing-1)',
              borderRadius: 'var(--md-sys-shape-corner-full)',
              background: 'var(--md-sys-color-on-surface-variant)',
              opacity: 0.4,
              display: 'block',
            }} />
          </div>
        )}

        {/* Close button (desktop) */}
        {isDesktop && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--md-sys-spacing-2)' }}>
            <M3Typography variant="title-medium" style={{ color: 'var(--md-sys-color-on-surface)' }}>
              Tutte le sezioni
            </M3Typography>
            <button
              aria-label="Chiudi menu"
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 'var(--md-sys-spacing-2)',
                borderRadius: 'var(--md-sys-shape-corner-full)',
                color: 'var(--md-sys-color-on-surface-variant)',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <span className="material-symbols-outlined" aria-hidden="true">close</span>
            </button>
          </div>
        )}

        {SECONDARY_NAV_GROUPS.map((group) => (
          <section key={group.label}>
            {/* Group header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--md-sys-spacing-2)',
              padding: 'var(--md-sys-spacing-1) var(--md-sys-spacing-2)',
              marginBottom: 'var(--md-sys-spacing-1)',
            }}>
              <span
                className="material-symbols-outlined"
                aria-hidden="true"
                style={{ fontSize: 'var(--md-sys-spacing-5)', color: 'var(--md-sys-color-primary)' }}
              >
                {group.icon}
              </span>
              <M3Typography
                variant="label-small"
                style={{
                  color: 'var(--md-sys-color-primary)',
                  fontWeight: 'var(--md-sys-typescale-weight-semibold)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                }}
              >
                {group.label}
              </M3Typography>
            </div>

            {/* Items */}
            <div style={{
              display: isDesktop ? 'flex' : 'grid',
              flexDirection: isDesktop ? 'column' : undefined,
              gridTemplateColumns: isDesktop ? undefined : 'repeat(3, 1fr)',
              gap: 'var(--md-sys-spacing-1)',
              marginBottom: 'var(--md-sys-spacing-3)',
            }}>
              {group.items.map((item) => {
                const isActive = activeView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item.id)}
                    aria-label={VIEW_LABELS[item.id] ?? item.id}
                    aria-current={isActive ? 'page' : undefined}
                    style={{
                      display: 'flex',
                      flexDirection: isDesktop ? 'row' : 'column',
                      alignItems: 'center',
                      gap: 'var(--md-sys-spacing-3)',
                      padding: isDesktop
                        ? 'var(--md-sys-spacing-2) var(--md-sys-spacing-3)'
                        : 'var(--md-sys-spacing-3) var(--md-sys-spacing-1)',
                      borderRadius: 'var(--md-sys-shape-corner-large)',
                      border: 'none',
                      cursor: 'pointer',
                      background: isActive
                        ? 'var(--md-sys-color-secondary-container)'
                        : 'transparent',
                      color: isActive
                        ? 'var(--md-sys-color-on-secondary-container)'
                        : 'var(--md-sys-color-on-surface-variant)',
                      transition: 'background var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard)',
                      width: 'var(--md-sys-percent-100)',
                      textAlign: isDesktop ? 'left' : 'center',
                      minHeight: 'var(--md-sys-spacing-11)', // 44px touch target
                    }}
                  >
                    <span
                      className="material-symbols-outlined"
                      aria-hidden="true"
                      style={{
                        fontSize: 'var(--md-sys-spacing-6)',
                        fontVariationSettings: isActive
                          ? "'FILL' 1, 'wght' 400"
                          : "'FILL' 0, 'wght' 400",
                      }}
                    >
                      {item.icon}
                    </span>
                    <M3Typography
                      variant="label-medium"
                      style={{
                        color: 'inherit',
                        fontWeight: isActive
                          ? 'var(--md-sys-typescale-weight-semibold)'
                          : 'var(--md-sys-typescale-weight-medium)',
                        whiteSpace: isDesktop ? 'nowrap' : 'normal',
                        fontSize: isDesktop ? undefined : 'var(--md-sys-spacing-3)',
                        lineHeight: 1.2,
                      }}
                    >
                      {VIEW_LABELS[item.id] ?? item.id}
                    </M3Typography>
                  </button>
                );
              })}
            </div>

            {/* Divider */}
            <div aria-hidden="true" style={{
              height: 'var(--md-sys-border-width-thin)',
              background: 'var(--md-sys-color-outline-variant)',
              margin: '0 0 var(--md-sys-spacing-2)',
            }} />
          </section>
        ))}
      </div>
    </>
  );
};

export default SecondaryNavDrawer;
