
import React, { useState } from 'react';
import { Competenza } from '../types';
import { DEFAULT_COMPETENZE } from '../constants';

interface CompetencyManagerProps {
    competenze: Competenza[];
    onUpdateCompetencies: (newCompetencies: Competenza[]) => void;
}

// Helper to get unique frameworks from a list
const getFrameworks = (compList: Competenza[]) => {
    const frameworks = new Set<string>();
    compList.forEach(c => {
        if (c.framework) frameworks.add(c.framework);
        else frameworks.add('Standard');
    });
    return Array.from(frameworks);
};

const CompetencyManager: React.FC<CompetencyManagerProps> = ({ competenze, onUpdateCompetencies }) => {
    const [activeFramework, setActiveFramework] = useState<string>('Tutti');
    
    // DEFAULT_COMPETENZE acts as the master catalog of all available competencies
    const catalog = DEFAULT_COMPETENZE; 
    const frameworks = ['Tutti', ...getFrameworks(catalog)];

    const isCompetencyActive = (id: string) => {
        return competenze.some(c => c.id === id);
    };

    const toggleCompetency = (comp: Competenza) => {
        const isActive = isCompetencyActive(comp.id);
        let newCompetenciesIds: string[];

        if (isActive) {
            // Remove: Filter out the ID
            newCompetenciesIds = competenze.filter(c => c.id !== comp.id).map(c => c.id);
        } else {
            // Add: Append ID
            newCompetenciesIds = [...competenze.map(c => c.id), comp.id];
        }
        
        // Reconstruct the array based on the MASTER CATALOG ORDER
        // This ensures that toggling doesn't mess up the sort order (e.g. putting 'Area 1.1' at the end)
        const newCompetencies = catalog.filter(c => newCompetenciesIds.includes(c.id));
        
        // Push update to parent
        onUpdateCompetencies(newCompetencies);
    };

    const filteredCatalog = catalog.filter(c => {
        if (activeFramework === 'Tutti') return true;
        return (c.framework || 'Standard') === activeFramework;
    });

    return (
        <div className="space-y-4 animate-in fade-in w-full max-w-3xl mx-auto px-4 md:px-4">
            {/* Intro Card */}
            <div className="card bg-primary-container text-on-primary-container max-w-2xl mx-auto mb-8 p-8 md:p-6">
                <h2 className="text-[var(--md-sys-typescale-headline-small)] font-[var(--md-sys-typescale-headline-small-font)] mb-8">Gestione Framework e Competenze</h2>
                <p className="text-[var(--md-sys-typescale-body-medium)] font-[var(--md-sys-typescale-body-medium-font)] opacity-90">
                    Seleziona le competenze che vuoi monitorare nel tuo registro. Puoi attivare interi framework come <strong>DigCompEdu 2.2</strong> (con focus IA) o le Competenze Chiave Europee.
                </p>
            </div>

            {/* Filtri Framework: scroll orizzontale su mobile, sidebar su desktop */}
            <div className="w-full overflow-x-auto pb-2 md:overflow-visible md:pb-0">
                <div className="flex flex-row md:flex-col gap-8 md:gap-6 w-max md:w-64 mx-auto md:mx-0">
                    {frameworks.map(fw => (
                        <button 
                            key={fw}
                            onClick={() => setActiveFramework(fw)}
                            className={`px-4 py-4 rounded-[var(--md-sys-shape-corner-medium)] transition-colors text-sm font-medium flex items-center whitespace-nowrap ${activeFramework === fw ? 'bg-secondary-container text-on-secondary-container shadow-sm' : 'bg-surface hover:bg-[var(--md-sys-color-surface-container-high)] border border-transparent hover:border-[var(--md-sys-color-outline-variant)]'}`}
                        >
                            <span className="truncate mr-2">{fw}</span>
                            {fw === 'DigCompEdu 2.2' && <span className="material-symbols-outlined text-[var(--md-sys-typescale-body-medium)] font-[var(--md-sys-typescale-body-medium-font)]">smart_toy</span>}
                        </button>
                    ))}
                </div>
            </div>

            {/* Lista Competenze */}
            <div className="space-y-3 max-w-2xl mx-auto w-full">
                {filteredCatalog.map(comp => {
                    const active = isCompetencyActive(comp.id);
                    return (
                        <details 
                            key={comp.id} 
                            className={`m3-expansion-panel transition-all ${active ? 'border-primary bg-surface' : 'border-[var(--md-sys-color-outline-variant)] bg-[var(--md-sys-color-surface-container-low)]'}`}
                        >
                            <summary className="m3-expansion-summary !px-4 !py-3 !justify-start !gap-8">
                                <div 
                                    onClick={(e) => { 
                                        e.preventDefault(); // Prevent details toggle
                                        e.stopPropagation(); 
                                        toggleCompetency(comp); 
                                    }} 
                                    className={`w-6 h-6 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${active ? 'bg-primary border-primary text-on-primary' : 'border-[var(--md-sys-color-outline)] text-[var(--md-sys-color-on-surface)]-variant hover:bg-[var(--md-sys-color-surface-container-high)]'}`}
                                    title={active ? `Disattiva ${comp.nome}` : `Attiva ${comp.nome}`}
                                >
                                    {active && <span className="material-symbols-outlined m3-body-small">check</span>}
                                </div>
                                <div className="flex-grow min-w-0">
                                    <span className="m3-label-small font-bold uppercase tracking-wider text-primary mb-4 block truncate">{comp.codice}</span>
                                    <h3 className="m3-title-medium font-bold truncate">{comp.nome}</h3>
                                    <p className="m3-label-small text-[var(--md-sys-color-on-surface)]-variant mt-4 truncate">{comp.framework}</p>
                                </div>
                                <span className="material-symbols-outlined text-[var(--md-sys-color-on-surface)]-variant group-open:rotate-180 transition-transform ml-auto">expand_more</span>
                            </summary>
                            <div className="m3-expansion-content !px-4 !pt-2 !pb-4">
                                <p className="m3-label-small font-bold mb-8 text-[var(--md-sys-color-on-surface)]-variant">DESCRITTORI LIVELLI:</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {comp.livelli.map(lvl => (
                                        <div key={lvl.id} className="bg-[var(--md-sys-color-surface-container-low)] p-8 rounded m3-label-small">
                                            <strong>{lvl.nome}:</strong> <span className="opacity-80">{lvl.descrizione}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </details>
                    )
                })}
            </div>
        </div>
    );
};

export default CompetencyManager;
