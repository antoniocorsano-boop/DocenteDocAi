import React from 'react';

interface AiMemoryChipProps {
    label: string;
}

const AiMemoryChip: React.FC<AiMemoryChipProps> = ({ label }) => (
    <div 
        className="flex items-center gap-2 px-3 py-1.5 min-h-[32px] opacity-60 hover:opacity-100 transition-opacity select-none cursor-help bg-tertiary-container/20 rounded-full border border-tertiary/10" 
        title="Contesto utilizzato dall'AI"
        role="note"
        aria-label={`Contesto AI: ${label}`}
    >
        <span className="material-symbols-outlined text-sm text-tertiary font-bold animate-pulse">psychology</span>
        <span className="text-xs font-extrabold text-tertiary uppercase tracking-widest">{label}</span>
    </div>
);

export default AiMemoryChip;
