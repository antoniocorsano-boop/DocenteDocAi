// LEGACY - MD3 Non-compliant
import React from 'react';
import { M3Typography } from './ui';
import { View } from '../types';
import { useTheme } from '../theme/theme';

interface Workflow {
    id: string;
    icon: string;
    title: string;
    description: string;
    steps: string[];
    startView: View;
    themeColor: 'primary' | 'secondary' | 'tertiary' | 'error';
    actionId?: string;
}

const workflows: Workflow[] = [
    {
        id: 'wf-annual',
        icon: 'calendar_month',
        title: 'Progettazione Annuale',
        description: 'Dalle competenze al calendario in pochi step.',
        steps: [
            'Definisci <strong>Classe e Materia</strong>.',
            'Imposta le <strong>Milestone</strong> (scadenze periodi).',
            'Crea la sequenza delle <strong>UDA</strong> con monte ore.',
            "L'AI genera il <strong>Documento Finale</strong>."
        ],
        startView: 'progettazione-hub',
        themeColor: 'primary',
        actionId: 'annual-planning'
    },
    {
        id: 'wf-lesson',
        icon: 'playlist_add_check',
        title: 'Da Zero a Lezione',
        description: 'Trasforma i documenti in lezioni pronte.',
        steps: [
            'Carica materiali nella <strong>Knowledge Base</strong>.',
            "Genera <strong>Progetto (UDA)</strong> con l'AI.",
            'Crea sequenza di <strong>Lezioni</strong>.',
            'Assegna all\'<strong>Orario</strong>.'
        ],
        startView: 'knowledge-base',
        themeColor: 'tertiary'
    },
    {
        id: 'wf-report',
        icon: 'assessment',
        title: 'Preparazione Scrutinio',
        description: 'Analisi AI e documenti finali.',
        steps: [
            'Accedi al <strong>Cruscotto Classe</strong>.',
            "Usa l'<strong>Analisi AI</strong> per la sintesi.",
            'Compila griglia <strong>Consiglio</strong>.',
            '<strong>Esporta PDF</strong> dati finali.'
        ],
        startView: 'aula',
        themeColor: 'error'
    }
];

interface WorkflowGuideProps {
    onNavigate: (view: View, context?: unknown) => void;
}

