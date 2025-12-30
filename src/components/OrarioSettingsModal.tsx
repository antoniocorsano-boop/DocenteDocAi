import React from 'react';
import { Card, Typography, ToggleButtonGroup, ToggleButton, FormControl, InputLabel, Select, MenuItem, FormHelperText, TextField } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import GroupIcon from '@mui/icons-material/Group';

interface OrarioSettingsModalProps {
  tipo: 'lezione' | 'disp' | 'ricev';
  classe: string;
  materia: string;
  argomento?: string;
  linkNotebook?: string;
  userClasses: string[];
  disciplines: string[];
  onChange: (field: string, value: string) => void;
}

const OrarioSettingsModal: React.FC<OrarioSettingsModalProps> = ({ tipo, classe, materia, argomento, linkNotebook, userClasses, disciplines, onChange }) => {
  return (
    <Card variant="elevation" sx={{ p: 3, borderRadius: 3, maxWidth: 600, mx: 'auto', my: 4 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Tipologia Attività
      </Typography>
      <ToggleButtonGroup
        value={tipo}
        exclusive
        onChange={(_, value) => value && onChange('tipo', value)}
        sx={{ mb: 3 }}
        fullWidth
      >
        <ToggleButton value="lezione" aria-label="Lezione">
          <SchoolIcon sx={{ mr: 1 }} /> Lezione
        </ToggleButton>
        <ToggleButton value="disp" aria-label="Disponibilità">
          <CameraAltIcon sx={{ mr: 1 }} /> Disp.
        </ToggleButton>
        <ToggleButton value="ricev" aria-label="Ricevimento">
          <GroupIcon sx={{ mr: 1 }} /> Ricev.
        </ToggleButton>
      </ToggleButtonGroup>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
        <div style={{ flex: '1 1 220px', minWidth: 180, maxWidth: 320 }}>
          <FormControl fullWidth>
            <InputLabel>Classe</InputLabel>
            <Select
              value={classe}
              label="Classe"
              onChange={e => onChange('classe', e.target.value)}
            >
              {userClasses.map(c => (
                <MenuItem key={c} value={c}>{c}</MenuItem>
              ))}
            </Select>
            <FormHelperText>Seleziona la classe</FormHelperText>
          </FormControl>
        </div>
        <div style={{ flex: '1 1 220px', minWidth: 180, maxWidth: 320 }}>
          <FormControl fullWidth>
            <InputLabel>Materia</InputLabel>
            <Select
              value={materia}
              label="Materia"
              onChange={e => onChange('materia', e.target.value)}
            >
              {disciplines.map(m => (
                <MenuItem key={m} value={m}>{m}</MenuItem>
              ))}
            </Select>
            <FormHelperText>Seleziona la materia</FormHelperText>
          </FormControl>
        </div>
        <div style={{ flex: '1 1 100%', minWidth: 180 }}>
          <TextField
            label="Argomento (opzionale)"
            value={argomento || ''}
            onChange={e => onChange('argomento', e.target.value)}
            fullWidth
            variant="outlined"
            margin="normal"
          />
        </div>
        <div style={{ flex: '1 1 100%', minWidth: 180 }}>
          <TextField
            label="Link ai notebook"
            value={linkNotebook || ''}
            onChange={e => onChange('linkNotebook', e.target.value)}
            fullWidth
            variant="outlined"
            margin="normal"
            helperText="Incolla URL deliverable..."
          />
        </div>
      </div>
    </Card>
  );
};

export default OrarioSettingsModal;
