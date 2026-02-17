// Settings - Data & Cloud Section
import React, { useRef } from 'react';
import { SettingsGroup } from './SettingsGroup';
import { M3Typography, M3Button, InfoCard } from '../ui';
import { DriveSyncState, TimetableSettings } from '../../types';

interface CloudSettingsProps {
    localSettings: TimetableSettings;
    driveState: DriveSyncState;
    storageInfo: { used: string; total: string; percent: number } | null;
    onConnectDrive: () => void;
    onSyncToDrive: () => void;
    onExportData: () => void;
    onImportData: (data: string) => void;
}

export const CloudSettings: React.FC<CloudSettingsProps> = ({
    localSettings,
    driveState,
    storageInfo,
    onConnectDrive,
    onSyncToDrive,
    onExportData,
    onImportData
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const content = e.target?.result as string;
                onImportData(content);
            };
            reader.readAsText(file);
        }
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    // Calcola se mostrare il reminder di backup
    const DAYS_LIMIT = 30;
    let showReminder = false;
    if (driveState.lastSyncTime) {
        const lastSyncDate = new Date(driveState.lastSyncTime);
        const now = new Date();
        const diffDays = Math.floor((now.getTime() - lastSyncDate.getTime()) / (1000 * 60 * 60 * 24));
        showReminder = diffDays >= DAYS_LIMIT;
    } else {
        showReminder = true;
    }

    return (
        <SettingsGroup
            id="cloud"
            title="Dati & Cloud"
            subtitle="Backup e Storage"
            icon="cloud_sync"
            variant="surface"
            defaultOpen={false}
        >
            {/* Storage Info */}
            {storageInfo && (
                <div style={{
                    marginBottom: 'var(--app-spacing-container)',
                    padding: 'var(--app-spacing-container)',
                    backgroundColor: 'var(--app-color-surface-container)',
                    borderRadius: 'var(--md-sys-shape-corner-large)',
                    border: 'var(--app-border-thin) solid var(--md-sys-color-outline-variant)'
                }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: 'var(--app-spacing-container)'
                    }}>
                        <M3Typography
                            variant="label-large"
                            style={{
                                color: 'var(--app-color-on-surface)',
                                fontWeight: 600
                            }}
                        >
                            Storage Dispositivo
                        </M3Typography>
                        <M3Typography
                            variant="body-medium"
                            style={{
                                color: 'var(--md-sys-color-on-surface-variant)',
                                fontWeight: 500
                            }}
                        >
                            {storageInfo.used}MB / {storageInfo.total}MB
                        </M3Typography>
                    </div>
                    <div style={{
                        width: '100%',
                        height: 'var(--app-spacing-element)',
                        backgroundColor: 'var(--md-sys-color-surface-container-high)',
                        borderRadius: 'var(--app-spacing-element)',
                        overflow: 'hidden',
                        marginBottom: 'var(--app-spacing-container)'
                    }}>
                        <div style={{
                            width: `${storageInfo.percent}%`,
                            height: '100%',
                            backgroundColor: storageInfo.percent > 80 ? 'var(--md-sys-color-error)' : 'var(--app-color-primary)',
                            borderRadius: 'var(--app-spacing-element)',
                            transition: 'width var(--app-motion-standard) var(--app-easing-standard)'
                        }} />
                    </div>
                    <M3Typography
                        variant="body-small"
                        style={{ color: 'var(--md-sys-color-on-surface-variant)' }}
                    >
                        Dati salvati in IndexedDB (senza limiti LocalStorage).
                    </M3Typography>
                </div>
            )}

            {/* Backup reminder */}
            {showReminder && (
                <InfoCard
                    title="Backup cloud non aggiornato!"
                    description="Esegui un backup cloud e verifica il ripristino periodicamente per la sicurezza dei tuoi dati."
                    icon="warning"
                    variant="secondary"
                />
            )}

            {/* Google Drive Status */}
            <div style={{
                padding: 'var(--app-spacing-element)',
                backgroundColor: driveState.isAuthenticated ? 'var(--md-sys-color-primaryContainer)' : 'var(--md-sys-color-surfaceContainer)',
                borderRadius: 'var(--md-sys-shape-corner-large)',
                border: `var(--app-border-thin) solid ${driveState.isAuthenticated ? 'var(--app-color-primary)' : 'var(--md-sys-color-outline-variant)'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 'var(--md-sys-spacing-1)',
                marginBottom: 'var(--app-spacing-container)'
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--md-sys-spacing-1)'
                }}>
                    <div style={{
                        width: 'var(--app-spacing-container)',
                        height: 'var(--app-spacing-container)',
                        borderRadius: 'var(--md-sys-shape-corner-large)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: driveState.isAuthenticated ? 'var(--app-color-primary)' : 'var(--md-sys-color-surface-container-high)',
                        color: driveState.isAuthenticated ? 'var(--app-color-on-primary)' : 'var(--md-sys-color-on-surface-variant)'
                    }}>
                        <span style={{
                            fontFamily: 'Material Symbols Outlined',
                            fontSize: 'var(--app-text-body)'
                        }}>{driveState.isAuthenticated ? 'cloud_done' : 'cloud_off'}</span>
                    </div>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 'var(--app-spacing-container)'
                    }}>
                        <M3Typography
                            variant="label-large"
                            style={{
                                color: 'var(--app-color-on-surface)',
                                fontWeight: 600
                            }}
                        >
                            {driveState.isAuthenticated ? 'Google Drive Connesso' : 'Backup Cloud Disattivo'}
                        </M3Typography>
                        <M3Typography
                            variant="body-small"
                            style={{ color: 'var(--md-sys-color-on-surface-variant)' }}
                        >
                            {driveState.lastSyncTime
                                ? `Ultimo: ${(new Date(driveState.lastSyncTime)).toLocaleString()}`
                                : 'Nessun backup cloud'}
                        </M3Typography>
                    </div>
                </div>
                {driveState.isAuthenticated ? (
                    <M3Button
                        onClick={onSyncToDrive}
                        disabled={driveState.isSyncing}
                        variant="filled"
                    >
                        <span style={{
                            fontFamily: 'Material Symbols Outlined',
                            fontSize: 'var(--app-text-body)',
                            marginRight: 'var(--app-spacing-container)'
                        }}>{driveState.isSyncing ? 'sync' : 'cloud_upload'}</span>
                        {driveState.isSyncing ? '...' : 'Salva'}
                    </M3Button>
                ) : (
                    localSettings.googleClientId && (
                        <M3Button
                            onClick={onConnectDrive}
                            variant="filled"
                        >
                            Connetti
                        </M3Button>
                    )
                )}
            </div>

            {/* Backup Actions */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(calc(var(--md-sys-spacing-20) * 2.5), var(--md-sys-grid-fr-1)))',
                gap: 'var(--app-spacing-container)'
            }}>
                <M3Button onClick={onExportData} variant="tonal">
                    <span style={{
                        fontFamily: 'Material Symbols Outlined',
                        fontSize: 'var(--app-text-body)',
                        marginRight: 'var(--app-spacing-container)'
                    }}>download</span>
                    Backup Locale
                </M3Button>
                <M3Button onClick={() => fileInputRef.current?.click()} variant="tonal">
                    <span style={{
                        fontFamily: 'Material Symbols Outlined',
                        fontSize: 'var(--app-text-body)',
                        marginRight: 'var(--app-spacing-container)'
                    }}>upload</span>
                    Ripristina File
                </M3Button>
                <input
                    type="file"
                    ref={fileInputRef}
                    style={{
                        position: 'absolute',
                        opacity: 0,
                        pointerEvents: 'none'
                    }}
                    accept=".json,.csv,.xlsx,.xls"
                    onChange={handleFileChange}
                />
            </div>
        </SettingsGroup>
    );
};
