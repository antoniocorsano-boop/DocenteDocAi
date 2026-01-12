
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
            <M3DialogContent className="bg-[var(--md-sys-color-surface-container-high)]/30 backdrop-blur-sm">
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--md-sys-spacing-6)", paddingTop: "var(--md-sys-spacing-4)", paddingBottom: "var(--md-sys-spacing-4)" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "var(--md-sys-spacing-6)" }}>
                        {/* LOCAL CARD */}
                        <div className={`p-8 rounded-[var(--md-sys-shape-corner-extra-large)] border flex justify-between items-center transition-all ${!isRemoteNewer ? 'bg-secondary-container border-secondary shadow-sm scale-[1.02]' : 'bg-[var(--md-sys-color-surface-container-low)]est border-[var(--md-sys-color-outline-variant)]/30 opacity-70'}`}>
                            <div>
                                <p style={{ fontSize: "0.75rem", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "var(--md-sys-spacing-4)", display: "flex", alignItems: "center", gap: "var(--md-sys-spacing-4)" }}>
                                    <span className="material-symbols-outlined" style={{ fontSize: "0.875rem" }}>devices</span>
                                    Dati Locali (Attuali)
                                </p>
                                <p className="font-mono text-[var(--md-sys-color-on-surface)]" style={{ fontSize: "0.875rem", fontWeight: "900" }}>
                                    {localDate ? localDate.toLocaleString() : 'Nessun dato'}
                                </p>
                            </div>
                            {!isRemoteNewer && <span className="text-[10px] py-1 shadow-sm" style={{ backgroundColor: "var(--md-sys-color-secondary)", color: "var(--md-sys-color-on-secondary)", paddingLeft: "var(--md-sys-spacing-4)", paddingRight: "var(--md-sys-spacing-4)", borderRadius: "9999px", fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.05em" }}>Più Recente</span>}
                        </div>

                        {/* DIRECTION ARROW */}
                        <div className="-my-3 relative z-10" style={{ display: "flex", justifyContent: "center" }}>
                            <div className="bg-[var(--md-sys-color-surface-container-high)] border-2 border-surface shadow-sm" style={{ borderRadius: "9999px", padding: "var(--md-sys-spacing-8)", color: "var(--md-sys-color-primary)" }}>
                                <span className="material-symbols-outlined" style={{ display: "block" }}>sync_problem</span>
                            </div>
                        </div>

                        {/* REMOTE CARD */}
                        <div className={`p-8 rounded-[var(--md-sys-shape-corner-extra-large)] border flex justify-between items-center transition-all ${isRemoteNewer ? 'bg-primary-container border-primary shadow-[var(--md-sys-elevation-level2)] scale-[1.02]' : 'bg-[var(--md-sys-color-surface-container-low)]est border-[var(--md-sys-color-outline-variant)]/30 opacity-80'}`}>
                            <div>
                                <p style={{ fontSize: "0.75rem", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "var(--md-sys-spacing-4)", display: "flex", alignItems: "center", gap: "var(--md-sys-spacing-4)" }}>
                                    <span className="material-symbols-outlined" style={{ fontSize: "0.875rem" }}>cloud</span>
                                    Cloud (Drive)
                                </p>
                                <p className="font-mono" style={{ fontSize: "0.875rem", fontWeight: "900", color: "var(--md-sys-color-primary)" }}>
                                    {remoteDate.toLocaleString()}
                                </p>
                            </div>
                            {isRemoteNewer && <span className="text-[10px] py-1 shadow-sm" style={{ backgroundColor: "var(--md-sys-color-primary)", color: "var(--md-sys-color-on-primary)", paddingLeft: "var(--md-sys-spacing-4)", paddingRight: "var(--md-sys-spacing-4)", borderRadius: "9999px", fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.05em" }}>Consigliato</span>}
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
                    <span className="material-symbols-outlined" style={{ marginRight: "0.5rem" }}>download</span>
                    Sincronizza dal Cloud
                </M3Button>
            </M3DialogActions>
        </M3Dialog>
    );
};

export default SyncConflictModal;


