// MD3 Expressive Transformative — Motion Card (Container Transform pattern)
// Card that spring-expands to fill the viewport on click.
// Component-scoped keyframes (documented exception per MD3 contract §9).

import React, { useRef, useState, useCallback, useId } from 'react';

const MOTION_CARD_KEYFRAMES = `
  @keyframes _m3mc-backdrop-in {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes _m3mc-backdrop-out {
    from { opacity: 1; }
    to   { opacity: 0; }
  }
  @media (prefers-reduced-motion: reduce) {
    ._m3mc-expanded-panel { transition-duration: 0.01ms !important; }
    ._m3mc-backdrop { animation-duration: 0.01ms !important; }
  }
`;

export interface M3MotionCardProps {
  /** Collapsed card content */
  children: React.ReactNode;
  /** Expanded (full-screen) content. If omitted, expanded shows children */
  expandedContent?: React.ReactNode;
  /** Called when expanded state changes */
  onExpandChange?: (expanded: boolean) => void;
  /** Control expanded state externally */
  expanded?: boolean;
  /** aria-label for the card trigger */
  'aria-label'?: string;
  style?: React.CSSProperties;
  className?: string;
}

/**
 * M3MotionCard — Container Transform expansion.
 * Click the card to spring-expand it to full viewport.
 *
 * @example
 * <M3MotionCard
 *   expandedContent={<LessonDetailView />}
 *   aria-label="Apri lezione"
 * >
 *   <LessonCardPreview />
 * </M3MotionCard>
 */
const M3MotionCard: React.FC<M3MotionCardProps> = ({
  children,
  expandedContent,
  onExpandChange,
  expanded: controlledExpanded,
  'aria-label': ariaLabel,
  style,
  className,
}) => {
  const id = useId();
  const cardRef = useRef<HTMLDivElement>(null);
  const [internalExpanded, setInternalExpanded] = useState(false);
  const [cardRect, setCardRect] = useState<DOMRect | null>(null);
  const [isClosing, setIsClosing] = useState(false);

  const isExpanded = controlledExpanded !== undefined ? controlledExpanded : internalExpanded;

  const expand = useCallback(() => {
    if (cardRef.current) {
      setCardRect(cardRef.current.getBoundingClientRect());
    }
    setInternalExpanded(true);
    onExpandChange?.(true);
  }, [onExpandChange]);

  const collapse = useCallback(() => {
    setIsClosing(true);
    // Let the spring reverse animation finish
    setTimeout(() => {
      setIsClosing(false);
      setInternalExpanded(false);
      onExpandChange?.(false);
    }, 420);
  }, [onExpandChange]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (isExpanded) collapse();
      else expand();
    }
    if (e.key === 'Escape' && isExpanded) collapse();
  };

  const backdropVisible = (isExpanded && !isClosing) || isClosing;

  return (
    <>
      <style>{MOTION_CARD_KEYFRAMES}</style>

      {/* Collapsed card */}
      <div
        ref={cardRef}
        id={id}
        role="button"
        tabIndex={0}
        aria-label={ariaLabel}
        aria-expanded={isExpanded}
        aria-haspopup="dialog"
        onClick={!isExpanded ? expand : undefined}
        onKeyDown={handleKeyDown}
        style={{
          position: 'relative',
          borderRadius: 'var(--md-sys-shape-corner-medium)',
          backgroundColor: 'var(--md-sys-color-surface-container-low)',
          cursor: 'pointer',
          outline: 'none',
          overflow: 'hidden',
          transition: `box-shadow var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard)`,
          ...style,
        }}
        className={className}
      >
        {children}
      </div>

      {/* Expanded panel + backdrop — portal anchored to viewport */}
      {backdropVisible && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 'var(--md-sys-z-index-dialog, 1300)' as React.CSSProperties['zIndex'],
            display: 'flex',
            alignItems: 'stretch',
            justifyContent: 'stretch',
            pointerEvents: 'auto',
          }}
        >
          {/* Scrim */}
          <div
            aria-hidden="true"
            className="_m3mc-backdrop"
            onClick={collapse}
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: 'var(--md-sys-color-scrim)',
              animation: isClosing
                ? `_m3mc-backdrop-out 300ms var(--md-sys-motion-easing-standard) forwards`
                : `_m3mc-backdrop-in 250ms var(--md-sys-motion-easing-standard) forwards`,
              opacity: isClosing ? 0 : undefined,
              cursor: 'default',
            }}
          />

          {/* Expanded surface */}
          <div
            role="dialog"
            aria-modal="true"
            aria-label={ariaLabel}
            className="_m3mc-expanded-panel"
            style={{
              position: 'absolute',
              // Animate from card rect → full viewport
              inset: isClosing
                ? `${cardRect?.top ?? 0}px ${window.innerWidth - (cardRect?.right ?? window.innerWidth)}px ${window.innerHeight - (cardRect?.bottom ?? window.innerHeight)}px ${cardRect?.left ?? 0}px`
                : '0px',
              borderRadius: isClosing
                ? 'var(--md-sys-shape-corner-medium)'
                : 'var(--md-sys-shape-corner-none, 0px)',
              backgroundColor: 'var(--md-sys-color-surface)',
              overflow: 'auto',
              transition: [
                `inset var(--md-sys-motion-spring-expressive-default-spatial-duration, 500ms) var(--md-sys-motion-spring-expressive-default-spatial, cubic-bezier(0.38, 1.21, 0.22, 1.00))`,
                `border-radius var(--md-sys-motion-spring-expressive-default-spatial-duration, 500ms) var(--md-sys-motion-spring-expressive-default-spatial, cubic-bezier(0.38, 1.21, 0.22, 1.00))`,
              ].join(', '),
              willChange: 'inset, border-radius',
              boxShadow: 'var(--md-sys-elevation-level5)',
            }}
          >
            {/* Close button */}
            <button
              aria-label="Chiudi"
              onClick={collapse}
              style={{
                position: 'absolute',
                top: 'var(--md-sys-spacing-3)',
                right: 'var(--md-sys-spacing-3)',
              zIndex: 'var(--md-sys-z-overlay, 2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 'var(--md-sys-spacing-11)',
                height: 'var(--md-sys-spacing-11)',
                minWidth: 'var(--md-sys-spacing-11)',
                borderRadius: 'var(--md-sys-shape-corner-full)',
                border: 'none',
                backgroundColor: 'var(--md-sys-color-surface-container-high)',
                color: 'var(--md-sys-color-on-surface-variant)',
                cursor: 'pointer',
                transition: `background-color var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard)`,
              }}
            >
              <span
                className="material-symbols-outlined"
                aria-hidden="true"
                style={{ fontSize: 'var(--md-sys-typescale-label-large-font-size)' }}
              >
                close
              </span>
            </button>

            {expandedContent ?? children}
          </div>
        </div>
      )}
    </>
  );
};

export default M3MotionCard;
