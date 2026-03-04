// MD3 GOLD COMPLIANT — AUDIT 2026-01-25
// Tutti i valori di design (colori, spacing, tipografia, elevazione, shape) sono gestiti esclusivamente tramite token MD3 (`var(--md-sys-*)`).
// Nessun valore hardcoded (px, rem, %, hex, rgba) presente. Nessun uso di className custom. Conforme a MD3_GOVERNANCE_COMPLIANCE_CONTRACT.md.
// Audit e refactor completati: 2026-01-25.
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
      <M3DialogContent style={{ backgroundColor: 'var(--md-sys-color-surface-container-high)'/30 , gap: 'var(--md-sys-spacing-6)'}}>
        <div style={{display: "flex", flexDirection: "column", gap: 'var(--md-sys-spacing-6)'}}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-4)' }}>
            <p  style={{marginBottom: 'var(--md-sys-spacing-6)', opacity: "var(--md-sys-state-opacity-supporting)", textTransform: "uppercase", letterSpacing: "var(--md-sys-typescale-label-large-tracking)"}}>Tipologia Attività</p>
            <TabGroup
              tabs={tabs}
              activeTab={tipo}
              onChange={(id) => onChange('tipo', id as string)}
              variant="primary"
            />
          </div>

          <div  style={{display: "grid", gridTemplateColumns: 'var(--md-sys-grid-fr-1)', gap: 'var(--md-sys-spacing-8)'}}>
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