const WorkflowGuide: React.FC<WorkflowGuideProps> = ({ onNavigate }) => {
  const { layers } = useTheme();
  const { layers } = useTheme();
    const handleAction = (workflow: Workflow) => {
        if (workflow.actionId) {
            onNavigate(workflow.startView, { action: workflow.actionId });
        } else {
            onNavigate(workflow.startView);
        }
    };

    return (
        <section style={{padding: layers.ref.spacing['6'],
            maxWidth: ref.spacing[1200],
            margin: '0 auto'}}>
            <M3Typography variant="headline-small" style={{display: 'flex',
                alignItems: 'center',
                gap: layers.ref.spacing['3'],
                marginBottom: layers.ref.spacing['6'],
                color: 'layers.sys.colors.on-surface',
                fontWeight: 900}}>
                <span style={{
  fontFamily: 'Material Symbols Outlined'
}} style={{fontSize: ref.spacing[28],
                    color: 'layers.sys.colors.secondary'}}>alt_route</span>
                Percorsi Veloci
            </M3Typography>
            <div style={{display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: layers.ref.spacing['6']}}>
                {workflows.map((workflow) => (
                    <div key={workflow.id} style={{backgroundColor: 'layers.sys.colors.surface-container-low',
                        borderRadius: 'layers.ref.shape.corner.extra-large',
                        border: '1px solid layers.sys.colors.outline-variant',
                        overflow: 'hidden',
                        backdropFilter: 'blur(20px)',
                        boxShadow: 'layers.sys.elevation.level1',
                        transition: `all ${layers.motion.duration.medium} ${layers.motion.easing.standard}`}}>
                        <details  style={{
                            width: '100%'
                        }}>
                            <summary style={{display: 'flex',
                                alignItems: 'center',
                                gap: layers.ref.spacing['4'],
                                padding: layers.ref.spacing['5'],
                                cursor: 'pointer',
                                listStyle: 'none',
                                backgroundColor: 'layers.sys.colors.surface-container-high',
                                borderBottom: '1px solid layers.sys.colors.outline-variant',
                                transition: `background-color ${layers.motion.duration.short} ${layers.motion.easing.standard}`}}>
                                <div style={{
                                    width: ref.spacing[56],
                                    height: ref.spacing[56],
                                    borderRadius: 'var(--md-sys-shape-corner-large)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: `var(--md-sys-color-${workflow.themeColor}-container)`,
                                    color: `var(--md-sys-color-on-${workflow.themeColor}-container)`,
                                    flexShrink: 0
                                }}>
                                    <span style={{
  fontFamily: 'Material Symbols Outlined'
}} style={{
                                        fontSize: ref.spacing[24]
                                    }}>{workflow.icon}</span>
                                </div>
                                <div style={{
                                    flex: 1,
                                    minWidth: 0
                                }}>
                                    <M3Typography variant="title-large" style={{color: 'layers.sys.colors.on-surface',
                                        fontWeight: 600,
                                        margin: 0,
                                        marginBottom: layers.ref.spacing['1']}}>{workflow.title}</M3Typography>
                                    <M3Typography variant="body-medium" style={{color: 'layers.sys.colors.on-surface-variant',
                                        margin: 0}}>{workflow.description}</M3Typography>
                                </div>
                                <span style={{
  fontFamily: 'Material Symbols Outlined'
}} style={{color: 'layers.sys.colors.on-surface-variant',
                                    fontSize: ref.spacing[20],
                                    transition: `transform ${layers.motion.duration.short} ${layers.motion.easing.standard}`,
                                    transform: 'rotate(0deg)'}}>expand_more</span>
                            </summary>
                            <div style={{padding: layers.ref.spacing['5'],
                                backgroundColor: 'layers.sys.colors.surface-container-low',
                                borderTop: '1px solid layers.sys.colors.outline-variant'}}>
                                <ol style={{margin: 0,
                                    paddingLeft: layers.ref.spacing['5'],
                                    marginBottom: layers.ref.spacing['5'],
                                    listStyle: 'none',
                                    counterReset: 'step-counter'}}>
                                    {workflow.steps.map((step, stepIndex) => (
                                        <li key={stepIndex} style={{display: 'flex',
                                            alignItems: 'flex-start',
                                            gap: layers.ref.spacing['3'],
                                            marginBottom: layers.ref.spacing['3'],
                                            counterIncrement: 'step-counter',
                                            position: 'relative'}}>
                                            <div style={{
                                                width: ref.spacing[24],
                                                height: ref.spacing[24],
                                                borderRadius: '50%',
                                                backgroundColor: `var(--md-sys-color-${workflow.themeColor}-container)`,
                                                color: `var(--md-sys-color-on-${workflow.themeColor}-container)`,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: ref.spacing[12],
                                                fontWeight: 600,
                                                flexShrink: 0,
                                                marginTop: ref.spacing[2]
                                            }}>
                                                {stepIndex + 1}
                                            </div>
                                            <M3Typography variant="body-medium" style={{color: 'layers.sys.colors.on-surface-variant',
                                                margin: 0,
                                                lineHeight: 1.5}} dangerouslySetInnerHTML={{ __html: step }} />
                                        </li>
                                    ))}
                                </ol>
                                <button
                                    onClick={() => handleAction(workflow)}
                                    style={{
                                        width: '100%',
                                        padding: 'var(--md-sys-spacing-4)',
                                        borderRadius: 'var(--md-sys-shape-corner-large)',
                                        border: 'none',
                                        backgroundColor: `var(--md-sys-color-${workflow.themeColor})`,
                                        color: `var(--md-sys-color-on-${workflow.themeColor})`,
                                        fontSize: 'var(--md-sys-typescale-label-large-font-size)',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: 'var(--md-sys-spacing-2)',
                                        transition: 'all var(--md-sys-motion-duration-short) var(--md-sys-motion-easing-standard)',
                                        textDecoration: 'none'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget// removed runtime mutation
                                        e.currentTarget// removed runtime mutation
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget// removed runtime mutation
                                        e.currentTarget// removed runtime mutation
                                    }}
                                >
                                    Avvia Percorso <span style={{
  fontFamily: 'Material Symbols Outlined'
}} style={{
                                        fontSize: ref.spacing[16]
                                    }}>arrow_forward</span>
                                </button>
                            </div>
                        </details>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default WorkflowGuide;




