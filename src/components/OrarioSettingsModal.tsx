import React from 'react';
import { M3Dialog, M3DialogContent, M3DialogActions, M3Button, TextField, SelectField, TabGroup } from './ui';

interface OrarioSettingsModalProps {
  tipo: 'lezione' | 'disp' | 'ricev';
  classe: string;
  materia: string;
  argomento?: string;
  linkNotebook?: string;
  userClasses: string[];
  disciplines: string[];
  onChange: (field: string, value: string) => void;
  onClose: () => void;
  onSave: () => void;
}

const OrarioSettingsModal: React.FC<OrarioSettingsModalProps> = ({ 
  tipo, classe, materia, argomento, linkNotebook, userClasses, disciplines, onChange, onClose, onSave 
}) => {
  const tabs = [
    { id: 'lezione', label: 'Lezione', icon: 'school' },
    { id: 'disp', label: 'Disp.', icon: 'camera_alt' },
    { id: 'ricev', label: 'Ricev.', icon: 'group' },
  ];

  return (
    <M3Dialog
      title="Configurazione Slot"
      onClose={onClose}
      maxWidth="md"
      level={2}
    >
      <M3DialogContent className="space-y-6 bg-surface-container-high/30 backdrop-blur-sm">
        <div className="flex flex-col gap-6">
          <div>
            <p className="m3-label-large mb-3 opacity-70 uppercase tracking-widest">Tipologia Attività</p>
            <TabGroup
              tabs={tabs}
              activeTab={tipo}
              onChange={(id) => onChange('tipo', id as string)}
              variant="primary"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SelectField
              label="Classe"
              value={classe}
              options={userClasses.map(c => ({ value: c, label: c }))}
              onChange={val => onChange('classe', val)}
              fullWidth
            />
            <SelectField
              label="Materia"
              value={materia}
              options={disciplines.map(m => ({ value: m, label: m }))}
              onChange={val => onChange('materia', val)}
              fullWidth
            />
          </div>

          <TextField
            label="Argomento (opzionale)"
            value={argomento || ''}
            onChange={e => onChange('argomento', e.target.value)}
            fullWidth
          />

          <TextField
            label="Link ai notebook"
            value={linkNotebook || ''}
            onChange={e => onChange('linkNotebook', e.target.value)}
            fullWidth
            placeholder="Incolla URL deliverable..."
          />
        </div>
      </M3DialogContent>
      <M3DialogActions>
        <M3Button variant="text" onClick={onClose}>Annulla</M3Button>
        <M3Button variant="filled" onClick={onSave}>Salva</M3Button>
      </M3DialogActions>
    </M3Dialog>
  );
};

export default OrarioSettingsModal;

export default OrarioSettingsModal;
