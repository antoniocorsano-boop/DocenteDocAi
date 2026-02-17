// Settings - Profile & Identity Section
import React from 'react';
import { SettingsGroup } from './SettingsGroup';
import { M3Typography, TextField } from '../ui';
import { TimetableSettings } from '../../types';

interface ProfileSettingsProps {
    localSettings: TimetableSettings;
    onSettingChange: (key: string, value: unknown) => void;
}

export const ProfileSettings: React.FC<ProfileSettingsProps> = ({
    localSettings,
    onSettingChange
}) => {
    return (
        <SettingsGroup
            id="profile"
            title="Profilo & Identità"
            subtitle="Dati docente e istituto"
            icon="badge"
            variant="surface"
            defaultOpen={false}
        >
            <div
                role="region"
                aria-label="Profilo & Identità"
                tabIndex={0}
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'var(--app-spacing-container)',
                    padding: 'var(--app-spacing-container)',
                    borderRadius: 'var(--md-sys-shape-corner-large)',
                    background: 'var(--md-sys-color-surface-container-low)',
                    boxShadow: 'var(--md-sys-elevation-level1)'
                }}
            >
                <M3Typography variant="label-large" style={{
                    color: 'var(--app-color-on-surface)',
                    fontWeight: 900,
                    marginBottom: 'var(--app-spacing-element)'
                }}>
                    Profilo & Identità
                </M3Typography>
                <M3Typography variant="body-small" style={{
                    color: 'var(--md-sys-color-on-surface-variant)',
                    marginBottom: 'var(--app-spacing-container)',
                    opacity: 0.8
                }}>
                    Dati docente e istituto
                </M3Typography>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'var(--md-sys-grid-fr-1) var(--md-sys-grid-fr-1)',
                    gap: 'var(--app-spacing-container)'
                }}>
                    <TextField
                        label="Nome"
                        value={localSettings.nomeInsegnante}
                        onChange={e => onSettingChange('nomeInsegnante', e.target.value)}
                    />
                    <TextField
                        label="Cognome"
                        value={localSettings.cognomeInsegnante || ''}
                        onChange={e => onSettingChange('cognomeInsegnante', e.target.value)}
                    />
                </div>
                <TextField
                    label="Email Istituzionale"
                    type="email"
                    value={localSettings.email || ''}
                    onChange={e => onSettingChange('email', e.target.value)}
                    placeholder="nome.cognome@scuola.edu.it"
                />
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'var(--md-sys-grid-fr-1) var(--md-sys-grid-fr-1)',
                    gap: 'var(--app-spacing-container)'
                }}>
                    <TextField
                        label="Nome Istituto"
                        value={localSettings.nomeIstituto}
                        onChange={e => onSettingChange('nomeIstituto', e.target.value)}
                    />
                    <TextField
                        label="Città"
                        value={localSettings.cittaIstituto}
                        onChange={e => onSettingChange('cittaIstituto', e.target.value)}
                    />
                </div>
            </div>
        </SettingsGroup>
    );
};
