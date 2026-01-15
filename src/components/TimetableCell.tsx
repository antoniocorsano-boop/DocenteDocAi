// LEGACY - MD3 Non-compliant
import React from 'react';
import { Lezione, Slot } from '../types';
import { generateHueFromString } from '../utils/colorUtils';
import { LESSON_TYPE_ICONS } from '../constants';

// M3Expressive: Refactored to use dedicated CSS classes with M3 tokens for colors, spacing, typography, and animations

interface TimetableCellProps {
    slot: Slot;
    lesson?: Lezione;
    className?: string;
    onClick?: () => void;
}

const TimetableCell: React.FC<TimetableCellProps> = ({ slot, lesson, className, onClick }) => {
  const { classe, materia } = slot;
  
  const isDisposition = lesson?.tipoLezione === 'Disposizione' || materia === 'Disposizione';
  const isRicevimento = lesson?.tipoLezione === 'Ricevimento' || materia === 'Ricevimento';
  const hasContent = !!classe || isDisposition || isRicevimento;
  
  let customStyle: React.CSSProperties = {};
  if (isDisposition) {
      customStyle = { backgroundColor: 'var(--md-sys-color-secondary-container)', color: 'var(--sys-on-secondary-container)' };
  } else if (isRicevimento) {
      customStyle = { backgroundColor: 'var(--sys-tertiary-container)', color: 'var(--sys-on-tertiary-container)' };
  } else if (classe) {
      const hue = generateHueFromString(classe);
      customStyle = { '--slot-hue': hue } as React.CSSProperties;
  }
  
    const isDone = lesson?.svolta;
    const hasAi = !!lesson?.externalLink;
  const typeIcon = lesson?.tipoLezione ? LESSON_TYPE_ICONS[lesson.tipoLezione] : (hasContent ? 'school' : null);

    if (!hasContent) {
        return (
            <div
                className={`timetable-cell timetable-cell-empty ${className || ''}`}
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
                <div >
                    <span style={{
  fontFamily: 'Material Symbols Outlined'
}}>add_circle</span>
                </div>
            </div>
        );
    }

    return (
        <div
            className={`timetable-cell timetable-cell-content ${isDone ? 'is-done' : ''} ${isDisposition ? 'timetable-cell-disposition' : ''} ${isRicevimento ? 'timetable-cell-ricevimento' : ''} ${className || ''}`}
            style={customStyle}
            onClick={onClick}
            role="button"
            aria-label={`Slot ${slot.giorno} ${slot.ora}${classe ? `, classe ${classe}` : '}${materia ? `, materia ${materia}` : '}`}
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
            <div >
                <div >
                    {isDone && <div  title="Svolta"></div>}
                    {hasAi && <span >auto_awesome</span>}
                </div>
                {typeIcon && <span >{typeIcon}</span>}
            </div>

            {/* Labels */}
            <div >
                <span >
                    {isDisposition ? 'DISP.' : (isRicevimento ? 'RICEV.' : classe)}
                </span>
                <span >
                    {isDisposition ? 'Sostituzione' : (isRicevimento ? 'Genitori' : materia)}
                </span>
            </div>

            {/* Hover Sparkle */}
            <div ></div>
        </div>
    );
};

export default TimetableCell;







