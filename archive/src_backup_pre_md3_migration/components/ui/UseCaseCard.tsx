// LEGACY - MD3 Non-compliant
// @legacy
// @md3-noncompliant
// @do-not-extend

import React from 'react';
import { useTheme } from '../../theme/M3ThemeProvider';

interface UseCaseCardProps {
    scenario: string;
    steps: string[];
    tip?: string;
}

const UseCaseCard: React.FC<UseCaseCardProps> = ({ scenario, steps, tip }) => {
    const { layers } = useTheme();
    const {
        sys: { color: { surface, primary, outline } },
        ref: { spacing, shape: { corner: { medium } } }
    } = layers;

    return (
        <div style={{
            backgroundColor: surface,
            borderRadius: medium,
            padding: spacing[6],
            border: `1px solid ${outline}`
        }}>
            <div style={{
                display: "flex",
                alignItems: "center",
                gap: spacing[6],
                marginBottom: spacing[8]
            }}>
                <div style={{
                    borderRadius: medium,
                    backgroundColor: primary,
                    width: spacing[32],
                    height: spacing[32],
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: primary
                }}>
                    <span style={{ fontSize: "1.125rem" }}>lightbulb</span>
                </div>
                <p style={{
                    color: primary,
                    textTransform: "uppercase",
                    fontWeight: "900",
                    opacity: "0.7"
                }}>Scenario</p>
            </div>
            <p style={{ lineHeight: "1.25" }}>"{scenario}"</p>
            <ol style={{ marginTop: spacing[4] }}>
                {steps.map((step, i) => (
                    <li key={i} style={{
                        display: "flex",
                        gap: spacing[8],
                        alignItems: "flex-start"
                    }}>
                        <span style={{
                            backgroundColor: surface,
                            color: primary,
                            width: "1.5rem",
                            height: "1.5rem",
                            borderRadius: "9999px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: "900",
                            flexShrink: "0",
                            transition: "color 300ms"
                        }}>{i + 1}</span>
                        <p style={{
                            color: outline,
                            fontWeight: "bold",
                            lineHeight: "1.625"
                        }} dangerouslySetInnerHTML={{ __html: step }}></p>
                    </li>
                ))}
            </ol>
            {tip && (
                <div style={{
                    backgroundColor: surface,
                    borderRadius: medium,
                    display: "flex",
                    gap: spacing[8],
                    padding: spacing[8],
                    fontSize: "0.875rem",
                    border: `1px solid ${outline}`
                }}>
                    <span style={{
                        color: primary,
                        fontWeight: "900"
                    }}>tips_and_updates</span>
                    <span style={{
                        color: outline,
                        fontWeight: "bold",
                        opacity: "0.8"
                    }}>{tip}</span>
                </div>
            )}
        </div>
    );
};

export default UseCaseCard;



