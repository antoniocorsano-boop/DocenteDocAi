import React from 'react';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import SettingsGroup from './SettingsGroupAccordion';
import { TextField } from '../ui';
import { TimetableSettings } from '../../types';

interface SettingsAdvancedSectionProps {
    expanded: boolean;
    onToggle: () => void;
    localSettings: TimetableSettings;
    handleChange: (field: keyof TimetableSettings, value: unknown) => void;
    setIsResetModalOpen: (open: boolean) => void;
}

export const SettingsAdvancedSection: React.FC<SettingsAdvancedSectionProps> = ({
    expanded, onToggle, localSettings, handleChange, setIsResetModalOpen
}) => (
    <SettingsGroup
        id="advanced"
        title="Avanzate"
        subtitle="Configurazione tecnica"
        icon="build"
        variant="surface"
        expanded={expanded}
        onToggle={onToggle}
    >
        <Stack spacing={2}>
            <Box sx={{ p: 2, bgcolor: 'var(--md-sys-color-surface-container)', borderRadius: 'var(--md-sys-shape-corner-large)', border: '1px solid', borderColor: 'var(--md-sys-color-outline-variant)' }}>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                    <Box component="span" className="material-symbols-outlined" aria-hidden="true" sx={{ color: 'var(--md-sys-color-primary)', fontSize: 'var(--md-sys-typescale-body-large-font-size)' }}>key</Box>
                    <Typography variant="overline" sx={{ color: 'var(--md-sys-color-primary)', fontWeight: 'var(--md-sys-typescale-weight-bold)' }}>Google Cloud API</Typography>
                </Stack>
                <Stack spacing={2}>
                    <TextField
                        label="Client ID (OAuth)"
                        value={localSettings.googleClientId || ''}
                        onChange={e => handleChange('googleClientId', e.target.value)}
                        slotProps={{ input: { startAdornment: <InputAdornment position="start"><Box component="span" className="material-symbols-outlined" aria-hidden="true">badge</Box></InputAdornment> } }}
                    />
                    <TextField
                        label="API Key (Picker)"
                        type="password"
                        value={localSettings.googleApiKey || ''}
                        onChange={e => handleChange('googleApiKey', e.target.value)}
                        slotProps={{ input: { startAdornment: <InputAdornment position="start"><Box component="span" className="material-symbols-outlined" aria-hidden="true">lock</Box></InputAdornment> } }}
                    />
                </Stack>
            </Box>
            <Box sx={{ p: 2, bgcolor: 'color-mix(in srgb, var(--md-sys-color-error-container) 10%, transparent)', borderRadius: 'var(--md-sys-shape-corner-extra-large)', border: 'var(--md-sys-border-width-thin) solid var(--md-sys-color-error)' }}>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                    <Box component="span" className="material-symbols-outlined" aria-hidden="true" sx={{ color: 'var(--md-sys-color-error)', fontSize: 'var(--md-sys-typescale-body-large-font-size)' }}>warning</Box>
                    <Typography variant="overline" sx={{ color: 'var(--md-sys-color-error)', fontWeight: 'var(--md-sys-typescale-weight-bold)' }}>Zona Pericolo</Typography>
                </Stack>
                <Button
                    onClick={() => setIsResetModalOpen(true)}
                    variant="contained"
                    color="error"
                    fullWidth
                    startIcon={<Box component="span" className="material-symbols-outlined" aria-hidden="true">delete_forever</Box>}
                >
                    Reset Totale Dati
                </Button>
            </Box>
        </Stack>
    </SettingsGroup>
);

export default SettingsAdvancedSection;
