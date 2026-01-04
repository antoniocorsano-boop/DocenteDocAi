
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
            <M3DialogContent className="bg-surface-container-high/30 backdrop-blur-sm">
                <div className="flex flex-col gap-6 py-2">
                    <div className="flex flex-col gap-3">
                        {/* LOCAL CARD */}
                        <div className={`p-4 rounded-3xl border flex justify-between items-center transition-all ${!isRemoteNewer ? 'bg-secondary-container border-secondary shadow-sm scale-[1.02]' : 'bg-surface-container-lowest border-outline-variant/30 opacity-70'}`}>
                            <div>
                                <p className="text-xs font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
                                    <span className="material-symbols-outlined text-sm">devices</span>
                                    Dati Locali (Attuali)
                                </p>
                                <p className="font-mono text-sm font-black text-on-surface">
                                    {localDate ? localDate.toLocaleString() : 'Nessun dato'}
                                </p>
                            </div>
                            {!isRemoteNewer && <span className="text-[10px] bg-secondary text-on-secondary px-2 py-1 rounded-full font-black shadow-sm uppercase tracking-wider">Più Recente</span>}
                        </div>

                        {/* DIRECTION ARROW */}
                        <div className="flex justify-center -my-3 relative z-10">
                            <div className="bg-surface-container-high rounded-full p-2 border-2 border-surface shadow-sm text-primary">
                                <span className="material-symbols-outlined block">sync_problem</span>
                            </div>
                        </div>

                        {/* REMOTE CARD */}
                        <div className={`p-4 rounded-3xl border flex justify-between items-center transition-all ${isRemoteNewer ? 'bg-primary-container border-primary shadow-lg scale-[1.02]' : 'bg-surface-container-lowest border-outline-variant/30 opacity-80'}`}>
                            <div>
                                <p className="text-xs font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
                                    <span className="material-symbols-outlined text-sm">cloud</span>
                                    Cloud (Drive)
                                </p>
                                <p className="font-mono text-sm font-black text-primary">
                                    {remoteDate.toLocaleString()}
                                </p>
                            </div>
                            {isRemoteNewer && <span className="text-[10px] bg-primary text-on-primary px-2 py-1 rounded-full font-black shadow-sm uppercase tracking-wider">Consigliato</span>}
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
                    <span className="material-symbols-outlined mr-2">download</span>
                    Sincronizza dal Cloud
                </M3Button>
            </M3DialogActions>
        </M3Dialog>
    );
};

export default SyncConflictModal;
