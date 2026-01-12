import React from 'react';

interface UseCaseCardProps {
    scenario: string;
    steps: string[];
    tip?: string;
}

const UseCaseCard: React.FC<UseCaseCardProps> = ({ scenario, steps, tip }) => (
    <div className="bg-surface/80 backdrop-blur-md rounded-[var(--md-sys-shape-corner-extra-large)] border-[var(--md-sys-color-outline-variant)]/30 shadow-sm hover:shadow-[var(--md-sys-elevation-level1)] transition-shadow" style={{ padding: "var(--md-sys-spacing-6)", border: "1px solid var(--md-sys-color-outline)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--md-sys-spacing-6)", marginBottom: "var(--md-sys-spacing-8)" }}>
            <div className="rounded-[var(--md-sys-shape-corner-small)] bg-primary/10" style={{ width: "2rem", height: "2rem", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--md-sys-color-primary)" }}>
                <span className="material-symbols-outlined" style={{ fontSize: "1.125rem" }}>lightbulb</span>
            </div>
            <p className="m3-label-small tracking-[0.2em]" style={{ color: "var(--md-sys-color-primary)", textTransform: "uppercase", fontWeight: "900", opacity: "0.7" }}>Scenario</p>
        </div>
        <p className="m3-title-large font-extrabold mb-5 italic" style={{ lineHeight: "1.25" }}>"{scenario}"</p>
        <ol style={{
  marginTop: 'var(--md-sys-spacing-4)'
}}>
            {steps.map((step, i) => (
                <li key={i} className="group" style={{ display: "flex", gap: "var(--md-sys-spacing-8)", alignItems: "flex-start" }}>
                    <span className="bg-[var(--md-sys-color-surface-container-high)]est text-[10px] mt-0.5 group-hover:bg-primary group-hover:text-on-primary" style={{ width: "1.5rem", height: "1.5rem", borderRadius: "9999px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "900", flexShrink: "0", transition: "color 300ms" }}>{i + 1}</span>
                    <p className="text-[var(--md-sys-typescale-body-medium)] font-[var(--md-sys-typescale-body-medium-font)] text-[var(--md-sys-color-on-surface)]-variant" style={{ fontWeight: "bold", lineHeight: "1.625" }} dangerouslySetInnerHTML={{ __html: step }}></p>
                </li>
            ))}
        </ol>
        {tip && (
            <div className="mt-8 bg-secondary-container/30 rounded-[var(--md-sys-shape-corner-medium)] border-secondary/10" style={{ display: "flex", gap: "var(--md-sys-spacing-8)", padding: "var(--md-sys-spacing-8)", fontSize: "0.875rem", border: "1px solid var(--md-sys-color-outline)" }}>
                <span className="material-symbols-outlined" style={{ color: "var(--md-sys-color-secondary)", fontWeight: "900" }}>tips_and_updates</span>
                <span className="italic text-on-secondary-container" style={{ fontWeight: "bold", opacity: "0.8" }}>{tip}</span>
            </div>
        )}
    </div>
);

export default UseCaseCard;


