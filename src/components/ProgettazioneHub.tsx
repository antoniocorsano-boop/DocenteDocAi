// LEGACY - MD3 Non-compliant
/**
 * ProgettazioneHub.tsx
 * // M3Expressive refactor: Removed inline Tailwind classes, applied dedicated CSS classes with M3 tokens for layout, colors, spacing, and typography.
 */

import React, { useState, useEffect } from 'react';
import NotebookLMImportModal from './NotebookLMImportModal';
import TemplateManager from './TemplateManager';
import { KnowledgeBaseEntry } from '../types';
import { ProgettazioneHubProps, Uda, EventoCalendario, TimetableSettings, AiSettings, Report, Lezione, Competenza } from '../types';
import AnnualPlanningWizard from './AnnualPlanningWizard';
import SmartImportModal from './SmartImportModal';
import CompetencyManager from './CompetencyManager';
import { TabGroup, M3ExpressiveCard } from './ui';
import TimelineView from './TimelineView';
import UdaDetailModal from './UdaDetailModal';
import { useTheme } from '../theme/theme';

interface ProgettazioneHubExtendedProps extends ProgettazioneHubProps {
    udas: Uda[]; // Ensure `udas` is defined
    settings: TimetableSettings;
    aiSettings: AiSettings;
    onSaveUda: (uda: Uda) => void;
    onAddLessons: (lessons: Lezione[]) => void;
    onSaveReport: (report: Report) => void;
    onSaveEvent: (event: EventoCalendario) => void;
    initialAction?: string; 
    knowledgeBase: KnowledgeBaseEntry[];
    onUpdateCompetencies?: (competenze: Competenza[]) => void; // New prop for updating settings
    onUpdateKnowledgeBase?: (kb: KnowledgeBaseEntry[]) => void; // Add dispatcher for KB
    driveSyncState?: { isAuthenticated: boolean };
    onConnectDrive?: () => void;
}

