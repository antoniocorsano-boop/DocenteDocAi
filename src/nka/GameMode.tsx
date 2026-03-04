// Modalità "gioco" per NKA: sblocca neuroni, badge, progressi visivi/sonori
import React, { useState } from 'react';
import { NKANode } from './types';
import { getInitialGameState, unlockNode, GameState } from './gameLogic';
import { playNkaSound } from './sound';
import { M3ProgressBar, M3Chip, M3ChipGroup, M3Button, M3ButtonGroup } from '../components/ui';

interface GameModeProps {
  nodes?: readonly NKANode[];
}

const GameMode: React.FC<GameModeProps> = ({ nodes = [] as readonly NKANode[] }) => {
  const [state, setState] = useState<GameState>(() => getInitialGameState(nodes));
  const handleUnlock = (nodeId: string) => {
    setState(prev => {
      const next = unlockNode(prev, nodeId);
      if (next.unlocked.length > prev.unlocked.length) playNkaSound('badge');
      return next;
    });
  };
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--md-sys-spacing-4)',
        padding: 'var(--md-sys-spacing-4)',
        backgroundColor: 'var(--md-sys-color-surface)',
        borderRadius: 'var(--md-sys-shape-corner-large)',
        boxShadow: 'var(--md-sys-elevation-level-1)'
      }}
    >
      <h3
        style={{
          fontFamily: 'var(--font-family)',
          fontSize: 'var(--md-sys-typescale-headline-small-font-size)',
          fontWeight: 'var(--md-sys-typescale-headline-small-font-weight)',
          lineHeight: 'var(--md-sys-typescale-headline-small-line-height)',
          letterSpacing: 'var(--md-sys-typescale-headline-small-tracking)',
          color: 'var(--md-sys-color-on-surface)',
          margin: 0
        }}
      >
        Modalità Gioco: Progresso
      </h3>
      <M3ProgressBar
        value={state.progress}
        showValue={true}
        label="Progresso sblocco neuroni"
      />
      <M3ChipGroup>
        {state.unlocked.map(id => (
          <M3Chip key={id} label={id} variant="filled" />
        ))}
      </M3ChipGroup>
      <M3ButtonGroup>
        {nodes.filter(n => !state.unlocked.includes(n.id)).map(n => (
          <M3Button key={n.id} onClick={() => handleUnlock(n.id)} variant="filled">
            Sblocca {n.label}
          </M3Button>
        ))}
      </M3ButtonGroup>
      <M3ChipGroup>
        {state.badges.map(b => (
          <M3Chip key={b} label={b} variant="elevated" />
        ))}
      </M3ChipGroup>
    </div>
  );
};

export default GameMode;

