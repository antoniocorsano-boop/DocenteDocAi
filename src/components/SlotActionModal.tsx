// LEGACY - MD3 Non-compliant

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
  const { layers } = useTheme();
  
  const typeIcon = lesson.tipoLezione ? LESSON_TYPE_ICONS[lesson.tipoLezione] : 'school';
  const attachmentCount = lesson.materialiDidattici?.length || 0;

  return (
    <M3Dialog
      title={
        <div style={{
  display: 'flex',
  flexDirection: 'column'
}}>
          <span style={{ color: layers.sys.color.onSurfaceVariant }}>Lezione Programmata</span>
          <span style={{ color:  layers.sys.color.onSurfaceVariant }}>{slot.giorno}, {slot.ora}</span>
        </div>
      }
      onClose={onClose}
      maxWidth="sm"
      level={1}
    >
      <M3DialogContent>
            {/* Interactive Hero Card */}
            <div 
                style={{ color: sys.colors.on-primaryContainer, borderRadius: layers.ref.shape.corner.large }} style={{backgroundColor: "layers.sys.color.primaryContainer", cursor: "pointer", transition: "all 300ms cubic-bezier(0.4, 0, 0.2, 1)", padding: layers.ref.spacing['6']}}
                onClick={onView}
                role="button"
                tabIndex={0}
                aria-label="Vedi dettagli lezione"
            >
                {/* Metadata Row */}
                <div style={{display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: layers.ref.spacing['6'], opacity: "0.9"}}>
                    <div style={{display: "flex", flexWrap: "wrap", gap: layers.ref.spacing['8']}}>
                        <span style={{ backgroundColor: sys.colors.surface/20, color: sys.colors.on-primaryContainer }} style={{ border: "none", fontWeight: "bold" }}>
                            {slot.classe}
                        </span>
                        <span style={{ backgroundColor: sys.colors.surface/20, color: sys.colors.on-primaryContainer }} style={{ border: "none" }}>
                            <span >{typeIcon}</span>
                            {lesson.tipoLezione || 'Lezione'}
                        </span>
                        {attachmentCount > 0 && (
                             <span style={{ backgroundColor: sys.colors.surface/30, color: sys.colors.on-primaryContainer }} style={{ border: "none" }} title={`${attachmentCount} allegati`}>
                                <span >attachment</span>
                                {attachmentCount}
                            </span>
                        )}
                    </div>
                    <span  style={{ transition: "transform 300ms" }}>chevron_right</span>
                </div>

                {/* Main Content */}
                <div>
                    <p  style={{textTransform: "uppercase", letterSpacing: "0.05em", opacity: "0.7", marginBottom: layers.ref.spacing['4']}}>{slot.materia}</p>
                    <h3  style={{fontWeight: "bold", lineHeight: "1.25", marginBottom: layers.ref.spacing['4']}}>
                        {lesson.contenuto}
                    </h3>
                    {lesson.nota && (
                        <p style={{ backgroundColor: sys.colors.surface/10, borderRadius: layers.ref.shape.corner.large }} style={{marginTop: layers.ref.spacing['4'], opacity: "0.8", display: "flex", alignItems: "flex-start", gap: layers.ref.spacing['4'], padding: layers.ref.spacing['8']}}>
                            <span >sticky_note_2</span>
                            {lesson.nota}
                        </p>
                    )}
                </div>
            </div>
            
            {/* Action List */}
            <div style={{display: "flex", flexDirection: "column", gap: layers.ref.spacing['6'], marginTop: layers.ref.spacing['4']}}>
                <button 
                    onClick={onStart} 
                    style={{ borderRadius: layers.ref.shape.corner.large }} style={{display: "flex", alignItems: "center", gap: layers.ref.spacing['6'], padding: layers.ref.spacing['6'], backgroundColor: "layers.sys.color.primary", color: "layers.sys.color.on-primary", transition: "all 300ms cubic-bezier(0.4, 0, 0.2, 1)", textAlign: "left"}}
                >
                    <div style={{ borderRadius: layers.ref.shape.corner.large, color: sys.colors.on-primaryContainer }} style={{width: "2.5rem", height: "2.5rem", backgroundColor: "layers.sys.color.primaryContainer", display: "flex", alignItems: "center", justifyContent: "center", transition: "transform 300ms"}}>
                        <span  style={{ fontSize: "1.25rem" }}>door_open</span>
                    </div>
                    <div style={{ minWidth: "0" }}>
                        <p  style={{ fontWeight: "bold", fontSize: layers.ref.spacing['3'], overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{isDraftExisting ? 'Torna in Aula' : 'Avvia Aula'}</p>
                        <p  style={{ opacity: "0.9" }}>Apri il registro e inizia la lezione.</p>
                    </div>
                </button>

                <button 
                    onClick={onEdit} 
                    style={{ borderRadius: layers.ref.shape.corner.large, color: sys.colors.on-secondary-container }} style={{display: "flex", alignItems: "center", gap: layers.ref.spacing['6'], padding: layers.ref.spacing['6'], backgroundColor: "layers.sys.color.secondary-container", transition: "all 300ms cubic-bezier(0.4, 0, 0.2, 1)", textAlign: "left"}}
                >
                    <div style={{ borderRadius: layers.ref.shape.corner.large, backgroundColor:  layers.sys.color.surfaceContainerLowest }} style={{width: "2.5rem", height: "2.5rem", color: "layers.sys.color.secondary", display: "flex", alignItems: "center", justifyContent: "center", transition: "transform 300ms"}}>
                        <span  style={{ fontSize: "1.25rem" }}>edit</span>
                    </div>
                    <div style={{ minWidth: "0" }}>
                        <p  style={{ fontWeight: "bold", fontSize: layers.ref.spacing['3'], overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>Modifica</p>
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







