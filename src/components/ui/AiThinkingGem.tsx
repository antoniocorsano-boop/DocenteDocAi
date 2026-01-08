import React from 'react';

interface AiThinkingGemProps {
    size?: 'small' | 'medium' | 'large';
    text?: string;
    inline?: boolean;
}

const AiThinkingGem: React.FC<AiThinkingGemProps> = ({ size = 'medium', text, inline = false }) => {
    const sizeMap = {
        small: { width: 32, height: 32, icon: 16 },
        medium: { width: 56, height: 56, icon: 28 },
        large: { width: 90, height: 90, icon: 44 }
    };
    
    const dim = sizeMap[size];

    return (
        <div className={`flex ${inline ? 'flex-row gap-8' : 'flex-col gap-8'} items-center justify-center`}>
            <div className="relative flex items-center justify-center" style={{ width: dim.width, height: dim.height }}>
                {/* Aura Ring */}
                <div 
                    className="absolute inset-0 rounded-full animate-pulse opacity-40" 
                    style={{ 
                        background: 'var(--md-sys-color-primary-container)',
                        transform: 'scale(1.2)'
                    }} 
                />
                
                {/* Rotating Thinking Ring */}
                <div 
                    className="absolute inset-0 rounded-full" 
                    style={{ 
                        background: 'conic-gradient(from 0deg, transparent 0%, var(--md-sys-color-primary) 50%, var(--sys-tertiary) 100%)',
                        maskImage: 'radial-gradient(closest-side, transparent 78%, black 82%)',
                        WebkitMaskImage: 'radial-gradient(closest-side, transparent 78%, black 82%)',
                        animation: 'spin 2s cubic-bezier(0.4, 0, 0.2, 1) infinite'
                    }} 
                />
                
                {/* The Core Gem */}
                <div className="relative z-10 w-full h-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary font-light" style={{ fontSize: dim.icon }}>
                        diamond
                    </span>
                </div>
            </div>
            {text && <p className="m3-label-large text-primary font-bold tracking-widest uppercase animate-pulse">{text}</p>}
            <style>{`
                @keyframes spin { 
                    from { transform: rotate(0deg); } 
                    to { transform: rotate(360deg); } 
                }
            `}</style>
        </div>
    );
};

export default AiThinkingGem;


