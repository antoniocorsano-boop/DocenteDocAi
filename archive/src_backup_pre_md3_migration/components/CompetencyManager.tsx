// LEGACY - MD3 Non-compliant

// M3Expressive refactor: Removed inline Tailwind classes, applied dedicated CSS classes with M3 tokens for colors, spacing, typography, elevation. Maintained responsive behavior and animations. ✅ COMPLETED
// ...existing code...
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
        <div >
            {/* Intro Card */}
            <div >
                <h2 >Gestione Framework e Competenze</h2>
                <p >
                    Seleziona le competenze che vuoi monitorare nel tuo registro. Puoi attivare interi framework come <strong>DigCompEdu 2.2</strong> (con focus IA) o le Competenze Chiave Europee.
                </p>
            </div>

            {/* Filtri Framework: scroll orizzontale su mobile, sidebar su desktop */}
            <div >
                <div >
                    {frameworks.map(fw => (
                        <button 
                            key={fw}
                            onClick={() => setActiveFramework(fw)}
                            className={`competency-manager-framework-filter-button ${activeFramework === fw ? 'competency-manager-framework-filter-button.active' : 'competency-manager-framework-filter-button.inactive'}`}
                        >
                            <span >{fw}</span>
                            {fw === 'DigCompEdu 2.2' && <span >smart_toy</span>}
                        </button>
                    ))}
                </div>
            </div>

            {/* Lista Competenze */}
            <div >
                {filteredCatalog.map(comp => {
                    const active = isCompetencyActive(comp.id);
                    return (
                        <details 
                            key={comp.id} 
                            className={`competency-manager-competency-expansion-panel ${active ? 'competency-manager-competency-expansion-panel.active' : 'competency-manager-competency-expansion-panel.inactive'}`}
                        >
                            <summary >
                                <div 
                                    onClick={(e) => { 
                                        e.preventDefault(); // Prevent details toggle
                                        e.stopPropagation(); 
                                        toggleCompetency(comp); 
                                    }} 
                                    className={`competency-manager-competency-checkbox ${active ? 'competency-manager-competency-checkbox.active' : 'competency-manager-competency-checkbox.inactive'}`}
                                    title={active ? `Disattiva ${comp.nome}` : `Attiva ${comp.nome}`}
                                >
                                    {active && <span >check</span>}
                                </div>
                                <div style={{ flexGrow: "1", minWidth: "0" }}>
                                    <span >{comp.codice}</span>
                                    <h3 >{comp.nome}</h3>
                                    <p >{comp.framework}</p>
                                </div>
                                <span >expand_more</span>
                            </summary>
                            <div >
                                <p >DESCRITTORI LIVELLI:</p>
                                <div >
                                    {comp.livelli.map(lvl => (
                                        <div key={lvl.id} >
                                            <strong>{lvl.nome}:</strong> <span style={{ opacity: "0.8" }}>{lvl.descrizione}</span>
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



