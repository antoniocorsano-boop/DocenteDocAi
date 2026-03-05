import React from 'react';
import { NKANode } from './types';
import { M3Typography } from '../components/ui/M3Typography';
import { M3Surface } from '../components/ui/M3Surface';
import { M3Button } from '../components/ui/M3Button';
import { M3Skeleton } from '../components/ui/M3Skeleton';

interface NKANodeCardProps {
  node?: NKANode;
  onSelect: () => void;
  loading?: boolean;
  error?: string;
}

function NKANodeCard({ node, onSelect, loading = false, error }: NKANodeCardProps): React.JSX.Element {
  if (loading) {
    return (
      <M3Surface
        variant="container"
        elevation={1}
        style={{
          borderRadius: 'var(--md-sys-shape-corner-large)',
          padding: 'var(--md-sys-spacing-4)',
          marginBottom: 'var(--md-sys-spacing-4)',
          minWidth: 220,
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--md-sys-spacing-2)',
        }}
        role="status"
        aria-label="Caricamento nodo NKA in corso"
      >
        <M3Skeleton variant="text" width="80%" height="24px" />
        <M3Skeleton variant="text" width="60%" height="16px" />
        <M3Surface style={{ display: 'flex', gap: 'var(--md-sys-spacing-2)', marginTop: 'var(--md-sys-spacing-2)' }}>
          <M3Skeleton variant="rectangular" width="80px" height="32px" />
          <M3Skeleton variant="rectangular" width="80px" height="32px" />
        </M3Surface>
      </M3Surface>
    );
  }

  if (error) {
    return (
      <M3Surface
        variant="container"
        elevation={1}
        style={{
          borderRadius: 'var(--md-sys-shape-corner-large)',
          padding: 'var(--md-sys-spacing-4)',
          marginBottom: 'var(--md-sys-spacing-4)',
          minWidth: 220,
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--md-sys-spacing-2)',
          alignItems: 'center',
        }}
        role="alert"
        aria-label={`Errore nel caricamento del nodo: ${error}`}
      >
        <M3Typography variant="title-medium" color="error">
          Errore
        </M3Typography>
        <M3Typography variant="body-small" color="error" style={{ textAlign: 'center' }}>
          {error}
        </M3Typography>
      </M3Surface>
    );
  }

  if (!node) {
    return (
      <M3Surface
        variant="container"
        elevation={1}
        style={{
          borderRadius: 'var(--md-sys-shape-corner-large)',
          padding: 'var(--md-sys-spacing-6)',
          marginBottom: 'var(--md-sys-spacing-4)',
          minWidth: 220,
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--md-sys-spacing-2)',
          alignItems: 'center',
        }}
        role="status"
        aria-label="Nessun nodo NKA disponibile"
      >
        <M3Typography variant="title-medium" color="on-surface-variant">
          Nessun nodo disponibile
        </M3Typography>
        <M3Typography variant="body-small" color="on-surface-variant" style={{ textAlign: 'center' }}>
          Non ci sono nodi NKA da visualizzare
        </M3Typography>
      </M3Surface>
    );
  }

  return (
    <M3Surface
      variant="container"
      elevation={1}
      interactive
      style={{
        borderRadius: 'var(--md-sys-shape-corner-large)',
        padding: 'var(--md-sys-spacing-4)',
        marginBottom: 'var(--md-sys-spacing-4)',
        minWidth: 220,
        outline: 'none',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--md-sys-spacing-2)',
      }}
      tabIndex={0}
      role="button"
      aria-label={`Nodo NKA: ${node.label}, profondità ${Math.round(node.depth * 100)}%`}
      aria-describedby={`nka-node-details-${node.id}`}
      onClick={onSelect}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          onSelect();
          e.preventDefault();
        }
      }}
    >
      <M3Typography variant="title-medium" color="on-surface">
        {node.label}
      </M3Typography>
      
      <M3Typography 
        variant="body-small" 
        color="on-surface-variant" 
        id={`nka-node-details-${node.id}`}
      >
        Profondità {Math.round(node.depth * 100)}%
      </M3Typography>

      {node.actions && node.actions.length > 0 && (
        <M3Surface 
          style={{ 
            display: 'flex', 
            gap: 'var(--md-sys-spacing-2)', 
            marginTop: 'var(--md-sys-spacing-2)',
            flexWrap: 'wrap'
          }}
          role="group"
          aria-label="Azioni disponibili per il nodo"
        >
          {node.actions.map((action: string, index: number) => (
            <M3Button
              key={action}
              variant="filled"
              size="small"
              tabIndex={0}
              aria-label={`Azione: ${action}`}
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              {action}
            </M3Button>
          ))}
        </M3Surface>
      )}
    </M3Surface>
  );
}

export default NKANodeCard;
