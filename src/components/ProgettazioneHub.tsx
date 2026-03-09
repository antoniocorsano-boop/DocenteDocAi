// MD3 Compliant - Progettazione Hub
/**
 * ProgettazioneHub.tsx
 * // M3Expressive refactor: Removed inline Tailwind classes, applied dedicated CSS classes with M3 tokens for layout, colors, spacing, and typography.
 */

import React, { useState, useEffect } from 'react';
import NotebookLMImportModal from './NotebookLMImportModal';
import TemplateManager from './TemplateManager';
import { KnowledgeBaseEntry } from '../types';
import { ProgettazioneHubProps, Uda, Competenza } from '../types';
import AnnualPlanningWizard from './AnnualPlanningWizard';
import SmartImportModal from './SmartImportModal';
import CompetencyManager from './CompetencyManager';
import {} from './ui';
import { Typography, Card as MuiCard, CardContent, Box , Tabs, Tab, Badge } from '@mui/material';
import TimelineView from './TimelineView';
import UdaDetailModal from './UdaDetailModal';

// Local Card component (MUI-native replacement for M3ExpressiveCard)
const _cardTokens: Record<string, readonly [string, string]> = {
    primary:        ['var(--md-sys-color-primary-container)',      'var(--md-sys-color-primary)'],
    secondary:      ['var(--md-sys-color-secondary-container)',    'var(--md-sys-color-secondary)'],
    tertiary:       ['var(--md-sys-color-tertiary-container)',     'var(--md-sys-color-tertiary)'],
    surface:        ['var(--md-sys-color-surface-container-high)', 'var(--md-sys-color-primary)'],
    surfaceVariant: ['var(--md-sys-color-surface-container-low)',  'var(--md-sys-color-secondary)'],
};
interface CardProps {
    icon: string; title: string; description: string;
    color?: string; onClick?: () => void;
    children?: React.ReactNode; ariaLabel?: string; style?: React.CSSProperties;
}
const Card: React.FC<CardProps> = ({ icon, title, description, color = 'surface', onClick, children, ariaLabel, style }) => {
    const tokens = _cardTokens[color];
    const bg = tokens ? tokens[0] : color;
    const accent = tokens ? tokens[1] : 'var(--md-sys-color-primary)';
    const clickable = Boolean(onClick);
    return (
        <MuiCard
            onClick={onClick}
            role={clickable ? 'button' : undefined}
            tabIndex={clickable ? 0 : undefined}
            aria-label={ariaLabel ?? (clickable ? `${title}: ${description}` : undefined)}
            onKeyDown={(e) => { if (clickable && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); onClick?.(); } }}
            style={style}
            sx={{
                backgroundColor: bg,
                borderRadius: 'var(--md-sys-shape-corner-large)',
                border: '1px solid var(--md-sys-color-outline-variant)',
                cursor: clickable ? 'pointer' : 'default',
                boxShadow: 'var(--md-sys-elevation-level1)',
                transition: 'transform 500ms cubic-bezier(0.38,1.21,0.22,1.00), box-shadow var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard)',
                '&:hover': clickable ? { transform: 'scale(1.04)', boxShadow: 'var(--md-sys-elevation-level3)' } : {},
            }}
        >
            <CardContent sx={{ p: 'var(--md-sys-spacing-8)', '&:last-child': { pb: 'var(--md-sys-spacing-8)' } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                    <Box sx={{ width: 40, height: 40, borderRadius: 'var(--md-sys-shape-corner-large)', backgroundColor: 'var(--md-sys-color-surface-container-high)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 'var(--md-sys-typescale-title-large-font-size)', color: accent, userSelect: 'none' }}>{icon}</span>
                    </Box>
                    {clickable && <span className="material-symbols-outlined" style={{ fontSize: 'var(--md-sys-typescale-title-large-font-size)' }}>arrow_forward</span>}
                </Box>
                <Typography variant="subtitle2">{title}</Typography>
                <Typography variant="body2" sx={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{description}</Typography>
                {children && (
                    <Box sx={{ pt: 1, mt: 1, borderTop: '1px solid var(--md-sys-color-outline-variant)' }}>
                        {children}
                    </Box>
                )}
            </CardContent>
        </MuiCard>
    );
};

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

    // MD3 Theme tokens

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
        <div style={{marginLeft: 'var(--md-sys-margin-auto)', marginRight: 'var(--md-sys-margin-auto)', width: 'var(--md-sys-percent-100)', maxWidth: 'var(--md-sys-layout-content-max-width)', paddingLeft: 'var(--md-sys-spacing-4)', paddingRight: 'var(--md-sys-spacing-4)', paddingBottom: 'var(--md-sys-spacing-8)', boxSizing: 'border-box'}}>
            
            {/* Header */}
            <div style={{ textAlign: "center", marginBottom: 'var(--md-sys-spacing-6)' }}>
                <Typography variant="h5" sx={{color: "var(--md-sys-color-on-surface)", marginBottom: 'var(--md-sys-spacing-2)', marginTop: 'var(--md-sys-spacing-4)'}}>Progettazione</Typography>
                <Typography variant="body1" sx={{ color: 'var(--md-sys-color-on-surface-variant)', maxWidth: '640px', marginLeft: 'var(--md-sys-margin-auto)', marginRight: 'var(--md-sys-margin-auto)' }}>
                    Dall&apos;ispirazione alla pianificazione annuale. Gestisci i tuoi materiali, crea progetti e organizza le lezioni in un unico hub.
                </Typography>
            </div>
            
            {/* Tab Navigation */}
            <div style={{marginBottom: 'var(--md-sys-spacing-8)'}}>
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
            </div>

            {activeTab === 'dashboard' ? (
                <>
                    {/* 1. HERO ACTION: WIZARD */}
                    <Card
                        icon="calendar_month"
                        title="Wizard Annuale"
                        description="Pianifica l'intero anno scolastico. Definisci UDA, scadenze e monte ore con il supporto dell'AI."
                        color="var(--md-sys-color-primary-container)"
                        onClick={() => {
                            console.log('Audit: Opened Annual Planning Wizard');
                            setIsPlanningWizardOpen(true);
                        }}
                        style={{marginBottom: 'var(--md-sys-spacing-8)'}}
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
                    <div  style={{display: "grid", gridTemplateColumns: "var(--md-sys-grid-fr-1) var(--md-sys-grid-fr-1)", gap: 'var(--md-sys-spacing-8)'}}>
                        
                        <Card
                            icon="assignment"
                            title="Planner UDA"
                            description="Gestisci le Unit� di Apprendimento, le fasi di lavoro e le competenze target."
                            color="var(--md-sys-color-secondary-container)"
                            onClick={() => {
                                console.log('Audit: Navigated to UDA Planner');
                                onNavigate('uda');
                            }}
                            
                        />

                        <Card
                            icon="auto_fix_high"
                            title="Studio AI"
                            description="Genera quiz, riassunti e materiali dai tuoi documenti."
                            color="var(--md-sys-color-tertiary-container)"
                            onClick={() => {
                                console.log('Audit: Navigated to Studio AI');
                                onNavigate('studio');
                            }}
                            
                        />

                        <Card
                            icon="transform"
                            title="Importa & Ristruttura"
                            description="Converti vecchi file in documenti standard."
                            color="var(--md-sys-color-surface-container)"
                            onClick={() => {
                                console.log('Audit: Opened Smart Import Modal');
                                setIsSmartImportOpen(true);
                            }}
                            
                        />

{/* Card Import da NotebookLM accanto a Knowledge Base */}
                        <Card
                            icon="cloud_download"
                            title="Importa da NotebookLM"
                            description="Sfoglia e importa materiali dal tuo spazio Google NotebookLM."
                            color="var(--md-sys-color-surface-container)"
                            onClick={() => {
                                console.log('Audit: Opened NotebookLM Import Modal');
                                setIsNotebookLMImportOpen(true);
                            }}
                            
                        />

                        <Card
                            icon="folder_open"
                            title="Knowledge Base"
                            description="Archivio documenti."
                            color="var(--md-sys-color-surface-container)"
                            onClick={() => {
                                console.log('Audit: Navigated to Knowledge Base');
                                onNavigate('knowledge-base');
                            }}
                            
                        />

                        <Card
                            icon="description"
                            title="Template"
                            description="Gestisci i modelli per UDA e verifiche."
                            color="var(--md-sys-color-surface-container)"
                            onClick={() => {
                                console.log('Audit: Opened Template Manager');
                                setIsTemplateManagerOpen(true);
                            }}
                            
                        />

                        <Card
                            icon="history_edu"
                            title="Lezioni"
                            description="Piani di lezione."
                            color="var(--md-sys-color-surface-container)"
                            onClick={() => {
                                console.log('Audit: Navigated to Lessons');
                                onNavigate('lessons');
                            }}
                            
                        />

                        <Card
                            icon="schema"
                            title="Rubriche"
                            description="Griglie valutazione."
                            color="var(--md-sys-color-surface-container)"
                            onClick={() => {
                                console.log('Audit: Navigated to Rubriche');
                                onNavigate('rubriche');
                            }}
                            
                        />

                        <Card
                            icon="print"
                            title="Report"
                            description="Stampe & PDF."
                            color="var(--md-sys-color-surface-container)"
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

