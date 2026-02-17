// MD3 Compliant - Block G Migration (13 violations eliminated)
// @legacy
// @md3-noncompliant
// @do-not-extend

import React from 'react';
import { sanitizeHtml } from '../../utils/htmlSanitizer';

interface UseCaseCardProps {
    scenario: string;
    steps: string[];
    tip?: string;
}

const UseCaseCard: React.FC<UseCaseCardProps> = ({ scenario, steps, tip }) => {
    return (
        <div style={{
            backgroundColor: 'var(--app-color-surface)',
            borderRadius: 'var(--md-sys-shape-corner-medium)',
            padding: 'var(--app-spacing-section)',
            border: 'var(--app-border-normal) solid var(--md-sys-color-outline)'
        }}>
            <div style={{
                display: "flex",
                alignItems: "center",
                gap: 'var(--app-spacing-section)',
                marginBottom: 'var(--md-sys-spacing-8)'
            }}>
                <div style={{
                    borderRadius: 'var(--md-sys-shape-corner-medium)',
                    backgroundColor: 'var(--app-color-primary)',
                    width: 'var(--md-sys-spacing-32)',
                    height: 'var(--md-sys-spacing-32)',
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: 'var(--app-color-on-primary)'
                }}>
                    <span style={{ fontSize: 'var(--app-text-title)' }}>lightbulb</span>
                </div>
                <p style={{
                    color: 'var(--app-color-primary)',
                    textTransform: "uppercase",
                    fontWeight: "900",
                    opacity: "0.7"
                }}>Scenario</p>
            </div>
            <p style={{ lineHeight: "1.25" }}>"{scenario}"</p>
            <ol style={{ marginTop: 'var(--app-spacing-container)' }}>
                {steps.map((step, i) => (
                    <li key={i} style={{
                        display: "flex",
                        gap: 'var(--md-sys-spacing-8)',
                        alignItems: "flex-start"
                    }}>
                        <span style={{
                            backgroundColor: 'var(--app-color-surface)',
                            color: 'var(--app-color-primary)',
                            width: 'var(--app-spacing-section)',
                            height: 'var(--app-spacing-section)',
                            borderRadius: 'var(--md-sys-shape-corner-full)',
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: "900",
                            flexShrink: "0",
                            transition: `color var(--app-motion-standard)`
                        }}>{i + 1}</span>
                        <p style={{
                            color: 'var(--md-sys-color-outline)',
                            fontWeight: "bold",
                            lineHeight: 'var(--app-text-body-line-height)'
                        }} dangerouslySetInnerHTML={{ __html: sanitizeHtml(step) }}></p>
                    </li>
                ))}
            </ol>
            {tip && (
                <div style={{
                    backgroundColor: 'var(--app-color-surface)',
                    borderRadius: 'var(--md-sys-shape-corner-medium)',
                    display: "flex",
                    gap: 'var(--md-sys-spacing-8)',
                    padding: 'var(--md-sys-spacing-8)',
                    fontSize: 'var(--app-text-body)',
                    border: 'var(--app-border-normal) solid var(--md-sys-color-outline)'
                }}>
                    <span style={{
                        color: 'var(--app-color-primary)',
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








