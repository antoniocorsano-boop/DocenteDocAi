// LEGACY - MD3 Non-compliant
import React, { useState } from 'react';
import { useTheme } from '../../theme/theme';

interface ManualSectionProps {
    title: string;
    icon: string;
    children: React.ReactNode;
    defaultOpen?: boolean;
}

const ManualSection: React.FC<ManualSectionProps> = ({
    title,
    icon,
    children,
    defaultOpen = false
}) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    const [summaryHovered, setSummaryHovered] = useState(false);
    const [iconHovered, setIconHovered] = useState(false);
    const { layers: { sys: { color }, ref: { spacing, shape, typography }, motion } } = useTheme();

    return (
        <details
            style={{
                border: 'none',
                backgroundColor: color.surfaceContainerLow,
                opacity: 0.5,
                backdropFilter: 'blur(var(--md-sys-blur-small))',
                WebkitBackdropFilter: 'blur(var(--md-sys-blur-small))',
                borderRadius: shape.corner.large,
                marginBottom: spacing[4],
                overflow: 'hidden',
                transition: `all ${motion.duration.medium2} ${motion.easing.standard}`
            }}
            open={isOpen}
            onToggle={(e) => setIsOpen((e.target as HTMLDetailsElement).open)}
        >
            <summary
                style={{
                    padding: `${spacing[4]} ${spacing[4]}`,
                    backgroundColor: summaryHovered ? color.surfaceContainerHigh : 'transparent',
                    opacity: summaryHovered ? 0.8 : undefined,
                    cursor: 'pointer',
                    listStyle: 'none',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    transition: `background-color ${motion.duration.short3} ${motion.easing.standard}`
                }}
                onMouseEnter={() => setSummaryHovered(true)}
                onMouseLeave={() => setSummaryHovered(false)}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: spacing[4] }}>
                    <div
                        style={{
                            padding: spacing[6],
                            borderRadius: shape.corner.large,
                            backgroundColor: color.surfaceContainerHigh,
                            boxShadow: 'var(--md-sys-elevation-level1)',
                            transform: iconHovered ? 'scale(1.1)' : 'scale(1)',
                            transition: `transform var(--md-sys-motion-duration-short) var(--md-sys-motion-easing-standard)`
                        }}
                        onMouseEnter={() => setIconHovered(true)}
                        onMouseLeave={() => setIconHovered(false)}
                    >
                        <span
                            style={{
                                fontFamily: 'Material Symbols Outlined',
                                fontSize: typography.headlineSmall.fontSize,
                                fontWeight: typography.headlineSmall.fontWeight,
                                lineHeight: typography.headlineSmall.lineHeight,
                                color: color.onSurfaceVariant
                            }}
                        >
                            {icon}
                        </span>
                    </div>
                    <h3
                        style={{
                            fontSize: typography.headlineMedium.fontSize,
                            fontWeight: '900',
                            lineHeight: typography.headlineMedium.lineHeight,
                            letterSpacing: typography.headlineMedium.letterSpacing,
                            margin: 0
                        }}
                    >
                        {title}
                    </h3>
                </div>
                <div
                    style={{
                        width: spacing[8],
                        height: spacing[8],
                        borderRadius: 'var(--md-sys-percent-50)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: color.outlineVariant,
                        opacity: 0.2,
                        transition: `transform ${motion.duration.medium2} ${motion.easing.emphasized}`,
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)'
                    }}
                >
                    <span
                        style={{
                            fontFamily: 'Material Symbols Outlined',
                            fontSize: 'var(--md-sys-typescale-body-large-font-size)',
                            color: color.onPrimary
                        }}
                    >
                        expand_more
                    </span>
                </div>
            </summary>
            <div
                style={{
                    padding: `${spacing[2]} ${spacing[6]} ${spacing[6]} ${spacing[6]}`,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: spacing[6]
                }}
            >
                {children}
            </div>
        </details>
    );
};

export default ManualSection;








