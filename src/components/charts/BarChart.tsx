// LEGACY - MD3 Non-compliant

import React, { useState } from 'react';

const LABEL_SPACE = 80; // Space reserved for labels in pixels

interface ChartData {
  label: string;
  value: number;
}

interface BarChartProps {
  data: ChartData[];
  color: string;
  horizontal?: boolean;
}

const BarChart: React.FC<BarChartProps> = ({ data, color, horizontal = false }) => {
  const [tooltip, setTooltip] = useState<{ content: string; x: number; y: number } | null>(null);

  const maxValue = Math.max(...data.map(d => d.value), 1);
  const chartHeight = 250;
  const chartWidth = 500;
  const barMargin = 5;
  const barWidth = (chartWidth / data.length) - barMargin;

  const handleMouseOver = (e: React.MouseEvent, d: ChartData) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltip({
      content: `${d.label}: ${d.value}`,
      x: rect.left + rect.width / 2,
      y: rect.top - 10,
    });
  };

  const handleMouseOut = () => {
    setTooltip(null);
  };
  
  const renderVertical = () => (
    <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} preserveAspectRatio="xMidYMid meet">
      {data.map((d, i) => {
        const barHeight = (d.value / maxValue) * chartHeight;
        return (
          <g key={d.label}>
                <path
                  d={`M ${i * (barWidth + barMargin)} ${chartHeight - barHeight} h ${barWidth} v ${barHeight} h -${barWidth} Z`}
                  fill={color}
                  onMouseMove={(e) => handleMouseOver(e, d)}
                  onMouseLeave={handleMouseOut}
                />
            <text
              x={i * (barWidth + barMargin) + barWidth / 2}
              y={chartHeight - 5}
              textAnchor="middle"
              fontSize="var(--app-text-body)"
              fill="var(--md-sys-color-onSurface-variant)"
              
            >
              {d.label}
            </text>
          </g>
        );
      })}
    </svg>
  );

  const renderHorizontal = () => {
    const rowHeight = (chartHeight / data.length);
    const barHeight = rowHeight * 0.7;
    return (
        <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} preserveAspectRatio="xMidYMid meet">
            {data.map((d, i) => {
                const yPos = i * rowHeight;
                const barLength = (d.value / maxValue) * (chartWidth - LABEL_SPACE); // LABEL_SPACE for labels
                return (
                    <g key={d.label}>
                         <text
                            x={0}
                            y={yPos + rowHeight / 2}
                            dominantBaseline="middle"
                            fontSize="var(--app-text-body)"
                            fill="var(--md-sys-color-onSurface-variant)"
                            
                        >
                            {d.label}
                        </text>
                        <path
                          d={`${'M'} ${80} ${yPos + (rowHeight - barHeight) / 2} h ${barLength} v ${barHeight} h -${barLength} Z`}
                          fill={color}
                          onMouseMove={(e) => handleMouseOver(e, d)}
                          onMouseLeave={handleMouseOut}
                        />
                        <text
                             x={85 + barLength}
                             y={yPos + rowHeight / 2}
                             dominantBaseline="middle"
                             fontSize="var(--app-text-body)"
                             fill="var(--md-sys-color-onSurface)"
                             fontWeight="bold"
                             
                        >
                            {d.value}
                        </text>
                    </g>
                );
            })}
        </svg>
    )
  };

  return (
    <div style={{ position: 'relative' }}>
      {horizontal ? renderHorizontal() : renderVertical()}
      {tooltip && (
        <div
          
          style={{
            left: `${tooltip.x}px`,
            top: `${tooltip.y}px`,
            transform: 'translateX(-50%) translateY(-100%)',
            opacity: 1,
          }}
        >
          {tooltip.content}
        </div>
      )}
    </div>
  );
};

export default BarChart;








