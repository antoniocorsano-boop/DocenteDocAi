
import React from 'react';
import { Slot, Lezione } from '../types';
import { LESSON_TYPE_ICONS } from '../constants';
import { M3Dialog, M3DialogContent, M3DialogActions, M3Button } from './ui';

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
      title={
        <div style={{
  display: 'flex',
  flexDirection: 'column'
}}>
          <span className="text-[var(--md-sys-typescale-headline-small)] font-[var(--md-sys-typescale-headline-small-font)]">Lezione Programmata</span>
          <span className="m3-body-small text-[var(--md-sys-color-on-surface)]-variant">{slot.giorno}, {slot.ora}</span>
        </div>
      }
      onClose={onClose}
      maxWidth="sm"
      level={1}
    >
      <M3DialogContent>
            {/* Interactive Hero Card */}
            <div 
                className="hero-card-interactive bg-primary-container text-on-primary-container group cursor-pointer hover:brightness-110 transition-all rounded-[var(--md-sys-shape-corner-extra-large)] p-6"
                onClick={onView}
                role="button"
                tabIndex={0}
                aria-label="Vedi dettagli lezione"
            >
                {/* Metadata Row */}
                <div className="flex items-center justify-between mb-6 opacity-90">
                    <div className="flex flex-wrap gap-8">
                        <span className="badge-chip bg-surface/20 text-on-primary-container border-none font-bold">
                            {slot.classe}
                        </span>
                        <span className="badge-chip bg-surface/20 text-on-primary-container border-none">
                            <span className="material-symbols-outlined m3-icon-xs mr-1">{typeIcon}</span>
                            {lesson.tipoLezione || 'Lezione'}
                        </span>
                        {attachmentCount > 0 && (
                             <span className="badge-chip bg-surface/30 text-on-primary-container border-none" title={`${attachmentCount} allegati`}>
                                <span className="material-symbols-outlined m3-icon-xs mr-1">attachment</span>
                                {attachmentCount}
                            </span>
                        )}
                    </div>
                    <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">chevron_right</span>
                </div>

                {/* Main Content */}
                <div>
                    <p className="m3-label-small uppercase tracking-wider opacity-70 mb-4">{slot.materia}</p>
                    <h3 className="m3-title-large font-bold leading-tight line-clamp-3 mb-4">
                        {lesson.contenuto}
                    </h3>
                    {lesson.nota && (
                        <p className="m3-body-small mt-4 italic opacity-80 flex items-start gap-4 bg-surface/10 p-8 rounded-[var(--md-sys-shape-corner-medium)]">
                            <span className="material-symbols-outlined m3-icon-xs">sticky_note_2</span>
                            {lesson.nota}
                        </p>
                    )}
                </div>
            </div>
            
            {/* Action List */}
            <div className="flex flex-col gap-6 mt-4">
                <button 
                    onClick={onStart} 
                    className="flex items-center gap-6 p-6 md:gap-8 md:p-8 rounded-[var(--md-sys-shape-corner-extra-large)] bg-primary text-on-primary hover:bg-primary/90 transition-all text-left group shadow-sm"
                >
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-[var(--md-sys-shape-corner-large)] bg-primary-container text-on-primary-container flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                        <span className="material-symbols-outlined text-xl md:text-2xl">door_open</span>
                    </div>
                    <div className="min-w-0">
                        <p className="m3-label-large font-bold text-base md:text-lg truncate">{isDraftExisting ? 'Torna in Aula' : 'Avvia Aula'}</p>
                        <p className="m3-body-small opacity-90 line-clamp-1">Apri il registro e inizia la lezione.</p>
                    </div>
                </button>

                <button 
                    onClick={onEdit} 
                    className="flex items-center gap-6 p-6 md:gap-8 md:p-8 rounded-[var(--md-sys-shape-corner-extra-large)] bg-secondary-container text-on-secondary-container hover:bg-secondary-container/80 transition-all text-left group shadow-sm"
                >
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-[var(--md-sys-shape-corner-large)] bg-[var(--md-sys-color-surface-container-low)]est text-secondary flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                        <span className="material-symbols-outlined text-xl md:text-2xl">edit</span>
                    </div>
                    <div className="min-w-0">
                        <p className="m3-label-large font-bold text-base md:text-lg truncate">Modifica</p>
                        <p className="m3-body-small opacity-80 line-clamp-1">Cambia contenuto o sposta.</p>
                    </div>
                </button>
            </div>
      </M3DialogContent>
      <M3DialogActions>
        <M3Button onClick={onClose} variant="text">Chiudi</M3Button>
      </M3DialogActions>
    </M3Dialog>
  );
};

export default SlotActionModal;


