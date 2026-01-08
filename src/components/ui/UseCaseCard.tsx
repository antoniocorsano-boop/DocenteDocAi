import React from 'react';

interface UseCaseCardProps {
    scenario: string;
    steps: string[];
    tip?: string;
}

const UseCaseCard: React.FC<UseCaseCardProps> = ({ scenario, steps, tip }) => (
    <div className="bg-surface/80 backdrop-blur-md p-6 rounded-[var(--md-sys-shape-corner-extra-large)] border border-[var(--md-sys-color-outline-variant)]/30 shadow-sm hover:shadow-[var(--md-sys-elevation-level1)] transition-shadow">
        <div className="flex items-center gap-6 mb-8">
            <div className="w-8 h-8 rounded-[var(--md-sys-shape-corner-small)] bg-primary/10 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-lg">lightbulb</span>
            </div>
            <p className="m3-label-small text-primary uppercase font-black tracking-[0.2em] opacity-70">Scenario</p>
        </div>
        <p className="m3-title-large font-extrabold mb-5 leading-tight italic">"{scenario}"</p>
        <ol className="space-y-4">
            {steps.map((step, i) => (
                <li key={i} className="flex gap-8 items-start group">
                    <span className="w-6 h-6 rounded-full bg-[var(--md-sys-color-surface-container-high)]est flex items-center justify-center text-[10px] font-black flex-shrink-0 mt-0.5 group-hover:bg-primary group-hover:text-on-primary transition-colors">{i + 1}</span>
                    <p className="text-[var(--md-sys-typescale-body-medium)] font-[var(--md-sys-typescale-body-medium-font)] text-[var(--md-sys-color-on-surface)]-variant font-bold leading-relaxed" dangerouslySetInnerHTML={{ __html: step }}></p>
                </li>
            ))}
        </ol>
        {tip && (
            <div className="mt-8 flex gap-8 p-8 bg-secondary-container/30 rounded-[var(--md-sys-shape-corner-medium)] text-sm border border-secondary/10">
                <span className="material-symbols-outlined text-secondary font-black">tips_and_updates</span>
                <span className="font-bold italic text-on-secondary-container opacity-80">{tip}</span>
            </div>
        )}
    </div>
);

export default UseCaseCard;


