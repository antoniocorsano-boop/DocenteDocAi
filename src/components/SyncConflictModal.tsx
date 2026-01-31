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
                <div style={{display: "flex", flexDirection: "column", gap: 'var(--md-sys-spacing-6)', paddingTop: 'var(--md-sys-spacing-4)', paddingBottom: 'var(--md-sys-spacing-4)'}}>
                    <div style={{display: "flex", flexDirection: "column", gap: 'var(--md-sys-spacing-6)'}}>
                        {/* LOCAL CARD */}
                                                <div
                                                    style={{
                                                        padding: 'var(--md-sys-spacing-8)',
                                                        borderRadius: 'var(--md-sys-shape-corner-extra-large)',
                                                        border: 'var(--md-sys-border-width-normal) solid var(--md-sys-color-outline)',
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center',
                                                        backgroundColor: !isRemoteNewer ? 'var(--md-sys-color-secondary-container)' : 'var(--md-sys-color-surface-container-low)',
                                                        boxShadow: !isRemoteNewer ? 'var(--md-sys-elevation-level1)' : undefined,
                                                        opacity: !isRemoteNewer ? 1 : 0.7,
                                                        transform: !isRemoteNewer ? 'scale(1.02)' : undefined,
                                                        transition: 'opacity, transform, background-color, color, border-color, box-shadow var(--md-sys-motion-duration-medium) var(--md-sys-motion-easing-standard)',
                                                    }}
                                                >
                            <div>
                                <p style={{fontSize: 'var(--md-sys-typescale-label-large-font-size)', fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 'var(--md-sys-spacing-4)', display: "flex", alignItems: "center", gap: 'var(--md-sys-spacing-4)'}}>
                                    <span style={{ fontSize: 'var(--md-sys-typescale-body-large-font-size)', fontFamily: 'Material Symbols Outlined' }}>devices</span>
                                    Dati Locali (Attuali)
                                </p>
                                <p style={{ color: 'var(--md-sys-color-on-primary)', fontSize: 'var(--md-sys-typescale-body-large-font-size)', fontWeight: "900" }}>
                                    {localDate ? localDate.toLocaleString() : 'Nessun dato'}
                                </p>
                            </div>
                            {!isRemoteNewer && <span style={{backgroundColor: "var(--md-sys-color-secondary)", color: "var(--md-sys-color-on-secondary-container)", paddingLeft: 'var(--md-sys-spacing-4)', paddingRight: 'var(--md-sys-spacing-4)', borderRadius: 'var(--md-sys-spacing-2)', fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.05em"}}>Più Recente</span>}
                        </div>

                        {/* DIRECTION ARROW */}
                        <div  style={{ display: "flex", justifyContent: "center" }}>
                            <div style={{ backgroundColor: 'var(--md-sys-color-surface-container-high)', borderRadius: 'var(--md-sys-spacing-2)', padding: 'var(--md-sys-spacing-8)', color: "var(--md-sys-color-primary)" }}>
                                <span style={{ display: "block", fontFamily: 'Material Symbols Outlined' }}>sync_problem</span>
                            </div>
                        </div>

                        {/* REMOTE CARD */}
                                                <div
                                                    style={{
                                                        padding: 'var(--md-sys-spacing-8)',
                                                        borderRadius: 'var(--md-sys-shape-corner-extra-large)',
                                                        border: 'var(--md-sys-border-width-normal) solid var(--md-sys-color-outline)',
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center',
                                                        backgroundColor: isRemoteNewer ? 'var(--md-sys-color-primary-container)' : 'var(--md-sys-color-surface-container-low)',
                                                        boxShadow: isRemoteNewer ? 'var(--md-sys-elevation-level2)' : undefined,
                                                        opacity: isRemoteNewer ? 0.8 : 1,
                                                        transform: isRemoteNewer ? 'scale(1.02)' : undefined,
                                                        transition: 'opacity, transform, background-color, color, border-color, box-shadow var(--md-sys-motion-duration-medium) var(--md-sys-motion-easing-standard)',
                                                    }}
                                                >
                            <div>
                                <p style={{fontSize: 'var(--md-sys-typescale-label-large-font-size)', fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 'var(--md-sys-spacing-4)', display: "flex", alignItems: "center", gap: 'var(--md-sys-spacing-4)'}}>
                                    <span style={{ fontSize: 'var(--md-sys-typescale-body-large-font-size)', fontFamily: 'Material Symbols Outlined' }}>cloud</span>
                                    Cloud (Drive)
                                </p>
                                <p  style={{fontSize: 'var(--md-sys-typescale-body-large-font-size)', fontWeight: "900", color: "var(--md-sys-color-primary)"}}>
                                    {remoteDate.toLocaleString()}
                                </p>
                            </div>
                            {isRemoteNewer && <span style={{backgroundColor: "var(--md-sys-color-primary)", color: "var(--md-sys-color-on-primary)", paddingLeft: 'var(--md-sys-spacing-4)', paddingRight: 'var(--md-sys-spacing-4)', borderRadius: 'var(--md-sys-spacing-2)', fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.05em"}}>Consigliato</span>}
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
                    <span style={{ marginRight: 'var(--md-sys-spacing-2)', fontFamily: 'Material Symbols Outlined' }}>download</span>
                    Sincronizza dal Cloud
                </M3Button>
            </M3DialogActions>
        </M3Dialog>
    );
};

export default SyncConflictModal;








