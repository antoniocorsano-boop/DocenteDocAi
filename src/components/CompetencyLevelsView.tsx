
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
                <span className="material-symbols-outlined" style={{ fontSize: "1.5rem" }}>
                    {cardClass === 'level-avanzato' ? 'workspace_premium' : 
                     cardClass === 'level-intermedio' ? 'star' :
                     cardClass === 'level-base' ? 'verified' :
                     cardClass === 'level-iniziale' ? 'support' : 'label'}
                </span>
            </div>
            <div style={{ flexGrow: "1" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "var(--md-sys-spacing-4)" }}>
                    <h3 className="text-[var(--md-sys-typescale-headline-small)] font-[var(--md-sys-typescale-headline-small-font)]" style={{ fontWeight: "bold" }}>{nome}</h3>
                    <span className="m3-label-medium bg-surface/50 py-0.5" style={{ paddingLeft: "var(--md-sys-spacing-4)", paddingRight: "var(--md-sys-spacing-4)", borderRadius: "0.375rem" }}>Valore: {voto}</span>
                </div>
                <p className="text-[var(--md-sys-typescale-body-medium)] font-[var(--md-sys-typescale-body-medium-font)]" style={{ opacity: "0.9" }}>{descrizione}</p>
            </div>
        </div>
    );
};

const CompetencyLevelsView: React.FC<CompetencyLevelsViewProps> = ({ competenze }) => {
    
    return (
        <div className="pb-20" style={{ gap: "var(--md-sys-spacing-6)", padding: "var(--md-sys-spacing-8)" }}>
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
                    <div className="border-[var(--md-sys-color-outline-variant)] pb-2" style={{ marginBottom: "var(--md-sys-spacing-8)", borderBottom: "1px solid var(--md-sys-color-outline)" }}>
                        <h2 className="text-[var(--md-sys-typescale-headline-small)] font-[var(--md-sys-typescale-headline-small-font)]" style={{ color: "var(--md-sys-color-primary)" }}>{competenza.nome}</h2>
                        <span className="m3-label-small text-[var(--md-sys-color-on-surface)]-variant bg-[var(--md-sys-color-surface-container-high)] py-1" style={{ paddingLeft: "var(--md-sys-spacing-4)", paddingRight: "var(--md-sys-spacing-4)", borderRadius: "0.375rem" }}>
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


