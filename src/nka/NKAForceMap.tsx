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



export function separatePositions<T extends { x: number; y: number }>(positions: T[], minDistance: number): T[] {
  // Simple iterative repulsion to resolve small overlaps
  const pts = positions.map(p => ({ ...p }));
  const maxIter = 100;
  for (let iter = 0; iter < maxIter; iter++) {
    let moved = false;
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const dx = pts[j].x - pts[i].x;
        const dy = pts[j].y - pts[i].y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 0.0001;
        if (dist < minDistance) {
          const overlap = (minDistance - dist) / 2;
          const nx = dx / dist;
          const ny = dy / dist;
          pts[i].x -= nx * overlap;
          pts[i].y -= ny * overlap;
          pts[j].x += nx * overlap;
          pts[j].y += ny * overlap;
          moved = true;
        }
      }
    }
    if (!moved) break;
  }
  return pts;
}

const NKAForceMap: React.FC<NKAForceMapProps> = ({ nodes, onNodeSelect, width = 340, height = 220 }: NKAForceMapProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const nodeRadius = Math.max(18, Math.min(32, Math.min(width, height) / 15));
  const [positions, setPositions] = React.useState<(NKANode & { x: number; y: number })[]>(
    separatePositions(getAINeuralLayout(nodes, width, height), nodeRadius * 2 + 8)
  );
  const [loading, setLoading] = React.useState(false);
  const sound = useNKAStore((s) => s.settings.sound);

  React.useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getLLMNeuralLayout(nodes, width, height, {}).then(pos => {
      if (!cancelled) {
        // Apply separation to avoid overlaps
        const separated = separatePositions(pos as any, nodeRadius * 2 + 8);
        setPositions(separated as any);
      }
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
