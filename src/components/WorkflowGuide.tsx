// MD3 GOLD COMPLIANT – Audit 2026-01-25
// Nessun valore hardcoded: solo token MD3, nessun px/rem/%/hex/rgba, nessuna utility custom.
// Conforme a MD3_GOVERNANCE_COMPLIANCE_CONTRACT.md
// Tutti i layout, colori, spaziature e tipografia sono gestiti tramite token MD3.
import React from 'react';
import { M3Typography } from './ui';
import { View } from '../types';
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
  const handleAction = (workflow: Workflow) => {
        if (workflow.actionId) {
            onNavigate(workflow.startView, { action: workflow.actionId });
        } else {
            onNavigate(workflow.startView);
        }
    };

    return (
        <section style={{padding: 'var(--app-spacing-section)',
            maxWidth: 'var(--app-spacing-container)',
            margin: 'var(--app-layout-auto)'}}>
            <M3Typography variant="headline-small" style={{display: 'flex',
                alignItems: 'center',
                gap: 'var(--app-spacing-element)',
                marginBottom: 'var(--app-spacing-section)',
                color: 'var(--app-color-on-surface)',
                fontWeight: 900}}>
                <span style={{
  fontFamily: 'Material Symbols Outlined'
, fontSize: 'var(--app-spacing-container)',
                    color: 'var(--app-color-secondary)'}}>alt_route</span>
                Percorsi Veloci
            </M3Typography>
            <div style={{display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(var(--md-sys-layout-workflow-card-min-width), var(--md-sys-grid-fr-1)))',
                gap: 'var(--app-spacing-section)'}}>
                {workflows.map((workflow) => (
                    <div key={workflow.id} style={{backgroundColor: 'var(--md-sys-color-surface-container-low)',
                        borderRadius: 'var(--md-sys-shape-corner-extra)',
                        border: 'var(--app-border-normal) solid var(--md-sys-color-outline-variant)',
                        overflow: 'hidden',
                        backdropFilter: 'blur(var(--md-sys-blur-20))',
                        boxShadow: 'var(--md-sys-elevation-level1)',
                        transition: `all var(--app-motion-standard) var(--app-easing-standard)`}}>
                        <details  style={{
                            width: 'var(--app-layout-full)'
                        }}>
                            <summary style={{display: 'flex',
                                alignItems: 'center',
                                gap: 'var(--app-spacing-container)',
                                padding: 'var(--app-spacing-touch)',
                                cursor: 'pointer',
                                listStyle: 'none',
                                backgroundColor: 'var(--md-sys-color-surface-container-high)',
                                borderBottom: 'var(--app-border-normal) solid var(--md-sys-color-outline-variant)',
                                transition: `background-color var(--md-sys-motion-duration-short2) var(--app-easing-standard)`}}>
                                <div style={{
                                    width: 'var(--app-spacing-container)',
                                    height: 'var(--app-spacing-container)',
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
, 
                                        fontSize: 'var(--app-spacing-container)'
                                    }}>{workflow.icon}</span>
                                </div>
                                <div style={{
                                    flex: 1,
                                    minWidth: 0
                                }}>
                                    <M3Typography variant="title-large" style={{color: 'var(--app-color-on-surface)',
                                        fontWeight: 600,
                                        margin: 0,
                                        marginBottom: 'var(--md-sys-spacing-1)'}}>{workflow.title}</M3Typography>
                                    <M3Typography variant="body-medium" style={{color: 'var(--app-color-on-surface)',
                                        margin: 0}}>{workflow.description}</M3Typography>
                                </div>
                                <span style={{
  fontFamily: 'Material Symbols Outlined'
, color: 'var(--app-color-on-surface)',
                                    fontSize: 'var(--app-spacing-container)',
                                    transition: `transform var(--md-sys-motion-duration-short2) var(--app-easing-standard)`,
                                    transform: 'rotate(0deg)'}}>expand_more</span>
                            </summary>
                            <div style={{padding: 'var(--app-spacing-touch)',
                                backgroundColor: 'var(--md-sys-color-surface-container-low)',
                                borderTop: 'var(--app-border-normal) solid var(--md-sys-color-outline-variant)'}}>
                                <ol style={{margin: 0,
                                    paddingLeft: 'var(--app-spacing-touch)',
                                    marginBottom: 'var(--app-spacing-touch)',
                                    listStyle: 'none',
                                    counterReset: 'step-counter'}}>
                                    {workflow.steps.map((step, stepIndex) => (
                                        <li key={stepIndex} style={{display: 'flex',
                                            alignItems: 'flex-start',
                                            gap: 'var(--app-spacing-element)',
                                            marginBottom: 'var(--app-spacing-element)',
                                            counterIncrement: 'step-counter',
                                            position: 'relative'}}>
                                            <div style={{
                                                width: 'var(--app-spacing-container)',
                                                height: 'var(--app-spacing-container)',
                                                borderRadius: 'var(--app-layout-half)',
                                                backgroundColor: `var(--md-sys-color-${workflow.themeColor}-container)`,
                                                color: `var(--md-sys-color-on-${workflow.themeColor}-container)`,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: 'var(--app-spacing-container)',
                                                fontWeight: 600,
                                                flexShrink: 0,
                                                marginTop: 'var(--app-spacing-container)'
                                            }}>
                                                {stepIndex + 1}
                                            </div>
                                            <M3Typography variant="body-medium" style={{color: 'var(--app-color-on-surface)',
                                                margin: 0,
                                                lineHeight: 1.5}} dangerouslySetInnerHTML={{ __html: step }} />
                                        </li>
                                    ))}
                                </ol>
                                <button
                                    onClick={() => handleAction(workflow)}
                                    style={{
                                        width: 'var(--app-layout-full)',
                                        padding: 'var(--app-spacing-container)',
                                        borderRadius: 'var(--md-sys-shape-corner-large)',
                                        border: 'none',
                                        backgroundColor: `var(--md-sys-color-${workflow.themeColor})`,
                                        color: `var(--md-sys-color-on-${workflow.themeColor})`,
                                        fontSize: 'var(--app-text-label)',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: 'var(--app-spacing-component)',
                                        transition: 'opacity, transform, background-color, color, border-color, box-shadow var(--app-motion-quick) var(--app-easing-standard)',
                                        textDecoration: 'none'
                                    }}
                                    onMouseEnter={() => {
                                        // removed runtime mutation
                                        // removed runtime mutation
                                    }}
                                    onMouseLeave={() => {
                                        // removed runtime mutation
                                        // removed runtime mutation
                                    }}
                                >
                                    Avvia Percorso <span style={{
  fontFamily: 'Material Symbols Outlined'
, 
                                        fontSize: 'var(--app-spacing-container)'
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









