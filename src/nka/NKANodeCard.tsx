// Card for a single NKA node (M3 Card, shape override)

import React from 'react';
import { NKANode } from './types';
import { M3Typography } from '../components/ui/M3Typography';

interface NKANodeCardProps {
  node: NKANode;
  onSelect: () => void;
}

function NKANodeCard({ node, onSelect }: NKANodeCardProps): React.JSX.Element {
  return (
    <div
      style={{
        background: 'var(--md-sys-color-surface-container)',
        boxShadow: 'var(--md-sys-elevation1)',
        borderRadius: 'var(--md-sys-shape-corner-large)',
        padding: 'var(--md-sys-spacing-4)',
        marginBottom: 'var(--md-sys-spacing-4)',
        minWidth: 220,
        outline: 'none',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--md-sys-spacing-2)',
        transition: 'box-shadow var(--md-sys-motion-duration-medium) var(--md-sys-motion-easing-standard)',
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
      <M3Typography variant="title-medium" style={{ color: 'var(--md-sys-color-on-surface)' }}>{node.label}</M3Typography>
      <M3Typography variant="body-small" style={{ color: 'var(--md-sys-color-on-surface-variant)' }} id={`nka-node-depth-${node.id}`}>
        Profondità {Math.round(node.depth * 100)}%
      </M3Typography>
      <div style={{ display: 'flex', gap: 'var(--md-sys-spacing-2)', marginTop: 'var(--md-sys-spacing-2)' }}>
        {node.actions.map((action: string) => (
          <button
            key={action}
            tabIndex={0}
            aria-label={action}
            style={{
              background: 'var(--md-sys-color-primary)',
              color: 'var(--md-sys-color-on-primary)',
              border: 'none',
              borderRadius: 'var(--md-sys-shape-corner-small)',
              padding: 'var(--md-sys-spacing-2) var(--md-sys-spacing-4)',
              font: 'inherit',
              cursor: 'pointer',
              boxShadow: 'var(--md-sys-elevation0)',
              transition: 'background var(--md-sys-motion-duration-medium)',
            }}
          >
            <M3Typography variant="label-large">{action}</M3Typography>
          </button>
        ))}
      </div>
    </div>
  );
}

export default NKANodeCard;


