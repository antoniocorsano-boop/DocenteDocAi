import React, { useState } from 'react';
import { NKANode } from './types';
import { getInitialGameState, unlockNode, GameState } from './gameLogic';
import { playNkaSound } from './sound';
import { M3ProgressBar, M3Chip, M3ChipGroup, M3Button, M3ButtonGroup, M3Typography, M3Surface, M3CircularProgress } from '../components/ui';

interface GameModeProps {
  nodes?: readonly NKANode[];
}

const GameMode: React.FC<GameModeProps> = ({ nodes = [] as readonly NKANode[] }) => {
  const [state, setState] = useState<GameState>(() => getInitialGameState(nodes));
  const [isLoading, setIsLoading] = useState(false);
  
  const handleUnlock = async (nodeId: string) => {
    setIsLoading(true);
    try {
      setState(prev => {
        const next = unlockNode(prev, nodeId);
        if (next.unlocked.length > prev.unlocked.length) playNkaSound('badge');
        return next;
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <M3Surface
        elevation="level-1"
        shape="large"
        padding="4"
        role="region"
        aria-label="Caricamento modalità gioco"
      >
        <M3CircularProgress aria-label="Caricamento in corso" />
        <M3Typography variant="body-medium" color="on-surface">
          Elaborazione...
        </M3Typography>
      </M3Surface>
    );
  }

  if (nodes.length === 0) {
    return (
      <M3Surface
        elevation="level-1"
        shape="large"
        padding="4"
        role="region"
        aria-label="Nessun nodo disponibile"
      >
        <M3Typography variant="headline-small" color="on-surface">
          Nessun neurone disponibile
        </M3Typography>
        <M3Typography variant="body-medium" color="on-surface-variant">
          Carica dei nodi per iniziare la modalità gioco
        </M3Typography>
      </M3Surface>
    );
  }

  const availableNodes = nodes.filter(n => !state.unlocked.includes(n.id));

  return (
    <M3Surface
      elevation="level-1"
      shape="large"
      padding="4"
      role="region"
      aria-label="Modalità gioco NKA"
    >
      <M3Typography variant="headline-small" color="on-surface" gutterBottom>
        Modalità Gioco: Progresso
      </M3Typography>
      
      <M3ProgressBar
        value={state.progress}
        showValue={true}
        label="Progresso sblocco neuroni"
        aria-label={`Progresso: ${Math.round(state.progress)}% completato`}
      />
      
      {state.unlocked.length > 0 && (
        <M3Surface role="region" aria-label="Neuroni sbloccati">
          <M3Typography variant="title-small" color="on-surface" gutterBottom>
            Neuroni Sbloccati
          </M3Typography>
          <M3ChipGroup role="group" aria-label="Lista neuroni sbloccati">
            {state.unlocked.map((id, index) => (
              <M3Chip 
                key={id} 
                label={id} 
                variant="filled" 
                aria-label={`Neurone sbloccato: ${id}`}
                tabIndex={0}
              />
            ))}
          </M3ChipGroup>
        </M3Surface>
      )}
      
      {availableNodes.length > 0 && (
        <M3Surface role="region" aria-label="Neuroni da sbloccare">
          <M3Typography variant="title-small" color="on-surface" gutterBottom>
            Sblocca Neuroni
          </M3Typography>
          <M3ButtonGroup role="group" aria-label="Pulsanti per sbloccare neuroni">
            {availableNodes.map((n, index) => (
              <M3Button 
                key={n.id} 
                onClick={() => handleUnlock(n.id)} 
                variant="filled"
                aria-label={`Sblocca neurone ${n.label}`}
                tabIndex={0}
              >
                Sblocca {n.label}
              </M3Button>
            ))}
          </M3ButtonGroup>
        </M3Surface>
      )}
      
      {state.badges.length > 0 && (
        <M3Surface role="region" aria-label="Badge ottenuti">
          <M3Typography variant="title-small" color="on-surface" gutterBottom>
            Badge Ottenuti
          </M3Typography>
          <M3ChipGroup role="group" aria-label="Lista badge ottenuti">
            {state.badges.map((b, index) => (
              <M3Chip 
                key={b} 
                label={b} 
                variant="elevated"
                aria-label={`Badge ottenuto: ${b}`}
                tabIndex={0}
              />
            ))}
          </M3ChipGroup>
        </M3Surface>
      )}
    </M3Surface>
  );
};

export default GameMode;
