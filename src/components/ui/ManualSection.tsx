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
    const { layers } = useTheme();
    const { sys, ref, motion, elevation } = layers;

    return (
        <details
            style={{
                border: 'none',
                backgroundColor: sys.color.surfaceContainerLow,
                opacity: 0.5,
                backdropFilter: 'blur(4px)',
                WebkitBackdropFilter: 'blur(4px)',
                borderRadius: ref.shape.corner.large,
                marginBottom: layers.ref.spacing['4'],
                overflow: 'hidden',
                transition: `all ${motion.duration.medium2} ${motion.easing.standard}`
            }}
            open={isOpen}
            onToggle={(e) => setIsOpen((e.target as HTMLDetailsElement).open)}
        >
            <summary
                style={{
                    padding: `${layers.ref.spacing['4']} ${layers.ref.spacing['4']}`,
                    backgroundColor: summaryHovered ? sys.color.surfaceContainerHigh : 'transparent',
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
                <div style={{ display: 'flex', alignItems: 'center', gap: layers.ref.spacing['4'] }}>
                    <div
                        style={{
                            padding: layers.ref.spacing['6'],
                            borderRadius: ref.shape.corner.large,
                            backgroundColor: sys.color.surfaceContainerHigh,
                            boxShadow: elevation.level1,
                            transform: iconHovered ? 'scale(1.1)' : 'scale(1)',
                            transition: `transform ${motion.duration.short3} ${motion.easing.standard}`
                        }}
                        onMouseEnter={() => setIconHovered(true)}
                        onMouseLeave={() => setIconHovered(false)}
                    >
                        <span
                            style={{
                                fontFamily: 'Material Symbols Outlined',
                                fontSize: ref.typography.headlineSmall.fontSize,
                                fontWeight: ref.typography.headlineSmall.fontWeight,
                                lineHeight: ref.typography.headlineSmall.lineHeight,
                                color: sys.color.onSurfaceVariant
                            }}
                        >
                            {icon}
                        </span>
                    </div>
                    <h3
                        style={{
                            fontSize: ref.typography.headlineMedium.fontSize,
                            fontWeight: '900',
                            lineHeight: ref.typography.headlineMedium.lineHeight,
                            letterSpacing: ref.typography.headlineMedium.letterSpacing,
                            margin: 0
                        }}
                    >
                        {title}
                    </h3>
                </div>
                <div
                    style={{
                        width: layers.ref.spacing['8'],
                        height: layers.ref.spacing['8'],
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: sys.color.outlineVariant,
                        opacity: 0.2,
                        transition: `transform ${motion.duration.medium2} ${motion.easing.emphasized}`,
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)'
                    }}
                >
                    <span
                        style={{fontFamily: 'Material Symbols Outlined',
                            fontSize: 'var(--md-sys-typescale-body-large-font-size)',
                            color: ' layers.sys.color.onPrimary'}}
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







