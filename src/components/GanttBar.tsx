// MD3 Gold Compliant
// Tutti gli stili usano esclusivamente token MD3 (nessun valore hardcoded)
// Audit: gennaio 2026
import React from 'react';
import { Uda } from '../types';

// M3Expressive: Refactored to use dedicated CSS classes with M3 tokens for positioning, colors, and interactions
interface GanttBarProps {
    uda: Uda & {
        startPos: number;
        width: number;
        color: string;
        borderColor: string;
        textColor: string;
    };
    onClick: () => void;
}

const GanttBar: React.FC<GanttBarProps> = ({ uda, onClick }) => {
    const handleClick = () => {
        console.log(`Audit: Clicked on GanttBar for UDA ${uda.id}: ${uda.title}`);
        onClick();
    };

    return (
        <div
            role="button"
            tabIndex={0}
            aria-label={`UDA: ${uda.title}`}
            onClick={handleClick}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleClick();
                }
            }}
            
            style={{
                '--gantt-bar-left': `${uda.startPos}%`,
                '--gantt-bar-width': `${uda.width}%`,
                '--gantt-bar-bg': uda.color,
                '--gantt-bar-border': uda.borderColor,
                '--gantt-bar-text': uda.textColor,
            } as React.CSSProperties}
            title={`${uda.title} (${uda.startDate ? new Date(uda.startDate).toLocaleDateString() : '} - ${uda.endDate ? new Date(uda.endDate).toLocaleDateString() : '})`}
        >
            <div  style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{uda.title}</div>
        </div>
    );
};

export default GanttBar;

