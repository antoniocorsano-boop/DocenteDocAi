// HelpModal - Guide Tab
import React from 'react';
import { M3Typography } from '../../ui';

export const GuideTab: React.FC = () => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--app-spacing-container)' }}>
            <M3Typography variant="headline-small">Guida Rapida al Flusso di Lavoro</M3Typography>
            <div style={{
                display: "grid",
                gridTemplateColumns: "var(--md-sys-grid-fr-1)",
                gap: 'var(--md-sys-spacing-8)',
                marginTop: 'var(--app-spacing-section)'
            }}>
                <div style={{
                    backgroundColor: 'var(--md-sys-color-surface-container-low)',
                    borderRadius: 'var(--md-sys-shape-corner-large)',
                    borderLeft: "var(--app-border-medium) solid var(--app-color-primary)",
                    padding: 'var(--app-spacing-container)'
                }}>
                    <M3Typography variant="button-primary" style={{ color: 'var(--app-color-primary)' }}>
                        1. Centro Operativo
                    </M3Typography>
                    <M3Typography variant="body-medium" style={{ lineHeight: "1.625", opacity: "0.8" }}>
                        Tutto parte dall'icona <strong>Fulmine (⚡)</strong> in alto. Lì trovi i processi divisi per "Quotidianità" (Aula) e "Progettazione" (Strategia).
                    </M3Typography>
                </div>
                <div style={{
                    backgroundColor: 'var(--md-sys-color-surface-container-low)',
                    borderRadius: 'var(--md-sys-shape-corner-large)',
                    borderLeft: "var(--app-border-medium) solid var(--app-color-secondary)",
                    padding: 'var(--app-spacing-container)'
                }}>
                    <M3Typography variant="button-primary" style={{ color: 'var(--app-color-secondary)' }}>
                        2. Progettazione Intelligente
                    </M3Typography>
                    <M3Typography variant="body-medium" style={{ lineHeight: "1.625", opacity: "0.8" }}>
                        Carica i tuoi PDF nella <strong>Knowledge Base</strong>. Usa il <strong>Wizard Annuale</strong> nel Centro Operativo per creare percorsi didattici.
                    </M3Typography>
                </div>
                <div style={{
                    backgroundColor: 'var(--md-sys-color-surface-container-low)',
                    borderRadius: 'var(--md-sys-shape-corner-large)',
                    borderLeft: "var(--app-border-medium) solid var(--md-sys-color-tertiary)",
                    padding: 'var(--app-spacing-container)'
                }}>
                    <M3Typography variant="button-primary" style={{ color: 'var(--md-sys-color-tertiary)' }}>
                        3. In Aula (Continuità)
                    </M3Typography>
                    <M3Typography variant="body-medium" style={{ lineHeight: "1.625", opacity: "0.8" }}>
                        Quando apri una lezione, vedrai automaticamente il riepilogo della lezione precedente per riprendere il filo.
                    </M3Typography>
                </div>
                <div style={{
                    backgroundColor: 'var(--md-sys-color-surface-container-low)',
                    borderRadius: 'var(--md-sys-shape-corner-large)',
                    borderLeft: "var(--app-border-medium) solid var(--md-sys-color-error)",
                    padding: 'var(--app-spacing-container)'
                }}>
                    <M3Typography variant="button-primary" style={{ color: 'var(--md-sys-color-error)' }}>
                        4. Analisi & Report
                    </M3Typography>
                    <M3Typography variant="body-medium" style={{ lineHeight: "1.625", opacity: "0.8" }}>
                        Prima dei consigli di classe, visita l'<strong>Analytics Hub</strong> per avere grafici chiari. Genera poi il PDF del verbale con un click.
                    </M3Typography>
                </div>
            </div>
        </div>
    );
};
