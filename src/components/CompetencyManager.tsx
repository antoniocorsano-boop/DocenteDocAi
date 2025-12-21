
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
        <div className="space-y-6 animate-in fade-in">
            {/* Intro Card */}
            <div className="card bg-primary-container text-on-primary-container">
                <h2 className="m3-headline-small mb-2">Gestione Framework e Competenze</h2>
                <p className="m3-body-medium opacity-90">
                    Seleziona le competenze che vuoi monitorare nel tuo registro. Puoi attivare interi framework come <strong>DigCompEdu 2.2</strong> (con focus IA) o le Competenze Chiave Europee.
                </p>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
                {/* Sidebar: Framework Filters */}
                <div className="w-full md:w-64 flex-shrink-0 space-y-2">
                    <h3 className="m3-label-large text-on-surface-variant uppercase px-2">Frameworks</h3>
                    {frameworks.map(fw => (
                        <button 
                            key={fw}
                            onClick={() => setActiveFramework(fw)}
                            className={`w-full text-left px-4 py-3 rounded-xl transition-colors text-sm font-medium flex justify-between items-center ${activeFramework === fw ? 'bg-secondary-container text-on-secondary-container shadow-sm' : 'bg-surface hover:bg-surface-container-high border border-transparent hover:border-outline-variant'}`}
                        >
                            <span className="truncate mr-2">{fw}</span>
                            {fw === 'DigCompEdu 2.2' && <span className="material-symbols-outlined text-base">smart_toy</span>}
                        </button>
                    ))}
                </div>

                {/* Main List */}
                <div className="flex-grow space-y-4">
                     {filteredCatalog.map(comp => {
                         const active = isCompetencyActive(comp.id);
                         return (
                             <details 
                                key={comp.id} 
                                className={`m3-expansion-panel transition-all ${active ? 'border-primary bg-surface' : 'border-outline-variant bg-surface-container-low'}`}
                            >
                                <summary className="m3-expansion-summary !px-4 !py-3 !justify-start !gap-4">
                                    <div 
                                        onClick={(e) => { 
                                            e.preventDefault(); // Prevent details toggle
                                            e.stopPropagation(); 
                                            toggleCompetency(comp); 
                                        }} 
                                        className={`w-6 h-6 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${active ? 'bg-primary border-primary text-on-primary' : 'border-outline text-on-surface-variant hover:bg-surface-container-high'}`}
                                        title={active ? `Disattiva ${comp.nome}` : `Attiva ${comp.nome}`}
                                    >
                                        {active && <span className="material-symbols-outlined text-sm">check</span>}
                                    </div>
                                    <div className="flex-grow min-w-0">
                                        <span className="text-xs font-bold uppercase tracking-wider text-primary mb-1 block truncate">{comp.codice}</span>
                                        <h3 className="m3-title-medium font-bold truncate">{comp.nome}</h3>
                                        <p className="text-xs text-on-surface-variant mt-1 truncate">{comp.framework}</p>
                                    </div>
                                    <span className="material-symbols-outlined text-on-surface-variant group-open:rotate-180 transition-transform ml-auto">expand_more</span>
                                </summary>
                                 
                                <div className="m3-expansion-content !px-4 !pt-2 !pb-4">
                                    <p className="text-xs font-bold mb-2 text-on-surface-variant">DESCRITTORI LIVELLI:</p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        {comp.livelli.map(lvl => (
                                            <div key={lvl.id} className="bg-surface-container-low p-2 rounded text-xs">
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
        </div>
    );
};

export default CompetencyManager;
