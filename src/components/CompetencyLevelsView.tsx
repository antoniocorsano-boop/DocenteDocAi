// MD3 GOLD COMPLIANT — AUDIT 2026-01-25
// Tutti i valori di design (colori, spacing, tipografia, elevazione, shape) sono gestiti esclusivamente tramite token MD3 (`var(--md-sys-*)`).
// Nessun valore hardcoded (px, rem, %, hex, rgba) presente. Nessun uso di className custom. Conforme a MD3_GOVERNANCE_COMPLIANCE_CONTRACT.md.
// Audit e refactor completati: 2026-01-25.

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

    const cardStyle: React.CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--md-sys-spacing-8)',
        backgroundColor:
            cardClass === 'level-avanzato' ? 'var(--md-sys-color-primary-container)' :
            cardClass === 'level-intermedio' ? 'var(--md-sys-color-secondary-container)' :
            cardClass === 'level-base' ? 'var(--md-sys-color-tertiary-container)' :
            cardClass === 'level-iniziale' ? 'var(--md-sys-color-surface-container-low)' :
            'var(--md-sys-color-surface)',
        color:
            cardClass === 'level-avanzato' ? 'var(--md-sys-color-on-primary-container)' :
            cardClass === 'level-intermedio' ? 'var(--md-sys-color-on-secondary-container)' :
            cardClass === 'level-base' ? 'var(--md-sys-color-on-tertiary-container)' :
            cardClass === 'level-iniziale' ? 'var(--md-sys-color-on-surface-variant)' :
            'var(--md-sys-color-on-surface)',
        borderRadius: 'var(--md-sys-shape-corner-large)',
        boxShadow: 'var(--md-sys-elevation-level1)',
        padding: 'var(--md-sys-spacing-8)',
        marginBottom: 'var(--md-sys-spacing-8)'
    };

    return (
        <div style={cardStyle}>
            <div >
                <span  style={{ fontSize: "var(--md-sys-typescale-headline-medium-size)" }}>
                    {cardClass === 'level-avanzato' ? 'workspace_premium' : 
                     cardClass === 'level-intermedio' ? 'star' :
                     cardClass === 'level-base' ? 'verified' :
                     cardClass === 'level-iniziale' ? 'support' : 'label'}
                </span>
            </div>
            <div style={{ flexGrow: "1" }}>
                <div style={{display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 'var(--md-sys-spacing-4)'}}>
                    <h3 style={{ color: 'var(--md-sys-color-on-surface)' ,  fontWeight: "var(--md-sys-typescale-weight-bold)" }}>{nome}</h3>
                    <span style={{ backgroundColor: 'var(--md-sys-color-surface-container-high)' , paddingLeft: 'var(--md-sys-spacing-4)', paddingRight: 'var(--md-sys-spacing-4)', borderRadius: "var(--md-sys-spacing-3)"}}>Valore: {voto}</span>
                </div>
                <p style={{ color: 'var(--md-sys-color-on-surface-variant)' ,  opacity: "var(--md-sys-state-opacity-hover-overlay)" }}>{descrizione}</p>
            </div>
        </div>
    );
};

const CompetencyLevelsView: React.FC<CompetencyLevelsViewProps> = ({ competenze }) => {
    
    return (
        <div  style={{gap: 'var(--md-sys-spacing-6)', padding: 'var(--md-sys-spacing-8)'}}>
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
                    <div  style={{marginBottom: 'var(--md-sys-spacing-8)', borderBottom: "var(--md-sys-border-width-thin) solid var(--md-sys-color-outline)"}}>
                        <h2 style={{ color: "var(--md-sys-color-primary)" }}>{competenza.nome}</h2>
                        <span style={{ color: 'var(--md-sys-color-on-surface-variant)', backgroundColor: 'var(--md-sys-color-surface-container-high)' , paddingLeft: 'var(--md-sys-spacing-4)', paddingRight: 'var(--md-sys-spacing-4)', borderRadius: "var(--md-sys-spacing-3)"}}>
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

