// MD3 Compliant - Migration completed

import React from 'react';
import { Slot, Lezione } from '../types';
import { LESSON_TYPE_ICONS } from '../constants';
import { Button, Box, Typography, ButtonBase  } from '@mui/material';
import { M3Dialog } from './ui';
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
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography component="span" sx={{ color: 'var(--md-sys-color-on-surface-variant)' }}>Lezione Programmata</Typography>
          <Typography component="span" sx={{ color: 'var(--md-sys-color-on-surface-variant)' }}>{slot.giorno}, {slot.ora}</Typography>
        </Box>
      }
      onClose={onClose}
      maxWidth="sm"
      buttons={<Button onClick={onClose} variant="text">Chiudi</Button>}
    >
            {/* Interactive Hero Card */}
            <ButtonBase
                component="div"
                sx={{ color: 'var(--md-sys-color-on-primary-container)', borderRadius: 'var(--md-sys-shape-corner-large)', backgroundColor: 'var(--md-sys-color-primary)', cursor: 'pointer', transition: 'opacity, transform, background-color, color, border-color, box-shadow var(--md-sys-motion-duration-medium) var(--md-sys-motion-easing-standard)', padding: 'var(--md-sys-spacing-6)', width: '100%', textAlign: 'left' }}
                onClick={onView}
                aria-label="Vedi dettagli lezione"
            >
                {/* Metadata Row */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 'var(--md-sys-spacing-6)', opacity: 'var(--md-sys-state-opacity-hover-overlay)' }}>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--md-sys-spacing-8)' }}>
                        <Typography component="span" sx={{ backgroundColor: 'color-mix(in srgb, var(--md-sys-color-surface) 20%, transparent)', color: 'var(--md-sys-color-on-primary-container)', border: 'none', fontWeight: 'var(--md-sys-typescale-weight-bold)' }}>
                            {slot.classe}
                        </Typography>
                        <Typography component="span" sx={{ backgroundColor: 'color-mix(in srgb, var(--md-sys-color-surface) 20%, transparent)', color: 'var(--md-sys-color-on-primary-container)', border: 'none' }}>
                            <Typography component="span">{typeIcon}</Typography>
                            {lesson.tipoLezione || 'Lezione'}
                        </Typography>
                        {attachmentCount > 0 && (
                            <Typography component="span" sx={{ backgroundColor: 'color-mix(in srgb, var(--md-sys-color-surface) 30%, transparent)', color: 'var(--md-sys-color-on-primary-container)', border: 'none' }} title={`${attachmentCount} allegati`}>
                                <Typography component="span">attachment</Typography>
                                {attachmentCount}
                            </Typography>
                        )}
                    </Box>
                    <Typography component="span" sx={{ transition: 'transform var(--md-sys-motion-duration-medium)' }}>chevron_right</Typography>
                </Box>

                {/* Main Content */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-4)' }}>
                    <Typography component="p" sx={{ textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 'var(--md-sys-state-opacity-supporting)', mb: 'var(--md-sys-spacing-4)' }}>{slot.materia}</Typography>
                    <Typography variant="h6" component="h3" sx={{ fontWeight: 'var(--md-sys-typescale-weight-bold)', lineHeight: '1.25', mb: 'var(--md-sys-spacing-4)' }}>
                        {lesson.contenuto}
                    </Typography>
                    {lesson.nota && (
                        <Typography component="p" sx={{ backgroundColor: 'color-mix(in srgb, var(--md-sys-color-surface) 10%, transparent)', borderRadius: 'var(--md-sys-shape-corner-large)', mt: 'var(--md-sys-spacing-4)', opacity: 'var(--md-sys-state-opacity-caption)', display: 'flex', alignItems: 'flex-start', gap: 'var(--md-sys-spacing-4)', padding: 'var(--md-sys-spacing-8)' }}>
                            <Typography component="span">sticky_note_2</Typography>
                            {lesson.nota}
                        </Typography>
                    )}
                </Box>
            </ButtonBase>

            {/* Action List */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-6)', mt: 'var(--md-sys-spacing-4)' }}>
                <ButtonBase
                    component="button"
                    onClick={onStart}
                    sx={{ borderRadius: 'var(--md-sys-shape-corner-large)', display: 'flex', alignItems: 'center', gap: 'var(--md-sys-spacing-6)', padding: 'var(--md-sys-spacing-6)', backgroundColor: 'var(--md-sys-color-primary)', color: 'var(--md-sys-color-on-surface)', transition: 'opacity, transform, background-color, color, border-color, box-shadow var(--md-sys-motion-duration-medium) var(--md-sys-motion-easing-standard)', textAlign: 'left', width: '100%' }}
                >
                    <Box sx={{ borderRadius: 'var(--md-sys-shape-corner-large)', color: 'var(--md-sys-color-on-primary-container)', width: 'var(--md-sys-spacing-10)', height: 'var(--md-sys-spacing-10)', backgroundColor: 'var(--md-sys-color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform var(--md-sys-motion-duration-medium)' }}>
                        <Typography component="span" sx={{ fontSize: 'var(--md-sys-spacing-5)' }}>door_open</Typography>
                    </Box>
                    <Box sx={{ minWidth: 0 }}>
                        <Typography component="p" sx={{ fontWeight: 'var(--md-sys-typescale-weight-bold)', fontSize: 'var(--md-sys-spacing-3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{isDraftExisting ? 'Torna in Aula' : 'Avvia Aula'}</Typography>
                        <Typography component="p" sx={{ opacity: 'var(--md-sys-state-opacity-hover-overlay)' }}>Apri il registro e inizia la lezione.</Typography>
                    </Box>
                </ButtonBase>

                <ButtonBase
                    component="button"
                    onClick={onEdit}
                    sx={{ borderRadius: 'var(--md-sys-shape-corner-large)', color: 'var(--md-sys-color-on-secondary-container)', display: 'flex', alignItems: 'center', gap: 'var(--md-sys-spacing-6)', padding: 'var(--md-sys-spacing-6)', backgroundColor: 'var(--md-sys-color-secondary)', transition: 'opacity, transform, background-color, color, border-color, box-shadow var(--md-sys-motion-duration-medium) var(--md-sys-motion-easing-standard)', textAlign: 'left', width: '100%' }}
                >
                    <Box sx={{ borderRadius: 'var(--md-sys-shape-corner-large)', backgroundColor: 'var(--md-sys-color-surface-container-low)', width: 'var(--md-sys-spacing-10)', height: 'var(--md-sys-spacing-10)', color: 'var(--md-sys-color-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform var(--md-sys-motion-duration-medium)' }}>
                        <Typography component="span" sx={{ fontSize: 'var(--md-sys-spacing-5)' }}>edit</Typography>
                    </Box>
                    <Box sx={{ minWidth: 0 }}>
                        <Typography component="p" sx={{ fontWeight: 'var(--md-sys-typescale-weight-bold)', fontSize: 'var(--md-sys-spacing-3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Modifica</Typography>
                        <Typography component="p" sx={{ opacity: 'var(--md-sys-state-opacity-caption)' }}>Cambia contenuto o sposta.</Typography>
                    </Box>
                </ButtonBase>
            </Box>
    </M3Dialog>
  );
};

export default SlotActionModal;

