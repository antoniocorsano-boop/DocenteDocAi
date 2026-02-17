// Settings - Debug & Logging Section
import React from 'react';
import { SettingsGroup } from './SettingsGroup';
import { M3Typography, M3Button, InfoCard } from '../ui';
import { errorLogger } from '../../services/errorLogger';

interface DebugSettingsProps {
    showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export const DebugSettings: React.FC<DebugSettingsProps> = ({
    showToast
}) => {
    const errorStats = errorLogger.getErrorStats();

    return (
        <SettingsGroup
            id="debug_logging"
            title="Debug & Logging"
            subtitle="Visualizza e gestisci i log degli errori"
            icon="bug_report"
            variant="surface"
            defaultOpen={false}
        >
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--app-spacing-container)'
            }}>
                {/* Error Logs Panel */}
                <div style={{
                    padding: 'var(--app-spacing-container)',
                    backgroundColor: 'var(--app-color-surface-container)',
                    borderRadius: 'var(--md-sys-shape-corner-large)',
                    border: 'var(--app-border-thin) solid var(--md-sys-color-outline-variant)'
                }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        marginBottom: 'var(--app-spacing-container)'
                    }}>
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
                                Log degli Errori
                            </M3Typography>
                            <M3Typography
                                variant="body-medium"
                                style={{ color: 'var(--md-sys-color-on-surface-variant)' }}
                            >
                                Visualizza tutti gli errori registrati durante l'utilizzo dell'app
                            </M3Typography>
                        </div>
                        <span style={{
                            fontFamily: 'Material Symbols Outlined',
                            fontSize: 'var(--app-text-body)',
                            color: errorStats.total > 0 ? 'var(--md-sys-color-error)' : 'var(--app-color-primary)'
                        }}>{errorStats.total > 0 ? 'error' : 'check_circle'}</span>
                    </div>

                    {/* Stats */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--app-spacing-container)',
                        padding: 'var(--app-spacing-container)',
                        backgroundColor: 'var(--md-sys-color-surface-container-low)',
                        borderRadius: 'var(--md-sys-shape-corner-medium)',
                        border: 'var(--app-border-thin) solid var(--md-sys-color-outline-variant)',
                        marginBottom: 'var(--app-spacing-container)'
                    }}>
                        <span style={{
                            fontFamily: 'Material Symbols Outlined',
                            fontSize: 'var(--app-text-body)',
                            color: 'var(--app-color-primary)'
                        }}>info</span>
                        <M3Typography
                            variant="body-small"
                            style={{ color: 'var(--md-sys-color-on-surface-variant)' }}
                        >
                            {errorStats.total} log registrati
                        </M3Typography>
                    </div>

                    {/* Actions */}
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 'var(--app-spacing-container)'
                    }}>
                        <M3Button
                            onClick={() => {
                                showToast('Apri la console del browser (F12) e digita: window.__errorLogger.getRecentErrors()', 'info');
                            }}
                            variant="tonal"
                            style={{ width: '100%' }}
                        >
                            <span style={{
                                fontFamily: 'Material Symbols Outlined',
                                fontSize: 'var(--app-text-body)',
                                marginRight: 'var(--app-spacing-container)'
                            }}>terminal</span>
                            Console Browser (F12)
                        </M3Button>
                        <M3Button
                            onClick={() => {
                                const json = errorLogger.exportLogsAsJson();
                                const blob = new Blob([json], { type: 'application/json' });
                                const url = URL.createObjectURL(blob);
                                const a = document.createElement('a');
                                a.href = url;
                                a.download = `error-logs-${new Date().toISOString().slice(0, 10)}.json`;
                                a.click();
                                URL.revokeObjectURL(url);
                                showToast('Log esportati in JSON', 'success');
                            }}
                            variant="tonal"
                            style={{ width: '100%' }}
                        >
                            <span style={{
                                fontFamily: 'Material Symbols Outlined',
                                fontSize: 'var(--app-text-body)',
                                marginRight: 'var(--app-spacing-container)'
                            }}>download</span>
                            Esporta JSON
                        </M3Button>
                        <M3Button
                            onClick={() => {
                                if (confirm('Sei sicuro di voler eliminare tutti i log?')) {
                                    errorLogger.clearAllLogs();
                                    showToast('Tutti i log sono stati eliminati', 'success');
                                }
                            }}
                            variant="text"
                            style={{ width: '100%' }}
                        >
                            <span style={{
                                fontFamily: 'Material Symbols Outlined',
                                fontSize: 'var(--app-text-body)',
                                marginRight: 'var(--app-spacing-container)'
                            }}>delete</span>
                            Elimina Log
                        </M3Button>
                    </div>
                </div>

                <InfoCard
                    title="Come usare"
                    description="Premi F12 per aprire la console, digita window.__errorLogger.getRecentErrors(10) per visualizzare gli ultimi 10 errori."
                    icon="info"
                    variant="secondary"
                />
            </div>
        </SettingsGroup>
    );
};
