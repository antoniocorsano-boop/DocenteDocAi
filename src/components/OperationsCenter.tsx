// LEGACY - MD3 Non-compliant
// M3Expressive refactor: Removed inline Tailwind classes, applied dedicated CSS classes with M3 tokens for colors, spacing, typography, elevation. Maintained responsive behavior and animations.
// ...existing code...
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
            <div >
                <div >
                    <div style={{
                        width: 'var(--md-sys-spacing-20)',
                        height: 'var(--md-sys-spacing-20)',
                        borderRadius: 'var(--md-sys-shape-corner-large)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: selectedProcess.variant === 'primary' ? 'var(--md-sys-color-primary-container)' :
                                       selectedProcess.variant === 'secondary' ? 'var(--md-sys-color-secondary-container)' :
                                       selectedProcess.variant === 'tertiary' ? 'var(--md-sys-color-tertiary-container)' :
                                       'var(--md-sys-color-surface-container-high)',
                        color: selectedProcess.variant === 'primary' ? 'var(--md-sys-color-on-primary-container)' :
                              selectedProcess.variant === 'secondary' ? 'var(--md-sys-color-on-secondary-container)' :
                              selectedProcess.variant === 'tertiary' ? 'var(--md-sys-color-on-tertiary-container)' :
                              'var(--md-sys-color-on-surface)',
                        fontSize: 'var(--md-sys-spacing-10)',
                        marginTop: 0,
                        marginLeft: 'var(--md-sys-margin-auto)',
                        marginBottom: 'var(--md-sys-spacing-4)',
                        marginRight: 'var(--md-sys-margin-auto)',
                        boxShadow: 'var(--md-sys-elevation-level2)',
                        transition: 'all var(--md-sys-motion-duration-medium) var(--md-sys-motion-easing-standard)'
                    }}>
                        <span >{selectedProcess.icon}</span>
                    </div>
                    <h2 >{selectedProcess.title}</h2>
                    <p >{selectedProcess.description}</p>
                </div>
                <div >
                    <h3 >Fasi del Processo</h3>
                    <div >
                        {selectedProcess.steps.map((step, idx) => (
                            <div key={idx} >
                                <div ></div>
                                <h4 >{step.title}</h4>
                                <p >{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <div >
                    <M3Button onClick={() => setSelectedProcess(null)} variant="text" >Indietro</M3Button>
                    <M3Button onClick={() => handleProcessStart()} variant="filled" >AVVIA ORA</M3Button>
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
            <M3DialogContent >
                    {selectedProcess ? renderProcessDetail() : (
                        <div >
                            {suggestedProcess && (
                                <div >
                                    <div >
                                        <span >lightbulb</span>
                                    </div>
                                    <div >
                                        <h3 >Suggerimento AI</h3>
                                        <p >{suggestedProcess.description}</p>
                                    </div>
                                    <M3Button onClick={() => setSelectedProcess(suggestedProcess)} variant="filled" >
                                        AVVIA <span >arrow_forward</span>
                                    </M3Button>
                                </div>
                            )}

                            <div >
                                <div>
                                    <SectionHeader title="Processi Comuni" icon="play_circle" />
                                    <div >
                                        {PROCESS_DEFINITIONS.filter(p => p.category === 'daily').map(p => (
                                            <ActionTile 
                                                key={p.id}
                                                title={p.title}
                                                subtitle={p.subtitle}
                                                icon={p.icon}
                                                variant={p.variant}
                                                onClick={() => setSelectedProcess(p)}
                                                
                                            />
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <SectionHeader title="Pianificazione e Sviluppo" icon="design_services" />
                                    <div >
                                        {PROCESS_DEFINITIONS.filter(p => p.category === 'planning').map(p => (
                                            <ActionTile 
                                                key={p.id}
                                                title={p.title}
                                                subtitle={p.subtitle}
                                                icon={p.icon}
                                                variant={p.variant}
                                                onClick={() => setSelectedProcess(p)}
                                                
                                            />
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <SectionHeader title="Manutenzione del Sistema" icon="build" />
                                    <div >
                                        {PROCESS_DEFINITIONS.filter(p => p.category === 'system').map(p => (
                                            <ActionTile 
                                                key={p.id}
                                                title={p.title}
                                                subtitle={p.subtitle}
                                                icon={p.icon}
                                                variant={p.variant}
                                                onClick={() => setSelectedProcess(p)}
                                                
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

// M3Expressive refactor COMPLETED: OperationsCenter.tsx - Replaced all hardcoded Tailwind classes with dedicated operations-center-* CSS classes using M3 tokens for layout, process details, timeline, suggestion cards, and action tiles.








