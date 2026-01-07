import React from 'react';
import { Uda } from '../types';

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
    return (
        <div
            role="button"
            tabIndex={0}
            aria-label={uda.title}
            onClick={onClick}
            className="gantt-bar"
            style={{
                left: `${uda.startPos}%`,
                width: `${uda.width}%`,
                backgroundColor: uda.color,
                borderColor: uda.borderColor,
                color: uda.textColor,
                cursor: 'pointer',
            }}
            title={`${uda.title} (${uda.startDate ? new Date(uda.startDate).toLocaleDateString() : ''} - ${uda.endDate ? new Date(uda.endDate).toLocaleDateString() : ''})`}
        >
            <div className="gantt-bar-inner truncate" style={{ padding: '6px 8px' }}>{uda.title}</div>
        </div>
    );
};

export default GanttBar;
