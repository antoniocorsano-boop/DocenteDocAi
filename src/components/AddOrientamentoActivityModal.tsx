import React, { useState } from 'react';
import { OrientamentoActivity } from '../types';
import { M3Dialog, M3DialogContent, M3DialogActions, M3Button, TextField, SelectField, TextArea } from './ui';

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
            <M3DialogContent className="space-y-8 pt-8 px-8 md:px-16">
                <TextField
                    label="Titolo Attività"
                    value={activity.title}
                    onChange={(e) => setActivity({ ...activity, title: e.target.value })}
                />
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-16">
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

                <div className="space-y-4">
                    <label className="m3-label-medium text-[var(--md-sys-color-on-surface)]-variant">Classi Coinvolte</label>
                    <div className="flex flex-wrap gap-12">
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
                                className={`px-8 py-4 rounded-full text-xs font-bold transition-all ${
                                    activity.classes?.includes(cls)
                                        ? 'bg-primary text-on-primary'
                                        : 'bg-[var(--md-sys-color-surface-container-high)] text-[var(--md-sys-color-on-surface)]-variant'
                                }`}
                            >
                                {cls}
                            </button>
                        ))}
                    </div>
                </div>
            </M3DialogContent>
            <M3DialogActions>
                <M3Button onClick={onClose} variant="text">Annulla</M3Button>
                <M3Button onClick={handleSave} variant="primary" disabled={!activity.title}>Salva Attività</M3Button>
            </M3DialogActions>
        </M3Dialog>
    );
};

export default AddOrientamentoActivityModal;



