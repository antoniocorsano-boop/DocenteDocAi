// MD3 Compliant - Progettazione Hub
/**
 * ProgettazioneHub.tsx
 * // M3Expressive refactor: Removed inline Tailwind classes, applied dedicated CSS classes with M3 tokens for layout, colors, spacing, and typography.
 */

import React, { useState, useEffect } from 'react';
import NotebookLMImportModal from './NotebookLMImportModal';
import { logger } from '../utils/logger';
import TemplateManager from './TemplateManager';
import { KnowledgeBaseEntry } from '../types';
import { ProgettazioneHubProps, Uda, Competenza } from '../types';
import AnnualPlanningWizard from './AnnualPlanningWizard';
import SmartImportModal from './SmartImportModal';
import CompetencyManager from './CompetencyManager';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Badge from '@mui/material/Badge';
import TimelineView from './TimelineView';
import UdaDetailModal from './UdaDetailModal';
import { NavigationCard, PageWrapper } from './ui';


const ProgettazioneHub: React.FC<ProgettazioneHubProps> = ({ 
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
        <PageWrapper maxWidth="var(--md-sys-layout-content-max-width)" gap={0} sx={{ px: 'var(--md-sys-spacing-4)', boxSizing: 'border-box' }}>

            {/* Header */}
            <Box sx={{ textAlign: 'center', mb: 'var(--md-sys-spacing-6)' }}>
                <Typography variant="h5" sx={{ color: 'var(--md-sys-color-on-surface)', mb: 'var(--md-sys-spacing-2)', mt: 'var(--md-sys-spacing-4)' }}>Progettazione</Typography>
                <Typography variant="body1" sx={{ color: 'var(--md-sys-color-on-surface-variant)', maxWidth: '640px', mx: 'auto' }}>
                    Dall&apos;ispirazione alla pianificazione annuale. Gestisci i tuoi materiali, crea progetti e organizza le lezioni in un unico hub.
                </Typography>
            </Box>

            {/* Tab Navigation */}
            <Box sx={{ mb: 'var(--md-sys-spacing-8)' }}>
                                  <Tabs
                   value={activeTab}
                   onChange={(_, v: string) => ((id: string) => setActiveTab(id as 'dashboard' | 'frameworks'))(v)}
                   indicatorColor="primary"
                   textColor="primary"
                   aria-label="Sezioni di navigazione"
                   sx={{
                     bgcolor: 'var(--md-sys-color-surface-container-low)',
                     borderRadius: 'var(--md-sys-shape-corner-full)',
                     border: '1px solid var(--md-sys-color-outline-variant)',
                     minHeight: 'auto',
                     p: 0.5,
                   }}
                 >
                   {([
                        { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
                        { id: 'frameworks', label: 'Frameworks & Competenze', icon: 'model_training' },
                    ]).map((tab: { id: string; label: string; icon?: string; badge?: number | string }) => (
                     <Tab
                       key={tab.id}
                       value={tab.id}
                       id={`tab-${tab.id}`}
                       aria-controls={`panel-${tab.id}`}
                       data-testid={`tab-${tab.id}`}
                       label={(
                         <Badge badgeContent={tab.badge} color="error">
                           <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                             {tab.icon && <Box component="span" className="material-symbols-outlined" aria-hidden="true" sx={{ fontSize: 'var(--md-sys-typescale-label-large-font-size)' }}>{tab.icon}</Box>}
                             {tab.label}
                           </Box>
                         </Badge>
                       )}
                       sx={{
                         borderRadius: 'var(--md-sys-shape-corner-full)',
                         minHeight: 'auto',
                         py: 1,
                         px: 2,
                         textTransform: 'uppercase',
                         fontSize: 'var(--md-sys-typescale-label-small-font-size)',
                       }}
                     />
                   ))}
                 </Tabs>
            </Box>

            {activeTab === 'dashboard' ? (
                <>
                    {/* 1. HERO ACTION: WIZARD */}
                    <NavigationCard
                        icon="calendar_month"
                        title="Wizard Annuale"
                        description="Pianifica l'intero anno scolastico. Definisci UDA, scadenze e monte ore con il supporto dell'AI."
                        color="var(--md-sys-color-primary-container)"
                        onClick={() => {
                            logger.audit('Opened Annual Planning Wizard');
                            setIsPlanningWizardOpen(true);
                        }}
                        sx={{ mb: 'var(--md-sys-spacing-8)' }}
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
                    <Grid container spacing={2}>

                        <Grid size={6}>
                            <NavigationCard
                                icon="assignment"
                                title="Planner UDA"
                                description="Gestisci le UnitÃ  di Apprendimento, le fasi di lavoro e le competenze target."
                                color="var(--md-sys-color-secondary-container)"
                                onClick={() => {
                                    logger.audit('Navigated to UDA Planner');
                                    onNavigate('uda');
                                }}
                            />
                        </Grid>

                        <Grid size={6}>
                            <NavigationCard
                                icon="auto_fix_high"
                                title="Studio AI"
                                description="Genera quiz, riassunti e materiali dai tuoi documenti."
                                color="var(--md-sys-color-tertiary-container)"
                                onClick={() => {
                                    logger.audit('Navigated to Studio AI');
                                    onNavigate('studio');
                                }}
                            />
                        </Grid>

                        <Grid size={6}>
                            <NavigationCard
                                icon="transform"
                                title="Importa & Ristruttura"
                                description="Converti vecchi file in documenti standard."
                                color="var(--md-sys-color-surface-container)"
                                onClick={() => {
                                    logger.audit('Opened Smart Import Modal');
                                    setIsSmartImportOpen(true);
                                }}
                            />
                        </Grid>

                        {/* Card Import da NotebookLM accanto a Knowledge Base */}
                        <Grid size={6}>
                            <NavigationCard
                                icon="cloud_download"
                                title="Importa da NotebookLM"
                                description="Sfoglia e importa materiali dal tuo spazio Google NotebookLM."
                                color="var(--md-sys-color-surface-container)"
                                onClick={() => {
                                    logger.audit('Opened NotebookLM Import Modal');
                                    setIsNotebookLMImportOpen(true);
                                }}
                            />
                        </Grid>

                        <Grid size={6}>
                            <NavigationCard
                                icon="folder_open"
                                title="Knowledge Base"
                                description="Archivio documenti."
                                color="var(--md-sys-color-surface-container)"
                                onClick={() => {
                                    logger.audit('Navigated to Knowledge Base');
                                    onNavigate('knowledge-base');
                                }}
                            />
                        </Grid>

                        <Grid size={6}>
                            <NavigationCard
                                icon="description"
                                title="Template"
                                description="Gestisci i modelli per UDA e verifiche."
                                color="var(--md-sys-color-surface-container)"
                                onClick={() => {
                                    logger.audit('Opened Template Manager');
                                    setIsTemplateManagerOpen(true);
                                }}
                            />
                        </Grid>

                        <Grid size={6}>
                            <NavigationCard
                                icon="history_edu"
                                title="Lezioni"
                                description="Piani di lezione."
                                color="var(--md-sys-color-surface-container)"
                                onClick={() => {
                                    logger.audit('Navigated to Lessons');
                                    onNavigate('lessons');
                                }}
                            />
                        </Grid>

                        <Grid size={6}>
                            <NavigationCard
                                icon="schema"
                                title="Rubriche"
                                description="Griglie valutazione."
                                color="var(--md-sys-color-surface-container)"
                                onClick={() => {
                                    logger.audit('Navigated to Rubriche');
                                    onNavigate('rubriche');
                                }}
                            />
                        </Grid>

                        <Grid size={6}>
                            <NavigationCard
                                icon="print"
                                title="Report"
                                description="Stampe & PDF."
                                color="var(--md-sys-color-surface-container)"
                                onClick={() => {
                                    logger.audit('Navigated to Reportistica');
                                    onNavigate('reportistica');
                                }}
                            />
                        </Grid>

                    </Grid>
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
                            // Se ï¿½ fornito un dispatcher esplicito
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
        </PageWrapper>
    );
};

export default ProgettazioneHub;


