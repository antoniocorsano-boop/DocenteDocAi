// MD3 Compliant - Block G Migration (13 violations eliminated)

import React, { useState } from 'react';
import { OrientamentoActivity } from '../types';
import { M3Dialog, M3DialogContent, M3DialogActions, M3Button, TextField, SelectField, TextArea } from './ui';
import { UI_TEXT } from '../constants/ui-text';
interface AddOrientamentoActivityModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (activity: OrientamentoActivity) => void;
    userClasses: string[];
}

const AddOrientamentoActivityModal: React.FC<AddOrientamentoActivityModalProps> = ({
    isOpen,
    onClose,
    onSave,
    userClasses
}) => {
  const [activity, setActivity] = useState<Partial<OrientamentoActivity>>({
        title: '',
        type: 'didattica',
        durationHours: 0,
        date: new Date().toISOString().split('T')[0],
        description: '',
        classes: [],
        studentIds: [],
        competenciesAddressed: []
    });

    const handleSave = () => {
        if (!activity.title || !activity.date || activity.durationHours === undefined) return;
        
        onSave({
            ...activity,
            id: `orient-act-${Date.now()}`,
        } as OrientamentoActivity);
        onClose();
    };

    return (
        <M3Dialog isOpen={isOpen} onClose={onClose} title="Nuova Attività di Orientamento">
            <M3DialogContent style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--md-sys-spacing-6)'
            }}>
                <TextField
                    label="Titolo Attività"
                    value={activity.title}
                    onChange={(e) => setActivity({ ...activity, title: e.target.value })}
                />
                
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'var(--md-sys-grid-fr-1)', // MD3 grid fr token
                  gap: 'var(--md-sys-spacing-4)'
                }}>
                    <SelectField
                        label="Tipo"
                        value={activity.type}
                        onChange={(e) => setActivity({ ...activity, type: e.target.value as OrientamentoActivity['type'] })}
                    >
                        <option value="didattica">Didattica</option>
                        <option value="extra-curriculare">Extra-curriculare</option>
                        <option value="PCTO">PCTO</option>
                        <option value="esperienziale">Esperienziale</option>
                    </SelectField>
                    <TextField
                        label="Ore"
                        type="number"
                        value={activity.durationHours?.toString()}
                        onChange={(e) => setActivity({ ...activity, durationHours: parseInt(e.target.value) || 0 })}
                    />
                </div>

                <TextField
                    label="Data"
                    type="date"
                    value={activity.date}
                    onChange={(e) => setActivity({ ...activity, date: e.target.value })}
                />

                <TextArea
                    label="Descrizione"
                    value={activity.description}
                    onChange={(e) => setActivity({ ...activity, description: e.target.value })}
                    rows={3}
                />

                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--md-sys-spacing-2)'
                }}>
                    <label style={{
                      fontSize: 'var(--md-sys-typescale-body-large-font-size)',
                      fontWeight: 'var(--md-sys-typescale-body-large-weight)',
                      lineHeight: 'var(--md-sys-typescale-body-large-line-height)',
                      color: 'var(--md-sys-color-on-surface-variant)'
                    }}>Classi Coinvolte</label>
                    <div style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 'var(--md-sys-spacing-3)'
                    }}>
                        {userClasses.map(cls => (
                            <button
                                key={cls}
                                onClick={() => {
                                    const classes = activity.classes || [];
                                    if (classes.includes(cls)) {
                                        setActivity({ ...activity, classes: classes.filter(c => c !== cls) });
                                    } else {
                                        setActivity({ ...activity, classes: [...classes, cls] });
                                    }
                                }}
                                style={{
                                  padding: 'var(--md-sys-spacing-2) var(--md-sys-spacing-4)',
                                  borderRadius: 'var(--md-sys-shape-corner-full)',
                                  fontSize: 'var(--md-sys-typescale-body-large-font-size)',
                                  fontWeight: '700',
                                  transition: `all var(--md-sys-motion-duration-short) var(--md-sys-motion-easing-standard)`, // MD3 motion tokens for duration and easing
                                  border: 'none',
                                  cursor: 'pointer',
                                  backgroundColor: activity.classes?.includes(cls)
                                    ? 'var(--md-sys-color-primary)'
                                    : 'var(--md-sys-color-surface-container-high)',
                                  color: activity.classes?.includes(cls)
                                    ? 'var(--md-sys-color-on-primary)'
                                    : 'var(--md-sys-color-on-surface-variant)'
                                }}
                            >
                                {cls}
                            </button>
                        ))}
                    </div>
                </div>
            </M3DialogContent>
            <M3DialogActions>
                <M3Button onClick={onClose} variant="text">{UI_TEXT.CANCEL}</M3Button>
                <M3Button onClick={handleSave} variant="primary" disabled={!activity.title}>Salva Attività</M3Button>
            </M3DialogActions>
        </M3Dialog>
    );
};

export default AddOrientamentoActivityModal;

