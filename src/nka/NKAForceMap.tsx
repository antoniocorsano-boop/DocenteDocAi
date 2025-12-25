// Force-directed neural map for NKA (SVG, animated, M3-compliant)
import * as React from 'react';
import { useRef } from 'react';
import { NKANode } from './types';
import { useNKAStore } from './useNKAStore';
import { getAINeuralLayout } from './aiLayout';
import { getLLMNeuralLayout } from './aiLayoutLLM';

interface NKAForceMapProps {
  nodes: readonly NKANode[];
  onNodeSelect: (node: NKANode) => void;
  width?: number;
  height?: number;
}



const NKAForceMap: React.FC<NKAForceMapProps> = ({ nodes, onNodeSelect, width = 340, height = 220 }: NKAForceMapProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [positions, setPositions] = React.useState<(NKANode & { x: number; y: number })[]>(getAINeuralLayout(nodes, width, height));
  const [loading, setLoading] = React.useState(false);
  const sound = useNKAStore((s) => s.settings.sound);

  React.useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getLLMNeuralLayout(nodes, width, height, {}).then(pos => {
      if (!cancelled) setPositions(pos);
    }).finally(() => {
      if (!cancelled) setLoading(false);
    });
    return () => { cancelled = true; };
    // eslint-disable-next-line
  }, [nodes, width, height]);

  // Respect reducedMotion: skip animation if true (placeholder)

  return (
    <svg ref={svgRef} width={width} height={height} className="nka-force-map" aria-label="Mappa neurale">
      {loading && (
        <text x={width/2} y={height/2} textAnchor="middle" fontSize="1.1rem" fill="var(--md-sys-color-on-surface-variant)">
          Calcolo disposizione AI…
        </text>
      )}
      {/* Render links/arcs (placeholder: none) */}
      {/* Render nodes */}
      {positions.map((node) => (
        <g
          key={node.id}
          tabIndex={0}
          role="button"
          aria-label={node.label}
          onClick={() => {
            if (sound) {
              // Optionally play a sound here for node focus/hover
            }
            onNodeSelect(node);
          }}
        >
          <circle
            cx={node.x}
            cy={node.y}
            r={32}
            fill={`var(--md-sys-color-primary${node.color})`}
            stroke="var(--md-sys-color-primary30)"
            strokeWidth={node.elevation}
            className={`nka-shape-${node.shape}`}
          />
          <text x={node.x} y={node.y + 4} textAnchor="middle" fontSize="1rem" fill="var(--md-sys-color-on-primary-container)">
            {node.label}
          </text>
        </g>
      ))}
    </svg>
  );
};

export default NKAForceMap;
