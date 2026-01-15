// LEGACY - MD3 Non-compliant
import React, { useState } from 'react';
import { OrientamentoActivity } from '../types';
import { M3Dialog, M3DialogContent, M3DialogActions, M3Button, TextField, SelectField, TextArea } from './ui';
import { UI_TEXT } from '../constants/ui-text';
import { useTheme } from '../theme/theme';

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
  const { layers } = useTheme();
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
            <M3DialogContent  style={{gap: layers.ref.spacing['8']}}>
                <TextField
                    label="Titolo Attività"
                    value={activity.title}
                    onChange={(e) => setActivity({ ...activity, title: e.target.value })}
                />
                
                <div  style={{ display: "grid", gridTemplateColumns: "1fr" }}>
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

                <div style={{marginTop: layers.ref.spacing['4']}}>
                    <label style={{ color:  layers.sys.color.onSurfaceVariant }}>Classi Coinvolte</label>
                    <div  style={{ display: "flex", flexWrap: "wrap" }}>
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
                                        : 'bg-[var(--md-sys-color-surfaceContainerHigh)] text-[var(--md-sys-color-onSurface)]-variant'
                                }`}
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