const ProgettazioneHub: React.FC<ProgettazioneHubExtendedProps> = ({ 
    onNavigate, 
    udas, 
    events, 
    settings, 
    aiSettings, 
    onSaveUda, 
    onAddLessons, 
    onSaveReport, 
    onSaveEvent, 
    initialAction, 
    knowledgeBase, 
    students, 
    pianiInclusione, 
    onUpdateCompetencies, 
    onUpdateKnowledgeBase,
    driveSyncState,
    onConnectDrive
}) => {
  const { layers } = useTheme();
    const [isPlanningWizardOpen, setIsPlanningWizardOpen] = useState(false);
    const [isSmartImportOpen, setIsSmartImportOpen] = useState(false);
    const [isNotebookLMImportOpen, setIsNotebookLMImportOpen] = useState(false);
    const [isTemplateManagerOpen, setIsTemplateManagerOpen] = useState(false);
    const [selectedUda, setSelectedUda] = useState<Uda | null>(null);
    
    // State for Main Tabs
    const [activeTab, setActiveTab] = useState<'dashboard' | 'frameworks'>('dashboard');

    // Dragging / feedback state
    const [previewMessage] = useState<string | null>(null);


    useEffect(() => {
        if (initialAction === 'annual-planning') {
            setIsPlanningWizardOpen(true);
        }
    }, [initialAction]);
    
    const handleUpdateCompetencies = (newCompetenze: Competenza[]) => {
        if (onUpdateCompetencies) {
            onUpdateCompetencies(newCompetenze);
        } else {
            console.warn("onUpdateCompetencies not provided to ProgettazioneHub");
        }
    };

    return (
        <div  style={{marginLeft: "auto", marginRight: "auto", width: "100%", paddingLeft: layers.ref.spacing['4'], paddingRight: layers.ref.spacing['4']}}>
            
            {/* Header */}
            <div  style={{ textAlign: "center" }}>
                <h1 style={{fontWeight: "900", color: "layers.sys.color.primary", marginBottom: layers.ref.spacing['8']}}>Progettazione</h1>
                <p style={{ color:  layers.sys.color.onSurfaceVariant }} style={{ marginLeft: "auto", marginRight: "auto", fontWeight: "500" }}>
                    Dall&apos;ispirazione alla pianificazione annuale. Gestisci i tuoi materiali, crea progetti e organizza le lezioni in un unico hub.
                </p>
            </div>
            
            {/* Tab Navigation */}
            <div style={{marginBottom: layers.ref.spacing['8']}}>
                 <TabGroup 
                    activeTab={activeTab}
                    onTabChange={(id: string) => setActiveTab(id as 'dashboard' | 'frameworks')}
                    variant="primary"
                    tabs={[
                        { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
                        { id: 'frameworks', label: 'Frameworks & Competenze', icon: 'model_training' },
                    ]}
                />
            </div>

            {activeTab === 'dashboard' ? (
                <>
                    {/* 1. HERO ACTION: WIZARD */}
                    <M3ExpressiveCard
                        icon="calendar_month"
                        title="Wizard Annuale"
                        description="Pianifica l'intero anno scolastico. Definisci UDA, scadenze e monte ore con il supporto dell'AI."
                        color="var(--md-sys-color-primaryContainer)"
                        onClick={() => {
                            console.log('Audit: Opened Annual Planning Wizard');
                            setIsPlanningWizardOpen(true);
                        }}
                        style={{marginBottom: layers.ref.spacing['8']}}
                    />

                    {/* 2. TIMELINE (GANTT 2.0 DYNAMIC) */}
                    <TimelineView 
                        udas={udas} 
                        events={events} 
                        onUdaClick={(uda) => setSelectedUda(uda)}
                        startDate={settings.activityStartDate}
                        endDate={settings.activityEndDate}
                        previewMessage={previewMessage}
                        // setPreviewMessage={setPreviewMessage}
                        onSaveUda={onSaveUda}
                    />

                    {/* 3. BENTO GRID */}
                    <div  style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: layers.ref.spacing['8']}}>
                        
                        <M3ExpressiveCard
                            icon="assignment"
                            title="Planner UDA"
                            description="Gestisci le Unit� di Apprendimento, le fasi di lavoro e le competenze target."
                            color="var(--md-sys-color-secondary-container)"
                            onClick={() => {
                                console.log('Audit: Navigated to UDA Planner');
                                onNavigate('uda');
                            }}
                            
                        />

                        <M3ExpressiveCard
                            icon="auto_fix_high"
                            title="Studio AI"
                            description="Genera quiz, riassunti e materiali dai tuoi documenti."
                            color="var(--sys-tertiary-container)"
                            onClick={() => {
                                console.log('Audit: Navigated to Studio AI');
                                onNavigate('studio');
                            }}
                            
                        />

                        <M3ExpressiveCard
                            icon="transform"
                            title="Importa & Ristruttura"
                            description="Converti vecchi file in documenti standard."
                            color="var(--md-sys-color-surfaceContainer)"
                            onClick={() => {
                                console.log('Audit: Opened Smart Import Modal');
                                setIsSmartImportOpen(true);
                            }}
                            
                        />


                        {/* Card Import da NotebookLM accanto a Knowledge Base */}
                        <M3ExpressiveCard
                            icon="cloud_download"
                            title="Importa da NotebookLM"
                            description="Sfoglia e importa materiali dal tuo spazio Google NotebookLM."
                            color="var(--md-sys-color-surfaceContainer)"
                            onClick={() => {
                                console.log('Audit: Opened NotebookLM Import Modal');
                                setIsNotebookLMImportOpen(true);
                            }}
                            
                        />

                        <M3ExpressiveCard
                            icon="folder_open"
                            title="Knowledge Base"
                            description="Archivio documenti."
                            color="var(--md-sys-color-surfaceContainer)"
                            onClick={() => {
                                console.log('Audit: Navigated to Knowledge Base');
                                onNavigate('knowledge-base');
                            }}
                            
                        />

                        <M3ExpressiveCard
                            icon="description"
                            title="Template"
                            description="Gestisci i modelli per UDA e verifiche."
                            color="var(--md-sys-color-surfaceContainer)"
                            onClick={() => {
                                console.log('Audit: Opened Template Manager');
                                setIsTemplateManagerOpen(true);
                            }}
                            
                        />

                        <M3ExpressiveCard
                            icon="history_edu"
                            title="Lezioni"
                            description="Piani di lezione."
                            color="var(--md-sys-color-surfaceContainer)"
                            onClick={() => {
                                console.log('Audit: Navigated to Lessons');
                                onNavigate('lessons');
                            }}
                            
                        />

                        <M3ExpressiveCard
                            icon="schema"
                            title="Rubriche"
                            description="Griglie valutazione."
                            color="var(--md-sys-color-surfaceContainer)"
                            onClick={() => {
                                console.log('Audit: Navigated to Rubriche');
                                onNavigate('rubriche');
                            }}
                            
                        />

                        <M3ExpressiveCard
                            icon="print"
                            title="Report"
                            description="Stampe & PDF."
                            color="var(--md-sys-color-surfaceContainer)"
                            onClick={() => {
                                console.log('Audit: Navigated to Reportistica');
                                onNavigate('reportistica');
                            }}
                            
                        />

                    </div>
                </>
            ) : (
                /* COMPETENCY MANAGER */
                <CompetencyManager 
                    competenze={settings.competenze} 
                    onUpdateCompetencies={handleUpdateCompetencies} 
                />
            )}

            {isPlanningWizardOpen && (
                <AnnualPlanningWizard 
                    onClose={() => setIsPlanningWizardOpen(false)}
                    userClasses={settings.classi}
                    settings={settings}
                    aiSettings={aiSettings}
                    udas={udas || []}
                    onSaveUda={onSaveUda}
                    onAddLessons={onAddLessons}
                    onSaveReport={onSaveReport}
                    onSaveEvent={onSaveEvent}
                    knowledgeBase={knowledgeBase || []}
                    students={students}
                    pianiInclusione={pianiInclusione}
                />
            )}

            {isSmartImportOpen && (
                <SmartImportModal
                    onClose={() => setIsSmartImportOpen(false)}
                    aiSettings={aiSettings}
                />
            )}

            {selectedUda && (
                <UdaDetailModal 
                    uda={selectedUda}
                    onClose={() => setSelectedUda(null)}
                    onEdit={() => {
                        setSelectedUda(null);
                        onNavigate('uda');
                    }}
                    aiSettings={aiSettings}
                    knowledgeBase={knowledgeBase || []}
                />
            )}

            {/* Modale Import NotebookLM */}
            {isNotebookLMImportOpen && (
                <NotebookLMImportModal
                    open={isNotebookLMImportOpen}
                    onClose={() => setIsNotebookLMImportOpen(false)}
                    isAuthenticated={driveSyncState?.isAuthenticated}
                    onConnect={onConnectDrive}
                    onImport={(importedFiles: KnowledgeBaseEntry[]) => {
                        // Aggiorna la Knowledge Base con i materiali importati
                        if (onUpdateKnowledgeBase && typeof onUpdateKnowledgeBase === 'function') {
                            // Se � fornito un dispatcher esplicito
                            onUpdateKnowledgeBase([
                                ...knowledgeBase,
                                ...importedFiles
                            ]);
                        } else {
                            // Fallback: log e chiudi modale
                            console.warn('onUpdateKnowledgeBase non fornito, impossibile aggiornare la Knowledge Base.');
                        }
                        setIsNotebookLMImportOpen(false);
                    }}
                />
            )}

            {/* Modale Template Manager */}
            {isTemplateManagerOpen && (
                <TemplateManager
                    onClose={() => setIsTemplateManagerOpen(false)}
                />
            )}
        </div>
    );
};

// Declare `udas` explicitly
const udas: Uda[] = []; // Replace with actual data source

// Ensure `uda` properties are validated before passing to components
udas.forEach((uda) => {
    if (!uda.id || !uda.title || !uda.startDate || !uda.endDate) {
        throw new Error(`Invalid Uda: Missing required properties for ${uda.id || 'unknown'}`);
    }
});

export default ProgettazioneHub;








