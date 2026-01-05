/* eslint-disable react/react-in-jsx-scope */
// Card for a single NKA node (M3 Card, shape override)
import React from 'react';
import { NKANode } from './types';

interface NKANodeCardProps {
  node: NKANode;
  onSelect: () => void;
}

const NKANodeCard: React.FC<NKANodeCardProps> = ({ node, onSelect }: NKANodeCardProps): React.ReactElement => {
  return (
    <div
      className={`nka-node-card nka-shape-${node.shape}`}
      style={{
        background: `var(--md-sys-color-primary${node.color})`,
        boxShadow: `var(--md-sys-elevation${node.elevation})`,
      }}
      tabIndex={0}
      role="button"
      aria-label={node.label}
      aria-describedby={`nka-node-depth-${node.id}`}
      onClick={onSelect}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          onSelect();
          e.preventDefault();
        }
      }}
    >
      <div className="nka-node-label">{node.label}</div>
      <div className="nka-node-depth" id={`nka-node-depth-${node.id}`}>Profondità {Math.round(node.depth * 100)}%</div>
      <div className="nka-node-actions">
        {node.actions.map((action: string) => (
          <button key={action} className="nka-action-btn" tabIndex={0} aria-label={action}>{action}</button>
        ))}
      </div>
    </div>
  );
};

export default NKANodeCard;
