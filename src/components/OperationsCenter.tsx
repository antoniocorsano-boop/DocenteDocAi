import React, { useState, useMemo } from 'react';
import { View, Studente, TimetableSettings, Valutazione, ValutazioneCompetenza, RegisterEntry } from '../types';
import { ActionTile, SectionHeader } from './M3Components';
import { M3Dialog } from './M3Dialog';

interface OperationsCenterProps {
    onClose: () => void;
    onNavigate: (view: View, context?: unknown) => void;
    onAction: (action: string) => void;
    activeSuggestion?: string | null;
    students?: Studente[];
    settings?: TimetableSettings;
    evaluations?: Valutazione[];
    competencyEvaluations?: ValutazioneCompetenza[];
    register?: RegisterEntry[];
    onPromoteStudents?: (promotedStudents: Studente[], archiveYear: string) => void;
    onBackupData?: () => Promise<void>;
    onResetData?: () => void;
}

interface ProcessDef {
    id: string;
    title: string;
    subtitle: string;
    description: string;
    icon: string;
    steps: { title: string; desc: string }[];
    variant: 'primary' | 'secondary' | 'tertiary' | 'surface';
    category: 'daily' | 'planning' | 'system';
    actionType: 'navigate' | 'function' | 'modal';
    target: string; 
    payload?: unknown;
}

const PROCESS_DEFINITIONS: ProcessDef[] = [
    {
        id: 'live_assistant',
        title: 'Assistente Live',
        subtitle: 'Copilota vocale 2.0',
        description: 'Avvia una sessione vocale con l\'AI per gestire la classe, dettare note o chiedere informazioni senza interrompere la lezione.',
        icon: 'mic',
        steps: [
            { title: 'Ascolto', desc: 'L\'AI ascolta i tuoi comandi vocali.' },
            { title: 'Esecuzione', desc: 'Voti e note vengono trascritti e salvati.' }
        ],
        variant: 'tertiary',
        category: 'daily',
        actionType: 'function',
        target: 'live-assistant'
    },
    {
        id: 'video_generation',
        title: 'Video Analysis',
        subtitle: 'Modello Veo Preview',
        description: 'Genera video didattici in alta risoluzione partendo da un prompt testuale o una sequenza di immagini.',
        icon: 'movie',
        steps: [
            { title: 'Prompt', desc: 'Descrivi la scena da generare.' },
            { title: 'Render', desc: 'L\'AI genera un video MP4 ad alta qualità.' }
        ],
        variant: 'secondary',
        category: 'planning',
        actionType: 'function',
        target: 'video-analysis'
    },
    {
        id: 'annual_wizard',
        title: 'Wizard Annuale',
        subtitle: 'Calendario UDA',
        description: 'Pianifica l\'intero anno scolastico in 5 minuti. Definisci le Unità di Apprendimento e distribuiscile automaticamente nel calendario.',
        icon: 'calendar_month',
        steps: [
            { title: 'Argomenti', desc: 'Indica cosa vuoi insegnare.' },
            { title: 'Gantt', desc: 'Visualizza la scansione temporale delle UDA.' }
        ],
        variant: 'primary',
        category: 'planning',
        actionType: 'navigate',
        target: 'progettazione-hub',
        payload: { action: 'annual-planning' }
    },
    {
        id: 'import_students',
        title: 'Importa Studenti',
        subtitle: 'Configurazione rapida',
        description: 'Carica gli elenchi classe partendo da un file Excel o CSV. L\'AI ti aiuterà a mappare correttamente le colonne.',
        icon: 'group_add',
        steps: [
            { title: 'File', desc: 'Seleziona il file .csv o .xlsx.' },
            { title: 'Mapping', desc: 'Associa Nomi e Cognomi.' }
        ],
        variant: 'surface',
        category: 'system',
        actionType: 'navigate',
        target: 'studenti'
    },
    {
        id: 'setup_timetable',
        title: 'Configura Orario',
        subtitle: 'Struttura settimanale',
        description: 'Definisci la tua matrice oraria stabile per velocizzare la registrazione delle lezioni.',
        icon: 'edit_calendar',
        steps: [
            { title: 'Grid', desc: 'Clicca sugli slot.' },
            { title: 'Assign', desc: 'Classe e Materia.' }
        ],
        variant: 'surface',
        category: 'system',
        actionType: 'navigate',
        target: 'timetable'
    },
    {
        id: 'load_demo',
        title: 'Carica Demo',
        subtitle: 'Dati di prova',
        description: 'Popola l\'app con classi, studenti e documenti di esempio per testare le funzionalità.',
        icon: 'dataset',
        steps: [
            { title: 'Caricamento', desc: 'Generazione dati.' },
            { title: 'Pronto', desc: 'Esplora l\'app.' }
        ],
        variant: 'surface',
        category: 'system',
        actionType: 'function',
        target: 'load-demo'
    },
    {
        id: 'year_transition',
        title: 'Passaggio Anno',
        subtitle: 'Promozione Classi',
        description: 'Procedura guidata per chiudere l\'anno scolastico corrente, archiviare i dati e promuovere gli studenti alla classe successiva.',
        icon: 'move_up',
        steps: [
            { title: 'Backup', desc: 'Salvataggio stato attuale.' },
            { title: 'Reset', desc: 'Pulizia voti e lezioni.' },
            { title: 'Promozione', desc: '1A -> 2A (o Archivio).' }
        ],
        variant: 'secondary',
        category: 'system',
        actionType: 'modal',
        target: 'year-transition-modal'
    }
];

