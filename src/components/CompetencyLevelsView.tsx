// LEGACY - MD3 Non-compliant

import React from 'react';
import { Competenza, Livello } from '../types';
import { useTheme } from '../theme/theme';

interface CompetencyLevelsViewProps {
    competenze: Competenza[];
}

const LevelCard: React.FC<{ livello: Livello }> = ({ livello }) => {
  const { layers } = useTheme();
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
            <div >
                <span  style={{ fontSize: "1.5rem" }}>
                    {cardClass === 'level-avanzato' ? 'workspace_premium' : 
                     cardClass === 'level-intermedio' ? 'star' :
                     cardClass === 'level-base' ? 'verified' :
                     cardClass === 'level-iniziale' ? 'support' : 'label'}
                </span>
            </div>
            <div style={{ flexGrow: "1" }}>
                <div style={{display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: layers.ref.spacing['4']}}>
                    <h3 style={{ color: layers.sys.color.onSurface }} style={{ fontWeight: "bold" }}>{nome}</h3>
                    <span style={{ backgroundColor: layers.sys.color.surfaceContainerHigh }} style={{paddingLeft: layers.ref.spacing['4'], paddingRight: layers.ref.spacing['4'], borderRadius: "0.375rem"}}>Valore: {voto}</span>
                </div>
                <p style={{ color: layers.sys.color.onSurfaceVariant }} style={{ opacity: "0.9" }}>{descrizione}</p>
            </div>
        </div>
    );
};

const CompetencyLevelsView: React.FC<CompetencyLevelsViewProps> = ({ competenze }) => {
    
    return (
        <div  style={{gap: layers.ref.spacing['6'], padding: layers.ref.spacing['8']}}>
            <div >
                <div >
                    <h1 >Descrittori Competenze</h1>
                    <p >
                        Livelli di padronanza per le competenze attive (DigCompEdu 3.0 / Standard).
                    </p>
                </div>
            </div>

            {competenze.map(competenza => (
                <div key={competenza.id} >
                    <div  style={{marginBottom: layers.ref.spacing['8'], borderBottom: "1px solid layers.sys.color.outline"}}>
                        <h2 style={{ color: "layers.sys.color.primary" }}>{competenza.nome}</h2>
                        <span style={{ color:  layers.sys.color.onSurfaceVariant, backgroundColor:  layers.sys.color.surfaceContainerHigh }} style={{paddingLeft: layers.ref.spacing['4'], paddingRight: layers.ref.spacing['4'], borderRadius: "0.375rem"}}>
                            {competenza.framework || 'Framework Standard'}
                        </span>
                    </div>
                    <div >
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







