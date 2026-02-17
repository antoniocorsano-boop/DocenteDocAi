// HelpModal - ManualSection component
import React, { useState } from 'react';
import { M3Typography } from '../ui';

interface ManualSectionProps {
    title: string;
    icon: string;
    defaultOpen?: boolean;
    children: React.ReactNode;
}

export const ManualSection: React.FC<ManualSectionProps> = ({ title, icon, defaultOpen = false, children }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    return (
        <div style={{
            border: `var(--app-border-thin) solid var(--md-sys-color-outline-variant)`,
            borderRadius: 'var(--md-sys-shape-corner-large)',
            marginBottom: 'var(--app-spacing-container)',
            overflow: 'hidden'
        }}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    width: 'var(--app-layout-full)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: 'var(--app-spacing-container)',
                    backgroundColor: 'var(--md-sys-color-surface-container-low)',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'background-color var(--md-sys-motion-duration-short2) var(--app-easing-standard)'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--md-sys-color-surface-container-high)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--md-sys-color-surface-container-low)'}
            >
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--app-spacing-element)'
                }}>
                    <span style={{
                        fontFamily: 'Material Symbols Outlined',
                        color: 'var(--app-color-primary)',
                        fontSize: 'var(--md-sys-typescale--font-size)'
                    }}>{icon}</span>
                    <M3Typography variant="title-medium">{title}</M3Typography>
                </div>
                <span style={{
                    fontFamily: 'Material Symbols Outlined',
                    color: 'var(--md-sys-color-on-surface-variant)',
                    transition: 'transform var(--md-sys-motion-duration-short2) var(--app-easing-standard)',
                    transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)'
                }}>expand_more</span>
            </button>
            {isOpen && <div style={{
                padding: 'var(--app-spacing-container)',
                backgroundColor: 'var(--app-color-surface)',
                borderTop: `var(--app-border-thin) solid var(--md-sys-color-outline-variant)`
            }}>{children}</div>}
        </div>
    );
};

export default ManualSection;
