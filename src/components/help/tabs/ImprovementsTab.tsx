// HelpModal - Improvements Tab
import React from 'react';
import { View } from '../../../types';
import { M3Typography, M3Button } from '../../ui';

interface ImprovementsTabProps {
    onNavigate: (v: View) => void;
    onClose: () => void;
    onGenerate: () => void;
    isGenerating: boolean;
}

const ImprovementCard: React.FC<{ title: string; children: React.ReactNode; actionView?: View; icon?: string }> = ({ title, children, actionView, icon = "new_releases" }) => (
    <div style={{
        transition: 'opacity, transform, background-color, color, border-color, box-shadow var(--app-motion-standard) var(--app-easing-standard)',
        backgroundColor: 'var(--md-sys-color-surface-container-low)',
        borderRadius: 'var(--md-sys-shape-corner-large)',
        padding: 'var(--app-spacing-container)'
    }}>
        <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start"
        }}>
            <div style={{
                display: "flex",
                alignItems: "center",
                flex: "1",
                minWidth: "0"
            }}>
                <div style={{
                    transition: "transform var(--app-motion-standard)",
                    width: 'var(--md-sys-sizing-icon-large)',
                    height: 'var(--md-sys-sizing-icon-large)',
                    borderRadius: 'var(--md-sys-shape-corner-medium)',
                    color: 'var(--app-color-primary)',
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: "0",
                    backgroundColor: 'var(--app-color-primary-container)'
                }}>
                    <span style={{ fontFamily: 'Material Symbols Outlined' }}>{icon}</span>
                </div>
                <M3Typography variant="title-medium" style={{
                    fontWeight: "bold",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    marginLeft: 'var(--app-spacing-element)'
                }}>{title}</M3Typography>
            </div>
            <M3Typography variant="button-primary" style={{
                color: 'var(--app-color-primary)',
                flexShrink: "0",
                fontSize: 'var(--md-sys-typescale--font-size)'
            }}>v4.1.0</M3Typography>
        </div>
        <M3Typography variant="body-medium" style={{
            opacity: "0.7",
            lineHeight: "1.625",
            display: "-webkit-box",
            WebkitLineClamp: "2",
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            marginTop: 'var(--app-spacing-component)'
        }}>{children}</M3Typography>
        {actionView && actionView !== 'home' && (
            <div style={{ width: 'var(--app-layout-full)' }}>
                <M3Button
                    onClick={() => { onClose(); onNavigate(actionView); }}
                    variant="tonal"
                    style={{
                        textTransform: "uppercase",
                        letterSpacing: "var(--md-sys-typescale-label-large-tracking)",
                        marginTop: 'var(--app-spacing-element)'
                    }}
                >
                    <span style={{
                        marginRight: 'var(--app-spacing-component)',
                        fontSize: 'var(--md-sys-typescale--font-size)'
                    }}>arrow_forward</span>
                    Vai alla funzione
                </M3Button>
            </div>
        )}
    </div>
);

export const ImprovementsTab: React.FC<ImprovementsTabProps> = ({ onNavigate, onClose, onGenerate, isGenerating }) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--app-spacing-container)' }}>
            <M3Typography variant="headline-small">Novità della versione 4.1.0</M3Typography>
            
            <div style={{
                display: "grid",
                gridTemplateColumns: "var(--md-sys-grid-fr-1)",
                gap: 'var(--app-spacing-section)'
            }}>
                <ImprovementCard title="Design M3 Expressive" actionView="settings" icon="palette">
                    Interfaccia completamente rinnovata con il nuovo design system Material 3 Expressive: layout adattivi, motion system e colori dinamici.
                </ImprovementCard>

                <ImprovementCard title="Calendario Migliorato" actionView="calendario" icon="calendar_month">
                    Vista calendario completamente ridisegnata con migliore leggibilità, navigazione fluida e integrazione eventi più chiara.
                </ImprovementCard>

                <ImprovementCard title="Stabilità Backup" actionView="settings" icon="cloud_sync">
                    Risolto problema critico di sincronizzazione. Il salvataggio automatico viene sospeso durante l'importazione dati.
                </ImprovementCard>

                <ImprovementCard title="Assistente Vocale iOS" actionView="live-assistant" icon="mic">
                    Corretto il blocco dell'audio su Safari/iPhone. L'assistente ora si inizializza correttamente al tocco.
                </ImprovementCard>

                <ImprovementCard title="Zero-FOUC Theme" actionView="settings" icon="dark_mode">
                    Il tema personalizzato viene caricato istantaneamente all'avvio, eliminando lo sfarfallio dei colori.
                </ImprovementCard>

                <ImprovementCard title="Header & Avatar Migliorati" actionView="settings" icon="account_circle">
                    L'avatar ora mostra le iniziali del nome docente. Header più compatto e informativo.
                </ImprovementCard>
            </div>

            <div style={{
                borderRadius: 'var(--md-sys-shape-corner-large)',
                backgroundColor: 'var(--app-color-primary-container)',
                color: 'var(--app-color-on-primary-container)',
                padding: 'var(--app-spacing-section)',
                border: "var(--app-border-thin) solid var(--md-sys-color-outline)"
            }}>
                <div style={{ display: "flex", alignItems: "center" }}>
                    <div style={{
                        width: 'var(--md-sys-spacing-12)',
                        height: 'var(--md-sys-spacing-12)',
                        borderRadius: 'var(--md-sys-shape-corner-extra-large)',
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        backgroundColor: 'var(--app-color-primary)'
                    }}>
                        <span style={{
                            fontFamily: 'Material Symbols Outlined',
                            color: 'var(--app-color-on-primary)'
                        }}>picture_as_pdf</span>
                    </div>
                    <div style={{ flexGrow: 1, textAlign: "center" }}>
                        <M3Typography variant="title-large">Manuale Completo PDF</M3Typography>
                        <M3Typography variant="body-medium" style={{ opacity: "0.7" }}>
                            Scarica il manuale PDF aggiornato alla versione 4.1.0 con la guida al Centro Operativo e le specifiche tecniche.
                        </M3Typography>
                    </div>
                </div>
                <div style={{ width: 'var(--app-layout-full)' }}>
                    <M3Button onClick={onGenerate} disabled={isGenerating} variant="filled" style={{
                        fontSize: 'var(--md-sys-typescale--font-size)',
                        textTransform: "uppercase",
                        letterSpacing: "var(--md-sys-typescale-label-large-tracking)",
                        marginTop: 'var(--app-spacing-container)'
                    }}>
                        <span style={{ marginRight: 'var(--app-spacing-component)' }}>
                            {isGenerating ? 'pending' : 'download'}
                        </span>
                        {isGenerating ? 'Generazione...' : 'Scarica Manuale & Guida PDF'}
                    </M3Button>
                </div>
            </div>
        </div>
    );
};
