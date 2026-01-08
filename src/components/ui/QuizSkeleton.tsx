import React from 'react';

interface QuizSkeletonProps {
    questions?: number;
    className?: string;
}

const QuizSkeleton: React.FC<QuizSkeletonProps> = ({ 
    questions = 5, 
    className = '' 
}) => (
    <div className={`space-y-4 ${className}`}>
        {Array.from({ length: questions }).map((_, i) => (
            <div key={i} className="space-y-2">
                {/* Question skeleton */}
                <div className="h-5 bg-[var(--md-sys-color-surface-container-high)] rounded animate-pulse" style={{ width: '85%' }} />
                
                {/* Answer options skeleton */}
                <div className="space-y-1 ml-4">
                    {Array.from({ length: 4 }).map((_, j) => (
                        <div
                            key={j}
                            className="h-4 bg-[var(--md-sys-color-surface-container-high)] rounded animate-pulse"
                            style={{
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

export default QuizSkeleton;


