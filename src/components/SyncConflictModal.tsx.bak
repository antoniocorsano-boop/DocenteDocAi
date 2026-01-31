// MD3 Compliant - Migration completed
// SyncConflictModal.tsx - All styling uses MD3 tokens via style props

import React from 'react';
import { SyncConflictData } from '../types';
import { M3Dialog, M3DialogContent, M3DialogActions, M3Button, InfoCard } from './ui';
interface SyncConflictModalProps {
    data: SyncConflictData;
    onRestore: () => void;
    onIgnore: () => void;
}

const SyncConflictModal: React.FC<SyncConflictModalProps> = ({ data, onRestore, onIgnore }) => {
  // Determina quale è più recente
    const isRemoteNewer = data.remoteTime > data.localTime;
    const remoteDate = new Date(data.remoteTime);
    const localDate = data.localTime ? new Date(data.localTime) : null;

    return (
        <M3Dialog
            onClose={onIgnore}
            title="Conflitto Sincronizzazione"
            maxWidth="sm"
            level={2}
        >
            <M3DialogContent style={{ backgroundColor: 'color-mix(in srgb, var(--md-sys-color-surface-container-high) var(--md-sys-percent-30), transparent)' }}>
                <div style={{display: "flex", flexDirection: "column", gap: 'var(--app-spacing-section)', paddingTop: 'var(--app-spacing-container)', paddingBottom: 'var(--app-spacing-container)'}}>
                    <div style={{display: "flex", flexDirection: "column", gap: 'var(--app-spacing-section)'}}>
                        {/* LOCAL CARD */}
                                                <div
                                                    style={{
                                                        padding: 'var(--md-sys-spacing-8)',
                                                        borderRadius: 'var(--md-sys-shape-corner-extra-large)',
                                                        border: 'var(--app-border-normal) solid var(--md-sys-color-outline)',
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center',
                                                        backgroundColor: !isRemoteNewer ? 'var(--app-color-secondary-container)' : 'var(--md-sys-color-surface-container-low)',
                                                        boxShadow: !isRemoteNewer ? 'var(--md-sys-elevation-level1)' : undefined,
                                                        opacity: !isRemoteNewer ? 1 : 0.7,
                                                        transform: !isRemoteNewer ? 'scale(1.02)' : undefined,
                                                        transition: 'opacity, transform, background-color, color, border-color, box-shadow var(--app-motion-standard) var(--app-easing-standard)',
                                                    }}
                                                >
                            <div>
                                <p style={{fontSize: 'var(--app-text-label)', fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 'var(--app-spacing-container)', display: "flex", alignItems: "center", gap: 'var(--app-spacing-container)'}}>
                                    <span style={{ fontSize: 'var(--app-text-body)', fontFamily: 'Material Symbols Outlined' }}>devices</span>
                                    Dati Locali (Attuali)
                                </p>
                                <p style={{ color: 'var(--app-color-on-primary)', fontSize: 'var(--app-text-body)', fontWeight: "900" }}>
                                    {localDate ? localDate.toLocaleString() : 'Nessun dato'}
                                </p>
                            </div>
                            {!isRemoteNewer && <span style={{backgroundColor: "var(--app-color-secondary)", color: "var(--app-color-on-secondary-container)", paddingLeft: 'var(--app-spacing-container)', paddingRight: 'var(--app-spacing-container)', borderRadius: 'var(--app-spacing-component)', fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.05em"}}>Più Recente</span>}
                        </div>

                        {/* DIRECTION ARROW */}
                        <div  style={{ display: "flex", justifyContent: "center" }}>
                            <div style={{ backgroundColor: 'var(--md-sys-color-surface-container-high)', borderRadius: 'var(--app-spacing-component)', padding: 'var(--md-sys-spacing-8)', color: "var(--app-color-primary)" }}>
                                <span style={{ display: "block", fontFamily: 'Material Symbols Outlined' }}>sync_problem</span>
                            </div>
                        </div>

                        {/* REMOTE CARD */}
                                                <div
                                                    style={{
                                                        padding: 'var(--md-sys-spacing-8)',
                                                        borderRadius: 'var(--md-sys-shape-corner-extra-large)',
                                                        border: 'var(--app-border-normal) solid var(--md-sys-color-outline)',
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center',
                                                        backgroundColor: isRemoteNewer ? 'var(--app-color-primary-container)' : 'var(--md-sys-color-surface-container-low)',
                                                        boxShadow: isRemoteNewer ? 'var(--md-sys-elevation-level2)' : undefined,
                                                        opacity: isRemoteNewer ? 0.8 : 1,
                                                        transform: isRemoteNewer ? 'scale(1.02)' : undefined,
                                                        transition: 'opacity, transform, background-color, color, border-color, box-shadow var(--app-motion-standard) var(--app-easing-standard)',
                                                    }}
                                                >
                            <div>
                                <p style={{fontSize: 'var(--app-text-label)', fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 'var(--app-spacing-container)', display: "flex", alignItems: "center", gap: 'var(--app-spacing-container)'}}>
                                    <span style={{ fontSize: 'var(--app-text-body)', fontFamily: 'Material Symbols Outlined' }}>cloud</span>
                                    Cloud (Drive)
                                </p>
                                <p  style={{fontSize: 'var(--app-text-body)', fontWeight: "900", color: "var(--app-color-primary)"}}>
                                    {remoteDate.toLocaleString()}
                                </p>
                            </div>
                            {isRemoteNewer && <span style={{backgroundColor: "var(--app-color-primary)", color: "var(--app-color-on-primary)", paddingLeft: 'var(--app-spacing-container)', paddingRight: 'var(--app-spacing-container)', borderRadius: 'var(--app-spacing-component)', fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.05em"}}>Consigliato</span>}
                        </div>
                    </div>

                    <InfoCard 
                        type="warning" 
                        message="Se scegli di sincronizzare dal Cloud, i dati locali verranno sovrascritti definitivamente." 
                    />
                </div>
            </M3DialogContent>
            <M3DialogActions>
                <M3Button onClick={onIgnore} variant="text">Mantieni Dati Locali</M3Button>
                <M3Button onClick={onRestore} variant="filled">
                    <span style={{ marginRight: 'var(--app-spacing-component)', fontFamily: 'Material Symbols Outlined' }}>download</span>
                    Sincronizza dal Cloud
                </M3Button>
            </M3DialogActions>
        </M3Dialog>
    );
};

export default SyncConflictModal;








