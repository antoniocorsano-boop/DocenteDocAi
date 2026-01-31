/* GENERATED: MD3 Platinum Recovery - DO NOT EDIT MANUALLY */

// MD3 Compliant - Block G Migration (13 violations eliminated)
// @legacy
// @md3-noncompliant
// @do-not-extend

import React from 'react';

interface UseCaseCardProps {
    scenario: string;
    steps: string[];
    tip?: string;
}

const UseCaseCard: React.FC<UseCaseCardProps> = ({ scenario, steps, tip }) => {
    return (
        <div style={{
            backgroundColor: 'var(--md-sys-color-surface)',
            borderRadius: 'var(--md-sys-shape-corner-medium)',
            padding: 'var(--md-sys-spacing-6)',
            border: 'var(--md-sys-border-width-normal) solid var(--md-sys-color-outline)'
        }}>
            <div style={{
                display: "flex",
                alignItems: "center",
                gap: 'var(--md-sys-spacing-6)',
                marginBottom: 'var(--md-sys-spacing-8)'
            }}>
                <div style={{
                    borderRadius: 'var(--md-sys-shape-corner-medium)',
                    backgroundColor: 'var(--md-sys-color-primary)',
                    width: 'var(--md-sys-spacing-32)',
                    height: 'var(--md-sys-spacing-32)',
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: 'var(--md-sys-color-on-primary)'
                }}>
                    <span style={{ fontSize: 'var(--md-sys-typescale-title-large-font-size)' }}>lightbulb</span>
                </div>
                <p style={{
                    color: 'var(--md-sys-color-primary)',
                    textTransform: "uppercase",
                    fontWeight: "900",
                    opacity: "0.7"
                }}>Scenario</p>
            </div>
            <p style={{ lineHeight: "1.25" }}>"{scenario}"</p>
            <ol style={{ marginTop: 'var(--md-sys-spacing-4)' }}>
                {steps.map((step, i) => (
                    <li key={i} style={{
                        display: "flex",
                        gap: 'var(--md-sys-spacing-8)',
                        alignItems: "flex-start"
                    }}>
                        <span style={{
                            backgroundColor: 'var(--md-sys-color-surface)',
                            color: 'var(--md-sys-color-primary)',
                            width: 'var(--md-sys-spacing-6)',
                            height: 'var(--md-sys-spacing-6)',
                            borderRadius: 'var(--md-sys-shape-corner-full)',
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: "900",
                            flexShrink: "0",
                            transition: `color var(--md-sys-motion-duration-medium)`
                        }}>{i + 1}</span>
                        <p style={{
                            color: 'var(--md-sys-color-outline)',
                            fontWeight: "bold",
                            lineHeight: 'var(--md-sys-typescale-body-large-font-size-line-height)'
                        }} dangerouslySetInnerHTML={{ __html: step }}></p>
                    </li>
                ))}
            </ol>
            {tip && (
                <div style={{
                    backgroundColor: 'var(--md-sys-color-surface)',
                    borderRadius: 'var(--md-sys-shape-corner-medium)',
                    display: "flex",
                    gap: 'var(--md-sys-spacing-8)',
                    padding: 'var(--md-sys-spacing-8)',
                    fontSize: 'var(--md-sys-typescale-body-large-font-size)',
                    border: 'var(--md-sys-border-width-normal) solid var(--md-sys-color-outline)'
                }}>
                    <span style={{
                        color: 'var(--md-sys-color-primary)',
                        fontWeight: "900"
                    }}>tips_and_updates</span>
                    <span style={{
                        color: 'var(--md-sys-color-outline)',
                        fontWeight: "bold",
                        opacity: "0.8"
                    }}>{tip}</span>
                </div>
            )}
        </div>
    );
};

export default UseCaseCard;











// TODO: Add Playwright snapshot test and link to CHECKLIST.md phase X
