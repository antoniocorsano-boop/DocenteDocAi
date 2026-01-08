
import React from 'react';
import { Competenza, Livello } from '../types';

interface CompetencyLevelsViewProps {
    competenze: Competenza[];
}

const LevelCard: React.FC<{ livello: Livello }> = ({ livello }) => {
    const { nome, voto, descrizione } = livello;
    
    const getLevelStyle = (): string => {
        const lower = nome.toLowerCase();
        
        // DigComp Mapping (C2 -> A1)
        if (lower.includes('c2') || lower.includes('c1') || lower.includes('pioniere') || lower.includes('leader')) return 'level-avanzato';
        if (lower.includes('b2') || lower.includes('b1') || lower.includes('esperto') || lower.includes('integratore')) return 'level-intermedio';
        if (lower.includes('a2') || lower.includes('esploratore')) return 'level-base';
        if (lower.includes('a1') || lower.includes('novizio')) return 'level-iniziale';
        
        // Standard School Mapping (A -> D)
        if (lower.includes('avanzato') || lower.includes('a -')) return 'level-avanzato';
        if (lower.includes('intermedio') || lower.includes('b -')) return 'level-intermedio';
        if (lower.includes('base') || lower.includes('c -')) return 'level-base';
        if (lower.includes('iniziale') || lower.includes('d -')) return 'level-iniziale';
        
        return 'level-default';
    };

    const cardClass = getLevelStyle();

    return (
        <div className={`level-card ${cardClass}`}>
            <div className="level-card-icon">
                <span className="material-symbols-outlined text-2xl">
                    {cardClass === 'level-avanzato' ? 'workspace_premium' : 
                     cardClass === 'level-intermedio' ? 'star' :
                     cardClass === 'level-base' ? 'verified' :
                     cardClass === 'level-iniziale' ? 'support' : 'label'}
                </span>
            </div>
            <div className="flex-grow">
                <div className="flex justify-between items-baseline mb-4">
                    <h3 className="text-[var(--md-sys-typescale-headline-small)] font-[var(--md-sys-typescale-headline-small-font)] font-bold">{nome}</h3>
                    <span className="m3-label-medium bg-surface/50 px-4 py-0.5 rounded">Valore: {voto}</span>
                </div>
                <p className="text-[var(--md-sys-typescale-body-medium)] font-[var(--md-sys-typescale-body-medium-font)] opacity-90">{descrizione}</p>
            </div>
        </div>
    );
};

const CompetencyLevelsView: React.FC<CompetencyLevelsViewProps> = ({ competenze }) => {
    
    return (
        <div className="space-y-6 p-8 pb-20">
            <div className="page-header-compact">
                <div className="page-header-title-group">
                    <h1 className="m3-headline-medium">Descrittori Competenze</h1>
                    <p className="page-subtitle">
                        Livelli di padronanza per le competenze attive (DigCompEdu 3.0 / Standard).
                    </p>
                </div>
            </div>

            {competenze.map(competenza => (
                <div key={competenza.id} className="card">
                    <div className="mb-8 border-b border-[var(--md-sys-color-outline-variant)] pb-2">
                        <h2 className="text-[var(--md-sys-typescale-headline-small)] font-[var(--md-sys-typescale-headline-small-font)] text-primary">{competenza.nome}</h2>
                        <span className="m3-label-small text-[var(--md-sys-color-on-surface)]-variant bg-[var(--md-sys-color-surface-container-high)] px-4 py-1 rounded">
                            {competenza.framework || 'Framework Standard'}
                        </span>
                    </div>
                    <div className="space-y-0">
                        {competenza.livelli.map(livello => (
                           <LevelCard key={livello.id} livello={livello} />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default CompetencyLevelsView;
