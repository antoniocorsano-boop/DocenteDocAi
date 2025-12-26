import React from 'react';
import { Lezione, Slot } from '../types';
import { generateHueFromString } from '../utils/colorUtils';
import { LESSON_TYPE_ICONS } from '../constants';

interface TimetableCellProps {
  slot: Slot;
  lesson?: Lezione;
  className?: string;
  onAiSuggest: (slot: Slot) => void;
  onClick?: () => void;
}

const TimetableCell: React.FC<TimetableCellProps> = ({ slot, lesson, className, onClick }) => {
  const { classe, materia } = slot;
  
  const isDisposition = lesson?.tipoLezione === 'Disposizione' || materia === 'Disposizione';
  const isRicevimento = lesson?.tipoLezione === 'Ricevimento' || materia === 'Ricevimento';
  const hasContent = !!classe || isDisposition || isRicevimento;
  
  let customStyle: React.CSSProperties = {};
  if (isDisposition) {
      customStyle = { backgroundColor: 'var(--sys-secondary-container)', color: 'var(--sys-on-secondary-container)' };
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
                className={`timetable-tile empty group ${className || ''}`}
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
                <span className="m3-ripple" aria-hidden="true" />
                <div className="flex flex-col items-center justify-center opacity-0 group-hover:opacity-40 transition-opacity">
                    <span className="material-symbols-outlined text-xl text-primary">add_circle</span>
                </div>
            </div>
        );
    }

    return (
        <div
            className={`timetable-tile ${isDone ? 'is-done' : ''} ${className || ''}`}
            style={customStyle}
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
            <span className="m3-ripple" aria-hidden="true" />
            {/* Status Badges (Top) */}
            <div className="absolute top-1.5 inset-x-1.5 flex justify-between items-center pointer-events-none">
                <div className="flex gap-1">
                    {isDone && <div className="w-2 h-2 rounded-full bg-primary animate-pulse" title="Svolta"></div>}
                    {hasAi && <span className="material-symbols-outlined text-[10px] text-tertiary">auto_awesome</span>}
                </div>
                {typeIcon && <span className="material-symbols-outlined text-[12px] opacity-50">{typeIcon}</span>}
            </div>

            {/* Labels */}
            <div className="mt-1 flex flex-col items-center w-full min-w-0">
                <span className="tile-class text-sm font-black truncate w-full text-center leading-none">
                    {isDisposition ? 'DISP.' : (isRicevimento ? 'RICEV.' : classe)}
                </span>
                <span className="tile-subject text-[10px] font-bold opacity-60 truncate w-full text-center mt-0.5">
                    {isDisposition ? 'Sostituzione' : (isRicevimento ? 'Genitori' : materia)}
                </span>
            </div>

            {/* Hover Sparkle */}
            <div className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-100 transition-opacity pointer-events-none"></div>
        </div>
    );
};

export default TimetableCell;
