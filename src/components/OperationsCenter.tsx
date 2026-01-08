import React, { useState, useMemo } from 'react';
import { View, Studente, TimetableSettings, Valutazione, ValutazioneCompetenza, RegisterEntry } from '../types';
import { ActionTile, SectionHeader, M3Dialog, M3DialogContent, M3Button } from './ui';

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
        subtitle: 'Copilota Vocale',
        description: 'Comandi vocali per gestire la classe senza interrompere la lezione.',
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
        subtitle: 'Veo AI',
        description: 'Genera video didattici da prompt testuali o immagini.',
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
        id: 'nka_map',
        title: 'Mappa Neurale',
        subtitle: 'Knowledge Map',
        description: 'Visualizza i collegamenti tra lezioni e concetti chiave.',
        icon: 'hub',
        steps: [
            { title: 'Analisi', desc: 'L\'AI mappa i concetti chiave.' },
            { title: 'Grafico', desc: 'Visualizza i nodi e le connessioni.' }
        ],
        variant: 'primary',
        category: 'planning',
        actionType: 'function',
        target: 'nka-map'
    },
    {
        id: 'annual_wizard',
        title: 'Wizard Annuale',
        subtitle: 'Piano UDA',
        description: 'Pianifica l\'anno scolastico e distribuisci le UDA nel calendario.',
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
        subtitle: 'Setup Rapido',
        description: 'Carica elenchi classe da file Excel o CSV.',
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
        subtitle: 'Grid Settimanale',
        description: 'Definisci la matrice oraria per velocizzare il registro.',
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
        subtitle: 'Test Data',
        description: 'Popola l\'app con dati di esempio per test rapidi.',
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
        subtitle: 'Promozioni',
        description: 'Chiudi l\'anno, archivia dati e promuovi gli studenti.',
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
            <div className="flex flex-col h-full">
                <div className="process-detail-header text-center mb-8">
                    <div className={`process-detail-icon-large mx-auto mb-8 bg-${selectedProcess.variant}-container text-on-${selectedProcess.variant}-container shadow-[var(--md-sys-elevation-level3)] w-24 h-24 rounded-4xl flex items-center justify-center`}>
                        <span className="material-symbols-outlined text-4xl">{selectedProcess.icon}</span>
                    </div>
                    <h2 className="m3-headline-medium font-black">{selectedProcess.title}</h2>
                    <p className="text-[var(--md-sys-typescale-body-large)] font-[var(--md-sys-typescale-body-large-font)] text-[var(--md-sys-color-on-surface)]-variant max-w-md mx-auto mt-4 opacity-80">{selectedProcess.description}</p>
                </div>
                <div className="flex-grow overflow-y-auto px-4 mb-8 custom-scrollbar">
                    <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-primary mb-6">Fasi del Processo</h3>
                    <div className="process-timeline border-l-2 border-[var(--md-sys-color-outline-variant)] ml-4 pl-8 space-y-8">
                        {selectedProcess.steps.map((step, idx) => (
                            <div key={idx} className="relative">
                                <div className="absolute -left-[41px] top-0 w-6 h-6 rounded-full bg-surface border-4 border-primary shadow-sm"></div>
                                <h4 className="font-black text-[var(--md-sys-color-on-surface)]">{step.title}</h4>
                                <p className="text-[var(--md-sys-typescale-body-medium)] font-[var(--md-sys-typescale-body-medium-font)] text-[var(--md-sys-color-on-surface)]-variant">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="flex gap-8 mt-auto">
                    <M3Button onClick={() => setSelectedProcess(null)} variant="text" className="flex-grow !h-14">Indietro</M3Button>
                    <M3Button onClick={() => handleProcessStart()} variant="filled" className="flex-grow-[2] !h-14 shadow-[var(--md-sys-elevation-level2)] font-black">AVVIA ORA</M3Button>
                </div>
            </div>
        );
    };

    return (
        <M3Dialog
            title={selectedProcess ? 'Dettaglio Processo' : 'Centro Operativo'}
            onClose={onClose}
            mode="fullscreen"
            level={1}
            hideBackdrop={true}
        >
            <M3DialogContent className="bg-[var(--md-sys-color-surface-container-low)]est p-6 md:p-10">
                    {selectedProcess ? renderProcessDetail() : (
                        <div className="space-y-10 max-w-5xl mx-auto">
                            {suggestedProcess && (
                                <div className="p-6 rounded-[var(--md-sys-shape-corner-large)] bg-tertiary-container/20 border border-tertiary/20 flex flex-col md:flex-row items-center gap-5 mb-8 animate-in slide-in-from-top-4 shadow-[var(--md-sys-elevation-level2)]">
                                    <div className="w-16 h-16 rounded-full bg-tertiary text-on-tertiary flex items-center justify-center flex-shrink-0 shadow-[var(--md-sys-elevation-level1)]">
                                        <span className="material-symbols-outlined text-3xl">lightbulb</span>
                                    </div>
                                    <div className="flex-grow text-center md:text-left">
                                        <h3 className="text-[var(--md-sys-typescale-headline-small)] font-[var(--md-sys-typescale-headline-small-font)] font-black text-tertiary">Suggerimento AI</h3>
                                        <p className="text-[var(--md-sys-typescale-body-large)] font-[var(--md-sys-typescale-body-large-font)] text-on-tertiary-container opacity-90">{suggestedProcess.description}</p>
                                    </div>
                                    <M3Button onClick={() => setSelectedProcess(suggestedProcess)} variant="filled" className="!bg-white !text-tertiary !h-12 !px-6 font-black shadow-[var(--md-sys-elevation-level1)] flex-shrink-0">
                                        AVVIA <span className="material-symbols-outlined ml-2">arrow_forward</span>
                                    </M3Button>
                                </div>
                            )}

                            <div className="space-y-8">
                                <div>
                                    <SectionHeader title="Processi Comuni" icon="play_circle" />
                                    <div className="expressive-grid mt-4">
                                        {PROCESS_DEFINITIONS.filter(p => p.category === 'daily').map(p => (
                                            <ActionTile 
                                                key={p.id}
                                                title={p.title}
                                                subtitle={p.subtitle}
                                                icon={p.icon}
                                                variant={p.variant}
                                                onClick={() => setSelectedProcess(p)}
                                                className="h-full !rounded-[var(--md-sys-shape-corner-large)] shadow-sm hover:shadow-[var(--md-sys-elevation-level2)] transition-shadow"
                                            />
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <SectionHeader title="Pianificazione e Sviluppo" icon="design_services" />
                                    <div className="expressive-grid mt-4">
                                        {PROCESS_DEFINITIONS.filter(p => p.category === 'planning').map(p => (
                                            <ActionTile 
                                                key={p.id}
                                                title={p.title}
                                                subtitle={p.subtitle}
                                                icon={p.icon}
                                                variant={p.variant}
                                                onClick={() => setSelectedProcess(p)}
                                                className="h-full !rounded-[var(--md-sys-shape-corner-large)] shadow-sm hover:shadow-[var(--md-sys-elevation-level2)] transition-shadow"
                                            />
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <SectionHeader title="Manutenzione del Sistema" icon="build" />
                                    <div className="expressive-grid mt-4">
                                        {PROCESS_DEFINITIONS.filter(p => p.category === 'system').map(p => (
                                            <ActionTile 
                                                key={p.id}
                                                title={p.title}
                                                subtitle={p.subtitle}
                                                icon={p.icon}
                                                variant={p.variant}
                                                onClick={() => setSelectedProcess(p)}
                                                className="h-full !rounded-[var(--md-sys-shape-corner-large)] shadow-sm hover:shadow-[var(--md-sys-elevation-level2)] transition-shadow"
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
            </M3DialogContent>
        </M3Dialog>
    );
};
export default OperationsCenter;
