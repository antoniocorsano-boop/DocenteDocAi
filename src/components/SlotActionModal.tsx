
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
                className="hero-card-interactive text-on-primary-container group hover:brightness-110 rounded-[var(--md-sys-shape-corner-extra-large)]" style={{ backgroundColor: "var(--md-sys-color-primary-container)", cursor: "pointer", transition: "all 300ms cubic-bezier(0.4, 0, 0.2, 1)", padding: "var(--md-sys-spacing-6)" }}
                onClick={onView}
                role="button"
                tabIndex={0}
                aria-label="Vedi dettagli lezione"
            >
                {/* Metadata Row */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--md-sys-spacing-6)", opacity: "0.9" }}>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--md-sys-spacing-8)" }}>
                        <span className="badge-chip bg-surface/20 text-on-primary-container" style={{ border: "none", fontWeight: "bold" }}>
                            {slot.classe}
                        </span>
                        <span className="badge-chip bg-surface/20 text-on-primary-container" style={{ border: "none" }}>
                            <span className="material-symbols-outlined m3-icon-xs mr-1">{typeIcon}</span>
                            {lesson.tipoLezione || 'Lezione'}
                        </span>
                        {attachmentCount > 0 && (
                             <span className="badge-chip bg-surface/30 text-on-primary-container" style={{ border: "none" }} title={`${attachmentCount} allegati`}>
                                <span className="material-symbols-outlined m3-icon-xs mr-1">attachment</span>
                                {attachmentCount}
                            </span>
                        )}
                    </div>
                    <span className="material-symbols-outlined group-hover:translate-x-1" style={{ transition: "transform 300ms" }}>chevron_right</span>
                </div>

                {/* Main Content */}
                <div>
                    <p className="m3-label-small" style={{ textTransform: "uppercase", letterSpacing: "0.05em", opacity: "0.7", marginBottom: "var(--md-sys-spacing-4)" }}>{slot.materia}</p>
                    <h3 className="m3-title-large line-clamp-3" style={{ fontWeight: "bold", lineHeight: "1.25", marginBottom: "var(--md-sys-spacing-4)" }}>
                        {lesson.contenuto}
                    </h3>
                    {lesson.nota && (
                        <p className="m3-body-small italic bg-surface/10 rounded-[var(--md-sys-shape-corner-medium)]" style={{ marginTop: "var(--md-sys-spacing-4)", opacity: "0.8", display: "flex", alignItems: "flex-start", gap: "var(--md-sys-spacing-4)", padding: "var(--md-sys-spacing-8)" }}>
                            <span className="material-symbols-outlined m3-icon-xs">sticky_note_2</span>
                            {lesson.nota}
                        </p>
                    )}
                </div>
            </div>
            
            {/* Action List */}
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--md-sys-spacing-6)", marginTop: "var(--md-sys-spacing-4)" }}>
                <button 
                    onClick={onStart} 
                    className="md:gap-8 md:p-8 rounded-[var(--md-sys-shape-corner-extra-large)] hover:bg-primary/90 group shadow-sm" style={{ display: "flex", alignItems: "center", gap: "var(--md-sys-spacing-6)", padding: "var(--md-sys-spacing-6)", backgroundColor: "var(--md-sys-color-primary)", color: "var(--md-sys-color-on-primary)", transition: "all 300ms cubic-bezier(0.4, 0, 0.2, 1)", textAlign: "left" }}
                >
                    <div className="md:w-12 md:h-12 rounded-[var(--md-sys-shape-corner-large)] text-on-primary-container group-hover:scale-110 shrink-0" style={{ width: "2.5rem", height: "2.5rem", backgroundColor: "var(--md-sys-color-primary-container)", display: "flex", alignItems: "center", justifyContent: "center", transition: "transform 300ms" }}>
                        <span className="material-symbols-outlined md:text-2xl" style={{ fontSize: "1.25rem" }}>door_open</span>
                    </div>
                    <div style={{ minWidth: "0" }}>
                        <p className="m3-label-large md:text-lg" style={{ fontWeight: "bold", fontSize: "1rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{isDraftExisting ? 'Torna in Aula' : 'Avvia Aula'}</p>
                        <p className="m3-body-small line-clamp-1" style={{ opacity: "0.9" }}>Apri il registro e inizia la lezione.</p>
                    </div>
                </button>

                <button 
                    onClick={onEdit} 
                    className="md:gap-8 md:p-8 rounded-[var(--md-sys-shape-corner-extra-large)] text-on-secondary-container hover:bg-secondary-container/80 group shadow-sm" style={{ display: "flex", alignItems: "center", gap: "var(--md-sys-spacing-6)", padding: "var(--md-sys-spacing-6)", backgroundColor: "var(--md-sys-color-secondary-container)", transition: "all 300ms cubic-bezier(0.4, 0, 0.2, 1)", textAlign: "left" }}
                >
                    <div className="md:w-12 md:h-12 rounded-[var(--md-sys-shape-corner-large)] bg-[var(--md-sys-color-surface-container-low)]est group-hover:scale-110 shrink-0" style={{ width: "2.5rem", height: "2.5rem", color: "var(--md-sys-color-secondary)", display: "flex", alignItems: "center", justifyContent: "center", transition: "transform 300ms" }}>
                        <span className="material-symbols-outlined md:text-2xl" style={{ fontSize: "1.25rem" }}>edit</span>
                    </div>
                    <div style={{ minWidth: "0" }}>
                        <p className="m3-label-large md:text-lg" style={{ fontWeight: "bold", fontSize: "1rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>Modifica</p>
                        <p className="m3-body-small line-clamp-1" style={{ opacity: "0.8" }}>Cambia contenuto o sposta.</p>
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


