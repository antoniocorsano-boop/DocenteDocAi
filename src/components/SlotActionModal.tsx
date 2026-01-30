// MD3 Compliant - Migration completed

import React from 'react';
import { Slot, Lezione } from '../types';
import { LESSON_TYPE_ICONS } from '../constants';
import { M3Dialog, M3DialogContent, M3DialogActions, M3Button } from './ui';
import { useTheme } from '../theme/theme';
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

  // MD3 Theme tokens
  const { layers: { sys: { colors } } } = useTheme();

  return (
    <M3Dialog
      title={
        <div style={{
  display: 'flex',
  flexDirection: 'column'
}}>
          <span style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>Lezione Programmata</span>
          <span style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>{slot.giorno}, {slot.ora}</span>
        </div>
      }
      onClose={onClose}
      maxWidth="sm"
      level={1}
    >
      <M3DialogContent>
            {/* Interactive Hero Card */}
            <div 
                style={{ color: colors.onPrimaryContainer, borderRadius: 'var(--md-sys-shape-corner-large)' , backgroundColor: "var(--app-color-primary)", cursor: "pointer", transition: 'opacity, transform, background-color, color, border-color, box-shadow var(--app-motion-standard) var(--app-easing-standard)', padding: 'var(--app-spacing-section)'}}
                onClick={onView}
                role="button"
                tabIndex={0}
                aria-label="Vedi dettagli lezione"
            >
                {/* Metadata Row */}
                <div style={{display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 'var(--app-spacing-section)', opacity: "0.9"}}>
                    <div style={{display: "flex", flexWrap: "wrap", gap: 'var(--md-sys-spacing-8)'}}>
                        <span style={{ backgroundColor: colors.surface + '33', color: colors.onPrimaryContainer ,  border: "none", fontWeight: "bold" }}>
                            {slot.classe}
                        </span>
                        <span style={{ backgroundColor: colors.surface + '33', color: colors.onPrimaryContainer ,  border: "none" }}>
                            <span >{typeIcon}</span>
                            {lesson.tipoLezione || 'Lezione'}
                        </span>
                        {attachmentCount > 0 && (
                             <span style={{ backgroundColor: colors.surface + '4D', color: colors.onPrimaryContainer ,  border: "none" }} title={`${attachmentCount} allegati`}>
                                <span >attachment</span>
                                {attachmentCount}
                            </span>
                        )}
                    </div>
                    <span  style={{ transition: "transform var(--app-motion-standard)" }}>chevron_right</span>
                </div>

                {/* Main Content */}
                <div>
                    <p  style={{textTransform: "uppercase", letterSpacing: "0.05em", opacity: "0.7", marginBottom: 'var(--app-spacing-container)'}}>{slot.materia}</p>
                    <h3  style={{fontWeight: "bold", lineHeight: "1.25", marginBottom: 'var(--app-spacing-container)'}}>
                        {lesson.contenuto}
                    </h3>
                    {lesson.nota && (
                        <p style={{ backgroundColor: colors.surface + '1A', borderRadius: 'var(--md-sys-shape-corner-large)' , marginTop: 'var(--app-spacing-container)', opacity: "0.8", display: "flex", alignItems: "flex-start", gap: 'var(--app-spacing-container)', padding: 'var(--md-sys-spacing-8)'}}>
                            <span >sticky_note_2</span>
                            {lesson.nota}
                        </p>
                    )}
                </div>
            </div>
            
            {/* Action List */}
            <div style={{display: "flex", flexDirection: "column", gap: 'var(--app-spacing-section)', marginTop: 'var(--app-spacing-container)'}}>
                <button 
                    onClick={onStart} 
                    style={{ borderRadius: 'var(--md-sys-shape-corner-large)' , display: "flex", alignItems: "center", gap: 'var(--app-spacing-section)', padding: 'var(--app-spacing-section)', backgroundColor: "var(--app-color-primary)", color: "var(--md-sys-color-on)", transition: 'opacity, transform, background-color, color, border-color, box-shadow var(--app-motion-standard) var(--app-easing-standard)', textAlign: "left"}}
                >
                    <div style={{ borderRadius: 'var(--md-sys-shape-corner-large)', color: colors.onPrimaryContainer , width: "var(--md-sys-spacing-10)", height: "var(--md-sys-spacing-10)", backgroundColor: "var(--app-color-primary)", display: "flex", alignItems: "center", justifyContent: "center", transition: "transform var(--app-motion-standard)"}}>
                        <span  style={{ fontSize: "var(--app-spacing-touch)" }}>door_open</span>
                    </div>
                    <div style={{ minWidth: "0" }}>
                        <p  style={{ fontWeight: "bold", fontSize: 'var(--app-spacing-element)', overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{isDraftExisting ? 'Torna in Aula' : 'Avvia Aula'}</p>
                        <p  style={{ opacity: "0.9" }}>Apri il registro e inizia la lezione.</p>
                    </div>
                </button>

                <button 
                    onClick={onEdit} 
                    style={{ borderRadius: 'var(--md-sys-shape-corner-large)', color: colors.onSecondaryContainer , display: "flex", alignItems: "center", gap: 'var(--app-spacing-section)', padding: 'var(--app-spacing-section)', backgroundColor: "var(--app-color-secondary)", transition: 'opacity, transform, background-color, color, border-color, box-shadow var(--app-motion-standard) var(--app-easing-standard)', textAlign: "left"}}
                >
                    <div style={{ borderRadius: 'var(--md-sys-shape-corner-large)', backgroundColor: 'var(--md-sys-color-surface-container-low)', width: "var(--md-sys-spacing-10)", height: "var(--md-sys-spacing-10)", color: "var(--app-color-secondary)", display: "flex", alignItems: "center", justifyContent: "center", transition: "transform var(--app-motion-standard)" }}>
                        <span  style={{ fontSize: "var(--app-spacing-touch)" }}>edit</span>
                    </div>
                    <div style={{ minWidth: "0" }}>
                        <p  style={{ fontWeight: "bold", fontSize: 'var(--app-spacing-element)', overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>Modifica</p>
                        <p  style={{ opacity: "0.8" }}>Cambia contenuto o sposta.</p>
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








