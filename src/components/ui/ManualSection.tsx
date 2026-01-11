import React from 'react';
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
    const { spacing, motion } = useTheme();
    const [isOpen, setIsOpen] = React.useState(defaultOpen);
    const expandIconRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (expandIconRef.current) {
            expandIconRef.current.style.transform = isOpen ? 'rotate(180deg)' : 'rotate(0deg)';
        }
    }, [isOpen]);

    return (
        <details
            style={{
                border: 'none',
                backgroundColor: 'var(--md-sys-color-surface-container-low)',
                opacity: 0.5,
                backdropFilter: 'blur(4px)',
                WebkitBackdropFilter: 'blur(4px)',
                borderRadius: 'var(--md-sys-shape-corner-large)',
                marginBottom: spacing[6],
                overflow: 'hidden',
                transition: `all ${motion.duration.medium2} ${motion.easing.standard}`
            }}
            open={isOpen}
            onToggle={(e) => setIsOpen((e.target as HTMLDetailsElement).open)}
        >
            <summary
                style={{
                    padding: `${spacing[5]} ${spacing[6]}`,
                    backgroundColor: 'transparent',
                    cursor: 'pointer',
                    listStyle: 'none',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    transition: `background-color ${motion.duration.short3} ${motion.easing.standard}`
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--md-sys-color-surface-container-high)';
                    e.currentTarget.style.opacity = '0.8';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: spacing[5] }}>
                    <div
                        style={{
                            padding: spacing[6],
                            borderRadius: 'var(--md-sys-shape-corner-large)',
                            backgroundColor: 'var(--md-sys-color-surface-container-high)',
                            boxShadow: 'var(--md-sys-elevation-shadow-1)',
                            transition: `transform ${motion.duration.short3} ${motion.easing.standard}`
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'scale(1.1)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'scale(1)';
                        }}
                    >
                        <span
                            style={{
                                fontFamily: 'Material Symbols Outlined',
                                fontSize: 'var(--md-sys-typescale-headline-small-font-size)',
                                fontWeight: 'var(--md-sys-typescale-headline-small-font-weight)',
                                lineHeight: 'var(--md-sys-typescale-headline-small-line-height)',
                                color: 'var(--md-sys-color-on-surface-variant)'
                            }}
                        >
                            {icon}
                        </span>
                    </div>
                    <h3
                        style={{
                            fontSize: 'var(--md-sys-typescale-headline-medium-font-size)',
                            fontWeight: '900',
                            lineHeight: 'var(--md-sys-typescale-headline-medium-line-height)',
                            letterSpacing: 'var(--md-sys-typescale-headline-medium-tracking)',
                            margin: 0
                        }}
                    >
                        {title}
                    </h3>
                </div>
                <div
                    ref={expandIconRef}
                    style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'var(--md-sys-color-outline-variant)',
                        opacity: 0.2,
                        transition: `transform ${motion.duration.medium2} ${motion.easing.emphasized}`,
                        transform: 'rotate(0deg)'
                    }}
                >
                    <span
                        style={{
                            fontFamily: 'Material Symbols Outlined',
                            fontSize: 'var(--md-sys-typescale-body-large-font-size)',
                            color: 'var(--md-sys-color-on-surface)'
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


