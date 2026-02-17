// HelpModal - UseCaseCard component
import React from 'react';
import { M3Typography } from '../ui';
import { sanitizeHtml } from '../../utils/htmlSanitizer';

interface UseCaseCardProps {
    scenario: string;
    steps: string[];
    tip?: string;
}

export const UseCaseCard: React.FC<UseCaseCardProps> = ({ scenario, steps, tip }) => (
    <div style={{
        backgroundColor: 'var(--md-sys-color-surface-container-low)',
        borderRadius: 'var(--md-sys-shape-corner-large)',
        padding: 'var(--app-spacing-container)',
        border: `var(--app-border-thin) solid var(--md-sys-color-outline-variant)`
    }}>
        <M3Typography variant="body-large" style={{
            fontWeight: 'bold',
            color: 'var(--app-color-primary)',
            marginBottom: 'var(--app-spacing-element)'
        }}>{scenario}</M3Typography>
        <ol style={{
            margin: 0,
            paddingLeft: 'var(--app-spacing-touch)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--app-spacing-component)'
        }}>
            {steps.map((step, i) => (
                <li key={i} style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 'var(--app-spacing-component)',
                    color: 'var(--app-color-on-surface)'
                }}>
                    <span style={{
                        fontFamily: 'Material Symbols Outlined',
                        color: 'var(--app-color-primary)',
                        fontSize: 'var(--md-sys-typescale--font-size)',
                        marginTop: 'var(--md-sys-spacing-1)',
                        flexShrink: 0
                    }}>check_circle</span>
                    <span dangerouslySetInnerHTML={{ __html: sanitizeHtml(step) }}></span>
                </li>
            ))}
        </ol>
        {tip && (
            <div style={{
                marginTop: 'var(--app-spacing-element)',
                padding: 'var(--app-spacing-component)',
                backgroundColor: 'var(--app-color-primary-container)',
                borderRadius: 'var(--md-sys-shape-corner-medium)',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--app-spacing-component)'
            }}>
                <span style={{
                    fontFamily: 'Material Symbols Outlined',
                    color: 'var(--app-color-primary)'
                }}>lightbulb</span>
                <M3Typography variant="body-small" style={{ color: 'var(--app-color-on-primary-container)' }}>
                    {tip}
                </M3Typography>
            </div>
        )}
    </div>
);

export default UseCaseCard;
