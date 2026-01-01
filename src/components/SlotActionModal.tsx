
import React from 'react';
import Tooltip from './Tooltip';
import { Slot, Lezione } from '../types';
import { LESSON_TYPE_ICONS } from '../constants';
import { M3Dialog, M3DialogContent } from './M3Dialog';

interface SlotActionModalProps {
  slot: Slot;
  lesson: Lezione;
  isDraftExisting: boolean;
  onClose: () => void;
  onEdit: () => void;
  onStart: () => void;
  onView: () => void;
}

const SlotActionModal: React.FC<SlotActionModalProps> = ({ slot, lesson, isDraftExisting, onClose, onEdit, onStart, onView }) => {
  
  const typeIcon = lesson.tipoLezione ? LESSON_TYPE_ICONS[lesson.tipoLezione] : 'school';
  const attachmentCount = lesson.materialiDidattici?.length || 0;

  return (
    <M3Dialog
      title={<div><h2 className="m3-headline-small">Lezione Programmata</h2><p className="m3-body-small text-on-surface-variant">{slot.giorno}, {slot.ora}</p></div>}
      onClose={onClose}
      maxWidth="sm"
    >
      <M3DialogContent className="px-4 pb-4">
            {/* Interactive Hero Card */}
            <div 
                className="hero-card-interactive bg-primary-container text-on-primary-container group"
                onClick={onView}
                role="button"
                tabIndex={0}
                aria-label="Vedi dettagli lezione"
            >
                {/* Metadata Row */}
                <div className="flex items-center justify-between mb-3 opacity-90">
                    <div className="flex flex-wrap gap-2">
                        <span className="badge-chip bg-surface/20 text-on-primary-container border-none font-bold">
                            {slot.classe}
                        </span>
                        <span className="badge-chip bg-surface/20 text-on-primary-container border-none">
                            <span className="material-symbols-outlined text-[14px] mr-1">{typeIcon}</span>
                            {lesson.tipoLezione || 'Lezione'}
                        </span>
                        {attachmentCount > 0 && (
                             <span className="badge-chip bg-surface/30 text-on-primary-container border-none" title={`${attachmentCount} allegati`}>
                                <span className="material-symbols-outlined text-[14px] mr-1">attachment</span>
                                {attachmentCount}
                            </span>
                        )}
                    </div>
                    <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">chevron_right</span>
                </div>

                {/* Main Content */}
                <div>
                    <p className="text-xs font-bold uppercase tracking-wider opacity-70 mb-1">{slot.materia}</p>
                    <h3 className="m3-headline-small font-bold leading-tight line-clamp-3 mb-1">
                        {lesson.contenuto}
                    </h3>
                    {lesson.nota && (
                        <p className="text-xs mt-2 italic opacity-80 flex items-start gap-1 bg-surface/10 p-2 rounded">
                            <span className="material-symbols-outlined text-[14px]">sticky_note_2</span>
                            {lesson.nota}
                        </p>
                    )}
                </div>
            </div>
            
            {/* Action List */}
            <div className="action-list mt-4">
                <button onClick={onStart} className="action-list-button button-filled">
                    <span className="material-symbols-outlined">door_open</span>
                    <div>
                        <p className="m3-label-large font-bold text-base">{isDraftExisting ? 'Torna in Aula' : 'Avvia Aula'}</p>
                        <p className="m3-body-small opacity-90">Apri il registro e inizia la lezione.</p>
                    </div>
                </button>

                <button onClick={onEdit} className="action-list-button button-tonal">
                    <span className="material-symbols-outlined">edit</span>
                    <div>
                        <p className="m3-label-large font-bold text-base">Modifica</p>
                        <p className="m3-body-small opacity-80">Cambia contenuto o sposta.</p>
                    </div>
                </button>
            </div>
      </M3DialogContent>
    </M3Dialog>
  );
};

export default SlotActionModal;
