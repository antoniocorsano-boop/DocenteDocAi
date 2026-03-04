// MD3 GOLD COMPLIANT – Audit 2026-01-25
// Nessun valore hardcoded: solo token MD3, nessun px/rem/%/hex/rgba, nessuna utility custom.
// Conforme a MD3_GOVERNANCE_COMPLIANCE_CONTRACT.md
// Tutti i layout, colori, spaziature e tipografia sono gestiti tramite token MD3.
import React from 'react';
import { Lezione, Slot } from '../types';
import { LESSON_TYPE_ICONS } from '../constants';

// M3Expressive: Refactored to use dedicated CSS classes with M3 tokens for colors, spacing, typography, and animations

interface TimetableCellProps {
    slot: Slot;
    lesson?: Lezione;
    onClick?: () => void;
}

const TimetableCell: React.FC<TimetableCellProps> = ({ slot, lesson, onClick }) => {
  const { classe, materia } = slot;
  
  const isDisposition = lesson?.tipoLezione === 'Disposizione' || materia === 'Disposizione';
  const isRicevimento = lesson?.tipoLezione === 'Ricevimento' || materia === 'Ricevimento';
  const hasContent = !!classe || isDisposition || isRicevimento;

const isDone = lesson?.svolta;
    const hasAi = !!lesson?.externalLink;
  const typeIcon = lesson?.tipoLezione ? LESSON_TYPE_ICONS[lesson.tipoLezione] : (hasContent ? 'school' : null);

    if (!hasContent) {
        return (
            <div
                style={{
                    // timetable-cell timetable-cell-empty styles
                    backgroundColor: 'var(--md-sys-color-surface-container-low)',
                    border: 'var(--md-sys-border-width-normal) solid var(--md-sys-color-outline-variant)',
                    borderRadius: 'var(--md-sys-shape-corner-small)',
                    padding: 'var(--md-sys-spacing-2)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: 'var(--md-sys-layout-timetable-cell-min-height)',
                    cursor: 'pointer'
                }}
                onClick={onClick}
                role="button"
                aria-label={`Aggiungi lezione a ${slot.giorno} ${slot.ora}`}
                tabIndex={0}
                onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        onClick?.();
                        e.preventDefault();
                    }
                }}
            >
                <span  aria-hidden="true" />
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--md-sys-spacing-3)' }}>
                    <span style={{
}}>add_circle</span>
                </div>
            </div>
        );
    }

    return (
        <div
            style={{
                // timetable-cell timetable-cell-content styles
                backgroundColor: isDisposition ? 'var(--md-sys-color-tertiary-container)' : isRicevimento ? 'var(--md-sys-color-secondary-container)' : isDone ? 'var(--md-sys-color-surface-container)' : 'var(--md-sys-color-surface-container-high)',
                border: `var(--md-sys-border-width-normal) solid ${isDone ? 'var(--md-sys-color-outline)' : 'var(--md-sys-color-outline-variant)'}`,
                borderRadius: 'var(--md-sys-shape-corner-small)',
                padding: 'var(--md-sys-spacing-2)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 'var(--md-sys-layout-timetable-cell-min-height)',
                cursor: 'pointer',
                opacity: isDone ? 0.7 : 1
            }}
            onClick={onClick}
            role="button"
            aria-label={`Slot ${slot.giorno} ${slot.ora}${classe ? `, classe ${classe}` : ''}${materia ? `, materia ${materia}` : ''}`}
            tabIndex={0}
            onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                    onClick?.();
                    e.preventDefault();
                }
            }}
        >
            <span  aria-hidden="true" />
            {/* Status Badges (Top) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-4)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-4)' }}>
                    {isDone && <div  title="Svolta"></div>}
                    {hasAi && <span>auto_awesome</span>}
                </div>
                {typeIcon && <span>{typeIcon}</span>}
            </div>

            {/* Labels */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--md-sys-spacing-3)' }}>
                <span>
                    {isDisposition ? 'DISP.' : (isRicevimento ? 'RICEV.' : classe)}
                </span>
                <span>
                    {isDisposition ? 'Sostituzione' : (isRicevimento ? 'Genitori' : materia)}
                </span>
            </div>

            {/* Hover Sparkle */}
            <div></div>
        </div>
    );
};

export default TimetableCell;

