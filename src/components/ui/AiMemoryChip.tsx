import React from 'react';

interface AiMemoryChipProps {
    label: string;
}

const AiMemoryChip: React.FC<AiMemoryChipProps> = ({ label }) => (
    <div 
        className="flex items-center gap-1.5 mt-2 opacity-60 hover:opacity-100 transition-opacity select-none cursor-help bg-tertiary-container/20 px-3 py-1 rounded-full border border-tertiary/10" 
        title="Contesto utilizzato dall'AI"
        role="note"
        aria-label={`Contesto AI: ${label}`}
    >
        <span className="material-symbols-outlined text-[14px] text-tertiary font-bold animate-pulse">psychology</span>
        <span className="text-[10px] font-extrabold text-tertiary uppercase tracking-widest">{label}</span>
    </div>
);

export default AiMemoryChip;
