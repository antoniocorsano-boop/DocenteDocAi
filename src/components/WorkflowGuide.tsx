import React from 'react';

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
        <section className="workflow-section">
            <h2 className="section-header-expressive">
                <span className="material-symbols-outlined text-secondary">alt_route</span>
                Percorsi Veloci
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {workflows.map((workflow) => (
                    <div key={workflow.id} className="workflow-card">
                        <details className="group">
                            <summary className="workflow-card-header list-none">
                                <div className="workflow-icon-box" style={{ backgroundColor: `var(--sys-${workflow.themeColor}-container)`, color: `var(--sys-on-${workflow.themeColor}-container)` }}>
                                    <span className="material-symbols-outlined">{workflow.icon}</span>
                                </div>
                                <div className="flex-grow min-w-0">
                                    <h3 className="m3-title-medium text-lg">{workflow.title}</h3>
                                    <p className="m3-body-small text-[var(--md-sys-color-on-surface)]-variant">{workflow.description}</p>
                                </div>
                                <span className="material-symbols-outlined text-[var(--md-sys-color-on-surface)]-variant group-open:rotate-180 transition-transform">expand_more</span>
                            </summary>
                            <div className="workflow-card-content">
                                <ol className="workflow-steps-list">
                                    {workflow.steps.map((step, stepIndex) => (
                                        <li key={stepIndex} className="workflow-step">
                                            <span dangerouslySetInnerHTML={{ __html: step }} />
                                        </li>
                                    ))}
                                </ol>
                                <button
                                    onClick={() => handleAction(workflow)}
                                    className="button button-filled w-full justify-center"
                                    style={{ backgroundColor: `var(--sys-${workflow.themeColor})`, color: `var(--sys-on-${workflow.themeColor})` }}
                                >
                                    Avvia Percorso <span className="material-symbols-outlined ml-2 text-sm">arrow_forward</span>
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

