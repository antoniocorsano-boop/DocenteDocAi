import React from 'react';
import { useTheme } from '../../theme/theme';

interface QuizSkeletonProps {
    questions?: number;
}

const QuizSkeleton: React.FC<QuizSkeletonProps> = ({
    questions = 5
}) => {
    const { spacing } = useTheme();

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[4] }}>
            {Array.from({ length: questions }).map((_, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: spacing[2] }}>
                    {/* Question skeleton */}
                    <div
                        style={{
                            height: '20px',
                            backgroundColor: 'var(--md-sys-color-surface-container-high)',
                            borderRadius: 'var(--md-sys-shape-corner-small)',
                            animation: 'pulse 2s ease-in-out infinite',
                            width: '85%'
                        }}
                    />

                    {/* Answer options skeleton */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[1], marginLeft: spacing[4] }}>
                        {Array.from({ length: 4 }).map((_, j) => (
                            <div
                                key={j}
                                style={{
                                    height: '16px',
                                    backgroundColor: 'var(--md-sys-color-surface-container-high)',
                                    borderRadius: 'var(--md-sys-shape-corner-small)',
                                    animation: 'pulse 2s ease-in-out infinite',
                                    width: '70%',
                                    animationDelay: `${(i * 4 + j) * 0.05}s`
                                }}
                            />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default QuizSkeleton;


