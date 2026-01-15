// LEGACY - MD3 Non-compliant

import React from 'react';
import { SyncConflictData } from '../types';
import { M3Dialog, M3DialogContent, M3DialogActions, M3Button, InfoCard } from './ui';
import { useTheme } from '../theme/theme';

interface SyncConflictModalProps {
    data: SyncConflictData;
    onRestore: () => void;
    onIgnore: () => void;
}

const SyncConflictModal: React.FC<SyncConflictModalProps> = ({ data, onRestore, onIgnore }) => {
  const { layers } = useTheme();
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
            <M3DialogContent style={{ backgroundColor: sys.colors.[var(--md-sys-color-surface-container-high)]/30 }}>
                <div style={{display: "flex", flexDirection: "column", gap: layers.ref.spacing['6'], paddingTop: layers.ref.spacing['4'], paddingBottom: layers.ref.spacing['4']}}>
                    <div style={{display: "flex", flexDirection: "column", gap: layers.ref.spacing['6']}}>
                        {/* LOCAL CARD */}
                        <div className={`p-8 rounded-[var(--md-sys-shape-corner-extra-large)] border flex justify-between items-center transition-all ${!isRemoteNewer ? 'bg-secondary-container border-secondary shadow-sm scale-[1.02]' : 'bg-[var(--md-sys-color-surface-container-low)]est border-[var(--md-sys-color-outline-variant)]/30 opacity-70'}`}>
                            <div>
                                <p style={{fontSize: "0.75rem", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: layers.ref.spacing['4'], display: "flex", alignItems: "center", gap: layers.ref.spacing['4']}}>
                                    <span  style={{ fontSize: "0.875rem" }}>devices</span>
                                    Dati Locali (Attuali)
                                </p>
                                <p style={{ color: sys.colors.[var(--md-sys-color-on-surface)] }} style={{ fontSize: "0.875rem", fontWeight: "900" }}>
                                    {localDate ? localDate.toLocaleString() : 'Nessun dato'}
                                </p>
                            </div>
                            {!isRemoteNewer && <span style={{ color: sys.colors.[10px] }} style={{backgroundColor: "layers.sys.colors.secondary", color: "layers.sys.colors.on-secondary", paddingLeft: layers.ref.spacing['4'], paddingRight: layers.ref.spacing['4'], borderRadius: ref.spacing[9999], fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.05em"}}>Più Recente</span>}
                        </div>

                        {/* DIRECTION ARROW */}
                        <div  style={{ display: "flex", justifyContent: "center" }}>
                            <div style={{ backgroundColor: sys.colors.[var(--md-sys-color-surface-container-high)] }} style={{borderRadius: ref.spacing[9999], padding: layers.ref.spacing['8'], color: "layers.sys.colors.primary"}}>
                                <span  style={{ display: "block" }}>sync_problem</span>
                            </div>
                        </div>

                        {/* REMOTE CARD */}
                        <div className={`p-8 rounded-[var(--md-sys-shape-corner-extra-large)] border flex justify-between items-center transition-all ${isRemoteNewer ? 'bg-primary-container border-primary shadow-[var(--md-sys-elevation-level2)] scale-[1.02]' : 'bg-[var(--md-sys-color-surface-container-low)]est border-[var(--md-sys-color-outline-variant)]/30 opacity-80'}`}>
                            <div>
                                <p style={{fontSize: "0.75rem", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: layers.ref.spacing['4'], display: "flex", alignItems: "center", gap: layers.ref.spacing['4']}}>
                                    <span  style={{ fontSize: "0.875rem" }}>cloud</span>
                                    Cloud (Drive)
                                </p>
                                <p  style={{fontSize: "0.875rem", fontWeight: "900", color: "layers.sys.colors.primary"}}>
                                    {remoteDate.toLocaleString()}
                                </p>
                            </div>
                            {isRemoteNewer && <span style={{ color: sys.colors.[10px] }} style={{backgroundColor: "layers.sys.colors.primary", color: "layers.sys.colors.on-primary", paddingLeft: layers.ref.spacing['4'], paddingRight: layers.ref.spacing['4'], borderRadius: ref.spacing[9999], fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.05em"}}>Consigliato</span>}
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
                    <span  style={{ marginRight: "0.5rem" }}>download</span>
                    Sincronizza dal Cloud
                </M3Button>
            </M3DialogActions>
        </M3Dialog>
    );
};

export default SyncConflictModal;



