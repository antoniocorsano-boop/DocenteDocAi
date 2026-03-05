import React from 'react';
import NKAHeaderAuraButton from './NKAHeaderAuraButton';
import { useNKAStore } from './useNKAStore';
import M3Surface from '../components/ui/M3Surface';
import { M3Typography } from '../components/ui/M3Typography';

interface NKAHeaderIntegrationProps {
  onOpenNKA: () => void;
  onLongPressNKA: () => void;
}

const NKAHeaderIntegration: React.FC<NKAHeaderIntegrationProps> = ({
  onOpenNKA,
  onLongPressNKA
}) => {
  const { enabled, nodes } = useNKAStore();

  if (!enabled) {
    return null;
  }

  if (!nodes || nodes.length === 0) {
    return null;
  }

  const hasNewNode = nodes.some(node => node.isNew);

  return (
    <M3Surface
      style={{
        borderRadius: 'var(--md-sys-shape-corner-extra-small)',
        overflow: 'hidden'
      }}
      role="region"
      aria-label={`Integrazione NKA${hasNewNode ? ' - Nuovi elementi disponibili' : ''}`}
    >
      <NKAHeaderAuraButton
        hasNewNode={hasNewNode}
        onClick={onOpenNKA}
        onLongPress={onLongPressNKA}
      />
    </M3Surface>
  );
};

export default NKAHeaderIntegration;