const OperationsCenter: React.FC<OperationsCenterProps> = ({ 
    onClose, onNavigate, onAction, activeSuggestion
}) => {
    const [selectedProcess, setSelectedProcess] = useState<ProcessDef | null>(null);

    const handleProcessStart = (p?: ProcessDef) => {
        const process = p || selectedProcess;
        if (!process) return;
        
        if (process.actionType === 'navigate') {
            onNavigate(process.target as View, process.payload);
            onClose();
        } else {
            onAction(process.target);
            onClose();
        }
    };

    const suggestedProcess = useMemo(() => {
        if (!activeSuggestion) return null;
        const idToSearch = typeof activeSuggestion === 'string' ? activeSuggestion : (typeof activeSuggestion === 'object' && activeSuggestion !== null && 'id' in activeSuggestion ? (activeSuggestion as { id: string }).id : undefined);
        return PROCESS_DEFINITIONS.find(p => p.id === idToSearch);
    }, [activeSuggestion]);

    const renderProcessDetail = () => {
        if (!selectedProcess) return null;
        return (
            <>
                <div className="process-detail-header text-center mb-8">
                    <div className={`process-detail-icon-large mx-auto mb-4 bg-${selectedProcess.variant}-container text-on-${selectedProcess.variant}-container shadow-xl w-24 h-24 rounded-[40px] flex items-center justify-center`}>
                        <span className="material-symbols-outlined text-4xl">{selectedProcess.icon}</span>
                    </div>
                    <h2 className="m3-headline-medium font-black">{selectedProcess.title}</h2>
                    <p className="m3-body-large text-on-surface-variant max-w-md mx-auto mt-2 opacity-80">{selectedProcess.description}</p>
                </div>
                <div className="flex-grow overflow-y-auto px-4 mb-8">
                    <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-primary mb-6">Fasi del Processo</h3>
                    <div className="process-timeline border-l-2 border-outline-variant ml-4 pl-8 space-y-8">
                        {selectedProcess.steps.map((step, idx) => (
                            <div key={idx} className="relative">
                                <div className="absolute -left-[41px] top-0 w-6 h-6 rounded-full bg-surface border-4 border-primary shadow-sm"></div>
                                <h4 className="font-black text-on-surface">{step.title}</h4>
                                <p className="m3-body-medium text-on-surface-variant">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="flex gap-4">
                    <button onClick={() => setSelectedProcess(null)} className="button button-text flex-grow justify-center font-bold">Indietro</button>
                    <button onClick={() => handleProcessStart()} className="button button-filled flex-grow-[2] justify-center shadow-lg font-black">AVVIA ORA</button>
                </div>
            </>
        );
    };

    return (
        <M3Dialog
            title={selectedProcess ? 'Dettaglio Processo' : 'Centro Operativo'}
            onClose={onClose}
            mode="fullscreen"
            headerContent={
                <div className="px-6 py-4 md:py-6 border-b border-outline-variant/10 flex justify-between items-center shrink-0">
                    <div>
                        <h2 className="m3-headline-small font-black flex items-center gap-3">
                            <span className="material-symbols-outlined text-primary filled-icon text-3xl">bolt</span>
                            {selectedProcess ? 'Dettaglio Processo' : 'Centro Operativo'}
                        </h2>
                    </div>
                    <button onClick={onClose} className="icon-button">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>
            }
        >
            <div className="bg-surface-container-lowest overflow-y-auto no-scrollbar" style={{ padding: 'clamp(12px, 3vw, 32px)' }}>
                    {selectedProcess ? renderProcessDetail() : (
                        <div className="space-y-10">
                            {suggestedProcess && (
                                <div className="p-6 rounded-[32px] bg-tertiary-container/20 border border-tertiary/20 flex items-center gap-5 mb-8 animate-in slide-in-from-top-4 shadow-lg">
                                    <div className="w-16 h-16 rounded-full bg-tertiary text-on-tertiary flex items-center justify-center flex-shrink-0 shadow-md">
                                        <span className="material-symbols-outlined text-3xl">lightbulb</span>
                                    </div>
                                    <div className="flex-grow">
                                        <h3 className="m3-headline-small font-black text-tertiary">Suggerimento AI</h3>
                                        <p className="m3-body-large text-on-tertiary-container opacity-90">{suggestedProcess.description}</p>
                                    </div>
                                    <button onClick={() => setSelectedProcess(suggestedProcess)} className="button button-filled !bg-white text-tertiary !h-12 !px-6 font-black shadow-md flex-shrink-0">
                                        AVVIA <span className="material-symbols-outlined ml-2">arrow_forward</span>
                                    </button>
                                </div>
                            )}

                            <SectionHeader title="Processi Comuni" icon="play_circle" />
                            <div className="expressive-grid">
                                {PROCESS_DEFINITIONS.filter(p => p.category === 'daily').map(p => (
                                    <ActionTile 
                                        key={p.id}
                                        title={p.title}
                                        subtitle={p.subtitle}
                                        icon={p.icon}
                                        variant={p.variant}
                                        onClick={() => setSelectedProcess(p)}
                                        className="h-full !rounded-[32px] shadow-sm hover:shadow-lg transition-shadow"
                                    />
                                ))}
                            </div>

                            <SectionHeader title="Pianificazione e Sviluppo" icon="design_services" />
                            <div className="expressive-grid">
                                {PROCESS_DEFINITIONS.filter(p => p.category === 'planning').map(p => (
                                    <ActionTile 
                                        key={p.id}
                                        title={p.title}
                                        subtitle={p.subtitle}
                                        icon={p.icon}
                                        variant={p.variant}
                                        onClick={() => setSelectedProcess(p)}
                                        className="h-full !rounded-[32px] shadow-sm hover:shadow-lg transition-shadow"
                                    />
                                ))}
                            </div>

                            <SectionHeader title="Manutenzione del Sistema" icon="build" />
                            <div className="expressive-grid">
                                {PROCESS_DEFINITIONS.filter(p => p.category === 'system').map(p => (
                                    <ActionTile 
                                        key={p.id}
                                        title={p.title}
                                        subtitle={p.subtitle}
                                        icon={p.icon}
                                        variant={p.variant}
                                        onClick={() => setSelectedProcess(p)}
                                        className="h-full !rounded-[32px] shadow-sm hover:shadow-lg transition-shadow"
                                    />
                                ))}
                            </div>
                        </div>
                    )}
            </div>
        </M3Dialog>
    );
};
export default OperationsCenter;
