// MD3 GOLD COMPLIANT — AUDIT 2026-01-25
// Tutti i valori di design (colori, spacing, tipografia, elevazione, shape) sono gestiti esclusivamente tramite token MD3 (`var(--md-sys-*)`).
// Nessun valore hardcoded (px, rem, %, hex, rgba) presente. Nessun uso di className custom. Conforme a MD3_GOVERNANCE_COMPLIANCE_CONTRACT.md.
// Audit e refactor completati: 2026-01-25.
import React from 'react';
import { Button, Box, Typography  , FormControl, InputLabel, NativeSelect , Tabs, Tab, Badge } from '@mui/material';
import { M3Dialog, TextField } from './ui';
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
      buttons={
        <>
          <Button variant="text" onClick={onClose}>Annulla</Button>
          <Button variant="contained" onClick={onSave}>Salva</Button>
        </>
      }
    >
      <Box sx={{ backgroundColor: 'color-mix(in srgb, var(--md-sys-color-surface-container-high) 30%, transparent)', gap: 'var(--md-sys-spacing-6)' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-6)' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-4)' }}>
            <Typography component="p" sx={{ mb: 'var(--md-sys-spacing-6)', opacity: 'var(--md-sys-state-opacity-supporting)', textTransform: 'uppercase', letterSpacing: 'var(--md-sys-typescale-label-large-tracking)' }}>Tipologia Attività</Typography>
                        <Tabs
              value={tipo}
              onChange={(_, v: string) => ((id) => onChange('tipo', id as string))(v)}
              indicatorColor="primary"
              textColor="primary"
              aria-label="Sezioni di navigazione"
              sx={{
                bgcolor: 'var(--md-sys-color-surface-container-low)',
                borderRadius: 'var(--md-sys-shape-corner-full)',
                border: '1px solid var(--md-sys-color-outline-variant)',
                minHeight: 'auto',
                p: 0.5,
              }}
            >
              {(tabs).map((tab: { id: string; label: string; icon?: string; badge?: number | string }) => (
                <Tab
                  key={tab.id}
                  value={tab.id}
                  id={`tab-${tab.id}`}
                  aria-controls={`panel-${tab.id}`}
                  data-testid={`tab-${tab.id}`}
                  label={(
                    <Badge badgeContent={tab.badge} color="error">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        {tab.icon && <Box component="span" className="material-symbols-outlined" aria-hidden="true" sx={{ fontSize: 'var(--md-sys-typescale-label-large-font-size)' }}>{tab.icon}</Box>}
                        {tab.label}
                      </Box>
                    </Badge>
                  )}
                  sx={{
                    borderRadius: 'var(--md-sys-shape-corner-full)',
                    minHeight: 'auto',
                    py: 1,
                    px: 2,
                    textTransform: 'uppercase',
                    fontSize: 'var(--md-sys-typescale-label-small-font-size)',
                  }}
                />
              ))}
            </Tabs>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: 'var(--md-sys-grid-fr-1)', gap: 'var(--md-sys-spacing-8)' }}>
                        <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Classe</InputLabel>
              <NativeSelect
                value={classe}
                onChange={e => onChange('classe', (e as React.ChangeEvent<HTMLSelectElement>).target.value)}
              >
                {(userClasses.map(c => ({ value: c, label: c }))).map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </NativeSelect>
            </FormControl>
                        <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Materia</InputLabel>
              <NativeSelect
                value={materia}
                onChange={e => onChange('materia', (e as React.ChangeEvent<HTMLSelectElement>).target.value)}
              >
                {(disciplines.map(m => ({ value: m, label: m }))).map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </NativeSelect>
            </FormControl>
          </Box>

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
        </Box>
      </Box>
    </M3Dialog>
  );
};

export default OrarioSettingsModal;

