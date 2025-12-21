
import React from 'react';
import { SyncConflictData } from '../types';
import { M3Dialog } from './M3Components';

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
            isOpen={true}
            onClose={onIgnore}
            title="Conflitto Sincronizzazione"
            headline="Abbiamo trovato versioni diverse dei tuoi dati"
            buttons={
                <>
                    <button
                        onClick={onIgnore}
                        className="button button-text"
                    >
                        Matieni Locali
                    </button>
                    <button
                        onClick={onRestore}
                        className="button button-filled"
                    >
                        <span className="material-symbols-outlined mr-2">download</span>
                        Sincronizza dal Cloud
                    </button>
                </>
            }
            fullscreen={false}
        >
            <div className="flex flex-col gap-6 pt-2">
                <div className="flex flex-col gap-3">
                    {/* LOCAL CARD */}
                    <div className={`p-4 rounded-xl border flex justify-between items-center transition-all ${!isRemoteNewer ? 'bg-secondary-container border-secondary shadow-sm scale-[1.02]' : 'bg-surface border-outline-variant opacity-70'}`}>
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
                            <span className="material-symbols-outlined block">arrow_downward</span>
                        </div>
                    </div>

                    {/* REMOTE CARD */}
                    <div className={`p-4 rounded-xl border flex justify-between items-center transition-all ${isRemoteNewer ? 'bg-primary-container border-primary shadow-lg scale-[1.02]' : 'bg-surface border-outline-variant opacity-80'}`}>
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

                <div className="p-4 bg-surface-container-low rounded-xl border-l-4 border-error text-sm text-on-surface">
                    <p className="font-bold mb-1 flex items-center gap-2 text-error">
                        <span className="material-symbols-outlined text-lg">warning</span>
                        Attenzione
                    </p>
                    <p className="opacity-80">
                        Se scegli di sincronizzare dal Cloud, <span className="font-bold underline">i dati locali verranno sovrascritti</span> definitivamente.
                    </p>
                </div>
            </div>
        </M3Dialog>
    );
};

export default SyncConflictModal;
